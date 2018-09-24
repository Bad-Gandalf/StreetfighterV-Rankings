const StreetFighterApi = function() {
 // Await loading of csv file with data and then begin to make the graphs
 this.init = function() {
  queue()
   .defer(d3.csv, "/data/StreetfighterVrankings.csv")
   .await(this.makeGraphs);
 };

 this.makeGraphs = function(error, data) {
  var ndx = crossfilter(data);

  //Data Parsing
  data.forEach(function(d) {
   d["Lifetime Score"] = +d["Lifetime Score"];
   d.Tournaments = +d.Tournaments;
   d["Lifetime Tournaments"] = +d["Lifetime Tournaments"];
   d["Actual Score"] = +d["Actual Score"];
   d["Trending Score"] = +d["Trending Score"];

   //Data Cleansing i.e. Players with no team will be counted as "Independant"      
   d.Rank = +d.Rank;
   if (d.Team == "") {
    d.Team = "Independant";
   }
   else {
    return d.Team;
   }
  });
  console.log(data);

  // Building custom reducers to get correct averages.
  function add_item(p, v) {
   // For each different character/gender etc, count their occurences and total their 'Lifetime score'
   // Then find its average lifetime score. Return an object with count, total and average values.
   // i.e. Add a fact
   p.count++;
   p.total += v["Lifetime Score"];
   p.average = p.total / p.count;
   return p;
  }
  // Removes the fact thats been added previously
  function remove_item(p, v) {
   p.count--;
   if (p.count == 0) {
    p.total = 0;
    p.average = 0;
   }
   else {
    p.total -= v["Lifetime Score"];
    p.average = p.total / p.count;
   }
   return p;
  }
  // Sets the initial value.
  function initialise() {
   return { count: 0, total: 0, average: 0 };
  }


  // Actual Score versus Lifetime Rank Scatter Plot
  this.show_lifetime_rank_to_actual_scores_correlation = function(ndx) {
   // Choosing the colours each country that is represented in the chart.
   var countryColors = d3.scale.ordinal()
    .domain(["Japan", "United States", "Republic of Korea", "Taiwan", "United Kingdom", "France", "Singapore", "China", "Dominican Republic", "Belgium", "Norway"])
    .range(["black", "blue", "red", "yellow", "orange", "grey", "green", "pink", "purple", "brown", "light-blue"]);
   // Use "Rank" as the X-axis and select other values to be associated with it.
   var rDim = ndx.dimension(dc.pluck("Rank"));
   var rankDim = ndx.dimension(function(d) {
    return [d.Rank, d["Actual Score"], d.Name, d.Country, d.Character];
   });
   // Group these details by the the rank/ individual
   var actualScoresDim = rankDim.group();
   // Find the top and bottom rank figures in order to help declare a range for the x-axis
   var minRank = rDim.bottom(1)[0].Rank;
   var maxRank = rDim.top(1)[0].Rank;

   // Plot a scatter graph
   dc.scatterPlot("#Lifetime-rank-to-actual-score")
    .width(1000)
    .height(300)
    .x(d3.scale.linear().domain([minRank, maxRank])) // x-axis scale depending upon min and max rank declared earlier
    .brushOn(false)
    .symbolSize(8)
    .clipPadding(10)
    .xAxisLabel("Lifetime Rank")
    .yAxisLabel("Actual Score")
    .title(function(d) {
     return d.key[2] + " has an actual score of " + d.key[1] + " and ranks #" + d.key[0] + ". Character: " + d.key[4];
    }) //Returns a description when a data-point on the graph is hovered over by user. Includes name, actual score, ranking and character. 
    .colorAccessor(function(d) {
     return d.key[3];
    }) // Player's country is returned to help choose correct colour of mark. 
    .colors(countryColors) // Colors used for countries are those declared earlier in countryColors
    .dimension(rankDim)
    .group(actualScoresDim)
    .margins({ top: 10, right: 10, bottom: 75, left: 70 });

  };

  //Pie Chart Participation By Country
  this.show_participation_by_country = function(ndx) {
   // use dc to pluck information regarding a particular country
   var country_dim = ndx.dimension(dc.pluck("Country"));
   // group the information in order to give each country a "Total Lifetime Score" by totalling each lifetime score associated with it.
   var total_lifetime_score = country_dim.group().reduceSum(dc.pluck("Lifetime Score"));

   dc.pieChart("#lifetime-score-by-country")
    .height(220)
    .radius(100)
    .transitionDuration(1500)
    .dimension(country_dim)
    .group(total_lifetime_score);

  };

  // Barchart for Lifetime scores by Character
  this.show_lifetime_scores_by_character = function(ndx) {
   //Pluck all the different characters from the data, i.e. Guile, Chun Li etc
   var character_dim = ndx.dimension(dc.pluck("Character"));
   //Total each character's lifetime score.
   var total_lifetime_score = character_dim.group().reduceSum(dc.pluck('Lifetime Score'));

   dc.barChart("#total-lifetime-score-by-character")
    .width(1000)
    .height(300)
    .margins({ top: 10, right: 50, bottom: 75, left: 75 })
    .dimension(character_dim)
    .group(total_lifetime_score)
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .xAxisLabel("Characters")
    .yAxisLabel("Lifetime Score")
    .yAxis().ticks(4);

  };
  // Barchart for Average Lifetime scores by Character
  this.show_average_lifetime_score_per_character = function(ndx) {
   // Pluck all the different characters from the data, i.e. Guile, Chun Li etc
   var dim = ndx.dimension(dc.pluck('Character'));
   

   // Use custom reducers with reduce() method to group characters and find their averages.
   var averageLifetimeScoreByCharacter = dim.group().reduce(add_item, remove_item, initialise);

   dc.barChart("#average-lifetime_score_by-character")
    .width(1000)
    .height(300)
    .margins({ top: 10, right: 50, bottom: 75, left: 75 })
    .dimension(dim)
    .group(averageLifetimeScoreByCharacter)
    // Return average lifetime score for character when hovered over, to 2 d.p.
    .valueAccessor(function(d) {
     return d.value.average.toFixed(2);
    })
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .y(d3.scale.linear().domain([0, 170000]))
    .xAxisLabel("Character")
    .yAxisLabel("Average Lifetime Score")
    .yAxis().ticks(4);
  };

  // Bar Charts By Gender
  this.show_lifetime_scores_by_character_gender = function(ndx) {
   // Pluck gender from data, i.e. M/F
   var gender_dim = ndx.dimension(dc.pluck("Character Gender"));
   // Total Lifetime scores for M/F characters
   var total_lifetime_score = gender_dim.group().reduceSum(dc.pluck('Lifetime Score'));

   dc.barChart("#total-lifetime-score-by-character-gender")
    .width(300)
    .height(220)
    .margins({ top: 10, right: 50, bottom: 75, left: 75 })
    .dimension(gender_dim)
    .group(total_lifetime_score)
    .valueAccessor(function(d) {
     return d.value;
    })
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .elasticY(true)
    .xAxisLabel("Character Gender")
    .yAxisLabel("Total Lifetime Score")
    .yAxis().ticks(4);
  };

  this.show_average_lifetime_score_per_character_gender = function(ndx) {
   var dim = ndx.dimension(dc.pluck('Character Gender'));
   // Reduce method with custom reducers as arguments, will produce average lifetime score for M/F characters
   var averageLifetimeScoreByCharacterGender = dim.group().reduce(add_item, remove_item, initialise);

   dc.barChart("#average-lifetime_score_by-character-gender")
    .width(300)
    .height(220)
    .margins({ top: 10, right: 50, bottom: 75, left: 75 })
    .dimension(dim)
    .group(averageLifetimeScoreByCharacterGender)
    // Return average lifetime score for gender when hovered over, to 2 d.p.
    .valueAccessor(function(d) {
     return d.value.average.toFixed(2);
    }) 
    .transitionDuration(500)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .y(d3.scale.linear().domain([0, 120000]))
    .xAxisLabel("Character Gender")
    .yAxisLabel("Average Lifetime Score")
    .yAxis().ticks(4);
  };

// Call the functions declared earlier
  this.show_lifetime_scores_by_character(ndx);
  this.show_average_lifetime_score_per_character(ndx);
  this.show_participation_by_country(ndx);
  this.show_lifetime_rank_to_actual_scores_correlation(ndx);
  this.show_lifetime_scores_by_character_gender(ndx);
  this.show_average_lifetime_score_per_character_gender(ndx);

// Render all the charts
  dc.renderAll();
 };
};

P = new StreetFighterApi;

// Run Streetfighter Api 
P.init();

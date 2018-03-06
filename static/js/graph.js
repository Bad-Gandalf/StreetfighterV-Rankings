 queue()
     .defer(d3.csv, "/data/StreetfighterVrankings.csv")
     .await(makeGraphs);

 function makeGraphs(error, data) {
     var ndx = crossfilter(data);

     data.forEach(function(d) {
         d["Lifetime Score"] = +d["Lifetime Score"];
         d.Tournaments = +d.Tournaments;
         d["Lifetime Tournaments"] = +d["Lifetime Tournaments"];
         d["Actual Score"] = +d["Actual Score"];
         d["Trending Score"] = +d["Trending Score"];
         d.Rank = +d.Rank;
         if (d.Team ==""){
             d.Team = "Independant"
         } else {
             return d.Team;
         }


     });
     console.log(data);
     show_lifetime_scores_by_character(ndx);
     show_average_lifetime_score_per_character(ndx);
     show_participation_by_country(ndx);
     show_lifetime_rank_to_actual_scores_correlation(ndx);
     show_lifetime_scores_by_team(ndx);
     show_lifetime_scores_by_character_gender(ndx);
     show_average_lifetime_score_per_character_gender(ndx);
     
     dc.renderAll();
 }

 function show_lifetime_scores_by_character(ndx) {
     var character_dim = ndx.dimension(dc.pluck("Character"));
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



 }

 function show_average_lifetime_score_per_character(ndx) {
     var dim = ndx.dimension(dc.pluck('Character'));

     function add_item(p, v) {
         p.count++;
         p.total += v["Lifetime Score"];
         p.average = p.total / p.count;
         return p;
     }

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

     function initialise() {
         return { count: 0, total: 0, average: 0 };
     }

     var averageLifetimeScoreByCharacter = dim.group().reduce(add_item, remove_item, initialise);

     dc.barChart("#average-lifetime_score_by-character")
         .width(1000)
         .height(350)
         .margins({ top: 10, right: 50, bottom: 75, left: 75 })
         .dimension(dim)
         .group(averageLifetimeScoreByCharacter)
         .valueAccessor(function(d) {
             return d.value.average.toFixed(2);
         })
         .transitionDuration(500)
         .x(d3.scale.ordinal())
         .xUnits(dc.units.ordinal)
         .y(d3.scale.linear().domain([0, 150000]))
         .xAxisLabel("Character")
         .yAxisLabel("Average Lifetime Score")
         .yAxis().ticks(4);


 }

 function show_participation_by_country(ndx) {

     var country_dim = ndx.dimension(dc.pluck("Country"));
     var total_lifetime_tournaments = country_dim.group().reduceSum(dc.pluck("Lifetime Tournaments"));

     dc.pieChart("#participation-by-country")
         .height(500)
         .radius(200)
         .transitionDuration(1500)
         .dimension(country_dim)
         .group(total_lifetime_tournaments);

 }



 

 function show_lifetime_rank_to_actual_scores_correlation(ndx) {

     var countryColors = d3.scale.ordinal()
         .domain(["Japan", "United States", "Republic of Korea", "Taiwan", "United Kingdom", "France", "Singapore", "China", "Dominican Republic", "Belgium", "Norway"])
         .range(["black", "blue", "red", "yellow", "orange", "grey", "green", "pink", "purple", "brown", "light-blue"])

     var rDim = ndx.dimension(dc.pluck("Rank"));
     var rankDim = ndx.dimension(function(d) {
         return [d.Rank, d["Actual Score"], d.Name, d.Country, d.Character]
     });

     var actualScoresDim = rankDim.group();

     var minRank = rDim.bottom(1)[0].Rank;
     var maxRank = rDim.top(1)[0].Rank


     dc.scatterPlot("#Lifetime-rank-to-actual-score")
         .width(800)
         .height(400)
         .x(d3.scale.linear().domain([minRank, maxRank]))
         .brushOn(false)
         .symbolSize(8)
         .clipPadding(10)
         .xAxisLabel("Lifetime Rank")
         .yAxisLabel("Actual Score")
         .title(function(d) {
             return d.key[2] + " has an actual score of " + d.key[1] + " and ranks #" + d.key[0] +". Character: " + d.key[4];
         })
         .colorAccessor(function(d) {
             return d.key[3];
         })
         .colors(countryColors)
         .dimension(rankDim)
         .group(actualScoresDim)
         .margins({ top: 10, right: 50, bottom: 75, left: 75 });

 }

 function show_lifetime_scores_by_team(ndx) {
     var team_dim = ndx.dimension(dc.pluck("Team"));
     var total_lifetime_score = team_dim.group().reduceSum(dc.pluck('Lifetime Score'));

     dc.pieChart("#total-lifetime-score-by-team")
         .height(500)
         .radius(200)
         .transitionDuration(1500)
         .dimension(team_dim)
         .group(total_lifetime_score);
 }

 function show_lifetime_scores_by_character_gender(ndx) {
     var gender_dim = ndx.dimension(dc.pluck("Character Gender"));
     var total_lifetime_score = gender_dim.group().reduceSum(dc.pluck('Lifetime Score'));

     dc.barChart("#total-lifetime-score-by-character-gender")
         .width(400)
         .height(350)
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
 }
 
function show_average_lifetime_score_per_character_gender(ndx) {
     var dim = ndx.dimension(dc.pluck('Character Gender'));

     function add_item(p, v) {
         p.count++;
         p.total += v["Lifetime Score"];
         p.average = p.total / p.count;
         return p;
     }

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

     function initialise() {
         return { count: 0, total: 0, average: 0 };
     }

     var averageLifetimeScoreByCharacter = dim.group().reduce(add_item, remove_item, initialise);

     dc.barChart("#average-lifetime_score_by-character-gender")
         .width(400)
         .height(350)
         .margins({ top: 10, right: 50, bottom: 75, left: 75 })
         .dimension(dim)
         .group(averageLifetimeScoreByCharacter)
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
}

 /*.valueAccessor(function(d) {
             return d.value.average.toFixed(2);
         })
         .transitionDuration(500)
         .x(d3.scale.ordinal())
         .xUnits(dc.units.ordinal)
         .y(d3.scale.linear().domain([0, 150000]))
         .xAxisLabel("Character")
         .yAxisLabel("Average Lifetime Score")
         .yAxis().ticks(4);*/

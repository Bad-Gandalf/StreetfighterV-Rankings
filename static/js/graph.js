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

     });
    

     var character_dim = ndx.dimension(dc.pluck("Character"));
     var total_lifetime_score = character_dim.group().reduceSum(dc.pluck('Lifetime Score'));

     dc.barChart("#fighters-by-country")
         .width(800)
         .height(300)
         .margins({ top: 10, right: 50, bottom: 30, left: 50 })
         .dimension(character_dim)
         .group(total_lifetime_score)
         .transitionDuration(500)
         .x(d3.scale.ordinal())
         .xAxisLabel("Characters")
         .yAxis().ticks(4);
         
         dc.renderAll();

  console.log(data);
}
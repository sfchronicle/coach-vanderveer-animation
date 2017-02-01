require("./lib/social"); //Do not delete
var d3 = require('d3');

// colors for bubble graph
var margin = {
  top: 15,
  right: 15,
  bottom: 50,
  left: 80
};
var bar_spacing = 20;

if (screen.width > 768){//768) {
  console.log("everything else");
  var margin = {
    top: 15,
    right: 30,
    bottom: 80,
    left: 80
  };
  var width = 650 - margin.left - margin.right;
  var height = 450 - margin.top - margin.bottom;
} else if (screen.width <= 768 && screen.width > 480) {
  console.log("ipad");
  var margin = {
    top: 15,
    right: 30,
    bottom: 40,
    left: 60
  };
  var width = 650 - margin.left - margin.right;
  var height = 250 - margin.top - margin.bottom;
} else if (screen.width <= 480 && screen.width > 340) {
  console.log("big phone");
  var margin = {
    top: 15,
    right: 40,
    bottom: 35,
    left: 30
  };
  var width = 360 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;
} else if (screen.width <= 340) {
  console.log("mini iphone")
  var margin = {
    top: 15,
    right: 40,
    bottom: 35,
    left: 30
  };
  var width = 310 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;
}

// fills in HTML for year as years toggle
var updateInfo = function(season) {
  document.querySelector(".info").innerHTML = `<strong>${season}</strong>`;
};

var seasons = ["71-72","72-73","73-74","74-75","75-76","76-77","77-78","78-79","79-80","80-81","81-82","82-83","83-84","84-85","85-86","86-87","87-88","88-89","89-90","90-91","91-92","92-93","93-94","94-95","95-96","96-97","97-98","98-99","99-00","00-01","01-02","02-03","03-04","04-05","05-06","06-07","07-08","08-09","09-10","10-11","11-12","12-13","13-14","14-15","15-16","16-17"];
var i = 0;

var loop = null;
var tickTime = function() {
  drawBars(seasons[i]);
  updateInfo(seasons[i]);
  i = (i + 1) % seasons.length;
  loop = setTimeout(tickTime, i == 0 ? 10000 : 1000);
  // loop = setTimeout(tick, i == 0 ? 1700 : 1000);
};

tickTime();

// for debugging
// drawBars(seasons[0]);
// drawBars(seasons[42]);
// drawBars(seasons[43]);

var svg, x, y;

function drawBars(selectedSeason) {

  var barData = winsData.filter(function(data) { return data.Season == selectedSeason });
  var barDataWins = barData.slice();

  if (String(selectedSeason) == "71-72") {
	   d3.select("#win-chart").select("svg").remove();

     svg = d3.select("#win-chart").append('svg')
       .attr('width', width + margin.left + margin.right)
       .attr('height', height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  x = d3.scaleTime().range([0, width]);
     x = d3.scaleBand().rangeRound([0, width]).padding(0.02);
     y = d3.scaleLinear().rangeRound([height, 0]);

     // x-axis scale
    //  x.domain(d3.extent([parseMonth("January"),parseMonth("December")]));//.nice();
     x.domain(barData.map(function(d) { return d.Coach; }));
     y.domain([0, 1200]);

     // Add the X Axis
     if (screen.width <= 480) {
       svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)" )
     } else {
       svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "1.5em")
          .attr("dy", "1em")
          .attr("transform", "rotate(-20)" )
     }

   if (screen.width <= 480) {
     // Add the Y Axis
     svg.append("g")
         .call(d3.axisLeft(y))
         .append("text")
         .attr("class", "label")
         .attr("transform", "rotate(-90)")
         .attr("y", 0)
         .attr("x", -10)
         .attr("dy", "20px")
         .style("text-anchor", "end")
         .style("fill","black")
         .text("Wins");

   } else {
     // Add the Y Axis
     svg.append("g")
         .call(d3.axisLeft(y))
         .append("text")
         .attr("class", "label")
         .attr("transform", "rotate(-90)")
         .attr("y", -80)
         .attr("x", 0)
         .attr("dy", "20px")
         .style("text-anchor", "end")
         .style("fill","black")
         .text("Wins");
   }

   var line1000 = [
     {x: "Vivian Stringer", y: 1000},
     {x: "Geno Auriemma", y: 1000}
   ];

   // define the line
   var linefunc = d3.line()
       .x(function(d) {
         if (d.x == "Geno Auriemma") {
           return x(d.x)+4*bar_spacing;
         } else {
           return x(d.x)-3;
         }
       })
       .y(function(d) { return y(d.y)+0.5; });

   var path1000 = svg.append("path")
     .attr("d", linefunc(line1000))
     .attr("stroke", "#696969")
     .attr("stroke-width", "1")
     .attr("shape-rendering","crispEdges")
     .attr("fill", "none");

  }
  barData.forEach(function(d) {
      d.value = +(d.Wins);
  });
  svg.selectAll("bar")
      .data(barData)
    .enter().append("rect")
      .style("fill", function(d){
        if(d.value == 865) {
          return "red";
        } else {
          return "#6790B7";
        }
      })
      .attr("x", function(d) { return x(d.Coach); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        if (d.value == 865) {
          return y(948);
        } else {
          return y(d.value);
        }
      })
      .attr("height", 0)
      // .attr("opacity",0.2)
      // .attr("opacity",function(d,i) {
      //   return 0.3;//(0.15*(d.Year- +2010));
      // })
      .transition()
      .duration(200)
      .delay(function (d, i) {
        return i * 200;
      })
      .attr("height", function(d) {
        if (d.value == 865){
          return y(865) - y(948);
        } else {
          return height - y(d.value);
        }
      });

}

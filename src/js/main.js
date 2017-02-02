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
    bottom: 80,
    left: 60
  };
  var width = 650 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
} else if (screen.width <= 480 && screen.width > 340) {
  console.log("big phone");
  var margin = {
    top: 15,
    right: 60,
    bottom: 110,
    left: 70
  };
  var width = 360 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
} else if (screen.width <= 340) {
  console.log("mini iphone")
  var margin = {
    top: 15,
    right: 50,
    bottom: 110,
    left: 70
  };
  var width = 310 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;
}

// fills in HTML for year as years toggle
var updateInfo = function(season) {
  document.querySelector(".info").innerHTML = `<strong>${season}</strong>`;
};

var seasons = ["1971-72","1972-73","1973-74","1974-75","1975-76","1976-77","1977-78","1978-79","1979-80","1980-81","1981-82","1982-83","1983-84","1984-85","1985-86","1986-87","1987-88","1988-89","1989-90","1990-91","1991-92","1992-93","1993-94","1994-95","1995-96","1996-97","1997-98","1998-99","1999-00","2000-01","2001-02","2002-03","2003-04","2004-05","2005-06","2006-07","2007-08","2008-09","2009-10","2010-11","2011-12","2012-13","2013-14","2014-15","2015-16","2016-17"];
var i = 0;

var loop = null;
var tickTime = function() {
  drawBars(seasons[i]);
  updateInfo(seasons[i]);
  i = (i + 1) % seasons.length;
  loop = setTimeout(tickTime, i == 0 ? 10000 : 500);
  // loop = setTimeout(tick, i == 0 ? 1700 : 1000);
};

tickTime();

// for debugging
// drawBars(seasons[0]);
// // drawBars(seasons[42]);
// // drawBars(seasons[43]);
// drawBars(seasons[44]);
// drawBars(seasons[45]);

var svg, x, y;

function drawBars(selectedSeason) {

  var barData = winsData.filter(function(data) { return data.Season == selectedSeason });
  var barDataWins = barData.slice();

  if (String(selectedSeason) == "1971-72") {
	   d3.select("#win-chart").select("svg").remove();

     svg = d3.select("#win-chart").append('svg')
       .attr('width', width + margin.left + margin.right)
       .attr('height', height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //  x = d3.scaleTime().range([0, width]);
     x = d3.scaleBand().rangeRound([0, width]).padding(0.05);
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
          .attr("transform", "rotate(-55)" )
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
         .attr("y", -70)
         .attr("x", 0)
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
           if (screen.width <= 480) {
             return x(d.x)+2*bar_spacing;
           } else {
             return x(d.x)+4*bar_spacing+10;
           }
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
        if(d.value == 966 || d.value == 985 || d.value == 998) {
          return "red";
        } else {
          return "#6790B7";
        }
      })
      .attr("x", function(d) { return x(d.Coach); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) {
        if (d.value == 966) {
          return y(966);
        } else if (d.value == 985) {
          return y(985);
        } else if (d.value == 998) {
          return y(998);
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
      .duration(100)
      // .delay(function (d, i) {
      //   return i * 100;
      // })
      .attr("height", function(d) {
        if (d.value == 966){
          return y(865) - y(966);
        } else if (d.value == 985) {
          return y(884) - y(985);
        } else if (d.value == 998) {
          return y(897) - y(998);
        } else {
          return height - y(d.value);
        }
      });

}

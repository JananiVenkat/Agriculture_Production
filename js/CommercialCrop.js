// set the dimensions 
   var margin = {top: 30, right: 30, bottom: 600, left: 120},
    width = 1000 - margin.right - margin.left,
    height = 950 - margin.top - margin.bottom;

// Append svg and g
var svg=d3.select('body').append('svg')
          .attr({"width" : width + margin.right + margin.left,
              "height": height + margin.top + margin.bottom})
          .append('g')
          .attr("transform", "translate(" + margin.left + ',' + margin.top + ')');

// x and y Scale 
var xScale = d3.scale.ordinal()
          .rangeRoundBands([0, width],0.3);

var yScale = d3.scale.linear()
          .range([height, 0]);

// x and y Axis 
var xAxis = d3.svg.axis()
          .scale(xScale)
          .orient("bottom");

var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient("left");

// importing the JSON file 
d3.json("output/CommercialCropsData.json", function(error, data) {

  if(error) console.log("Error: data not loaded");  
  data.forEach(function(d){
    d["aggregateValue"]= +d["aggregateValue"];
    d.year=d.year;
    console.log(d["aggregateValue"]);
  });

  xScale.domain(data.map(function(d) { return d.year }));
  yScale.domain([0, d3.max(data, function(d) { return d["aggregateValue"]; })]);

   svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr("height",0)
    .attr("y",height)
    .transition().duration(2000)
    .delay(function (d,i){return i*200 ;})
    .attr({
    "x": function(d) { return xScale(d.year); },
    "y": function(d) { return yScale(d["aggregateValue"]); },
    "width": xScale.rangeBand(),
    "height": function(d) { return height - yScale(d["aggregateValue"]);}
    })
    .style("fill",'orange');

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".25em")
      .attr("transform", "rotate(-60)" );

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height + 75)
      .style("font-size","20px")
      .style("font-weight","bold")
      .text("Year");
      
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("x",-5)
      .attr("y",-150)
      .attr("dx","-7.5em")
      .attr("dy","4em")
      .attr("transform", "rotate(-90)" )
      .style("text-anchor","middle")
      .style("font-size","20px")
      .style("font-weight","bold")
      .text("Aggregate Value");
  
});

  


   
 
  

// Setting Margin 
   var margin = {top: 30, right: 30, bottom: 600, left: 50},
    width = 1000 - margin.right - margin.left,
    height = 950 - margin.top - margin.bottom;

// Append SVG and g 
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
    d.Year=d.Year;
    console.log(d["aggregateValue"]);
  });

  
  xScale.domain(data.map(function(d) { return d.Year }));
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
    "x": function(d) { return xScale(d.Year); },
    "y": function(d) { return yScale(d["aggregateValue"]); },
    "width": xScale.rangeBand(),
    "height": function(d) { return height - yScale(d["aggregateValue"]);}
    })
    .style("fill",'orange');

    svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(function(d){return d["aggregateValue"]; })
    .attr('x',function(d) {return xScale(d.Year)+xScale.rangeBand()/2;})
    .attr('y',function(d) {return yScale(d["aggregateValue"]); })
    .style("fill","white")
    .style("text-anchor","middle");

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .style('fill', '#ebebe0')
    .selectAll('text')
    .attr("transform", "rotate(-60)")
    .attr("dx","-.8em")
    .attr("dy", ".25em")
    .style("text-anchor","end")
    .style("font-size","12px");

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .style('fill', '#ebebe0')
    .style("font-size","15px");
});


   



  

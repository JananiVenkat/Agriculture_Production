// set the dimensons 
var margin = {top: 30, right:50, bottom: 630, left: 120},
    width = 1400 - margin.right - margin.left,
    height = 970 - margin.top - margin.bottom;
// Append svg and g
var svg=d3.select('body').append('svg')
          .attr({
            "width" : width + margin.right + margin.left,
              "height": height + margin.top + margin.bottom })
          .append('g')
          .attr("transform", "translate(" + margin.left + ',' + margin.top + ')');

// x and y Scale 
var xScale = d3.scale.ordinal()
          .rangeRoundBands([0, width], 0.1 , 0.1);

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
d3.json("output/OilseedsData.json", function(error, data) {

  if(error) console.log("Error: data not loaded");

  data.forEach(function(d){
    d.value= +d.value;
    d.Particulars=d.Particulars;
    console.log(d.value);
  });
  data.sort(function(a,b) {
    return b.value - a.value;
  });

  xScale.domain(data.map(function(d) { return d.Particulars; }));
  yScale.domain([0, d3.max(data, function(d) { return d.value; })]);


  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr("height",0)
    .attr("y",height)
    .transition().duration(2000)
    .delay(function (d,i){return i*200 ;})
    .attr({
    "x": function(d) { return xScale(d.Particulars); },
    "y": function(d) { return yScale(d.value); },
    "width": xScale.rangeBand(),
    "height": function(d) { return height - yScale(d.value);}
    })
    .style("fill",'#ff8533');

  //Aggregate Value
  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(function(d){return d.value; })
    .attr('x',function(d) {return xScale(d.Particulars)+xScale.rangeBand()/2;})
    .attr('y',function(d) {return yScale(d.value)-2; })
    .style("fill","black")
    .style("text-anchor","middle");

  //X- axis label
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .style('fill', 'black') 
    .selectAll('text')
    .attr("transform", "rotate(60)")   
    .attr("dx","1.3em")
    .attr("dy", ".25em")    
    .style("text-anchor","start")
    .style("font-size","15px");

  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 150)
    .style("font-size","20px")
    .style("font-weight","bold")
    .text("Oilseeds Type");
    
   //Y-axis label 
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .style('fill', 'black')
    .style("font-size","15px")
    .append("text")
    .attr("x",-30)
    .attr("y",-130)
    .attr("dx","-7.5em")
    .attr("dy","4em")
    .style("text-anchor","middle")
    .style("font-size","20px")
    .attr("transform","rotate(-90)")
    .style("font-weight","bold")
    .text("Production");
});
// Setting Margin 
var margin = {top: 30, right: 0, bottom: 630, left: 120},
    width = 1400 - margin.right - margin.left,
    height = 970 - margin.top - margin.bottom;

// SVG and g 
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
d3.json("output/OilseedData.json", function(error, data) {

  if(error) console.log("Error: data not loaded");

  data.forEach(function(d){
    d["3-2013"]= +d["3-2013"];
    d.Particulars=d.Particulars;
    console.log(d["3-2013"]);
  });

  data.sort(function(a,b) {
    return b["3-2013"] - a["3-2013"];
  });

  xScale.domain(data.map(function(d) { return d.Particulars; }));
  yScale.domain([0, d3.max(data, function(d) { return d["3-2013"]; })]);


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
    "y": function(d) { return yScale(d["3-2013"]); },
    "width": xScale.rangeBand(),
    "height": function(d) { return height - yScale(d["3-2013"]);}
    })
    .style("fill",'#ffdd99');

    svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(function(d){return d["3-2013"]; })
    .attr('x',function(d) {return xScale(d.Particulars)+xScale.rangeBand()/2;})
    .attr('y',function(d) {return yScale(d["3-2013"])-2; })
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
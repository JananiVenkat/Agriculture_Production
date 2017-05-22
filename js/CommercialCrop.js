// set the dimensions 
  var margin = {top: 30, right: 30, bottom: 600, left: 120},
  width = 1000 - margin.right - margin.left,
  height = 950 - margin.top - margin.bottom;

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

  var tip = d3.tip()
  .attr('class', 'tooltip')
  .offset([-10, 0])
  .html(function(d) {
    return " <span style='color:red'>" + d.aggregateValue + "</span>";
  })

// Append svg and g
  var svg=d3.select('body').append('svg')
            .attr({"width" : width + margin.right + margin.left,
                "height": height + margin.top + margin.bottom})
            .append('g')
            .attr("transform", "translate(" + margin.left + ',' + margin.top + ')');
    svg.call(tip);
        


// importing the JSON file 
d3.json("output/CommercialCropsData.json", function(error, data) {

  if(error) console.log("Error: data not loaded");  
  data.forEach(function(d){
    d["aggregateValue"]= +d["aggregateValue"];
    d.year=d.year;
  
  });

  xScale.domain(data.map(function(d) { return d.year }));
  yScale.domain([0, d3.max(data, function(d) { return d["aggregateValue"]; })]);
    
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(d.year); })
      .attr("width", xScale.rangeBand())
      .attr("y", function(d) { return yScale(d.aggregateValue); })
      .attr("height", function(d) { return height - yScale(d.aggregateValue); })      
      .on('mousemove', tip.show)
      .on('mouseout', tip.hide)
      .style("fill",'orange')
      .transition().duration(2000)
      .delay(function (d,i){return i*200 ;});   
   
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


  


   
 
  

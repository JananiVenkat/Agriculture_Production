 // set the dimensions 
var margin={top:80, bottom:100, left:150, right:90},
  width=1400-margin.left-margin.right,
  height=600-margin.top-margin.bottom;

  // Append svg and g
var svg=d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x and y Scale 
  var xScale=d3.scale.ordinal().rangeRoundBands([0,width],0.12),
      yScale=d3.scale.linear().rangeRound([height,0]);
  var color = d3.scale.category10();

  // x and y Axis 
  var xAxis=d3.svg.axis()
      .scale(xScale)
      .orient("bottom");
  var yAxis=d3.svg.axis()
      .scale(yScale)
      .orient("left");

    // importing the JSON file 
  
  d3.json("output/StateRiceProductionData.json",function(err,data){
  data.forEach(function(d){
      d.year=d["year"];
      d.Andhra_Pradesh=d["Andhra Pradesh"];
      d.Karnataka=d["Karnataka"];
      d.Kerala = d["Kerala"];
      d.Tamil_Nadu=d["Tamil Nadu"];
  });
  var xData=["Andhra_Pradesh","Karnataka","Kerala","Tamil Nadu"];
  var dataIntermediate = xData.map(function (c) {
        return data.map(function (d) {
            return {x: d.year, y: d[c]};
        });
    });
  var dataStackLayout = d3.layout.stack()(dataIntermediate);
  xScale.domain(dataStackLayout[0].map(function (d) { return d.x;  }));
  yScale.domain([0,d3.max(dataStackLayout[dataStackLayout.length - 1],
                    function (d) { return d.y0 + d.y;})]).nice();
  var layer = svg.selectAll(".stack")
          .data(dataStackLayout)
          .enter().append("g")
          .attr("class", "stack")
          .style("fill", function (d, i) { return color(i);  });
      layer.selectAll("rect")
          .data(function (d) { return d; })
          .enter().append("rect")
          .attr("x", function (d) {
              return xScale(d.x);
            })
            .attr("y", function (d) {
                return yScale(d.y + d.y0);
            })
            .attr("height", function (d) {
                return yScale(d.y0) - yScale(d.y + d.y0); })
            .attr("width", xScale.rangeBand());

     // X-axis  label Part    
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(" + width + ",0)")
      .attr("dy","1.3em")
      .attr("dx","1.2em")
      .style("font-size","20px")
      .style("font-weight","bold")
      .style("color","red")
      .text("year");

      // Y-axis label Part
  svg.append("g")
      .attr("class", "axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("dx","-10em")
      .attr("dy","-5em")
      .style("text-anchor", "middle")
      .style("font-size","20px")
      .style("font-weight","bold")
      .text("Southern States");

      // Legend
      var legend = svg.selectAll(".legend")
       .data(color.domain().slice().reverse())
       .enter().append("g")
       .attr("class", "legend")
       .attr("transform", function(d, i) { return "translate(0," + i * 30 +  ")"; });

       //appending rect in legend
     legend.append("rect")
        .attr("x", width +5)
        .attr("y", -50)
        .attr("width", 25)
        .attr("height", 20)
        .style("fill", color);

        // appending text 
     legend.append("text")
        .attr("x", width +3)
        .attr("y", -40)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("fill","black")
        .text(function(d,i) { return xData[i]; });
  });




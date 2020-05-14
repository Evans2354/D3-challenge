//define svg area
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(Data) {
    //Parse Data as numbers
    Data.forEach(function(dataval) {
      dataval.healthcare = +dataval.healthcare;
      dataval.poverty = +dataval.poverty;
    });

    //Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8.1, d3.max(Data, d => d.healthcare )])
      .range([0, width]);
      

    var yLinearScale = d3.scaleLinear()
      .domain([4.006, d3.max(Data, d => d.poverty )])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty) )
    .attr("cy", d => yLinearScale(d.healthcare)+2)
    .attr("r", "11.8")
    .attr("fill", "steelblue")
    .attr("opacity", ".5")

    //add state abbr to circle// https://richardbrath.wordpress.com/2018/11/24/using-font-attributes-with-d3-js/
    chartGroup.select("g")
        .selectAll("circle")
        .data(Data)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty)+1)
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy",-414)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .style("font-family","Saira Black")
        .attr("stroke", "blue")
        .attr("stroke-width", "1.6")
       // .attr("fill", "blue"); 

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height/1.6))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top+30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });


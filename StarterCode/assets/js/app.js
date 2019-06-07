// @TODO: YOUR CODE HERE!
let svgWidth = 960;
let svgHeight = 500;

let margin = 
  {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our scatter chart, and shift the latter by left and top margins.
let svg = d3.select("#scatter")
  .append("div")
  .classed("chart", true);

let svgChart = svg.append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

let svgchartGroup = svgChart.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
d3.csv("./assets/data/data.csv").then(function(dataJournalism) 
  {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    dataJournalism.forEach(
      function(data) 
      {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
      });

    // Step 2: Create scale functions
    // ==============================
    let xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(dataJournalism, d => d.poverty)])
      .range([0, width]);

    let yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(dataJournalism, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    svgchartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

      svgchartGroup.append("g")
      .call(leftAxis);

    // Add axes labels
    let xaxisLabel = svgchartGroup
    .append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("class", "axisText")
    .text("Poverty (%)");

    let yaxisLabel = svgchartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Healthcare (%)");   
    


    // Step 5: Create Circles
    // ==============================
    let svgcirclesGroup = svgchartGroup
    .selectAll("circle")
    .data(dataJournalism)
    .enter()
    .append("circle")
    .style("fill", "rgb(12,240,233)")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10);

    // append text to circles
    let svgcirclesGroupText = svgchartGroup
    .selectAll(".stateText")
    .data(dataJournalism)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale((d.healthcare)))
    .text(d => d.abbr)
    .classed("stateText", true)
    .attr("font-size", "9.5px")
    .style("fill", "black");



    // Step 6: Initialize tool tip
    // ==============================
    let toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("background-color", "lightsteelblue")
      .html(function(d) 
      {
        return (`State: ${d.state} <br> Poverty: ${d.poverty}% <br> Healthcare: ${d.healthcare}%`);
      });
    


    // Step 7: Create tooltip in the chart
    // ==============================
    svgcirclesGroup.call(toolTip);



    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    svgcirclesGroup.on("mouseover", toolTip.show)
      // onmouseout event
      .on("mouseout", toolTip.hide);

  
  });
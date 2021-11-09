const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

d3.json(url).then((data) => {
  const dataset = data.data;
  const svgWidth = 800;
  const svgHeight = 600;
  const barWidth = svgWidth / dataset.length;
  const padding = 80;

  const xScale = d3
    .scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, svgWidth - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, svgHeight - 2 * padding]);

  const svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const chartTitle = svg
    .append("text")
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .attr("x", svgWidth / 2)
    .attr("y", padding)
    .text("United States GDP");

  const yAxisLabel = svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "middle")
    .attr("x", -300)
    .attr("y", 105)
    .attr("transform", "rotate(-90)")
    .text("Billions of Dollars");

  const tooltip = d3
    .select("#d3-container")
    .append("div")
    .attr("id", "tooltip")
    .style("z-index", "10")
    .style("position", "absolute")
    .style("width", "100%")
    .style("visibility", "hidden");

  const bars = svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", barWidth)
    .attr("height", (d) => yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => svgHeight - padding - yScale(d[1]))
    .on("mouseover", (event, d) => {
      tooltip.transition().style("visibility", "visible");
      tooltip.attr("data-date", d[0]);
      tooltip.html("<strong>" + d[0].slice(0, 4) + ": " + "</strong>" + d[1]);
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });

  // Convert date strings to numbers
  let datesArray = dataset.map((item) => {
    return new Date(item[0]);
  });

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, svgWidth - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([svgHeight - padding, padding]);

  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (svgHeight - padding) + ")")
    .call(xAxis);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
});

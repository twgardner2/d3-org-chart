import * as lib from "./lib.js";

// Read tree file
d3.json("./input/orgChartData_Ian_Sandy_only.json")
  .then(data => {
    return data.map(lib.map_parse_input_data);
  })
  .then(data => {
    console.log(data);
    return data;
  })
  .then(data => {
    const stratified_data = lib.stratify(data);
    console.log(stratified_data);
  });

drawOrgChart = data => {
  const svg = d3
    .select("#viz")
    .append("svg")
    .attr("width", lib.width + lib.margin.left + lib.margin.right)
    .attr("height", lib.height + lib.margin.bottom + lib.margin.top);

  const tree = d3
    .tree()
    .size([lib.width, lib.height * lib.treeHeightToSVGHeightRatio])
    // .nodeSize([50, 25]);
    .separation(d => lib.name_node_width * 0.6);
  var nodes = d3.hierarchy(data);
  root_node = tree(nodes);
  const g = svg
    .append("g")
    .attr("transform", `translate(${lib.margin.left}, ${lib.margin.top})`);
  const links = g
    .selectAll(".link")
    .data(nodes.descendants().slice(1))
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", lib.draw_link_paths);
  var nodes = g
    .selectAll(".node")
    .data(nodes.descendants(), d => d.name)
    .enter()
    .append("g")
    .attr("class", function(d) {
      return "node" + (d.children ? " node--internal" : " node--leaf");
    })
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  var rect_colors = ["black", "black", "black", "black"];
  nodes
    .append("rect")
    .attr("height", node_height)
    .attr("width", d => {
      const extent = d3.extent(d.leaves().map(d => d.x));
      return extent[1] - extent[0] + name_node_width;
    })
    .attr("fill", "#ffffff")
    .attr("stroke", d => {
      return rect_colors[d.depth];
    })
    .attr("transform", d => {
      const first_leaf_x = d.leaves()[0].x;
      return `translate(${-(d.x - first_leaf_x + name_node_width / 2)},0)`;
    })
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", "#efefef");
  nodes
    .append("text")
    .attr("dy", ".35em")
    .attr("x", d => 0)
    .attr("y", node_height / 2)
    .style("text-anchor", "middle")
    .text(d => d.data.data.name)
    .style("font-size", function(d) {
      return (
        Math.min(
          node_height - 10,
          ((name_node_width - 28) / (1.8 * this.getComputedTextLength())) * 20
        ) + "px"
      );
    });
};

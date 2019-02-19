import * as lib from './lib.js';

// Read data and parse
d3.json('./input/orgChartData_Ian_Sandy_only.json')
  .then(data => {
    return data.map(lib.map_parse_input_data);
  })
  // Log to console
  .then(data => {
    console.log(data);
    return data;
  })
  // Stratify
  .then(data => {
    const stratified_data = lib.stratify(data);
    console.log(stratified_data);
    return stratified_data;
  })
  // Pass to drawOrgChart
  .then(data => {
    drawOrgChart(data);
  });

// Draw function
const drawOrgChart = data => {
  // Append and size SVG canvas
  const svg = d3
    .select('#viz')
    .append('svg')
    .attr('width', lib.width + lib.margin.left + lib.margin.right)
    .attr('height', lib.height + lib.margin.bottom + lib.margin.top);
  // Define tree layout function
  const tree = d3.cluster().size([lib.width, lib.height]);
  //.separation(d => lib.name_node_width * 0.012);

  var nodes = tree(data);
  console.log(nodes);

  // Sort nodes
  // nodes
  //   .sum(function(d) {
  //     return d.value;
  //   })
  //   .sort(function(a, b) {
  //     return b.height - a.height; // || a.id.localeCompare(b.id);
  //   });

  // const root_node = tree(nodes);

  // Append group to hold org chart
  const g = svg
    .append('g')
    .attr('transform', `translate(${lib.margin.left}, ${lib.margin.top})`);

  // Append and draw links
  const links = g
    .selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('d', lib.draw_link_paths);

  // Define and append leaves
  var leafs = g
    .selectAll('.node')
    .data(nodes.descendants(), d => d.name)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });
  var rect_colors = ['black', 'black', 'black', 'black', 'black'];
  leafs
    .append('rect')
    .attr('height', lib.node_height)
    .attr('width', d => {
      const extent = d3.extent(d.leaves().map(d => d.x));
      return extent[1] - extent[0] + lib.name_node_width;
    })
    .attr('stroke', d => {
      return rect_colors[d.depth];
    })
    .attr('transform', d => {
      const first_leaf_x = d.leaves()[0].x;
      return `translate(${-(d.x - first_leaf_x + lib.name_node_width / 2)},0)`;
    })
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('fill', lib.summit_blue);
  // .attr('fill', '#efefef');
  leafs
    .append('text')
    .attr('dy', '.35em')
    .attr('x', d => 0)
    .attr('y', lib.node_height / 2)
    .style('text-anchor', 'middle')
    .text(d => d.data.name)
    .style('font-size', function(d) {
      return (
        Math.min(
          lib.node_height - 10,
          ((lib.name_node_width - 18) / (0.8 * this.getComputedTextLength())) *
            20
        ) + 'px'
      );
    });
};

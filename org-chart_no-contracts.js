import * as lib from './lib.js';

// Read data and parse
d3.json('./input/orgChartData_noContracts.json')
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
  // Create tree layout
  .then(data => {
    const nodes = lib.tree(data);
    console.log(nodes);
    return nodes;
  })
  // Pass to drawOrgChart
  .then(data => {
    drawOrgChart(data);
  });

// Draw function
const drawOrgChart = nodes => {
  // Append and size SVG canvas
  const svg = d3
    .select('#viz')
    .append('svg')
    .attr('width', lib.width + lib.margin.left + lib.margin.right)
    .attr('height', lib.height + lib.margin.bottom + lib.margin.top);

  // Define dropshadow filter
  const filter = svg
    .append('defs')
    .append('filter')
    .attr('id', 'f2')
    .attr('width', '150%')
    .attr('height', '150%');

  filter.append('feDropShadow');

  // Append group to hold org chart
  const g = svg
    .append('g')
    .attr('transform', `translate(${lib.margin.left}, ${lib.margin.top})`);

  // Append and draw links
  const links = g
    .selectAll('.link')
    .data(nodes.descendants().slice(1))
    // .data(data.descendants().slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('filter', 'url(#f2)')
    .attr('d', lib.draw_link_paths);

  // Define and append group for node rectangles and text
  var leafs = g
    .selectAll('.node')
    .data(nodes.descendants(), d => d.name)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  // Append node rectangles
  leafs
    .append('rect')
    .attr('height', lib.node_height)
    .attr('width', d => {
      const extent = d3.extent(d.leaves().map(d => d.x));
      return extent[1] - extent[0] + lib.name_node_width;
    })
    .attr('stroke', d => (d.data.horizontal ? 'red' : 'black'))
    .attr('stroke-width', d => (d.data.horizontal ? '2px' : '1px'))
    .attr('filter', 'url(#f2)')
    .attr('transform', d => {
      const first_leaf_x = d.leaves()[0].x;
      return `translate(${-(d.x - first_leaf_x + lib.name_node_width / 2)},0)`;
    })
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('fill', lib.summit_blue);

  // Append node text
  leafs
    .append('text')
    .attr('dy', '.35em')
    .attr('x', d => 0)
    .attr('y', lib.node_height / 2)
    .style('text-anchor', 'middle')
    .text(d => d.data.name)
    .style('font-weight', 'bold')
    .style('font-size', function(d) {
      return (
        Math.min(
          lib.node_height * 0.85,
          this.parentNode.children[0].getBBox().width /
            (this.getNumberOfChars() * 0.65)
        ) + 'px'
      );
    });
};

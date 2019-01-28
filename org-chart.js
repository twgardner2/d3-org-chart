// Sizing variables
const margin = { top: 50, right: 50, bottom: 90, left: 90 },
  width = 3000,
  height = 300,
  treeHeightToSVGHeightRatio = 0.55,
  node_height = 25,
  contract_node_width = 120;

const staffColorScale = d3
  .scaleOrdinal()
  .domain([
    'analyst',
    'senior_analyst',
    'consultant',
    'senior_consultant',
    'other'
  ])
  .range(['fuchsia', 'navy', 'green', 'olive', 'maroon']);

// .range(['#3dffff', '#ce1273', '#d85d00', '#92f442', '#eeff00']);

// Utility functions
function searchObj(obj, query) {
  for (var key in obj) {
    var value = obj[key];
    if (typeof value === 'object') {
      searchObj(value, query);
    }
    if (value === query) {
      return true;
    }
  }
  return false;
}

function findIndicesOfMatches(arrayOfObjects, query) {
  booleanArray = arrayOfObjects.map(el => {
    return searchObj(el, query);
  });
  const reducer = (accumulator, currentValue, index) => {
    return currentValue ? accumulator.concat(index) : accumulator;
  };
  return booleanArray.reduce(reducer, []);
}

// Read staff and tree files
Promise.all([
  d3.csv('./input/staff.csv', function(d) {
    return {
      name: `${d.first.trim()} ${d.last.trim()}`,
      directorate: d.directorate.trim(),
      title: d.title.trim(),
      level: d.level.trim()
    };
  }),
  d3.json('./input/orgChartData_Ian_Sandy_only.json', d => {
    return {
      contract: d.contract.trim(),
      manager: d.manager.trim(),
      staff: d.staff,
      amount: d.amount.trim()
    };
  })
])
  // Process resolved promises of the data
  .then(([staff, tree]) => {
    console.log('staff');
    console.log(staff);
    console.log('tree');
    console.log(tree);

    // Join tree and staff data
    const joinedData = tree.map(el => {
      if ('staff' in el) {
        newStaffArray = el.staff.map(s => {
          const staffIndex = findIndicesOfMatches(staff, s);
          return staff[staffIndex];
        });

        return { ...el, staff: newStaffArray };
      } else {
        return el;
      }
    });
    console.log('joinedData');
    console.log(joinedData);

    const joinedDataSortedStaff = joinedData.map(el => {
      if ('staff' in el) {
        const staff = el.staff;
        const sortedStaff = staff.sort(function(a, b) {
          const convertLevelToNumber = function(level) {
            if (level === 'analyst') return 3;
            if (level === 'senior_analyst') return 2;
            if (level === 'consultant') return 1;
            if (level === 'senior_consultant') return 0;
          };
          const aLevel = convertLevelToNumber(a.level);
          const bLevel = convertLevelToNumber(b.level);

          return aLevel - bLevel;
        });
        el.staff = sortedStaff;
        return el;
      } else {
        return el;
      }
    });

    drawOrgChart = data => {
      const svg = d3
        .select('#viz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.bottom + margin.top);

      const stratify = d3
        .stratify()
        .parentId(d => d.manager)
        .id(d => d.contract);
      const tree = d3
        .tree()
        .size([width, height * treeHeightToSVGHeightRatio])
        .separation(d => contract_node_width * 0.01);

      const dataStratified = stratify(data);

      var nodes = d3.hierarchy(dataStratified);

      root_node = tree(nodes);
      console.log(root_node);

      const g = svg
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const links = g
        .selectAll('.link')
        .data(nodes.descendants().slice(1))
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', function(d) {
          return (
            'M' +
            d.x +
            ',' +
            d.y +
            'C' +
            d.x +
            ',' +
            (d.y + d.parent.y) / 2 +
            ' ' +
            d.parent.x +
            ',' +
            (d.y + d.parent.y) / 2 +
            ' ' +
            d.parent.x +
            ',' +
            d.parent.y
          );
        });

      var nodes = g
        .selectAll('.node')
        .data(nodes.descendants(), d => d.contract)
        .enter()
        .append('g')
        .attr('class', function(d) {
          return 'node' + (d.children ? ' node--internal' : ' node--leaf');
        })
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });

      // var rect_colors = ['grey', 'blue', 'green', 'maroon'];
      var rect_colors = ['black', 'black', 'black', 'black'];

      nodes
        .append('rect')
        .attr('height', node_height)
        .attr('width', d => {
          const extent = d3.extent(d.leaves().map(d => d.x));
          return extent[1] - extent[0] + contract_node_width;
        })
        .attr('fill', '#ffffff')
        .attr('stroke', d => {
          return rect_colors[d.depth];
        })
        .attr('transform', d => {
          const first_leaf_x = d.leaves()[0].x;
          return `translate(${-(
            d.x -
            first_leaf_x +
            contract_node_width / 2
          )},0)`;
        })
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', '#efefef');

      nodes
        .append('text')
        .attr('dy', '.35em')
        .attr('x', d => 0)
        .attr('y', node_height / 2)
        .style('text-anchor', 'middle')
        .text(d => d.data.data.contract)
        .style('font-size', function(d) {
          return (
            Math.min(
              node_height - 10,
              ((contract_node_width - 28) /
                (1.8 * this.getComputedTextLength())) *
                20
            ) + 'px'
          );
        });

      console.log(nodes.data());

      // Render staff under each project node
      nodes.each(function(d, j) {
        if ('staff' in d.data.data && d.data.data.staff.length > 0) {
          const staff = d.data.data.staff;
          console.log(staff);

          // Create <g> inside the existing <g> for each project node
          const staffG = d3
            .select(this)
            .append('g')
            .attr('class', 'staffG');
          // Add rectangles for each staff
          staffG
            .selectAll('rect')
            .data(staff)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', (p, i) => 30 * (i + 1))
            .attr('height', node_height)
            .attr('width', contract_node_width)
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('transform', `translate(-${contract_node_width / 2},0)`)
            .attr('stroke', d => {
              return staffColorScale(d.level);
            })
            .attr('fill', '#efefef');
          // Add staff names
          staffG
            .selectAll('text')
            .data(staff)
            .enter()
            .append('text')
            .attr('dx', 0)
            .attr('dy', (p, i) => 32 * (i + 1) + node_height / 2)
            .style('text-anchor', 'middle')
            .text(d => d.name)
            .style('font-size', function(d) {
              return (
                Math.min(
                  node_height - 10,
                  ((contract_node_width - 28) /
                    (2 * this.getComputedTextLength())) *
                    25
                ) + 'px'
              );
            });
        }
      });
    };

    // document.addEventListener('DOMContentLoaded', function() {
    drawOrgChart(joinedData);

    // let rectangles = document.querySelectorAll('rect');
    // rectangles.forEach(rect => {
    //   rect.addEventListener('click', function() {
    //     alert(`${this.key}`);
    //   });
    // });
  });

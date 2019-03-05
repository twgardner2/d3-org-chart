'use strict';

// Sizing variables
export const margin = { top: 50, right: 50, bottom: 90, left: 90 },
  width = 1500,
  height = 300,
  treeHeightToSVGHeightRatio = 0.55,
  node_height = 25,
  name_node_width = 125;

// Colors
export const summit_blue = '#52B6E8';

// Color Scales
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

// Data input parsing function
export const map_parse_input_data = d => {
  return {
    manager: d.manager === null ? null : d.manager.trim(),
    name: d.name.trim(),
    horizontal: d.horizontal
  };
};

// Stratify function
export const stratify = d3
  .stratify()
  .parentId(d => d.manager)
  .id(d => d.name);

// Define tree layout function
export const tree = d3
  .cluster()
  .size([width, height])
  .separation(d => 1);

// ???
export function searchObj(obj, query) {
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

// Finds the indices of an array of objects that match a query
export function findIndicesOfMatches(arrayOfObjects, query) {
  booleanArray = arrayOfObjects.map(el => {
    return searchObj(el, query);
  });
  const reducer = (accumulator, currentValue, index) => {
    return currentValue ? accumulator.concat(index) : accumulator;
  };
  return booleanArray.reduce(reducer, []);
}

export const draw_link_paths = d => {
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
};

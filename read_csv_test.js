function searchObj(obj, query) {
  for (var key in obj) {
    var value = obj[key];
    if (typeof value === 'object') {
      searchObj(value, query);
    }
    if (value === query) {
      // console.log(`property= ${key}, value= ${value}`);
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

summitStaff = [
  { name: 'Joseph Bateman', directorate: 'FC' },
  { name: 'Tom Gardner', directorate: 'Horizontal' },
  { name: 'Tori Puryear', directorate: 'FC' },
  { name: 'David Kretch', directorate: 'Horizontal' },
  { name: 'Scott Senkier', directorate: 'Horizontal' },
  { name: 'Annie Perizzolo', directorate: 'FC' },
  { name: 'Adam Banker', directorate: 'Horizontal' }
];

// console.log(findIndicesOfMatches(summitStaff, 'Joseph Bateman'));

const contracts = [
  {
    contract: 'CDFI BGP',
    manager: 'Ian Weise',
    staff: ['Joseph Bateman', 'Tom Gardner'],
    amount: '1000000'
  },
  {
    contract: 'CDFI ARM',
    manager: 'Ian Weise',
    staff: ['Annie Perizzolo', 'Tom Gardner', 'Scott Senkier'],
    amount: '1000000'
  }
];

console.log(
  contracts.map(el => {
    newStaffArray = el.staff.map(s => {
      const staffIndex = findIndicesOfMatches(summitStaff, s);
      return summitStaff[staffIndex];
    });

    return { ...el, staff: newStaffArray };
  })
);

d3.csv('staff.csv', function(d) {
  return {
    name: `${d.first} ${d.last}`,
    directorate: d.directorate
  };
}).then(d => console.log(d));

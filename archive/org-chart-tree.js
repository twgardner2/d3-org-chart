{
  // const data = [
  //   {
  //     contract: 'SUMMIT',
  //     manager: null,
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Oswaldo Urdapilleta',
  //     manager: 'SUMMIT',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Frank Vetrano',
  //     manager: 'SUMMIT',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Gob Juntima',
  //     manager: 'SUMMIT',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Corey West',
  //     manager: 'SUMMIT',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Ian Weise',
  //     manager: 'Gob Juntima',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Scott Burroughs',
  //     manager: 'Gob Juntima',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Sandy Vicente',
  //     manager: 'Gob Juntima',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Heather Brostos',
  //     manager: 'Oswaldo Urdapilleta',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'Kaye Burton',
  //     manager: 'Corey West',
  //     engagement_lead: null,
  //     amount: null
  //   },
  //   {
  //     contract: 'CDFI BGP',
  //     manager: 'Ian Weise',
  //     engagement_lead: 'Joe Bateman',
  //     amount: '1000000'
  //   },
  //   {
  //     contract: 'CDFI ARM',
  //     manager: 'Ian Weise',
  //     engagement_lead: 'Annie Perizzolo',
  //     amount: '800000'
  //   },
  //   {
  //     contract: 'RMCAP',
  //     manager: 'Scott Burroughs',
  //     engagement_lead: 'Balint Peto',
  //     amount: '1000000'
  //   },
  //   {
  //     contract: 'EBSA',
  //     manager: 'Heather Brostos',
  //     engagement_lead: '',
  //     amount: '1000000'
  //   },
  //   {
  //     contract: 'Mint',
  //     manager: 'Sandy Vicente',
  //     engagement_lead: 'Joe Schmoe',
  //     amount: '3000000'
  //   },
  //   {
  //     contract: 'RMBS Cases',
  //     manager: 'Kaye Burton',
  //     engagement_lead: 'Joe Schmoe',
  //     amount: '3000000'
  //   }
  // ];
}
const root = [
  {
    contract: 'SUMMIT',
    manager: null,
    engagement_lead: null,
    amount: null
  }
];

const directors = [
  {
    contract: 'Oswaldo Urdapilleta',
    manager: 'SUMMIT',
    engagement_lead: null,
    amount: null
  },
  {
    contract: 'Frank Vetrano',
    manager: 'SUMMIT',
    engagement_lead: null,
    amount: null
  },
  {
    contract: 'Gob Juntima',
    manager: 'SUMMIT',
    engagement_lead: null,
    amount: null
  }
];

const managers = [
  {
    contract: 'Corey West',
    manager: 'SUMMIT',
    engagement_lead: null,
    amount: null
  },
  {
    contract: 'Ian Weise',
    manager: 'Gob Juntima',
    engagement_lead: null,
    amount: null
  },
  {
    contract: 'Scott Burroughs',
    manager: 'Gob Juntima',
    engagement_lead: null,
    amount: null
  },
  {
    contract: 'Sandy Vicente',
    manager: 'Gob Juntima',
    engagement_lead: null,
    amount: null
  },
  {
    contract: 'Heather Brostos',
    manager: 'Oswaldo Urdapilleta',
    engagement_lead: null,
    amount: null
  },
  {
    contract: 'Kaye Burton',
    manager: 'Corey West',
    engagement_lead: null,
    amount: null
  }
];

const contracts = [
  {
    contract: 'CDFI BGP',
    manager: 'Ian Weise',
    engagement_lead: 'Joe Bateman',
    amount: '1000000'
  },
  {
    contract: 'CDFI ARM',
    manager: 'Ian Weise',
    engagement_lead: 'Annie Perizzolo',
    amount: '800000'
  },
  {
    contract: 'EPA - WIFIA',
    manager: 'Ian Weise',
    engagement_lead: 'Sam Seong',
    amount: '800000'
  },
  {
    contract: 'EPA - USACE',
    manager: 'Ian Weise',
    engagement_lead: 'Sam Seong',
    amount: '800000'
  },
  {
    contract: 'RMCAP',
    manager: 'Scott Burroughs',
    engagement_lead: 'Balint Peto',
    amount: '1000000'
  },
  {
    contract: 'EBSA',
    manager: 'Heather Brostos',
    engagement_lead: '',
    amount: '1000000'
  },
  {
    contract: 'Mint',
    manager: 'Sandy Vicente',
    engagement_lead: 'Joe Schmoe',
    amount: '3000000'
  },
  {
    contract: 'RMBS Cases',
    manager: 'Kaye Burton',
    engagement_lead: 'Joe Schmoe',
    amount: '3000000'
  },
  {
    contract: 'BestEx',
    manager: 'Scott Burroughs',
    engagement_lead: 'Joe Schmoe',
    amount: '3000000'
  },
  {
    contract: 'Harry Potter',
    manager: 'Kaye Burton',
    engagement_lead: 'Joe Schmoe',
    amount: '3000000'
  }
];

const data = root
  .concat(directors)
  .concat(managers)
  .concat(contracts);

document.addEventListener('DOMContentLoaded', function() {
  const margin = { top: 50, right: 50, bottom: 90, left: 90 },
    rootname = 'TOP',
    format = ',d',
    title = '',
    width = 1000,
    height = 500;

  const svg = d3
    .select('#viz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.bottom + margin.top);

  const managers = [];
  data.map(data => {
    if (!managers.includes(data.manager)) managers.push(data.manager);
  });
  console.log(managers);

  const stratify = d3
    .stratify()
    .parentId(d => d.manager)
    .id(d => d.contract);

  const treeData = stratify(data);

  const tree = d3.tree().size([width, height]);

  var nodes = d3.hierarchy(treeData);

  nodes = tree(nodes);

  console.log(nodes);

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

  const getOnlyChildren = descendants => {
    console.log(descendants);
    const onlyChildren = [];
    descendants.map(descendant => {
      if (descendant.children) onlyChildren.push(descendant);
    });
    return onlyChildren;
  };
  // console.log(getOnlyChildren(nodes.descendants()));
  var node = g
    .selectAll('.node')
    .data(nodes.descendants())
    .enter()
    .append('g')
    .attr('class', function(d) {
      return 'node' + (d.children ? ' node--internal' : ' node--leaf');
    })
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  node.append('circle').attr('r', 10);

  node
    .append('text')
    .attr('dy', '.35em')
    .attr('x', function(d) {
      return d.children ? -13 : 13;
    })
    .style('text-anchor', function(d) {
      return d.children ? 'end' : 'start';
    })
    .text(function(d) {
      return d.data.data.contract;
    });
});

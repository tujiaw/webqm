const { Map, List } = require('immutable');
const parseString = require('xml2js').parseString;

const a = [
  1, 2, 324, 3, 4
]

a.splice(a.indexOf(32224), 1);

function xx() {
  const aa = 100;
  return aa > 10;
}

console.log(xx())

console.log(a);
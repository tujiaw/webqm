const { Map, List } = require('immutable');
const parseString = require('xml2js').parseString;

const a = [
  'Q测5',
  'xinxin01、小七',
  'tujiaw',
  'QMqbtest1',
  'aaaa',
  'jiawei02'
]

a.sort((a, b) => {
  return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
})

console.log(a);
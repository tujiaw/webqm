const { Map, List } = require('immutable');

let list = List([
  {'a': 1}, {'b': 2}, {'c': 3}
]);

list = list.update(2, val => {
  val.c = 4;
  return val;
});
list.map(item => {
  console.log(item);
})
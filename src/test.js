const { List } = require('immutable');

let list = List([1, 2, 30, 4, 5]);

list = list.push(6);

list = list.filterNot(item => {
  return item === 1
});
console.log(list);
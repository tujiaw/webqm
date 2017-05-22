const { Map, List } = require('immutable');

let totalArr = [], curArr = [];
curArr.push(1);
curArr.push(2);
curArr.push(3);
totalArr.push(curArr);
curArr = [];
curArr.push(4);
totalArr.push(curArr);
console.log(totalArr);
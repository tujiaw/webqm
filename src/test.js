const { Map, List } = require('immutable');
const parseString = require('xml2js').parseString;

const arr = [
  {
    name: ':/face/1.png',
    desc: '微笑',
  },
  {
    name: ':/face/2.png',
    desc: '难过',
  }
]

function matchAll(src, dst) {
  const result = [];
  let start = 0;
  const end = src.length;
  while (start < end) {
    const index = src.indexOf(dst, start);
    if (index >= 0) {
      result.push({
        start: index,
        end: index + dst.length
      })
    }
  }
}

const x = '[/微笑][/好的]第三方士大夫[/难过]对方水电费';

const result = [];
for (let i = 0, count = arr.length; i < count; i++) {
  const face = arr[i];
  
}

console.log(y);
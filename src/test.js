const { Map, List } = require('immutable');

const Hello = {
  name: 'tujiaw',
  handle: function() {
    console.log('name:' + this.name);
  }
}

function add(cb) {
  cb();
}

add(Hello.handle.bind(Hello));

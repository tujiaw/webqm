import ModelHeader from './model_header.js';

let s_data = [];
var RosterInfo = {
  header: ModelHeader,
  setData: function(data) {
    this.header.code = 0;
    this.header.error = '';
    s_data = data;
  },
  getData: function() {
    return s_data;
  },
  count: function() {
    return s_data.length;
  }
}

export default RosterInfo;
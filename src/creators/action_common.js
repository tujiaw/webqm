const ActionCommon = {
  auth: {},
  checkResCommonHeader: function (res) {
    if (!res) {
      return {
        code: 1,
        error: 'res is null'
      };
    } else if (!res.body) {
      return {
        code: 2,
        error: 'res body is null'
      };
    } else {
      return {
        code: res.code,
        error: res.error
      };
    }
  },
}

export default ActionCommon;
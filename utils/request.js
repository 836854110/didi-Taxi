import Mock from "./mock.js";
const defaultOption = {
  url: "",
  data: {},
  method: "GET",
  header: {
    "Content-Type": "application/json"
  },
  dataType: "json",
  isMock: false
};
const request = option => {
  const newOpt = Object.assign({}, defaultOption, option);
  const { url, data, method, header, dataType, isMock } = newOpt;
  return new Promise((resolve, reject) => {
    if (isMock) {
      let res = {
        success: true,
        data: Mock[url]
      };
      resolve(res);
      return;
    }
    wx.request({
      ...newOpt,
      success(res) {
        if (res.statusCode == 200) resolve(res.data);
      },
      fail(err) {
        reject(err);
      }
    });
  });
};

module.exports = request;

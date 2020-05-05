import request from "../../utils/request.js";

let app = getApp();

Page({
  data: {
    carData: [],
    currrent: 1,
  },

  onLoad: function (options) {
    this.getCartData();
  },

  //获取车的类别
  getCartData() {
    request({
      url: "carData",
      isMock: true,
    }).then((res) => {
      console.log(app.globalData);

      if (res.success) {
        this.setData({
          carData: res.data,
          currrent:
            (app.globalData.carItemData && app.globalData.carItemData.id) || 1,
        });
      }
    });
  },
  //点击跳转页面
  clickCart(e) {
    const car = e.currentTarget.dataset.cardata;
    app.globalData.carItemData = car;
    wx.reLaunch({
      url: "/pages/index/index",
    });
  },
});

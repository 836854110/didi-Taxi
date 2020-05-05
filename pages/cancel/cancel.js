// pages/cancel/cancel.js
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  toOrder() {
    wx.showModal({
      content: "确定要取消行程吗",
      cancelColor: "#cccccc",
      confirmColor: "#fc9c56",
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: "/pages/order/order",
          });
        } else if (res.cancel) {
          wx.redirectTo({
            url: "/pages/orderService/orderService",
          });
        }
      },
    });
  },
  backWait() {
    wx.redirectTo({
      url: "/pages/wait/wait",
    });
  },
});

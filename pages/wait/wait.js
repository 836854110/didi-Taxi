// pages/wait/wait.js
let app = getApp();
let globalData = app.globalData;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    maxTime: 60, //设置最大时间60s
    time: 0, //当前时间
    startData: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(globalData)
    this.setData({
      startData: globalData.startData,
    });
  },

  countInterval: function (options) {
    let randomTime = 20 * Math.random();
    let timer = setInterval(() => {
      let newCount = this.data.time;
      let stpe = ((newCount * 6 - 90) * Math.PI) / 180;
      newCount++;
      //等待超时
      if (newCount >= this.data.maxTime) {
        //跳转首页
        wx.redirectTo({
          url: "/pages/index/index",
        });
        clearTimeout(timer);
      } else if (this.data.time > randomTime) {
        wx.redirectTo({
          url: "/pages/orderService/orderService",
        });
        clearTimeout(timer);
      } else {
      }
      this.drawProgress(stpe);
      this.setData({
        time: newCount,
      });
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.countInterval();
    this.drawProgressBg();
  },
  //进度条背景
  drawProgressBg: function () {
    const ctx = wx.createCanvasContext("canvasProgressbg", this);
    ctx.setLineWidth(4);
    ctx.setStrokeStyle("#E7E7E7");
    ctx.setLineCap("round");
    ctx.beginPath();
    ctx.arc(110, 110, 100, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.draw();
  },
  //绘制进度条
  drawProgress: function (step) {
    const ctx = wx.createCanvasContext("canvasProgress", this);
    ctx.setLineWidth(4);
    ctx.setStrokeStyle("#F6D135");
    ctx.setLineCap("round");
    ctx.beginPath();
    ctx.arc(110, 110, 100, -Math.PI / 2, step, false);
    ctx.stroke();
    ctx.draw();
  },
  //点击取消订单
  toCancel() {
    wx.redirectTo({
      url: "/pages/cancel/cancel",
    });
  },
  //点击不拼车
  backIndex() {
    wx.redirectTo({
      url: "/pages/index/index",
    });
  },
});

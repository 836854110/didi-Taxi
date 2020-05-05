import request from "../../utils/request.js";
var QQMapWX = require("../../utils/qqmap-wx-jssdk.min.js");
let app = getApp();
let globalData = app.globalData;
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: globalData.mapKey, // 必填
});
Page({
  data: {
    carData: [], //打车类别
    current: 1, //打车类别index
    isLoading: false,
    cartName: "快车",
    imgUrls: [],
    navScrollLeft: 0,
    startData: {
      startPlace: "",
      latiLongi: {},
      city: "",
    },
    endData: {
      endPlace: "",
      latiLongi: {},
      city: "",
    },
    isCallCar: false,
    priceType: [],
    priceId: "",
  },
  onLoad(options) {
    if (globalData.startData && globalData.startData.startPlace) {
      this.setData({
        startData: globalData.startData,
      });
    } else {
      wx.getLocation({
        type: "gcj02",
        success: (res) => {
          let params = {
            latitude: res.latitude,
            longitude: res.longitude,
          };
          this.getAddress(params);
        },
      });
    }
    if (globalData.endData && globalData.endData.endPlace) {
      this.setData({
        endData: globalData.endData,
      });
      this.getPriceType();
    }
    const current = (globalData.carItemData && globalData.carItemData.id) || 1;
    const cartName =
      (globalData.carItemData && globalData.carItemData.name) || "快车";
    this.setData({
      navScrollLeft: (current - 1) * 80,
      current,
      cartName,
    });
    this.getCartData();
  },

  //获取车的类别
  getCartData() {
    request({
      url: "carData",
      isMock: true,
    }).then((res) => {
      if (res.success) {
        this.setData({
          carData: res.data,
        });
      }
    });
  },

  //选中地址，获取车的类型以及价格
  getPriceType() {
    request({
      url: "priceType",
      isMock: true,
    }).then((res) => {
      if (res.success) {
        this.setData({
          priceType: res.data,
          priceId: res.data[0].id,
        });
      }
    });
  },

  //选择打车类别
  selectNav(e) {
    let { id: current, name: cartName } = e.currentTarget.dataset.cartinfo;
    globalData.carItemData = e.currentTarget.dataset.cartinfo;
    let singleNavWidth = 55;
    this.setData({
      current,
      navScrollLeft: (current - 1) * singleNavWidth,
      isLoading: true,
      cartName,
    });
  },

  // 逆地址解析
  getAddress(params) {
    qqmapsdk.reverseGeocoder({
      location: params,
      success: (res) => {
        const result = res && res.result ? res.result : {};
        const startData = {
          latiLongi: params,
          startPlace: result.address_reference.landmark_l2.title,
          city: result.address_component.city.replace("市", ""),
        };
        this.setData({
          startData,
        });
        globalData.startData = startData;
      },
    });
  },

  //点击呼叫
  callCar() {
    const { endData, startData } = this.data;
    if (endData && endData.endPlace && startData && startData.startPlace) {
      wx.navigateTo({
        url: "/pages/wait/wait",
      });
    }
  },

  //选择价格
  clickPrice(e) {
    let newPriceId = e.currentTarget.dataset.priceid;
    this.setData({
      priceId: newPriceId,
    });
  },
});

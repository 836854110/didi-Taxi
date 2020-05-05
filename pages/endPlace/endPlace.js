// 引入SDK核心类
var QQMapWX = require("../../utils/qqmap-wx-jssdk.min.js");
let cityData = require("../../utils/cityData.js");
let app = getApp();
let globalData = app.globalData;
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: globalData.mapKey // 必填
});

Page({
  data: {
    suggestion: [],
    endPlace: "",
    latiLongi: {}, //经纬度
    city: "",
    cityData,
    showPage: 1 //1关键词搜索，2显示城市搜索
  },
  onLoad(options) {
    wx.getLocation({
      type: "gcj02",
      success: res => {
        let params = {
          longitude: res.longitude,
          latitude: res.latitude
        };
        this.getAddress(params);
      }
    });
    if (globalData.endData && globalData.endData.endPlace) {
      this.setData({
        ...globalData.endData
      });
    }
  },

  //触发关键词输入提示事件
  getsuggest(e) {
    const keyword = typeof e == "string" ? e : e.detail.value;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: this.data.city, //设置城市名，限制关键词所示的地域范围，非必填参数
      success: res => {
        const data = res && res.data ? res.data : [];
        this.searchSuccess(data);
      }
    });
  },

  //搜索成功后的回调
  searchSuccess(data) {
    var sug = [];
    for (var i = 0; i < data.length; i++) {
      sug.push({
        // 获取返回结果，放到sug数组中
        title: data[i].title,
        id: data[i].id,
        address: data[i].address,
        city: data[i].city,
        district: data[i].district,
        latitude: data[i].location.lat,
        longitude: data[i].location.lng
      });
    }
    this.setData({
      //设置suggestion属性，将关键词搜索结果以列表形式展示
      suggestion: sug,
      showPage: 1
    });
  },
  // 点击取消按钮
  cancle() {
    const { showPage } = this.data;
    if (showPage == 2) {
      this.setData({
        showPage: 1
      });
      return;
    }
    wx.redirectTo({
      url: "/pages/index/index"
    });
  },

  // 逆地址解析
  getAddress(params) {
    qqmapsdk.reverseGeocoder({
      location: params,
      success: res => {
        const result = res && res.result ? res.result : {};
        const city = result.address_component.city.replace("市", "");
        this.setData(
          {
            city
          },
          () => {
            this.getsuggest(city);
          }
        );
      }
    });
  },
  //点击城市
  changeCity() {
    this.setData({
      showPage: 2
    });
  },
  //选择城市
  selectCity(e) {
    const city =
      e &&
      e.currentTarget &&
      e.currentTarget.dataset &&
      e.currentTarget.dataset.citydata &&
      e.currentTarget.dataset.citydata.name
        ? e.currentTarget.dataset.citydata.name
        : this.data.city;
    this.setData(
      {
        city,
        showPage: 2
      },
      () => {
        this.getsuggest(city);
      }
    );
  },
  //选择地址
  selectAddress(e) {
    const record =
      e &&
      e.currentTarget &&
      e.currentTarget.dataset &&
      e.currentTarget.dataset.record
        ? e.currentTarget.dataset.record
        : {};
    let latiLongi = {
      longitude: record.longitude,
      latitude: record.latitude
    };
    globalData.endData = {
      city: this.data.city,
      endPlace: record.title,
      latiLongi
    };
    wx.redirectTo({
      url: "/pages/index/index"
    });
  }
});

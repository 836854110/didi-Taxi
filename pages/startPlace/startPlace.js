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
    startPlace: "",
    markers: [],
    latiLongi: {}, //经纬度
    city: "",
    cityData,
    showPage: 3 //1关键词搜索，2显示城市搜索，3显示地图
  },
  onLoad(options) {
    if (globalData.startData && globalData.startData.startPlace) {
      this.setData({
        ...globalData.startData
      });
    } else {
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
    }
    wx.getSystemInfo({
      success: res => {
        this.setData({
          controls: [
            {
              id: 1,
              iconPath: "../../assets/images/marker.png",
              position: {
                left: res.windowWidth / 2 - 15,
                top: res.windowHeight / 2 - 20,
                width: 30,
                height: 40
              },
              clickable: true
            }
          ]
        });
      }
    });
  },
  onReady() {
    this.mapCtx = wx.createMapContext("didiStartMap"); // 地图组件的id
  },
  //点击城市
  changeCity() {
    this.setData({
      showPage: 2
    });
  },
  //触发关键词输入提示事件
  getsuggest(e) {
    const keyword = typeof e == "string" ? e : e.detail.value;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      region: this.data.city, //设置城市名，限制关键词所示的地域范围，非必填参数
      location: this.data.latiLongi,
      success: res => {
        const data = res && res.data ? res.data : [];
        this.searchSuccess(data);
      }
    });
  },
  //搜索周围地址
  nearby_search() {
    qqmapsdk.reverseGeocoder({
      location: this.data.latiLongi,
      get_poi: 1,
      success: res => {
        const data =
          res && res.result && res.result.pois ? res.result.pois : [];
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
    if (this.data.showPage == 3) {
      wx.redirectTo({
        url: "/pages/index/index"
      });
    } else {
      this.setData({
        suggestion: [],
        showPage: 3
      });
    }
  },
  //地图移动的位置
  regionchange(e) {
    if (e.type == "end") {
      this.mapCtx.getCenterLocation({
        success: res => {
          let params = {
            longitude: res.longitude,
            latitude: res.latitude
          };
          this.getAddress(params);
        }
      });
    }
  },
  // 逆地址解析
  getAddress(params) {
    qqmapsdk.reverseGeocoder({
      location: params,
      success: res => {
        const result = res && res.result ? res.result : {};
        this.setData({
          latiLongi: params,
          startPlace: result.address_reference.landmark_l2.title,
          city: result.address_component.city.replace("市", "")
        });
      }
    });
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
    this.getAddress(latiLongi);
    this.setData({
      showPage: 3,
      backfill: record.title
    });
  },
  //确认上车
  sureGetOn() {
    const { startPlace, latiLongi, city } = this.data;
    globalData.startData = {
      city,
      startPlace,
      latiLongi
    };
    wx.redirectTo({
      url: "/pages/index/index"
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
  }
});

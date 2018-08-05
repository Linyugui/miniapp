const app = getApp()
var config = require('../../libs/config.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;


Page({
	data: {
		nearbyShops: [],
		latitude: 0,
		longitude: 0,
		scrollTop: 0,
		size: 0,
		onLine: true,
		noAuth: false,
		yesAuth: true,
		markers: [
			{
				id: 0,
				latitude: 22.535938,
				longitude: 113.925493,
				title: '南头店（深圳）',
			},
			{
				id: 1,
				latitude: 22.533219,
				longitude: 114.082142,
				title: '福星店（深圳）',
			},
			{
				id: 2,
				latitude: 22.538516,
				longitude: 114.089413,
				title: '爱华路店（深圳）',
			},
			{
				id: 3,
				latitude: 22.566647,
				longitude: 114.037464,
				title: '梅林一村店（深圳）',
			},
			{
				id: 4,
				latitude: 22.610993,
				longitude: 114.043652,
				title: '潜龙店（深圳）',
			},
			{
				id: 5,
				latitude: 22.517259,
				longitude: 113.924427,
				title: '现代华庭店（深圳）',
			},
			{
				id: 6,
				latitude: 22.6592,
				longitude: 114.028758,
				title: '锦绣御园店（深圳）',
			},
			{
				id: 7,
				latitude: 22.576265,
				longitude: 113.897153,
				title: '上川路店（深圳）',
			},
			{
				id: 8,
				latitude: 22.543062,
				longitude: 114.128821,
				title: '春风路店（深圳）',
			},
			{
				id: 9,
				latitude: 22.609222,
				longitude: 114.124999,
				title: '世纪华厦店（深圳）',
			},
			{
				id: 10,
				latitude: 22.53851,
				longitude: 114.10998,
				title: '万象城店（深圳）',
			}
		],
	},
    onLoad: function () {
	    wx.showLoading({title: "获取数据中"});
    },
	onShow:function() {
		this.getData();
	},
	getData:function(){
	    var that = this
	    var key = config.Config;
	    //初始化地图接口实例
		qqmapsdk = new QQMapWX({key: key.qqmap_key})

	    var markers = that.data.markers
		qqmapsdk.calculateDistance({
		    mode:'driving',
		    to:markers,
		    success:function (res) {
				res.result.elements.forEach(function (item,index) {
					markers[index].distance = item.distance
					markers[index].open=false
				})
			    markers.sort(sortBydistance)
			    var nearbyShops = markers.slice(0,10)
			    wx.hideLoading()
			    that.setData({
				    nearbyShops: nearbyShops,
				    noAuth: false,
				    yesAuth: true
			    })
		    },
		    fail:function (res) {
			    wx.hideLoading()
			    //有可能是参数有问题或者是网络
			    that.setData({
				    onLine: false,
				    noAuth: false,
				    yesAuth: true
			    });
		    }
	    })

    },
	kindToggle: function (e) {
		console.log('---------- index.js.tap()  line:101()  e='); console.dir(e);
		var that = this
		var markets = that.data.markers
		var temp = markets.find(findByid,e.currentTarget.id)
		console.log('---------- index.js.tap()  line:105()  temp='); console.dir(temp);
		that.setData({
			latitude: temp.latitude,
			longitude: temp.longitude
		})
		var param = {
			//基本的信息
			markers: that.data.markers,
			latitude: that.data.latitude,
			longitude: that.data.longitude,
			origin :that.data.longitude + "," + that.data.latitude,
			destination: temp.longitude + "," + temp.latitude,

		}
		wx.navigateTo({
			url: '../location/location?param=' + JSON.stringify(param)
		});
	},


})
var sortBydistance=function (obj1,obj2) {
	return obj1.distance-obj2.distance
}
var findByid = function (item) {
	if(item.id == this)
		return true
}
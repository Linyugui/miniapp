const app = getApp()
Page({
	data: {
		size: 0,
		markers: [],
	},
    onLoad: function (option) {
	    wx.showLoading({title: "获取数据中"});
        var param = JSON.parse(option.param);
        var that = this;
        var markers = param.markers;
        var size = markers.length;
        that.setData({
			markers:markers,
			size:size,
		});
    },
	onShow:function() {
        wx.hideLoading()
	},
	kindToggle: function (e) {
		console.log('---------- index.js.tap()  line:101()  e='); console.dir(e);
		var that = this
		var markets = that.data.markers
		var temp = markets.find(findByid,e.currentTarget.id)
		var param = {
            latitude: temp.latitude,
            longitude: temp.longitude
		}
		wx.navigateTo({
			url: '../location/location?param=' + JSON.stringify(param)
		});
	},

})
var findByid = function (item) {
	if(item.id == this)
		return true
}
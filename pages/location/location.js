const app = getApp()
var amapFile = require('../../libs/amap-wx.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var config = require('../../libs/config.js');
var amapInstance;
var qqmapsdk;

Page({
	data: {
		latitude:0,
		longitude:0,
		point_latitude:0,
		point_longitude:0,
		scale:16,
		nerbyShops:[],

	},
    onLoad: function (option) {
		console.log('---------- location.js.onLoad()  line:88()  option='); console.dir(option);
	    var param = JSON.parse(option.param);
	    var that = this;
	    var markers = param.markers;
	    var latitude = param.latitude;
	    var longitude = param.longitude;
	    var origin = param.origin;
	    var destination = param.destination;
	    markers.forEach(function (item, index) {
		    //为零时显示最近的气泡
		    item.iconPath="../../image/location.png";
		    if(!index){
			    item.callout= {
				    content: "离你最近",
				    color: "#b5b1b1",
				    fontSize: 12,
				    borderRadius: 15,
				    bgColor: "#262930",
				    padding: 10,
				    display: 'ALWAYS'
			    };
		    }
	    });
	    var nearShops = markers.slice(0,10);
	    that.setData({
		    markers: markers,
		    nearShops:nearShops,
		    latitude: latitude,
		    longitude: longitude,
		    point_latitude: latitude,
		    point_longitude: longitude,
	    });

		wx.showLoading({title:'数据获取中'})

    },
	onShow:function(option){
		console.log('---------- location.js.onShow()  line:92()  option='); console.dir(option);
		wx.hideLoading();
	},
	tap:function (e) {
		var that = this
		var markets = that.data.markers
		var temp = markets.find(findByid,e.markerId)
		console.log('---------- index.js.tap()  line:105()  temp='); console.dir(temp);
		var origin = that.data.longitude+','+that.data.latitude;
		var destination = temp.longitude+','+temp.latitude;
		var point_latitude = (that.data.latitude+temp.latitude)/2;
		var point_longitude = (that.data.longitude+temp.longitude)/2;


		amapInstance.getDrivingRoute({
			origin:origin,
			destination:destination,

			success:function (data) {
				console.log('---------- location.js.success()  line:141()  data='); console.dir(data);
				var points = [];
				if(data.paths && data.paths[0] && data.paths[0].steps){
					var steps = data.paths[0].steps;
					for(var i = 0; i < steps.length; i++){
						var poLen = steps[i].polyline.split(';');
						for(var j = 0;j < poLen.length; j++){
							points.push({
								longitude: parseFloat(poLen[j].split(',')[0]),
								latitude: parseFloat(poLen[j].split(',')[1])
							})
						}
					}
				}
				that.setData({
					point_latitude:point_latitude,
					point_longitude:point_longitude,
					polyline: [{
						points: points,
						color: "#0091ff",
						width: 6
					}]
				});
			},
			fail:function (data) {
				console.log('---------- location.js.fail()  line:164()  data='); console.dir(data);
			},
			complete:function (data) {
				console.log('---------- location.js.complete()  line:167()  data='); console.dir(data);
			}
			
		});


	},
	jump:function (e) {
		console.log('---------- index.js.jump()  line:170()  e='); console.dir(e);
		var that = this
		var markets = that.data.markers
		var temp = markets.find(findByid,e.currentTarget.id)
		console.log('---------- index.js.tap()  line:105()  temp='); console.dir(temp);
		
		/*wx.openLocation({
			name:temp.title,
			latitude: temp.latitude,
			longitude: temp.longitude,
			scale: 18
		})*/
	}
})
var sortBydistance=function (obj1,obj2) {
	return obj1.distance-obj2.distance
}
var findByid = function (item) {
	if(item.id == this)
		return true
}
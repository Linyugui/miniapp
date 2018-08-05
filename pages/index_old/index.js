const app = getApp()
var amapFile = require('../../libs/amap-wx.js');
var qqmapFile = require('../../libs/qqmap-wx-jssdk.js');
var config = require('../../libs/config.js');
var amapInstance;
var qqmapInstance;

Page({
	data: {
		latitude:'',
		longitude:'',
		nerbyShops:[],
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

	    var that = this
	    var key = config.Config;
	    //初始化地图接口实例
	    amapInstance = new amapFile.AMapWX({ key: key.amap_key })
		qqmapInstance = new qqmapFile({key: key.qqmap_key})
        wx.getLocation({
	        type: 'gcj02',
            success: res => {
                that.setData({
                    latitude:res.latitude,
                    longitude:res.longitude,
                })

            }
        })
	    // 对距离进行排序

	    var markers = that.data.markers
	    var nearbyShops = markers.slice()
	    console.log('---------- index.js.onLoad()  line:104()  nearbyShops='); console.dir(nearbyShops);
	    qqmapInstance.calculateDistance({
		    mode:'driving',
		    to:nearbyShops,
		    success:function (res) {
				res.result.elements.forEach(function (item,index) {
					nearbyShops[index].distance = item.distance
				})
			    nearbyShops.sort(sortBydistance)
			    nearbyShops.forEach(function (item,index) {
				    if(!index){
					    item.callout= {
						    content: "离你最近",
						    color: "#b5b1b1",
						    fontSize: 12,
						    borderRadius: 15,
						    bgColor: "#262930",
						    padding: 10,
						    display: 'ALWAYS'
					    }

				    }
				    item.iconPath = '../../image/location.png'
				    item.width = 40
				    item.height = 40

			    })
			    console.log('---------- index.js.success()  line:128()  nearbyShops='); console.dir(nearbyShops);
			    that.setData({
				    nearbyShops:nearbyShops,
			    })
		    },
		    fail:function (res) {

		    },
		    complete:function (res) {

		    }
	    })

    },
    tap:function (e) {
		console.log('---------- index.js.tap()  line:101()  e='); console.dir(e);
		var that = this
	    var markets = that.data.markers
	    var temp = markets.find(findByid,e.markerId)
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




	},
	jump:function (e) {
		console.log('---------- index.js.jump()  line:170()  e='); console.dir(e);
		var that = this
		var markets = that.data.markers
		var temp = markets.find(findByid,e.currentTarget.id)
		console.log('---------- index.js.tap()  line:105()  temp='); console.dir(temp);
		that.setData({
			latitude: temp.latitude,
			longitude: temp.longitude
		})
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
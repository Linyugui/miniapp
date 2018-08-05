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
        hiddenDropdown: true,
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
    onLoad: function (option) {
	    if(option!=''){

        }
        wx.showLoading({title: "获取数据中"});
    },
	onShow:function(){
        this.getData();
	},
	getData:function(){
        var that = this;
        var key = config.Config;
        var markers = that.data.markers;
        //初始化地图接口实例
        qqmapsdk = new QQMapWX({key: key.qqmap_key});
        amapInstance = new amapFile.AMapWX({key: key.amap_key});
        wx.getLocation({
			type:'gcj02',
			success:function (res) {
				that.setData({
					latitude:res.latitude,
					longitude:res.longitude,
                    point_latitude:res.latitude,
                    point_longitude:res.longitude,
				})
            }
		});
        qqmapsdk.calculateDistance({
            mode:'driving',
            to:markers,
            success:function (res) {
                res.result.elements.forEach(function (item,index) {
                    markers[index].distance = item.distance;
                    markers[index].open=false;
                    markers[index].iconPath="../../image/location.png";
                });
                markers.sort(sortBydistance);
				markers[0].callout= {
                    content: "离你最近",
                    color: "#b5b1b1",
                    fontSize: 12,
                    borderRadius: 15,
                    bgColor: "#262930",
                    padding: 10,
                    display: 'ALWAYS'
                };
                var nearShops = markers.slice(0,5)
                wx.hideLoading()
                that.setData({
                    markers: markers,
                    nearShops:nearShops,
                })
            },
            fail:function (res) {
                wx.hideLoading()
            }
        })
	},
	tap:function (e) {
		var that = this
		var markets = that.data.markers
		var temp = markets.find(findByid,e.markerId)
		console.log('---------- index.js.tap()  line:105()  temp='); console.dir(temp);
		wx.getLocation({
            type:'gcj02',
            success:function (res) {
                that.setData({
                    latitude:res.latitude,
                    longitude:res.longitude,
                })
            }
        });
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
    tapmore:function(e){
	    var that = this;
        var param = {
            //基本的信息
            markers: that.data.markers,
        };
        wx.navigateTo({
            url: '../index/index?param=' + JSON.stringify(param)
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
	},
    bindFocus: function (e) {
        this.setData({
            hiddenDropdown: false,
        })
    },
    bindBlur: function (e) {
        this.setData({
            hiddenDropdown: true,
        })
    },
    bindInput:function(e){
        var name = e.detail.value;
        console.log(name);
    },
    query: function (e) {

    }
})
var sortBydistance=function (obj1,obj2) {
	return obj1.distance-obj2.distance
}
var findByid = function (item) {
	if(item.id == this)
		return true
}
var findByname = function (item) {

}
//获取应用实例
var app = getApp()
Page({
    data: {

        hiddenLoading: true,
        hiddenData: true,
        hiddenDropdown: true,
        hiddenClear:true,
        demoData: 'XXXX',
        Product: {},
        markers: [
            {
                id: 0,
                latitude: 22.535938,
                longitude: 113.925493,
                title: '南头店（深圳）',
                distance:100,
            },
            {
                id: 1,
                latitude: 22.533219,
                longitude: 114.082142,
                title: '福星店（深圳）',
                distance:100,
            },
            {
                id: 2,
                latitude: 22.538516,
                longitude: 114.089413,
                title: '爱华路店（深圳）',
                distance:100,
            },
            {
                id: 3,
                latitude: 22.566647,
                longitude: 114.037464,
                title: '梅林一村店（深圳）',
                distance:100,
            },
            {
                id: 4,
                latitude: 22.610993,
                longitude: 114.043652,
                title: '潜龙店（深圳）',
                distance:100,
            },
            {
                id: 5,
                latitude: 22.517259,
                longitude: 113.924427,
                title: '现代华庭店（深圳）',
                distance:100,
            },
            {
                id: 6,
                latitude: 22.6592,
                longitude: 114.028758,
                title: '锦绣御园店（深圳）',
                distance:100,
            },
            {
                id: 7,
                latitude: 22.576265,
                longitude: 113.897153,
                title: '上川路店（深圳）',
                distance:100,
            },
            {
                id: 8,
                latitude: 22.543062,
                longitude: 114.128821,
                title: '春风路店（深圳）',
                distance:100,
            },
            {
                id: 9,
                latitude: 22.609222,
                longitude: 114.124999,
                title: '世纪华厦店（深圳）',
                distance:100,
            },
            {
                id: 10,
                latitude: 22.53851,
                longitude: 114.10998,
                title: '万象城店（深圳）',
                distance:100,
            }
        ],
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
    query: function (e) {

    }
})
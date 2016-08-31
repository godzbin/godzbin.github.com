// Echart 地图对象
function EchartMap(eleId) {
	this.eleId = eleId;
	this.initView = function() {
		this.ele = document.getElementById(this.eleId);
		this.myChart = echarts.init(this.ele);
		this.option = {
			backgroundColor: 'none',
			title: {
				show: false,
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				show: false,
			},
			series: [{
				name: '交易量',
				type: 'map',
				map: 'china',
				roam: false,
				label: {
					normal: {
						show: false,
						textStyle: {
							color: "#fff",
						}
					},
					emphasis: {
						show: true,
						textStyle: {
							color: "#fff",
						}
					}
				},
				itemStyle: {
					normal: {
						areaColor: '#323c48',
						borderColor: '#7E808A'
					},
					emphasis: {
						areaColor: '#7FC533'
					}
				},
				data: [{
					name: '北京',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '天津',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '上海',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '重庆',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '河北',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '河南',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '云南',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '辽宁',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '黑龙江',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '湖南',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '安徽',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '山东',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '新疆',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '江苏',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '浙江',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '江西',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '湖北',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '广西',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '甘肃',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '山西',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '内蒙古',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '陕西',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '吉林',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '福建',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '贵州',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '广东',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '青海',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '西藏',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '四川',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '宁夏',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '海南',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '台湾',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '香港',
					value: Math.round(Math.random() * 1000)
				}, {
					name: '澳门',
					value: Math.round(Math.random() * 1000)
				}]
			}, ]
		};
		this.myChart.setOption(this.option);
	};
}
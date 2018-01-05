// 饼图
// 
function EchartPie(eleId, praentNode, title) {
	this.praentNode = praentNode;
	this.title = title;
	this.eleId = eleId;
	this.initView = function() {
		var that = this;
		this.ele = document.getElementById(this.eleId);
		this.myChart = echarts.init(this.ele);
		this.option = {
			color: ['#00A8E0', '#AED334', '#FF9000', '#FBED25', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
			backgroundColor: 'none',
			title: {
				show: true,
				text: this.title,
				x: "left",
				y: "top",
				textStyle: {
					color: "#fff",
					fontSize: "14px"
				}
			},
			tooltip: {
				trigger: 'item',
				textStyle: {
					color: "#fff",
					fontSize: "14px"
				},
				position: ["5%", "10%"],
				formatter: " {b} : {c} ({d}%)"
			},
			legend: {
				orient: 'horizontal',
				bottom: "bottom",
				textStyle: {
					color: "#fff"
				},
				itemWidth: 15,
				data: []
					// data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
			},
			series: [{
				name: this.title,
				type: 'pie',
				radius: '70%',
				center: ['50%', '40%'],
				// data: [{
				// 	value: 335,
				// 	name: '直接访问'
				// }, {
				// 	value: 310,
				// 	name: '邮件营销'
				// }, {
				// 	value: 234,
				// 	name: '联盟广告'
				// }, {
				// 	value: 135,
				// 	name: '视频广告'
				// }, {
				// 	value: 1548,
				// 	name: '搜索引擎'
				// }],
				data: [],
				label: {
					normal: {
						show: false,
						position: 'center'
					},
				},
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		this.myChart.setOption(this.option);
	};

}
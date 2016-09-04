// Echart 地图对象
function EchartMap(eleId, praentNode) {
	this.praentNode = praentNode;
	this.eleId = eleId;
	this.initView = function() {
		var that = this;
		this.ele = document.getElementById(this.eleId);
		this.myChart = echarts.init(this.ele);
		this.option = {
			backgroundColor: 'none',
			title: {
				show: false,
			},
			tooltip: {
				trigger: 'item',
				triggerOn: "click",
				position: ["25%", "92%"],
				formatter: function(params) {
					// var province = params.data.name;
					// var value = params.data.value;
					// return "<span style='margin-right: 20px;' >区域： " +
					// 	province + "</span><span>当前定制服务数：" + value + " </span>"
					return null;
				}
			},
			legend: {
				show: false,
			},
			series: [{
				name: '交易量',
				type: 'map',
				map: 'china',
				roam: false,
				selectedMode : 'single',
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
				data:[]
			}]
		};
		this.myChart.setOption(this.option);
	};
}
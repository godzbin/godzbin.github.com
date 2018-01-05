//运营分析
Ext.ns("operationAnalysis");
operationAnalysis.gauge_chart1 = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'gauge'
		},
		title: {
			text: ''
		},
		pane: {
			startAngle: -120,
			endAngle: 120,
			size: 50,
			backgroundColor: '#E4E3DF'
		},
		tooltip: {
			formatter: function() {
				return this.series.name + ":" + this.y + 'K'
			}
		},
		yAxis: {
			minorTickLength: 0,
			tickWidth: 0,
			min: 0,
			max: 10000,
			//offset: -40,
			tickPositions: [
				0, 2500, 5000, 7500, 10000
			],
			labels: {
				distance: 15,
				//rotation: 'auto',
				step: 2,
				align: 'center',
				style: {
					fontSize: 10
				},
				formatter: function() {
					return this.value + 'K'
				}
			},
			plotBands: [{
				id: "gauge_chart1_1",
				from: 0,
				to: 2500,
				color: '#DBDF02',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				id: "gauge_chart1_2",
				from: 2500,
				to: 5000,
				color: '#90C31D',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				id: "gauge_chart1_3",
				from: 5000,
				to: 10000,
				color: '#24AD38',
				outerRadius: '100%',
				thickness: '20%'
			}]
		},
		plotOptions: {
			series: {
				dataLabels: {
					enabled: false
				}
			}
		},
		series: [{
			name: '业务量',
			data: [0],
			dial: {
				backgroundColor: '#FA3421',
				//baseLength: '30%',
				//baseWidth: 7,
				topWidth: 1,
				radius: '50%'
				//rearLength: '-70%'
				//borderColor: '#B17964',
				//borderWidth: 1
			},
			pivot: {
				radius: 3
			}
		}]
	});
};

operationAnalysis.gauge_chart2 = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'gauge'
		},
		title: {
			text: ''
		},
		pane: {
			startAngle: -120,
			endAngle: 120,
			size: 50,
			backgroundColor: '#E4E3DF'
		},
		yAxis: {
			minorTickLength: 0,
			tickWidth: 0,
			min: 0,
			max: 50,
			//offset: -40,
			tickPositions: [
				0, 12, 25, 37, 50
			],
			labels: {
				distance: 15,
				//rotation: 'auto',
				step: 2,
				align: 'center',
				style: {
					fontSize: 10
				},
				formatter: function() {
					return this.value + ''
				}
			},
			plotBands:  [{
				from: 0,
				to: 12,
				color: '#DBDF02',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				from: 12,
				to: 25,
				color: '#90C31D',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				from: 25,
				to: 50,
				color: '#24AD38',
				outerRadius: '100%',
				thickness: '20%'
			}]
		},
		plotOptions: {
			series: {
				dataLabels: {
					enabled: false
				}
			}
		},
		series: [{
			name: '业务时长',
			data: [0],
			dial: {
				backgroundColor: '#FA3421',
				//baseLength: '30%',
				//baseWidth: 7,
				topWidth: 1,
				radius: '50%'
				//rearLength: '-70%'
				//borderColor: '#B17964',
				//borderWidth: 1
			},
			pivot: {
				radius: 3
			}
		}]
	});

};

operationAnalysis.gauge_chart3 = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'gauge'
		},
		title: {
			text: ''
		},
		pane: {
			startAngle: -120,
			endAngle: 120,
			size: 50,
			backgroundColor: '#E4E3DF'
		},
		yAxis: {
			minorTickLength: 0,
			tickWidth: 0,
			min: 0,
			max: 100,
			//offset: -40,
			tickPositions: [
				0, 25, 50, 75, 100
			],
			labels: {
				distance: 15,
				//rotation: 'auto',
				step: 2,
				align: 'center',
				style: {
					fontSize: 10
				},
				formatter: function() {
					return this.value + '%';
				}
			},
			plotBands: [{
				from: 0,
				to: 25,
				color: '#DBDF02',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				from: 25,
				to: 50,
				color: '#90C31D',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				from: 50,
				to: 100,
				color: '#24AD38',
				outerRadius: '100%',
				thickness: '20%'
			}]
		},
		plotOptions: {
			series: {
				dataLabels: {
					enabled: false
				}
			}
		},
		series: [{
			name: '成功率',
			data: [0],
			dial: {
				backgroundColor: '#FA3421',
				//baseLength: '30%',
				//baseWidth: 7,
				topWidth: 1,
				radius: '50%'
				//rearLength: '-70%'
				//borderColor: '#B17964',
				//borderWidth: 1
			},
			pivot: {
				radius: 3
			}
		}]
	});

};

operationAnalysis.area_chart1 = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'area'
		},
		title: {
			text: ''
		},
		yAxis: {
			title: null,
			labels: {
				formatter: function() {
					return this.value;
				}
			},
			allowDecimals: false
		},
		xAxis: {
			labels: {
				enable: false,
				formatter: function() {
					this.value = this.value || "";
					return this.value.substring(11, 16)
				}
			},
			categories: []
		},
		tooltip: {
			formatter: function() {
				return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' +
					this.y + '</b>';
			}
		},
		plotOptions: {},
		legend: {
			enabled: false
		},
		series: [{
			name: '办理量',
			color: '#87C1E9',
			data: []
		}]
	});

};

operationAnalysis.area_chart2 = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'area'
		},
		title: {
			text: ''
		},
		yAxis: {
			title: null,
			min: 0,
			max: 1,
			tickInterval: 0.25,
			labels: {
				formatter: function() {
					this.value = this.value || 0;
					return this.value * 100 + '%';
				}
			}
		},
		xAxis: {
			labels: {
				enable: false,
				formatter: function() {
					this.value = this.value || "";
					return this.value.substring(11, 16)
				}
			},
			categories: []
		},
		tooltip: {
			formatter: function() {
				return '<span>' + this.series.name + '</span>: <b>' +
					Highcharts.numberFormat(this.y * 100, 2, '.') + '%</b>';
			}
		},
		plotOptions: {},
		legend: {
			enabled: false
		},
		series: [{
			name: '成功率',
			color: '#FAF276',
			data: []
		}]
	});

};

operationAnalysis.area_chart3 = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'area'
		},
		title: {
			text: ''
		},
		yAxis: {
			title: null,
			labels: {
				formatter: function() {
					return (parseInt(this.value)) + "s";
				}
			}
		},
		xAxis: {
			categories: [],
			labels: {
				enable: false,
				formatter: function() {
					this.value = this.value || "";
					return this.value.substring(11, 16)
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' +
					(parseFloat(this.y)).toFixed(2) + 's</b>';
			}
		},
		plotOptions: {},
		legend: {
			enabled: false
		},
		series: [{
			name: '业务时长',
			color: '#F0B254',
			data: []
		}]
	});

};

$(function() {
	//运营分析 -> 业务量 gauge图
	//gauge_chart1();
	//运营分析 -> 业务时长 gauge图
	//gauge_chart2();
	//运营分析 -> 成功率 gauge图
	//gauge_chart3();
	//运营分析 -> 业务量 area图
	//area_chart1();
	//运营分析 -> 成功率 area图
	//area_chart2();
	//运营分析 -> 成功率 area图
	// area_chart3();
});
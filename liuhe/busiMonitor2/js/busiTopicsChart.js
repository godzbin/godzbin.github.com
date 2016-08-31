//业务专题
Ext.ns("busiTopicsChart");

busiTopicsChart.gauge_chart1 = function(chartId) {
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
			max: 5000,
			//offset: -40,
			tickPositions: [
				0, 1250, 2500, 3750, 5000
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
			plotBands: [{
				id: "gauge_chart1_1",
				from: 0,
				to: 1250,
				color: '#DBDF02',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				id: "gauge_chart1_2",
				from: 1250,
				to: 2500,
				color: '#90C31D',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				id: "gauge_chart1_3",
				from: 2500,
				to: 5000,
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
			data: [],
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

busiTopicsChart.gauge_chart2 = function(chartId) {
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
			data: [],
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

busiTopicsChart.gauge_chart3 = function(chartId) {
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
			max: 200,
			//offset: -40,
			tickPositions: [
				0, 50, 100, 150, 200
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
			plotBands: [{
				from: 0,
				to: 50,
				color: '#DBDF02',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				from: 50,
				to: 150,
				color: '#90C31D',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				from: 150,
				to: 200,
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
			data: [],
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

busiTopicsChart.gauge_chart4 = function(chartId) {
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
			max: 80,
			//offset: -40,
			tickPositions: [
				0, 20, 40, 60, 80
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
			plotBands: [{
				from: 0,
				to: 20,
				color: '#DBDF02',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				from: 20,
				to: 40,
				color: '#90C31D',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				from: 40,
				to: 80,
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
			name: '系统时长',
			data: [],
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

busiTopicsChart.area_chart1 = function(chartId) {
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
			}
		},
		xAxis: {
			categories: [],
			labels: {
				formatter: function() {
					var value = this.value || "";
					if (value.length >= 19) {
						value = value.substring(11, 16)
					}
					return value;
				}
			}
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

busiTopicsChart.area_chart2 = function(chartId) {
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
					return this.value * 100 + '%';
				}
			}
		},
		xAxis: {
			categories: [],
			labels: {
				formatter: function() {
					var value = this.value || "";
					if (value.length >= 19) {
						value = value.substring(11, 16)
					}
					return value;
				}
			}
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

busiTopicsChart.area_chart3 = function(chartId) {
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
			}
		},
		xAxis: {
			categories: [],
			labels: {
				formatter: function() {
					var value = this.value || "";
					if (value.length >= 19) {
						value = value.substring(11, 16)
					}
					return value;
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<span>' + this.series.name + '</span>: <b>' +
					(parseFloat(this.y)).toFixed(2) + 's</b>';
			}
		},
		plotOptions: {},
		legend: {
			enabled: false
		},
		series: [{
			name: '系统时长',
			color: '#F8B857',
			data: []
		}]
	});

};

busiTopicsChart.column_chart1 = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'column'
		},
		title: {
			text: ''
		},
		options3d: {
			enabled: true
		},
		xAxis: {
			type: 'category'
		},
		yAxis: {
			min: 0,
			max: 1,
			tickInterval: 0.25,
			labels: {
				formatter: function() {
					return this.value * 100 + '%'
				}
			},
			title: {
				text: ''
			}
		},
		legend: {
			enabled: false,
			align: 'right',
			verticalAlign: 'middle',
			layout: 'vertical'
		},
		plotOptions: {
			column: {
				borderRadius: 5,
				maxPointWidth: 18
			},
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: false
				}
			}
		},
		tooltip: {
			enabled: true,
			formatter: function() {
				return '<span>' + this.key + '</span>: <b>' + Highcharts.numberFormat(this.y * 100, 2, '.') + '%</b>';
			}
		},
		series: [{
			name: '业务',
			colorByPoint: true,
			data: []
		}, {
			name: "业务",
			type: "line",
			data: []
		}]
	});

};

busiTopicsChart.column_chart2 = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			type: 'column'
		},
		title: {
			text: ''
		},
		options3d: {
			enabled: true
		},
		xAxis: {
			type: 'category'
		},
		yAxis: {
			min: 0,
			max: 1,
			tickInterval: 0.25,
			labels: {
				formatter: function() {
					this.value = this.value || 0;
					return this.value * 100 + '%'
				}
			},
			title: {
				text: ''
			}
		},
		legend: {
			enabled: false,
			align: 'right',
			verticalAlign: 'middle',
			layout: 'vertical'
		},
		plotOptions: {
			column: {
				borderRadius: 5,
				maxPointWidth: 18
			},

			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: false
				}
			}
		},
		tooltip: {
			enabled: true,
			formatter: function() {
				console.log(this);
				return '<span>' + this.key + '</span>: <b>' + Highcharts.numberFormat(this.y * 100, 2, '.') + '%</b>';
			}
		},
		series: [{
			name: '业务',
			colorByPoint: true,
			data: []
		}, {
			name: "业务",
			type: "line",
			data: []
		}]
	});

};
$(function() {
	//业务专题页面-> 营业厅前台 -> 业务量 gauge图
	//gauge_chart1();
	//业务专题页面-> 营业厅前台 -> 成功率 gauge图
	//gauge_chart2();
	//业务专题页面-> 营业厅前台 -> 业务时长 gauge图
	//gauge_chart3();
	//业务专题页面-> 营业厅前台 -> 系统时长 gauge图
	//gauge_chart4();
	//业务专题页面-> 营业厅前台 -> 指标趋势 area 办理量/成功量图
	//area_chart1();
	//业务专题页面-> 营业厅前台 -> 指标趋势 area 成功率图
	//area_chart2();
	//业务专题页面-> 营业厅前台 -> 指标趋势 area 业务时长图
	//area_chart3();
	//业务监控页面->营业厅前台->客户留存率 column图
	//column_chart1();
	//业务监控页面->营业厅前台->系统成功率  column图
	//column_chart2();
});
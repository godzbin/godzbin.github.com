//业务监控页面
Ext.ns("busiProfileChart");
busiProfileChart.gauge_chart1 = function(charId) {
	$(charId).highcharts({
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
			max: 50000,
			//offset: -40,
			tickPositions: [
				0, 12500, 25000, 37500, 50000
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
				to: 12500,
				color: '#DBDF02',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				id: "gauge_chart1_2",
				from: 12500,
				to: 25000,
				color: '#90C31D',
				outerRadius: '100%',
				thickness: '20%'
			}, {
				id: "gauge_chart1_3",
				from: 25000,
				to: 50000,
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
			},
			gauge: {}
		},
		series: [{
			name: '业务量',
			data: [0],
			dial: {
				backgroundColor: '#FA3421',
				topWidth: 1,
				radius: '50%'
			},
			pivot: {
				radius: 3
			}
		}]
	});
};

busiProfileChart.gauge_chart2 = function(charId) {
	$(charId).highcharts({
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
				topWidth: 1,
				radius: '50%'
			},
			pivot: {
				radius: 3
			}
		}]
	});

};

busiProfileChart.gauge_chart3 = function(charId) {
	$(charId).highcharts({
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
			plotBands: [{
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

busiProfileChart.gauge_chart4 = function(charId) {
	$(charId).highcharts({
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
					return this.value + '';
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
			name: '告警数',
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

busiProfileChart.pie_chart1 = function(charId) {
	$(charId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: ''
		},
		tooltip: {
			// pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			formatter: function(value) {
				return '<span>' + this.series.name + '</span><br/><b>' + this.key + ': ' + this.y + '</b>';
			}
		},
		plotOptions: {
			pie: {
				size: 50,
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		},
		legend: {
			align: 'right',
			verticalAlign: 'middle',
			layout: 'vertical'
		},
		series: [{
			name: '业务量',
			colorByPoint: true,
			data: [{
				name: '营业厅',
				y: 0,
				color: '#8FC320'
			}, {
				name: '电渠',
				y: 0,
				color: '#07913B'
			}]
		}]
	});
};

busiProfileChart.pie_chart2 = function(charId) {
	$(charId).highcharts({
		credits: {
			enabled: false
		},
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: ''
		},
		tooltip: {
			formatter: function(value) {
				return '<span>' + this.series.name + '</span><br/><b>' + this.key + ': ' + this.y + '</b>';
			}
		},
		plotOptions: {
			pie: {
				size: 50,
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		},
		legend: {
			align: 'right',
			verticalAlign: 'middle',
			layout: 'vertical'
		},
		series: [{
			name: '告警数',
			colorByPoint: true,
			data: [{
				name: '营业厅',
				y: 0,
				color: '#8FC320'
			}, {
				name: '电渠',
				y: 0,
				color: '#07913B'
			}]
		}]
	});
};

busiProfileChart.column_chart1 = function(charId) {
	$(charId).highcharts({
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
			labels: {
				enabled: false
			},
			visible: false
		},
		yAxis: {
			labels: {
				enabled: false
			},
			title: {
				text: ''
			},
			visible: false
		},
		legend: {
			enabled: true,
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
				return '<span>' + this.series.name + '</span><br/><b>成功率: ' + this.y + '%</b>'
			}
		},
		series: [{
			name: '营业厅',
			color: '#8FC320',
			data: [
				0
			]
		}, {
			name: '电渠',
			color: '#08913B',
			data: [0]
		}]
	});

};

busiProfileChart.column_chart2 = function(charId) {
	$(charId).highcharts({
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
			labels: {
				enabled: false
			},
			visible: false
		},
		yAxis: {
			labels: {
				enabled: false
			},
			title: {
				text: ''
			},
			visible: false
		},
		legend: {
			enabled: true,
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
				return '<span>' + this.series.name + '</span><br/><b>业务时长: ' + this.y + 's</b>'
			}
		},
		series: [{
			name: '营业厅',
			color: '#8FC320',
			data: [
				0
			]
		}, {
			name: '电渠',
			color: '#08913B',
			data: [0]
		}]
	});

};

busiProfileChart.line_chart1 = function(charId) {
	$(charId).highcharts({
		animation: false,
		credits: {
			enabled: false
		},
		chart: {
			type: 'spline'
		},
		title: {
			text: ''
		},
		yAxis: {
			title: null
		},
		xAxis: {
			categories: [],
			labels: {
				formatter: function() {
					var value = this.value;
					var time = new Date(tools.getTimeValue(value));
					return Ext.Date.format(time,"H:i");
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' +
					this.y + '</b>';
			}
		},
		plotOptions: {
			series: {
				animation: false,
				marker: {
					symbol: "circle"
				},
				point: {
					events: {
						click: function(e) {
							var name = this.series.name;
							var time = this.category;
							ctrl.busiMoitor.clickTrend(name, time)
						}
					}
				}
			}
		},
		legend: {},
		series: []
	});

};

busiProfileChart.line_chart2 = function(charId) {
	$(charId).highcharts({
		animation: false,
		credits: {
			enabled: false
		},
		chart: {
			type: 'spline'
		},
		title: {
			text: ''
		},
		yAxis: {
			title: null,
			// min: 0.9,
			max: 1,
			tickInterval: 0.1,
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
					var value = this.value;
					var time = new Date(tools.getTimeValue(value));
					return Ext.Date.format(time,"H:i");
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' +
					Highcharts.numberFormat((this.y * 100), 2, '.') + '%</b>';
			}
		},
		plotOptions: {
			series: {
				animation: false,
				marker: {
					symbol: "circle"
				},
				point: {
					events: {
						click: function(e) {
							var name = this.series.name;
							var time = this.category;
							ctrl.busiMoitor.clickTrend(name, time)
						}
					}
				}
			}
		},
		legend: {},
		series: []
	});

};

busiProfileChart.line_chart3 = function(charId) {
	$(charId).highcharts({
		animation: false,
		credits: {
			enabled: false
		},
		chart: {
			type: 'spline'
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
				formatter: function() {
					var value = this.value;
					var time = new Date(tools.getTimeValue(value));
					return Ext.Date.format(time,"H:i");
				}
			}
		},
		tooltip: {
			formatter: function() {
				return '<span style="color:' + this.series.color + '">' + this.series.name + '</span>: <b>' +
					(parseFloat(this.y)).toFixed(2) + 's</b>';
			}
		},
		plotOptions: {
			series: {
				animation: false,
				marker: {
					symbol: "circle"
				},
				point: {
					events: {
						click: function(e) {
							var name = this.series.name;
							var time = this.category;
							ctrl.busiMoitor.clickTrend(name, time)
						}
					}
				}
			}
		},
		legend: {},
		series: []
	});

};

$(function() {
	//业务监控页面->营业厅前台->业务量 gauge图
	//gauge_chart1();

	//业务监控页面->营业厅前台->成功率 gauge图
	//gauge_chart2();

	//业务监控页面->营业厅前台->业务时长 gauge图
	//gauge_chart3();

	//业务监控页面->营业厅前台->告警数 gauge图
	//gauge_chart4();

	//业务监控页面->营业厅前台->业务量 pie图
	//pie_chart1();

	//业务监控页面->营业厅前台->告警数 pie图
	//pie_chart2();

	//业务监控页面->营业厅前台->成功率 column图
	//column_chart1();

	//业务监控页面->营业厅前台->业务时长 column图
	//column_chart2();

	//业务监控页面->营业厅前台->业务量 column图
	//line_chart1();

	//业务监控页面->营业厅前台->成功率  column图
	//line_chart2();

	//业务监控页面->营业厅前台->时长 column图
	//line_chart3();
});
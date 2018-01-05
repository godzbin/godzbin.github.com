Ext.ns("detailMonitorChart");
detailMonitorChart.areaChart = function(chartId) {
	$(chartId).highcharts({
		credits: {
			enabled: false
		},
		animation: false,
		chart: {
			type: 'area'
		},
		title: {
			align: "high",
			text: "成功率%",
			rotation: 0,
			style: {
				'font-size': "12px"
			}
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
			categories: []
		},
		tooltip: {
			formatter: function() {
				return '<span>' + this.series.name + '</span>: <b>' +
					Highcharts.numberFormat(this.y * 100, 2, '.') + '%</b>';
			}
		},
		plotOptions: {
			series: {
				animation: false,
				marker: {
					symbol: "circle"
				}
			}
		},
		legend: {
			enabled: false
		},
		series: []
	});
};
detailMonitorChart.solidgauge = function(chartId) {
	$(chartId).highcharts({
		animation: false,
		credits: {
			enabled: false
		},
		drilldown: {
			animation: false
		},
		chart: {
			type: 'solidgauge'
		},
		title: {
			text: "",
			style: {
				height: 0
			}
		},
		tooltip: {
			borderWidth: 0,
			backgroundColor: 'none',
			shadow: false,
			style: {
				fontSize: '12px'
			},

			// formatter: function() {
			// 	console.log(this);
			// 	return '{series.name}<br><span style="font-size:1em; color: {point.color}; font-weight: bold">{point.name}:{point.value}%</span>';
			// },
			pointFormat: '<span style="font-size:1.2em;">{series.name}</span><br><span style="font-size:1.5em; color: {point.color}; font-weight: bold">{point.name}:{point.value}%</span>',
			positioner: function(labelWidth, labelHeight) {
				return {
					x: 0,
					y: 0
				};
			}
		},

		pane: {
			startAngle: 0,
			endAngle: 360,
			background: []
			// background: [{ // Track for Move
			// 	outerRadius: '112%',
			// 	innerRadius: '88%',
			// 	backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
			// 	borderWidth: 0
			// }, { // Track for Exercise
			// 	outerRadius: '87%',
			// 	innerRadius: '63%',
			// 	backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.3).get(),
			// 	borderWidth: 0
			// }, { // Track for Stand
			// 	outerRadius: '62%',
			// 	innerRadius: '38%',
			// 	backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.3).get(),
			// 	borderWidth: 0
			// }]
		},
		legend: {
			enabled: false
		},
		yAxis: {
			min: 0,
			max: 100,
			lineWidth: 0,
			tickPositions: []
		},
		plotOptions: {
			solidgauge: {
				borderWidth: '18px',
				linecap: 'square',
				stickyTracking: false,
				dataLabels: {
					enabled: false
				}
			},
			series: {
				animation: false
			}
		},

		series: []
	});
};
detailMonitorChart.chart3 = function(chartId) {
	$(chartId).highcharts({
		animation: false,
		drilldown: {
			animation: false
		},
		credits: {
			enabled: false
		},
		chart: {
			type: 'scatter',
			zoomType: 'xy'
		},
		title: {
			text: ''
		},
		xAxis: {
			title: {
				enabled: true,
				text: ''
			},
			tickInterval: 60,
			startOnTick: true,
			// endOnTick: true,
			// showLastLabel: true,
			labels: {
				formatter: function() {
					return Ext.Date.format(new Date(this.value * 1000), 'H:i');
				}
			}
		},
		yAxis: {
			title: {
				enabled: true,
				text: ''
			},
			labels: {
				formatter: function() {
					return this.value + "s";
				}
			}
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
			borderWidth: 1
		},
		tooltip: {
			// enabled: false,
			formatter: function() {
				return "<p style='color:" + this.color + "'>" + this.series.name + "</p><br>" + "办理时间：" + Ext.Date.format(new Date(this.point.x * 1000), 'H:i') + ", 业务时长：" + (this.point.y).toFixed(2) + "s"
			}
		},
		plotOptions: {
			scatter: {
				marker: {
					radius: 3,
					states: {
						hover: {
							enabled: true,
							lineColor: 'rgb(100,100,100)'
						}
					}
				},
				states: {
					hover: {
						marker: {
							enabled: false,
							symbol: "circle"
						}
					}
				}
			},
			series: {
				animation: false,
				marker: {
					symbol: "circle"
				},
				point: {
					events: {
						click: function(e) {
							var busiId = this.options.busiId;
							if(busiId){
								ctrl.detailMonitor.getBusiness(busiId);
							}
						}
					}
				}

			}
		},
		series: []
	});
}
Ext.ns("view");
// 主界面
view.main = {
	interface: function() {
		var width = Ext.getBody().getWidth();
		Ext.create("Ext.container.Viewport", {
			id: "interface",
			// layout: "fit",
			// overflowX: 'scroll',
			cls: "viewport",
			style: {
				'background-size': width + "px"
			},
			autoScroll: true,
			height: "100%",
			html: "<div style='width:60px;height:60px;' class='loading'></div>",
			items: [this.top(), this.content()]
		}).show();
	},
	top: function() {
		var width = Ext.getBody().getWidth();
		var margin = 0;
		if (width > configs.contentWidth) {
			margin = (width - configs.contentWidth) / 2
		}
		var top = Ext.create("Ext.panel.Panel", {
			region: "north",
			layout: "border",
			height: 80,
			border: 0,
			cls: "viewport",
			style: {
				'background-position': "-" + margin + "px 0",
				'background-size': width + "px",
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				'z-index': 999
			},
			maxWidth: configs.contentWidth,
			margin: "0 0 0 " + margin,
			items: [this.logo(), this.menu()],
			renderTo: Ext.getBody()
		});
		return top;
	},
	logo: function() {
		var logo = Ext.create("Ext.panel.Panel", {
			region: "west",
			width: 250,
			height: 80,
			border: 0,
			cls: "logo",
			style: {
				// backgroundColor: "#E7F1F0"
			},
			renderTo: Ext.getBody()
		});
		return logo;
	},
	menu: function() {
		var menu = Ext.create("Ext.panel.Panel", {
			id: "mainMenu",
			border: 0,
			layout: "hbox",
			region: "east",
			plain: true,
			width: "60%",
			cls: "top-menu",
			style: {
				'border-radius': "4px 4px"
			},
			defaults: {
				style: {
					fontWeight: "500"
				}
			},
			items: [
				this.menuLi(configs.menu[0], "menu1"),
				this.menuLi(configs.menu[1], "menu2"),
				this.menuLi(configs.menu[2], "menu3"),
				this.menuLi(configs.menu[3], "menu4")
			],
			renderTo: Ext.getBody()
		}).show();
		return menu;
	},
	menuLi: function(text, id) {
		var text = text || "";
		var id = id || null;
		var buttonMenu;
		if (id == "menu1") {
			buttonMenu = this.buttonMenu1();
		}
		var button = Ext.create("Ext.button.Button", {
			id: id,
			_id: id,
			text: text,
			maxWidth: 150,
			minWidth: 120,
			cls: "top-menu-li",
			handler: ctrl.clickMenu,
			menu: buttonMenu
		});
		return button;
	},
	buttonMenu1: function() {
		var menu = Ext.create("Ext.menu.Menu", {
			id: "childMenu",
			plain: true,
			width: 120,
			defaults: {
				padding: 5
			},
			border: 0,
			items: [{
				_id: "menu1chlid1",
				text: configs.childMenu.busiMoitor[0],
				// border: 0,
				style: {
					'border-bottom': "1px #ccc solid"
				},
				cls: "top-menu-li-buttonMenu",
				handler: ctrl.clickMenu
			}, {
				_id: "menu1chlid2",
				text: configs.childMenu.busiMoitor[1],
				border: 0,
				cls: "top-menu-li-buttonMenu",
				handler: ctrl.clickMenu
			}]
		});
		return menu;
	},
	content: function() {
		var width = Ext.getBody().getWidth();
		var margin = 0;
		if (width > configs.contentWidth) {
			margin = (width - configs.contentWidth) / 2
		}
		var content = Ext.create("Ext.panel.Panel", {
			id: "content",
			region: "center",
			border: 0,
			cls: "viewport",
			margin: "0 0 0 0",
			layout: "fit",
			defaults: {
				margin: "0 0 0 " + margin,
				// margin: '0 auto',
				width: configs.contentWidth,
				maxWidth: configs.contentWidth,
				style: {
					backgroundColor: "#fff",
					width: configs.contentWidth,
					'position': "relative !important"
				}
			},
			// autoScroll: true,
			items: [],
			cls: "content",
			dockedItems: [{
				id: "contentTools",
				margin: "80 0 0 " + margin,
				maxWidth: configs.contentWidth,
				width: configs.contentWidth,
				xtype: 'toolbar',
				dock: 'top',
				border: 0,
				padding: 0,
				height: 50,
				style: {
					background: "#F3F9F2",
					position: "fixed !important",
					// position: "relative",
					right: 0,
					left: 0,
					// top: "80px !important",
					'z-index': "99"
				},
				defaults: {
					border: 0,
					padding: 0
				},

				items: []
			}]
		});
		return content;
	},
	line: function(margin) {
		var margin = margin || "10 0 10 0";
		var line = Ext.create("Ext.panel.Panel", {
			width: "100%",
			columnWidth: 1,
			border: 0,
			padding: 0,
			margin: margin,
			cls: "line",
			height: 1
		});
		return line;
	}
};
// 业务监控----------------------------------------------
view.busiMoitor = {
	// 概况
	busiProfile: {
		content: function() {
			var content = Ext.create("Ext.panel.Panel", {
				id: configs.pageId.busiProfile,
				border: 0,
				defaults: {
					padding: "10 40 0 40"
				},
				items: [this.top.content(), this.mainTop.content(), this.mainCenter.content()]
			});
			return content;
		},
		tools: function() {
			var icon = Ext.create("Ext.panel.Panel", {
				margin: "0 0 0 20",
				width: 50,
				height: 35,
				cls: "i_title",
				border: 0
			});
			var text = Ext.create("Ext.form.Label", {
				text: configs.menu[0],
				width: 100,
				style: {
					fontSize: "18px",
					fontWeight: "400"
				}
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				queryMode: 'local',
				id: configs.busiProfile.busiProfileArea,
				store: Ext.StoreMgr.get("area"),
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				value: "GUANG_ZHOU",
				margin: 10,
				cls: "topTools",
				fieldStyle: {
					background: "#F3F9F2",
					margin: "5px",
					fontWeight: "400"
				},
				labelWidth: 0,
				labelAlign: "right",
				height: 30,
				width: 80
			});


			var childMenu = configs.childMenu.busiMoitor;
			var button1 = Ext.create("Ext.panel.Panel", {
				_id: "menu1chlid1",
				width: 80,
				style: {
					textAlign: "center"
				},
				items: [{
					style: {
						fontSize: "15px",
						textAlign: "center"
					},
					xtype: "label",
					text: childMenu[0],
					cls: "busiProfileToolsButton action"
				}],
				listeners: {
					'click': {
						element: "el",
						fn: ctrl.clickMenu
					}
				}
			});
			var line = Ext.create("Ext.form.Label", {

				text: "|",
				width: 1,
				style: {
					fontSize: "15px",
					textAlign: "center"
				}
			});
			var button2 = Ext.create("Ext.panel.Panel", {
				_id: "menu1chlid2",
				width: 80,
				style: {
					textAlign: "center"
				},
				items: [{
					style: {
						fontSize: "15px",
						textAlign: "center"
					},
					xtype: "label",
					text: childMenu[1],
					cls: "busiProfileToolsButton"
				}],
				listeners: {
					'click': {
						element: "el",
						fn: ctrl.clickMenu
					}
				}
			});
			var config = Ext.create("Ext.panel.Panel", {
				margin: "0 0 0 20",
				width: 35,
				height: 35,
				cls: "i_config",
				border: 0,
				// id: "openConfig",
				_id: "openConfig",
				listeners: {
					'click': {
						element: "el",
						fn: ctrl.clickMenu
					}
				}
			});
			var tools = Ext.create("Ext.toolbar.Toolbar", {
				width: "100%",
				defaults: {
					border: 0
				},
				id: configs.pageId.busiProfile + "tools",
				items: [icon, text, comboBox, button1, line, button2, "->", config]
			});
			return tools;
		},
		top: {
			content: function() {
				var top = Ext.create("Ext.panel.Panel", {
					layout: "hbox",
					border: 0,
					width: "100%",
					items: [this.topTimeComboBox(),
						this.topOpBution(),
						this.topRealTime()
					]
				});
				return top;
			},
			topTimeComboBox: function() {
				var store = Ext.create("Ext.data.Store", {
					fields: [configs.dimension.key, configs.dimension.value]
				});
				var comboBox = Ext.create("Ext.form.ComboBox", {
					queryMode: 'local',
					id: configs.busiProfile.busiProfileTime,
					store: store,
					editable: false,
					autoSelect: true,
					displayField: configs.dimension.key,
					valueField: configs.dimension.value,
					// value: 1,
					margin: 5,
					labelWidth: 40,
					labelAlign: "left",
					height: 20,
					fieldLabel: configs.msg.time,
					listeners: {
						change: ctrl.busiMoitor.busiProfileTimeChange
					},
					width: "20%"
				});
				return comboBox;
			},
			topOpBution: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					border: 0,
					width: "20%",
					defaults: {
						border: 0,
						width: 57,
						height: 30
					},
					items: [
						this.topButtonEnd(),
						this.topButtonStart()
					]
				});
				return panel;
			},
			topButtonStart: function() {
				var start = Ext.create("Ext.button.Button", {
					margin: "5 0 0 0",
					id: "busiProfileOpBtnStart",
					cls: "busiProfileOpBtn a_start action",
					text: "",
					handler: ctrl.busiMoitor.topButtonChanger,
					name: "start"
				});
				return start;
			},
			topButtonEnd: function() {
				var end = Ext.create("Ext.button.Button", {
					margin: "5 0 0 30",
					id: "busiProfileOpBtnStop",
					cls: "busiProfileOpBtn a_stop",
					text: "",
					handler: ctrl.busiMoitor.topButtonChanger,
					name: "stop"
				});
				return end;
			},
			topRealTime: function() {
				var label = Ext.create("Ext.panel.Panel", {
					border: 0,
					margin: "10 10 0 0",
					width: 500,
					cls: "busiProfileTopRealTime",
					html: "<div id='topRealTime'></div>"
				});
				return label;
			}
		},
		mainTop: {
			content: function() {
				var content = Ext.create("Ext.panel.Panel", {
					layout: "column",
					border: 0,
					defaults: {
						columnWidth: 1 / 2,
						border: 1,
						padding: "5 10 10 5",
						height: 120,
						cls: "busiProfileMainTop"
					},
					items: [this.handling(), this.rate(), this.duration(), this.alarm()]
				});
				return content;
			},
			handling: function() {
				var leftText = Ext.create("Ext.panel.Panel", {
					width: "25%",
					layout: "vbox",
					cls: "mainTopLeft",
					defaults: {
						width: "100%",
						xtype: "label"
					},
					items: [{
						text: "",
						id: "busiProfileHandlingLabel",
						cls: "mainTopLeftText"
					}, {
						text: configs.msg.handling,
						cls: "mainTopLeftLabel"
					}]
				});
				var gauge = Ext.create("Ext.panel.Panel", {
					html: "<div id='busiProfileHandlingGauge' class='chart'></div>",
					overflowX: "auto",
					margin: "5 0 0 0",
					width: "35%"
				});
				var char = Ext.create("Ext.panel.Panel", {
					html: "<div id='busiProfileHandlingChart' class='chart'></div>",
					overflowX: "auto",
					border: 0,
					width: "40%"
				});

				var panel = Ext.create("Ext.panel.Panel", {
					defaults: {
						border: 0,
						height: 100
					},

					layout: 'hbox',
					items: [leftText, gauge, char]
				});
				return panel;
			},
			rate: function() {
				var leftText = Ext.create("Ext.panel.Panel", {
					width: "25%",
					layout: "vbox",
					cls: "mainTopLeft",
					defaults: {
						width: "100%",
						xtype: "label"
					},
					items: [{
						text: "",
						id: "busiProfileRateLabel",
						cls: "mainTopLeftText"
					}, {
						text: configs.msg.rate,
						cls: "mainTopLeftLabel"
					}]
				});
				var gauge = Ext.create("Ext.panel.Panel", {
					// id: "busiProfileRateGauge",
					html: "<div id='busiProfileRateGauge' class='chart'></div>",
					overflowX: "auto",
					margin: "5 0 0 0",
					width: "35%"
				});
				var char = Ext.create("Ext.panel.Panel", {
					// id: "busiProfileRateChar",
					html: "<div id='busiProfileRateChart' class='chart'></div>",

					overflowX: "auto",
					border: 0,
					width: "40%",
					height: 100
				});
				var panel = Ext.create("Ext.panel.Panel", {
					defaults: {
						border: 0,
						height: 100
					},
					layout: 'hbox',
					items: [leftText, gauge, char]
				});
				return panel;
			},
			duration: function() {
				var leftText = Ext.create("Ext.panel.Panel", {
					width: "25%",
					layout: "vbox",
					cls: "mainTopLeft",
					defaults: {
						// margin: "10 0 10 0",
						width: "100%",
						xtype: "label"
					},
					items: [{
						text: "",
						id: "busiProfileDurationLabel",
						cls: "mainTopLeftText"
					}, {
						text: configs.msg.busiDuration,
						cls: "mainTopLeftLabel"
					}]
				});
				var gauge = Ext.create("Ext.panel.Panel", {
					// id: "busiProfileDurationGauge",
					html: "<div id='busiProfileDurationGauge' class='chart'></div>",

					overflowX: "auto",
					margin: "5 0 0 0",
					width: "35%"
				});
				var char = Ext.create("Ext.panel.Panel", {
					// id: "busiProfileDurationChar",
					html: "<div id='busiProfileDurationChart' class='chart'></div>",

					overflowX: "auto",
					border: 0,
					width: "40%",
					height: 100
				});
				var panel = Ext.create("Ext.panel.Panel", {
					defaults: {
						border: 0,
						height: 100
					},
					layout: 'hbox',
					items: [leftText, gauge, char]
				});
				return panel;
			},
			alarm: function() {
				var leftText = Ext.create("Ext.panel.Panel", {
					width: "25%",
					layout: "vbox",
					cls: "mainTopLeft",
					defaults: {
						width: "100%",
						xtype: "label"
					},
					items: [{
						text: "",
						id: "busiProfileAlarmLabel",
						cls: "mainTopLeftText"
					}, {
						text: configs.msg.alarm,
						cls: "mainTopLeftLabel"
					}]
				});
				var gauge = Ext.create("Ext.panel.Panel", {
					// id: "busiProfileAlarmGauge",
					html: "<div id='busiProfileAlarmGauge' class='chart'></div>",

					overflowX: "auto",
					margin: "5 0 0 0",
					width: "35%"
				});
				var char = Ext.create("Ext.panel.Panel", {
					// id: "busiProfileAlarmChar",
					html: "<div id='busiProfileAlarmChart' class='chart'></div>",

					overflowX: "auto",
					border: 0,
					width: "40%"
				});
				var panel = Ext.create("Ext.panel.Panel", {
					defaults: {
						border: 0,
						height: 100
					},

					layout: 'hbox',
					items: [leftText, gauge, char]
				});
				return panel;
			}
		},
		mainCenter: {
			content: function() {
				var content = Ext.create("Ext.panel.Panel", {
					border: 0,
					defaults: {
						layout: 'hbox'
					},
					items: [this.buttonPanel(), this.gridPanel(), this.trendAnalysis()]
				});
				return content;
			},
			buttonPanel: function() {
				var buttons = Ext.create("Ext.panel.Panel", {
					id: "busiProfileChannel",
					border: 0,
					style: {
						textAlign: "center"
					},
					padding: "0 0 10 0",
					defaults: {
						xtype: "button",
						cls: "busiMoitorBtn",
						width: 100,
						height: 25
					},
					items: [{
							text: "营业厅",
							id: "busiProfileChannel1",
							cls: "busiMoitorBtn action",
							channelId: configs.channelId.busiHall,
							handler: ctrl.busiMoitor.busiProfileChannelChange
						}
						// , {
						// 	text: "电渠",
						// 	channelId: configs.channelId.eleChannel,
						// 	id: "busiProfileChannel2",
						// 	handler: ctrl.busiMoitor.busiProfileChannelChange
						// }
					]
				});
				return buttons;
			},
			gridPanel: function() {
				var gridPanel = Ext.create("Ext.panel.Panel", {
					id: "gridPanel",
					border: 0,
					height: 200,
					layout: "hbox",
					margin: "10 0 0 0",
					defaults: {
						height: "100%"
					},
					items: [this.busiProfileGrid(), this.busiAlarmGrid()]
				});
				return gridPanel;
			},
			busiProfileGrid: function() {
				var text = configs.busiProfileGridText;
				var name = configs.busiProfileGridName;
				var store = Ext.create("Ext.data.Store", {
					storeId: "busiProfileGrid",
					fields: [name.busiName, name.handling, name.duration, name.rate]
				});
				var grid = Ext.create("Ext.grid.Panel", {
					width: "49%",
					store: Ext.data.StoreManager.lookup(store),
					title: "业务概况",
					columns: {
						items: [{
							text: text.busiName,
							dataIndex: name.busiName
						}, {
							text: text.handling,
							dataIndex: name.handling
						}, {
							text: text.duration,
							dataIndex: name.duration,
							renderer: function(value) {
								value = value || 0;
								return ((value * configs.testTime).toFixed(2) || 0) + "s"
							}
						}, {
							text: text.rate,
							dataIndex: name.rate,
							renderer: function(value) {
								value = value || 0;
								return (value * 100 || 0).toFixed(2) + "%"
							}
						}],
						defaults: {
							style: {
								textAlign: "center",
								'border': "0px"
							},
							align: 'center',
							renderer: function(value) {
								return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
							}
						}
					},
					forceFit: true,
					renderTo: Ext.getBody()
				});
				return grid;
			},
			busiAlarmGrid: function() {
				var text = configs.busiAlarmGridText;
				var name = configs.busiAlarmGridName;
				var store = Ext.create("Ext.data.Store", {
					storeId: "busiAlarmGrid",
					fields: [name.busiName, name.msg, name.time, name.duration,
						name.recentAlarm,
						name.op
					]
				});
				var grid = Ext.create("Ext.grid.Panel", {
					margin: "0 0 0 25",
					width: "49%",
					store: Ext.data.StoreManager.lookup(store),
					title: "业务告警",
					columns: {
						items: [{
								text: text.busiName,
								dataIndex: name.busiName,
								width: 100
							}, {
								text: text.msg,
								dataIndex: name.msg,
								width: 180,
								renderer: function(value, column, recode) {
									console.log(this);
									console.log(recode);
									var text = "";
									var min = recode.get("duration") + "分钟内";
									var rule = "";
									var ruleAnd = "";
									if (value == 1) {
										rule = configs.msg.ruleTypeIsFailed;
										ruleAnd = recode.get("failedCount") + "次";
									} else {
										rule = configs.msg.ruleTypeIsSuccess;
										ruleAnd = recode.get("sysSuccRate") + "%";
									}
									text = min + rule + ruleAnd;
									return text;
								}
							}, {
								text: text.time,
								dataIndex: name.time,
								width: 120
							}, {
								text: text.duration,
								dataIndex: name.duration
							}, {
								text: text.recentAlarm,
								dataIndex: name.recentAlarm
							}
							// , {
							// 	text: text.op,
							// 	dataIndex: name.op,
							// 	width: 50,
							// 	renderer: function(value, recode) {
							// 		recode.style = "padding: 5px 0;"
							// 		var button = "<button class='busiAlarmGridBtn busiProfileAlarmGridBtn'>" + configs.msg.look + "</button>";
							// 		return button;
							// 	}
							// }
						],
						defaults: {
							style: {
								textAlign: "center",
								fontSize: "12px"
							},
							align: 'center',
							renderer: function(value) {
								return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
							}
						}
					},
					forceFit: true,
					renderTo: Ext.getBody()
				});
				return grid;
			},
			trendAnalysis: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					border: 0,
					margin: "10 0 10 0",
					width: "100%",
					items: [
						this.trendAnalysisTitle(),
						this.trendAnalysisPanel()
					]
				});
				return panel;
			},
			trendAnalysisTitle: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					id: "trendAnalysisTitle",
					width: "100%",
					height: 25,
					padding: "5 0 0 10",
					overflowX: "auto",
					layout: "column",
					border: 0,
					cls: "x-panel-header-default",
					items: [{
						xtype: "label",
						text: "趋势分析",
						columnWidth: 1 / 2,
						height: 40,
						style: {
							color: "#fff",
							fontSize: "14px",
							fontWeight: "400"
						}
					}, {
						xtype: "panel",
						border: 0,
						columnWidth: 1 / 2,
						style: {
							textAlign: "right"
						},
						items: [{
							xtype: "label",
							text: "最近【1小时】",
							height: 40,
							style: {
								color: "#000",
								fontSize: "14px",
								fontWeight: "400"
							}
						}]
					}]
				});
				return panel;
			},
			trendAnalysisPanel: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					border: 1,
					margin: "10 0 10 0",
					width: "100%",
					defaults: {
						height: 250,
						border: 0,
						margin: "0 0 10 0",
						width: "100%"
							// padding: "0 0 10 0"
					},
					items: [
						this.busiHandlingTrend(),
						this.busiRateTrend(),
						this.busiDurationTrend()
					]
				});
				return panel;
			},
			busiHandlingTrend: function() {
				var panel = Ext.create("Ext.panel.Panel", {

					defaults: {
						height: 200,
						// border: 0,
						width: "100%",
						margin: "10 0 10 0",
						overflowX: "auto"
					},
					items: [{
						xtype: "panel",
						border: 0,
						// id: "busiHandlingTrend",
						html: "<div id='busiHandlingTrend' class='chart'></div>"

					}],
					dockedItems: [{
						xtype: 'toolbar',
						dock: 'top',
						border: 0,
						padding: 5,
						style: {
							background: "#D5EBE7"
						},
						items: [{
							xtype: "label",
							text: "业务量/笔"
						}]
					}]
				});
				return panel;
			},
			busiRateTrend: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					defaults: {
						height: 200,
						// border: 0,
						width: "100%",
						margin: "10 0 10 0",
						overflowX: "auto"
					},
					items: [{
						xtype: "panel",
						border: 0,
						// id: "busiRateTrend",
						html: "<div id='busiRateTrend' class='chart'></div>"

					}],
					dockedItems: [{
						xtype: 'toolbar',
						dock: 'top',
						border: 0,
						padding: 5,
						style: {
							background: "#D5EBE7"
						},
						items: [{
							xtype: "label",
							text: "成功率/%"
						}]
					}]
				});
				return panel;
			},
			busiDurationTrend: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					defaults: {
						height: 200,
						// border: 0,
						width: "100%",
						margin: "10 0 10 0",
						overflowX: "auto"
					},
					items: [{
						xtype: "panel",
						border: 0,
						// id: "busiDurationTrend",
						html: "<div id='busiDurationTrend' class='chart'></div>"

					}],
					dockedItems: [{
						xtype: 'toolbar',
						dock: 'top',
						border: 0,
						padding: 5,
						style: {
							background: "#D5EBE7"
						},
						items: [{
							xtype: "label",
							text: "业务时长/s"
						}]
					}]


				});
				return panel;
			}
		}
	},
	// 明细
	detailMonitor: {
		content: function() {
			var content = Ext.create("Ext.panel.Panel", {
				id: configs.pageId.detailMonitor,
				border: 0,
				defaults: {
					padding: "10 40 0 40"
				},
				items: [this.top.content(), this.main.content(), this.busiGrid.content()]

			});
			return content;
		},
		tools: function() {
			var icon = Ext.create("Ext.panel.Panel", {
				margin: "0 0 0 20",
				width: 50,
				height: 35,
				cls: "i_title",
				border: 0
			});
			var text = Ext.create("Ext.form.Label", {
				text: configs.menu[0],
				width: 100,
				style: {
					fontSize: "18px",
					fontWeight: "400"
				}
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				queryMode: 'local',
				id: configs.detailMonitor.detailMonitorArea,
				store: Ext.StoreMgr.get("area"),
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				value: "GUANG_ZHOU",
				margin: 10,
				cls: "topTools",
				fieldStyle: {
					background: "#F3F9F2",
					margin: "5px",
					fontWeight: "400"
				},
				labelWidth: 0,
				labelAlign: "right",
				height: 30,
				width: 80
			});


			var childMenu = configs.childMenu.busiMoitor
			var button1 = Ext.create("Ext.panel.Panel", {
				_id: "menu1chlid1",
				width: 80,
				style: {
					textAlign: "center"
				},
				items: [{
					style: {
						fontSize: "15px",
						textAlign: "center"
					},
					xtype: "label",
					text: childMenu[0],
					cls: "busiProfileToolsButton "
				}],
				listeners: {
					'click': {
						element: "el",
						fn: ctrl.clickMenu
					}
				}
			});
			var line = Ext.create("Ext.form.Label", {
				text: "|",
				width: 1,
				style: {
					fontSize: "15px",
					textAlign: "center"
				}
			});
			var button2 = Ext.create("Ext.panel.Panel", {
				_id: "menu1chlid2",
				width: 80,
				style: {
					textAlign: "center"
				},
				items: [{
					style: {
						fontSize: "15px",
						textAlign: "center"
					},
					xtype: "label",
					text: childMenu[1],
					cls: "busiProfileToolsButton action"
				}],
				listeners: {
					'click': {
						element: "el",
						fn: ctrl.clickMenu
					}
				}
			});
			var config = Ext.create("Ext.panel.Panel", {
				margin: "0 0 0 20",
				width: 35,
				height: 35,
				cls: "i_config",
				border: 0,
				_id: "openConfig",
				listeners: {
					'click': {
						element: "el",
						fn: ctrl.clickMenu
					}
				}
			});
			var tools = Ext.create("Ext.toolbar.Toolbar", {
				width: "100%",
				defaults: {
					border: 0
				},
				id: configs.pageId.detailMonitor + "tools",
				items: [icon, text, comboBox, button1, line, button2, "->", config]
			});
			return tools;
		},
		top: {
			content: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					border: 0,
					items: [this.topPanel(),
						this.selectPanel()
					]
				});
				return panel;
			},
			topPanel: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					border: 0,
					layout: "hbox",
					items: [this.buttonPanel(), this.topOpBution(), this.topRealTime()]
				});
				return panel;
			},
			buttonPanel: function() {
				var buttons = Ext.create("Ext.panel.Panel", {
					id: "detailMonitorChannel",
					width: "50%",
					border: 0,
					padding: "0 0 10 0",
					defaults: {
						xtype: "button",
						cls: "busiMoitorBtn",
						width: 100,
						height: 25
					},
					items: [{
							text: "营业厅",
							id: "detailMonitorChannel1",
							cls: "busiMoitorBtn action",
							channelId: configs.channelId.busiHall
								// handler: ctrl.detailMonitor.busiProfileChannelChange
						},
						//  {
						// 	text: "电渠",
						// 	channelId: configs.channelId.eleChannel,
						// 	id: "detailMonitorChannel2",
						// 	handler: ctrl.detailMonitor.busiProfileChannelChange
						// }
					]
				});
				return buttons;
			},
			topOpBution: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					border: 0,
					width: "20%",
					defaults: {
						border: 0,
						width: 57,
						height: 30
					},
					items: [
						this.topButtonEnd(),
						this.topButtonStart()
					]
				});
				return panel;
			},
			topButtonStart: function() {
				var start = Ext.create("Ext.button.Button", {
					margin: "0 0 0 0",
					id: "detailMonitorOpBtnStart",
					cls: "busiProfileOpBtn a_start action",
					text: "",
					handler: ctrl.detailMonitor.topButtonChanger,
					name: "start"
				});
				return start;
			},
			topButtonEnd: function() {
				var end = Ext.create("Ext.button.Button", {
					margin: "0 0 0 30",
					id: "detailMonitorOpBtnStop",
					cls: "busiProfileOpBtn a_stop",
					text: "",
					handler: ctrl.detailMonitor.topButtonChanger,
					name: "stop"
				});
				return end;
			},
			topRealTime: function() {
				var label = Ext.create("Ext.panel.Panel", {
					border: 0,
					// padding: "0 0 10 0",
					margin: "5 0 0 0",
					width: "30%",
					height: 30,
					cls: "busiProfileTopRealTime",
					html: "<div id='detailMonitorTopRealTime' style='font-size: 14px;'></div>"
				});
				return label;
			},
			selectPanel: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					border: 0,
					layout: "hbox",
					items: [
						this.transactionChannelComboBox(),
						this.busiTypeTag(), {
							xtype: "button",
							border: 0,
							margin: 5,
							width: 100,
							style: {
								background: "#7FC533"
							},
							text: configs.msg.select,
							handler: ctrl.detailMonitor.selectBtnClick
						}
					]
				});
				return panel;
			},
			transactionChannelComboBox: function() {
				var comboBox = Ext.create("Ext.form.ComboBox", {
					id: configs.detailMonitor.detailMonitorTC,
					fieldLabel: configs.msg.transactionChannel,
					renderTo: Ext.getBody(),
					labelWidth: 60,
					width: "30%",
					editable: false,
					border: 0,
					store: Ext.create("Ext.data.Store", {
						fields: ["name", "channel"]
					}),
					valueField: "channel",
					displayField: "name",
					queryMode: 'local',
					triggerAction: 'all',
					value: "",
					maxHeight: 50,
					margin: 5
				});
				return comboBox;
			},
			busiTypeTag: function() {
				var store = Ext.create("Ext.data.Store", {
					storeId: configs.detailMonitor.detailMonitorBusiType,
					fields: [configs.dimension.key, configs.dimension.value]
				});
				var tag = Ext.create("Ext.form.field.Tag", {
					id: configs.detailMonitor.detailMonitorBusiType,
					fieldLabel: configs.msg.busiType,
					renderTo: Ext.getBody(),
					labelWidth: 60,
					width: "55%",
					editable: false,
					border: 0,
					store: store,
					valueField: configs.dimension.value,
					displayField: configs.dimension.key,
					queryMode: 'local',
					triggerAction: 'all',
					maxLength: 3,
					height: 25,
					margin: 5,
					listeners: {
						change: ctrl.detailMonitor.tagSelect
					}
				});
				return tag;
			}
		},
		main: {
			content: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					border: 0,
					items: [this.chartPanel(), this.busiDetailChart()]
				});
				return panel;
			},
			chartPanel: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					layout: "hbox",
					width: "100%",
					border: 0,
					defaults: {
						height: 280,
						border: 0
					},
					items: [this.mainLeft(), this.mainRigth()]
				});
				return panel;
			},
			mainLeft: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					width: "60%",

					items: [this.mainLeftTitle(), {
						width: "100%",
						height: 250,
						xtype: "panel",
						border: 0,
						items: [{
							xtype: "form",
							layout: "hbox",
							width: "100%",
							height: 30,
							id: "mainLeftBusiNameRadio"
						}, {
							xtype: "panel",
							height: 220,
							html: "<div id='detailMonitorChart1' class='chart'></div>"
						}]
					}],
					margin: "0 5 5 0"
				});
				return panel;
			},
			mainLeftTitle: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					width: "100%",
					height: 25,
					padding: "5 0 0 10",
					overflowX: "auto",
					layout: "column",
					border: 0,
					cls: "x-panel-header-default",
					style: {
						'background-position': "-80px center"
					},
					items: [{
						xtype: "label",
						text: "成功率趋势",
						height: 40,
						columnWidth: 1 / 2,
						style: {
							color: "#fff",
							fontSize: "14px",
							fontWeight: "400"
						}
					}, {
						xtype: "panel",
						border: 0,
						columnWidth: 1 / 2,
						style: {
							textAlign: "right"
						},
						items: [{
							xtype: "label",
							text: "最近【1小时】",
							height: 40,
							style: {
								color: "#000",
								fontSize: "14px",
								fontWeight: "400"
							}
						}]
					}]
				});
				return panel;
			},
			mainRigth: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					width: "40%",
					items: [this.mainRigthTitle(), {
						width: "100%",
						height: 250,
						xtype: "panel",
						defaults: {
							border: 0
						},
						items: [{
							xtype: "panel",
							border: 0,
							height: 200,
							html: "<div id='detailMonitorChart2' class='chart'></div>"
						}, {
							xtype: "panel",
							height: 200,
							width: "100%",
							style: {
								position: "absolute",
								top: 0,
								left: 0
							},
							html: "<div id='detailMonitorChartDataLabel'>" +
								"<div class='title1'></div>" +
								"<div class='title2'></div>" +
								"<div class='title3'></div>" +
								"</div>"
						}, {
							xtype: "panel",
							style: {
								textAlign: "center"
							},
							border: 0,
							height: 50,
							layout: "hbox",
							margin: "10 0 0 20",
							defaults: {
								width: 80,
								border: 0,
								margin: "0 5 0 5"
							},
							items: [{
								xtype: "panel",
								html: "<div style='float:left;width:15px;height:15px;background-color:" + configs.statusColor[0] + "'></div><span>成功</span>"
							}, {
								xtype: "panel",
								html: "<div style='float:left;width:15px;height:15px;background-color:" + configs.statusColor[1] + "'></div><span>系统失败</span>"

							}, {
								xtype: "panel",
								html: "<div style='float:left;width:15px;height:15px;background-color:" + configs.statusColor[2] + "'></div><span>业务失败</span>"
							}]
						}]
					}],
					margin: "0 0 5 5"
				});
				return panel;
			},
			mainRigthTitle: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					width: "100%",
					height: 25,
					padding: "5 0 0 10",
					overflowX: "auto",
					border: 0,
					cls: "x-panel-header-default",
					layout: "column",
					items: [{
						xtype: "label",
						text: "状态分布",
						height: 40,
						columnWidth: 1 / 2,
						style: {
							color: "#fff",
							fontSize: "14px",
							fontWeight: "400"
						}
					}, {
						xtype: "panel",
						border: 0,
						columnWidth: 1 / 2,
						style: {
							textAlign: "right"
						},
						items: [{
							xtype: "label",
							text: "最近【1小时】",
							height: 40,
							style: {
								color: "#000",
								fontSize: "14px",
								fontWeight: "400"
							}
						}]
					}]
				});
				return panel;
			},
			busiDetailChart: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					width: "100%",
					height: 380,
					border: 0,
					margin: "5 0 5 0",
					items: [this.busiDetailChartTitle(), {
						width: "100%",
						height: 350,
						xtype: "panel",
						items: [{
							xtype: "form",
							layout: "hbox",
							width: "100%",

							height: 30,
							id: "busiNameRadio"
						}, {
							width: "100%",
							height: 320,
							xtype: "panel",
							html: "<div id='detailMonitorChart3' class='chart'></div>"
						}]

					}]

				});
				return panel;
			},
			busiDetailChartTitle: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					width: "100%",
					height: 25,
					padding: "5 0 0 10",
					overflowX: "auto",
					layout: "column",
					border: 0,
					cls: "x-panel-header-default",
					items: [{
						xtype: "label",
						text: "业务明细",
						height: 40,
						columnWidth: 1 / 2,
						style: {
							color: "#fff",
							fontSize: "14px",
							fontWeight: "400"
						}
					}, {
						xtype: "panel",
						border: 0,
						columnWidth: 1 / 2,
						style: {
							textAlign: "right"
						},
						items: [{
							xtype: "label",
							text: "最近【500笔】",
							height: 40,
							style: {
								color: "#000",
								fontSize: "14px",
								fontWeight: "400"
							}
						}]
					}]
				});
				return panel;
			}
		},
		busiGrid: {
			content: function() {
				var panel = Ext.create("Ext.panel.Panel", {
					id: "busiGridBox",
					border: 0,
					items: [this.gridPanelDemo("busiGridBox0", ""),
						this.gridPanelDemo("busiGridBox1", ""),
						this.gridPanelDemo("busiGridBox2", "")
					]
				});
				return panel;
			},
			gridPanelDemo: function(gridId, title) {
				var title = title + " | 所有营业厅";
				var panel = Ext.create("Ext.panel.Panel", {
					id: gridId,
					border: 0,
					width: "100%",
					height: 330,
					margin: "5 0 5 0",
					items: [this.gridTitleDemo(title), this.gridDemo(gridId, title)]
				});
				return　 panel;
			},
			gridTitleDemo: function(title) {
				var titleLength = title.length;
				var backgroundSizeWidth = 185 - titleLength * 15 + 15;
				var panel = Ext.create("Ext.panel.Panel", {
					width: "100%",
					height: 25,
					padding: "5 0 0 10",
					overflowX: "auto",
					border: 0,
					cls: "x-panel-header-default",
					style: {
						'background-position': "-" + backgroundSizeWidth + "px center"
					},
					layout: "column",
					items: [{
						xtype: "label",
						text: title,
						height: 40,
						columnWidth: 1 / 2,
						style: {
							color: "#fff",
							fontSize: "14px",
							fontWeight: "400"
						}
					}, {
						xtype: "panel",
						border: 0,
						columnWidth: 1 / 2,
						style: {
							textAlign: "right"
						},
						items: [{
							xtype: "label",
							text: configs.msg.nearly5Minutes,
							height: 40,
							style: {
								color: "#000",
								fontSize: "14px",
								fontWeight: "400"
							}
						}]
					}]
				});
				return panel;
			},
			gridDemo: function(gridId, title) {
				var name = configs.detailMonitorGridName;
				var text = configs.detailMonitorGridText;
				var store = Ext.create("Ext.data.Store", {
					fields: [name.busiType,
						name.channel,
						name.time,
						name.phone,
						name.operatorNo,
						name.duration,
						name.status
					]
				});
				var grid = Ext.create("Ext.grid.Panel", {
					id: gridId + "grid",
					width: "100%",
					height: 300,
					store: Ext.data.StoreManager.lookup(store),
					columns: {
						items: [{
							text: text.channel,
							dataIndex: name.channel,
							renderer: function(value) {
								var busiChannel = ctrl.detailMonitor.busiChannel;
								var name = busiChannel[value];
								if (!name) {
									name = busiChannel["UNKNOWN"];
								}
								return name;
							}
						}, {
							text: text.time,
							dataIndex: name.time
						}, {
							text: text.phone,
							dataIndex: name.phone
						}, {
							text: text.operatorNo,
							dataIndex: name.operatorNo
						}, {
							text: text.duration,
							dataIndex: name.duration,
							renderer: function(value) {
								return (parseFloat((value * configs.testTime).toFixed(2)) || 0) + "s";
							}
						}, {
							text: text.status,
							dataIndex: name.status,
							renderer: function(value, recode) {
								recode.style = "color:" + configs.statusColor[value] + ";"
								return ctrl.status[value];
							}
						}],
						defaults: {
							style: {
								textAlign: "center"
							},
							align: 'center'
						}
					},
					forceFit: true,
					renderTo: Ext.getBody()
				});
				return grid;
			}
		}
	}
};
// 业务监控结束------------------------------------------
// 
// 业务监控配置------------------------------------------
view.busiConfig = {
	content: function() {
		var content = Ext.create("Ext.panel.Panel", {
			id: configs.pageId.busiConfig,
			border: 0,
			defaults: {
				padding: "10 40 0 40"
			},
			items: [
				this.moitorConfig.content(),
				this.alarmConfig.content()
			],
			listeners: {
				hide: ctrl.busiConfig.hide,
				show: ctrl.busiConfig.show
			}
		});
		return content;
	},
	tools: function() {
		var icon = Ext.create("Ext.panel.Panel", {
			margin: "0 0 0 20",
			width: 50,
			height: 35,
			cls: "i_title",
			border: 0
		});
		var text = Ext.create("Ext.form.Label", {
			text: configs.menu[0],
			width: 100,
			style: {
				fontSize: "18px",
				fontWeight: "400"
			}
		});
		var childMenu = configs.childMenu.busiConfig;
		var button1 = Ext.create("Ext.form.Label", {
			text: childMenu[0],
			id: "busiConfigToolsButton1",
			width: 80,
			style: {
				fontSize: "15px",
				textAlign: "center"
			},
			cls: "busiConfigToolsButton action"
		});
		var line = Ext.create("Ext.form.Label", {
			text: "|",
			width: 1,
			style: {
				fontSize: "15px",
				textAlign: "center"
			}
		});
		var button2 = Ext.create("Ext.form.Label", {
			text: childMenu[1],
			width: 80,
			id: "busiConfigToolsButton2",
			style: {
				fontSize: "15px",
				textAlign: "center"
			},
			cls: "busiConfigToolsButton"
		});
		var tools = Ext.create("Ext.toolbar.Toolbar", {
			width: "100%",
			id: configs.pageId.busiConfig + "tools",
			items: [icon, text, button1, line, button2]
		});
		console.log(tools);
		return tools;
	},
	moitorConfig: {
		content: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				id: "moitorConfigContent",
				border: 0,
				defaults: {
					border: 0
				},
				items: [{
					xtype: "button",
					width: 100,
					text: "保存",
					margin: 10,
					handler: ctrl.busiConfig.moitorConfig.updateMoitorConfig
				}, {
					xtype: "button",
					width: 100,
					text: "返回",
					margin: 10,
					style: {
						backgroundColor: "#00B751"
					},
					handler: ctrl.busiConfig.returnMoitor
				}, this.top(), this.configGird()]
			});
			return panel;
		},
		top: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0
				},
				layout: "hbox",
				items: [this.areaComboBox(), this.channelComboBox(), this.searchPanel()]
			});
			return panel;
		},
		areaComboBox: function() {
			var comboBox = Ext.create("Ext.form.ComboBox", {
				id: "moitorConfigArea",
				queryMode: 'local',
				store: Ext.StoreMgr.get("area"),
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				value: "GUANG_ZHOU",
				margin: 10,
				labelWidth: 50,
				labelAlign: "left",
				height: 25,
				width: 180,
				fieldLabel: configs.msg.area,
				listeners: {
					change: ctrl.busiConfig.moitorConfig.getMoitorConfig
				}
			});
			return comboBox;
		},
		channelComboBox: function() {
			var comboBox = Ext.create("Ext.form.ComboBox", {
				id: "moitorConfigChannel",
				queryMode: 'local',
				store: Ext.StoreMgr.get("channel"),
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				value: 1,
				margin: 10,
				labelWidth: 50,
				labelAlign: "left",
				height: 25,
				width: 180,
				fieldLabel: configs.msg.channel,
				listeners: {
					'change': ctrl.busiConfig.moitorConfig.getMoitorConfig
				}
			});
			return comboBox;
		},
		searchPanel: function() {
			var panel = Ext.create("Ext.form.Panel", {
				id: "moitorConfigForm",
				layout: "hbox",
				margin: 10,
				items: [{
					xtype: "textfield",
					id: "moitorConfigsSearch",
					listeners: {
						specialKey: function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) { //响应回车  
								ctrl.busiConfig.moitorConfig.search();
							}
						}
					}
				}, {
					xtype: "button",
					margin: "0 0 0 10",
					text: "搜索",
					handler: ctrl.busiConfig.moitorConfig.search
				}]
			});
			return panel;
		},
		configGird: function() {
			var name = configs.moitorConfigName;
			var text = configs.moitorConfigText;
			var store = Ext.create("Ext.data.Store", {
				fields: [name.name, name.survey, name.keyBusi]
			});
			var grid = Ext.create("Ext.grid.Panel", {
				id: "moitorConfigGrid",
				width: "100%",
				height: 420,
				margin: "10 0 10 0",
				store: Ext.data.StoreManager.lookup(store),
				selType: 'cellmodel',
				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1
					})
				],
				columns: {
					items: [{
						text: text.name,
						dataIndex: name.name,
						renderer: function(value) {
							return value;
						}
					}, {
						text: text.survey,
						dataIndex: name.survey,
						renderer: function(value, record) {
							if (value) {
								record.tdStyle = "background: url('resources/images/check.png') no-repeat center;";
							} else {
								record.tdStyle = "background: url('resources/images/unchecked.png') no-repeat center;";
							}
							return "";
						},
						listeners: {
							click: function(grid, el, rowIndex, colIndex) {
								var store = grid.getStore();
								var rec = grid.getStore().getAt(rowIndex);
								var _NULLABLE = rec.get(name.survey);
								if (_NULLABLE) {
									rec.set(name.survey, 0);
								} else {
									var selects = 0;
									store.queryBy(function(recode, id) {
										var _NULLABLES = recode.get(name.survey);
										if (_NULLABLES) {
											selects++;
										}
									});
									if (selects == configs.passLimit.passLimitSurvey) {
										tools.toast(configs.msg.passLimitSurvey);
										return;
									}
									rec.set(name.survey, 1);
								}
								ctrl.busiConfig.moitorConfig.moitorConfigUpdate[rec.get("busi_name")] = rec
							}
						}
					}, {
						text: text.keyBusi,
						dataIndex: name.keyBusi,
						renderer: function(value, record) {
							if (value) {
								record.tdStyle = "background: url('resources/images/check.png') no-repeat center;";
							} else {
								record.tdStyle = "background: url('resources/images/unchecked.png') no-repeat center;";
							}
							return "";
						},
						listeners: {
							click: function(grid, el, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								var _NULLABLE = rec.get(name.keyBusi);
								if (_NULLABLE) {
									rec.set(name.keyBusi, 0);
								} else {
									var selects = 0;
									store.queryBy(function(recode, id) {
										var _NULLABLES = recode.get(name.keyBusi);
										if (_NULLABLES) {
											selects++;
										}
									});
									if (selects == configs.passLimit.passLimitKeyBusi) {
										tools.toast(configs.msg.passLimitKeyBusi);
										return;
									}
									rec.set(name.keyBusi, 1);
								}
								ctrl.busiConfig.moitorConfig.moitorConfigUpdate[rec.get("busi_name")] = rec
							}
						}
					}],
					defaults: {
						style: {
							textAlign: "center"
						},
						align: 'center',
						menuDisabled: true
					}
				},
				forceFit: true,
				renderTo: Ext.getBody()
			});
			return grid;
		}
	},
	alarmConfig: {
		content: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				id: "alarmConfigContent",
				border: 0,
				defaults: {
					border: 0
				},
				items: [{
					xtype: "button",
					width: 100,
					text: "保存",
					margin: 10,
					handler: ctrl.busiConfig.alarmConfig.updateAlarmConfig
				}, {
					xtype: "button",
					width: 100,
					text: "返回",
					margin: 10,
					style: {
						backgroundColor: "#00B751"
					},
					handler: ctrl.busiConfig.returnMoitor
				}, this.top(), this.configGird()]
			});
			return panel;
		},
		top: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0
				},
				layout: "hbox",
				items: [this.areaComboBox(), this.channelComboBox(), this.searchPanel()]
			});
			return panel;
		},
		areaComboBox: function() {
			var comboBox = Ext.create("Ext.form.ComboBox", {
				id: "alarmConfigArea",
				queryMode: 'local',
				store: Ext.StoreMgr.get("area"),
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				value: "GUANG_ZHOU",
				margin: 10,
				labelWidth: 50,
				labelAlign: "left",
				height: 25,
				width: 180,
				fieldLabel: configs.msg.area,
				listeners: {
					change: ctrl.busiConfig.alarmConfig.getAlarmConfig
				}
			});
			return comboBox;
		},
		channelComboBox: function() {
			var comboBox = Ext.create("Ext.form.ComboBox", {
				id: "alarmConfigChannel",
				queryMode: 'local',
				store: Ext.StoreMgr.get("channel"),
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				value: 1,
				margin: 10,
				labelWidth: 50,
				labelAlign: "left",
				height: 25,
				width: 180,
				fieldLabel: configs.msg.channel,
				listeners: {
					change: ctrl.busiConfig.alarmConfig.getAlarmConfig
				}
			});
			return comboBox;
		},
		searchPanel: function() {
			var panel = Ext.create("Ext.form.Panel", {
				layout: "hbox",
				margin: 10,
				items: [{
					xtype: "textfield",
					id: "alarmConfigsSearch",
					listeners: {
						specialKey: function(field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) { //响应回车  
								ctrl.busiConfig.alarmConfig.search();
							}
						}
					}
				}, {
					xtype: "button",
					margin: "0 0 0 10",
					text: "搜索",
					handler: ctrl.busiConfig.alarmConfig.search
				}]
			});
			return panel;
		},
		configGird: function() {
			var name = configs.alarmConfigName;
			var text = configs.alarmConfigText;
			var store = Ext.create("Ext.data.Store", {
				fields: [name.name, name.duration,
					name.rule, name.threshold, name.status
				]
			});
			var thisColumn;
			var grid = Ext.create("Ext.grid.Panel", {
				id: "alarmConfigGrid",
				width: "100%",
				height: 420,
				margin: "10 0 10 0",
				store: Ext.data.StoreManager.lookup(store),
				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1
					})
				],
				columns: {
					items: [{
						text: text.name,
						dataIndex: name.name
					}, {
						text: text.duration,
						dataIndex: name.duration,
						renderer: function(value) {
							return value + "分钟";
						},
						editor: {
							xtype: "numberfield",
							minValue: 3,
							maxValue: 15,
							keyNavEnabled: false
						}
					}, {
						text: text.rule,
						dataIndex: name.rule,
						renderer: function(value) {
							var text = "";
							if (value == 1) {
								text　 = configs.msg.ruleTypeIsFailed;
							} else if (value == 2) {
								text = configs.msg.ruleTypeIsSuccess;
							}
							return text;
						}

					}, {
						text: text.threshold,
						dataIndex: name.threshold,
						renderer: function(value, column) {
							var rec = column.record;
							var rule = rec.get(name.rule);
							if (rule == 1) {
								value = value + "次";
							} else {
								value = value + "%";
							}
							return value;
						},
						editor: {
							xtype: "numberfield",
							minValue: 0,
							// maxValue: 100,
							keyNavEnabled: false
						}
					}, {
						text: text.status,
						dataIndex: name.status,
						renderer: function(value, record) {
							if (value) {
								record.tdStyle = "background: url('resources/images/check.png') no-repeat center;";
							} else {
								record.tdStyle = "background: url('resources/images/unchecked.png') no-repeat center;";
							}
							return;
						},
						listeners: {
							click: function(grid, el, rowIndex, colIndex) {
								var rec = grid.getStore().getAt(rowIndex);
								var _NULLABLE = rec.get(name.status);
								if (_NULLABLE) {
									rec.set(name.status, false);
								} else {
									rec.set(name.status, true);
								}
							}
						}
					}],
					defaults: {
						style: {
							textAlign: "center"
						},
						align: 'left',
						menuDisabled: true
					}
				},
				forceFit: true,
				renderTo: Ext.getBody()
			});
			return grid;
		}
	}
};
// 业务监控配置结束-------------------------------------
// 
// 
// 业务追踪----------------------------------------------
view.busiTrack = {
	content: function() {
		var content = Ext.create("Ext.panel.Panel", {
			id: configs.pageId.busiTrack,
			maxWidth: configs.contentWidth,
			border: 0,
			items: [this.top.content(), this.main.content()],
			defaults: {
				padding: "5 40 0 40",
				border: 0
			},
			listeners: {
				show: ctrl.busiTrack.show
			}
		});
		return content;
	},
	tools: function() {
		var icon = Ext.create("Ext.panel.Panel", {
			margin: "0 0 0 20",
			width: 50,
			height: 35,
			cls: "i_title i_title_busiTrack",
			border: 0
		});
		var text = Ext.create("Ext.form.Label", {
			text: configs.menu[1],
			width: 100,
			style: {
				fontSize: "18px",
				fontWeight: "400"
			}
		});
		var comboBox = Ext.create("Ext.form.ComboBox", {
			queryMode: 'local',
			id: configs.busiTrack.area,
			store: Ext.StoreMgr.get("area"),
			editable: false,
			autoSelect: true,
			displayField: configs.dimension.key,
			valueField: configs.dimension.value,
			value: "GUANG_ZHOU",
			margin: 10,
			cls: "topTools",
			fieldStyle: {
				background: "#F3F9F2",
				margin: "5px",
				fontWeight: "400"
			},
			labelWidth: 0,
			labelAlign: "right",
			height: 30,
			width: 80
		});


		var childMenu = configs.childMenu.busiTrack
		var button1 = {
			xtype: "label",
			text: childMenu[0],
			id: "busiTrackChildMenu1",
			width: 80,
			style: {
				fontSize: "15px",
				textAlign: "center"
			},
			cls: "busiTrackToolsButton action",
			channelId: configs.channelId.busiHall
		};
		var line = Ext.create("Ext.form.Label", {
			text: "|",
			width: 1,
			style: {
				fontSize: "15px",
				textAlign: "center"
			}
		});
		var button2 = Ext.create("Ext.form.Label", {
			text: childMenu[1],
			id: "busiTrackChildMenu2",
			width: 80,
			style: {
				fontSize: "15px",
				textAlign: "center"
			},
			cls: "busiTrackToolsButton",
			channelId: configs.channelId.eleChannel
		});
		var tools = Ext.create("Ext.toolbar.Toolbar", {
			id: configs.pageId.busiTrack + "tools",
			items: [icon, text, comboBox, button1
				// , line
				// , button2
			]
		});
		// tools.push(icon);
		// tools.push(text);
		// tools.push(comboBox);
		// tools.push(button1);
		// tools.push(line);
		// tools.push(button2);
		return tools;
	},
	top: {
		content: function() {
			var panel = Ext.create("Ext.form.Panel", {
				layout: "column",
				id: configs.busiTrack.form,
				defaults: {
					columnWidth: 1 / 4,
					margin: 5,
					labelAlign: "right",
					labelWidth: 60,
					border: 0
				},
				items: [{
					xtype: 'datefield',
					fieldLabel: '开始时间',
					editable: false,
					columnWidth: 1 / 4,
					name: configs.busiTrack.startTime,
					format: 'Y-m-d',
					value: configs.startTime()
				}, {
					xtype: "timefield",
					columnWidth: 1 / 8,
					editable: false,
					name: configs.busiTrack.startTime + "2",
					format: 'H:i',
					value: Ext.Date.format(configs.startTime(), 'H:i'),
					increment: 1
				}, {
					xtype: 'datefield',
					fieldLabel: '结束时间',
					columnWidth: 1 / 4,
					editable: false,
					name: configs.busiTrack.endTime,
					format: 'Y-m-d',
					value: configs.endTime()
				}, {
					xtype: "timefield",
					columnWidth: 1 / 8,
					editable: false,
					name: configs.busiTrack.endTime + "2",
					format: 'H:i',
					increment: 1,
					value: Ext.Date.format(configs.endTime(), 'H:i')
				}, this.channelComboBox(), this.busiType(), {
					xtype: 'textfield',
					fieldLabel: configs.msg.phone,
					name: configs.busiTrack.phone
				}, {
					xtype: 'textfield',
					fieldLabel: configs.msg.operatorNo,
					name: configs.busiTrack.operatorNo
				}, this.status(), {
					xtype: "button",
					columnWidth: 1 / 8,
					style: {
						background: "#7FC533"
					},
					text: configs.msg.select,
					handler: ctrl.busiTrack.selectBusiTrack
				}, view.main.line()]
			});
			return panel;
		},
		channelComboBox: function() {
			var store = Ext.create("Ext.data.Store", {
				fields: ["channel", "name"]
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				queryMode: 'local',
				id: configs.busiTrack.busiTrackTC,
				name: configs.busiTrack.transactionChannel,
				store: store,
				autoSelect: true,
				displayField: "name",
				valueField: "channel",
				editable: false,
				fieldLabel: configs.msg.transactionChannel
			});
			return comboBox;
		},
		busiType: function() {
			var store = Ext.create("Ext.data.Store", {
				storeId: "busiTrackBusiType",
				fields: [configs.dimension.busiTypeKey, configs.dimension.busiTypeValue]
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				queryMode: 'local',
				id: configs.busiTrack.busiType,
				name: configs.busiTrack.busiType,
				store: store,
				autoSelect: true,
				editable: false,
				displayField: configs.dimension.busiTypeKey,
				valueField: configs.dimension.busiTypeValue,
				fieldLabel: configs.msg.busiType
			});
			return comboBox;
		},
		status: function() {
			var store = Ext.create("Ext.data.Store", {
				fields: [configs.dimension.key, configs.dimension.value]
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				id: configs.busiTrack.busiStatus,
				name: configs.busiTrack.busiStatus,
				queryMode: 'local',
				store: store,
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				fieldLabel: configs.msg.statu
			});
			return comboBox;
		}
	},
	main: {
		busiProfileGridPageBar: null,
		content: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				id: "busiTrackMain",
				items: [this.busiProfileGrid()]
			});
			return panel;
		},
		busiProfileGrid: function() {
			var text = configs.busiTrack.busiProfileGridText;
			var name = configs.busiTrack.busiProfileGridName;
			var store = Ext.create("Ext.data.Store", {
				storeId: "busiTrackBusiProfileGrid",
				fields: [name.name,
					name.time,
					name.transactionChannel,
					name.phone,
					name.operatorNo,
					name.duration,
					name.statu
				]
			});
			var grid = Ext.create("Ext.grid.Panel", {
				width: "100%",
				height: 420,
				store: Ext.data.StoreManager.lookup(store),
				title: "业务概况",
				columns: {
					items: [{
						text: text.name,
						dataIndex: name.name,

					}, {
						text: text.time,
						dataIndex: name.time,
						renderer: function(value) {
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}, {
						text: text.transactionChannel,
						dataIndex: name.transactionChannel,
						renderer: function(value) {
							var busiChannel = ctrl.busiTrack.busiChannel;
							var name = busiChannel[value];
							if (!name) {
								name = busiChannel["UNKNOWN"];
							}
							return name;
						}
					}, {
						text: text.phone,
						dataIndex: name.phone
					}, {
						text: text.operatorNo,
						dataIndex: name.operatorNo,
						renderer: function(value) {
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}, {
						text: text.duration,
						dataIndex: name.duration,
						renderer: function(value) {
							return parseFloat(value * configs.testTime).toFixed(2) + "s";
						}
					}, {
						text: text.statu,
						dataIndex: name.statu,
						renderer: function(value, recode) {
							for (i in ctrl.status) {
								if (value == ctrl.status[i]) {
									recode.style = "color: " + configs.statusColor[i] + ";";
								}
							}
							return value;
						}
					}, {
						text: text.op,
						dataIndex: name.op,
						renderer: function(value, recode, column) {
							recode.style = "padding: 5px 0;";
							var button = "<button class='busiAlarmGridBtn' onclick='ctrl.busiTrack.listenersBusiAlarmGridBtn(this)' data='" + JSON.stringify(column.data) + "'>" + configs.msg.look + "</button>";
							return button;
						}
					}],
					defaults: {
						style: {
							textAlign: "center"
						},
						maxWidth: 150,
						align: 'center',
						renderer: function(value) {
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}
				},

				dockedItems: [{
					xtype: 'toolbar',
					dock: 'bottom',
					items: this.gridPageBar().createToolbar()
				}],
				forceFit: true,
				renderTo: Ext.getBody()
			});
			return grid;
		},
		gridPageBar: function() {
			var tools = Ext.create("common.page.PageBar", {
				id: "busiTrackBusiProfileGridPageBar",
				listeners: {
					PAGING: ctrl.busiTrack.getBusiTrackList
				}
			});
			this.busiProfileGridPageBar = tools;
			return tools;
		},
		singleBusiGrid: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				id: "busiTrackSingleBusiGrid",
				border: 0,
				margin: "10 0 10 0",
				width: "100%",
				defaults: {
					margin: "10 0 0 0"
				},
				items: [
					this.singleBusiGridTitle(),
					this.singleBusiGridPanel()
				]
			});
			return panel;
		},
		singleBusiGridTitle: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				height: 25,
				padding: "5 0 0 10",
				border: 0,
				cls: "x-panel-header-default",
				style: {
					'background-position': "-75px center"
				},
				items: [{
					xtype: "label",
					text: "单笔业务追踪",
					height: 40,
					style: {
						color: "#fff",
						fontSize: "14px",
						fontWeight: "400"
					}
				}]
			});
			return panel;
		},
		singleBusiGridPanel: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					margin: 0,
					padding: "0 0 10 0",
					border: 0,
					cls: "singleBusiGrid"
				},
				items: [
					this.webBusiGridPanel(),
					this.wasBusiGridPanel()
					// this.cicsBusiGridPanel()
				],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					border: 1,
					padding: 0,
					defaults: {
						xtype: "label",
						width: "20%",
						margin: "5 0 5 0",
						style: {
							textAlign: "center"
						}
					},
					style: {
						background: "#F3F9F2"
					},
					items: this.singleBusiGridPanelTools()
				}]
			});
			return panel;
		},
		singleBusiGridPanelTools: function() {
			var tools = [{
				text: "",
				id: "singleBusiType"
			}, {
				text: "",
				id: "singleBusiTime"
			}, {
				text: "",
				id: "singleBusiPhone"
			}, {
				text: "",
				id: "singleBusiDuration"
			}, {
				text: "",
				id: "singleBusiStatus",
				style: {
					color: "#f00",
					textAlign: "center"
				}
			}];
			return tools;
		},
		webBusiGridPanel: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					height: 180,
					margin: "10"
				},
				layout: "hbox",
				items: [this.webBusiInfo(), this.webBusiGrid()]
			});
			return panel;
		},
		webBusiInfo: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				width: "20%",
				style: {
					'border-radius': "5px",
					'background-color': "#F5F9E9"
				},
				defaults: {
					xtype: "label",
					border: 0,
					width: "100%",
					margin: 5,
					style: {
						textAlign: "center"
					},
					padding: "5 0 0 0"
				},
				layout: "vbox",
				items: [{
						xtype: "label",
						text: "Web-前台",
						padding: "5 0 5 0",
						width: "100%",
						margin: 0,
						style: {
							backgroundColor: "#00AD44",
							color: "#fff",
							textAlign: "center"
						}
					}, {
						xtype: "panel",
						cls: "webBusi",
						width: "100%",
						margin: "0 10 0 10",
						height: 80
					}, {
						text: "调用量: 0/次",
						id: "webHandling",
						style: {
							fontSize: "14px",
							textAlign: "center"
						}
					}, {
						text: "成功率: --",
						id: "webRate",
						style: {
							fontSize: "14px",
							textAlign: "center"
						}
					}
					// , {
					// 	text: "响应时长: 657ms",
					// 	id: "webDuration"
					// }
				]
			});
			return panel;
		},
		webBusiGrid: function() {
			var text = configs.busiTrack.singleBusiGridText;
			var name = configs.busiTrack.singleBusiGridName;
			var store = Ext.create("Ext.data.Store", {
				storeId: "busiTrackWebBusi",
				fields: [
					name.cmp,
					name.command,
					name.commandName,
					name.time,
					name.duration,
					name.clientIP,
					name.serverIP,
					name.recode,
					name.msg
				]
			});
			var grid = Ext.create("Ext.grid.Panel", {
				store: Ext.data.StoreManager.lookup(store),
				width: "79%",
				selType: 'cellmodel',
				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1
					})
				],
				columns: {
					items: [{
						text: text.command,
						dataIndex: name.command,
						width: 350,
						style: {
							textAlign: "left"
						},
						editor: {
							xtype: 'textfield',
							readOnly: true
						},
						renderer: function(value, record, column) {
							record.style = "-moz-user-select: text! important ; -khtml-user-select: text! important ;"
							if (!value) {
								var data = column.data;
								var commandName = data[name.commandName];
								value = commandName;
							}
							return value;
						},
						align: 'left'
					}, {
						text: text.commandName,
						dataIndex: name.commandName,
						hidden: true,
						width: 350,
						style: {
							textAlign: "left"
						},
						editor: {
							xtype: 'textfield',
							readOnly: true
						},
						align: 'left',
						renderer: function(value, record, column) {
							record.style = "-moz-user-select: text! important ; -khtml-user-select: text! important ;"
							return value;
						},
					}, {
						text: text.time,
						dataIndex: name.time,
						hidden: true,
						renderer: function(value) {
							value = value || "";
							if (value.length >= 19) {
								value = value.substring(11, 19)
							}
							return value;
						}

					}, {
						text: text.duration,
						dataIndex: name.duration,
						renderer: function(value) {
							value = value || 0;
							return (value * configs.testTime).toFixed(2) + "ms";
						}
					}, {
						text: text.clientIP,
						hidden: true,
						dataIndex: name.clientIP

					}, {
						text: text.serverIP,
						hidden: true,
						dataIndex: name.serverIP

					}, {
						text: text.recode,
						dataIndex: name.recode
					}, {
						text: text.msg,
						dataIndex: name.msg,
						renderer: function(value) {
							value = value || "";
							var value = tools.htmlToText(value);
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}],
					defaults: {
						style: {
							textAlign: "center"
						},
						align: 'center',
						renderer: function(value) {
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}
				},
				forceFit: true,
				renderTo: Ext.getBody()
			});
			return grid;
		},
		wasBusiGridPanel: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					height: 180,
					margin: "10"
				},
				layout: "hbox",
				items: [this.wasBusiInfo(), this.wasBusiGrid()]
			});
			return panel;
		},
		wasBusiInfo: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				width: "20%",
				layout: "vbox",
				style: {
					'border-radius': "5px",
					'background-color': "#F5F9E9"
				},
				defaults: {
					xtype: "label",
					border: 0,
					width: "100%",
					padding: "5 0 0 0",
					margin: 5,
					style: {
						textAlign: "center"
					}
				},
				items: [{
						xtype: "label",
						text: "Was-前台",
						padding: "5 0 5 0",
						margin: 0,
						width: "100%",
						style: {
							backgroundColor: "#00AD44",
							color: "#fff",
							textAlign: "center"
						}
					}, {
						xtype: "panel",
						cls: "wasBusi",
						width: "100%",
						margin: "0 10 0 10",
						height: 80

					}, {
						text: "调用量: 0/次",
						id: "wasHandling",
						style: {
							fontSize: "14px",
							textAlign: "center"
						}
					}, {
						text: "成功率: --",
						id: "wasRate",
						style: {
							fontSize: "14px",
							textAlign: "center"
						}
					}
					// , {
					// 	text: "响应时长: 657ms",
					// 	id: "wasDuration"
					// }
				]
			});
			return panel;
		},
		wasBusiGrid: function() {
			var text = configs.busiTrack.singleBusiGridText;
			var name = configs.busiTrack.singleBusiGridName;
			var store = Ext.create("Ext.data.Store", {
				storeId: "busiTrackWasBusi",
				fields: [
					name.cmp,
					name.command,
					name.time,
					name.duration,
					name.clientIP,
					name.serverIP,
					name.recode,
					name.msg
				]
			});
			var grid = Ext.create("Ext.grid.Panel", {
				store: Ext.data.StoreManager.lookup(store),
				width: "79%",
				selType: 'cellmodel',
				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1
					})
				],
				columns: {
					items: [{
						text: text.command,
						dataIndex: name.command,
						renderer: function(value, record, column) {
							record.style = "-moz-user-select: text! important ; -khtml-user-select: text! important ;"
							if (!value) {
								var data = column.data;
								var commandName = data[name.commandName];
								value = commandName;
							}
							return value;
						},
						editor: {
							xtype: 'textfield',
							readOnly: true
						},
						width: 350,
						style: {
							textAlign: "left"
						},
						align: 'left'
					}, {
						text: text.commandName,
						dataIndex: name.commandName,
						hidden: true,
						width: 350,
						style: {
							textAlign: "left"
						},editor: {
							xtype: 'textfield',
							readOnly: true
						},
						align: 'left',
						renderer: function(value, record, column) {
							record.style = "-moz-user-select: text! important ; -khtml-user-select: text! important ;"
							return value;
						},
					}, {
						text: text.time,
						dataIndex: name.time,
						hidden: true,
						renderer: function(value) {
							value = value || "";
							if (value.length >= 19) {
								value = value.substring(11, 19)
							}
							return value;
						}
					}, {
						text: text.duration,
						dataIndex: name.duration,
						renderer: function(value) {
							value = value || 0;
							return (value * configs.testTime).toFixed(2) + "ms";
						}
					}, {
						text: text.clientIP,
						hidden: true,
						dataIndex: name.clientIP
					}, {
						text: text.serverIP,
						hidden: true,
						dataIndex: name.serverIP
					}, {
						text: text.recode,
						dataIndex: name.recode
					}, {
						text: text.msg,
						dataIndex: name.msg,
						renderer: function(value) {
							value = value || "";
							var value = tools.htmlToText(value);
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}],
					defaults: {
						style: {
							textAlign: "center"
						},
						align: 'center',
						renderer: function(value) {
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}
				},
				forceFit: true,
				renderTo: Ext.getBody()
			});
			return grid;
		},
		cicsBusiGridPanel: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					height: 180,
					margin: "10"
				},
				layout: "hbox",
				items: [this.cicsBusiInfo(), this.cicsBusiGrid()]
			});
			return panel;
		},
		cicsBusiInfo: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				width: "20%",
				layout: "vbox",
				style: {
					'border-radius': "5px",
					'background-color': "#F5F9E9"
				},
				defaults: {
					xtype: "label",
					border: 0,
					width: "100%",
					padding: "5 0 0 0",
					style: {
						textAlign: "center"
					}
				},
				items: [{
					xtype: "label",
					text: "CICS-前台",
					padding: "5 0 5 0",
					width: "100%",
					style: {
						backgroundColor: "#00AD44",
						color: "#fff",
						textAlign: "center"
					}
				}, {
					xtype: "panel",
					cls: "cicsBusi",
					width: "100%",
					margin: "0 10 0 10",
					height: 60
				}, {
					text: "调用量: 657/次",
					id: "cicsHandling"
				}, {
					text: "成功率: 90%",
					id: "cicsRate"
				}, {
					text: "响应时长: 657ms",
					id: "cicsDuration"
				}]
			});
			return panel;
		},
		cicsBusiGrid: function() {
			var text = configs.busiTrack.singleBusiGridText;
			var name = configs.busiTrack.singleBusiGridName;
			var store = Ext.create("Ext.data.Store", {
				storeId: "busiTrackCicsBusi",
				fields: [
					name.cmp,
					name.command,
					name.time,
					name.duration,
					name.clientIP,
					name.serverIP,
					name.recode,
					name.msg
				]
			});
			var grid = Ext.create("Ext.grid.Panel", {
				store: Ext.data.StoreManager.lookup(store),
				width: "79%",
				selType: 'cellmodel',
				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1
					})
				],
				columns: {
					items: [{
						text: text.cmp,
						dataIndex: name.cmp
					}, {
						text: text.command,
						dataIndex: name.command
					}, {
						text: text.time,
						dataIndex: name.time
					}, {
						text: text.duration,
						dataIndex: name.duration,
						renderer: function(value) {
							return value.toFixed(2);
						}
					}, {
						text: text.clientIP,
						dataIndex: name.clientIP
					}, {
						text: text.serverIP,
						dataIndex: name.serverIP
					}, {
						text: text.recode,
						dataIndex: name.recode
					}, {
						text: text.msg,
						dataIndex: name.msg
					}],
					defaults: {
						style: {
							textAlign: "center"
						},
						align: 'center',
						renderer: function(value) {
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}
				},
				forceFit: true,
				renderTo: Ext.getBody()
			});
			return grid;
		}
	}
};
// 业务追踪结束------------------------------------------
// 
// 
// 运营分析-----------------------------------------------
view.operationAnalysis = {
	content: function() {
		var content = Ext.create("Ext.panel.Panel", {
			id: configs.pageId.operationAnalysis,
			maxWidth: configs.contentWidth,
			border: 0,
			autoScroll: true,
			items: [this.top(), this.mainTop.content(), this.mainCenter.content()],
			defaults: {
				padding: "5 40 0 40",
				border: 0
			}
		});
		return content;
	},
	tools: function() {
		// var tools = [];
		var icon = Ext.create("Ext.panel.Panel", {
			margin: "0 0 0 20",
			width: 50,
			height: 35,
			cls: "i_title i_title_operationAnalysis",
			border: 0
		});
		var text = Ext.create("Ext.form.Label", {
			text: configs.menu[2],
			width: 100,
			style: {
				fontSize: "18px",
				fontWeight: "400"
			}
		});
		var comboBox = Ext.create("Ext.form.ComboBox", {
			queryMode: 'local',
			id: configs.operationAnalysis.area,
			store: Ext.StoreMgr.get("area"),
			editable: false,
			autoSelect: true,
			displayField: configs.dimension.key,
			valueField: configs.dimension.value,
			value: "GUANG_ZHOU",
			margin: 10,
			cls: "topTools",
			fieldStyle: {
				background: "#F3F9F2",
				margin: "5px",
				fontWeight: "400"
			},
			labelWidth: 0,
			labelAlign: "right",
			height: 30,
			width: 80
		});


		var childMenu = configs.childMenu.operationAnalysis
		var button1 = {
			xtype: "label",
			text: childMenu[0],
			id: "operationAnalysisChildMenu1",
			width: 80,
			style: {
				fontSize: "15px",
				textAlign: "center"
			},
			cls: "operationAnalysisToolsButton action",
			channelId: configs.channelId.busiHall
		};
		var line = Ext.create("Ext.form.Label", {
			text: "|",
			width: 1,
			style: {
				fontSize: "15px",
				textAlign: "center"
			}
		});
		var button2 = Ext.create("Ext.form.Label", {
			text: childMenu[1],
			id: "operationAnalysisChildMenu2",
			width: 80,
			style: {
				fontSize: "15px",
				textAlign: "center"
			},
			cls: "operationAnalysisToolsButton",
			channelId: configs.channelId.eleChannel
		});
		var tools = Ext.create("Ext.toolbar.Toolbar", {
			id: configs.pageId.operationAnalysis + "tools",
			items: [icon, text, comboBox, button1
				// , line
				// , button2
			]
		});
		// tools.push(icon);
		// tools.push(text);
		// tools.push(comboBox);
		// tools.push(button1);
		// tools.push(line);
		// tools.push(button2);
		return tools;
	},
	top: function() {
		var panel = Ext.create("Ext.form.Panel", {
			layout: "hbox",
			id: "operationAnalysisForm",
			defaults: {
				margin: 5,
				labelAlign: "left",
				labelWidth: 60,
				border: 0,
				width: 200
			},
			items: [{
				xtype: "datefield",
				format: 'Y-m-d',
				fieldLabel: '开始时间',
				editable: false,
				name: configs.operationAnalysis.startTime,
				value: configs.startTime()
			}, {
				xtype: "timefield",
				format: 'H:i',
				editable: false,
				value: Ext.Date.format(configs.startTime(), 'H:i'),
				name: configs.operationAnalysis.startTime + "2",
				increment: 1,
				width: 80
			}, {
				xtype: "datefield",
				format: 'Y-m-d',
				fieldLabel: '结束时间',
				editable: false,
				name: configs.operationAnalysis.endTime,
				value: configs.endTime()
			}, {
				xtype: "timefield",
				name: configs.operationAnalysis.endTime + "2",
				format: 'H:i',
				editable: false,
				increment: 1,
				value: Ext.Date.format(configs.endTime(), 'H:i'),
				width: 80
			}, Ext.create('Ext.form.ComboBox', {
				queryMode: 'local',
				mode: "local",
				id: configs.operationAnalysis.busiType,
				store: Ext.create('Ext.data.Store', {
					fields: [configs.dimension.busiTypeKey, configs.dimension.busiTypeValue]
				}),
				// editable: false,
				autoSelect: true,
				name: "busiName",
				displayField: configs.dimension.busiTypeKey,
				valueField: configs.dimension.busiTypeKey,
				fieldLabel: configs.msg.busiType,
				// labelWidth: 0,
				labelAlign: "right",
				// height: 30,
				width: 150
			}), {
				xtype: "button",
				text: configs.msg.select,
				id: "operationAnalysisSelcet",
				style: {
					background: "#7FC533"
				},
				width: 80,
				margin: "5 0 5 10",
				handler: ctrl.operationAnalysis.selectBusi
			}]
		});

		return panel;
	},
	mainTop: {
		content: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				layout: "column",
				defaults: {
					columnWidth: 1 / 3,
					border: 1,
					padding: "5 30 5 5",
					height: 115,
					cls: "busiProfileMainTop"
				},
				items: [this.handing(), this.duration(), this.rate()]
			});
			return panel;
		},
		handing: function() {
			var leftText = Ext.create("Ext.panel.Panel", {
				width: "45%",
				layout: "vbox",
				cls: "mainTopLeft",
				defaults: {
					width: "100%",
					xtype: "label",
					style: {
						padding: "0 0 10px 0"
					},
					align: "right"
				},
				items: [{
					text: "0",
					cls: "mainTopLeftText",
					id: "operationAnalysisMianTopHanding"
				}, {
					text: configs.msg.handling,
					cls: "mainTopLeftLabel"
				}]
			});
			var gauge = Ext.create("Ext.panel.Panel", {
				html: "<div id='operationAnalysisHandlingGauge' class='chart'></div>",
				overflowX: "auto",
				margin: 5,
				width: "55%"
			});

			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					height: 100
				},
				layout: 'hbox',
				items: [leftText, gauge]
			});
			return panel;
		},
		duration: function() {
			var leftText = Ext.create("Ext.panel.Panel", {
				width: "50%",
				layout: "vbox",
				cls: "mainTopLeft",
				defaults: {
					width: "100%",
					xtype: "label",
					style: {
						padding: "0 0 10px 0"
					}
				},
				items: [{
					text: "0ms",
					cls: "mainTopLeftText",
					id: "operationAnalysisMianTopDuration"
				}, {
					text: configs.msg.duration,
					cls: "mainTopLeftLabel"
				}]
			});
			var gauge = Ext.create("Ext.panel.Panel", {
				html: "<div id='operationAnalysisDurationGauge' class='chart'></div>",
				overflowX: "auto",
				margin: "5 0 0 0",
				width: "50%"
			});

			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					height: 100
				},

				layout: 'hbox',
				items: [leftText, gauge]
			});
			return panel;
		},
		rate: function() {
			var leftText = Ext.create("Ext.panel.Panel", {
				width: "50%",
				layout: "vbox",
				cls: "mainTopLeft",
				defaults: {
					width: "100%",
					xtype: "label",
					style: {
						padding: "0 0 10px 0"
					}
				},
				items: [{
					text: "0%",
					cls: "mainTopLeftText",
					id: "operationAnalysisMianTopRate"
				}, {
					text: configs.msg.rate,
					cls: "mainTopLeftLabel"
				}]
			});
			var gauge = Ext.create("Ext.panel.Panel", {
				html: "<div id='operationAnalysisRateGauge' class='chart'></div>",
				overflowX: "auto",
				margin: "5 0 0 0",
				width: "50%"
			});

			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					height: 100
				},
				layout: 'hbox',
				items: [leftText, gauge]
			});
			return panel;
		}
	},
	mainCenter: {
		operationAnalysisGridPageBar: null,
		content: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				items: [this.operationAnalysisGrid(), this.trendAnalysis()]
			});
			return panel;
		},
		operationAnalysisGrid: function() {
			var text = configs.operationAnalysis.operationAnalysisGridText;
			var name = configs.operationAnalysis.operationAnalysisGridName;
			var store = Ext.create("Ext.data.Store", {
				storeId: "operationAnalysisGrid",
				fields: [name.channel,
					name.type,
					name.userNum,
					name.handling,
					name.rate,
					name.duration,
					name.op
				]
			});
			var grid = Ext.create("Ext.grid.Panel", {
				width: "100%",
				height: 400,
				store: Ext.data.StoreManager.lookup(store),
				title: "业务概况",
				columns: {
					items: [{
						text: text.channel,
						dataIndex: name.channel
					}, {
						text: text.type,
						dataIndex: name.type,
						renderer: function(value) {
							return value || ""
						}
					}, {
						text: text.userNum,
						dataIndex: name.userNum
					}, {
						text: text.handling,
						dataIndex: name.handling
					}, {
						text: text.rate,
						dataIndex: name.rate,
						renderer: function(value) {
							return (value * 100 || 0).toFixed(2) + "%";
						}
					}, {
						text: text.duration,
						dataIndex: name.duration,
						renderer: function(value) {
							var value = value || 0;
							return (parseFloat(value * configs.testTime)).toFixed(2) + "s";
						}
					}, {
						text: text.op,
						dataIndex: name.op,
						width: 50,
						align: "center",
						renderer: function(value, recode, column) {
							recode.style = "padding: 5px 0;";
							var data = column.data;
							var button = "<button class=' operationAnalysisAlarmGridBtn'" + " onclick='ctrl.operationAnalysis.listenersAlarmGridBtn(this)' data='" + JSON.stringify(data) + "'>" + configs.msg.look + "</button>";
							return button;
						}
					}],
					defaults: {
						maxWidth: 150,
						renderer: function(value) {
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}

				},
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'bottom',
					items: this.gridPageBar().createToolbar()
				}],
				forceFit: true,
				renderTo: Ext.getBody()
			});
			return grid;
		},
		gridPageBar: function() {
			var tools = Ext.create("common.page.PageBar", {
				id: "operationAnalysisGridPageBar",
				listeners: {
					PAGING: ctrl.operationAnalysis.getBusiProfileList
				}
			});
			this.operationAnalysisGridPageBar = tools;
			return tools;
		},
		trendAnalysis: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				id: "operationAnalysisTrendAnalysis",
				border: 0,
				margin: "10 0 10 0",
				width: "100%",
				items: [
					this.trendAnalysisTitle(),
					this.trendAnalysisPanel()
				]
			}).hide();
			return panel;
		},
		trendAnalysisTitle: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				height: 25,
				padding: "5 0 0 10",
				border: 0,
				layout: "column",
				cls: "x-panel-header-default",
				items: [{
					xtype: "label",
					text: "指标趋势",
					columnWidth: 1 / 2,
					height: 40,
					style: {
						color: "#fff",
						fontSize: "14px",
						fontWeight: "400"
					}
				}, {
					xtype: "panel",
					border: 0,
					columnWidth: 1 / 2,
					style: {
						textAlign: "right"
					},
					items: [{
						xtype: "label",
						text: "最近【1小时】",
						height: 40,
						style: {
							color: "#000",
							fontSize: "14px",
							fontWeight: "400"
						}
					}]
				}]
			});
			return panel;
		},
		trendAnalysisPanel: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				border: 1,
				margin: "10 0 10 0",
				width: "100%",
				defaults: {
					height: 220,
					border: 0,
					margin: "0 0 10 0"
						// padding: "0 10 0 10"
				},
				items: [
					this.busiHandlingTrend(),
					this.busiRateTrend(),
					this.busiDurationTrend()
				],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					border: 1,
					padding: 0,
					defaults: {
						xtype: "label",
						width: "20%",
						margin: "5 0 5 0",
						style: {
							textAlign: "center"
						}
					},
					style: {
						background: "#F3F9F2"
					},
					items: this.trendAnalysisPanelTools()
				}]
			});
			return panel;
		},
		trendAnalysisPanelTools: function() {
			var tools = [{
				text: "",
				id: "OpTrendAnalysisChannel",
				width: "25%"
			}, {
				text: "",
				id: "OpTrendAnalysisBusiType",
				width: "30%"
			}, {
				text: "",
				id: "OpTrendAnalysisHandling",
				width: "15%"
			}, {
				text: "",
				id: "OpTrendAnalysisRate",
				width: "15%"
			}, {
				text: "",
				id: "OpTrendAnalysisDuration",
				width: "15%"
			}];
			return tools;
		},
		busiHandlingTrend: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					height: 200,
					// border: 0,
					overflowX: "auto",
					width: "100%",
					margin: "10 0 0 0"
				},
				items: [{
					xtype: "panel",
					border: 0,
					// id: "operationHandlingTrend",
					html: "<div id='operationHandlingTrend' class='chart'></div>"
				}],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					border: 0,
					padding: 5,
					style: {
						background: "#D5EBE7"
					},
					items: [{
						xtype: "label",
						text: "业务量/笔"
					}]
				}]

			});
			return panel;
		},
		busiRateTrend: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					height: 200,
					// border: 0,
					overflowX: "auto",
					width: "100%",
					margin: "10 0 0 0"
				},
				items: [{
					xtype: "panel",
					border: 0,
					html: "<div id='operationRateTrend' class='chart'></div>"
						// id: "",
				}],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					border: 0,
					padding: 5,
					style: {
						background: "#D5EBE7"
					},
					items: [{
						xtype: "label",
						text: "成功率/%"
					}]
				}]

			});
			return panel;
		},
		busiDurationTrend: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					height: 200,
					// border: 0,
					overflowX: "auto",
					width: "100%",
					margin: "10 0 0 0"
				},
				items: [{
					xtype: "panel",
					border: 0,
					// id: "operationDurationTrend",
					html: "<div id='operationDurationTrend' class='chart'></div>"
				}],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					border: 0,
					padding: 5,
					style: {
						background: "#D5EBE7"
					},
					items: [{
						xtype: "label",
						text: "业务时长/s"
					}]
				}]
			});
			return panel;
		}
	}
};
// 运营分析结束----------------------------------------------
// 
// 业务专题----------------------------------------------
view.busiTopics = {
	content: function() {
		var content = Ext.create("Ext.panel.Panel", {
			id: configs.pageId.busiTopics,
			maxWidth: configs.contentWidth,
			border: 0,
			autoScroll: true,
			items: [this.top.content(),
				this.mainTop.content(),
				this.mainCenter.content(),
				this.mainFooter.content()
			],
			defaults: {
				padding: "5 40 0 40",
				border: 0
			}
		});
		return content;
	},
	tools: function() {
		var icon = Ext.create("Ext.panel.Panel", {
			margin: "0 0 0 20",
			width: 50,
			height: 35,
			cls: "i_title i_title_busiTopics",
			border: 0
		});
		var text = Ext.create("Ext.form.Label", {
			text: configs.menu[3],
			width: 100,
			style: {
				fontSize: "18px",
				fontWeight: "400"
			}
		});
		var comboBox = Ext.create("Ext.form.ComboBox", {
			queryMode: 'local',
			id: configs.busiTopics.area,
			store: Ext.StoreMgr.get("area"),
			editable: false,
			autoSelect: true,
			displayField: configs.dimension.key,
			valueField: configs.dimension.value,
			value: "GUANG_ZHOU",
			margin: 10,
			cls: "topTools",
			fieldStyle: {
				background: "#F3F9F2",
				margin: "5px",
				fontWeight: "400"
			},
			labelWidth: 0,
			labelAlign: "right",
			height: 30,
			width: 80
		});


		var childMenu = configs.childMenu.busiTopics;
		var button1 = {
			xtype: "label",
			text: childMenu[0],
			id: "busiTopicsChildMenu1",
			width: 80,
			style: {
				fontSize: "15px",
				textAlign: "center"
			},
			cls: "busiTopicsToolsButton action",
			channelId: configs.channelId.busiHall
		};
		var line = Ext.create("Ext.form.Label", {
			text: "|",
			width: 1,
			style: {
				fontSize: "15px",
				textAlign: "center"
			}
		});
		var button2 = Ext.create("Ext.form.Label", {
			text: childMenu[1],
			id: "busiTopicsChildMenu2",
			width: 80,
			style: {
				fontSize: "15px",
				textAlign: "center"
			},
			cls: "busiTopicsToolsButton",
			channelId: configs.channelId.eleChannel
		});
		var tools = Ext.create("Ext.toolbar.Toolbar", {
			id: configs.pageId.busiTopics + "tools",
			items: [icon, text, comboBox, button1
				// , line
				// , button2
			]
		});
		return tools;
	},
	top: {
		content: function() {
			var panel = Ext.create("Ext.form.Panel", {
				layout: "hbox",
				border: 0,
				width: "100%",
				defaults: {
					margin: 5,
					labelWidth: 60,
					labelAlign: "right",
					height: 20,
					width: "20%",
					border: 0
				},
				items: [this.busiType(), this.topTimeComboBox(), {
					width: 100,
					xtype: "button",
					height: 25,
					margin: "4 5 5 20",
					text: configs.msg.select,
					style: {
						background: "#7FC533"
					},
					handler: ctrl.busiTopics.selectBusi
				}]
			});
			return panel;
		},
		busiType: function() {
			var store = Ext.create("Ext.data.Store", {
				storeId: configs.busiTopics.busiTopicsBusiType,
				fields: [configs.dimension.key, configs.dimension.value]
			});
			var comboBox = Ext.create("Ext.form.ComboBox", {
				queryMode: 'local',
				id: configs.busiTopics.busiTopicsBusiType,
				store: store,
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				width: "45%",
				fieldLabel: configs.msg.busiType
			});
			return comboBox;
		},
		topTimeComboBox: function() {
			var comboBox = Ext.create("Ext.form.ComboBox", {
				id: configs.busiTopics.busiTopicsTime,
				queryMode: 'local',
				store: Ext.StoreMgr.get("time"),
				editable: false,
				autoSelect: true,
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				fieldLabel: configs.msg.time
			});
			return comboBox;
		}
	},
	mainTop: {
		content: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				layout: "column",
				border: 0,
				defaults: {
					columnWidth: 1 / 4,
					border: 1,
					height: 110,
					padding: "0 5 5 5",
					cls: "busiProfileMainTop"
				},
				items: [this.handle(),
					this.rate(),
					this.duration(),
					this.sysDuration()
				]
			});
			return panel;
		},
		handle: function() {
			var leftText = Ext.create("Ext.panel.Panel", {
				width: "45%",
				layout: "vbox",
				cls: "mainTopLeft",
				// padding: "10 0 0 0",
				defaults: {
					width: "100%",
					xtype: "label",
					style: {
						padding: "0 0 10px 0"
					},
					align: "right"
				},
				items: [{
					text: "0",
					cls: "mainTopLeftText",
					id: "busiTopicsHandlingLabel"
				}, {
					text: configs.msg.handling,
					cls: "mainTopLeftLabel"
				}]
			});
			var gauge = Ext.create("Ext.panel.Panel", {
				html: "<div id='busiTopicsHandlingGauge' class='chart'></div>",
				overflowX: "auto",
				margin: "10 0 0 0",
				width: "55%"
			});

			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					height: 100
				},
				layout: 'hbox',
				items: [leftText, gauge]
			});
			return panel;
		},
		rate: function() {
			var leftText = Ext.create("Ext.panel.Panel", {
				width: "45%",
				layout: "vbox",
				cls: "mainTopLeft",
				// padding: "10 0 0 0",
				defaults: {
					width: "100%",
					xtype: "label",
					style: {
						padding: "0 0 10px 0"
					},
					align: "right"
				},
				items: [{
					text: "0%",
					cls: "mainTopLeftText",
					id: "busiTopicsRateLabel"
				}, {
					text: configs.msg.rate,
					cls: "mainTopLeftLabel"
				}]
			});
			var gauge = Ext.create("Ext.panel.Panel", {
				// id: "busiTopicsRateGauge",
				html: "<div id='busiTopicsRateGauge' class='chart'></div>",
				overflowX: "auto",
				margin: "5 0 0 0",
				width: "55%"
			});

			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					height: 100
				},
				layout: 'hbox',
				items: [leftText, gauge]
			});
			return panel;
		},
		duration: function() {
			var leftText = Ext.create("Ext.panel.Panel", {
				width: "45%",
				layout: "vbox",
				cls: "mainTopLeft",
				// padding: "10 0 0 0",
				defaults: {
					width: "100%",
					xtype: "label",
					style: {
						padding: "0 0 10px 0"
					},
					align: "right"
				},
				items: [{
					text: "0s",
					cls: "mainTopLeftText",
					id: "busiTopicsDurationLabel"
				}, {
					text: configs.msg.duration,
					cls: "mainTopLeftLabel"
				}]
			});
			var gauge = Ext.create("Ext.panel.Panel", {
				// id: "busiTopicsDurationGauge",
				html: "<div id='busiTopicsDurationGauge' class='chart'></div>",
				overflowX: "auto",
				margin: "5 0 0 0",
				width: "55%"
			});

			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					height: 100
				},
				layout: 'hbox',
				items: [leftText, gauge]
			});
			return panel;
		},
		sysDuration: function() {
			var leftText = Ext.create("Ext.panel.Panel", {
				width: "45%",
				layout: "vbox",
				cls: "mainTopLeft",
				// padding: "10 0 0 0",
				defaults: {
					width: "100%",
					xtype: "label",
					style: {
						padding: "0 0 10px 0"
					},
					align: "right"
				},
				items: [{
					text: "0ms",
					cls: "mainTopLeftText",
					id: "busiTopicsSysDurationLabel"
				}, {
					text: configs.msg.sysDuration,
					cls: "mainTopLeftLabel"
				}]
			});
			var gauge = Ext.create("Ext.panel.Panel", {
				// id: "busiTopicsSysDurationGauge",
				html: "<div id='busiTopicsSysDurationGauge' class='chart'></div>",
				overflowX: "auto",
				margin: "5 0 0 0",
				width: "55%"
			});

			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					height: 100
				},
				layout: 'hbox',
				items: [leftText, gauge]
			});
			return panel;
		}
	},
	mainCenter: {
		content: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				border: 0,
				layout: "column",
				margin: "5 0 10 0",
				items: [this.contentLeft(), this.contentRight()]
			});
			return panel;
		},
		contentLeft: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				border: 0,
				layout: "vbox",
				margin: "0 5 0 0",
				columnWidth: 0.6,
				items: [this.contentLeftTop(), this.contentLeftBottom()]
			});
			return panel;
		},
		contentLeftTop: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				border: 0,
				// height: 350,
				width: "100%",
				items: [Ext.create("Ext.panel.Panel", {
					height: 25,
					padding: "5 0 0 10",
					border: 0,
					cls: "x-panel-header-default",
					items: [{
						xtype: "label",
						text: "业务步骤",
						height: 40,
						style: {
							color: "#fff",
							fontSize: "14px",
							fontWeight: "400"
						}
					}]
				}), {
					id: "busiTopicsStepFunnelPanel",
					xtype: "panel",
					// border: 0,
					height: 320,
					width: "100%",
					html: "<div id='busiTopicsStepFunnel' class='chart'></div>"
				}]
			});
			return panel;
		},
		contentLeftBottom: function() {
			var text = configs.busiTopicsGridText;
			var name = configs.busiTopicsGridName;
			var store = Ext.create("Ext.data.Store", {
				storeId: "busiTopicsCommandGrid",
				fields: [
					// name.step,
					// name.command,
					// name.handling,
					// name.response,
					// name.rate,
					// name.duration
					name.busiRetCode,
					name.cmdName,
					name.codeType,
					name.req_Time,
					name.res_Time
				]
			});
			Ext.QuickTips.init();
			var grid = Ext.create("Ext.grid.Panel", {
				margin: "10 0 0 0",
				width: "100%",
				height: 240,
				store: Ext.data.StoreManager.lookup(store),
				cls: "busiTopicsContentLeftBottom",
				title: "关键命令字",
				columns: {
					items: [{
						text: text.cmdName,
						dataIndex: name.cmdName,
						width: 150
					}, {
						text: text.codeType,
						dataIndex: name.codeType
					}, {
						text: text.req_Time,
						dataIndex: name.req_Time,
						renderer: function(value) {
							value = value || "";
							if (value.length >= 19) {
								value = value.substring(11, 19)
							}
							return value;
						}
					}, {
						text: text.res_Time,
						dataIndex: name.res_Time,
						renderer: function(value) {
							value = value || "";
							if (value.length >= 19) {
								value = value.substring(11, 19)
							}
							return value;
						}
					}, {
						text: text.busiRetCode,
						dataIndex: name.busiRetCode,
						renderer: function(value) {
							value = value || "";
							var value = tools.htmlToText(value);
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}],
					defaults: {
						style: {
							textAlign: "center"
						},
						align: 'center',
						renderer: function(value) {
							return '<div title="' + value + '" ext:qtitle="' + value + '" ext:qtip="' + value + '">' + value + '</div>';
						}
					}
				},
				forceFit: true,
				renderTo: Ext.getBody()
			});
			return grid;
		},
		contentRight: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				border: 0,
				height: 600,
				margin: "0 0 0 5",
				columnWidth: 0.4,
				items: [Ext.create("Ext.panel.Panel", {
					width: "100%",
					height: 25,
					padding: "5 0 0 10",
					border: 0,
					cls: "x-panel-header-default",
					style: {},
					items: [{
						xtype: "label",
						text: "指标趋势",
						height: 40,
						style: {
							color: "#fff",
							fontSize: "14px",
							fontWeight: "400"
						}
					}]
				}), this.contentRightPanel()]

			});
			return panel;
		},
		contentRightPanel: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				layout: "vbox",
				border: 0,
				defaults: {
					border: 0,
					padding: "10 0 0 0",
					style: {
						border: "1px #ccc solid",
						'border-bottom-width': "0"
					}
				},
				items: [
					this.contentRight1(),
					this.contentRight2(),
					this.contentRight3()
				],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					border: 0,
					padding: 4,
					style: {
						background: "#D5EBE7"
					},
					items: [this.stepComboBox()]
				}]
			});
			return panel;
		},
		stepComboBox: function() {
			var comboBox = Ext.create("Ext.form.ComboBox", {
				queryMode: 'local',
				style: {},
				id: "busiTopicsStepComboBox",
				store: Ext.create("Ext.data.Store", {
					fields: [configs.dimension.key, configs.dimension.value]
				}),
				editable: false,
				autoSelect: true,
				value: "",
				displayField: configs.dimension.key,
				valueField: configs.dimension.value,
				fieldLabel: "业务步骤",
				labelWidth: 60,
				height: 20,
				width: 200,
				listeners: {
					change: ctrl.busiTopics.getTrendAnalysis
				}
			});
			return comboBox;
		},
		contentRight1: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					overflowX: "auto"
				},
				width: "100%",
				items: [{
					xtype: "label",
					text: "业务量/笔",
					margin: 10
				}, {
					margin: "10 0 0 0",
					xtype: "panel",
					height: 140,
					// id: "busiTopicsHandleChart",
					html: "<div id='busiTopicsHandleChart' class='chart'></div>"

				}]
			});
			return panel;
		},
		contentRight2: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					overflowX: "auto"
				},
				width: "100%",
				items: [{
					xtype: "label",
					text: "成功率/%",
					margin: 10
				}, {
					margin: "10 0 0 0",
					xtype: "panel",
					height: 140,
					// id: "busiTopicsRateChart",
					html: "<div id='busiTopicsRateChart' class='chart'></div>"
				}]
			});
			return panel;
		},
		contentRight3: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				defaults: {
					border: 0,
					overflowX: "auto"
				},
				style: {
					border: "1px #ccc solid"
				},
				width: "100%",
				items: [{
					xtype: "label",
					text: "系统时长/s",
					margin: 10
				}, {
					margin: "10 0 0 0",
					xtype: "panel",
					height: 145,
					// id: "busiTopicsDurationChart",
					html: "<div id='busiTopicsDurationChart' class='chart'></div>"
				}]
			});
			return panel;
		}
	},
	mainFooter: {
		content: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				border: 0,
				layout: "column",
				margin: "0 0 10 0",
				defaults: {
					columnWidth: 1 / 2,
					height: 220
				},
				items: [this.retentionPanel(), this.sysRatePanel()]
			});
			return panel;
		},
		retentionPanel: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				margin: "0 5 0 0",
				items: [{
					margin: "10 0 0 0",
					xtype: "panel",
					overflowX: "auto",
					// id: "retention",
					html: "<div id='retention' class='chart'></div>",

					border: 0,
					height: 180
				}],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					border: 0,
					padding: 5,
					style: {
						background: "#D5EBE7"
					},
					items: [{
						xtype: "label",
						text: "各步骤客户留存率"
					}]
				}]
			});
			return panel;
		},
		sysRatePanel: function() {
			var panel = Ext.create("Ext.panel.Panel", {
				margin: "0 0 0 5",
				width: "50%",
				items: [{
					margin: "10 0 0 0",
					xtype: "panel",
					overflowX: "auto",
					// id: "sysRate",
					html: "<div id='sysRate' class='chart'></div>",
					border: 0,
					height: 180
				}],
				dockedItems: [{
					xtype: 'toolbar',
					dock: 'top',
					border: 0,
					padding: 5,
					style: {
						background: "#D5EBE7"
					},
					items: [{
						xtype: "label",
						text: "各步骤系统成功率"
					}]
				}]
			});
			return panel;
		}
	}
};
// 业务专题结束------------------------------------------
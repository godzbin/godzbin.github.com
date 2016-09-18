!function(w,Ext){

	'use strict';

	var 
		/* public object */ 
		vz2 = {},

		/* component */ 
		prolongation = {},

		core2array = [],
		core_forEach = Function.prototype.call.bind(core2array.forEach),
		common = {
			_province: '甘肃省',
		};

	var 
		_application;

	!function(){
		var test = true;
		vz2.ajax = function(opts){
			var _u = opts.url,
				_f = opts.success;
			opts.method = 'GET',
			opts.success = function(res,eOpts){
				var result = JSON.parse(res.responseText);
				_f(true === test ? result[_u] : result,eOpts);
			};
			if(true === test)opts.url = 'script/test.json';
			Ext.Ajax.request(opts);
		}
	}();

	vz2.createDateTimePicker = function(width,columnWidth,hidden,style){
		var
			 mainPanel = Ext.create('Ext.button.Split',{
				text: '选择日期时间',
				width: width,
				columnWidth: columnWidth,
				hidden: hidden || false,
				autoRender: true,
				style: style || {
					background: 'rgba(0,0,0,0.4)',
				},
				handler: function() {
					this.showMenu();
				},
				listeners: {
					menuhide: function(){
						var 
							date = mainPanel.menu.items.get(0).value,
							time = mainPanel.menu.items.get(1).value,
							dateTimeString;

						if(date instanceof Date && time instanceof Date){
							dateTimeString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' + time.getHours() + ':' + time.getMinutes()
							mainPanel.setText(dateTimeString);
						}
					}
				},
				menu: new Ext.menu.Menu({
				    items: [
						{
							xtype: 'datepicker'
						}, {
							fieldLabel: '时间',
							xtype: 'timefield',
							increment: 1,
						}, {
							xtype: 'button',
							text: '确定',
							align: 'center',
							handler: function(button,e){
								mainPanel.hideMenu();
							}
						}
					]
				}),
			});

		return mainPanel;
	}

	/* home */ 

	vz2.monitorSceneInitialize = function(){

		/* define storage & config */ 

		var 
			viewValueController,

			provinceStore = Ext.create('Ext.data.Store',{
				fields: ['name','value'],
				data: [
					{name: '甘肃省', value: 1},
				]
			}),

			businessStore = Ext.create('Ext.data.Store',{
				fields: ['name','value'],
				data: [
					{name: '全部',          value:'1'},
					{name: '充值',          value:'2'},
					{name: '购机',          value:'3'},
					{name: '查欠',          value:'4'},
					{name: '换卡',          value:'5'},
					{name: '活动受理',      value:'6'},
					{name: '积分查询',      value:'7'},
					{name: '交费',          value:'8'},
					{name: '客户信息查询',   value:'9'},
					{name: '免费资源查询',   value:'10'},
					{name: '实时话费查询',   value:'11'},
					{name: '详单查询',       value:'12'},
					{name: '业务变更',       value:'13'},
					{name: '用户订购产品查询',value:'14'},
					{name: '月结账单查询',   value:'15'},
					{name: '中心业务受理',   value:'16'},
					{name: '转套餐办产品',   value:'17'}
				 ]
			}),

			timeRangeStore = Ext.create('Ext.data.Store',{
				fields: ['name','value'],
				data: [
					{name: '近10分钟',  value: '10'},
					{name: '近1小时',   value: '60'},
					{name: '近1天',     value: '1440'},
					{name: '自定义',    value: '0'}
				]
			}),

			warningListStore = Ext.create('Ext.data.Store', {
				fields: [
					{name: 'province', type: 'string'},
					{name: 'channel',  type: 'string'},
					{name: 'business', type: 'string'},
					{name: 'warning',  type: 'string'},
					{name: 'level',    type: 'string'},
					{name: 'timing',   type: 'string'},
					{name: 'count',    type: 'string'},
					{name: 'state',    type: 'string'}
				]
			}),

			boxContent = [
			 	{
					width: 360,
					height: 1380,
					title: '客户端',
					x: 0,
					y: 0,
			 		boxes: [
			 			{
			 				title: '营业厅客户端',
			 				latitude: 0,
			 				type: 1,
			 				icon: 1,
			 				arrowRight: true
			 			}, {
			 				title: '掌厅客户端',
			 				latitude: 5,
			 				type: 1,
			 				icon: 1,
			 				arrowRight: true
			 			}, {
			 				title: '网厅客户端',
			 				latitude: 4,
			 				type: 1,
			 				icon: 1,
			 				arrowRight: true
			 			}, {
			 				title: '其他',
			 				latitude: 6,
			 				type: 1,
			 				icon: 1,
			 				arrowRight: true
			 			}
			 		]
			 	},{
					width: 360,
					height: 1380,
					title: '接口区',
					x: 510,
					y: 0,
			 		boxes: [
			 			{
			 				title: '营业厅protal',
			 				latitude: 0,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '掌厅protal',
			 				latitude: 5,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '网厅protal',
			 				latitude: 4,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '其他protal',
			 				latitude: 6,
			 				type: 1,
			 				icon: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}
			 		]
			 	},{
					width: 870,
					height: 1380,
					title: '核心区',
					x: 1020,
					y: 0,
			 		boxes: [
			 			{
			 				title: 'CRM前台-雁滩',
			 				latitude: 0,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: 'CRM前台-银滩',
			 				latitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: 'BOSS前台-雁滩',
			 				latitude: 2,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: 'BOSS前台-银滩',
			 				latitude: 3,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: 'CRM后台',
			 				latitude: 0,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '账管后台',
			 				latitude: 2,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '账处后台',
			 				latitude: 3,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '统一接口-银滩',
			 				latitude: 4,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '统一接口A-雁滩',
			 				latitude: 5,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}, {
			 				title: '统一接口B-雁滩',
			 				latitude: 6,
			 				longitude: 1,
			 				type: 2,
			 				arrowLeft: true,
			 				arrowRight: true
			 			}
			 		]
			 	},{
					width: 360,
					height: 1380,
					title: '接口区',
					x: 2040,
					y: 0,
			 		boxes: [
			 			{
			 				title: 'CRM-DB',
			 				latitude: 0,
			 				type: 2,
			 				arrowLeft: true
			 			}, {
			 				title: 'BOSS-DB',
			 				latitude: 1,
			 				type: 2,
			 				arrowLeft: true
			 			}
			 		]
			 	}
			],

			tools = function(){
				var 
					canvas,
					ctx,
					content = [],
					_index = 0,
					animationId,
					mouseClickPoint = [0,0],
					mouseOverPoint = [0,0],
					pointer = true;

				var sx = 326, // start x
					sy = 110,  // start y
					ex = 554, // end x
					ey = 110,  // end y
					dx = 510, // distance x
					dy = 180;  // distance y

				return {
					setContext: function(){
						canvas = arguments[0];
						ctx = canvas.getContext('2d');
					},
					setContent: function(){
						content = arguments[0];
					},
					drawBar: function(opts){
						ctx.save();
						ctx.translate(opts.x,opts.y);

						tools.rectWithRadius(opts.width, opts.height);
						ctx.fillStyle = 'rgba(0,0,0,0.2)';
						ctx.fill();
						ctx.fillStyle = '#fff';
						ctx.font = '32px/1 arial';
						ctx.textAlign = 'center';
						ctx.fillText(opts.title,100,50);
						ctx.restore();
					},
					drawBox: function(opts,content){
						ctx.save();
						ctx.translate(80+(510*opts.longitude||0),90+180*opts.latitude);

						tools.rectWithRadius(200,160,10);
						ctx.fillStyle = 'rgba(0,0,0,0.2)';
						ctx.fill();
						if(true === pointer && opts.type === 2){
							if(ctx.isPointInPath(mouseOverPoint[0]*2,mouseOverPoint[1]*2)){
								canvas.style.cursor = 'pointer';
								pointer = false;
							}
						}

						if(opts.type === 2 && ctx.isPointInPath(mouseClickPoint[0]*2,mouseClickPoint[1]*2) && true === pointer){
							mouseClickPoint = [0,0];
							_application = opts.title;
							mainPanel.hide();
							componentPanel.show();
						}

						ctx.beginPath();
						ctx.moveTo(0,40);
						ctx.lineTo(200,40);
						if(opts.type === 2){
							ctx.moveTo(100,40);
							ctx.lineTo(100,160);
							ctx.moveTo(0,100);
							ctx.lineTo(200,100);
						}
						ctx.closePath();
						ctx.lineWidth = 2;
						ctx.strokeStyle = '#fff';
						ctx.stroke();

						true === opts.arrowLeft  && tools.drawArrow(-44,10);
						true === opts.arrowRight && tools.drawArrow(224,10);
						if(opts.icon === 1){
							ctx.save();
							ctx.translate(60,70);
							ctx.beginPath();
							ctx.rect(0,0,80,40);
							ctx.moveTo(30,40);
							ctx.lineTo(30,56);
							ctx.moveTo(50,40);
							ctx.lineTo(50,56);
							ctx.moveTo(15,56);
							ctx.lineTo(65,56);
							ctx.lineWidth = 4;
							ctx.lineCap = 'round';
							ctx.strokeStyle = '#fff';
							ctx.stroke();
							ctx.restore();
						}else if(opts.icon === 2){
							ctx.save();
							ctx.translate(80,70);
							ctx.beginPath();
							ctx.rect(0,0,40,60);
							ctx.moveTo(0,12);
							ctx.lineTo(40,12);
							ctx.lineWidth = 8;
							ctx.lineCap = 'round';
							ctx.strokeStyle = '#fff';
							ctx.stroke();
							ctx.fillStyle = '#fff';
							ctx.fillRect(4,20,32,40);
							ctx.restore();
						}

						ctx.fillStyle = '#fff';
						ctx.textAlign = 'center';
						if(opts.type === 2 && void 0 !== content){
							ctx.font = '24px/1 arial';

							ctx.fillText('交易量',50,64);
							ctx.fillText(content[0]+'笔',50,92);
							ctx.fillText('响应时间',150,64);
							ctx.fillText(content[1]+'ms',150,92);
							ctx.fillText('成功率',50,124);
							ctx.fillText(content[2]+'%',50,150);
							if(content[3] > 0)ctx.fillStyle = '#f00';
							ctx.fillText('告警事件',150,124);
							ctx.fillText(content[3],150,150);
						}
						ctx.font = '26px/1 arial';
						ctx.fillText(opts.title,100,30);

						ctx.restore();
					},
					rectWithRadius: function(width,height,radius){
						var 
							w = width,
							h = height,
							r = radius || 10;

						ctx.beginPath();
						ctx.moveTo(r, 0);
						ctx.lineTo(w - r, 0);
						ctx.quadraticCurveTo(w, 0, w, r);
						ctx.lineTo(w, h - r);
						ctx.quadraticCurveTo(w, h, w - r, h);
						ctx.lineTo(r, h);
						ctx.quadraticCurveTo(0, h, 0, h - r);
						ctx.lineTo(0, r);
						ctx.quadraticCurveTo(0, 0, r, 0);
						ctx.closePath();
					},
					drawArrow: function(x,y){
						ctx.save();
						ctx.translate(x,y);

						ctx.beginPath();
						ctx.moveTo(2,2);
						ctx.lineTo(10,10);
						ctx.lineTo(2,18);

						ctx.translate(10,0);
						ctx.moveTo(2,2);
						ctx.lineTo(10,10);
						ctx.lineTo(2,18);
						ctx.lineCap = 'round';
						ctx.lineWidth = 4;
						ctx.strokeStyle = '#fff';
						ctx.stroke();

						ctx.restore();
					},
					drawLineGroup: function(lineArray){
						ctx.save();
						ctx.beginPath();
						lineArray.forEach(function(line){
							ctx.moveTo(line[0],line[1]);
							ctx.lineTo(line[2],line[3]);
						});
						ctx.lineWidth = 2;
						ctx.strokeStyle = '#fff';
						ctx.stroke();
						ctx.restore();
					},
					createComponent: function(opts){
						var opts = opts;
						if(_index === 15)_index = 0;

						tools.drawBar(opts);
						ctx.save();
						ctx.translate(opts.x,opts.y);
						opts.boxes.forEach(function(box){
							tools.drawBox(box,content[_index]);
							if(box.type === 2)_index++;
						});
						ctx.restore();
					},
					animate: function(){
						pointer = true;
						canvas.style.cursor = 'auto';

						ctx.clearRect(0,0,2400,1400);
						boxContent.forEach(function(item){
							tools.createComponent(item);
						});

						tools.drawLineGroup([
							[sx+dx*0, sy+dy*0, ex+dx*0, ey+dy*0],
							[sx+dx*0, sy+dy*4, ex+dx*0, ey+dy*4],
							[sx+dx*0, sy+dy*5, ex+dx*0, ey+dy*5],
							[sx+dx*0, sy+dy*6, ex+dx*0, ey+dy*6],

							[sx+dx*1, sy+dy*0, ex+dx*1, ey+dy*0],
							[sx+dx*1, sy+dy*0, ex+dx*1, ey+dy*1],
							[sx+dx*1, sy+dy*0, ex+dx*1, ey+dy*2],
							[sx+dx*1, sy+dy*0, ex+dx*1, ey+dy*3],

							[sx+dx*1, sy+dy*4, ex+dx*2, ey+dy*4],
							[sx+dx*1, sy+dy*4, ex+dx*2, ey+dy*5],
							[sx+dx*1, sy+dy*5, ex+dx*2, ey+dy*4],
							[sx+dx*1, sy+dy*5, ex+dx*2, ey+dy*5],
							[sx+dx*1, sy+dy*6, ex+dx*2, ey+dy*4],
							[sx+dx*1, sy+dy*6, ex+dx*2, ey+dy*5],
							[sx+dx*1, sy+dy*6, ex+dx*2, ey+dy*6],

							[sx+dx*2, sy+dy*0, ex+dx*2, ey+dy*0],
							[sx+dx*2, sy+dy*1, ex+dx*2, ey+dy*0],
							[sx+dx*2, sy+dy*2, ex+dx*2, ey+dy*2],
							[sx+dx*2, sy+dy*2, ex+dx*2, ey+dy*3],
							[sx+dx*2, sy+dy*3, ex+dx*2, ey+dy*2],
							[sx+dx*2, sy+dy*3, ex+dx*2, ey+dy*3],

							[sx+dx*3, sy+dy*0, ex+dx*3, ey+dy*0],
							[sx+dx*3, sy+dy*0, ex+dx*3, ey+dy*1],
							[sx+dx*3, sy+dy*2, ex+dx*3, ey+dy*0],
							[sx+dx*3, sy+dy*2, ex+dx*3, ey+dy*1],
							[sx+dx*3, sy+dy*3, ex+dx*3, ey+dy*1],
							[sx+dx*3, sy+dy*4, ex+dx*3, ey+dy*1],
							[sx+dx*3, sy+dy*5, ex+dx*3, ey+dy*1],
							[sx+dx*3, sy+dy*6, ex+dx*3, ey+dy*1]
						]);

						window.requestAnimationFrame(tools.animate);
					},
					handleMouseOver: function(e){
						mouseOverPoint = [e.offsetX,e.offsetY];
					},
					handleMouseLeave: function(e){
						mouseOverPoint = [0,0];
					},
					handleMouseClick: function(e){
						mouseClickPoint = [e.offsetX,e.offsetY];
					},
					run: function(){
						animationId = window.requestAnimationFrame(tools.animate);
						canvas.addEventListener('mousemove',tools.handleMouseOver);
						canvas.addEventListener('mouseleave',tools.handleMouseLeave);
						canvas.addEventListener('click',tools.handleMouseClick);
					}

				}
			}();

		/* define panel */ 

		var 

			mainPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				id: 'vz_monitorSceneMode',
				listeners: {
					afterrender: function(){
						tools.setContext(paintPanel.getEl().dom.querySelector('canvas'));

						tools.run();

						reload({
							province: '甘肃',
							business: '全部',
							timing: '300000'
						});
						mainPanel.show();
						componentPanel.hide();
					}
				}
			}),

			componentPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				hidden: true,
				listeners: {
					show: function(){
						setActiveTag(0);
						menuPanel.items.get(1).setActiveTab(0);
						var _o = menuPanel.query('combobox');
						_o[0].setValue(_application);
						_o[1].setValue(common._province);
					}
				}
			}),

			filterPanel = Ext.create('Ext.form.Panel',{
				layout: 'column',
				border: 0,
				padding: '0 0 10 0',
				margin: '0 0 30 0',
				style: 'border: 0;border-bottom: 1px #aaa solid',
				defaults: {
					editable: false,
					displayField: "name",
					valueField: "value",
					queryMode: "local",
				},
				items: [
					{
						disabled: true,
						fieldLabel: '选择省份',
						labelWidth: 65,
						margin: '0 10 0 0',
						store: provinceStore,
						width: 185,
						xtype: "combobox",
						value: '1',
					}, {
						fieldLabel: '选择类型',
						labelWidth: 65,
						margin: '0 10 0 0',
						store: businessStore,
						width: 185,
						xtype: "combobox",
						value: '1',
					}, {
						fieldLabel: '选择时间段',
						labelWidth: 75,
						margin: '0 10 0 0',
						store: timeRangeStore,
						width: 185,
						xtype: "combobox",
						value: '60',
						listeners: {
							select: function(){
								var 
									initial = false,
									cmp1,cmp2,cmp3;
								return function(combobox,e){
									if(false === initial){
										var itemList = this.ownerCt.items;
										cmp1 = itemList.get(3);
										cmp2 = itemList.get(4);
										cmp3 = itemList.get(5);
										initial = true;
									};

									[cmp1,cmp2,cmp3].forEach(function(item){
										combobox.lastMutatedValue === '自定义'?item.show():item.hide();
									});
								};
							}()
						}
					},
					vz2.createDateTimePicker(125,null,true),
					{
						hidden: true,
						style: {
							lineHeight: '24px',
							textAlign: 'center',
						},
						text: '—',
						width: 30,
						xtype:'label',
					},
					vz2.createDateTimePicker(125,null,true),
					{
						cls: 'vz_search_btn',
						margin: '0 0 0 10',
						width: 27,
						xtype: 'button',
						handler: function(){
							var 
								params = {},
								initial = false,
								itemList = [];

							return function(){
								if(false === initial){
									itemList = filterPanel.query('combobox,splitbutton');
									initial = true;
								}
								params = {
									province:itemList[0].emptyText||itemList[0].lastMutatedValue,
									channel: itemList[1].lastMutatedValue,
									time:    itemList[2].lastMutatedValue,
								}
								if(params.time === '自定义'){
									params.startTime = itemList[5].text;
									params.endTime   = itemList[6].text;
								};
								reload(params);
							}
						}()
					}
				]
			}),

			paintPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				style: 'margin: 0 auto;',
				width: 1200,
				items: {
					html: '<canvas class="vz_topology_canvas" width="2400" height="1400">'
				}
			}),

			warningListPanel = Ext.create('Ext.grid.Panel',{
				border: 0,
				columnWidth: 1,
				cls: 'vz_warningList',
				maxHeight: 220,
				store: warningListStore,
				columns: {
					defaults: {
						menuDisabled: true,
						draggable: false,
						sortable: false,
						align: 'center',
					},
					items: [
						{
							dataIndex: 'province',
							text: "省份"
						}, {
							dataIndex: 'channel',
							text: "交易渠道"
						}, {
							dataIndex: 'business',
							text: "业务名称",
						}, {
							dataIndex: 'warning',
							text: "告警类型"
						}, {
							dataIndex: 'level',
							text: "告警级别"
						}, {
							dataIndex: 'timing',
							text: "告警发生时间"
						}, {
							dataIndex: 'count',
							text: "告警条数"
						}, {
							dataIndex: 'state',
							text: "告警状态"
						}, {
							text: "操作",
							dataIndex:"button", 
							renderer:function(value){
								return "<input type='button' value='查看' />" ;
							}   
						}
					]
				},
				viewConfig : {
					forceFit : false, 
					autoFill : false 
				},
				tbar: [
					{
						xtype: 'label',
						text: '告警列表'
					}, {
						baseCls: "vz-icon vz-icon-i1",
						handler: function() {
							var initial = false;
							return function(){
								false === initial && (initial = true) && void 0 === warningCenterPanel && warningCenterInitial();
								mainPanel.hide();
								warningCenterPanel.show();
							}
						}()
					}
				],
				layout: 'fit',
				listeners: {
					itemclick: function(){
						var initial = false;
						return function(){
							false === initial && (initial = true) && void 0 === warningCenterPanel && warningCenterInitial();
							mainPanel.hide();
							warningCenterPanel.show();
						}
					}()
				},
				forceFit: true,
				autoRender: true
			}),

			menuPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				cls: 'vz_lock_menu',
				style: {
					borderBottom: '1px #fff solid'
				},
				items: [
					{
						border: 0,
						defaults: {
							xtype: 'combobox',
							editable: false,
							displayField: 'name',
							valueField: 'value'
						},
						width: 350,
						layout: 'column',
						style: {
							margin: '0 auto'
						},
						items: [
							{
								cls: 'vz_combobox_large',
								width: 220,
								height: 37,
								style: {
									fontSize: '24px',
								},
								store: new Ext.data.Store({
									fields: ['name','value'],
									data: [
										{name: '营业厅protal' ,value: '营业厅protal'  },
										{name: '网厅protal'   ,value: '网厅protal'   },
										{name: '掌厅protal'   ,value: '掌厅protal'   },
										{name: 'CRM前台-雁滩' ,value: 'CRM前台-雁滩'  },
										{name: 'CRM前台-银滩' ,value: 'CRM前台-银滩'  },
										{name: 'BOSS前台-雁滩',value: 'BOSS前台-雁滩' },
										{name: 'BOSS前台-银滩',value: 'BOSS前台-银滩' },
										{name: 'CRM后台'      ,value: 'CRM后台'       },
										{name: '账管后台'      ,value: '账管后台'      },
										{name: '账处后台'      ,value: '账处后台'      },
										{name: '统一接口-银滩' ,value: '统一接口-银滩' },
										{name: '统一接口A-雁滩',value: '统一接口A-雁滩'},
										{name: '统一接口B-雁滩',value: '统一接口B-雁滩'},
										{name: 'CRM-DB'       ,value: 'CRM-DB'       },
										{name: 'BOSS-DB'      ,value: 'BOSS-DB'      },
									]
								}),
							},{
								margin: '12 0 0 20',
								width: 100,
								store: new Ext.data.Store({
									fields: ['name','value'],
									data: [
										{name: '甘肃省', value: '甘肃省'}
									]
								}),
							}
						]
					}, {
						border: 0,
						plain: true,
						width: 370,
						xtype: 'tabpanel',
						style: {
							margin: '0 auto',
						},
						defaults: {
							border: 0,
							listeners: {
								activate: function(newTag,oldTag){
									setActiveTag(newTag.pageId,oldTag.pageId);
								}
							}
						},
						items: [
							{pageId: 0,title: "应用层视图",}, 
							{pageId: 1,title: "应用层快照",}, 
							{pageId: 2,title: "多维统计",  }, 
							{pageId: 3,title: '交易追踪',  },
						],
					}
				],
			}),

			warningCenterPanel;

		/* define features */ 

		var 

			reload = function(){
				var 
					province,
					business,
					timing;

				return function(options){
					if('province' in options)province = options['province'];
					if('business' in options)business = options['business'];
					if('timing'   in options)timing   = options['timing'];

					vz2.ajax({
						url: 'monitorSceneInitialize',
						params: {
							'province':province,
							'business':business,
							'timing':  timing
						},
						success: function(res, eOpts){
							var
								review = res['review'],
								warningList = res['warningList'];

							warningListStore.loadData(warningList);
							tools.setContent(review);
						},
						failure: function(){

						}
					})
				}
			}(),

			setActiveTag = function(){
				var tagContainer = [],
					_constructor = ['applicationSceneMode','applicationSnapShot','applicationStatistics','transactionTracking'];

				return function(index,lastActiveTag){
					if(void 0 === tagContainer[index]){
						var _o =  prolongation[_constructor[index]]();
						tagContainer[index] = _o;
						componentPanel.add(_o);
					}
					if(void 0 !== lastActiveTag)tagContainer[lastActiveTag].hide();
					tagContainer[index].show();
				}
			}(),

			warningCenterInitial = function(){
				warningCenterPanel = prolongation['warningCenter']();
				mainPanel.up('panel').add(warningCenterPanel);
			};

			vz2.changeModel = function(){
				var initial = false;
				return function(){
					false === initial && (initial = true) && void 0 === warningCenterPanel && warningCenterInitial();
					mainPanel.hide();
					warningCenterPanel.show();
				}
			}();

		/* initialize */ 

		// tools.createComponent();
		mainPanel.add([filterPanel,paintPanel,warningListPanel]);
		componentPanel.add(menuPanel);

		return [mainPanel,componentPanel];
	};

	vz2.extend = function(name, target){
		prolongation[name] = target;
	}

	/* component */ 


	return w.vz2 = vz2;

}(window,Ext);
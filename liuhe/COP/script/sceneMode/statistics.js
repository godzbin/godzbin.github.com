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

			boxContent = {
			 	bar1: {
			 		title: '客户端',
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
			 	},
			 	bar2: {
			 		title: '接口区',
					translate: '(255,0)',
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
			 	},
			 	bar3: {
			 		title: '核心区',
					translate: '(510,0)',
					scale: '(2.416666,1)',
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
			 	},
			 	bar4: {
			 		title: '接口区',
					translate: '(1020,0)',
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
			},

			tools = {
				model:[
					{title: '交易量',   content: '0', x1:65, y1:32, x2:65, y2:46},
					{title: '响应时间', content: '0', x1:115,y1:32, x2:115,y2:46},
					{title: '成功率',   content: '0', x1:65, y1:62, x2:65, y2:75},
					{title: '告警事件', content: '0', x1:115,y1:62, x2:115,y2:75}
				],

				createPaintContainer: function(options){
					var options = options;
					options.xmlns = "http://www.w3.org/2000/svg";
					options.version = "1.1";

					var oSvg = this.createSVGPattern({
						type: 'svg',
						attr: options
					});
					oSvg.innerHTML = '\
						<defs>\
							<g id="mainPanel">\
								<rect x="10" y="10" width="160" height="670" fill="rgba(0,0,0,0.2)" stroke="none" />\
								<rect x="5" y="5" width="170" height="680" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="10px" stroke-linejoin="round"/>\
							</g>\
							<g id="outerPanel1">\
								<rect x="50" y="10" width="80" height="60" fill="rgba(0,0,0,0.2)" stroke="none" />\
								<rect x="45" y="5" width="90" height="70" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="10px" stroke-linejoin="round" />\
								<path d="M 40 20 L 140 20" stroke-width="1px" stroke="#ffffff" fill="none" id="panelSlice1"/>\
							</g>\
							<g id="outerPanel2">\
								<use xlink:href="#outerPanel1" x="" y=""/>\
								<path d="M 40 50 L 140 50 M 91 20 L 91 80" stroke-width="1px" stroke="#999999" fill="none"/>\
							</g>\
							<!-- icon -->\
							<path d="M 1 1 L 41 1 L 41 21 L 1 21 L 1 0 M 16 22 L 16 27 M 26 22 L 26 27 M 9 28 L 33 28" stroke-width="2px" stroke="#ffffff" fill="none" id="computerPanel"/>\
							<g id="board">\
								<rect x="" y="" width="20" height="30" fill="none" stroke="#ffffff" stroke-width="4px"/>\
								<path d="M 0 6 L 20 6" stroke-width="3px" stroke="#ffffff" fill="none"/>\
								<rect x="0" y="10" width="20" height="20" fill="#ffffff" stroke="none"/>\
							</g>\
							<path d="M 1 1 L 5 5 L 1 9" stroke-width="2px" stroke="#ffffff" stroke-linejoin="round" fill="none" id="arrow"/>\
							<g id="arrowLeft">\
								<use xlink:href="#arrow" x="18" y="5"/>\
								<use xlink:href="#arrow" x="23" y="5"/>\
							</g>\
							<g id="arrowRight">\
								<use xlink:href="#arrow" x="152" y="5"/>\
								<use xlink:href="#arrow" x="157" y="5"/>\
							</g>\
						</defs>'

					return oSvg;
				},
				createComponent: function(){
					var 
						_this = this,
						barElement,
						barOpts,
						box;

					viewValueController = new tools.ViewValueController();

					for(var bar in boxContent){
						barOpts = {
							title:     boxContent[bar]['title'],
							translate: boxContent[bar]['translate'],
							scale:     boxContent[bar]['scale']
						};
						barElement = tools.createBar(barOpts);

						boxContent[bar]['boxes'].forEach(function(item){
							box = tools.createBox(item);
							viewValueController.add({
								el:   box,
								type: item.type
							});
							barElement.appendChild(box);
						});

						paintPanel.appendChild(barElement);
					}

					var sx = 163, // start x
						sy = 55,  // start y
						ex = 277, // end x
						ey = 55,  // end y
						dx = 255, // distance x
						dy = 90;  // distance y

					var lineGroup = tools.createLineGroup([
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
					paintPanel.appendChild(lineGroup);
				},
				createLineGroup: function(pointArray){
					var
						g = this.createSVGPattern({type:'g'}),
						_this = this;

					pointArray.forEach(function(item){
						var point = _this.createSVGPattern({
							type: 'path',
							attr: {
								'd': 'M '+item[0]+' '+item[1]+' L '+item[2]+' '+item[3],
								'stroke': '#ffffff',
								'stroke-width': '1px',
								'fill': 'none'
							}
						});
						g.appendChild(point);
					});

					return g;
				},
				createBar: function(options){
					/*
					 * optional property: translate, scale
					 */ 
					var 
						options = options || {},
						g = this.createSVGPattern({
							type: 'g',
							attr: {
								transform: 'translate'+(options.translate||'(0)')
							}
						}),
						use = this.createSVGPattern({
							type: 'use',
							attr: {
								transform: 'scale'+(options.scale||'(1)')
							},
							attrNS: {
								xlink: '#mainPanel'
							}
						}),
						title = this.createText({
							x: 50,
							y: 25,
							fs: '16px',
							content: options.title
						});

					[use,title].forEach(function(item){
						g.appendChild(item);
					});

					return g;
				},
				createBox: function(options){
					/*
					 * options: type, title
					 * optional property: translate, icon, arrow, content!
					 */ 
					var 
						g = this.createSVGPattern({
							type: 'g',
							attr: {
								transform: 'translate('+(parseInt(options.longitude) * 255 || 0)+','+(parseInt(options.latitude) * 90 + 45)+')'
							}
						}),
						background = this.createSVGPattern({
							type: 'use',
							attrNS: {
								xlink: '#outerPanel'+options.type
							}
						}),
						title = this.createText({
							x: 90,
							y: 15,
							fs: options['fs']||'13px',
							content: options.title,
							color: options.color
						}),
						container,
						icon = options.icon && this.createSVGPattern({
							type: 'use',
							attr: {
								x: options.icon==1?69:80,
								y: 35
							},
							attrNS: {
								xlink: options.icon==1?'#computerPanel':'#board'
							}
						}),
						arrowLeft = options.arrowLeft && this.createSVGPattern({
							type: 'use',
							attrNS: {
								xlink: '#arrowLeft'
							}
						}),
						arrowRight = options.arrowRight && this.createSVGPattern({
							type: 'use',
							attrNS: {
								xlink: '#arrowRight'
							}
						});

					if(options.type === 2){
						/* create box content */ 
						container = document.createDocumentFragment();
						tools.model.forEach(function(item,index){
							var 
								boxTitle = tools.createText({
									'x': item['x1'],
									'y': item['y1'],
									'content': item.title,
									'fs': '12px',
									'color':item.color
								}),
								boxContent = tools.createText({
									'x': item['x2'],
									'y': item['y2'],
									'content': item['content'],
									'fs': '12px',
									'color':item.color
								});
							container.appendChild(boxTitle);
							container.appendChild(boxContent);
						});

						g.addEventListener('click',function(e){
							_application = this.getElementsByTagName('text')[0].innerHTML;
							mainPanel.hide();
							componentPanel.show();
						},false);
					}

					[background,title,container,icon,arrowLeft,arrowRight].forEach(function(item){
						true === item instanceof Node && g.appendChild(item);
					});

					return g;
				},
				createText: function(opt){
					/*
					 * options: content
					 * optional property: x, y, fs(short for font-size), color
					 */ 
					var text = this.createSVGPattern({
						type: 'text',
						attr: {
							'x': opt.x||0,
							'y': opt.y||0,
							'font-size': opt['fs']||'16px',
							'text-anchor': 'middle',
							'fill': opt.color||'#ffffff'
						}
					});
					text.innerHTML = opt.content;
					return text;
				},
				createSVGPattern: function(options){
					/*
					 * optional property:
					 * x, y, fs(short for font-size), color
					 */ 
					var o = document.createElementNS('http://www.w3.org/2000/svg',options.type);
					if(void 0 !== options.attr){
						for(var n1 in options.attr){
							o.setAttribute(n1,options.attr[n1]);
						}
					}
					if(void 0 !== options.attrNS){
						for(var n2 in options.attrNS){
							o.setAttributeNS('http://www.w3.org/1999/'+n2,n2+':href',options.attrNS[n2]);
						}
					}
					return o;
				},
				ViewValueController: function(){
					var 
						elementStore = [],
						col,
						i;

					this.add = function(){
						core_forEach(arguments,function(item){
							elementStore.push(item);
						});
					}

					this.update = function(){
						i = 0;
						var arg = arguments[0];
						core_forEach(elementStore,function(item){
							if(item.type === 2 && void 0 !== arg[i]){
								handle(item.el.children,arg[i]);

								i++;
							}
						});
					}

					function handle(el,data){
						col =  data[3] > 0 ? '#ff0000' : '#ffffff';
						el[1].setAttribute('fill',col);
						el[8].setAttribute('fill',col);
						el[9].setAttribute('fill',col);

						el[3].innerHTML = data[0] + '笔';
						el[5].innerHTML = data[1] + 'ms';
						el[7].innerHTML = data[2] + '%';
						el[9].innerHTML = data[3];
					}
				},
			};

		/* define panel */ 

		var 

			mainPanel = Ext.create('Ext.panel.Panel',{
				border: 0,
				// width: 1200,
				id: 'vz_monitorSceneMode',
				listeners: {
					afterrender: function(){
						mainPanel.child().getEl().dom.parentNode.appendChild(paintPanel);
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
				// width: 1200,
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
				// width: 1200,
				border: 0,
				padding: '0 0 10 0',
				margin: '0 0 740 0',
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
						listeners: {
							afterrender: function(){
								this.setValue(1);
							}
						}
					}, {
						fieldLabel: '选择业务',
						labelWidth: 65,
						margin: '0 10 0 0',
						store: businessStore,
						width: 185,
						xtype: "combobox",
						listeners: {
							afterrender: function(){
								this.setValue(1);
							}
						}
					}, {
						fieldLabel: '选择时间段',
						labelWidth: 75,
						margin: '0 10 0 0',
						store: timeRangeStore,
						width: 185,
						xtype: "combobox",
						listeners: {
							afterrender: function(){
								this.setValue('60');
							},
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

			paintPanel = tools.createPaintContainer({
				width: 1200,
				height: 700,
				style: 'position: absolute;top: 65px;'
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
				// width: 1200,
				items: [
					{
						border: 0,
						defaults: {
							xtype: 'combobox',
							editable: false,
							displayField: 'name',
							valueField: 'value'
						},
						width: 300,
						layout: 'column',
						style: {
							margin: '0 auto'
						},
						items: [
							{
								cls: 'vz_combobox_large',
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

							viewValueController.update(review);
							warningListStore.loadData(warningList);
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

		/* initialize */ 

		tools.createComponent();
		mainPanel.add([filterPanel,warningListPanel]);
		componentPanel.add(menuPanel);

		return [mainPanel,componentPanel];
	};

	vz2.extend = function(name, target){
		prolongation[name] = target;
	}

	/* component */ 


	return w.vz2 = vz2;

}(window,Ext);
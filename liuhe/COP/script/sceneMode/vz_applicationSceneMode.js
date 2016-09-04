/*
 * 应用层视图
 *
 */ 


vz2.extend('applicationSceneMode',function(){

	/* define option for combobox */ 

	var 
		cTools,
		transactionTypeStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '全部', value: '0'},
				{name: '交易类型1', value: '1'},
				{name: '交易类型2', value: '2'},
				{name: '交易类型3', value: '3'},
				{name: '交易类型4', value: '4'},
				{name: '交易类型5', value: '5'},
			]
		}),
		transactionChannelStore = Ext.create('Ext.data.Store', {
			fields: ['name','value'],
			data: [
				{name: '全部', value: '0'},
				{name: '交易渠道1', value: '1'},
				{name: '交易渠道2', value: '2'},
				{name: '交易渠道3', value: '3'},
				{name: '交易渠道4', value: '4'},
				{name: '交易渠道5', value: '5'},
			]
		}),
		periodStore = Ext.create('Ext.data.Store', {
			/* unit: minute */ 
			fields: ['name','value'],
			data: [
				{name: '近10分钟',  value: '10'},
				{name: '近1小时',   value: '60'},
				{name: '近1天',     value: '1440'},
				{name: '自定义',    value: '0'}
			]
		});

	/* define panel */ 

	var 

		mainPanel = Ext.create('Ext.panel.Panel',{
			style: 'width: 100%;min-width:1200px;',
			id: 'vz_appSceneMode',
			listeners: {
				afterrender: function(){
					var 
						initial = false,
						itemList;

					return function(){
						if(false === initial){
							itemList = mainPanel.query('combobox');
							initial = true;
						};
						var params = cTools.granularityCalculator();

						params.statement = itemList[0].lastMutatedValue,
						params.channel   = itemList[1].lastMutatedValue,

						reload(params);
					}
				}()
			},
			defaults: {
				border: 'none'
			},
			tbar: {
				margin: '0 0 10 0',
				defaults: {
					editable: false,
					displayField: 'name',
					valueField: 'value',
					queryMode: 'local',
				},
				items: [
					{
						fieldLabel: '交易类型',
						labelWidth: '75px',
						store: transactionTypeStore,
						value: '0',
						xtype: 'combobox',
					}, {
						fieldLabel: '交易渠道',
						labelWidth: '75px',
						store: transactionChannelStore,
						value: '0',
						xtype: 'combobox',
					}, {
						fieldLabel: '时间',
						labelWidth: '75px',
						store: periodStore,
						value: '60',
						xtype: 'combobox',
						listeners: {
							select: function(){
								var 
									initial = false,
									cmp1,cmp2,cmp3,cmp4,
									refer = {'0':'','10':'1分钟','60':'5分钟','1440':'30分钟'};
								return function(combobox,e){
									if(false === initial){
										var itemList = this.ownerCt.items;
										cmp1 = itemList.get(3);
										cmp2 = itemList.get(4);
										cmp3 = itemList.get(5);
										cmp4 = itemList.get(6);
										initial = true;
									};
									[cmp1,cmp2,cmp3].forEach(function(item){
										combobox.value === '0'?item.show():item.hide();
									});

									cmp4.setValue(refer[combobox.value]);
								};
							}()
						}
					},
					vz2.createDateTimePicker(null,0.125,true),
					{
						columnWidth: 1/46,
						hidden: true,
						style: {
							lineHeight: '24px',
							textAlign: 'center',
							color: '#fff',
						},
						text: '—',
						xtype:'label',
					},
					vz2.createDateTimePicker(null,0.125,true),
					{ 
						fieldLabel: '粒度',
						labelWidth: 40,
						value: '5分钟',
						name: 'timeGranularity',
						readOnly: true,
						width: 100,
						xtype: 'textfield',
					}, {
						cls: 'vz_search_btn',
						columnWidth: 1/25,
						margin: '0 0 0 20',
						xtype: 'button',
						handler: function(){
							var 
								initial = false,
								refer = {1:'1分钟',5:'5分钟',15:'15分钟',30:'30分钟',60:'1小时',240:'4小时',1440:'1天'},
								granularity,
								itemList;

							return function(){
								if(false === initial){
									itemList = mainPanel.query('combobox');
									granularity = mainPanel.query('textfield')[5];
									initial = true;
								};
								var params = cTools.granularityCalculator();

								params.statement = itemList[0].lastMutatedValue,
								params.channel   = itemList[1].lastMutatedValue,

								granularity.setValue(refer[params.granularity]);
								reload(params);
							}
						}()
					}
				]
			},
			items: [{
				layout: 'column',
				defaults: {
					border: 'none'
				},
				items: [{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas1" width="1180" height="420"></canvas>'
				},{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas2" width="1180" height="420"></canvas>'
				}]
			}, {
				layout: 'column',
				items: [{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas3" width="1180" height="420"></canvas>'
				},{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas4" width="1180" height="420"></canvas>'
				}]
			}, {
				layout: 'column',
				items: [{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas5" width="1180" height="420"></canvas>'
				},{
					columnWidth: 1/2,
					html: '<canvas id="vz_canvas6" width="1180" height="420"></canvas>'
				}]
			}]
		});

	/* define features */ 

	cTools = {
		drawCoordinate:  function(ctx,opts){
			ctx.clearRect(0,0,1180,420);

			var result = cTools.pointFilter({
				startTime: opts.startTime,
				endTime: opts.endTime,
				granularity: opts.timeDistance,
				lineChartPointArray: opts.lineChartPointArray,
				x: opts.lineChartOriginX,
				y: opts.lineChartOriginY,
				strokeStyle: opts.lineChartStrokeStyle,
				lineWidth: opts.lineChartWidth,
				fillStyle: opts.lineChartFillStyle
			});

			cTools.drawTitle(ctx, opts.title);

			cTools.drawMathOrdinate(ctx, opts.rowValue, opts.rows);

			cTools.drawTimeAbscissa(ctx, result);

			opts.statement.forEach(function(item){
				cTools.drawStatement(ctx,{
					x:item.x,
					y:item.y,
					strokeStyle: item.strokeStyle,
					fillStyle: item.fillStyle,
					text: item.text
				});
			});

			cTools.drawLineChart(ctx, result);
		},
		drawBarGraph:    function(ctx,opts){
			ctx.clearRect(0,0,1180,420);

			var result = cTools.pointFilter({
				startTime: opts.startTime,
				endTime: opts.endTime,
				granularity: opts.timeDistance,
				lineChartPointArray: opts.lineChartPointArray,
				x: opts.lineChartOriginX,
				y: opts.lineChartOriginY,
				strokeStyle: opts.lineChartStrokeStyle,
				lineWidth: opts.lineChartWidth,
				fillStyle: opts.lineChartFillStyle
			});

			cTools.drawTitle(ctx, opts.title);

			cTools.drawMathOrdinate(ctx, opts.rowValue, opts.rows);

			cTools.drawTimeAbscissa(ctx, result);

			opts.statement.forEach(function(item){
				cTools.drawStatement(ctx,{
					x:item.x,
					y:item.y,
					strokeStyle: item.strokeStyle,
					fillStyle: item.fillStyle,
					text: item.text
				});
			});

			var 
				degreeLength = result.degreeLength,
				barWidth = degreeLength * 2 / 3,
				halfWidth = barWidth / 2;

			ctx.save();
			ctx.translate(result.x, result.y);
			result.path.forEach(function(item,i){
				ctx.fillStyle = '#fff';
				ctx.fillRect(i * degreeLength - halfWidth,0,barWidth,-200);
				ctx.fillStyle = 'rgb(219,0,97)';
				ctx.fillRect(i * degreeLength - halfWidth,0,barWidth,-item[1]);
			});
			ctx.restore();
		},
		drawRankingLisk: function(ctx,opts){
			ctx.clearRect(0,0,1180,420);

			cTools.drawTitle(ctx, opts.title);

			opts.statement.forEach(function(item){
				cTools.drawStatement(ctx,{
					x:item.x,
					y:item.y,
					strokeStyle: item.strokeStyle,
					fillStyle: item.fillStyle,
					text: item.text
				});
			});


			var 
				adjustValue = opts.columnValue,
				degreeLength,
				step,
				cube = 0;

			while(adjustValue > 10){
				adjustValue = adjustValue/10;
				cube++;
			}
			for(var i = 8;i > 4;i--){
				if(adjustValue * 10 % i === 0){
					step = i;
					break;
				}
			}
			degreeLength = 1000 / step;
			adjustValue = Math.ceil(adjustValue) * Math.pow(10,cube);

			ctx.save();
			ctx.translate(130,300);
			ctx.beginPath();
			ctx.moveTo(0,   0);
			ctx.lineTo(1000,0);
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.textAlign = "center";
			ctx.font = '100 20px/1 arial';
			for(var i = 0;i <= step;i++){
				ctx.moveTo(i * degreeLength,20);
				ctx.lineTo(i * degreeLength,-220);
				ctx.fillText(i * adjustValue / step,i * degreeLength,20)
			}
			ctx.closePath();
			ctx.strokeStyle = '#999';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.restore();

			ctx.save();
			ctx.translate(120,90);
			ctx.lineWidth = 2;
			ctx.font = '100 20px/1 arial';
			ctx.fillStyle = '#fff';
			ctx.textAlign = "end";
			ctx.textBaseline = 'middle';
			for(var i = 0;i < 10;i++){
				ctx.fillText(opts.rankingList[i]['type'], 0, 200 - 20 * i);
			}
			ctx.restore();

			ctx.save();
			ctx.translate(130,105);
			ctx.fillStyle = 'rgba(195,114,27,0.8)';
			for(var i = 0;i < 10;i++){
				ctx.fillRect(0,i * 20,1000 * opts.rankingList[i]['length'] / adjustValue,15);
			}
			ctx.restore();
		},
		drawPieChart:    function(ctx,opts){
			ctx.clearRect(0,0,1180,420);

			var 
				startAnkle = -Math.PI / 2,
				endAnkle;

			cTools.drawTitle(ctx, opts.title);

			ctx.save();

			opts.items.forEach(function(item,index){
				cTools.drawStatement(ctx,{
					x:920,
					y:130 + index * 50,
					strokeStyle: item.strokeStyle,
					fillStyle: item.fillStyle,
					text: item.text
				});

				ctx.beginPath();

				endAnkle = startAnkle + Math.PI * item.percent / 50;
				ctx.arc(
					opts.lineChartOriginX,
					opts.lineChartOriginY,
					125,
					startAnkle,
					endAnkle,
					false
				);
				ctx.lineTo(opts.lineChartOriginX,opts.lineChartOriginY);
				ctx.fillStyle = item.fillStyle;
				ctx.fill();
				startAnkle = endAnkle;
			});
			ctx.closePath();

			ctx.restore();
		},
		drawLineChart: function(ctx,opts){
			ctx.save();
			ctx.translate(opts.x,opts.y);
			ctx.beginPath();
			ctx.moveTo(opts.path[0][0],-opts.path[0][1]);
			opts.path.shift();
			opts.path.forEach(function(point,index){
				ctx.lineTo(point[0],-point[1]);
			});
			if(void 0 !== opts.fillStyle){
				ctx.lineTo(900,0);
				ctx.lineTo(0,0);
				ctx.closePath();
				ctx.fillStyle = opts.fillStyle;
				ctx.fill();
			}
			ctx.lineWidth = opts.lineWidth || 2;
			ctx.strokeStyle = opts.strokeStyle;
			ctx.stroke();
			ctx.restore();
		},
		drawTitle: function(ctx,text){
			ctx.save();
			ctx.font = '100 30px/1 arial';
			ctx.lineWidth = 2;
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.fillText(text,30,30);
			ctx.restore();
		},
		drawMathOrdinate: function(ctx,maxValue,row){
			var 
				valueDiff = maxValue / row,
				lineHeight = 200 / row;

			ctx.save();
			ctx.lineWidth = 2;
			ctx.fillStyle = '#fff';
			ctx.font = '100 20px/1 arial';
			ctx.textAlign = "end";
			ctx.textBaseline = 'middle';
			ctx.translate(120,100);
			for(var i = 0;i <= row;i++){
				ctx.fillText(valueDiff * i, 0, 200 - lineHeight * i);
			}
			ctx.restore();

			ctx.save();
			ctx.translate(130,100);
			ctx.beginPath();

			for(var j = 0;j <= row;j++){
				ctx.moveTo(0,   j*lineHeight);
				ctx.lineTo(1000,j*lineHeight);
			}
			ctx.moveTo(0,200);
			ctx.lineTo(0,0);
			ctx.closePath();

			ctx.strokeStyle = '#999';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.restore();
		},
		drawTimeAbscissa: function(ctx,opts){

			/**
			 *  时间长度应该调整为 粒度x2 的整数倍
			 *  以保证刻度数量为偶数
			 *  最小10min 最大90day
			 *	遇到刻度数量为以下数字时，按给定方式调整
			 *  22 -> 20 : (10x 2) + 1 + 1
			 *  26 -> 24 : (6 x 4) + 1 + 1
			 *  34 -> 30 : (6 x 5) + 1 + 1
			 *  38 -> 35 : (7 x 5) + 1 + 1
			 *  46 -> 42 : (7 x 6) + 1 + 1
			 *  58 -> 54 : (9 x 6) + 1 + 1
			 *  其余情况，按刻度标数12～5，计算绘制刻度标数的间隔数
			 */ 

			var 
				count = opts.count,
				degreeLength = opts.degreeLength,
				_date,
				time,
				day,
				rows = 1;

			ctx.save();
			ctx.translate(opts.x, opts.y);
			ctx.beginPath();

			ctx.lineWidth = 1;
			ctx.strokeStyle = '#999';
			ctx.textBaseline = 'top';
			ctx.fillStyle = '#fff';
			ctx.textAlign = "end";
			ctx.font = '100 20px/1 arial';

			if(opts.endTime - opts.startTime > 86400000)rows = 2;

			for(var i = 0;i <= count;i++){
				ctx.moveTo(i * degreeLength,0);
				if(i % opts.step === 0){
					_date = new Date(opts.startTime - -opts.granularity * i * 60000).toString()
					time  = _date.substr(16,5);
					day   = _date.substr(4,6)
					ctx.lineTo(i * degreeLength,20);
					ctx.fillText(time,i * degreeLength + 25,20 * rows);
					if(rows > 1)ctx.fillText(day,i * degreeLength + 28,20);
				}else{
					ctx.lineTo(i * degreeLength,10);
				}
			};
			if(true === opts.compensate){
				ctx.fillText(
					opts.endTime.toString().substr(16,5),
					930,20
				);
			};

			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		},
		drawStatement: function(ctx,opts){
			ctx.save();

			ctx.translate(opts.x,opts.y);
			ctx.fillStyle = opts.fillStyle;
			ctx.fillRect(0,1,18,18);
			if(void 0 !== opts.strokeStyle){
				ctx.strokeStyle = '#fff';
				ctx.strokeRect(0,1,18,18);
			}
			ctx.fillStyle = '#fff';
			ctx.font = '100 20px/1 arial';
			ctx.textBaseline = 'top';
			ctx.fillText(opts.text,30,0);

			ctx.restore();
		},
		pointFilter: function(opts){

			var 
				opts = opts,
				step,
				count = (opts.endTime - opts.startTime) / (opts.granularity * 60000),
				degreeLength = 900 / count;

			opts.compensate = false;

			!function(){
				switch(count){
					case 26:
						step = 3;
						break;
					case 34:
						step = 5;
						break;
					case 38:
						step = 5;
						break;
					case 46:
						step = 6;
						break;
					case 58:
						step = 6;
						break;
				}
				if(step > 0)return opts.compensate = true;
				for(var i = 12;i > 4;i--){
					if(count % i === 0){
						step = count / i;
						break;
					}
				}
			}();

			opts.step = step;
			opts.count = count;
			opts.degreeLength = degreeLength;

			opts.path = opts.lineChartPointArray.map(function(item,i){
				return [i * degreeLength,item];
			});

			return opts;
		},
		granularityCalculator: function(){
			var 
				timeLength,startTimePanel,endTimePanel,
				initial = false;
			return function(){
				if(false === initial){
					timeLength = mainPanel.query('combobox')[2];
					var splitbutton = mainPanel.query('splitbutton');
					startTimePanel = splitbutton[0];
					endTimePanel   = splitbutton[splitbutton.length > 2 ? 2 : 1];
					initial = true;
				}
				var 
					resultObj = {},
					granularity,
					st = new Date(startTimePanel.text), 
					et = new Date(endTimePanel.text), 
					_length = parseInt(timeLength.value);

				if(_length === 0){
					_length = (et - st) / 60000;
				}else{
					et = new Date().getTime();
				}

				if(isNaN(_length))return resultObj;

				_length = _length > 43200 ? 43200 : _length < 10 ? 10 : _length;

				!function(a,b){
					[a,b,a].forEach(function(item){
						item();
					});
				}(
					function(){
						switch(true){
							case _length < 60:
								granularity = 1;
								break;
							case _length < 300:
								granularity = 5;
								break;
							case _length < 900:
								granularity = 15;
								break;
							case _length < 1800:
								granularity = 30;
								break;
							case _length < 3600:
								granularity = 60;
								break;
							case _length < 14400:
								granularity = 240;
								break;
							default:
								granularity = 1440;
								break;
						}
					},
					function(){
						_length = Math.ceil(_length /(2 * granularity)) * granularity * 2;
					}
				);

				et = new Date(Math.floor(et / (granularity*60000)) * (granularity*60000))
				st = new Date(et - _length * 60000);

				resultObj = {
					granularity: granularity,
					startTime:   st,
					endTime:     et,
					length:      _length,
				};

				return resultObj;
			}
		}()
	};

	var reload = function(){
		var 
			initial = false,
			canvas1, ctx1,
			canvas2, ctx2,
			canvas3, ctx3,
			canvas4, ctx4,
			canvas5, ctx5,
			canvas6, ctx6;

		return function(params){
			if(false === initial){
				canvas1 = document.getElementById('vz_canvas1');ctx1 = canvas1.getContext('2d');
				canvas2 = document.getElementById('vz_canvas2');ctx2 = canvas2.getContext('2d');
				canvas3 = document.getElementById('vz_canvas3');ctx3 = canvas3.getContext('2d');
				canvas4 = document.getElementById('vz_canvas4');ctx4 = canvas4.getContext('2d');
				canvas5 = document.getElementById('vz_canvas5');ctx5 = canvas5.getContext('2d');
				canvas6 = document.getElementById('vz_canvas6');ctx6 = canvas6.getContext('2d');
				initial = true;
			}
			var params = params;

			vz2.ajax({
				url: 'applicationSceneMode',
				params: params,
				success: function(res,eOpts){
					var 
						transactionCount = res['transactionCount'],
						transactionRate  = res['transactionRate'],
						responseTime     = res['responseTime'],
						responseRate     = res['responseRate'],
						ranking          = res['ranking'],
						responseCode     = res['responseCode'],
						maxValue = Math.max.apply(Math,transactionCount.pointArray);

					!function(){
						var i = 0;
						while(maxValue > 10){
							maxValue /= 10;
							i++;
						};
						maxValue = Math.ceil(maxValue) * Math.pow(10,i);
						if(maxValue < 30)maxValue = 30;
					}();

					cTools.drawCoordinate(ctx1, {
						title: '交易量/笔',
						rows: 5,
						rowValue: maxValue,
						startTime: params.startTime,
						endTime: params.endTime,
						timeDistance: params.granularity,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						lineChartPointArray: transactionCount.pointArray.slice(0,(params.length/params.granularity)+1),
						lineChartStrokeStyle: '#fff',
						lineChartWidth: 2,
						lineChartFillStyle: 'rgba(102,180,35,0.8)',
						statement: [{
							x:550,
							y:370,
							strokeStyle: '#fff',
							fillStyle: '#62992F',
							text: '交易量'
						}],
					});

					cTools.drawCoordinate(ctx2, {
						title: '交易成功率',
						rows: 5,
						rowValue: 100,
						startTime: params.startTime,
						endTime: params.endTime,
						timeDistance: params.granularity,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						lineChartPointArray: transactionRate.pointArray.slice(0,(params.length/params.granularity)+1),
						lineChartStrokeStyle: '#f00',
						lineChartWidth: 2,
						statement: [{
							x:550,
							y:370,
							fillStyle: '#f00',
							text: '交易成功率'
						}],
					});

					cTools.drawCoordinate(ctx3, {
						title: '响应时间/ms',
						rows: 6,
						rowValue: 300,
						startTime: params.startTime,
						endTime: params.endTime,
						timeDistance: params.granularity,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						lineChartPointArray: responseTime.pointArray.slice(0,(params.length/params.granularity)+1),
						lineChartStrokeStyle: '#fff',
						lineChartWidth: 2,
						lineChartFillStyle: 'rgba(195,114,27,0.8)',
						statement: [{
							x:550,
							y:370,
							strokeStyle: '#fff',
							fillStyle: 'rgb(195,114,27)',
							text: '响应时间'
						}],
					});

					cTools.drawBarGraph(ctx4, {
						title: '响应率%',
						rows: 5,
						rowValue: 100,
						startTime: params.startTime,
						endTime: params.endTime,
						timeDistance: params.granularity,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						lineChartPointArray: responseRate.pointArray.slice(0,(params.length/params.granularity)+1),
						lineChartStrokeStyle: '#fff',
						lineChartWidth: 2,
						lineChartFillStyle: 'rgba(195,114,27,0.8)',
						statement: [{
							x:450,
							y:370,
							fillStyle: 'rgb(219,0,97)',
							text: '无响应比率'
						},{
							x:600,
							y:370,
							fillStyle: '#fff',
							text: '响应率'
						}],
					});

					cTools.drawRankingLisk(ctx5, {
						title: '各交易类型响应时间排名',
						rows: 6,
						columnValue: 300,
						startTime: new Date(2016,7,24,9,0,0),
						endTime: new Date(2016,7,24,9,10,0),
						timeDistance: 1,
						lineChartOriginX: 180,
						lineChartOriginY: 300,
						rankingList: ranking.rankingList,
						lineChartStrokeStyle: '#fff',
						lineChartWidth: 2,
						lineChartFillStyle: 'rgba(195,114,27,0.8)',
						statement: [{
							x:550,
							y:370,
							strokeStyle: '#fff',
							fillStyle: 'rgb(195,114,27)',
							text: '响应时间/ms'
						}],
					});

					cTools.drawPieChart(ctx6, {
						title: '返回码分布',
						lineChartOriginX: 590,
						lineChartOriginY: 210,
						items: responseCode.items,
					});
					
				},
				failure: function(){

				}
			})
		}
	}();

	return mainPanel;
});
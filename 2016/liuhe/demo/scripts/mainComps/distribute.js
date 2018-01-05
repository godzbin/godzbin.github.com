Ext.ns("P_distribute");

P_main.InitGroup.reg(function() {
			P_distribute.pipe = new common.EventPipe();
			P_main.ConsoleTabMgr.getInstance()
					.reg(new P_distribute.DistributeGrid());
		});

P_distribute.WebAction = {
	GET_NODE : "view_getSlaveNode",
	ADD_NODE : "view_addSlaveNode",
	UPDATE_NODE : "view_updateSlaveNode",
	REMOVE_NODE : "view_removeSlaveNode",
	LIST_NODE : "view_listSlaveNode"
};

P_distribute.Event = {
	NODE_ADDED : "P_distribute_NODE_ADDED",
	NODE_UPDATED : "P_distribute_NODE_UPDATED",
	NODE_REMOVED : "P_distribute_NODE_REMOVED"
};

P_distribute.Res = Ext.apply({
			distribute : "分布式",
			address : "地址",
			slaveNode : "子节点",
			host : "主机",
			port : "端口",
			identifier : "标识",
			disconnected : "断开",
			connected : "已连接"
		}, Resources);

P_distribute.Env = {
	connectedIconCls : "icon-connected",
	disconnectedIconCls : "icon-disconnected"
};

P_distribute.SlaveNodeStatus = {
	DISCONNECTED : 0,
	CONNECTED : 1
};

P_distribute.SlaveNodeStatusName = {};
P_distribute.SlaveNodeStatusName[P_distribute.SlaveNodeStatus.DISCONNECTED] = P_distribute.Res.disconnected;
P_distribute.SlaveNodeStatusName[P_distribute.SlaveNodeStatus.CONNECTED] = P_distribute.Res.connected;

P_distribute.SlaveNode = Ext.apply(P_basic.ModelBase, {
			HOST : "_HOST",
			PORT : "_PORT",
			STATUS : "_STATUS"
		});

P_distribute.DistributeGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_distribute.DistributeGrid.superclass.constructor.call(this);
				P_distribute.pipe.on(P_distribute.Event.NODE_ADDED,
						this.__refreshList, this);
				P_distribute.pipe.on(P_distribute.Event.NODE_UPDATED,
						this.__refreshList, this);
				this.interval = 3000;
			},

			__refreshList : function() {
				this.__loadData();
			},

			getContent : function() {
				if (!this.content) {
					this.content = this.__createContent();
				}
				return this.content;
			},

			__createContent : function() {
				return this.createGrid();
			},

			createFields : function() {
				var fs = [];
				var o = P_distribute.SlaveNode;
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			createColumnModel : function() {
				var cols = [{
							id : this.getAutoExpandCol(),
							header : P_distribute.Res.identifier,
							dataIndex : P_distribute.SlaveNode.NAME,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_distribute.Res.name,
							dataIndex : P_distribute.SlaveNode.LABEL,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_distribute.Res.address,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_distribute.Res.status,
							dataIndex : P_distribute.SlaveNode.STATUS,
							renderer : this.__renderer,
							scope : this
						}];
				return P_distribute.DistributeGrid.superclass.createColumnModel
						.call(this, cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				switch (colIndex) {
					case 2 :
						value = record.get(P_distribute.SlaveNode.HOST) + ":"
								+ record.get(P_distribute.SlaveNode.PORT);
						break;
					case 3 :
						var iconCls = P_distribute.Env.connectedIconCls;
						if (value == P_distribute.SlaveNodeStatus.DISCONNECTED) {
							iconCls = P_distribute.Env.disconnectedIconCls;
						}
						value = P_distribute.SlaveNodeStatusName[value];
						return utils.Renderer.render("div", "icon-value "
										+ iconCls, value);
				}
				return value;
			},

			createGrid : function() {
				var grid = P_distribute.DistributeGrid.superclass.createGrid
						.call(this, {
									title : P_distribute.Res.distribute,
									tbar : this.__createTBar()
								});
				grid.on("afterrender", this.__onAfterRender, this);
				return grid;
			},

			__onAfterRender : function() {
				this.__loadData();
				this.handler = setInterval(this.__getTimerFunc(), this.interval);
			},

			__getTimerFunc : function() {
				if (!this.timerFunc) {
					var mgr = this;
					this.timerFunc = function() {
						mgr.__loadData();
					}
				}
				return this.timerFunc;
			},

			__createTBar : function() {
				var addBtn = common.ToolItem.createAdd({
							handler : this.__reqAddNode,
							scope : this
						});
				var editBtn = common.ToolItem.createEdit({
							disabled : true,
							handler : this.__reqEditNode,
							scope : this
						});
				var delBtn = common.ToolItem.createDelete({
							disabled : true,
							handler : this.__reqDeleteNode,
							scope : this
						});
				this.addToSingleSel(editBtn);
				this.addToSingleSel(delBtn);
				return [addBtn, editBtn, delBtn];
			},

			__reqAddNode : function() {
				P_distribute.SlaveNodeFormMgr.getInstance().reqAdd();
			},

			__reqEditNode : function() {
				var sel = this.getSelection();
				if (sel) {
					var mgr = P_distribute.SlaveNodeFormMgr.getInstance();
					var data = {};
					P_basic.Utils.setRDN(data, sel);
					mgr.setData(data);
					mgr.reqEdit();
				}
			},

			__reqDeleteNode : function() {

			},

			__loadData : function() {
				P_main.sysReq(P_distribute.WebAction.LIST_NODE, null,
						this.__onDataLoaded, this, {
							unLock : true
						});
			},

			__onDataLoaded : function(res) {
				var os = P_main.Service.getRSContent(res);
				if (os) {
					this.setDataList(os);
				}
			},

			getXType : function() {
				return P_distribute.DistributeGrid.XTYPE;
			}
		});
P_distribute.DistributeGrid.XTYPE = "P_distribute.DistributeGrid";

P_distribute.SlaveNodeFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_distribute.SlaveNodeFormMgr.superclass.constructor.call(this);
				P_distribute.pipe.reg(P_distribute.Event.NODE_ADDED, this);
				P_distribute.pipe.reg(P_distribute.Event.NODE_UPDATED, this);
			},

			initKeys : function() {
				var suffix = Utils.getId();
				this.addKeys = {
					label : "label" + suffix,
					host : "host" + suffix,
					port : "port" + suffix
				};

				suffix = Utils.getId();
				this.editKeys = {
					label : "label" + suffix,
					host : "host" + suffix,
					port : "port" + suffix
				};

				this.formKeys = {};
				this.formKeys[this.addKeys.label] = P_distribute.SlaveNode.LABEL;
				this.formKeys[this.addKeys.host] = P_distribute.SlaveNode.HOST;
				this.formKeys[this.addKeys.port] = P_distribute.SlaveNode.PORT;

				this.formKeys[this.editKeys.label] = P_distribute.SlaveNode.LABEL;
				this.formKeys[this.editKeys.host] = P_distribute.SlaveNode.HOST;
				this.formKeys[this.editKeys.port] = P_distribute.SlaveNode.PORT;
			},

			getAddWinConfig : function() {
				return {
					title : P_distribute.Res.add + P_distribute.Res.slaveNode
				};
			},

			getEditWinConfig : function() {
				return {
					title : P_distribute.Res.edit + P_distribute.Res.slaveNode
				};
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							width : 400,
							height : 170,
							items : [this.createForm()]
						}, config));
			},

			createForm : function() {
				return GuiUtil.createForm({
							labelWidth : 60,
							defaults : {
								width : 300
							},
							bodyStyle : {
								padding : "10px 0 0 0"
							},
							items : [{
										id : this.keys.label,
										fieldLabel : P_distribute.Res.label
									}, {
										id : this.keys.host,
										fieldLabel : P_distribute.Res.host
									}, {
										id : this.keys.port,
										fieldLabel : P_distribute.Res.port,
										allowDecimal : false,
										allowNegative : false,
										xtype : "numberfield"
									}]
						});
			},

			doAdd : function() {
				var params = {};
				Utils.getValueFromGui(params, this.keys, this.formKeys);
				P_main.sysReq(P_distribute.WebAction.ADD_NODE, params,
						this.__onAdded, this);
			},

			__onAdded : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.fireEvent(P_distribute.Event.NODE_ADDED, o);
					this.cancelAdd();
				}
			},

			reqEdit : function() {
				P_distribute.SlaveNodeFormMgr.superclass.reqEdit.call(this);
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				P_main.sysReq(P_distribute.WebAction.GET_NODE, params,
						this.__onDataLoaded, this);
			},

			__onDataLoaded : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.data = o;
					Utils.setValueToGui(o, this.keys, this.formKeys);
				}
			},

			doEdit : function() {
				var params = Ext.apply({}, this.data);
				Utils.getValueFromGui(params, this.keys, this.formKeys);
				P_main.sysReq(P_distribute.WebAction.UPDATE_NODE, params,
						this.__onUpdated, this);
			},

			__onUpdated : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.fireEvent(P_distribute.Event.NODE_UPDATED, o);
					this.cancelEdit();
				}
			},

			getXType : function() {
				return P_distribute.SlaveNodeFormMgr.XTYPE;
			}
		});
P_distribute.SlaveNodeFormMgr.XTYPE = "P_distribute.SlaveNodeFormMgr";
Utils.addInstanceFunc(P_distribute.SlaveNodeFormMgr);
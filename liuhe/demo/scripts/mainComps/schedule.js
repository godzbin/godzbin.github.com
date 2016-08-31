Ext.ns("P_sch")

P_main.InitGroup.reg(function() {
			P_sch.pipe = new common.EventPipe();
			P_main.NavigateMgr.getInstance().reg(new P_sch.SchTreeMgr());
			var contentTabMgr = P_main.ContentTabMgr.getInstance();
			contentTabMgr.reg(P_sch.SchListEditorMgr);
			contentTabMgr.reg(P_sch.SchEditorMgr);
			contentTabMgr.reg(P_sch.FlowGraphEditorMgr);
		});

P_sch.WebAction = {
	LIST_SCH_STATISTICS : "view_listSchStatistics",
	GET_SCHEDULE : "view_getSchedule",
	ADD_SCHEDULE : "view_addSchedule",
	UPDATE_SCHEDULE : "view_updateSchedule",
	REMOVE_SCHEDULE : "view_removeSchedule",
	STARTUP_SCHEDULE : "view_startupSchedule",
	SHUTDOWN_SCHEDULE : "view_shutdownSchedule",
	ACTIVATE_SCHEDULE : "view_activateSchedule",
	DEACTIVATE_SCHEDULE : "view_deactivateSchedule",
	RESET_SCHEDULE : "view_resetSchedule",
	GET_TEST_TIMES : "view_getSchTestTimes",
	GET_SCH_TIMES : "view_getSchTimes",
	ADD_SCH_QUEUE : "view_addSchQueue",
	UPDATE_SCH_QUEUE : "view_updateSchQueue",
	REMOVE_SCH_QUEUE : "view_removeSchQueue",
	LIST_SCH_QUEUE : "view_listSchQueue",
	GET_SCH_QUEUE : "view_getSchQueue",
	IMPORT_SCH_RELATION : "view_importSchRelation",
	EXPORT_SCH_RELATION : "view_exportSchRelation",
	LIST_SCH_NODE : "view_listSchNode",
	TERMINATE_SCH_NODE : "view_terminateSchNode",
	CHANGE_SCH_PRIORITY : "view_changeSchPriority",
	RESET_NODES : "view_resetSchNodes",
	RESET_SCH_QUEUE : "view_resetSchQueue",
	CHANGE_SCH_QUEUE : "view_changeSchQueue",
	GET_SCH_LOG : "view_getSchLog",
	GET_GRAPH_BY_NODE : "view_getSchGraphByNode",
	GET_GRPAH : "view_getSchGraph",
	CHANGE_TIME : "view_changeSchTime",
	LIST_SLAVE_NODE : "view_listSlaveNode",
	CHANGE_SLAVE_NODE : "view_changeSchSlaveName"
};

P_sch.Event = {
	SCHEDULE_ADDED : "P_sch_SCHEDULE_ADDED",
	SCHEDULE_UPDATED : "P_sch_SCHEDULE_UPDATED",
	SCHEDULE_REMOVED : "P_sch_SCHEDULE_REMOVED",
	QUEUE_ADDED : "P_sch_QUEUE_ADDED",
	QUEUE_UPDATED : "P_sch_QUEUE_UPDATED",
	QUEUE_REMOVED : "P_sch_QUEUE_REMOVED",
	SCH_RELATION_IMPORTED : "P_sch_SCH_RELATION_IMPORTED",
	SCH_RESETED : "P_sch_SCH_RESETED",
	SCH_NODE_STATUS_CHANGED : "P_sch_SCH_NODE_STATUS_CHANGED",
	SCH_QUEUE_CHANGED : "P_sch_SCH_QUEUE_CHANGED",
	SCH_SLAVE_NODE_CHANGED : "P_sch_SCH_SLAVE_NODE_CHANGED"
};

P_sch.Env = {
	NODE_TYPE_SCH : 0,
	NODE_TYPE_SCH_VIEW : 1,
	DEFAULT_PRIORITY : 50,
	MIN_PRIORITY : 0,
	MAX_PRIORITY : 100,
	DEFAULT_QUEUE_SIZE : 20,
	schListIconCls : "icon-schList",
	scheduleIconCls : "icon-schedule",
	andIconCls : "icon-and",
	orIconCls : "icon-or",
	conditionIconCls : "icon-filter",
	timeConfigIconCls : "icon-schConfig",
	queueIconCls : "icon-queue",
	defaultQueueIconCls : "icon-defaultQueue",
	flowGraphIconCls : "icon-flowGraph",
	nodeImage : "resources/node.png",
	nodeStatusIconCls : "icon-node-status",
	nodeRunningIconCls : "icon-node-running",
	nodeQueuingIconCls : "icon-node-queuing",
	nodeSuccessedIconCls : "icon-node-successed",
	nodeFailedIconCls : "icon-node-failed",
	nodeTerminatedIconCls : "icon-node-terminated"
};

P_sch.Res = Ext.apply({
	schedule : "调度",
	statusWait : "等待",
	statusQueuing : "排队中",
	statusRunning : "运行中",
	statusSuccessed : "运行成功",
	statusFailed : "运行失败",
	statusTerminated : "运行终止",
	statusTerminating : "停止中",
	statusFinished : "完成",
	statusTimeSwitching : "时间切换中",
	statusException : "异常",
	startup : "启动",
	shutdown : "终止",
	priority : "优先级",
	queue : "队列",
	slaveNode : "分布节点",
	belongToQueue : "所属队列",
	node : "节点",
	script : "脚本",
	and : "AND",
	or : "OR",
	condition : "条件",
	year : "年",
	month : "月份",
	date : "日期",
	hour : "小时",
	minute : "分钟",
	second : "秒",
	dayOfWeek : "星期几",
	setting : "设置",
	test : "测试",
	size : "大小",
	relation : "关系",
	total : "全部",
	activate : "激活",
	deactivate : "挂起",
	selection : "选中",
	change : "改变",
	log : "日志",
	setup : "设置",
	trace : "Trace信息",
	errDetail : "错误信息",
	flowGraph : "流程图",
	timeCount : "个数",
	refTime : "参考时间",
	schTime : "调度时间",
	localNode : "本地节点",
	slaveNodeName : "运行节点",
	noSchTime : "调度时间还没有设置",
	invalidTestTimeCount : "时间个数不合法，只能在1 ~ 50之间",
	noTimeSetting : "请先设定时间配置",
	invalidPriority : "优先级的范围是" + P_sch.Env.MIN_PRIORITY + " ~ "
			+ P_sch.Env.MAX_PRIORITY,
	schRemoveConfirm : "确定要删除此调度吗?",
	queueRemoveConfirm : "确定要删除此队列吗?",
	timeConfigDesc : [
			"<p><b>使用说明</b></p>",
			"<p><label class='red'>,</label>: 条目分隔符. 例子: 1,3,5</p><br/>",
			"<p><label class='red'>~</label>: 跨度连接符，某段时间的连续表示. 例子: 1~5,6~10</p><br/>",
			"<p><label class='red'>-</label>: 倒数时间. 例子: -1,-2,-4</p>"].join("")
}, P_basic.Res);

P_sch.SchStatus = {
	WAIT : 0,
	RUNNING : 1,
	TERMINATING : 2,
	TERMINATED : 3,
	FINISHED : 4,
	TIME_SWITCHING : 5,
	EXCEPTION : 6
};

P_sch.SchStatusName = {};
P_sch.SchStatusName[P_sch.SchStatus.WAIT] = P_sch.Res.statusWait;
P_sch.SchStatusName[P_sch.SchStatus.RUNNING] = P_sch.Res.statusRunning;
P_sch.SchStatusName[P_sch.SchStatus.TERMINATING] = P_sch.Res.statusTerminating;
P_sch.SchStatusName[P_sch.SchStatus.TERMINATED] = P_sch.Res.statusTerminated;
P_sch.SchStatusName[P_sch.SchStatus.FINISHED] = P_sch.Res.statusFinished;
P_sch.SchStatusName[P_sch.SchStatus.TIME_SWITCHING] = P_sch.Res.statusTimeSwitching;
P_sch.SchStatusName[P_sch.SchStatus.EXCEPTION] = P_sch.Res.statusException;

P_sch.SchStatusCls = {};
P_sch.SchStatusCls[P_sch.SchStatus.WAIT] = "sch-status-wait";
P_sch.SchStatusCls[P_sch.SchStatus.RUNNING] = "sch-status-running";
P_sch.SchStatusCls[P_sch.SchStatus.TERMINATING] = "sch-status-terminating";
P_sch.SchStatusCls[P_sch.SchStatus.TERMINATED] = "sch-status-terminated";
P_sch.SchStatusCls[P_sch.SchStatus.FINISHED] = "sch-status-finished";
P_sch.SchStatusCls[P_sch.SchStatus.TIME_SWITCHING] = "sch-status-timeSwitching";
P_sch.SchStatusCls[P_sch.SchStatus.EXCEPTION] = "sch-status-exception";

P_sch.Schedule = Ext.apply({
			NAME : "_NAME",
			SCH_CONFIG : "_SCH_CONFIG",
			SCH_TIME : "_SCH_TIME",
			STATUS : "_STATUS",
			ACTIVATE : "_ACTIVATE",
			ERR_DETAIL : "_ERR_DETAIL"
		}, P_basic.BuiltInMO);

P_sch.SchQueue = Ext.apply({
			NAME : "_NAME",
			SIZE : "_SIZE",
			DEFAULT : "_DEFAULT",
			ENABLED : "_ENABLED"
		}, P_basic.BuiltInMO);

P_sch.SchNode = Ext.apply({
			NAME : "_NAME",
			DATA_RDN : "_DATA_RDN",
			JOB_ATTR : "_JOB_ATTR",
			SCH_TIME : "_SCH_TIME",
			STATUS : "_STATUS",
			START_TIME : "_START_TIME",
			END_TIME : "_END_TIME",
			PRIORITY : "_PRIORITY",
			QUEUE : "_QUEUE",
			SLAVE_NAME : "_SLAVE_NAME",
			TRACE : "_TRACE",
			ERR_DETAIL : "_ERR_DETAIL"
		}, P_basic.BuiltInMO);

P_sch.SchNodeStatus = {
	WAIT : 0,
	QUEUING : 1,
	RUNNING : 2,
	SUCCESSED : 3,
	FAILED : 4,
	TERMINATED : 5
};

P_sch.SchNodeStatusName = {};
P_sch.SchNodeStatusName[P_sch.SchNodeStatus.WAIT] = P_sch.Res.statusWait;
P_sch.SchNodeStatusName[P_sch.SchNodeStatus.QUEUING] = P_sch.Res.statusQueuing;
P_sch.SchNodeStatusName[P_sch.SchNodeStatus.RUNNING] = P_sch.Res.statusRunning;
P_sch.SchNodeStatusName[P_sch.SchNodeStatus.SUCCESSED] = P_sch.Res.statusSuccessed;
P_sch.SchNodeStatusName[P_sch.SchNodeStatus.FAILED] = P_sch.Res.statusFailed;
P_sch.SchNodeStatusName[P_sch.SchNodeStatus.TERMINATED] = P_sch.Res.statusTerminated;

P_sch.SchNodeStatusCls = {};
P_sch.SchNodeStatusCls[P_sch.SchNodeStatus.WAIT] = "node-status-wait";
P_sch.SchNodeStatusCls[P_sch.SchNodeStatus.QUEUING] = "node-status-queuing";
P_sch.SchNodeStatusCls[P_sch.SchNodeStatus.RUNNING] = "node-status-running";
P_sch.SchNodeStatusCls[P_sch.SchNodeStatus.SUCCESSED] = "node-status-successed";
P_sch.SchNodeStatusCls[P_sch.SchNodeStatus.FAILED] = "node-status-failed";
P_sch.SchNodeStatusCls[P_sch.SchNodeStatus.TERMINATED] = "node-status-terminated";

P_sch.SchNodeStatusIconCls = {};
P_sch.SchNodeStatusIconCls[P_sch.SchNodeStatus.QUEUING] = P_sch.Env.nodeQueuingIconCls;
P_sch.SchNodeStatusIconCls[P_sch.SchNodeStatus.RUNNING] = P_sch.Env.nodeRunningIconCls;
P_sch.SchNodeStatusIconCls[P_sch.SchNodeStatus.SUCCESSED] = P_sch.Env.nodeSuccessedIconCls;
P_sch.SchNodeStatusIconCls[P_sch.SchNodeStatus.FAILED] = P_sch.Env.nodeFailedIconCls;
P_sch.SchNodeStatusIconCls[P_sch.SchNodeStatus.TERMINATED] = P_sch.Env.nodeTerminatedIconCls;

P_sch.TestTimeType = {
	REF : 0,
	CEIL : 1,
	FLOOR : 2
};

P_sch.TestTime = {
	VALUE : "VALUE",
	TYPE : "TYPE"
};

P_sch.TimeConfigNodeType = {
	AND : 0,
	OR : 1,
	CONDITION : 2
};

P_sch.TimeConfig = {
	SETTING : "SETTING",
	SCRIPT : "SCRIPT"
};

P_sch.TimeSetting = {
	TYPE : "TYPE",
	CHILDREN : "CS",
	CONTENT : "CONTENT"
};

P_sch.TimeUnit = {
	YEAR : "YEAR",
	MONTH : "MONTH",
	DAY : "DAY",
	WEEKDAY : "WEEKDAY",
	HOUR : "HOUR",
	MINUTE : "MINUTE",
	SECOND : "SECOND"
};

P_sch.SchStatistics = Ext.apply({
			QUEUE_STATISTICS : "QUEUE_STATISTICS",
			XTYPE : "SCHEDULE"
		}, P_sch.Schedule);

P_sch.QueueStatistics = Ext.apply({
			STATUS_STATISTICS : "STATUS_STATISTICS",
			XTYPE : "QUEUE"
		}, P_sch.SchQueue);

P_sch.SchTreeMgr = Ext.extend(P_basic.TreeMgr, {
			constructor : function() {
				P_sch.SchTreeMgr.superclass.constructor.call(this);
			},

			__getOriginalNodeText : function() {
				return P_sch.Res.schedule;
			},

			__createSchNode : function() {
				return new Ext.tree.TreeNode({
							text : P_sch.Res.schedule + P_sch.Res.list,
							iconCls : P_sch.Env.schListIconCls,
							__NODE_TYPE : P_sch.Env.NODE_TYPE_SCH,
							__MGR_TYPE : this.getXType()
						});
			},

			onNodeExpanded : function(node) {
				if (!node.attributes.__CHILDREN_LOADED) {
					this.getOriginalNode().appendChild(this.__createSchNode());
					node.attributes.__CHILDREN_LOADED = true;
				}
			},

			onNodeDblClick : function(node) {
				var nodeType = node.attributes.__NODE_TYPE;
				if (nodeType == P_sch.Env.NODE_TYPE_SCH) {
					P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
							P_sch.SchListEditorMgr.XTYPE,
							P_sch.SchListEditorMgr.DATA);
				} else if (nodeType == P_sch.Env.NODE_TYPE_SCH_VIEW) {

				}
			},

			getXType : function() {
				return P_sch.SchTreeMgr.XTYPE;
			}
		});
P_sch.SchTreeMgr.XTYPE = "P_sch.SchTreeMgr";

P_sch.TreeNodeUI = Ext.extend(Ext.ux.tree.TreeGridNodeUI, {
			onSelectedChange : function(state) {
				if (state) {
					this.addClass("x-tree-selected");
				} else {
					this.removeClass("x-tree-selected");
				}
			}
		});

P_sch.SchListEditorMgr = Ext.extend(P_basic.EditorMgr, {
	constructor : function() {
		P_sch.SchListEditorMgr.superclass.constructor.call(this);
		P_sch.pipe.reg(P_sch.Event.SCHEDULE_REMOVED, this);
		P_sch.pipe.reg(P_sch.Event.QUEUE_REMOVED, this);
		P_sch.pipe.reg(P_sch.Event.SCH_RESETED, this);
		P_sch.pipe.on(P_sch.Event.QUEUE_ADDED, this.__onQueueAdded, this);
		P_sch.pipe.on(P_sch.Event.QUEUE_UPDATED, this.__onQueueUpdated, this);
		P_sch.pipe.on(P_sch.Event.SCH_NODE_STATUS_CHANGED,
				this.__onNodeStatusChanged, this);
		P_sch.pipe.on(P_sch.Event.SCH_QUEUE_CHANGED,
				this.__onNodeStatusChanged, this);
		this.interval = 1500;
		this.cleared = false;
		this.schBtns = [];
		this.queueBtns = [];
		this.totalKey = "TOTAL_COUNT";
		this.queueFormMgr = P_sch.QueueFormMgr.getInstance();
		this.importMgr = P_sch.SchImportMgr.getInstance();
		this.filterBar = new common.FilterBar();
		this.filterBar
				.on(common.FilterEvent.DO_FILTER, this.__onDoFilter, this);
	},

	clear : function() {
		this.cleared = true;
		P_sch.pipe.un(P_sch.Event.QUEUE_ADDED, this.__onQueueAdded, this);
		P_sch.pipe.un(P_sch.Event.QUEUE_UPDATED, this.__onQueueUpdated, this);
		P_sch.pipe.un(P_sch.Event.SCH_NODE_STATUS_CHANGED,
				this.__onNodeStatusChanged, this);
		P_sch.pipe.un(P_sch.Event.SCH_QUEUE_CHANGED,
				this.__onNodeStatusChanged, this);
		if (this.nodeGrid) {
			this.nodeGrid.clear();
			P_main.ConsoleTabMgr.getInstance().unreg(this.nodeGrid);
			this.nodeGrid = null;
		}
		if (this.contextMenu) {
			this.contextMenu.destroy();
		}
		P_sch.SchListEditorMgr.superclass.clear.call(this);
	},

	__onNodeStatusChanged : function() {
		this.__refresh();
	},

	__onQueueAdded : function() {
		this.__refresh();
	},

	__onQueueUpdated : function() {
		this.__refresh();
	},

	isDataOwner : function(data) {
		return data == P_sch.SchListEditorMgr.DATA;
	},

	postInit : function() {
		this.nodeGrid = new P_sch.NodeGrid();
		P_main.ConsoleTabMgr.getInstance().reg(this.nodeGrid);
	},

	__onDoFilter : function() {
		this.__refresh();
	},

	__getAutoExpandCol : function() {
		return "autoExpandCol";
	},

	__createColumns : function() {
		var width = 80;
		var cols = [{
					id : this.__getAutoExpandCol(),
					header : P_sch.Res.name,
					dataIndex : P_sch.Schedule.NAME,
					width : 200,
					tpl : this.__createTpl(P_sch.Schedule.NAME)
				}, {
					header : P_sch.Res.size,
					dataIndex : P_sch.SchQueue.SIZE,
					width : 50,
					tpl : this.__createTpl(P_sch.SchQueue.SIZE)
				}, {
					header : P_sch.Res.schedule + P_sch.Res.time,
					dataIndex : P_sch.Schedule.SCH_TIME,
					width : 130,
					tpl : this.__createTpl(P_sch.Schedule.SCH_TIME)
				}, {
					header : P_sch.Res.status,
					dataIndex : P_sch.Schedule.STATUS,
					width : width,
					align : "right",
					tpl : this.__createTpl(P_sch.Schedule.STATUS)
				}];
		var o = P_sch.SchNodeStatus;
		for (var k in o) {
			var status = o[k];
			cols.push({
						header : P_sch.SchNodeStatusName[status],
						dataIndex : status,
						width : width,
						align : "right",
						tpl : this.__createStatusTpl(status)
					});
		}
		cols.push({
					header : P_sch.Res.total,
					dataIndex : this.totalKey,
					width : width,
					align : "right",
					tpl : this.__createStatusTpl(this.totalKey)
				});
		return cols;
	},

	__createTpl : function(key) {
		var mgr = this;
		return new Ext.XTemplate("{.:this.format}", {
					format : function(v) {
						return mgr.__renderNode(key, v);
					}
				});
	},

	__createStatusTpl : function(status) {
		var mgr = this;
		return new Ext.XTemplate("{.:this.format}", {
					format : function(v) {
						return mgr.__renderStatusCount(status, v);
					}
				});
	},

	__renderText : function(v) {
		return utils.Renderer.renderLabel("treegrid-label", v);
	},

	__renderStatusCount : function(status, o) {
		var v = o[P_sch.QueueStatistics.STATUS_STATISTICS][status];
		if (v > 0) {
			var cls = P_sch.SchNodeStatusCls[status];
			v = utils.Renderer.renderLabel("node-status-count " + cls, v);
		}
		return this.__renderText(v);
	},

	__renderNode : function(key, o) {
		if (o.__XTYPE == P_sch.SchStatistics.XTYPE) {
			var v = o[key];
			if (key == P_sch.Schedule.NAME) {
				var iconCls = "red";
				var prefix = P_sch.Res.deactivate;
				if (o[P_sch.Schedule.ACTIVATE]) {
					iconCls = "green";
					prefix = P_sch.Res.activate;
				}
				v = [utils.Renderer.renderLabel(iconCls, "[" + prefix + "]"),
						": ", v].join("");
			} else if (key == P_sch.Schedule.STATUS) {
				var cls = P_sch.SchStatusCls[v];
				v = utils.Renderer.renderLabel(cls, P_sch.SchStatusName[v]);
			}
			return this.__renderText(v);
		} else if (o.__XTYPE == P_sch.QueueStatistics.XTYPE) {
			return this.__renderText(o[key]);
		} else {
			throw new Error("Unknown xtype: " + o.__XTYPE);
		}
	},

	__createContent : function(config) {
		var grid = new Ext.ux.tree.TreeGrid(Ext.apply({
					title : P_sch.Res.schedule + P_sch.Res.list,
					iconCls : P_sch.Env.schListIconCls,
					closable : true,
					animate : false,
					enableSort : false,
					selModel : new Ext.tree.DefaultSelectionModel({
								onKeyDown : function(e) {
								}
							}),
					autoExpandColumn : this.__getAutoExpandCol(),
					trackMouseOver : false,
					enableHdMenu : false,
					enableColumnMove : false,
					columns : this.__createColumns(),
					tbar : this.__createTBar()
				}, config || {}));
		grid.getSelectionModel().on("selectionchange",
				this.__onSelectionChanged, this);
		grid.on("afterrender", this.__onAfterRender, this);
		grid.on("click", this.__onNodeClick, this);
		grid.on("contextmenu", this.__onContextMenu, this);
		this.grid = grid;
		this.__getContextMenu();
		return grid;
	},

	__getContextMenu : function() {
		if (!this.contextMenu) {
			var addItem = new Ext.menu.Item({
						text : P_sch.Res.add,
						iconCls : "add",
						menu : {
							items : [{
										text : P_sch.Res.schedule,
										iconCls : P_sch.Env.scheduleIconCls,
										handler : this.__reqAddSch,
										scope : this
									}, {
										text : P_sch.Res.queue,
										iconCls : P_sch.Env.queueIconCls,
										handler : this.__reqAddQueue,
										scope : this
									}]
						}
					});
			var editItem = new Ext.menu.Item({
						text : P_sch.Res.edit,
						iconCls : "edit",
						disabled : true,
						handler : this.__reqEdit,
						scope : this
					});
			var schTimeItem = new Ext.menu.Item({
						text : P_sch.Res.time + P_sch.Res.setup,
						iconCls : "schTimeSetup",
						disabled : true,
						handler : this.__reqSetupSchTime,
						scope : this
					});
			var viewGraphBtn = new Ext.menu.Item({
						text : P_sch.Res.flowGraph,
						iconCls : P_sch.Env.flowGraphIconCls,
						disabled : true,
						handler : this.__reqViewFlowGraph,
						scope : this
					});
			this.delItem = new Ext.menu.Item({
						text : P_sch.Res.remove,
						iconCls : "delete",
						disabled : true,
						handler : this.__reqDelete,
						scope : this
					});
			var exImportItem = new Ext.menu.Item({
						text : P_sch.Res.exportFile + "/"
								+ P_sch.Res.importFile,
						menu : {
							items : [{
								text : P_sch.Res.exportFile
										+ P_sch.Res.relation,
								iconCls : "export",
								handler : this.__reqExportSchRelation,
								scope : this
							}, {
								text : P_sch.Res.importFile
										+ P_sch.Res.relation,
								iconCls : "import",
								handler : this.__reqImportSchRelation,
								scope : this
							}]
						}
					});
			this.schBtns = this.schBtns.concat([addItem, editItem, schTimeItem,
					viewGraphBtn, this.delItem, exImportItem]);
			this.queueBtns = this.queueBtns.concat([editItem, this.delItem]);
			this.contextMenu = new Ext.menu.Menu({
						items : [addItem, editItem, "-", schTimeItem, "-",
								viewGraphBtn, "-", this.delItem, "-",
								exImportItem]
					});
		}
		return this.contextMenu;
	},

	__onContextMenu : function(node, evt) {
		this.__getContextMenu();
		this.selectNode(node);
		this.contextMenu.showAt(evt.getXY());
	},

	__onNodeClick : function(node, evt) {
		var td = evt.getTarget("td");
		var cs = td.parentNode.childNodes;
		for (var i = 0; i < cs.length; ++i) {
			if (cs[i] == td) {
				this.__onCellClick(node, i, this.grid.columns[i].dataIndex);
				break;
			}
		}
	},

	__checkStatusKey : function(key) {
		if (key == this.totalKey) {
			return true;
		} else {
			var o = P_sch.SchNodeStatus;
			for (var k in o) {
				if (o[k] == key) {
					return true;
				}
			}
		}
		return false;
	},

	__onCellClick : function(node, colIdx, key) {
		if (this.__checkStatusKey(key)) {
			var data = {};
			if (key != this.totalKey) {
				data[P_sch.SchNode.STATUS] = key;
			}
			if (node.parentNode == this.grid.getRootNode()) {
				P_basic.Utils.setRDN(data, node.attributes);
			} else {
				data.QUEUE_RDN = P_basic.Utils.getRDN(node.attributes);
				P_basic.Utils.setRDN(data, node.parentNode.attributes);
			}
			this.nodeGrid.setData(data);
		}
	},

	__reqSetupSchTime : function() {
		var node = this.getSelectedNode();
		if (node) {
			var mgr = P_sch.SchTimeFormMgr.getInstance();
			var data = {};
			var key = P_sch.Schedule.SCH_TIME;
			data[key] = node.attributes[key];
			P_basic.Utils.setRDN(data, node.attributes);
			mgr.setData(data);
			mgr.reqEdit();
		}
	},

	__reqViewFlowGraph : function() {
		var node = this.getSelectedNode();
		if (node) {
			var params = {};
			P_basic.Utils.setRDN(params, node.attributes);
			var data = {
				ACTION : P_sch.WebAction.GET_GRPAH,
				PARAMS : params
			};
			P_basic.Utils.setRDN(data, node.attributes);
			P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
					P_sch.FlowGraphEditorMgr.XTYPE, data);
		}
	},

	__reqResetSch : function() {
		this.__resetStatus(P_sch.WebAction.RESET_SCHEDULE);
	},

	__reqResetError : function() {
		var action = P_sch.WebAction.RESET_SCH_QUEUE;
		this.__resetStatus(action, P_sch.SchNodeStatus.FAILED);
		this.__resetStatus(action, P_sch.SchNodeStatus.TERMINATED);
	},

	__resetStatus : function(action, status) {
		var params = {};
		if (status != null) {
			params[P_sch.SchNode.STATUS] = status
		}
		this.__actionOnSch(action, params, {
					event : P_sch.Event.SCH_RESETED,
					status : status
				});
	},

	__reqActivate : function() {
		this.__actionOnSch(P_sch.WebAction.ACTIVATE_SCHEDULE);
	},

	__reqDeactivate : function() {
		this.__actionOnSch(P_sch.WebAction.DEACTIVATE_SCHEDULE);
	},

	__reqStartup : function() {
		this.__actionOnSch(P_sch.WebAction.STARTUP_SCHEDULE);
	},

	__reqShutdown : function() {
		this.__actionOnSch(P_sch.WebAction.SHUTDOWN_SCHEDULE);
	},

	__actionOnSch : function(action, params, others) {
		var node = this.getSelectedNode();
		if (node) {
			if (!params) {
				params = {};
			}
			P_basic.Utils.setRDN(params, node.attributes);
			P_main.sysReq(action, params, this.__onSchChanged, this, others);
		}
	},

	__onSchChanged : function(res, opts) {
		P_main.Service.parseResult(res);
		this.__refresh();
		var others = opts.others;
		if (others && others.event) {
			this.fireEvent(others.event, others);
		}
	},

	__reqExportSchRelation : function() {
		var node = this.getSelectedNode();
		if (node) {
			if (!this.downloadForm) {
				this.downloadForm = P_main.createDownloadForm();
			}
			var params = {};
			P_basic.Utils.setRDN(params, node.attributes);
			this.downloadForm.submit(P_sch.WebAction.EXPORT_SCH_RELATION,
					params);
		}
	},

	__reqImportSchRelation : function() {
		var node = this.getSelectedNode();
		if (node) {
			var data = {};
			P_basic.Utils.setRDN(data, node.attributes);
			this.importMgr.setData(data);
			this.importMgr.reqAdd();
		}
	},

	__onSelectionChanged : function(sm, node) {
		this.__updateUI();
	},

	__updateUI : function() {
		var node = this.getSelectedNode();
		if (node) {
			var xtype = node.attributes.__XTYPE;
			if (xtype == P_sch.SchStatistics.XTYPE) {
				P_basic.Utils.setBtnDisabled(this.queueBtns, true);
				P_basic.Utils.setBtnDisabled(this.schBtns, false);
				var status = node.attributes[P_sch.Schedule.STATUS];
				if (status == P_sch.SchStatus.TERMINATING) {
					this.startupBtn.setDisabled(true);
					this.shutdownBtn.setDisabled(true);
				} else {
					var enableStartup = false;
					if (status == P_sch.SchStatus.WAIT
							|| status == P_sch.SchStatus.TERMINATED
							|| status == P_sch.SchStatus.FINISHED
							|| status == P_sch.SchStatus.EXCEPTION) {
						enableStartup = true;
					}
					this.startupBtn.setDisabled(!enableStartup);
					this.shutdownBtn.setDisabled(enableStartup);
				}
				var activate = node.attributes[P_sch.Schedule.ACTIVATE];
				this.activateBtn.setDisabled(activate);
				this.deactivateBtn.setDisabled(!activate);
				this.exceptionBtn
						.setDisabled(status != P_sch.SchStatus.EXCEPTION);
			} else if (xtype == P_sch.QueueStatistics.XTYPE) {
				P_basic.Utils.setBtnDisabled(this.schBtns, true);
				P_basic.Utils.setBtnDisabled(this.queueBtns, false);
				if (node.attributes[P_sch.SchQueue.DEFAULT]) {
					this.delItem.setDisabled(true);
				}
			}
		} else {
			P_basic.Utils.setBtnDisabled(this.schBtns, true);
			P_basic.Utils.setBtnDisabled(this.queueBtns, true);
		}
	},

	getSelectedNode : function() {
		return this.grid.getSelectionModel().getSelectedNode();
	},

	selectNode : function(node) {
		this.grid.getSelectionModel().select(node);
	},

	__onAfterRender : function() {
		this.__loadData(true);
	},

	__createTBar : function() {
		var addBtn = common.ToolItem.createAdd({
					text : P_sch.Res.schedule,
					handler : this.__reqAddSch,
					scope : this
				});
		this.startupBtn = new Ext.Button({
					text : P_sch.Res.startup,
					iconCls : "start",
					disabled : true,
					handler : this.__reqStartup,
					scope : this
				});
		this.shutdownBtn = new Ext.Button({
					text : P_sch.Res.shutdown,
					iconCls : "stop",
					disabled : true,
					handler : this.__reqShutdown,
					scope : this
				});
		this.activateBtn = new Ext.Button({
					text : P_sch.Res.activate,
					iconCls : "activate",
					disabled : true,
					handler : this.__reqActivate,
					scope : this
				});
		this.deactivateBtn = new Ext.Button({
					text : P_sch.Res.deactivate,
					iconCls : "deactivate",
					disabled : true,
					handler : this.__reqDeactivate,
					scope : this
				});
		this.exceptionBtn = new Ext.Button({
					text : P_sch.Res.statusException,
					iconCls : "exception",
					disabled : true,
					handler : this.__reqViewException,
					scope : this
				});
		var resetLabel = P_sch.Res.reset + ": ";
		var resetSchBtn = common.ToolItem.createReset({
					text : P_sch.Res.schedule,
					disabled : true,
					handler : this.__reqResetSch,
					scope : this
				});
		var resetErrorBtn = common.ToolItem.createReset({
					text : P_sch.Res.error,
					disabled : true,
					handler : this.__reqResetError,
					scope : this
				});
		var expandBtn = common.ToolItem.createExpandAll({
					text : null,
					handler : this.__expandAll,
					scope : this
				});
		var collapseBtn = common.ToolItem.createCollapseAll({
					text : null,
					handler : this.__collapseAll,
					scope : this
				});
		this.schBtns = this.schBtns.concat([this.startupBtn, this.shutdownBtn,
				this.activateBtn, this.deactivateBtn, this.exceptionBtn,
				resetSchBtn, resetErrorBtn]);
		return [addBtn, "-", this.startupBtn, this.shutdownBtn,
				this.activateBtn, this.deactivateBtn, this.exceptionBtn, "-",
				resetLabel, resetErrorBtn, resetSchBtn, "-", expandBtn,
				collapseBtn, "->"].concat(this.filterBar.createItems());
	},

	__reqViewException : function() {
		var node = this.getSelectedNode();
		if (node) {
			P_main.LogMgr.error(node.attributes[P_sch.Schedule.ERR_DETAIL]);
		}
	},

	__expandAll : function() {
		this.grid.getRootNode().expandChildNodes(true);
	},

	__collapseAll : function() {
		this.grid.getRootNode().collapseChildNodes(true);
	},

	__reqAddSch : function() {
		var data = {};
		P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
				P_sch.SchEditorMgr.XTYPE, data);
	},

	__reqAddQueue : function() {
		var node = this.getSelectedNode();
		if (node) {
			var data = {};
			P_basic.Utils.setPDN(data, node.attributes);
			this.queueFormMgr.setData(data);
			this.queueFormMgr.reqAdd();
		}
	},

	__reqEdit : function() {
		var node = this.getSelectedNode();
		if (node) {
			var xtype = node.attributes.__XTYPE;
			var data = {};
			P_basic.Utils.setRDN(data, node.attributes);
			if (xtype == P_sch.SchStatistics.XTYPE) {
				P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
						P_sch.SchEditorMgr.XTYPE, data);
			} else if (xtype == P_sch.QueueStatistics.XTYPE) {
				this.queueFormMgr.setData(data);
				this.queueFormMgr.reqEdit();
			}
		}
	},

	__reqDelete : function() {
		var node = this.getSelectedNode();
		if (node) {
			var xtype = node.attributes.__XTYPE;
			var RDN = P_basic.Utils.getRDN(node.attributes);
			if (xtype == P_sch.SchStatistics.XTYPE) {
				P_basic.Utils.deleteConfirm(P_sch.Res.schRemoveConfirm, RDN,
						P_sch.WebAction.REMOVE_SCHEDULE, this.__onRemoved,
						this, {
							RDN : RDN,
							event : P_sch.Event.SCHEDULE_REMOVED
						});
			} else if (xtype == P_sch.QueueStatistics.XTYPE) {
				P_basic.Utils.deleteConfirm(P_sch.Res.queueRemoveConfirm, RDN,
						P_sch.WebAction.REMOVE_SCH_QUEUE, this.__onRemoved,
						this, {
							RDN : RDN,
							event : P_sch.Event.QUEUE_REMOVED
						});
			}
		}
	},

	__onRemoved : function(res, opts) {
		if (P_main.Service.parseResult(res)) {
			this.__refresh();
			P_sch.pipe.fireEvent(opts.others.event, opts.others.RDN);
		}
	},

	__refresh : function() {
		this.__loadData();
	},

	__loadData : function(autoLoad) {
		P_main.sysReq(P_sch.WebAction.LIST_SCH_STATISTICS, null,
				this.__onDataLoaded, this, {
					unLock : true,
					autoLoad : autoLoad
				});
	},

	__onDataLoaded : function(res, opts) {
		if (!this.cleared) {
			var os = P_main.Service.getRSContent(res);
			if (os) {
				this.__renderTree(os);
				var autoLoad = opts.others.autoLoad;
				if (!this.cleared && autoLoad) {
					setTimeout(this.__getTimerFunc(), this.interval);
				}
			}
		}
	},

	__getTimerFunc : function() {
		if (!this.timerFunc) {
			var mgr = this;
			this.timerFunc = function() {
				if (!mgr.cleared && mgr.data) {
					mgr.__loadData(true);
				}
			}
		}
		return this.timerFunc;
	},

	__renderTree : function(os) {
		var selectedRDN = null;
		var currNode = this.getSelectedNode();
		if (currNode) {
			selectedRDN = P_basic.Utils.getRDN(currNode.attributes);
		}
		var root = this.grid.getRootNode();
		var csMap = {};
		var cns = root.childNodes;
		for (var i = 0; i < cns.length; ++i) {
			var cn = cns[i];
			var RDN = P_basic.Utils.getRDN(cn.attributes);
			csMap[RDN] = cn;
		}
		for (var i = 0; i < os.length; ++i) {
			var o = os[i];
			var RDN = P_basic.Utils.getRDN(o);
			var oldNode = csMap[RDN];
			var newNode = this.__createNode(o);
			if (oldNode) {
				root.replaceChild(newNode, oldNode);
				if (!oldNode.isExpanded()) {
					newNode.collapse();
				}
				delete csMap[RDN];
			} else {
				root.appendChild(newNode);
			}
		}
		for (var k in csMap) {
			var oldNode = csMap[k];
			root.removeChild(oldNode, true);
		}
		if (selectedRDN) {
			var node = root.findChild(P_basic.BuiltInMO.RDN, selectedRDN, true);
			if (node) {
				this.selectNode(node);
			}
		}
	},

	__createNode : function(o) {
		var qsKey = P_sch.SchStatistics.QUEUE_STATISTICS;
		var qsMap = o[qsKey];
		delete o[qsKey];
		var sns = P_sch.SchNodeStatus;
		var totalCount = {};
		var ssKey = P_sch.QueueStatistics.STATUS_STATISTICS;
		for (var k in qsMap) {
			var qs = qsMap[k][ssKey];
			for (var statusKey in sns) {
				var status = sns[statusKey];
				if (totalCount[status] == null) {
					totalCount[status] = 0;
				}
				totalCount[status] += qs[status];
			}
			if (totalCount[this.totalKey] == null) {
				totalCount[this.totalKey] = 0;
			}
			totalCount[this.totalKey] += qs[this.totalKey];
		}
		o[ssKey] = totalCount;
		var node = this.__newTreeNode(Ext.apply({
					iconCls : P_sch.Env.scheduleIconCls,
					expandable : true,
					expanded : true,
					__XTYPE : P_sch.SchStatistics.XTYPE
				}, o));
		for (var k in qsMap) {
			var qs = qsMap[k];
			var iconCls = P_sch.Env.queueIconCls;
			if (qs[P_sch.SchQueue.DEFAULT]) {
				iconCls = P_sch.Env.defaultQueueIconCls;
			}
			node.appendChild(this.__newTreeNode(Ext.apply({
						leaf : true,
						iconCls : iconCls,
						__XTYPE : P_sch.QueueStatistics.XTYPE
					}, qs)));
		}
		return node;
	},

	__newTreeNode : function(config) {
		config.uiProvider = P_sch.TreeNodeUI;
		return new Ext.tree.TreeNode(config);
	},

	getXType : function() {
		return P_sch.SchListEditorMgr.XTYPE;
	}
});
P_sch.SchListEditorMgr.XTYPE = "P_sch.SchListEditorMgr";
P_sch.SchListEditorMgr.DATA = "SCH_DATA";

P_sch.NodeGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_sch.NodeGrid.superclass.constructor.call(this);
				P_sch.pipe.reg(P_sch.Event.SCH_NODE_STATUS_CHANGED, this);
				P_sch.pipe.on(P_sch.Event.SCH_RESETED, this.__onSchReseted,
						this);
				P_sch.pipe.on(P_sch.Event.SCH_QUEUE_CHANGED,
						this.__onQueueChanged, this);
				P_sch.pipe.on(P_sch.Event.SCH_SLAVE_NODE_CHANGED,
						this.__onSlaveNodeChanged, this);
				this.data = null;
				this.pageBar = new common.PageBar({
							pageCountData : [[10, 10], [20, 20], [50, 50],
									[200, 200], [500, 500], [1000, 1000]],
							pageCount : 20
						});
				this.filterBar = new common.FilterBar();
				this.pageBar.on(common.PageEvent.PAGING, this.__onPaging, this);
				this.filterBar.on(common.FilterEvent.DO_FILTER,
						this.__onDoFilter, this);
			},

			__onSlaveNodeChanged : function() {
				this.__refresh();
			},

			__onQueueChanged : function() {
				this.__refresh();
			},

			__onSchReseted : function(others) {
				if (!this.data) {
					return;
				}
				if (!others || others.status == null
						|| others.status == this.data[P_sch.SchNode.STATUS]) {
					this.__refresh();
				}
			},

			clear : function() {
				this.data = null;
				this.clearData();
				P_sch.pipe.un(P_sch.Event.SCH_RESETED, this.__onSchReseted,
						this);
				P_sch.pipe.un(P_sch.Event.SCH_QUEUE_CHANGED,
						this.__onQueueChanged, this);
			},

			setData : function(data) {
				this.data = data;
				P_main.ConsoleTabMgr.getInstance().activate(this.getGrid());
				this.__refresh();
				this.__updateUI();
			},

			__updateUI : function() {
				var o = P_sch.SchNodeStatus;
				var status = this.data[P_sch.SchNode.STATUS];
				if (status == o.RUNNING || status == o.QUEUING) {
					P_basic.Utils.setBtnVisible(this.staticBtns, false);
					P_basic.Utils.setBtnVisible(this.dynamicBtns, true);
				} else if (status == o.SUCCESSED || status == o.FAILED
						|| status == o.TERMINATED) {
					P_basic.Utils.setBtnVisible(this.staticBtns, true);
					P_basic.Utils.setBtnVisible(this.dynamicBtns, false);
				} else {
					P_basic.Utils.setBtnVisible(this.staticBtns, false);
					P_basic.Utils.setBtnVisible(this.dynamicBtns, false);
				}
			},

			__onDoFilter : function() {
				this.__refresh();
			},

			__refresh : function() {
				this.pageBar.reset(true);
				this.__loadData();
			},

			__onPaging : function() {
				this.__loadData();
			},

			createFields : function() {
				var fs = [];
				var o = P_sch.SchNode;
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			createSM : function() {
				return new Ext.grid.RowSelectionModel({
							singleSelect : false
						});
			},

			createColumnModel : function() {
				var cols = [{
							id : this.getAutoExpandCol(),
							header : P_sch.Res.name,
							dataIndex : P_sch.SchNode.NAME,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_sch.Res.schedule + P_sch.Res.time,
							dataIndex : P_sch.SchNode.SCH_TIME,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_sch.Res.status,
							dataIndex : P_sch.SchNode.STATUS,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_sch.Res.startTime,
							dataIndex : P_sch.SchNode.START_TIME,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_sch.Res.endTime,
							dataIndex : P_sch.SchNode.END_TIME,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_sch.Res.priority,
							dataIndex : P_sch.SchNode.PRIORITY,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_sch.Res.belongToQueue,
							dataIndex : P_sch.SchNode.QUEUE,
							renderer : this.__renderer,
							scope : this
						}, {
							header : P_sch.Res.slaveNodeName,
							dataIndex : P_sch.SchNode.SLAVE_NAME,
							renderer : this.__renderer,
							scope : this
						}];
				return P_sch.NodeGrid.superclass.createColumnModel.call(this,
						cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				switch (colIndex) {
					case 2 :
						return P_sch.SchNodeStatusName[value];
					case 7 :
						if (!value) {
							value = P_sch.Res.localNode;
						}
						break;
				}
				return value;
			},

			getContent : function() {
				if (!this.content) {
					this.content = this.__createContent();
				}
				return this.content;
			},

			__createContent : function() {
				var content = P_sch.NodeGrid.superclass.createGrid.call(this, {
							title : P_sch.Res.schedule + P_sch.Res.node,
							columnLines : true,
							tbar : this.__createTBar(),
							bbar : this.__createBBar()
						});
				content.on("rowdblclick", this.__onRowDblClick, this);
				return content;
			},

			__onRowDblClick : function() {
				this.__reqViewFlowGraph();
			},

			__createTBar : function() {
				var resetLabel = P_basic.Utils.createLabelItem(P_sch.Res.reset,
						30);
				var resetBtn = common.ToolItem.createReset({
							text : P_sch.Res.selection,
							disabled : true,
							handler : this.__reqReset,
							scope : this
						});
				var resetAllBtn = common.ToolItem.createReset({
							text : P_sch.Res.all,
							handler : this.__reqResetAll,
							scope : this
						});
				var terminateBtn = new Ext.Button({
							text : P_sch.Res.shutdown,
							iconCls : "stop",
							disabled : true,
							handler : this.__reqTerminate,
							scope : this
						});
				var priorityBtn = new Ext.Button({
							text : P_sch.Res.priority,
							iconCls : "icon-priority",
							disabled : true,
							handler : this.__reqChangePriority,
							scope : this
						});
				var queueBtn = new Ext.Button({
							text : P_sch.Res.queue,
							iconCls : "icon-queue",
							disabled : true,
							handler : this.__reqChangeQueue,
							scope : this
						});
				var slaveBtn = new Ext.Button({
							text : P_sch.Res.slaveNode,
							iconCls : "icon-slaveNode",
							disabled : true,
							handler : this.__reqChangeSlaveNode,
							scope : this
						});
				var viewDataBtn = new Ext.Button({
							text : P_sch.Res.data,
							iconCls : "icon-data",
							disabled : true,
							handler : this.__reqViewData,
							scope : this
						});
				var viewLogBtn = new Ext.Button({
							text : P_sch.Res.log,
							iconCls : "icon-log",
							disabled : true,
							handler : this.__reqViewLog,
							scope : this
						});
				var flowGraphBtn = new Ext.Button({
							text : P_sch.Res.flowGraph,
							iconCls : P_sch.Env.flowGraphIconCls,
							disabled : true,
							handler : this.__reqViewFlowGraph,
							scope : this
						});
				this.addToSel(resetBtn);
				this.addToSel(terminateBtn);
				this.addToSel(priorityBtn);
				this.addToSel(queueBtn);
				this.addToSel(slaveBtn);
				this.addToSingleSel(viewDataBtn);
				this.addToSingleSel(viewLogBtn);
				this.addToSingleSel(flowGraphBtn);
				this.staticBtns = [resetLabel, resetBtn, resetAllBtn];
				this.dynamicBtns = [terminateBtn];
				return [resetLabel, resetBtn, resetAllBtn, terminateBtn, "-",
						priorityBtn, queueBtn, slaveBtn, "-", viewDataBtn,
						viewLogBtn, flowGraphBtn, "->"].concat(this.filterBar
						.createItems());
			},

			__createBBar : function() {
				return ["->"].concat(this.pageBar.createItems({
							refresh : false
						}));
			},

			__newParams : function() {
				var params = {
					QUEUE_RDN : this.data.QUEUE_RDN
				};
				params[P_sch.SchNode.STATUS] = this.data[P_sch.SchNode.STATUS];
				P_basic.Utils.setRDN(params, this.data);
				return params;
			},

			__loadData : function() {
				if (!this.data) {
					return;
				}
				var params = this.__newParams();
				params[ds.Common.START] = this.pageBar.getStart();
				params[ds.Common.COUNT] = this.pageBar.getPageCount();
				var content = this.filterBar.getValue();
				if (!Utils.isBlank(content)) {
					params[ds.Common.CONTENT] = content;
				}
				P_main.sysReq(P_sch.WebAction.LIST_SCH_NODE, params,
						this.__onDataLoaded, this);
			},

			__onDataLoaded : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.setDataList(o[ds.Common.DATA_LIST]);
					this.pageBar.setTotalCount(o[ds.Common.TOTAL_COUNT]);
				}
			},

			__setRDNList : function(params) {
				var sels = this.getSelections();
				var nodeRDNs = [];
				for (var i = 0; i < sels.length; ++i) {
					nodeRDNs.push(P_basic.Utils.getRDN(sels[i]));
				}
				params[ds.Common.IDS] = nodeRDNs.join(P_main.Env.ID_SEP);
			},

			__reqReset : function() {
				var params = this.__newParams();
				this.__setRDNList(params);
				P_main.sysReq(P_sch.WebAction.RESET_NODES, params,
						this.__onStatusChanged, this);
			},

			__reqResetAll : function() {
				var params = this.__newParams();
				P_main.sysReq(P_sch.WebAction.RESET_SCH_QUEUE, params,
						this.__onStatusChanged, this);
			},

			__reqTerminate : function() {
				var params = this.__newParams();
				this.__setRDNList(params);
				P_main.sysReq(P_sch.WebAction.TERMINATE_SCH_NODE, params,
						this.__onStatusChanged, this);
			},

			__onStatusChanged : function(res) {
				P_main.Service.parseResult(res);
				this.fireEvent(P_sch.Event.SCH_NODE_STATUS_CHANGED);
				this.__refresh();
			},

			__reqViewData : function() {
				var sel = this.getSelection();
				if (sel) {
					var data = {
						TYPE : P_basic.DataExchangeType.METADATA
					};
					P_basic.Utils.setRDN(data, sel.get(P_sch.SchNode.DATA_RDN));
					P_main.pipe.fireEvent(P_main.Event.DATA_EXCHANGE, data);
				}
			},

			__reqChangePriority : function() {
				Utils.prompt(P_sch.Res.edit, P_sch.Res.priority,
						this.__changePriority, this, false,
						P_sch.Env.DEFAULT_PRIORITY);
			},

			__changePriority : function(btn, strValue) {
				if (btn == "ok") {
					var value = parseInt(strValue);
					if (isNaN(strValue) || value < P_sch.Env.MIN_PRIORITY
							|| value > P_sch.Env.MAX_PRIORITY) {
						P_main.LogMgr.error(P_sch.Res.invalidPriority);
						return;
					}
					var params = this.__newParams();
					params[P_sch.SchNode.PRIORITY] = value;
					this.__setRDNList(params);
					P_main.sysReq(P_sch.WebAction.CHANGE_SCH_PRIORITY, params,
							this.__onStatusChanged, this);
				}
			},

			__reqChangeSlaveNode : function() {
				var data = {};
				P_basic.Utils.setRDN(data, this.data);
				this.__setRDNList(data);
				var formMgr = P_sch.ChangeSlaveNodeFormMgr.getInstance();
				formMgr.setData(data);
				formMgr.reqEdit();
			},

			__reqChangeQueue : function() {
				var data = {};
				P_basic.Utils.setRDN(data, this.data);
				this.__setRDNList(data);
				var formMgr = P_sch.ChangeQueueFormMgr.getInstance();
				formMgr.setData(data);
				formMgr.reqEdit();
			},

			__reqViewLog : function() {
				var sel = this.getSelection();
				if (sel) {
					var formMgr = P_sch.ViewLogFormMgr.getInstance();
					var data = {};
					P_basic.Utils.setRDN(data, sel);
					formMgr.setData(data);
					formMgr.reqEdit();
				}
			},

			__reqViewFlowGraph : function() {
				var sel = this.getSelection();
				if (sel) {
					var params = {};
					P_basic.Utils.setRDN(params, sel);
					var data = {
						ACTION : P_sch.WebAction.GET_GRAPH_BY_NODE,
						FLAG : true,
						PARAMS : params
					};
					P_main.pipe.fireEvent(P_main.Event.OPEN_EDITOR,
							P_sch.FlowGraphEditorMgr.XTYPE, data);
				}
			},

			getXType : function() {
				return P_sch.NodeGrid.XTYPE;
			}
		});
P_sch.NodeGrid.XTYPE = "P_sch.NodeGrid";

P_sch.SchEditorMgr = Ext.extend(P_basic.EditorMgr, {
	constructor : function() {
		P_sch.SchEditorMgr.superclass.constructor.call(this);
		P_sch.pipe.reg(P_sch.Event.SCHEDULE_ADDED, this);
		P_sch.pipe.reg(P_sch.Event.SCHEDULE_UPDATED, this);
		P_sch.pipe.on(P_sch.Event.SCHEDULE_REMOVED, this.__onSchRemoved, this);
		this.timeSettingMgr = new P_sch.TimeSettingMgr();
	},

	clear : function() {
		P_sch.pipe.un(P_sch.Event.SCHEDULE_REMOVED, this.__onSchRemoved, this);
		P_sch.SchEditorMgr.superclass.clear.call(this);
	},

	__onSchRemoved : function(RDN) {
		if (!this.isNew()) {
			if (P_basic.Utils.getRDN(this.data) == RDN) {
				P_main.pipe.fireEvent(P_main.Event.CLOSE_EDITOR, this);
			}
		}
	},

	isNew : function() {
		return P_basic.Utils.getRDN(this.data) == null;
	},

	__createData : function() {
		var o = {};
		P_basic.Utils.setRDN(o, this.data);
		o[P_sch.Schedule.NAME] = this.nameInput.getValue();
		var schConfig = {};
		var timeSetting = this.timeSettingMgr.getData();
		if (timeSetting) {
			schConfig[P_sch.TimeConfig.SETTING] = timeSetting;
		}
		var script = this.scriptArea.getValue();
		if (!Utils.isBlank(script)) {
			schConfig[P_sch.TimeConfig.SCRIPT] = script;
		}
		o[P_sch.Schedule.SCH_CONFIG] = Ext.encode(schConfig);
		return o;
	},

	__validate : function(o) {
		return true;
	},

	save : function() {
		var params = this.__createData();
		if (!this.__validate(params)) {
			return;
		}
		if (this.isNew()) {
			P_main.sysReq(P_sch.WebAction.ADD_SCHEDULE, params, this.__onAdded,
					this);
		} else {
			P_main.sysReq(P_sch.WebAction.UPDATE_SCHEDULE, params,
					this.__onUpdated, this);
		}
	},

	__onAdded : function(res) {
		this.__onSaved(res, P_sch.Event.SCHEDULE_ADDED);
	},

	__onUpdated : function(res) {
		this.__onSaved(res, P_sch.Event.SCHEDULE_UPDATED);
	},

	__onSaved : function(res, evt) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.data = o;
			this.__updateUI();
			P_sch.pipe.fireEvent(evt, o);
		}
	},

	__createContent : function() {
		this.nameInput = new Ext.form.TextField({
					fieldLabel : P_sch.Res.name,
					width : 250
				});
		this.scriptArea = new Ext.form.TextArea();
		return new Ext.Panel({
			title : P_sch.Res.unTitled,
			iconCls : P_sch.Env.scheduleIconCls,
			closable : true,
			layout : "fit",
			items : [{
				border : false,
				layout : "border",
				style : {
					"padding" : "5px"
				},
				items : [GuiUtil.createForm({
									region : "north",
									height : 30,
									border : false,
									labelWidth : 40,
									defaults : {},
									items : [this.nameInput]
								}), new Ext.TabPanel({
									region : "center",
									activeTab : 0,
									plain : true,
									style : {
										"background-color" : "#fff",
										"background-image" : "none"
									},
									items : [
											this.timeSettingMgr.createContent(),
											{
												title : P_sch.Res.script,
												layout : "fit",
												items : [this.scriptArea]
											}]
								})]
			}],
			tbar : this.__createTBar()
		});
	},

	__createTBar : function() {
		var saveBtn = common.ToolItem.createSave({
					handler : this.save,
					scope : this
				});
		this.refreshBtn = common.ToolItem.createRefresh({
					disabled : true,
					handler : this.refresh,
					scope : this
				});
		return [saveBtn, this.refreshBtn];
	},

	__updateUI : function() {
		this.content.setTitle(P_basic.Utils.getNameText(this.data));
		this.refreshBtn.setDisabled(this.isNew());
	},

	postInit : function() {
		if (this.isNew()) {

		} else {
			this.__loadData();
		}
	},

	refresh : function() {
		this.__loadData();
	},

	__loadData : function() {
		var params = {};
		P_basic.Utils.setRDN(params, this.data);
		P_main.sysReq(P_sch.WebAction.GET_SCHEDULE, params,
				this.__onDataLoaded, this);
	},

	__onDataLoaded : function(res) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			this.data = o;
			this.nameInput.setValue(o[P_sch.Schedule.NAME]);
			var schConfig = Ext.decode(o[P_sch.Schedule.SCH_CONFIG]);
			this.timeSettingMgr.setData(schConfig[P_sch.TimeConfig.SETTING]);
			this.scriptArea.setValue(schConfig[P_sch.TimeConfig.SCRIPT]);
			this.__updateUI();
		}
	},

	getXType : function() {
		return P_sch.SchEditorMgr.XTYPE;
	}
});
P_sch.SchEditorMgr.XTYPE = "P_sch.SchEditorMgr";

P_sch.TimeSettingMgr = Ext.extend(common.BasicTree, {
	constructor : function() {
		P_sch.TimeSettingMgr.superclass.constructor.call(this);
		this.timeGrid = new P_sch.TimeGrid();
		this.autoSelectNode = true;
		this.currNode = null;
		this.__initKeys();
	},

	getData : function() {
		this.__saveTimeSetting();
		var node = this.getRootNode().firstChild;
		if (node) {
			return this.__traverseNode(node);
		}
		return null;
	},

	setData : function(data) {
		if (data) {
			var root = this.getRootNode();
			root.removeAll(true);
			this.autoSelectNode = false;
			root.appendChild(this.__createTree(data));
			this.selectNode(root.firstChild);
			this.autoSelectNode = true;
		}
	},

	__createTree : function(data) {
		var o = P_sch.TimeConfigNodeType;
		var ts = P_sch.TimeSetting;
		var nodeType = data[ts.TYPE];
		var node = null;
		switch (nodeType) {
			case o.AND :
				node = this.__addAnd();
				break;
			case o.OR :
				node = this.__addOr();
				break;
			case o.CONDITION :
				var node = this.__addCondition();
				node.attributes.__TIME_SETTING = data[ts.CONTENT];
				break;
			default :
				throw new Error("Invalid node type: " + nodeType);
		}
		if (nodeType == o.AND || nodeType == o.OR) {
			var cs = data[ts.CHILDREN];
			if (cs) {
				for (var i = 0; i < cs.length; ++i) {
					node.appendChild(this.__createTree(cs[i]));
				}
			}
		}
		return node;
	},

	__traverseNode : function(node) {
		var o = P_sch.TimeConfigNodeType;
		var nodeType = node.attributes.__NODE_TYPE;
		var ts = P_sch.TimeSetting;
		var c = {};
		c[ts.TYPE] = nodeType;
		switch (nodeType) {
			case o.AND :
			case o.OR :
				var cs = [];
				var cns = node.childNodes;
				for (var i = 0; i < cns.length; ++i) {
					cs.push(this.__traverseNode(cns[i]));
				}
				c[ts.CHILDREN] = cs;
				break;
			case o.CONDITION :
				c[ts.CONTENT] = node.attributes.__TIME_SETTING;
				break;
			default :
				throw new Error("Invalid node type: " + nodeType);
		}
		return c;
	},

	__initKeys : function() {
		var prefix = "tc" + Utils.getId();
		this.keys = {
			year : prefix + "year",
			month : prefix + "month",
			date : prefix + "date",
			dayOfWeek : prefix + "dayOfWeek",
			hour : prefix + "hour",
			minute : prefix + "minute",
			second : prefix + "second"
		};
		var o = P_sch.TimeUnit;
		this.formKeys = {};
		this.formKeys[this.keys.year] = o.YEAR;
		this.formKeys[this.keys.month] = o.MONTH;
		this.formKeys[this.keys.date] = o.DAY;
		this.formKeys[this.keys.dayOfWeek] = o.WEEKDAY;
		this.formKeys[this.keys.hour] = o.HOUR;
		this.formKeys[this.keys.minute] = o.MINUTE;
		this.formKeys[this.keys.second] = o.SECOND;
	},

	createTree : function() {
		var tree = P_sch.TimeSettingMgr.superclass.createTree.call(this, {
					region : "center",
					border : false,
					animate : false,
					rootVisible : false,
					tbar : this.__createTBar(),
					bbar : this.__createBBar()
				});
		tree.getSelectionModel().on("selectionchange",
				this.__onSelectionChanged, this);
		return tree;
	},

	__createForm : function() {
		var cfg = {
			columnWidth : .3,
			labelWidth : 50,
			defaults : {
				width : 100,
				disabled : true
			},
			bodyStyle : {
				"padding-top" : "5px"
			},
			border : false
		};
		var form1 = GuiUtil.createForm(Ext.apply({
					items : [{
								id : this.keys.year,
								fieldLabel : P_sch.Res.year
							}, {
								id : this.keys.month,
								fieldLabel : P_sch.Res.month
							}, {
								id : this.keys.date,
								fieldLabel : P_sch.Res.date
							}, {
								id : this.keys.dayOfWeek,
								fieldLabel : P_sch.Res.dayOfWeek
							}]
				}, cfg));
		var form2 = GuiUtil.createForm(Ext.apply({
					items : [{
								id : this.keys.hour,
								fieldLabel : P_sch.Res.hour
							}, {
								id : this.keys.minute,
								fieldLabel : P_sch.Res.minute
							}, {
								id : this.keys.second,
								fieldLabel : P_sch.Res.second
							}]
				}, cfg));
		return new Ext.Panel({
					frame : true,
					title : P_sch.Res.condition + P_sch.Res.setting,
					region : "east",
					width : 530,
					layout : "column",
					border : false,
					items : [form1, form2, {
								columnWidth : .4,
								style : "padding: 5px 0 0 10px",
								html : P_sch.Res.timeConfigDesc
							}]
				});
	},

	createContent : function() {
		return new Ext.Panel({
					title : P_sch.Res.time + P_sch.Res.config,
					layout : "border",
					items : [{
								region : "center",
								layout : "border",
								border : false,
								items : [this.createTree(), this.__createForm()]
							}, this.timeGrid.createGrid({
										region : "east",
										width : 200,
										border : false,
										style : {
											"border-left" : "1px solid #D0D0D0"
										}
									})]
				});
	},

	__saveTimeSetting : function() {
		if (this.currNode) {
			var o = {};
			Utils.getValueFromGui(o, this.keys, this.formKeys);
			this.currNode.attributes.__TIME_SETTING = o;
		}
	},

	__populateTimeSetting : function() {
		if (this.currNode) {
			var o = this.currNode.attributes.__TIME_SETTING;
			if (o) {
				Utils.setValueToGui(o, this.keys, this.formKeys);
			}
		} else {
			GuiUtil.clearForm(this.formKeys);
		}
	},

	__onSelectionChanged : function(sm, node) {
		this.__saveTimeSetting();
		if (node) {
			var disabled = node.isLeaf();
			this.andBtn.setDisabled(disabled);
			this.orBtn.setDisabled(disabled);
			this.conditionBtn.setDisabled(disabled);
			this.delBtn.setDisabled(false);
			for (var k in this.keys) {
				Ext.getCmp(this.keys[k]).setDisabled(!disabled);
			}
		} else {
			this.delBtn.setDisabled(true);
			this.andBtn.setDisabled(false);
			this.orBtn.setDisabled(false);
			this.conditionBtn.setDisabled(false);
			for (var k in this.keys) {
				Ext.getCmp(this.keys[k]).setDisabled(true);
			}
		}
		this.currNode = node;
		this.__populateTimeSetting();
	},

	__createTBar : function() {
		this.andBtn = common.ToolItem.createAdd({
					text : P_sch.Res.and,
					handler : this.__addAnd,
					scope : this
				});
		this.orBtn = common.ToolItem.createAdd({
					text : P_sch.Res.or,
					handler : this.__addOr,
					scope : this
				});
		this.conditionBtn = new Ext.Button({
					text : P_sch.Res.condition,
					iconCls : P_sch.Env.conditionIconCls,
					handler : this.__addCondition,
					scope : this
				});
		this.delBtn = common.ToolItem.createDelete({
					disabled : true,
					handler : this.__deleteNode,
					scope : this
				});
		return [this.conditionBtn, this.delBtn];
	},

	__createBBar : function() {
		var dateLabel = "<label class='findLabel'>" + P_sch.Res.time
				+ ": </label>";
		this.testDateField = new Ext.form.TextField({
					width : 120,
					style : {
						"margin-right" : "5px"
					},
					value : new Date().format(P_main.Env.DATE_FORMAT)
				});
		var countLabel = "<label class='findLabel'>" + P_sch.Res.timeCount
				+ ": </label>";
		this.dateCountField = new Ext.form.NumberField({
					width : 30,
					allowDecimals : false,
					minValue : 1,
					maxValue : 50,
					style : {
						"margin-right" : "5px"
					},
					value : 5
				});
		var testBtn = new Ext.Button({
					text : P_sch.Res.test,
					iconCls : "testLink",
					handler : this.__loadTestTime,
					scope : this
				});
		return [dateLabel, this.testDateField, countLabel, this.dateCountField,
				testBtn];
	},

	__addNode : function(cfg) {
		var node = this.getSelectedNode();
		if (!node) {
			node = this.getRootNode();
		}
		if (!node.isLeaf()) {
			var cn = new Ext.tree.TreeNode(cfg);
			node.appendChild(cn);
			if (this.autoSelectNode) {
				this.selectNode(cn);
			}
			return cn;
		}
		return null;
	},

	__deleteNode : function() {
		var node = this.getSelectedNode();
		if (node) {
			node.parentNode.removeChild(node, true);
		}
	},

	__addAnd : function() {
		return this.__addNode({
					text : P_sch.Res.and,
					iconCls : null,
					expandable : true,
					expanded : true,
					__NODE_TYPE : P_sch.TimeConfigNodeType.AND
				});
	},

	__addOr : function() {
		return this.__addNode({
					text : P_sch.Res.or,
					iconCls : null,
					expandable : true,
					expanded : true,
					__NODE_TYPE : P_sch.TimeConfigNodeType.OR
				});
	},

	__addCondition : function() {
		return this.__addNode({
					text : P_sch.Res.condition,
					iconCls : P_sch.Env.conditionIconCls,
					leaf : true,
					__NODE_TYPE : P_sch.TimeConfigNodeType.CONDITION
				});
	},

	__loadTestTime : function() {
		var refTimeStr = this.testDateField.getValue();
		if (!P_basic.Utils.checkDateStrValid(refTimeStr)) {
			return;
		}
		if (!this.dateCountField.isValid()) {
			P_main.LogMgr.error(P_sch.Res.invalidTestTimeCount);
			return;
		}
		var count = this.dateCountField.getValue();
		this.__saveTimeSetting();
		this.timeGrid.clearData();
		var timeSetting = this.getData();
		if (timeSetting) {
			var params = {};
			params[P_sch.Schedule.SCH_TIME] = refTimeStr;
			params[P_sch.TimeConfig.SETTING] = Ext.encode(timeSetting);
			params[ds.Common.COUNT] = count;
			P_main.sysReq(P_sch.WebAction.GET_TEST_TIMES, params,
					this.__onTestTimeLoaded, this);
		} else {
			P_main.LogMgr.warning(P_sch.Res.noTimeSetting);
		}
	},

	__onTestTimeLoaded : function(res) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			var floorTimes = o.FLOOR;
			var ceilTimes = o.CEIL;
			if (floorTimes.length == 0 && ceilTimes.length == 0) {
				this.timeGrid.clearData();
				return;
			}
			var ns = [];
			var type = P_sch.TestTimeType.FLOOR;
			for (var i = 0; i < floorTimes.length; ++i) {
				ns.push(this.__createTestTime(type, floorTimes[i]));
			}
			ns.push(this.__createTestTime(P_sch.TestTimeType.REF,
					this.testDateField.getValue()));
			type = P_sch.TestTimeType.CEIL;
			for (var i = 0; i < ceilTimes.length; ++i) {
				ns.push(this.__createTestTime(type, ceilTimes[i]));
			}
			this.timeGrid.setDataList(ns);
		}
	},

	__createTestTime : function(type, value) {
		var time = {};
		time[P_sch.TestTime.VALUE] = value;
		time[P_sch.TestTime.TYPE] = type;
		return time;
	},

	getXType : function() {
		return P_sch.TimeSettingMgr.XTYPE;
	}
});
P_sch.TimeSettingMgr.XTYPE = "P_sch.TimeSettingMgr";

P_sch.TimeGrid = Ext.extend(common.BasicGrid, {
			constructor : function() {
				P_sch.TimeGrid.superclass.constructor.call(this);
			},

			setDataList : function(dataList) {
				P_sch.TimeGrid.superclass.setDataList.call(this, dataList);
				this.__updateRender(dataList);
			},

			__updateRender : function(dataList) {
				var idx = -1;
				for (var i = 0; i < dataList.length; ++i) {
					var o = dataList[i];
					if (o[P_sch.TestTime.TYPE] == P_sch.TestTimeType.REF) {
						idx = i;
						break;
					}
				}
				if (idx > -1) {
					this.selectRow(idx);
					var count = 4;
					var c = 0;
					while (idx < dataList.length - 1 && c < count) {
						idx += 1;
						++c;
					}
					this.focusRow(idx);
				}
			},

			createFields : function() {
				var fs = [];
				var o = P_sch.TestTime;
				for (var k in o) {
					fs.push(o[k]);
				}
				return fs;
			},

			createColumnModel : function() {
				var cols = [{
							id : this.getAutoExpandCol(),
							header : P_sch.Res.schedule + P_sch.Res.time,
							dataIndex : P_sch.TestTime.VALUE,
							sortable : false,
							width : 120,
							renderer : this.__renderer,
							scope : this
						}];
				return P_sch.TimeGrid.superclass.createColumnModel.call(this,
						cols);
			},

			__renderer : function(value, metaData, record, rowIndex, colIndex,
					store) {
				var type = record.get(P_sch.TestTime.TYPE);
				if (type == P_sch.TestTimeType.REF) {
					return utils.Renderer.renderLabel("red", value);
				}
				return value;
			},

			getXType : function() {
				return P_sch.TimeGrid.XTYPE;
			}
		});
P_sch.TimeGrid.XTYPE = "P_sch.TimeGrid";

P_sch.ViewLogFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_sch.ViewLogFormMgr.superclass.constructor.call(this);
				this.autoLoad = false;
				this.interval = 1500;
				this.versionNum = 0;
			},

			initKeys : function() {
				var prefix = "edit" + Utils.getId();
				this.editKeys = {
					trace : prefix + "trace",
					errDetail : prefix + "errDetail"
				};
				this.formKeys = {};
				this.formKeys[this.editKeys.trace] = P_sch.SchNode.TRACE;
				this.formKeys[this.editKeys.errDetail] = P_sch.SchNode.ERR_DETAIL;
			},

			getEditWinConfig : function() {
				return {
					title : P_sch.Res.schedule + P_sch.Res.log,
					buttons : [{
								text : Resources.close,
								handler : this.cancelEdit,
								scope : this
							}]
				};
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							width : 750,
							height : 400,
							items : [this.createForm()]
						}, config));
			},

			createForm : function() {
				this.tabs = new Ext.TabPanel({
							activeTab : 0,
							items : [{
										title : P_sch.Res.trace,
										layout : "fit",
										items : [{
													id : this.keys.trace,
													readOnly : true,
													xtype : "textarea"
												}]
									}, {
										title : P_sch.Res.errDetail,
										layout : "fit",
										items : [{
													id : this.keys.errDetail,
													readOnly : true,
													cls : "msg-error",
													xtype : "textarea"
												}]
									}]
						});
				return this.tabs;
			},

			reqEdit : function() {
				P_sch.ViewLogFormMgr.superclass.reqEdit.call(this);
				this.__loadData();
			},

			__loadData : function() {
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				++this.versionNum;
				P_main.sysReq(P_sch.WebAction.GET_SCH_LOG, params,
						this.__onDataLoaded, this, {
							unLock : true,
							versionNum : this.versionNum
						});
			},

			__onDataLoaded : function(res, opts) {
				var o = P_main.Service.getRSContent(res);
				if (o && this.data && opts.others.versionNum == this.versionNum) {
					this.__populateLog(o);
					var status = o[P_sch.SchNode.STATUS];
					this.autoLoad = (status == P_sch.SchNodeStatus.RUNNING);
					if (this.autoLoad) {
						setTimeout(this.__getTimerFunc(), this.interval);
					}
				}
			},

			__populateLog : function(o) {
				var traceContent = o[P_sch.SchNode.TRACE];
				if (!Utils.isBlank(traceContent)) {
					var endMsg = "";
					switch (o[P_sch.SchNode.STATUS]) {
						case P_sch.SchNodeStatus.SUCCESSED :
							endMsg = P_sch.Res.statusSuccessed;
							break;
						case P_sch.SchNodeStatus.FAILED :
							endMsg = P_sch.Res.statusFailed;
							break;
						case P_sch.SchNodeStatus.TERMINATED :
							endMsg = P_sch.Res.statusTerminated;
							break;
						default :
							endMsg = "";
					}
					if (endMsg) {
						endMsg = "\n" + endMsg;
					}
					var rows = traceContent.split("\n");
					var newRows = [];
					for (var i = 0; i < rows.length; ++i) {
						var row = Ext.decode(rows[i]);
						newRows.push(["[", row.TIME, "]: ", row.MSG].join(""));
					}
					o[P_sch.SchNode.TRACE] = newRows.join("\n") + endMsg;
				}
				Utils.setValueToGui(o, this.keys, this.formKeys);
				var activeTab = 0;
				var cmpId = this.keys.trace;
				if (!Utils.isBlank(o[P_sch.SchNode.ERR_DETAIL])) {
					activeTab = 1;
					cmpId = this.keys.errDetail;
				}
				this.tabs.setActiveTab(activeTab);
				Ext.getCmp(cmpId).el.scroll("b", 1000);
			},

			__getTimerFunc : function() {
				if (!this.timerFunc) {
					var mgr = this;
					this.timerFunc = function() {
						if (mgr.autoLoad && mgr.data) {
							mgr.__loadData();
						}
					}
				}
				return this.timerFunc;
			},

			getXType : function() {
				return P_sch.ViewLogFormMgr.XTYPE;
			}
		});
P_sch.ViewLogFormMgr.XTYPE = "P_sch.ViewLogFormMgr";
Utils.addInstanceFunc(P_sch.ViewLogFormMgr);

P_sch.ChangeSlaveNodeFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_sch.ChangeSlaveNodeFormMgr.superclass.constructor.call(this);
				P_sch.pipe.reg(P_sch.Event.SCH_SLAVE_NODE_CHANGED, this);
			},

			getEditWinConfig : function() {
				return {
					title : P_sch.Res.change + "-" + P_sch.Res.slaveNode
				};
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							width : 400,
							height : 120,
							items : [this.createForm()]
						}, config));
			},

			createForm : function() {
				this.slaveNodeCombo = GuiUtil.createComboBox({
							fieldLabel : P_sch.Res.slaveNode,
							width : 300,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"]
									})
						});
				return GuiUtil.createForm({
							labelWidth : 60,
							defaults : {},
							bodyStyle : {
								padding : "10px 0 0 0"
							},
							items : [this.slaveNodeCombo]
						});
			},

			reqEdit : function() {
				P_sch.ChangeSlaveNodeFormMgr.superclass.reqEdit.call(this);
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				P_main.sysReq(P_sch.WebAction.LIST_SLAVE_NODE, params,
						this.__onDataLoaded, this);
			},

			__onDataLoaded : function(res) {
				var os = P_main.Service.getRSContent(res);
				if (os) {
					var data = [[P_sch.Res.localNode, null]];
					for (var i = 0; i < os.length; ++i) {
						var o = os[i];
						var label = [o._LABEL, " (", o._HOST, ":", o._PORT, ")"]
								.join("");
						data.push([label, o._NAME]);
					}
					this.slaveNodeCombo.getStore().loadData(data);
					this.slaveNodeCombo.setValue(data[0][1]);
				}
			},

			doEdit : function() {
				var params = Ext.apply({}, this.data);
				params[P_sch.SchNode.SLAVE_NAME] = this.slaveNodeCombo
						.getValue();
				P_main.sysReq(P_sch.WebAction.CHANGE_SLAVE_NODE, params,
						this.__onChanged, this);
			},

			__onChanged : function(res) {
				if (P_main.Service.parseResult(res)) {
					this.cancelEdit();
					this.fireEvent(P_sch.Event.SCH_SLAVE_NODE_CHANGED);
				}
			},

			getXType : function() {
				return P_sch.ChangeSlaveNodeFormMgr.XTYPE;
			}
		});
P_sch.ChangeSlaveNodeFormMgr.XTYPE = "P_sch.ChangeSlaveNodeFormMgr";
Utils.addInstanceFunc(P_sch.ChangeSlaveNodeFormMgr);

P_sch.ChangeQueueFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_sch.ChangeQueueFormMgr.superclass.constructor.call(this);
				P_sch.pipe.reg(P_sch.Event.SCH_QUEUE_CHANGED, this);
			},

			initKeys : function() {
				var prefix = "edit" + Utils.getId();
				this.editKeys = {
					queue : prefix + "queue"
				};
				this.formKeys = {};
				this.formKeys[this.editKeys.queue] = P_sch.SchNode.QUEUE;
			},

			getEditWinConfig : function() {
				return {
					title : P_sch.Res.change + "-" + P_sch.Res.queue
				};
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							width : 400,
							height : 120,
							items : [this.createForm()]
						}, config));
			},

			createForm : function() {
				this.queueCombo = GuiUtil.createComboBox({
							id : this.keys.queue,
							fieldLabel : P_sch.Res.queue,
							width : 300,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"]
									})
						});
				return GuiUtil.createForm({
							labelWidth : 60,
							defaults : {},
							bodyStyle : {
								padding : "10px 0 0 0"
							},
							items : [this.queueCombo]
						});
			},

			reqEdit : function() {
				P_sch.ChangeQueueFormMgr.superclass.reqEdit.call(this);
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				P_main.sysReq(P_sch.WebAction.LIST_SCH_QUEUE, params,
						this.__onQueuesLoaded, this);
			},

			__onQueuesLoaded : function(res) {
				var os = P_main.Service.getRSContent(res);
				if (os) {
					var data = [];
					for (var i = 0; i < os.length; ++i) {
						var o = os[i];
						data.push([o[P_sch.SchQueue.NAME],
								P_basic.Utils.getRDN(o)]);
					}
					if (data.length > 0) {
						this.queueCombo.getStore().loadData(data);
						this.queueCombo.setValue(data[0][1]);
					}
				}
			},

			doEdit : function() {
				var params = Ext.apply({}, this.data);
				P_basic.Utils.setRDN(params, this.queueCombo.getValue());
				P_main.sysReq(P_sch.WebAction.CHANGE_SCH_QUEUE, params,
						this.__onQueueChanged, this);
			},

			__onQueueChanged : function(res) {
				if (P_main.Service.parseResult(res)) {
					this.cancelEdit();
					this.fireEvent(P_sch.Event.SCH_QUEUE_CHANGED);
				}
			},

			getXType : function() {
				return P_sch.ChangeQueueFormMgr.XTYPE;
			}
		});
P_sch.ChangeQueueFormMgr.XTYPE = "P_sch.ChangeQueueFormMgr";
Utils.addInstanceFunc(P_sch.ChangeQueueFormMgr);

P_sch.QueueFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_sch.QueueFormMgr.superclass.constructor.call(this);
				P_sch.pipe.reg(P_sch.Event.QUEUE_ADDED, this);
				P_sch.pipe.reg(P_sch.Event.QUEUE_UPDATED, this);
			},

			initKeys : function() {
				var prefix = "add" + Utils.getId();
				this.addKeys = {
					name : prefix + "name",
					size : prefix + "size"
				};

				prefix = "edit" + Utils.getId();
				this.editKeys = {
					name : prefix + "name",
					size : prefix + "size"
				};

				this.formKeys = {};
				this.formKeys[this.addKeys.name] = P_sch.SchQueue.NAME;
				this.formKeys[this.addKeys.size] = P_sch.SchQueue.SIZE;

				this.formKeys[this.editKeys.name] = P_sch.SchQueue.NAME;
				this.formKeys[this.editKeys.size] = P_sch.SchQueue.SIZE;
			},

			getAddWinConfig : function() {
				return {
					title : P_sch.Res.add + "-" + P_sch.Res.queue
				};
			},

			getEditWinConfig : function() {
				return {
					title : P_sch.Res.edit + "-" + P_sch.Res.queue
				};
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							width : 400,
							height : 150,
							items : [this.createForm()]
						}, config));
			},

			createForm : function() {
				return GuiUtil.createForm({
							labelWidth : 60,
							defaults : {},
							bodyStyle : {
								padding : "10px 0 0 0"
							},
							items : [{
										id : this.keys.name,
										fieldLabel : P_sch.Res.name,
										width : 300,
										cls : "fieldList-value"
									}, {
										id : this.keys.size,
										fieldLabel : P_sch.Res.size,
										width : 300,
										allowDecimals : false,
										cls : "fieldList-value",
										xtype : "numberfield"
									}]
						});
			},

			reqAdd : function() {
				P_sch.QueueFormMgr.superclass.reqAdd.call(this);
				Ext.getCmp(this.keys.size)
						.setValue(P_sch.Env.DEFAULT_QUEUE_SIZE);
			},

			doAdd : function() {
				var params = Ext.apply({}, this.data);
				Utils.getValueFromGui(params, this.keys, this.formKeys);
				if (!this.validate(params)) {
					return;
				}
				P_main.sysReq(P_sch.WebAction.ADD_SCH_QUEUE, params,
						this.__onAdded, this);
			},

			__onAdded : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.fireEvent(P_sch.Event.QUEUE_ADDED, o);
					this.cancelAdd();
				}
			},

			reqEdit : function() {
				P_sch.QueueFormMgr.superclass.reqEdit.call(this);
				var params = Ext.apply({}, this.data);
				P_main.sysReq(P_sch.WebAction.GET_SCH_QUEUE, params,
						this.__onDataLoaded, this);
			},

			__onDataLoaded : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					Utils.setValueToGui(o, this.keys, this.formKeys);
				}
			},

			doEdit : function() {
				var params = Ext.apply({}, this.data);
				Utils.getValueFromGui(params, this.keys, this.formKeys);
				if (!this.validate(params)) {
					return;
				}
				P_main.sysReq(P_sch.WebAction.UPDATE_SCH_QUEUE, params,
						this.__onUpdated, this);
			},

			__onUpdated : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.fireEvent(P_sch.Event.QUEUE_UPDATED, o);
					this.cancelEdit();
				}
			},

			validate : function(o) {
				return true;
			},

			getXType : function() {
				return P_sch.QueueFormMgr.XTYPE;
			}
		});
P_sch.QueueFormMgr.XTYPE = "P_sch.QueueFormMgr";
Utils.addInstanceFunc(P_sch.QueueFormMgr);

P_sch.SchTimeFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_sch.SchTimeFormMgr.superclass.constructor.call(this);
			},

			initKeys : function() {
				this.editKeys = {
					schTime : "schTime" + Utils.getId()
				};

				this.formKeys = {};
				this.formKeys[this.editKeys.schTime] = P_sch.Schedule.SCH_TIME;
			},

			getEditWinConfig : function() {
				return {
					title : P_sch.Res.edit + "-" + P_sch.Res.schTime
				};
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							width : 400,
							height : 130,
							items : [this.createForm()]
						}, config));
			},

			createForm : function() {
				var w = 250;
				this.refTimeInput = new Ext.form.TextField({
							width : w
						});
				this.schTimeCombo = GuiUtil.createComboBox({
							id : this.editKeys.schTime,
							width : w,
							store : new Ext.data.SimpleStore({
										fields : ["name", "value"]
									})
						});
				var testBtn = new Ext.Button({
							text : P_sch.Res.test,
							iconCls : "testLink",
							handler : this.__loadSchTime,
							scope : this
						});
				this.content = new Ext.Panel({
							layout : "table",
							layoutConfig : {
								tableAttrs : {
									cellspacing : "5px",
									style : {
										padding : "0 0 0 5px"
									}
								},
								columns : 3
							},
							items : [
									P_basic.Utils.createLabelItem(
											P_sch.Res.refTime, 55),
									this.refTimeInput,
									testBtn,
									P_basic.Utils.createLabelItem(
											P_sch.Res.schTime, 55),
									this.schTimeCombo]
						});
				return this.content;
			},

			reqEdit : function() {
				P_sch.SchTimeFormMgr.superclass.reqEdit.call(this);
				this.refTimeInput.setValue(this.data[P_sch.Schedule.SCH_TIME]);
			},

			__loadSchTime : function() {
				var refTimeStr = this.refTimeInput.getValue();
				if (!P_basic.Utils.checkDateStrValid(refTimeStr)) {
					return;
				}
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				params[P_sch.Schedule.SCH_TIME] = refTimeStr;
				P_main.sysReq(P_sch.WebAction.GET_SCH_TIMES, params,
						this.__onSchTimeLoaded, this);
			},

			__onSchTimeLoaded : function(res) {
				var os = P_main.Service.getRSContent(res);
				if (os) {
					var ns = [];
					for (var i = 0; i < os.length; ++i) {
						ns.push([os[i], os[i]]);
					}
					if (ns.length > 0) {
						this.schTimeCombo.getStore().loadData(ns);
						this.schTimeCombo.setValue(os[0]);
					}
				}
			},

			doEdit : function() {
				var schTime = this.schTimeCombo.getValue();
				if (!schTime) {
					P_main.LogMgr.error(P_sch.Res.noSchTime);
					return;
				}
				var params = {};
				P_basic.Utils.setRDN(params, this.data);
				params[P_sch.Schedule.SCH_TIME] = schTime;
				P_main.sysReq(P_sch.WebAction.CHANGE_TIME, params,
						this.__onTimeChanged, this);
			},

			__onTimeChanged : function(res) {
				if (P_main.Service.parseResult(res)) {
					this.cancelEdit();
				}
			},

			getXType : function() {
				return P_sch.SchTimeFormMgr.XTYPE;
			}
		});
P_sch.SchTimeFormMgr.XTYPE = "P_sch.SchTimeFormMgr";
Utils.addInstanceFunc(P_sch.SchTimeFormMgr);

P_sch.SchImportMgr = Ext.extend(P_basic.UploadFormMgr, {
			constructor : function() {
				P_sch.SchImportMgr.superclass.constructor.call(this);
			},

			__getSubmitConfig : function() {
				return {
					func : P_sch.WebAction.IMPORT_SCH_RELATION,
					params : {
						CALLBACK : "window.parent.P_basic.afterUpload",
						CALLBACK_PARAMS : Ext.encode({
									EVENT : P_sch.Event.SCH_RELATION_IMPORTED
								})
					}
				};
			},

			getXType : function() {
				return P_sch.SchImportMgr.XTYPE;
			}
		});
P_sch.SchImportMgr.XTYPE = "P_sch.SchImportMgr";
Utils.addInstanceFunc(P_sch.SchImportMgr);

P_sch.FlowGraphEditorMgr = Ext.extend(P_basic.EditorMgr, {
	constructor : function() {
		P_sch.FlowGraphEditorMgr.superclass.constructor.call(this);
		this.canvas = new P_basic.GraphCanvas();
		this.cmpMap = {};
		this.connMap = {};
		this.handler = null;
		this.interval = 5000;
	},

	clear : function() {
		clearInterval(this.handler);
		this.handler = null;
		P_sch.FlowGraphEditorMgr.superclass.clear.call(this);
		this.__clearContent();
	},

	__clearContent : function() {
		for (var k in this.cmpMap) {
			delete this.cmpMap[k];
		}
		for (var k in this.connMap) {
			delete this.connMap[k];
		}
		if (this.contentPane) {
			this.canvas.remove();
			Ext.get(this.contentPane).remove();
			this.contentPane = null;
		}
	},

	isDataOwner : function(data) {
		if (data.FLAG == this.data.FLAG) {
			return true;
		}
		return P_sch.FlowGraphEditorMgr.superclass.isDataOwner.call(this, data);
	},

	__createContent : function() {
		var content = new Ext.Panel({
					title : P_sch.Res.flowGraph,
					iconCls : P_sch.Env.flowGraphIconCls,
					closable : true
				});
		content.on("afterrender", this.__onAfterRender, this);
		return content;
	},

	__onAfterRender : function() {
		this.__loadData();
		this.handler = setInterval(this.__getTimerFunc(), this.interval);
	},

	__getContentPane : function() {
		if (!this.contentPane) {
			this.contentPane = Ext.DomHelper.append(this.content.body.dom, {
						style : {
							position : "absolute",
							width : "100%",
							height : "100%",
							overflow : "auto"
						}
					});
		}
		return this.contentPane;
	},

	setData : function(data) {
		P_sch.FlowGraphEditorMgr.superclass.setData.call(this, data);
		if (this.content && this.content.rendered) {
			this.__loadData();
		}
	},

	resetData : function(data) {
		this.setData(data);
	},

	__loadData : function() {
		var RDN = P_basic.Utils.getRDN(this.data);
		P_main.sysReq(this.data.ACTION, this.data.PARAMS, this.__onDataLoaded,
				this, {
					unLock : true,
					RDN : RDN
				});
	},

	__onDataLoaded : function(res, opts) {
		var o = P_main.Service.getRSContent(res);
		if (o) {
			var RDN = P_basic.Utils.getRDN(this.data);
			if (opts.others.RDN == RDN && this.activate) {
				this.__renderFromCache(o);
			}
		}
	},

	__renderFromCache : function(o) {
		var nodeMap = {};
		var ns = o.NODES;
		for (var i = 0; i < ns.length; ++i) {
			var n = ns[i];
			nodeMap[n[P_sch.SchNode.RDN]] = n;
		}
		var edgeMap = {};
		var sourceSet = new ObjectSet();
		var targetSet = [];
		var edges = o.EDGES;
		for (var i = 0; i < edges.length; ++i) {
			var edge = edges[i];
			var source = edge[P_basic.Relation.SOURCE];
			var target = edge[P_basic.Relation.TARGET];
			sourceSet.add(source);
			targetSet.push(target);
			var targets = edgeMap[source];
			if (!targets) {
				targets = [];
				edgeMap[source] = targets;
			}
			targets.push(target);
		}
		sourceSet.removeAll(targetSet);
		var sources = sourceSet.values();
		sourceSet.clear();
		this.__render(sources, nodeMap, edgeMap);
	},

	__getTimerFunc : function() {
		if (!this.timerFunc) {
			var mgr = this;
			this.timerFunc = function() {
				if (mgr.data) {
					mgr.__loadData();
				}
			}
		}
		return this.timerFunc;
	},

	__arrangeNode2Group : function(sources, edgeMap) {
		var targetSet = new ObjectSet();
		var groups = [];
		while (true) {
			groups.push(sources);
			for (var i = 0; i < sources.length; ++i) {
				var key = sources[i];
				var targets = edgeMap[key];
				if (targets) {
					targetSet.addAll(targets);
				}
			}
			sources = targetSet.values();
			targetSet.clear();
			if (sources.length == 0) {
				break;
			}
		}
		return groups;
	},

	__calculateGroupHeight : function(groups, vGap, nodeHeight) {
		var count = groups[0].length;
		for (var i = 1; i < groups.length; ++i) {
			if (groups[i].length > count) {
				count = groups[i].length;
			}
		}
		return (count - 1) * vGap + count * nodeHeight;
	},

	__render : function(sources, nodeMap, edgeMap) {
		var pn = this.__getContentPane();
		if (!this.rendered) {
			this.canvas.render(pn);
			this.rendered = true;
		}
		var oldKeys = new ObjectSet();
		for (var k in this.cmpMap) {
			oldKeys.add(k);
		}
		var groups = this.__arrangeNode2Group(sources, edgeMap);
		var vGap = 20;
		var nodeHeight = 52;
		var gh = this.__calculateGroupHeight(groups, vGap, nodeHeight);

		var x = 50;
		var oy = 30;
		var hGap = 180;
		var w = 40;
		var h = 40;
		var margin = 30;
		var mw = x + w * groups.length + hGap * (groups.length - 1) + margin;
		var mh = gh + oy + margin;

		for (var i = 0; i < groups.length; ++i) {
			var keys = groups[i];
			var count = keys.length;
			var y = oy;
			var dy = (gh - count * nodeHeight - (count - 1) * vGap) / 2;
			y += dy;
			for (var j = 0; j < keys.length; ++j) {
				var key = keys[j];
				var node = nodeMap[key];
				var el = this.cmpMap[key];
				if (!el) {
					el = this.__renderNode(node, w, h);
					this.cmpMap[key] = el;
				} else {
					oldKeys.remove(key);
				}
				el.setLeftTop(x, y);
				this.__renderNodeStatus(node, el);
				y += nodeHeight + vGap;
			}
			x += hGap;
		}
		this.__removeNodes(oldKeys.values());
		this.__addEdges(edgeMap);
		this.canvas.setSize(mw, mh);
	},

	__addEdges : function(edgeMap) {
		for (var source in edgeMap) {
			var targets = edgeMap[source];
			for (var i = 0; i < targets.length; ++i) {
				var target = targets[i];
				var key = source + "-" + target;
				var conn = this.canvas.addConnection(this.cmpMap[source],
						this.cmpMap[target], this.connMap[key]);
				this.connMap[key] = conn;
			}
		}
	},

	__removeNodes : function(oldKeys) {
		var delConnKeys = new ObjectSet();
		for (var i = 0; i < oldKeys.length; ++i) {
			var key = oldKeys[i];
			var el = this.cmpMap[key];
			delete this.cmpMap[key];
			el.remove();
			for (var k in this.connMap) {
				if (k.indexOf(key) > -1) {
					delConnKeys.add(k);
				}
			}
		}
		delConnKeys = delConnKeys.values();
		for (var i = 0; i < delConnKeys.length; ++i) {
			var key = delConnKeys[i];
			var conn = this.connMap[key].line;
			delete this.connMap[key];
			conn.remove();
		}
	},

	__renderNodeStatus : function(node, nodeEl) {
		var key = node[P_sch.SchNode.RDN];
		var statusEl = nodeEl.child("." + P_sch.Env.nodeStatusIconCls);
		var statusCls = statusEl.statusCls;
		if (statusCls) {
			statusEl.removeClass(statusCls);
		}
		var status = node[P_sch.SchNode.STATUS];
		statusCls = P_sch.SchNodeStatusIconCls[status];
		if (statusCls) {
			statusEl.addClass(statusCls);
			statusEl.statusCls = statusCls;
		}
	},

	__renderNode : function(node, w, h) {
		var imgPath = P_sch.Env.nodeImage;
		var dom = Ext.DomHelper.append(this.__getContentPane(), {
					style : {
						position : "absolute",
						margin : 0,
						padding : 0,
						"line-height" : 0
					},
					children : [{
								tag : "img",
								src : imgPath,
								style : {
									width : "100%",
									height : "100%"
								}
							}, {
								cls : P_sch.Env.nodeStatusIconCls
							}]
				});
		var el = Ext.get(dom);
		el.setSize(w, h);
		var textDom = Ext.DomHelper.append(document.body, {
					style : {
						position : "absolute",
						"line-height" : "100%",
						width : "auto",
						height : "auto"
					},
					cls : "defaultText",
					html : node[P_sch.SchNode.NAME]
				});
		var textEl = Ext.get(textDom);
		var textWidth = textEl.getWidth();
		el.appendChild(textDom);
		textEl.setWidth(textWidth);
		textEl.setLeft(parseInt((w - textWidth) / 2));
		return el;
	},

	getXType : function() {
		return P_sch.FlowGraphEditorMgr.XTYPE;
	}
});
P_sch.FlowGraphEditorMgr.XTYPE = "P_sch.FlowGraphEditorMgr";

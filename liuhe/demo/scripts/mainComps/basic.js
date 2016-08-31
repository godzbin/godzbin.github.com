Ext.ns("P_basic");

P_basic.DataExchangeType = {
	METADATA : "METADATA"
};

P_basic.Res = Ext.apply({
			debugTerminated : "调试已停止",
			debugExit : "调试已完成",
			closeOnDebugging : "请先终止调试再关闭",
			pleaseSelectFileFirst : "请先选择文件",
			attachUploading : "附件上传中...",
			pleaseWait : "请稍后",
			invalidTime : "时间不合法"
		}, Resources);

P_basic.afterUpload = function(msg, state, paramsStr) {
	P_main.onNotify(msg, state);
	P_main.unlockUpload();
	if (paramsStr) {
		try {
			return Ext.decode(paramsStr);
		} catch (e) {
		}
	}
	return paramsStr;
};

P_basic.WebAction = {
	GET_TRACE : "view_getTrace"
};

P_basic.BuiltInMO = {
	ID : "_ID",
	CLASS : "CLASS",
	RDN : "RDN",
	PDN : "_PDN"
};

P_basic.Relation = {
	SOURCE : "_SOURCE",
	TARGET : "_TARGET"
};

P_basic.ModelBase = Ext.apply({
			NAME : "_NAME",
			LABEL : "_LABEL",
			DESC : "_DESC"
		}, P_basic.BuiltInMO);

P_basic.Utils = {

	checkDateStrValid : function(s) {
		var date = Date.parse(s, P_main.Env.DATE_FORMAT);
		if (isNaN(date)) {
			P_main.LogMgr.error(P_basic.Res.invalidTime);
			return false;
		}
		return true;
	},

	setBtnVisible : function(btns, visible) {
		for (var i = 0; i < btns.length; ++i) {
			btns[i].setVisible(visible);
		}
	},

	setBtnDisabled : function(btns, disabled) {
		for (var i = 0; i < btns.length; ++i) {
			btns[i].setDisabled(disabled);
		}
	},

	getNameText : function(o) {
		var text = o[P_basic.ModelBase.LABEL];
		if (Utils.isBlank(text)) {
			text = o[P_basic.ModelBase.NAME];
		}
		return text;
	},

	setRDN : function(toObj, fromObj) {
		var RDN = fromObj;
		if (typeof(fromObj) != "string") {
			RDN = this.getRDN(fromObj);
		}
		toObj[P_basic.BuiltInMO.RDN] = RDN;
	},

	setPDN : function(toObj, fromObj) {
		var RDN = fromObj;
		if (typeof(fromObj) != "string") {
			RDN = this.getRDN(fromObj);
		}
		toObj[P_basic.BuiltInMO.PDN] = RDN;
	},

	getPDN : function(o) {
		var key = P_basic.BuiltInMO.PDN;
		if (o.get) {
			return o.get(key);
		}
		return o[key];
	},

	getRDN : function(o) {
		var key = P_basic.BuiltInMO.RDN;
		if (o.get) {
			return o.get(key);
		}
		return o[key];
	},

	deleteConfirm : function(msg, RDN, action, callback, scope, others) {
		Utils.confirm(Resources.removeConfirm, msg, function(btn) {
					if (btn == "yes") {
						var params = {};
						params[P_basic.BuiltInMO.RDN] = RDN;
						P_main.sysReq(action, params, callback, this, others);
					}
				}, scope);
	},

	createLabelItem : function(label, width) {
		return new Ext.Toolbar.TextItem({
					text : label + ":",
					width : width ? width : null
				});
	}
};

P_basic.TreeMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_basic.TreeMgr.superclass.constructor.call(this);
				this.originalNode = null;
				this.contextMenu = null;
			},

			getNodeByRDN : function(RDN) {
				return this.getOriginalNode().findChild("__RDN", RDN, true);
			},

			getOriginalNode : function() {
				if (!this.originalNode) {
					this.originalNode = new Ext.tree.TreeNode({
								text : this.__getOriginalNodeText(),
								expandable : true,
								__MGR_TYPE : this.getXType()
							});
				}
				return this.originalNode;
			},

			isNodeOwner : function(node) {
				return node.attributes.__MGR_TYPE == this.getXType();
			},

			getTree : function() {
				return this.getOriginalNode().getOwnerTree();
			},

			getSelectedNode : function() {
				return this.getTree().getSelectionModel().getSelectedNode();
			},

			__createContextMenu : function() {
			},

			getContextMenu : function() {
				if (!this.contentMenu) {
					this.contextMenu = this.__createContextMenu();
				}
				return this.contextMenu;
			},

			showContextMenu : function(node, event) {
			},

			onNodeDblClick : function(node) {
			},

			onNodeExpanded : function(node) {
			},

			onAfterRender : function() {
				this.getOriginalNode().expand();
			},

			addItemToTree : function(o) {
				var pn = this.getSelectedNode();
				if (pn.attributes.__CHILDREN_LOADED) {
					pn.appendChild(this.__createNode(o));
				}
				pn.expand();
			},

			refreshNodeText : function(o) {
				var node = this.getNodeByRDN(P_basic.Utils.getRDN(o));
				if (node) {
					node.setText(P_basic.Utils.getNameText(o));
				}
			},

			refreshNode : function() {
				var node = this.getSelectedNode();
				if (node) {
					node.attributes.__CHILDREN_LOADED = false;
					node.collapse();
					node.removeAll(true);
					node.expand();
				}
			},

			removeSelectedNode : function(evt) {
				var node = this.getSelectedNode();
				if (node) {
					var RDN = node.attributes.__RDN;
					node.remove(true);
					this.fireEvent(evt, RDN);
				}
			},

			getXType : function() {
				return P_basic.TreeMgr.XTYPE;
			}
		});
P_basic.TreeMgr.XTYPE = "P_basic.TreeMgr";

P_basic.EditorMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_basic.EditorMgr.superclass.constructor.call(this);
				this.data = null;
				this.dirty = false;
			},

			isDirty : function() {
				return this.dirty;
			},

			__createContent : function() {
			},

			getContent : function() {
				if (!this.content) {
					this.content = this.__createContent();
				}
				return this.content;
			},

			checkClose : function() {
				return true;
			},

			isNew : function() {
				return false;
			},

			isDataOwner : function(data) {
				var RDN = P_basic.Utils.getRDN(this.data);
				return RDN && RDN == P_basic.Utils.getRDN(data);
			},

			setData : function(data) {
				this.data = data;
			},

			resetData : function(data) {
			},

			getData : function() {
				return this.data;
			},

			setActivate : function(v) {
				this.activate = v;
			},

			preInit : function() {
			},

			postInit : function() {
			},

			__updateUI : function() {
			},

			clear : function() {
				this.data = null;
				this.purgeListeners();
			},

			save : function() {
			},

			getXType : function() {
				return P_basic.EditorMgr.XTYPE;
			}
		});
P_basic.EditorMgr.XTYPE = "P_basic.EditorMgr";

P_basic.DebugMgr = Ext.extend(Ext.util.Observable, {
			constructor : function(config) {
				P_basic.DebugMgr.superclass.constructor.call(this);
				this.debugKey = "debug" + Utils.getId();
				this.renew = false;
				this.debugging = false;
				this.interval = 500;
				this.owner = null;
				this.terminateAction = null;
				Ext.apply(this, config);
			},

			setOwner : function(owner) {
				this.owner = owner;
			},

			getDebugKey : function() {
				return this.debugKey;
			},

			isDebugging : function() {
				return this.debugging;
			},

			createToolItems : function() {
				this.debugBtn = new Ext.Button({
							text : P_basic.Res.debug,
							iconCls : "debug",
							handler : this.__debug,
							scope : this
						});
				this.cancelBtn = new Ext.Button({
							text : P_basic.Res.stop,
							disabled : true,
							iconCls : "stop",
							handler : this.__terminateDebug,
							scope : this
						});
				return [this.debugBtn, this.cancelBtn];
			},

			__updateUI : function() {
				if (this.debugging) {
					this.debugBtn.setDisabled(true);
					this.cancelBtn.setDisabled(false);
				} else {
					this.debugBtn.setDisabled(false);
					this.cancelBtn.setDisabled(true);
				}
			},

			__debug : function() {
				this.renew = true;
				this.debugging = true;
				this.__updateUI();
				this.__debugLog(null, "");
				P_main.sysReq(this.owner.getDebugMethod(), this.owner
								.getDebugParams(), this.__onDebug, this);
			},

			__onDebug : function(res) {
				var o = P_main.Service.getRSContent(res);
				if (o) {
					this.traceKey = o.KEY;
					this.__loadTrace();
				} else {
					this.__debugEnd();
				}
			},

			__loadTrace : function() {
				var params = {
					KEY : this.traceKey
				};
				P_main.sysReq(P_basic.WebAction.GET_TRACE, params,
						this.__onTraceLoaded, this, {
							unLock : true
						});
			},

			__onTraceLoaded : function(res) {
				var os = P_main.Service.getRSContent(res);
				if (os && this.debugging) {
					var end = false;
					for (var i = 0; i < os.length; ++i) {
						var o = os[i];
						if (o.TYPE != P_main.LogType.END) {
							this.__debugLog(o.TYPE, ["[", o.TIME, "]: ",
											o.VALUE].join(""));
						} else {
							end = true;
						}
					}
					if (!end) {
						setTimeout(this.__getTimerFunc(), this.interval);
					} else {
						this.__stopDebug(false);
					}
				}
			},

			__getTimerFunc : function() {
				if (!this.timerFunc) {
					var ref = this;
					this.timerFunc = function() {
						if (ref.debugging) {
							ref.__loadTrace();
						}
					}
				}
				return this.timerFunc;
			},

			__terminateDebug : function() {
				this.debugging = false;
				var params = {
					KEY : this.traceKey
				};
				P_main.sysReq(this.terminateAction, params,
						this.__onDebugTerminated, this);
			},

			__onDebugTerminated : function(res) {
				if (P_main.Service.parseResult(res)) {
					var os = P_main.Service.getRSContent(res);
					for (var i = 0; i < os.length; ++i) {
						var o = os[i];
						if (o.TYPE != P_main.LogType.END) {
							this.__debugLog(o.TYPE, o.VALUE);
						}
					}
					this.__stopDebug(true);
				}
			},

			__debugLog : function(logType, msg) {
				var renew = this.renew;
				if (this.renew) {
					this.renew = false;
				}
				var config = {
					KEY : this.debugKey,
					TITLE : this.owner.getDebugTitle(),
					RENEW : renew
				};
				if (logType == null) {
					logType = P_main.LogType.INFO;
				}
				P_main.LogMgr.debug(config, logType, msg);
			},

			__debugEnd : function() {
				this.debugging = false;
				this.__updateUI();
				this.traceKey = null;
			},

			__stopDebug : function(terminated) {
				this.__debugEnd();
				if (terminated) {
					this.__debugLog(null, P_basic.Res.debugTerminated);
				} else {
					this.__debugLog(null, P_basic.Res.debugExit);
				}
				this.__debugLog(P_main.LogType.END, null);
			},

			getXType : function() {
				return P_basic.DebugMgr.XTYPE;
			}
		});
P_basic.DebugMgr.XTYPE = "P_basic.DebugMgr";

P_basic.UploadFormMgr = Ext.extend(common.FormMgr, {
			constructor : function() {
				P_basic.UploadFormMgr.superclass.constructor.call(this);
			},

			getAddWinConfig : function() {
				return Ext.apply({
							title : P_basic.Res.upload + "-" + P_basic.Res.file,
							width : 430,
							height : 110
						}, this.__getUploadWinConfig());
			},

			__getUploadWinConfig : function() {
				return {};
			},

			__getUploadFieldConfigs : function() {
				return [{
							fieldLabel : P_basic.Res.file,
							name : ds.Common.IMPORT_FILE
						}];
			},

			__getSubmitConfig : function() {
				return null;
			},

			createWin : function(config) {
				return GuiUtil.createWin(Ext.apply({
							items : [this.createForm()]
						}, config));
			},

			__createUploadFields : function() {
				var cfgs = this.__getUploadFieldConfigs();
				var fs = [];
				for (var i = 0; i < cfgs.length; ++i) {
					fs.push(new Ext.ux.form.FileUploadField(Ext.apply({
								buttonText : "",
								buttonCfg : {
									iconCls : "upload"
								}
							}, cfgs[i])));
				}
				return fs;
			},

			createForm : function() {
				this.funcField = new Ext.form.TextField({
							name : "FUNC",
							hidden : true
						});
				this.paramsField = new Ext.form.TextField({
							name : "FUNC_PARAMS",
							hidden : true
						});
				this.uploadFields = this.__createUploadFields();
				this.form = GuiUtil.createForm({
							standardSubmit : true,
							fileUpload : true,
							labelWidth : 50,
							defaults : {
								width : 350
							},
							bodyStyle : {
								padding : "10px 0 0 0"
							},
							items : [this.funcField, this.paramsField]
									.concat(this.uploadFields)
						});
				return this.form;
			},

			__validate : function() {
				for (var i = 0; i < this.uploadFields.length; ++i) {
					if (this.uploadFields[i].getRawValue().length == 0) {
						P_main.LogMgr
								.warning(P_basic.Res.pleaseSelectFileFirst);
						return false;
					}
				}
				return true;
			},

			doAdd : function() {
				if (this.__validate()) {
					this.addWin.hide();
					P_main.lockUpload();
					this.submit.defer(500, this);
				}
			},

			submit : function() {
				var cfg = this.__getSubmitConfig();
				this.funcField.setValue(cfg.func);
				if (cfg.params) {
					for (var k in cfg.params) {
						var v = cfg.params[k];
						if (k == "CALLBACK_PARAMS") {
							v = Ext.encode(v);
						}
						this.data[k] = v;
					}
				}
				this.paramsField.setValue(Ext.encode(this.data));
				var form = this.form.getForm().getEl().dom;
				form.action = cfg.url || DataUrls.DATA_PROCESS;
				if (!form.target) {
					form.target = Utils.createSubmitFrame();
				}
				form.submit();
				this.cancelAdd();
			},

			cancelAdd : function() {
				for (var i = 0; i < this.uploadFields.length; ++i) {
					this.uploadFields[i].reset();
				}
				P_basic.UploadFormMgr.superclass.cancelAdd.call(this);
			},

			getXType : function() {
				return P_basic.UploadFormMgr.XTYPE;
			}
		});
P_basic.UploadFormMgr.XTYPE = "P_basic.UploadFormMgr";

P_basic.GraphCanvas = Ext.extend(Object, {
	constructor : function() {
		P_basic.GraphCanvas.superclass.constructor.call(this);
		this.arrowId = "arrow" + Utils.getId();
		this.connectionColor = "#929292";
		this.connectionStrokeWidth = 1;
	},

	setSize : function(w, h) {
		this.canvas.setSize(w, h);
	},

	render : function(pn) {
		this.canvas = Raphael(pn);
		var markerEl = Ext.get(Ext.DomHelper.append(this.canvas.defs, {
					tag : "marker"
				}));
		markerEl.set({
					id : this.arrowId,
					markerUnits : "strokeWidth",
					markerWidth : "12",
					markerHeight : "12",
					viewBox : "0 0 12 12",
					refX : "6",
					refY : "6",
					orient : "auto"
				});
		var pathEl = Ext.get(Ext.DomHelper.append(markerEl, {
					tag : "path"
				}));
		pathEl.set({
					d : "M2,2 L10,6 L2,10 L6,6 L2,2",
					fill : this.connectionColor
				});
		Raphael.fn.connection = this.__getConnectionFunc();
	},

	__getConnectionFunc : function() {
		var markerEnd = "url(#" + this.arrowId + ")";
		var connectionColor = this.connectionColor;
		return function(obj1, obj2, line, bg) {
			if (obj1.line && obj1.from && obj1.to) {
				line = obj1;
				obj1 = line.from;
				obj2 = line.to;
			}
			var bb1 = obj1.getBox(false, true);
			var bb2 = obj2.getBox(false, true);
			var p = [{
						x : bb1.x + bb1.width / 2,
						y : bb1.y - 1
					}, {
						x : bb1.x + bb1.width / 2,
						y : bb1.y + bb1.height + 1
					}, {
						x : bb1.x - 1,
						y : bb1.y + bb1.height / 2
					}, {
						x : bb1.x + bb1.width + 1,
						y : bb1.y + bb1.height / 2
					}, {
						x : bb2.x + bb2.width / 2,
						y : bb2.y - 1
					}, {
						x : bb2.x + bb2.width / 2,
						y : bb2.y + bb2.height + 1
					}, {
						x : bb2.x - 1,
						y : bb2.y + bb2.height / 2
					}, {
						x : bb2.x + bb2.width + 1,
						y : bb2.y + bb2.height / 2
					}];
			var d = {};
			var dis = [];
			for (var i = 0; i < 4; i++) {
				for (var j = 4; j < 8; j++) {
					var dx = Math.abs(p[i].x - p[j].x), dy = Math.abs(p[i].y
							- p[j].y);
					if ((i == j - 4)
							|| (((i != 3 && j != 6) || p[i].x < p[j].x)
									&& ((i != 2 && j != 7) || p[i].x > p[j].x)
									&& ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
						dis.push(dx + dy);
						d[dis[dis.length - 1]] = [i, j];
					}
				}
			}
			if (dis.length == 0) {
				var res = [0, 4];
			} else {
				res = d[Math.min.apply(Math, dis)];
			}
			var x1 = p[res[0]].x;
			var y1 = p[res[0]].y;
			var x4 = p[res[1]].x;
			var y4 = p[res[1]].y;
			dx = Math.max(Math.abs(x1 - x4) / 2, 10);
			dy = Math.max(Math.abs(y1 - y4) / 2, 10);
			var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3);
			var y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3);
			var x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3);
			var y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
			var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3,
					x4.toFixed(3), y4.toFixed(3)].join(",");
			if (line && line.line) {
				line.bg && line.bg.attr({
							path : path
						});
				line.line.attr({
							path : path
						});
				return line;
			} else {
				var color = typeof line == "string" ? line : "#000";
				var line = this.path(path).attr({
							stroke : connectionColor,
							fill : "none"
						});
				Ext.get(line.node).set({
							"marker-end" : markerEnd
						});
				return {
					line : line,
					from : obj1,
					to : obj2
				};
			}
		};
	},

	addConnection : function(source, target, line) {
		return this.canvas.connection(source, target, line);
	},

	remove : function() {
		this.canvas.remove();
	},

	getXType : function() {
		return P_basic.GraphCanvas.XTYPE;
	}
});
P_basic.GraphCanvas.XTYPE = "P_basic.GraphCanvas";
Ext.ns("P_console");

P_main.InitGroup.reg(function() {
			P_main.ConsoleTabMgr.getInstance().reg(new P_console.ConsoleMgr());
			P_main.ConsoleTabMgr.getInstance().reg(new P_console.DebugTabMgr());
		});

P_console.Res = Ext.apply({
			console : "控制台",
			debug : "调试"
		}, Resources);

P_console.DebugTabMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_console.DebugTabMgr.superclass.constructor.call(this);
				P_main.pipe.on(P_main.Event.DEBUG_LOG, this.__onDebugLog, this);
				P_main.pipe.on(P_main.Event.CLOSE_DEBUG, this.__onDebugClose,
						this);
				this.mgrs = [];
				this.count = 0;
			},

			__onDebugClose : function(key) {
				var mgr = this.__getMgr(key);
				if (mgr) {
					var idx = this.mgrs.indexOf(mgr);
					if (idx > -1) {
						this.mgrs.splice(idx, 1);
						this.content.remove(mgr.getContent(), true);
					}
				}
			},

			__getMgr : function(key) {
				for (var i = 0; i < this.mgrs.length; ++i) {
					var mgr = this.mgrs[i];
					if (mgr.getKey() == key) {
						return mgr;
					}
				}
				return null;
			},

			__onDebugLog : function(config, logType, msg) {
				var key = config.KEY;
				var title = config.TITLE;
				var renew = config.RENEW;
				var mgr = this.__getMgr(key);
				if (logType != P_main.LogType.END) {
					if (!mgr) {
						mgr = new P_console.DebugMgr();
						mgr.setKey(key);
						this.mgrs.push(mgr);
						this.content.add(mgr.getContent());
					}
					this.content.activate(mgr.getContent());
					if (!title) {
						if (!mgr.getTitle()) {
							mgr.setTitle(this.__createTitle());
						}
					} else {
						mgr.setTitle(title);
					}
					if (renew) {
						this.content.ownerCt.activate(this.content);
						mgr.clearTrace();
						mgr.reInit();
					}
					mgr.trace(logType, msg);
				}
			},

			__createTitle : function() {
				++this.count;
				return P_console.Res.debug + "-" + this.count;
			},

			getContent : function() {
				if (!this.content) {
					this.content = this.createContent();
				}
				return this.content;
			},

			createContent : function() {
				return new Ext.TabPanel({
							title : P_console.Res.debug,
							tabPosition : "bottom",
							activeTab : 0
						});
			},

			getXType : function() {
				return P_console.DebugTabMgr.XTYPE;
			}
		});
P_console.DebugTabMgr.XTYPE = "P_console.DebugTabMgr";

P_console.TraceMgr = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				P_console.TraceMgr.superclass.constructor.call(this);
				this.maxSize = 100;
			},

			__getContentDom : function() {
				if (!this.logDom) {
					this.logDom = Ext.DomHelper.createDom({
								tag : "div",
								cls : "consoleContent defaultText"
							});
					this.getContent().body.dom.appendChild(this.logDom);
				}
				return this.logDom;
			},

			__createContent : function(config) {
				return new Ext.Panel(Ext.apply({
							title : P_console.Res.console,
							bodyStyle : {
								"overflow-y" : "auto"
							}
						}, config || {}));
			},

			getContent : function() {
				if (!this.content) {
					this.content = this.__createContent();
				}
				return this.content;
			},

			__getClsAndTips : function(logType) {
				var cls = null;
				var html = null;
				switch (logType) {
					case P_main.LogType.INFO :
						cls = "msg-info";
						html = P_console.Res.info;
						break;
					case P_main.LogType.WARNING :
						cls = "msg-warning";
						html = P_console.Res.warning;
						break;
					case P_main.LogType.ERROR :
						cls = "msg-error";
						html = P_console.Res.error;
						break;
					default :
						throw new Error("Invalid log type: " + logType);
				}
				return [cls, html];
			},

			__createRowHeader : function(cls, html) {
				return {
					tag : "div",
					cls : cls,
					html : [html, " [",
							new Date().format(P_main.Env.DATE_FORMAT), "]:"]
							.join("")
				}
			},

			__createRowMsg : function(cls, msg) {
				return {
					tag : "div",
					cls : cls,
					html : msg.replace(/\n|\r/g, "<br/>")
				};
			},

			__createRowSep : function() {
				return {
					tag : "div",
					html : "&nbsp;"
				}
			},

			__createMsg : function(logType, msg) {
			},

			clearTrace : function() {
				if (this.logDom) {
					Utils.removeNode(this.logDom);
					this.logDom = null;
				}
			},

			keepSize : function() {
				var pn = this.__getContentDom();
				while (pn.childNodes.length > this.maxSize) {
					pn.removeChild(pn.firstChild);
				}
			},

			trace : function(logType, msg) {
				var cn = this.__createMsg(logType, Utils.encodeHTML(msg));
				var pn = this.__getContentDom();
				pn.appendChild(cn);
				this.keepSize();
				this.getContent().body.scroll("b", 1000);
			},

			getXType : function() {
				return P_console.TraceMgr.XTYPE;
			}
		});
P_console.TraceMgr.XTYPE = "P_console.TraceMgr";

P_console.ConsoleMgr = Ext.extend(P_console.TraceMgr, {
			constructor : function() {
				P_console.ConsoleMgr.superclass.constructor.call(this);
				P_main.pipe.on(P_main.Event.CONSOLE_LOG, this.__onConsoleLog,
						this);
			},

			__createMsg : function(logType, msg) {
				var o = this.__getClsAndTips(logType);
				var cls = o[0];
				var html = o[1];
				var rowHeader = this.__createRowHeader(cls, html);
				var rowMsg = this.__createRowMsg(cls, msg);
				var rowSep = this.__createRowSep();
				return Ext.DomHelper.createDom({
							tag : "div",
							children : [rowHeader, rowMsg, rowSep]
						});
			},

			__onConsoleLog : function(logType, msg) {
				if (this.getContent().rendered) {
					if (logType != P_main.LogType.END) {
						this.content.ownerCt.activate(this.content);
						this.trace(logType, msg);
					}
				} else {
					switch (logType) {
						case P_main.LogMgr.INFO :
							Utils.info(msg);
							break;
						case P_main.LogMgr.WARNING :
						case P_main.LogMgr.ERROR :
							Utils.error(msg);
							break;
					}
				}
			},

			__createContent : function() {
				return P_console.ConsoleMgr.superclass.__createContent.call(
						this, {
							tbar : this.__createTBar()
						});
			},

			__createTBar : function() {
				var trashBtn = common.ToolItem.createTrash({
							text : null,
							handler : this.__trash,
							scope : this
						});
				return [trashBtn];
			},

			__trash : function() {
				var pn = this.__getContentDom();
				while (pn.firstChild) {
					pn.removeChild(pn.firstChild);
				}
			},

			getXType : function() {
				return P_console.ConsoleMgr.XTYPE;
			}
		});
P_console.ConsoleMgr.XTYPE = "P_console.ConsoleMgr";

P_console.DebugMgr = Ext.extend(P_console.TraceMgr, {
			constructor : function() {
				P_console.DebugMgr.superclass.constructor.call(this);
				this.key = null;
				this.inited = false;
				this.title = null;
			},

			setTitle : function(v) {
				this.title = v;
				this.getContent().setTitle(this.title);
			},

			getTitle : function() {
				return this.title;
			},

			reInit : function() {
				this.inited = false;
			},

			setKey : function(key) {
				this.key = key;
			},

			getKey : function() {
				return this.key;
			},

			__createMsg : function(logType, msg) {
				var o = this.__getClsAndTips(logType);
				var cls = o[0];
				var html = o[1];
				var rowMsg = this.__createRowMsg(cls, msg);
				var cs = [];
				if (!this.inited) {
					this.clearTrace();
					var rowHeader = this.__createRowHeader(cls, html);
					cs.push(rowHeader);
					this.inited = true;
				}
				cs.push(rowMsg);
				if (cs.length > 1) {
					return Ext.DomHelper.createDom({
								tag : "div",
								children : cs
							});
				}
				return Ext.DomHelper.createDom(cs[0]);
			},

			getXType : function() {
				return P_console.DebugMgr.XTYPE;
			}
		});
P_console.DebugMgr.XTYPE = "P_console.DebugMgr";
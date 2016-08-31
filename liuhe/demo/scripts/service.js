Ext.ns("ws");

ws.Result = {
	STATE : "STATE",
	ERR_MSG : "ERR_MSG",
	CONTENT : "CONTENT"
};

ws.ResultState = {
	ERROR : 0,
	SUCCESS : 1,
	LOGIN : 2,
	INFO : 3
};

ws.ServiceClass = Ext.extend(Ext.util.Observable, {
			constructor : function() {
				ws.ServiceClass.superclass.constructor.call(this);
			},

			getLoginMgr : function() {
				if (!this.loginMgr) {
					this.loginMgr = new common.OfflineLoginMgr();
				}
				return this.loginMgr;
			},

			req : function(url, params, successFn, scope, others) {
				Ext.Ajax.request({
							url : url,
							success : successFn,
							failure : function() {
								Utils.handleFail(Resources.ajaxFailure);
							},
							scope : scope,
							params : params,
							others : others,
							timeout : 300000
						});
			},

			parseResult : function(res) {
				return this.parseResultMsg(res.responseText);
			},

			parseResultMsg : function(msg) {
				var result = eval("[" + msg + "][0]");
				var state = result[ws.Result.STATE];
				if (state == ws.ResultState.ERROR
						|| state == ws.ResultState.LOGIN) {
					this.logError(result[ws.Result.ERR_MSG]);
					if (state == ws.ResultState.LOGIN) {
						this.getLoginMgr().show();
					}
					return null;
				} else if (state == ws.ResultState.INFO) {
					var msg = result[ws.Result.ERR_MSG];
					if (!Utils.isBlank(msg)) {
						this.logInfo(msg);
					}
				}
				return result;
			},

			getRSContent : function(res) {
				var r = this.parseResult(res);
				if (r) {
					return r[ws.Result.CONTENT];
				}
				return null;
			},

			logInfo : function(msg) {
				Utils.info(Resources.info + ": " + msg);
			},

			logError : function(msg) {
				Utils.error(Resources.error + ": " + msg, true);
			},

			getXType : function() {
				return ws.ServiceClass.XTYPE;
			}
		});
ws.ServiceClass.XTYPE = "ws.ServiceClass";

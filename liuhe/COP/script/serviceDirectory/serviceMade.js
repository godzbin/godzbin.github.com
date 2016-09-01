/**
 *	creator godz
 *
 * 	2016 08 23
 *	服务定制
 * 
 */

function ServiceMade(parentNode) {
	Page.call(this, Configes.page.serviceMade);
	this._parentNode = parentNode;
	// 基础配置
	this.msg = new function() {
		this.treeTitle = "服务目录";
		this.type = new function() {
			this.server = "server";
			this.scene = "scene";
		};
		this.editTypeToAdd = "editTypeToAdd";
		this.editTypeToUpdate = "editTypeToUpdate";
	};
	// 初始化页面
	this.run = function(sceneId) {
		this.jumpSceneId = sceneId;
		if (!this.loading) {
			this.initView();
			this.getSelfInfo();
		}
		this.loading = true;
		this.mainPanelShow();

		if (this.jumpSceneId) {
			this.selectSceneNode(this.jumpSceneId);
			this.jumpSceneId = null;
		}
	};
	this.initView = function() {
		this.mainTreePanel.add([this.treeTitlePanel, this.treePanel]);
		this.viewPanel.add(this.mainTreePanel, this.centerPanel);
		this.centerPanel.hide();
		var mainPanel = this.getMainPanel();
		mainPanel.add(this.viewPanel);
	};


	/**
	 *
	 *
	 *	ctrl 控制 =================================================================
	 * 
	 */
	this.openCenterPanel = function(tree, record, ele, id, e) {
		this.initCenterPanel();
		this.centerPanel.hide();
		if (!record.isLeaf()) {
			return;
		}
		this.sceneId = record.data.nodeData["_id"];

		var sceneId = record.data.nodeData["_id"];
		var sceneName = record.data.nodeData["name"];
		var serviceName = record.parentNode.data.nodeData["name"];

		// 标题
		var titlePanel = this.centerTitlePanel.getComponent(0);
		var serviceNamePanel = titlePanel.getComponent(0);
		var sceneNamePanel = titlePanel.getComponent(2);
		serviceNamePanel.setText(serviceName);
		sceneNamePanel.setText(sceneName);


		this.getScene(sceneId);
		this.getServiceingOrder(sceneId);
		this.centerPanel.show();
	};


	this.setSceneOver = function(sceneId) {
		var sceneNode = this.getSceneNodeById(sceneId);
		var that = this;
		if (sceneNode.data.nodeData.edit) {
			Ext.Msg.show({
				title: "提示",
				modal: false,
				msg: "存在未提交的编辑服务内容，是否继续上次编辑内容?",
				buttonText: {
					yes: "继续编辑",
					no: "重新编辑"
				},
				fn: function(btn) {
					if (btn === "yes") {
						that.getSaveSceneOrder(sceneId);
						return;
					} else {
						return;
					}
				}
			});
		}
	};

	this.getSceneNodeById = function(sceneId) {
		var root = this.treeRoot.getRoot();
		var sceneNode;
		root.eachChild(function(node) {
			node.eachChild(function(childNode) {
				if (childNode.data.nodeData._id == sceneId) {
					sceneNode = childNode;
				}
			}, this);
		}, this);
		return sceneNode;
	};


	this.initCenterPanel = function() {
		this.centerFormPanel.getForm().reset();
		Ext.tip.QuickTipManager.init();
		this.alarmServiceBtnPanel.getComponent(0).setIcon("resources/images/-.png");
		this.monitorBtnPanel.getComponent(0).setIcon("resources/images/-.png");
		this.faultServiceBtnPanel.getComponent(0).setIcon("resources/images/-.png");
		this.dataServiceBtnPanel.getComponent(0).setIcon("resources/images/-.png");
		this.monitorFormPanel.show();
		this.alarmServiceFormPanel.show();
		this.faultServiceFormPanel.show();
		this.dataServiceFormPanel.show();

		this.initAlarmConfigPanel();
	};
	this.searchScene = function(input, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			var value = input.getValue();
			var root = this.treeRoot.getRoot();
			var sceneNode;
			root.eachChild(function(node) {
				if (node.data.nodeData["name"] == value) {
					this.treePanel.getSelectionModel().select(node);
				} else {
					node.eachChild(function(childNode) {
						if (childNode.data.nodeData["name"] == value) {
							this.treePanel.getSelectionModel().select(childNode);
							sceneNode = childNode;
						}
					}, this);
				}

			}, this);
			sceneNode && this.openCenterPanel(this.treePanel, sceneNode);
		}
	};
	// 设置草稿内容
	this.setSaveSceneOrderData = function(data) {
		var form = this.centerFormPanel.getForm();
		form.setValues(data);


		var rateAlarmConfig = data["rateAlarmConfig"];
		var amountAlarmConfig = data["amountAlarmConfig"];
		var durationAlarmConfig = data["durationAlarmConfig"];
		rateAlarmConfig && this.setAlarmConfigData(this.rateAlarmConfigGridStore, rateAlarmConfig);
		amountAlarmConfig && this.setAlarmConfigData(this.amountAlarmConfigGridStore, amountAlarmConfig);
		durationAlarmConfig && this.setAlarmConfigData(this.durationAlarmConfigGridStore, durationAlarmConfig);
	};
	this.setAlarmConfigData = function(store, data) {
		for (var i = 0, l = data.length; i < l; i++) {
			store.data.each(function(record) {
				var id = record.get("ID");
				if (id == data[i]["ID"]) {
					record.set("SELECE", data[i]["SELECE"]);
					record.set("SELECE_TIME", data[i]["SELECE_TIME"]);
					record.set("SELECE_TIME_OTHER", data[i]["SELECE_TIME_OTHER"]);
					record.set("SELECE_THRESHOLD", data[i]["SELECE_THRESHOLD"]);
				}
			});
		}

	}

	// 对打开的场景的设置
	this.channelBox = function(data) {
		var fieldcontainer = this.monitorChannelPanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.probeBox = function(data) {
		var fieldcontainer = this.monitorProbePanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.businessBox = function(data) {
		var fieldcontainer = this.monitorBusinessPanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.probeFrequencyBox = function(data) {
		var fieldcontainer = this.monitorProbeFrequencyPanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.targetBox = function(data) {
		var fieldcontainer = this.monitorTargetPanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
				listeners: {
					change: Ext.bind(this.targetChange, this)
				}
			}
			radiofields.push(radiofield);
		}
		fieldcontainer.add(radiofields);
	};
	this.alarmBox = function(data, allData) {
		var fieldcontainer = this.alarmTypePanel.getComponent(1);
		fieldcontainer.removeAll();
		var radiofields = new Array();
		for (var i = 0, l = data.length; i < l; i++) {
			var radiofield = {
				boxLabel: data[i],
				inputValue: data[i],
				boxLabelCls: "radioLabel",
				disabled: true
			}
			radiofields.push(radiofield);
			if (data[i] == "成功率") {
				this.alarmConfigPanel.add(this.rateAlarmConfigGridPanel);
				this.rateAlarmConfigGridStore.loadData(allData["rateAlarmConfig"]);
			} else if (data[i] == "交易量") {
				this.alarmConfigPanel.add(this.amountAlarmConfigGridPanel);
				this.amountAlarmConfigGridStore.loadData(allData["amountAlarmConfig"]);
			} else if (data[i] == "响应时间") {
				this.alarmConfigPanel.add(this.durationAlarmConfigGridPanel);
				this.durationAlarmConfigGridStore.loadData(allData["durationAlarmConfig"]);
			}
		}
		fieldcontainer.add(radiofields);
		var panel = this.alarmConfigPanel.getComponent(0);
		panel && this.alarmConfigPanel.setActiveTab(panel);
	};
	// 初始化告警配置
	this.initAlarmConfigPanel = function() {
		this.alarmConfigPanel.removeAll(true);
		this.rateAlarmConfigGridStore.loadData([]);
		this.amountAlarmConfigGridStore.loadData([]);
		this.durationAlarmConfigGridStore.loadData([]);
		this.createRateAlarmConfigGridPanel();
		this.createAmountAlarmConfigGridPanel();
		this.createDurationAlarmConfigGridPanel();
	};
	// 告警推送的显示
	this.alarmPushBox = function(isShow, data) {
		var fieldcontainer = this.alarmPushModePanel.getComponent(1);
		fieldcontainer.removeAll();
		if (isShow) {
			this.alarmPushPanel.show();
			this.alarmPushModePanel.show();

			var items = [];
			for (var i = 0, l = data.length; i < l; i++) {
				if (data[i] == "短信") {
					items.push({
						boxLabel: "短信",
						inputValue: "短信",
						name: "alarmPushMode",
						boxLabelCls: "radioLabel",
					});
					items.push({
						width: 250,
						xtype: "textfield",
						fieldLabel: "号码",
						margin: "10",
						labelWidth: 50,
						name: "alarmPushModeToPhone",
						cls: "centerFormPanelInput",
						labelStyle: "color: #ddd; font-size: 14px; "
					})
				}

				if (data[i] == "邮件") {
					items.push({
						boxLabel: "邮件",
						inputValue: "邮件",
						name: "alarmPushMode",
						boxLabelCls: "radioLabel",
					});
					items.push({
						width: 250,
						xtype: "textfield",
						fieldLabel: "邮箱",
						margin: "10",
						name: "alarmPushModeToEmail",
						cls: "centerFormPanelInput",
						labelWidth: 50,
						labelStyle: "color: #ddd; font-size: 14px;"
					})
				}
			}

			fieldcontainer.add(items);
		} else {
			this.alarmPushPanel.hide();
			this.alarmPushModePanel.hide();
		}
	};
	// 点击按钮控制配置窗口的显示
	this.configFormPanelShow = function(btn) {
		if (btn.formPanel.isHidden()) {
			btn.formPanel.show();
			btn.setIcon("resources/images/-.png");
		} else {
			btn.formPanel.hide();
			btn.setIcon("resources/images/+.png");
		}
	};
	// 业务的全选
	this.businessSelect = function(checkbox) {
		var value = checkbox.getValue();
		var items = this.monitorBusinessPanel.getComponent(1).items;
		items.each(function(box) {
			box.setValue(value);
		});
	};
	// 搜索业务
	this.searchBusiness = function(textfield, e) {
		if (e.getKey() == Ext.EventObject.ENTER) {
			var value = textfield.getValue();
			var panel = this.monitorBusinessPanel.getComponent(1)
			var items = panel.items;
			items.each(function(checkbox) {
				if (checkbox.boxLabel == value) {
					var x = checkbox.getPosition()[0];
					var y = checkbox.getPosition()[1];
					panel.scrollBy(x, y, true);
					checkbox.setValue(true);
				}
			}, this);
		}
	};


	this.getCurrentSceneValues = function() {
		var form = this.centerFormPanel.getForm();
		var values = form.getValues();

		if (this.currentSceneId) {
			values["sceneId"] = this.currentSceneId;
		}
		var rateAlarmConfig = this.getAlarmConfigData(this.rateAlarmConfigGridStore);
		var amountAlarmConfig = this.getAlarmConfigData(this.amountAlarmConfigGridStore);
		var durationAlarmConfig = this.getAlarmConfigData(this.durationAlarmConfigGridStore);
		values["rateAlarmConfig"] = rateAlarmConfig;
		values["amountAlarmConfig"] = amountAlarmConfig;
		values["durationAlarmConfig"] = durationAlarmConfig;

		if (!this.isBlank(values)) {
			return false;
		}
		return values;
	};


	// 判断是否为空
	this.isBlank = function(values) {

		if (!values["channel"]) {
			tools.toast("请选择渠道");
			return null;
		}
		if (!values["probe"]) {
			tools.toast("请选择探测方式");
			return null;
		}
		if (!values["probeFrequency"]) {
			tools.toast("请选择探测频率");
			return null;
		}
		if (!values["business"]) {
			tools.toast("请选择业务");
			return null;
		}
		if (!values["target"]) {
			tools.toast("请选择指标");
			return null;
		}
		// 告警配置
		if (values["alarmType"]) {

			// 判断阈值
			// 
			var result = true;
			if (typeof values["alarmType"] == "object") {
				for (var i = 0, l = values["alarmType"].length; i < l; i++) {
					var value = values["alarmType"][i];
					result = result && this.isThresholdValueLimit(values, value);
				}
			} else {
				var value = values["alarmType"];
				result = this.isThresholdValueLimit(values, value);
			}
			if (!result) {
				return null;
			}

			if (values["alarmPush"]) {
				if (!values["alarmPushMode"]) {
					tools.toast("请选择告警推送方式");
				}
				return null;
			}
		}

		if (values["probeData"]) {
			if (!values["probeDataHost"]) {
				tools.toast("探测明细数据接口地址不能为空");
				return null;
			}
			if (!values["probeDataPort"]) {
				tools.toast("探测明细数据端口不能为空");
				return null;
			}
			if (!values["transmissionFrequency"]) {
				tools.toast("探测明细数据传输频率不能为空");
				return null;
			}
			if (!values["dataFile"]) {
				tools.toast("探测明细数据数据文件不能为空");
				return null;
			}
		}
		if (values["statisticalData"]) {
			if (!values["statisticalHost"]) {
				tools.toast("数据统计接口地址不能为空");
				return null;
			}
			if (!values["statisticalPort"]) {
				tools.toast("数据统计端口不能为空");
				return null;
			}
			if (!values["statisticalTarget"]) {
				tools.toast("数据统计指标不能为空");
				return null;
			}
			if (!values["statisticalGranularity"]) {
				tools.toast("数据统计粒度不能为空");
				return null;
			}
			if (!values["statisticalTransmissionFrequency"]) {
				tools.toast("数据统计频率不能为空");
				return null;
			}
		}
		return true;
	};


	// 阈值限制
	this.isThresholdValueLimit = function(values, value) {
		var result = true;
		var rateAlarmConfig = values["rateAlarmConfig"];
		var amountAlarmConfig = values["amountAlarmConfig"];
		var durationAlarmConfig = values["durationAlarmConfig"];
		if (value == "成功率") {
			result = this.selectIsBlank(rateAlarmConfig) && this.selectTimeIsBlank(rateAlarmConfig) && this.thresholdValueLimit(rateAlarmConfig);
		} else if (value == "交易量") {
			result = this.selectIsBlank(amountAlarmConfig) && this.selectTimeIsBlank(amountAlarmConfig) && this.thresholdValueLimit(amountAlarmConfig);
		} else if (value == "响应时长") {
			result = this.selectIsBlank(durationAlarmConfig) && this.selectTimeIsBlank(durationAlarmConfig) && this.thresholdValueLimit(durationAlarmConfig);
		}
		return result;
	};
	//  告警选择是否为空
	this.selectIsBlank = function(alarmConfig) {
		var result = true;
		for (var i = 0, l = alarmConfig.length; i < l; i++) {
			result = result || alarmConfig[i]["SELECE"];
		}
		if (!result) {
			tools.toast("告警配置不能为空");
		}
		return result;
	};
	//  
	this.selectTimeIsBlank = function(alarmConfig) {
		var result = true;
		for (var i = 0, l = alarmConfig.length; i < l; i++) {
			if (alarmConfig["SELECE"]) {
				if (alarmConfig["SELECE_TIME"]) {
					if (alarmConfig["SELECE_TIME"] == "其他") {
						if (alarmConfig["SELECE_TIME_OTHER"]) {
							result = false;
						}
					}
				} else {
					result = false;
				}
			}
		}
		if (!result) {
			tools.toast("告警配置不能为空");
		}
		return result;
	};
	// 阈值限制判断
	this.thresholdValueLimit = function(alarmConfig) {
		for (var i = 0, l = alarmConfig.length; i < l; i++) {
			var level = alarmConfig[i]["NAME"];
			var name = alarmConfig[i]["TYPE"];
			var condition = alarmConfig[i]["CONDITION"];
			var select = alarmConfig[i]["SELECE"];
			var threshold = alarmConfig[i]["SELECE_THRESHOLD"];
			var minThreshold = alarmConfig[i]["THRESHOLD"];
			var nextThreshold;
			if (select) {
				if (alarmConfig[i + 1]) {
					nextThreshold = alarmConfig[i + 1]["THRESHOLD_SELECT"];
				}
				if (threshold < minThreshold) {
					tools.toast(name + "的级别：" + level + "阈值不能小于最低阈值");
					return false;
				}

				if (!threshold) {
					tools.toast(name + "的级别：" + level + "告警配置不能为空");
					return false;
				}
				if (nextThreshold) {
					if (condition == "小于") {
						if (threshold < nextThreshold) {
							// tools.toast(name + "的级别：" + level + "不能" + condition + "它的下一级别");
							tools.toast("高级别告警的阀值必须比较低级别告警的阀值更严格，请重新配置告警");
							return false;
						}
					} else if (condition == "大于") {
						if (threshold > nextThreshold) {
							// tools.toast(name + "的级别：" + level + "不能" + condition + "它的下一级别");
							tools.toast("高级别告警的阀值必须比较低级别告警的阀值更严格，请重新配置告警");
							return false;
						}
					}
				}
			}
		}
		return true;
	};
	// 获取告警配置数据
	this.getAlarmConfigData = function(store) {
		var items = store.data;
		var data = new Array();
		items.each(function(record) {
			data.push(record.data);
		});
		return data;
	};

	// 保存前
	this.saveOrderBefor = function() {
		var values = this.getCurrentSceneValues();
		this.saveOrder(values);
	};

	// 提交前
	this.submitOrderBefor = function() {
		var values = this.getCurrentSceneValues();
		this.submitOrder(values);
	};

	// 指标关联告警类型
	this.targetChange = function(checkbox) {
		var value = checkbox.inputValue;
		var check = checkbox.getValue();
		var items = this.alarmTypePanel.getComponent(1).items;
		items.each(function(panel) {
			if (panel.inputValue == value) {
				panel.setDisabled(!check);
				!check && panel.setValue(check);
			}
		})

	};
	this.submitOver = function() {
		var sceneId = this.sceneId;
		var sceneNode = this.getSceneNodeById(sceneId);
		var form = this.centerFormPanel.getForm();
		var values = form.getValues();
		if (values["submitOver"]) {
			this.openCenterPanel(this, sceneNode);
		} else {
			this._parentNode.openContent(Configes.page.myOrder, sceneId);
		}
	};
	// 保存订单
	this.saveOrder = function(values) {
		tools.getData(Configes.url.saveOrder, values, this.saveOrderReturn, this);
	};
	this.saveOrderReturn = function(data, that) {
		var sceneId = that.sceneId;
		var sceneNode = that.getSceneNodeById(sceneId);
		sceneNode.data.nodeData.edit = 0;
		this.openCenterPanel(that, sceneNode);
		tools.toast("保存成功");
	};

	//  提交订单
	this.submitOrder = function(values) {
		tools.getData(Configes.url.submitOrder, values, this.submitOrderReturn, this);
	};

	this.submitOrderReturn = function(data, that) {
		var sceneId = that.sceneId;
		that.removeSaveOrder(sceneId);
		tools.toast("提交成功");
		that.submitOver();
	};
	// 移除保存的数据
	this.removeSaveOrder = function(sceneId) {
		var params = {
			sceneId: sceneId
		}
		tools.getData(Configes.url.removeSaveOrder, params, this.removeSaveOrderReturn, this);
	};
	this.removeSaveOrderReturn = function(data, that) {
		// 移除成功
	};
	/**
	 *
	 *
	 *	model 数据加载模块=============================================================
	 *
	 *
	 * 
	 */

	// 加载个人信息
	this.getSelfInfo = function() {
		tools.getData(Configes.url.view_getSelfInfo, null, this.setSelfInfo, this);
	};
	this.setSelfInfo = function(data, that) {
		that.userInfo = data;
		that.getServerList();
	};

	// 加载服务类列表
	this.getServerList = function() {
		tools.getData(Configes.url.getServerList, null, this.setServerList, this);
	};
	this.setServerList = function(data, that) {
		var treeData = [];
		var root = that.treeRoot.getRoot();
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				expanded: true,
				text: data[i]["name"],
				iconCls: "i",
				leaf: false,
				isLoad: false,
				nodeData: data[i],
				type: that.msg.type.server,
				cls: "serviceDirectoryTreeType",
				children: []
			}
			treeData.push(treeNode);
			var node = root.appendChild(treeNode);
			that.getSceneList(node);
		}
	};

	// 加载场景列表
	this.getSceneList = function(node) {
		var callbackParams = {
			that: this,
			node: node
		}
		var params = {
			serviceId: node.data.nodeData._id
		}
		tools.getData(Configes.url.getSceneList + node.data.nodeData._id, params, this.setSceneList, callbackParams);
	};
	this.setSceneList = function(data, params) {
		var treeData = [];
		var that = params.that;
		var node = params.node;
		for (var i = 0, l = data.length; i < l; i++) {
			var treeNode = {
				text: data[i]["name"],
				iconCls: "i",
				leaf: true,
				type: that.msg.type.scene,
				cls: "serviceDirectoryTreeScene",
				nodeData: data[i]
			}
			treeData.push(treeNode);
		};
		node.removeAll();
		node.appendChild(treeData);
		node.data.isLoad = true;


		if (that.jumpSceneId) {
			var isOpen = that.selectSceneNode(that.jumpSceneId);
			isOpen && (that.jumpSceneId = null)
		}
	};
	this.selectSceneNode = function(senceId) {
		var root = this.treeRoot.getRoot();
		var sceneNode;
		root.eachChild(function(node) {
			node.eachChild(function(childNode) {
				if (childNode.data.nodeData["_id"] == senceId) {
					this.treePanel.getSelectionModel().select(childNode);
					sceneNode = childNode;
				}
			}, this);
		}, this);
		sceneNode && this.openCenterPanel(null,sceneNode);
		return sceneNode;
	};

	// 加载场景列表
	this.getScene = function(sceneId) {
		var params = {
			sceneId: sceneId
		};
		var callbackParams = {
			that: this,
			sceneId: sceneId
		}
		tools.getData(Configes.url.getScene, null, this.setScene, callbackParams);
	};
	this.setScene = function(data, callbackParams) {
		var that = callbackParams.that;
		var sceneId = callbackParams.sceneId;
		that.channelBox(data["channel"]);
		that.probeBox(data["probe"]);
		that.probeFrequencyBox(data["probeFrequency"]);
		that.businessBox(data["business"]);
		that.targetBox(data["target"]);
		that.alarmBox(data["alarmType"], data);
		that.alarmPushBox(data["alarmPush"], data["alarmPushMode"]);

		that.setSceneOver(sceneId);
	};
	// 获取用户草稿
	this.getSaveSceneOrder = function(sceneId) {
		var params = {
			sceneId: sceneId
		}
		tools.getData(Configes.url.getSaveSceneOrder, params, this.setSaveSceneOrder, this);
	};
	this.setSaveSceneOrder = function(data, that) {
		that.setSaveSceneOrderData(data);
	};

	this.getServiceingOrder = function(sceneId) {
		var params = {
			sceneId: sceneId
		}
		tools.getData(Configes.url.getServiceingOrder, params, this.setServiceingOrder, this);
	};
	this.setServiceingOrder = function(data, that) {
		var form = that.centerFormPanel.getForm();
		data && form.setValues({
			serviceing: data
		});
	};
	/**
	 *
	 *
	 * 
	 *
	 *	Store ======================================================
	 *
	 *
	 * 
	 * 
	 */
	this.treeRoot = Ext.create("Ext.data.TreeStore", {
		root: {
			expanded: true,
			cls: "serviceDirectoryTreeRoot"
		}
	});
	Ext.define('serviceDirectory.AlarmConfig', {
		extend: 'Ext.data.Model',
		fields: ["NAME", "TYPE", "CONDITION", "THRESHOLD", "SELECE_THRESHOLD", "TIME", "SELECE_TIME", "SELECE_TIME_OTHER", "SELECE"]
	});
	this.rateAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "serviceDirectory.AlarmConfig",
	});
	this.amountAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "serviceDirectory.AlarmConfig",
	});
	this.durationAlarmConfigGridStore = Ext.create("Ext.data.Store", {
		clearRemovedOnLoad: true,
		model: "serviceDirectory.AlarmConfig",
	});
	/**
	 *
	 * view  ===============================================================
	 * 
	 */

	// 主容器
	this.viewPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "column",
		cls: "serviceDirectoryMainPanel"
	});
	// 服务目录树主容器
	this.mainTreePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 1 / 5,
		margin: 5,
	});
	// 服务目录标题
	this.treeTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		width: "100%",
		// height: 50,
		// layout: "border",
		items: [{
			region: "west",
			xtype: "label",
			text: "服务目录",
			style: {
				fontSize: "20px",
				color: "#fff",
				lineHeight: "30px"
			}
		}, {
			// region: "east",

			height: 30,
			margin: "5 0",
			border: 0,
			xtype: "panel",
			items: [{
				width: "100%",
				xtype: "textfield",
				cls: "centerFormPanelInput searchInput",
				listeners: {
					specialKey: Ext.bind(this.searchScene, this)
				}
			}]

		}]
	});
	// 服务目录树
	this.treePanel = Ext.create("Ext.tree.Panel", {
		store: this.treeRoot,
		rootVisible: false,
		border: 0,
		cls: "serviceDirectoryTreePanel",
		listeners: {
			itemdblclick: Ext.bind(this.openCenterPanel, this)
		}
	});



	// 查看 标题
	this.centerTitlePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "border",
		height: 35,
		defaults: {
			style: {
				fontSize: "20px",
				color: "#fff",
				lineHeight: "30px",
				margin: "0 5px",
				border: 0,
			}
		},
		items: [{
			xtype: "panel",
			defaults: {
				style: {
					fontSize: "20px",
					color: "#fff",
					lineHeight: "30px",
					margin: "0 5px",
					border: 0,
				}
			},
			items: [{
				xtype: "label",
				text: ""
			}, {
				xtype: "label",
				text: ">>"
			}, {
				xtype: "label",
				text: ""
			}, ]
		}]
	});


	this.serviceingPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		width: "100%",
		cls: "centerFormPanel",
		items: [{
			xtype: "panel",
			layout: "border",
			height: 35,
			// layout: "column",
			width: "100%",
			defaults: {
				height: 35,
			},
			items: [{
				width: 100,
				region: "west",
				xtype: "panel",
				border: 0,
				items: [{
					xtype: "label",
					text: "已定制的服务：",
					style: "color: #fff; font-size: 14px; line-height: 35px;",
					margin: "5 0"
				}]
			}, {
				// width: 300,
				region: "east",
				xtype: "panel",
				layout: "hbox",
				border: 0,
				items: [{
					xtype: "button",
					// baseCls: "x-btn base-btn",
					// width: 100,
					text: "查看服务",
					height: 25
				}],
			}]
		}, {
			xtype: "textareafield",
			width: "100%",
			height: 50,
			readOnly: true,
			labelWidth: 50,
			name: "serviceing",
			cls: "centerFormPanelInput",
			labelStyle: "color: #ddd; font-size: 14px; "
		}]
	});

	//  监控 渠道
	this.monitorChannelPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "渠道 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "channel",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});
	// 监控 探测方式
	this.monitorProbePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "探测方式 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "probe",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});
	// 监控 业务
	this.monitorBusinessPanel = Ext.create("Ext.panel.Panel", {
		xtype: "panel",
		layout: "vbox",
		items: [{
			xtype: "panel",
			layout: "border",
			height: 35,
			// layout: "column",
			width: "100%",
			defaults: {
				height: 35,
			},
			items: [{
				width: 100,
				region: "west",
				xtype: "panel",
				border: 0,
				items: [{
					xtype: "label",
					text: "* 业务",
					style: "color: #fff; font-size: 14px; line-height: 35px;",
					margin: "5 0"
				}]
			}, {
				// width: 300,
				region: "east",
				xtype: "panel",
				layout: "hbox",
				border: 0,
				items: [{
					xtype: "checkboxfield",
					// width: 100,
					boxLabel: "全选",
					height: 35,
					inputValue: "1",
					boxLabelCls: "radioLabel",
					margin: "5 10",
					listeners: {
						change: Ext.bind(this.businessSelect, this)
					}
				}, {
					xtype: "textfield",
					margin: "5 0",
					// fieldLabel: "搜索",
					// labelWidth: 50,
					labelStyle: "color: #ddd; font-size: 14px; line-height: 24px;",
					cls: "centerFormPanelInput searchInput",
					listeners: {
						specialKey: Ext.bind(this.searchBusiness, this)
					}
				}],
			}]
		}, {
			xtype: 'fieldcontainer',
			border: 0,
			height: 100,
			autoScroll: true,
			defaultType: "checkboxfield",
			cls: "serviceDirectoryManageFormCheckbox",
			defaults: {
				name: "business",
				margin: "0 10",
			},
			width: "100%",
			layout: 'column',
		}]
	});
	//  指标
	this.monitorTargetPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "指标 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "checkboxfield",
			defaults: {
				name: "target",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});
	// 探测频率
	this.monitorProbeFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "探测频率 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "probeFrequency",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});
	//  监控服务
	this.monitorFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		items: [
			this.monitorChannelPanel,
			this.monitorProbePanel,
			this.monitorBusinessPanel,
			this.monitorTargetPanel,
			this.monitorProbeFrequencyPanel
		]
	});
	this.monitorBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			formPanel: this.monitorFormPanel,
			margin: "5",
			xtype: "button",
			text: "监控定制",
			baseCls: "x-btn base-btn",
			icon: "resources/images/-.png",
			style: "background: none;border: 0px;",
			handler: Ext.bind(this.configFormPanelShow, this)
		}],
	});
	this.monitorPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.monitorBtnPanel,
			this.monitorFormPanel
		]
	});



	//  监控服务end
	//  
	// 告警服务 -----------------------------------
	this.alarmTimeChange = function() {
		var grid = this.rateAlarmConfigGridPanel;
		var record = grid.getSelectionModel().getSelection();
		var id = record[0].data.ID;
		var checkboxs = document.getElementsByClassName("RATE_TIME" + id);
		var others = document.getElementsByClassName("RATE_TIME_OTHER" + id);
		var value = "";
		for (var i = 0, l = checkboxs.length; i < l; i++) {
			if (checkboxs[i].checked) {
				value = checkboxs[i].value;
			}
		}
		record[0].set("SELECE_TIME", value);
		if (value == "其他") {
			var otherValue = others[0].value;
			record[0].set("SELECE_TIME_OTHER", otherValue || "");
		}
	};
	this.columns = {
		defaults: {
			menuDisabled: true,
			draggable: false,
			sortable: false,
		},
		items: [{
			dataIndex: "SELECE",
			width: 35,
			renderer: function(value, column) {
				var checkbox = "";
				value && (checkbox = "checked");
				var html = '<input type="checkbox" ' + checkbox + ' name="rate" value="' + value + '">'
				return html;
			},
			listeners: {
				click: {
					fn: function() {
						var grid = this.rateAlarmConfigGridPanel;
						var records = grid.getSelectionModel().getSelection();
						if (records.length) {
							var SELECE = records[0].get("SELECE");
							records[0].set("SELECE", !SELECE);
						}
					},
					scope: this
				}
			}
		}, {
			dataIndex: "NAME",
			text: "告警级别",
		}, {
			dataIndex: "TYPE",
			text: "指标",
		}, {
			dataIndex: "CONDITION",
			text: "条件",

		}, {
			dataIndex: "THRESHOLD",
			text: "最低阈值",
			renderer: function(value, column) {
				var type = column.record.get("TYPE");
				var a = "";
				if (type == "成功率") {
					a = "%";
				} else if (type == "响应时长") {
					a = "s";
				}
				value = value || 0;
				value = value + a;
				return value;
			},
		}, {
			dataIndex: "SELECE_THRESHOLD",
			text: "阈值",
			renderer: function(value, column) {
				var type = column.record.get("TYPE");
				var threshold = column.record.get("THRESHOLD");
				var a = "";
				if (type == "成功率") {
					if (value < threshold && value > 100) {
						value = threshol;
					}
					a = "%";
				} else if (type == "响应时长") {
					if (value < threshold) {
						value = threshold;
					}
					a = "s";
				} else if (type == "交易量") {
					if (value < threshold) {
						value = threshold;
					}
				}
				value = value || 0;
				value = value + a;
				return value;
			},
			editor: {
				xtype: 'numberfield',
				keyNavEnabled: false,
				// maxValue: 99,
				// minValue: 0
			}
		}, {
			dataIndex: "TIME",
			text: "持续时间",
			width: 300,
			maxWidth: 400,
			renderer: function(value, column) {
				var checkboxs = [];
				var selectValue = column.record.get("SELECE_TIME");
				var type = column.record.get("TYPE");
				for (var i = 0, l = value.length; i < l; i++) {
					var checked = "";
					if (value[i] == "其他") {
						var otherValue = "";
						if (selectValue == "其他") {
							otherValue = column.record.get("SELECE_TIME_OTHER") || "";
						}
						name = "<input type='text' style='width:100px;' placeholder='其他' " +
							" class = 'RATE_TIME_OTHER" +
							column.record.data.ID +
							"' value='" + otherValue + "' >";
					} else {
						name = value[i];
					}
					if (value[i] == selectValue) {
						checked = "checked";
					}
					var checkbox = "<laebl style='margin:0 5px;'>" +
						"<input type='radio' class='RATE_TIME" +
						column.record.data.ID + "'" +
						checked +
						"  name='time" + type + column.record.data.ID + "'  value='" +
						value[i] + "' >" + name + " </laebl>"
					checkboxs.push(checkbox);
				}
				var html = "<div class='centerFormPanelInput'>" + checkboxs.join("") + "</div>";
				return html;
			},
			listeners: {
				click: Ext.bind(this.alarmTimeChange, this),
				blur: Ext.bind(this.alarmTimeChange, this)
			}
		}]
	};

	this.createRateAlarmConfigGridPanel = function() {
		this.rateAlarmConfigGridPanel && this.rateAlarmConfigGridPanel.remove();
		this.rateAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "成功率告警",
			disable: true,
			cls: "alarmConfigTabGridPanel",
			border: 0,
			autoRender: true,
			autoShow: false,
			store: this.rateAlarmConfigGridStore,
			forceFit: true,

			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			columns: this.columns
		});
	};
	this.createAmountAlarmConfigGridPanel = function() {
		this.amountAlarmConfigGridPanel && this.amountAlarmConfigGridPanel.remove();
		this.amountAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "交易量告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.amountAlarmConfigGridStore,
			forceFit: true,
			// selModel: Ext.create('Ext.selection.CheckboxModel', {
			// 	mode: "SIMPLE"
			// }),
			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			columns: this.columns
				// 结束
		});
	};
	this.createDurationAlarmConfigGridPanel = function() {
		this.durationAlarmConfigGridPanel && this.durationAlarmConfigGridPanel.remove();
		this.durationAlarmConfigGridPanel = Ext.create("Ext.grid.Panel", {
			title: "响应时间告警",
			border: 0,
			cls: "alarmConfigTabGridPanel",
			autoRender: true,
			autoShow: false,
			store: this.durationAlarmConfigGridStore,
			forceFit: true,
			// selModel: Ext.create('Ext.selection.CheckboxModel', {
			// 	mode: "SIMPLE"
			// }),
			selType: 'cellmodel',
			plugins: [
				Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit: 1
				})
			],
			columns: this.columns
		});
	};



	// 告警配置 
	this.alarmConfigPanel = Ext.create("Ext.tab.Panel", {
		border: 0,
		plain: true,
		title: "告警配置",
		cls: "alarmConfigTabPanel",
	});



	this.alarmTypePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "告警类型 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "checkboxfield",
			defaults: {
				name: "alarmType",
				margin: "10",
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox'
		}]
	});


	this.alarmPushPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "告警是否需要推送 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "radiofield",
			defaults: {
				name: "alarmPush",
				margin: "10",
				width: 100
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "是",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "否",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	this.alarmPushModePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "vbox",
		items: [{
			xtype: "label",
			style: "color: #fff; font-size: 14px; line-height: 24px;",
			text: "推送方式 : ",
			margin: "5 0",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			defaultType: "checkboxfield",
			defaults: {
				margin: "10 0 10 20",
				width: 50
			},
			width: "100%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				name: "alarmPushMode",
				boxLabel: "短信",
				inputValue: "短信",
				boxLabelCls: "radioLabel",
			}, {
				width: 250,
				xtype: "textfield",
				fieldLabel: "号码",
				name: "alarmPushModeToPhone",
				margin: "10",
				labelWidth: 50,
				cls: "centerFormPanelInput",
				labelStyle: "color: #ddd; font-size: 14px; "
			}, {
				name: "alarmPushMode",
				boxLabel: "邮件",
				inputValue: "短信",
				boxLabelCls: "radioLabel",
			}, {
				width: 250,
				xtype: "textfield",
				fieldLabel: "邮箱",
				margin: "10",
				name: "alarmPushModeToEmail",
				cls: "centerFormPanelInput",
				labelWidth: 50,
				labelStyle: "color: #ddd; font-size: 14px;"
			}]
		}]
	});


	// 告警服务表单
	this.alarmServiceFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		items: [
			this.alarmTypePanel,
			this.alarmConfigPanel,
			this.alarmPushPanel,
			this.alarmPushModePanel
		]
	});
	this.alarmServiceBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			formPanel: this.alarmServiceFormPanel,
			margin: "5",
			xtype: "button",
			text: "告警服务定制",
			baseCls: "x-btn base-btn",
			icon: "resources/images/-.png",
			style: "background: none;border: 0px;",
			handler: Ext.bind(this.configFormPanelShow, this)
		}],
	});

	this.alarmServicePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.alarmServiceBtnPanel,
			this.alarmServiceFormPanel,

		]
	});



	// 告警服务end
	// 
	// 故障服务
	this.faultServiceFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		items: []
	});
	this.faultServiceBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			formPanel: this.faultServiceFormPanel,
			margin: "5",
			xtype: "button",
			text: "故障服务定制",
			baseCls: "x-btn base-btn",
			icon: "resources/images/-.png",
			style: "background: none;border: 0px;",
			handler: Ext.bind(this.configFormPanelShow, this)
		}],
	});
	this.faultServicePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.faultServiceBtnPanel,
			this.faultServiceFormPanel
		]
	});;

	// 故障服务end
	// 
	// 
	// 
	//  数据服务-------  传输频率
	this.transmissionFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "传输频率:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			// fieldLabel: '',
			// labelWidth: 100,
			labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "transmissionFrequency",
				margin: "10",
				width: 100
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "transmissionFrequencyOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});
	//  数据服务-------  数据文件
	this.dataFilePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "数据文件:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			defaultType: "checkboxfield",
			defaults: {
				name: "dataFile",
				margin: "10",
				width: 100,
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				width: 220,
				boxLabel: "PCAP原始数据文件包",
				inputValue: "PCAP原始数据文件包",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "BTR",
				inputValue: "BTR",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "TTR",
				inputValue: "TTR",
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	//  数据服务 ------ 统计指标
	this.statisticalTargetPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "统计指标:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "checkboxfield",
			defaults: {
				name: "statisticalTarget",
				margin: "10",
				width: 100
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "响应时长",
				inputValue: "响应时长",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "响应率",
				inputValue: "响应率",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "成功率",
				inputValue: "成功率",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "交易量",
				inputValue: "交易量",
				boxLabelCls: "radioLabel",
			}]
		}]
	});
	//  数据服务 ------ 统计粒度
	this.statisticalGranularityPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "统计粒度:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "statisticalGranularity",
				margin: "10",
				width: 100
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "statisticalGranularityOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});
	// 数据服务-------  统计数据  传输频率
	this.statisticalTransmissionFrequencyPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		padding: "10 0",
		items: [{
			xtype: "label",
			text: "传输频率:",
			style: "color: #fff; font-size: 14px; line-height: 45px;",
			width: "20%",
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '',
			// labelWidth: 100,
			// labelStyle: "color: #fff; font-size: 14px; line-height: 40px",
			// labelAlign: "right",
			defaultType: "radiofield",
			defaults: {
				name: "statisticalTransmissionFrequency",
				margin: "10",
				width: 100
			},
			width: "80%",
			cls: "serviceDirectoryManageFormCheckbox",
			layout: 'hbox',
			items: [{
				boxLabel: "30s",
				inputValue: "30s",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "1min",
				inputValue: "1min",
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "5min",
				inputValue: "5min",
				boxLabelCls: "radioLabel",
			}, {
				width: 50,
				boxLabel: "其他",
				inputValue: "other",
				boxLabelCls: "radioLabel",
			}, {
				xtype: "textfield",
				name: "statisticalTransmissionFrequencyOther",
				cls: "centerFormPanelInput"
			}]
		}]
	});


	// 
	// 数据服务--------  主体
	this.dataServiceFormPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		cls: "centerFormPanel",
		items: [{
				xtype: "checkboxfield",
				name: "probeData",
				boxLabel: "探测明细数据",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				xtype: "panel",
				border: 0,
				layout: "hbox",
				padding: "10 0",
				cls: "serviceDirectoryManageFormCheckbox",
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "接口地址",
					labelAlign: "right",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "probeDataHost"
				}, {
					margin: "0 10",
					xtype: "textfield",
					cls: "centerFormPanelInput",
					labelAlign: "right",
					fieldLabel: "端口",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "probeDataPort",
				}]
			}, this.transmissionFrequencyPanel,
			this.dataFilePanel, {
				xtype: "checkboxfield",
				name: "statisticalData",
				boxLabel: "统计数据",
				inputValue: true,
				boxLabelCls: "radioLabel",
			}, {
				xtype: "panel",
				border: 0,
				layout: "hbox",
				padding: "10 0",
				cls: "serviceDirectoryManageFormCheckbox",
				items: [{
					xtype: "textfield",
					cls: "centerFormPanelInput",
					fieldLabel: "接口地址",
					labelAlign: "right",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "statisticalHost",
				}, {
					margin: "0 10",
					xtype: "textfield",
					cls: "centerFormPanelInput",
					labelAlign: "right",
					fieldLabel: "端口",
					labelStyle: "color: #ddd; font-size: 14px;",
					labelWidth: 100,
					name: "statisticalPort",
				}]
			},
			this.statisticalTransmissionFrequencyPanel,
			this.statisticalTargetPanel,
			this.statisticalGranularityPanel,

		]
	});
	this.dataServiceBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [{
			formPanel: this.dataServiceFormPanel,
			margin: "5",
			xtype: "button",
			text: "数据服务定制",
			baseCls: "x-btn base-btn",
			icon: "resources/images/-.png",
			style: "background: none;border: 0px;",
			handler: Ext.bind(this.configFormPanelShow, this)
		}],
	});
	this.dataServicePanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		items: [
			this.dataServiceBtnPanel,
			this.dataServiceFormPanel
		]
	});

	// submitOver 
	this.submitOverPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		layout: "hbox",
		// style: "border-top: 1px #ddd solid;",
		margin: "10 0",
		padding: "10 0",
		items: [{
			xtype: 'fieldcontainer',
			defaultType: "radiofield",
			fieldLabel: "提交后将要",
			labelWidth: 100,
			labelAlign: "right",
			labelStyle: "color: #fff; font-size: 14px; line-height: 40px;",
			// padding: 5,
			cls: "serviceDirectoryManageFormCheckbox",
			width: "100%",
			defaults: {
				name: "submitOver",
				width: 200,
				margin: "10",
			},
			layout: 'hbox',
			items: [{
				boxLabel: "继续为该类型定制服务",
				inputValue: true,
				value: true,
				boxLabelCls: "radioLabel",
			}, {
				boxLabel: "返回我的菜单",
				inputValue: false,
				boxLabelCls: "radioLabel",
			}]
		}]
	});



	this.overBtnPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		height: 30,
		style: "text-align: center;",
		defaults: {
			xtype: "button",
			baseCls: "x-btn base-btn",
			width: 100,
			margin: "0 5",
		},
		items: [{
			text: "保存",
			cls: "btn-save",
			handler: Ext.bind(this.saveOrderBefor, this)
		}, {
			text: "提交",
			cls: "btn-submit",
			handler: Ext.bind(this.submitOrderBefor, this)
		}]
	});

	// 场景配置
	this.centerFormPanel = Ext.create("Ext.form.Panel", {
		border: 0,
		items: [
			this.serviceingPanel,
			this.monitorPanel,
			this.alarmServicePanel,
			this.faultServicePanel,
			this.dataServicePanel,
			this.submitOverPanel,
			this.overBtnPanel
		]
	});

	// 主查看容器
	this.centerPanel = Ext.create("Ext.panel.Panel", {
		border: 0,
		columnWidth: 4 / 5,
		margin: 5,
		items: [
			this.centerTitlePanel,
			this.centerFormPanel
		]
	});
}

ServiceDirectory.prototype = new Page(Configes.page.serviceDirectory);
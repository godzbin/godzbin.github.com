/**
 * 深圳中心 的测试数据
 * @type {Object}
 */
var test = {

	// 订单管理
	view_genCode: "1111",
	view_getSelfInfo: {
		"_NICK_NAME": "深圳中心运维中心",
		"_ID": 103,
		"DOMAIN": "Domain=101",
		"_PHONE": null,
		"_GENDER": 0,
		"_NAME": "深圳中心运维中心",
		"_CONTENT": '{"PROVINCE":"深圳中心"}',
		"_ADDRESS": null,
		"_EMAIL": null
	},


	// 用户管理

	view_listUserInfo: [{
		"DATA": {
			"_FIRST_PWD_CHANGED": true,
			"_LOCKED": false,
			"_EMAIL": null,
			"_CONTENT": "{\"PROVINCE\":\"深圳中心\"}",
			"_ADDRESS": null,
			"RDN": "SMUser=102",
			"_ID": 102,
			"_PDN": "Domain=101",
			"_PHONE": null,
			"_NAME": "assigner",
			"CLASS": "SMUser",
			"_GENDER": 0,
			"_NICK_NAME": "深圳中心",
			"_STATUS": 1
		},
		"ROLE_RDNS": ["SMRole=2"],
		"GROUP_RDNS": []
	}, {
		"DATA": {
			"_FIRST_PWD_CHANGED": true,
			"_LOCKED": false,
			"_EMAIL": null,
			"_CONTENT": "{\"PROVINCE\": \"\\u7518\\u8083\"}",
			"_ADDRESS": null,
			"RDN": "SMUser=101",
			"_ID": 101,
			"_PDN": "Domain=101",
			"_PHONE": null,
			"_NAME": "submitter",
			"CLASS": "SMUser",
			"_GENDER": 0,
			"_NICK_NAME": null,
			"_STATUS": 1
		},
		"ROLE_RDNS": ["SMRole=1"],
		"GROUP_RDNS": []
	}, {
		"DATA": {
			"_FIRST_PWD_CHANGED": true,
			"_LOCKED": false,
			"_EMAIL": null,
			"_CONTENT": "{\"PROVINCE\":\"深圳中心\"}",
			"_ADDRESS": null,
			"RDN": "SMUser=103",
			"_ID": 103,
			"_PDN": "Domain=101",
			"_PHONE": null,
			"_NAME": "checker",
			"CLASS": "SMUser",
			"_GENDER": 0,
			"_NICK_NAME": "深圳中心",
			"_STATUS": 1
		},
		"ROLE_RDNS": ["SMRole=3"],
		"GROUP_RDNS": []
	}],

	view_getUserInfo: {
		"DATA": {
			"_FIRST_PWD_CHANGED": true,
			"_LOCKED": false,
			"_EMAIL": null,
			"_CONTENT": "{\"PROVINCE\":\"深圳中心\"}",
			"_ADDRESS": null,
			"RDN": "SMUser=102",
			"_ID": 102,
			"_PDN": "Domain=101",
			"_PHONE": null,
			"_NAME": "assigner",
			"CLASS": "SMUser",
			"_GENDER": 0,
			"_NICK_NAME": "深圳中心",
			"_STATUS": 1
		},
		"ROLE_RDNS": ["SMRole=2"],
		"GROUP_RDNS": []
	},

	view_updateUser: null,
	view_listGroupInfo: [{
		"DATA": {
			"_DESC": "测试用",
			"RDN": "SMGroup=102",
			"_ID": 102,
			"_PDN": "Domain=101",
			"_LABEL": "测试2组",
			"_NAME": "test2",
			"CLASS": "SMGroup",
			"_CONTENT": null
		},
		"ROLE_RDNS": [],
		"USER_RDNS": ["SMUser=302"]
	}, {
		"DATA": {
			"_DESC": "测试用",
			"RDN": "SMGroup=101",
			"_ID": 101,
			"_PDN": "Domain=101",
			"_LABEL": "测试组",
			"_NAME": "test",
			"CLASS": "SMGroup",
			"_CONTENT": null
		},
		"ROLE_RDNS": [],
		"USER_RDNS": ["SMUser=301", "SMUser=201", "SMUser=302"]
	}],
	view_listPrivilegeAndGroup: [{
		"_DESC": null,
		"RDN": "SMPrivilege=1",
		"_ID": 1,
		"_PDN": "Domain=1;SMPrivilegeGroup=1;SMPrivilegeGroup=2",
		"_LABEL": "读取用户",
		"_NAME": "USER_READ",
		"LEAF": true,
		"CLASS": "SMPrivilege",
		"_CONTENT": null
	}, {
		"_DESC": null,
		"RDN": "SMPrivilege=2",
		"_ID": 2,
		"_PDN": "Domain=1;SMPrivilegeGroup=1;SMPrivilegeGroup=2",
		"_LABEL": "保存用户",
		"_NAME": "USER_WRITE",
		"LEAF": true,
		"CLASS": "SMPrivilege",
		"_CONTENT": null
	}],
	view_listRoleInfo: [{
		"PRIVILEGE_NAMES": ["COP:CHECK_ORDER"],
		"DATA": {
			"_DESC": null,
			"RDN": "SMRole=3",
			"_ID": 3,
			"_PDN": "Domain=101",
			"_LABEL": null,
			"_NAME": "orderChecker",
			"CLASS": "SMRole",
			"_CONTENT": null
		},
		"PRIVILEGE_RDNS": ["SMPrivilege=19"]
	}, {
		"PRIVILEGE_NAMES": ["COP:ASSIGN_ORDER", "SYS_DOMAIN:USER_READ"],
		"DATA": {
			"_DESC": null,
			"RDN": "SMRole=2",
			"_ID": 2,
			"_PDN": "Domain=101",
			"_LABEL": null,
			"_NAME": "orderAssigner",
			"CLASS": "SMRole",
			"_CONTENT": null
		},
		"PRIVILEGE_RDNS": ["SMPrivilege=18", "SMPrivilege=1"]
	}, {
		"PRIVILEGE_NAMES": ["COP:SUBMIT_ORDER"],
		"DATA": {
			"_DESC": null,
			"RDN": "SMRole=1",
			"_ID": 1,
			"_PDN": "Domain=101",
			"_LABEL": null,
			"_NAME": "orderSubmitter",
			"CLASS": "SMRole",
			"_CONTENT": null
		},
		"PRIVILEGE_RDNS": ["SMPrivilege=17"]
	}, {
		"PRIVILEGE_NAMES": ["COP:ASSIGN_ORDER", "SYS_DOMAIN:LOAD_PRIVILEGE_MODULE", "COP:SUBMIT_ORDER", "SYS_DOMAIN:ROLE_REMOVE", "SYS_DOMAIN:GROUP_WRITE", "SYS_DOMAIN:ASSIGN_USER_TO_GROUP", "SYS_DOMAIN:GROUP_REMOVE", "SYS_DOMAIN:GROUP_READ", "SYS_DOMAIN:SESSION_REMOVE", "SYS_DOMAIN:ROLE_WRITE", "SYS_DOMAIN:PRIVILEGE_MODULE_READ", "COP:CHECK_ORDER", "SYS_DOMAIN:ASSIGN_ROLE_TO_GROUP", "SYS_DOMAIN:ASSIGN_PRIVILEGE_TO_ROLE", "SYS_DOMAIN:ASSIGN_ROLE_TO_USER", "SYS_DOMAIN:USER_WRITE"],
		"DATA": {
			"_DESC": null,
			"RDN": "SMRole=101",
			"_ID": 101,
			"_PDN": "Domain=101",
			"_LABEL": "测试管理员",
			"_NAME": "admin",
			"CLASS": "SMRole",
			"_CONTENT": null
		},
		"PRIVILEGE_RDNS": ["SMPrivilege=14", "SMPrivilege=9", "SMPrivilege=17", "SMPrivilege=12", "SMPrivilege=5", "SMPrivilege=18", "SMPrivilege=13", "SMPrivilege=2", "SMPrivilege=3", "SMPrivilege=7", "SMPrivilege=19", "SMPrivilege=11", "SMPrivilege=8", "SMPrivilege=4", "SMPrivilege=16", "SMPrivilege=10"]
	}],
	view_addRole: null,
	view_addGroup: null,
	view_addUser: null,
	view_removeRole: null,
	view_getRoleInfo: {
		"PRIVILEGE_NAMES": ["COP:CHECK_ORDER"],
		"DATA": {
			"_DESC": null,
			"RDN": "SMRole=3",
			"_ID": 3,
			"_PDN": "Domain=101",
			"_LABEL": null,
			"_NAME": "orderChecker",
			"CLASS": "SMRole",
			"_CONTENT": null
		},
		"PRIVILEGE_RDNS": ["SMPrivilege=19"]
	},
	view_updateRole: null,
	view_getGroupInfo: {
		"DATA": {
			"_DESC": "测试用",
			"RDN": "SMGroup=102",
			"_ID": 102,
			"_PDN": "Domain=101",
			"_LABEL": "测试2组",
			"_NAME": "test2",
			"CLASS": "SMGroup",
			"_CONTENT": null
		},
		"ROLE_RDNS": [],
		"USER_RDNS": ["SMUser=302"]
	},
	view_updateGroup: null,
	view_removeGroup: null,
	view_listSession: [{
		"USER_NAME": "root",
		"SESSION_KEY": "sessioncbCQB32Q37lMEr98GlDcl4VIXCrrT8SomZLQrPbYnUrlytiAT9hIhgkKTjTHnF2",
		"LAST_ACCESS_TIME": 1472280508,
		"LOGIN_TIME": 1472279461,
		"DOMAIN": "SYS_DOMAIN",
		"HOST": null,
		"USER_RDN": "SMUser=1",
		"PORT": null,
		"NICK_NAME": null
	}],
	view_removeSession: null,
	view_getSysDomain: {
		"_DESC": null,
		"RDN": "Domain=1",
		"_ID": 1,
		"_PDN": null,
		"_LABEL": null,
		"_NAME": "SYS_DOMAIN",
		"CLASS": "Domain"
	},



	// 服务目录 ====================================================================
	// 
	// 
	// 获取服务列表
	getServerList: [{
		name: "监控类服务",
		_id: 1
	}, {
		name: "分析类服务",
		_id: 2
	}, {
		name: "展示类服务",
		_id: 3
	}],
	// 添加服务
	addServer: {
		name: "新增的类服务",
		_id: 1
	},
	// 获取服务
	getServer: {
		name: "监控类服务",
		_id: 1
	},
	// 修改服务
	updateServer: {
		name: "修改的类服务",
		_id: 1
	},
	// 删除服务
	deleteServer: "",
	// 获取场景列表
	getSceneList1: [{
		name: "故障定位监控",
		_id: 1,
		statu: 0,
		edit: 1
	}, {
		name: "端到端监控",
		_id: 2,
		statu: 1,
		edit: 1
	}, {
		name: "客户感知监控",
		_id: 3,
		statu: 1,
		edit: 0
	}, {
		name: "后端流量监测",
		_id: 4,
		statu: 1,
		edit: 0
	}, {
		name: "收入保障监控",
		_id: 5,
		statu: 1,
		edit: 0
	}, {
		name: "专题监控",
		_id: 6,
		statu: 1,
		edit: 0
	}],
	getSceneList2: [{
		name: "数据分析模型",
		_id: 7,
		statu: 1,
		edit: 0
	},{
		name: "自主分析",
		_id: 8,
		statu: 1,
		edit: 0
	}],
	getSceneList3: [{
		name: "APP展示",
		_id: 9,
		statu: 1,
		edit: 0
	},{
		name: "大屏展示",
		_id: 10,
		statu: 1,
		edit: 0
	}],
	// 获取渠道
	getChannel: [{
		NAME: "营业厅前台",
		VALUE: "营业厅前台"
	}, {
		NAME: "电子渠道",
		VALUE: "电子渠道"
	}],

	// 获取业务
	getBusiness: [{
		NAME: "业务1",
		VALUE: "业务1"
	}, {
		NAME: "业务2",
		VALUE: "业务2"
	}, {
		NAME: "业务3",
		VALUE: "业务3"
	}, {
		NAME: "业务4",
		VALUE: "业务4"
	}, {
		NAME: "业务5",
		VALUE: "业务5"
	}, {
		NAME: "业务6",
		VALUE: "业务6"
	}, {
		NAME: "业务7",
		VALUE: "业务7"
	}],

	// 获取指标
	getTarget: [{
		NAME: "成功率",
		VALUE: "成功率"
	}, {
		NAME: "交易量",
		VALUE: "交易量"
	}, {
		NAME: "响应时长",
		VALUE: "响应时长"
	}],
	// 获取探测方式
	getProbe: [{
		NAME: "主动探测",
		VALUE: "主动探测"
	}, {
		NAME: "被动探测",
		VALUE: "被动探测"
	}],

	// 获取探测频率
	getProbeFrequency: [{
		NAME: "30s",
		VALUE: "30s"
	}, {
		NAME: "1min",
		VALUE: "1min"
	}, {
		NAME: "5min",
		VALUE: "5min"
	}, {
		NAME: "10min",
		VALUE: "10min"
	}],



	// 获取场景
	getScene: {
		id: 1,
		name: "场景标题（demo）",
		desc: "实时监控业务指标性能,单笔业务智能故障定位,接口级、应用级、平台级故障精确定位",
		channel: ["营业厅前台", "电子渠道"],
		target: ["成功率", "交易量"],
		probe: ["主动探测", "被动探测"],
		probeFrequency: ["30s", "1min"],
		business: ["业务1", "业务2", "业务3", "业务4", "业务5", "业务6"],
		// 探测方式价值与意义
		detectionMethodsValueAndSignificance: "探测方式价值与意义内容",
		detectionPrincipleAndArchitecture: "探测原理及架构内容",
		detectingApplicationRange: "探测运用范围内容",
		detectionProcessAndRiskAnalysis: "探测流程及风险分析内容",
		endPreparationWork: "省端准备工作内容",
		alarmType: ["成功率", "交易量"],
		alarmPush: true,
		alarmPushMode: ["短信", "邮件"],
		required: ["渠道", "探测方式"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: "100",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: "200",
			TIME: ["5min", "10min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: "300",
			TIME: ["5min", "10min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		durationAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "响应时长",
			CONDITION: "大于",
			THRESHOLD: "30",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "响应时长",
			CONDITION: "大于",
			THRESHOLD: "40",
			TIME: ["5min", "10min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "响应时长",
			CONDITION: "大于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}]
	},

	// 添加场景
	addScene: {
		// _id: 45,
		name: "新添加的场景",
		statu: 1,
		edit: 0
	},
	// 修改场景
	updateScene: {
		_id: 1,
		name: "新保存的场景",
		statu: 1,
		edit: 0
	},
	// 获取告警模板
	getRateAlarmConfig: [{
		ID: "1",
		NAME: "一般",
		TYPE: "成功率",
		CONDITION: "小于",
		THRESHOLD: "90",
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}, {
		ID: "2",
		NAME: "严重",
		TYPE: "成功率",
		CONDITION: "小于",
		THRESHOLD: "80",
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}, {
		ID: "3",
		NAME: "重大",
		TYPE: "成功率",
		CONDITION: "小于",
		THRESHOLD: "50",
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}],
	getAmountAlarmConfig: [{
		ID: "1",
		NAME: "一般",
		TYPE: "业务量",
		CONDITION: "大于",
		THRESHOLD: 0,
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}, {
		ID: "2",
		NAME: "严重",
		TYPE: "业务量",
		CONDITION: "大于",
		THRESHOLD: 0,
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}, {
		ID: "3",
		NAME: "重大",
		TYPE: "业务量",
		CONDITION: "大于",
		THRESHOLD: 0,
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}],
	getDurationAlarmConfig: [{
		ID: "1",
		NAME: "一般",
		TYPE: "响应时长",
		CONDITION: "大于",
		THRESHOLD: 0,
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}, {
		ID: "2",
		NAME: "严重",
		TYPE: "响应时长",
		CONDITION: "大于",
		THRESHOLD: 0,
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}, {
		ID: "3",
		NAME: "重大",
		TYPE: "响应时长",
		CONDITION: "大于",
		THRESHOLD: 0,
		TIME: ["5min", "10min", "15min", "其他"],
		SELECE: false,
		SELECE_TIME: "",
		SELECE_THRESHOLD: 0,
		SELECE_TIME_OTHER: "",
	}],

	// 移除保存的场景
	removSaveScene: "",
	// 移除场景
	removeScene: "",
	// 提交场景
	submitScene: "",

	//  服务定制=================================================

	getSaveSceneOrder: {
		service: "",
		scene: "",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalTransmissionFrequency: "1min",
	},
	getServiceingOrder: ["营业厅前台 + 主动探测", "电渠 + 主动探测"],

	saveOrder: "saveOrder",
	submitOrder: "submitOrder",
	removeSaveOrder: "removeSaveOrder",



	getOrderListToService: {
		total: 20,
		list: [{
			"_id": "0101010101-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0101010101-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "已完成",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}]
	},
	getOrderListToHistory: [{
		"_id": "0102020104-01",
		"service": "监控类",
		"scene": "端到端",
		"channel": "电子渠道",
		"probe": "主动探测",
		"statu": "已完成",
		"startTime": "2016-08-26 00:00:00",
		"province": "甘肃省",
		"processor": ""
	}],
	getOrderListTo1: {
		total: 8,
		list: [{
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}]
	},
	getOrderListTo2: {
		total: 2,
		list: [{
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "审批未通过",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "审批未通过",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": ""
		}]
	},
	getOrderListTo3: {
		total: 2,
		list: [{
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待配置环境",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "甘肃省业务运维组"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待配置环境",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "甘肃省业务运维组"
		}]
	},
	getOrderListTo4: {
		total: 2,
		list: [{
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待验证配置",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待验证配置",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}]
	},
	getOrderListTo5: {
		total: 2,
		list: [{
			"_id": "0101010101-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待部署",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待部署",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}]
	},

	// 订单信息
	getOrderInfo: {
		orderId: "0101010101-01",
		statu: "已完成",
		province: "甘肃省",
		processor: "甘肃省业务运维组",
		service: "监控类服务",
		scene: "故障定位监控",
		startTime: "2016-08-26 00:00",
		channel: "营业厅前台",
		probe: "主动探测",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		transmissionFrequencyOther: "",

		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalGranularityOther: "",
		statisticalTransmissionFrequency: "1min",
		statisticalTransmissionOther: "1min",

		step: [{
			statu: "提交",
			startTime: "2016-08-08 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是留言,很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;"
		}, {
			statu: "分派",
			startTime: "2016-08-08 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "审批",
			startTime: "2016-08-08 00:00:00",
			processor: "深圳中心运维中心"
		}],
		enclosure: [{
			fileName: "环境配置验证文档.rar",
			fileId: 12
		}]
	},

	'getOrderInfo已完成': {
		orderId: "0101010101-01",
		statu: "已完成",
		province: "甘肃省",
		processor: "甘肃省业务运维组",
		service: "监控类服务",
		scene: "故障定位监控",
		startTime: "2016-08-26 00:00",
		channel: "营业厅前台",
		probe: "主动探测",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		transmissionFrequencyOther: "",

		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalGranularityOther: "",
		statisticalTransmissionFrequency: "1min",
		statisticalTransmissionOther: "1min",

		step: [{
			statu: "提交",
			startTime: "2016-08-08 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是留言,很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;"
		}, {
			statu: "分派",
			startTime: "2016-08-09 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "审批",
			startTime: "2016-08-10 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "配置环境",
			startTime: "2016-08-11 00:00:00",
			processor: "甘肃省业务运维组"
		}, {
			statu: "验证环境",
			startTime: "2016-08-12 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "部署上线",
			startTime: "2016-08-13 00:00:00",
			processor: "深圳中心运维中心"
		}],
		enclosure: [{
			fileName: "环境配置验证文档.rar",
			fileId: 12
		}]
	},
	'getOrderInfo待部署': {
		orderId: "1234567890-23",
		statu: "待部署",
		province: "甘肃省",
		processor: "甘肃省业务运维组",
		service: "监控类服务",
		scene: "故障定位监控",
		startTime: "2016-08-26 00:00",
		channel: "营业厅前台",
		probe: "主动探测",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		transmissionFrequencyOther: "",

		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalGranularityOther: "",
		statisticalTransmissionFrequency: "1min",
		statisticalTransmissionOther: "1min",

		step: [{
			statu: "提交",
			startTime: "2016-08-08 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是留言,很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;"
		}, {
			statu: "分派",
			startTime: "2016-08-09 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "审批",
			startTime: "2016-08-10 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "配置环境",
			startTime: "2016-08-11 00:00:00",
			processor: "甘肃省业务运维组"
		}, {
			statu: "验证环境",
			startTime: "2016-08-12 00:00:00",
			processor: "深圳中心运维中心"
		}],
		enclosure: [{
			fileName: "环境配置验证文档.rar",
			fileId: 12
		}]
	},
	'getOrderInfo待配置环境': {
		orderId: "1234567890-23",
		statu: "待配置环境",
		province: "甘肃省",
		processor: "甘肃省业务运维组",
		service: "监控类服务",
		scene: "故障定位监控",
		startTime: "2016-08-26 00:00",
		channel: "营业厅前台",
		probe: "主动探测",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		transmissionFrequencyOther: "",

		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalGranularityOther: "",
		statisticalTransmissionFrequency: "1min",
		statisticalTransmissionOther: "1min",

		step: [{
			statu: "提交",
			startTime: "2016-08-08 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是留言,很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;"
		}, {
			statu: "分派",
			startTime: "2016-08-09 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "审批",
			startTime: "2016-08-10 00:00:00",
			processor: "深圳中心运维中心"
		}],
		enclosure: [{
			fileName: "环境配置验证文档.rar",
			fileId: 12
		}]
	},
	'getOrderInfo审批未通过': {
		orderId: "1234567890-23",
		statu: "审批未通过",
		province: "甘肃省",
		processor: "甘肃省业务运维组",
		service: "监控类服务",
		scene: "故障定位监控",
		startTime: "2016-08-26 00:00",
		channel: "营业厅前台",
		probe: "主动探测",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		transmissionFrequencyOther: "",

		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalGranularityOther: "",
		statisticalTransmissionFrequency: "1min",
		statisticalTransmissionOther: "1min",

		step: [{
			statu: "提交",
			startTime: "2016-08-08 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是留言,很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;"
		}, {
			statu: "分派",
			startTime: "2016-08-09 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "审批",
			startTime: "2016-08-10 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "被拒绝",
			startTime: "2016-08-11 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是测试"
		}],
		enclosure: [{
			fileName: "环境配置验证文档.rar",
			fileId: 12
		}]
	},
	'getOrderInfo待验证配置': {
		orderId: "1234567890-23",
		statu: "待验证环境",
		province: "甘肃省",
		processor: "甘肃省业务运维组",
		service: "监控类服务",
		scene: "故障定位监控",
		startTime: "2016-08-26 00:00",
		channel: "营业厅前台",
		probe: "主动探测",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		transmissionFrequencyOther: "",

		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalGranularityOther: "",
		statisticalTransmissionFrequency: "1min",
		statisticalTransmissionOther: "1min",

		step: [{
			statu: "提交",
			startTime: "2016-08-08 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是留言,很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;"
		}, {
			statu: "分派",
			startTime: "2016-08-09 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "审批",
			startTime: "2016-08-10 00:00:00",
			processor: "深圳中心运维中心"
		}, {
			statu: "配置环境",
			startTime: "2016-08-11 00:00:00",
			processor: "甘肃省业务运维组"
		}],
		enclosure: [{
			fileName: "环境配置验证文档.rar",
			fileId: 12
		}]
	},
	'getOrderInfo待审批': {
		orderId: "1234567890-23",
		statu: "待审批",
		province: "甘肃省",
		processor: "甘肃省业务运维组",
		service: "监控类服务",
		scene: "故障定位监控",
		startTime: "2016-08-26 00:00",
		channel: "营业厅前台",
		probe: "主动探测",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		transmissionFrequencyOther: "",

		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalGranularityOther: "",
		statisticalTransmissionFrequency: "1min",
		statisticalTransmissionOther: "1min",

		step: [{
			statu: "提交",
			startTime: "2016-08-08 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是留言,很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;"
		}],
		enclosure: [{
			fileName: "环境配置验证文档.rar",
			fileId: 12
		}]
	},
	'getOrderInfo待分派': {
		orderId: "1234567890-23",
		statu: "待分派",
		province: "甘肃省",
		processor: "甘肃省业务运维组",
		service: "监控类服务",
		scene: "故障定位监控",
		startTime: "2016-08-26 00:00",
		channel: "营业厅前台",
		probe: "主动探测",
		channel: "营业厅前台",
		probe: "主动探测",
		business: ["业务1", "业务2"],
		target: ["成功率", "交易量"],
		probeFrequency: "30s",
		alarmType: ["成功率", "交易量"],
		rateAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "90",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 99,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "80",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "成功率",
			CONDITION: "小于",
			THRESHOLD: "50",
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		amountAlarmConfig: [{
			ID: "1",
			NAME: "一般",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: true,
			SELECE_TIME: "5min",
			SELECE_THRESHOLD: 177,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "2",
			NAME: "严重",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}, {
			ID: "3",
			NAME: "重大",
			TYPE: "业务量",
			CONDITION: "大于",
			THRESHOLD: 0,
			TIME: ["5min", "10min", "15min", "其他"],
			SELECE: false,
			SELECE_TIME: "",
			SELECE_THRESHOLD: 0,
			SELECE_TIME_OTHER: "",
		}],
		alarmPush: true,
		alarmPushMode: ["短信"],
		alarmPushModeToPhone: "1111111111",
		probeData: true,
		probeDataHost: "192.168.1.1",
		probeDataPort: "3306",
		transmissionFrequency: "30s",
		transmissionFrequencyOther: "",

		dataFile: ["BTR"],

		statisticalData: true,
		statisticalHost: "192.168.1.1",
		statisticalPort: "3306",
		statisticalTarget: ["响应时长"],
		statisticalGranularity: "1min",
		statisticalGranularityOther: "",
		statisticalTransmissionFrequency: "1min",
		statisticalTransmissionOther: "1min",

		step: [{
			statu: "提交",
			startTime: "2016-08-08 00:00:00",
			processor: "甘肃省业务运维组",
			message: "这是留言,很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;很长的留言;"
		}],
		enclosure: [{
			fileName: "环境配置验证文档.rar",
			fileId: 12
		}]
	},
	getOrderList: {
		total: 4,
		list: [{
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待分派",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "admin"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待审批",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "admin"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待验证环境",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}, {
			"_id": "0102020104-01",
			"service": "监控类",
			"scene": "端到端",
			"channel": "电子渠道",
			"probe": "主动探测",
			"statu": "待部署",
			"startTime": "2016-08-26 00:00:00",
			"province": "甘肃省",
			"processor": "深圳中心运维中心"
		}]
	},
	getCheckerList: [{
		NAME: "审批人1",
		VALUE: 1
	}, {
		NAME: "审批人2",
		VALUE: 2
	}],
	getHandlerOrder: "",
	getAssignmentOrder: "",



	getAllSceneMap: [{
		name: '北京',
		value: Math.round(Math.random() * 10)
	}, {
		name: '天津',
		value: Math.round(Math.random() * 10)
	}, {
		name: '上海',
		value: Math.round(Math.random() * 10)
	}, {
		name: '重庆',
		value: Math.round(Math.random() * 10)
	}, {
		name: '河北',
		value: Math.round(Math.random() * 10)
	}, {
		name: '河南',
		value: Math.round(Math.random() * 10)
	}, {
		name: '云南',
		value: Math.round(Math.random() * 10)
	}, {
		name: '辽宁',
		value: Math.round(Math.random() * 10)
	}, {
		name: '黑龙江',
		value: Math.round(Math.random() * 10)
	}, {
		name: '湖南',
		value: Math.round(Math.random() * 10)
	}, {
		name: '安徽',
		value: Math.round(Math.random() * 10)
	}, {
		name: '山东',
		value: Math.round(Math.random() * 10)
	}, {
		name: '新疆',
		value: Math.round(Math.random() * 10)
	}, {
		name: '江苏',
		value: Math.round(Math.random() * 10)
	}, {
		name: '浙江',
		value: Math.round(Math.random() * 10)
	}, {
		name: '江西',
		value: Math.round(Math.random() * 10)
	}, {
		name: '湖北',
		value: Math.round(Math.random() * 10)
	}, {
		name: '广西',
		value: Math.round(Math.random() * 10)
	}, {
		name: '甘肃',
		value: Math.round(Math.random() * 10)
	}, {
		name: '山西',
		value: Math.round(Math.random() * 10)
	}, {
		name: '内蒙古',
		value: Math.round(Math.random() * 10)
	}, {
		name: '陕西',
		value: Math.round(Math.random() * 10)
	}, {
		name: '吉林',
		value: Math.round(Math.random() * 10)
	}, {
		name: '福建',
		value: Math.round(Math.random() * 10)
	}, {
		name: '贵州',
		value: Math.round(Math.random() * 10)
	}, {
		name: '广东',
		value: Math.round(Math.random() * 10)
	}, {
		name: '青海',
		value: Math.round(Math.random() * 10)
	}, {
		name: '西藏',
		value: Math.round(Math.random() * 10)
	}, {
		name: '四川',
		value: Math.round(Math.random() * 10)
	}, {
		name: '宁夏',
		value: Math.round(Math.random() * 10)
	}, {
		name: '海南',
		value: Math.round(Math.random() * 10)
	}, {
		name: '台湾',
		value: Math.round(Math.random() * 10)
	}, {
		name: '香港',
		value: Math.round(Math.random() * 10)
	}, {
		name: '澳门',
		value: Math.round(Math.random() * 10)
	}],
	getClassfiyMap: {
		service: [{
			value: Math.round(Math.random() * 10),
			name: '监控类服务'
		}, {
			value: Math.round(Math.random() * 10),
			name: '分析类服务'
		}, {
			value: Math.round(Math.random() * 10),
			name: '展示类服务'
		}],
		channel: [{
			value: Math.round(Math.random() * 10),
			name: '电子渠道'
		}, {
			value: Math.round(Math.random() * 10),
			name: '营业厅前台'
		}],
		probe: [{
			value: Math.round(Math.random() * 10),
			name: '主动探测'
		}, {
			value: Math.round(Math.random() * 10),
			name: '被动探测'
		}]
	}
};
//  配置文件
var Configes = {
	constant: {
		// main
		topHeight: 81,
		contentHeight: 800,
		footerHeight: 60,
		// 
		// top
		logoHeight: 70,
		// logoWidth: 120,
	},
	color: ['#00A8E0', '#AED334', '#FF9000', '#FBED25', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
	source: ["被动业务探测系统","智能分析平台"],
	orderModel: {
		$EX_CONTENT: "$EX_CONTENT",
		$EX_CHECKER: "$EX_CHECKER",
		$EX_END_TIME: "$EX_END_TIME",
		$EX_STATUS: "$EX_STATUS",
		$EX_STEPS: "$EX_STEPS",
		// 提交人
		$EX_SUBMITTER: "$EX_SUBMITTER",
		// 提交时间
		$EX_SUBMIT_TIME: "$EX_SUBMIT_TIME",
		CURR_FLOW_UUID: "CURR_FLOW_UUID",
		NAME: "NAME",
		// 处理人
		PROCESSOR: "PROCESSOR",
		// 区域
		PROVINCE: "PROVINCE",
		RDN: "RDN",
		TYPE: "TYPE"

	},
	url: {
		view_getSelfInfo: "view_getSelfInfo",
		app_saveTmpOrder: "app_saveTmpOrder",
		app_listTmpOrder: "app_listTmpOrder",
		app_removeTmpOrder: "app_removeTmpOrder",
		app_getTmpOrder: "app_getTmpOrder",
		app_submitOrder: "app_submitOrder",
		view_logout: "view_logout",

		app_listOrder: "app_listOrder",
		app_getOrder: "app_getOrder",
		app_processOrder: "app_processOrder",
		app_listChecker: "app_listChecker",


		// 服务目录
		getServerList: "getServerList",
		getScene: "getScene",
		addServer: "addServer",
		getServer: "getServer",
		updateServer: "updateServer",
		getSceneList: "getSceneList",
		addScene: "addScene",
		getChannel: "getChannel",
		getBusiness: "getBusiness",
		getTarget: "getTarget",
		getProbe: "getProbe",
		getProbeFrequency: "getProbeFrequency",
		getRateAlarmConfig: "getRateAlarmConfig",
		getAmountAlarmConfig: "getAmountAlarmConfig",
		getDurationAlarmConfig: "getDurationAlarmConfig",
		addScene: "addScene",
		updateScene: "updateScene",
		removSaveScene: "removSaveScene",
		removeScene: "removeScene",
		submitScene: "submitScene",

		getSaveSceneOrder: "getSaveSceneOrder",
		// 获取定制的服务
		getServiceingOrder: "getServiceingOrder",
		saveOrder: "saveOrder",
		submitOrder: "submitOrder",
		removeSaveOrder: "removeSaveOrder",

		// 获取服务中的订单列表
		getOrderListToService: "getOrderListToService",
		getOrderListToHistory: "getOrderListToHistory",
		getOrderListTo: "getOrderListTo",
		getOrderInfo: "getOrderInfo",
		getOrderList: "getOrderList",
		getCheckerList: "getCheckerList",

		getHandlerOrder: "getHandlerOrder",
		getAssignmentOrder: "getAssignmentOrder",


		// 用户管理
		view_listDomain: "view_listDomain",
		view_logout: "view_logout",
		view_listUserInfo: "view_listUserInfo",
		view_getUserInfo: "view_getUserInfo",
		view_updateUser: "view_updateUser",
		view_listGroupInfo: "view_listGroupInfo",
		view_listPrivilegeAndGroup: "view_listPrivilegeAndGroup",
		view_listRoleInfo: "view_listRoleInfo",
		view_addRole: "view_addRole",
		view_addGroup: "view_addGroup",
		view_addUser: "view_addUser",
		view_removeRole: "view_removeRole",
		view_getRoleInfo: "view_getRoleInfo",
		view_updateRole: "view_updateRole",
		view_getGroupInfo: "view_getGroupInfo",
		view_updateGroup: "view_updateGroup",
		view_removeGroup: "view_removeGroup",
		view_listSession: "view_listSession",
		view_removeSession: "view_removeSession",
		view_genCode: "view_genCode",
		view_getSysDomain: "view_getSysDomain",

		// 获取首页数据
		getAllSceneMap: "getAllSceneMap",
		getClassfiyMap: "getClassfiyMap"
	},
	page: {
		indexPage: "indexPage",
		indexPage2: "indexPage2",
		MonitorHomePage: "MonitorHomePage",


		// 服务目录管理
		serviceDirectoryManage: "serviceDirectoryManage",
		// 服务目录
		serviceDirectory: "serviceDirectory",
		// 服务定制
		serviceMade: "serviceMade",
		myTask: "myTask",
		myOrder: "myOrder",
		userCenter: "userCenter",
		sceneMode: 'sceneMode',

		// 用户管理
		securityManage: "securityManage",
	},
	province: [{
		name: '全国',
		value: '全国'
	}, {
		name: '北京市',
		value: '北京'
	}, {
		name: '天津市',
		value: '天津'
	}, {
		name: '上海市',
		value: '上海'
	}, {
		name: '重庆市',
		value: '重庆'
	}, {
		name: '河北省',
		value: '河北'
	}, {
		name: '河南省',
		value: '河南'
	}, {
		name: '云南省',
		value: '云南'
	}, {
		name: '辽宁省',
		value: '辽宁'
	}, {
		name: '黑龙江省',
		value: '黑龙江'
	}, {
		name: '湖南省',
		value: '湖南'
	}, {
		name: '安徽省',
		value: '安徽'
	}, {
		name: '山东省',
		value: '山东'
	}, {
		name: '新疆维吾尔自治区',
		value: '新疆'
	}, {
		name: '江苏省',
		value: '江苏'
	}, {
		name: '浙江省',
		value: '浙江'
	}, {
		name: '江西省',
		value: '江西'
	}, {
		name: '湖北省',
		value: '湖北'
	}, {
		name: '广西壮族自治区',
		value: '广西'
	}, {
		name: '甘肃省',
		value: '甘肃'
	}, {
		name: '山西省',
		value: '山西'
	}, {
		name: '内蒙古自治区',
		value: '内蒙古'
	}, {
		name: '陕西省',
		value: '陕西'
	}, {
		name: '吉林省',
		value: '吉林'
	}, {
		name: '福建省',
		value: '福建'
	}, {
		name: '贵州省',
		value: '贵州'
	}, {
		name: '广东省',
		value: '广东'
	}, {
		name: '青海省',
		value: '青海'
	}, {
		name: '西藏省',
		value: '西藏'
	}, {
		name: '四川省',
		value: '四川'
	}, {
		name: '宁夏回族自治区',
		value: '宁夏'
	}, {
		name: '海南省',
		value: '海南'
	}, {
		name: '台湾省',
		value: '台湾'
	}, {
		name: '香港特别行政区',
		value: '香港'
	}, {
		name: '澳门特别行政区',
		value: '澳门'
	}],

}
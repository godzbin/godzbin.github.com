//  配置文件
var Configes = {
	constant: {
		// main
		topHeight: 81,
		contentHeight: 800,
		footerHeight: 0,
		// 
		// top
		logoHeight: 70,
		// logoWidth: 120,
	},
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
		NAME: "甘肃",
		VALUE: 1
	}, {
		NAME: "广东",
		VALUE: 2
	}]

}
Ext.ns("configs");
configs.isTest = true;
configs.testTime = 0.1;
configs.testData = {
	busiTopicsBusiType: ["停开机_未身份确认的预付费", "补换卡_全球通/预付费_随机码鉴权"],
	testBusiTopicsBusiType: ["停开机", "补换卡"]
};
configs.passLimit = {
	passLimitSurvey: 12,
	passLimitKeyBusi: 3
};
configs.guageMaxValue = {
	busiMoitor: {
		0: 500,
		2: 25000,
		3: 500000
	},
	busiTopics: {
		1: 80,
		2: 500,
		3: 10000
	},
	operationAnalysis: {
		hours: 25000,
		day: 500 * 1000,
		week: 4000 * 1000,
		month: 20 * 1000 * 1000,
		passToThousand: 500 * 1000
	}
};

configs.timeValues = {
	hours: 60 * 　60 * 1000,
	day: 60 * 　60 * 1000 * 24,
	week: 60 * 　60 * 1000 * 24 * 7,
	month: 60 * 　60 * 1000 * 24 * 30
};
configs.endTimeStr = ["2015", "8", "21", "10", "07", "00"];
configs.nowTime = function() {
	var arr = configs.endTimeStr;
	var time = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
	return time;
};
configs.endTime = function() {
	var arr = configs.endTimeStr;
	var time = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]);
	return time;
};
configs.startTime = function() {
	var arr = configs.endTimeStr;
	var time = new Date(new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5]).getTime() - 60 * 60 * 1000);
	return time;
}

configs.statusColor = ["#ADD664", "#F65D2F", "#FFE659", "#D35346"];
configs.busiNameTag = ["产品变更",
	"收费",
	"申请停机"
];
configs.dimension = {
	key: "text",
	value: "_id",
	busiTypeKey: "busiName",
	busiTypeValue: "_id"
};
configs.contentWidth = 960;
configs.Colors = ["#D35346", "#FBC950", "#A1CB45", "#308FC9", "#123174", "#FF0062", "#00A8E0"]
configs.msg = {
	area: "地区",
	channel: "渠道",
	time: "时间:",
	topRealTime: "统计截止时间: ",
	handling: "业务量",
	duration: "业务时长",
	busiDuration: "业务时长",
	rate: "成功率",
	alarm: "告警数",
	sysDuration: "系统时长",
	busiDuration: "业务时长",
	transactionChannel: "交易渠道",
	busiType: "业务类型",
	phone: "手机电话",
	operatorNo: "操作工号",
	statu: "办理状态",
	select: "查询",
	busiProfile: "业务概况",
	look: "查看",
	ruleTypeIsSuccess: "成功率小于",
	ruleTypeIsFailed: "失败次数大于",
	nearly5Minutes: "最近【20笔业务】",
	passLimitSurvey: "概况监控不能超过12条，请重新选择",
	passLimitKeyBusi: "趋势分析不能超过3条，请重新选择"
};
configs.channelId = {
	busiHall: 1,
	eleChannel: 2
};
configs.url = {
	// base
	view_getBusiness: "view_getBusiness",
	getNowTime: "view_getEndTimeStr",
	ajax_busiType: "ajax_busiType",
	ajax_channel: "ajax_channel",
	ajax_city: "ajax_city",
	view_listChannelDim: "view_listChannelDim",
	// busiMoni
	getBusiProfileChart: "ajax_monitor_gauges",
	getBusiProfileAll: "ajax_monitor_generalGrid",
	ajax_monitor_generalGrid: "ajax_monitor_generalGrid",
	getBusiMoitorTrendAnalysis: "ajax_monitor_charts",
	getBusiProfileTime: "page_monitor_time_select",
	alarm_view_listAlarm: "alarm_view_listAlarm",

	//busiTrack 
	getBusiStatus: "ajax_busi_error_type",
	ajax_busiTrack_gen_grid: "ajax_busiTrack_gen_grid",
	view_getCmdList: "view_getCmdList",
	// operationAnalysis
	operationAnalysisChart: "ajax_analysis_gauges",
	ajax_analysis_grid: "ajax_analysis_grid",
	getTrendAnalysisChart: "ajax_analysis_charts",

	// busiTopics
	ajax_specialBusi_gauges: "ajax_specialBusi_gauges",
	ajax_sp_busi_step_select: "ajax_sp_busi_step_select",
	ajax_funnel_stepNames: "ajax_funnel_stepNames",
	ajax_areaChart_Select: "ajax_areaChart_Select",
	ajax_funnel_stepWaitTime: "ajax_funnel_stepWaitTime",
	ajax_funnel_stepBusiTime: "ajax_funnel_stepBusiTime",
	ajax_funnel_stepAmountAndRate: "ajax_funnel_stepAmountAndRate",
	ajax_specialBusi_areaCharts: "ajax_specialBusi_areaCharts",
	ajax_sp_grid: "ajax_sp_grid",
	// configs
	ajax_getConfig: "ajax_getConfig",
	ajax_setConfig: "ajax_setConfig",
	alarm_view_listRule: "alarm_view_listRule",
	alarm_view_updateRules: "alarm_view_updateRules",

	// 
	getStatusChart: "view_detail_listStatusDistribution",
	view_getSuccRateTrandChartData: "view_getSuccRateTrandChartData",
	view_detail_getBusiListDetail: "view_detail_getBusiListDetail",
	ajax_sp_time_select: "ajax_sp_time_select",
	getBusiDetailChart: "view_detail_getBusiListDetailChartData"

};
configs.menu = {
	busiMoitor: "业务监控",
	busiTrack: "业务追踪",
	operationAnalysis: "运营分析",
	busiTopics: "业务专题"
};

configs.menuId = {
	busiMoitor: "busiMoitor",
	busiTrack: "busiTrack",
	operationAnalysis: "operationAnalysis",
	busiTopics: "busiTopics"
};
configs.menu = ["业务监控", "业务追踪", "运营分析", "业务专题"];
configs.childMenu = {
	busiMoitor: ["业务概况", "明细监控"],
	busiConfig: ["监控配置", "告警配置"],
	busiTrack: ["营业厅", "电渠"],
	operationAnalysis: ["营业厅", "电渠"],
	busiTopics: ["营业厅", "电渠"]
};
configs.pageId = {
	busiProfile: "busiProfile",
	detailMoni: "detailMoni",
	busiTrack: "busiTrack",
	operationAnalysis: "operationAnalysis",
	busiTopics: "busiTopics",
	busiConfig: "busiConfig",
	detailMonitor: "detailMonitor"
};
configs.busiProfile = {
	busiProfileTime: "busiProfileTime",
	busiProfileArea: "busiProfileArea"
}
configs.detailMonitor = {
	detailMonitorArea: "detailMonitorArea",
	detailMonitorBusiType: "detailMonitorBusiType",
	detailMonitorTC: "detailMonitorTC"
}
configs.busiProfileGridText = {
	busiName: "业务名称",
	handling: "业务量",
	duration: "业务时长",
	rate: "成功率"
}
configs.busiProfileGridName = {
	busiName: "busi_name",
	handling: "busi_amount",
	duration: "avg_time",
	rate: "succ_rate"

}
configs.busiAlarmGridText = {
	busiName: "业务名称",
	msg: "告警内容",
	time: "首次告警时间",
	duration: "告警次数",
	recentAlarm: "最近告警时间",
	op: "操作"
}
configs.busiAlarmGridName = {
	busiName: "busiName",
	msg: "ruleType",
	time: "lastOccurTime",
	duration: "alarmCount",
	op: "op",
	recentAlarm: "lastOccurTime"
}
configs.busiTrack = {
	startTime: "startTime",
	endTime: "endTime",
	transactionChannel: "transactionChannel",
	busiType: "busiType",
	phone: "phone",
	operatorNo: "operatorNo",
	statu: "statu",


	busiType: "busiTrackBusiType",
	busiTopicsTime: "busiTopicsTime",
	busiStatus: "busiTrackBusiStatus",
	busiTrackTC: "busiTrackTC",
	form: "busiTrackForm"
};
configs.busiTrack.area = "busiTrackArea";
configs.busiTrack.busiProfileGridText = {
	name: "业务类型",
	time: "办理时间",
	transactionChannel: "交易渠道",
	phone: "手机号码",
	operatorNo: "操作工号",
	duration: "业务时长",
	statu: "办理状态",
	op: "操作"
}
configs.busiTrack.busiProfileGridName = {
	name: "busiName",
	time: "ts",
	transactionChannel: "hall",
	phone: "phone",
	operatorNo: "operator",
	duration: "timePeriod",
	statu: "status",
	op: "_id"
};
configs.busiTrack.singleBusiGridText = {
	cmp: "组件",
	command: "命令字",
	commandName: "命令字(未翻译)",
	time: "请求时间",
	duration: "响应时长/ms",
	clientIP: "源IP",
	serverIP: "目标IP",
	recode: "返回码",
	msg: "返回信息"
};
configs.busiTrack.singleBusiGridName = {
	cmp: "intfName",
	command: "cmdLabel",
	commandName: "cmdName",
	time: "reqTime",
	duration: "duration",
	clientIP: "srcIP",
	serverIP: "dstIP",
	recode: "returnCode",
	msg: "returnCodeMsg"
}
configs.operationAnalysis = {
	startTime: "operationAnalysisStartTime",
	endTime: "operationAnalysisEndTime",
	busiType:"operationAnalysisBusiType"
};
configs.operationAnalysis.area = "operationAnalysisArea";
configs.operationAnalysis.operationAnalysisGridText = {
	channel: "业务渠道",
	type: "业务类型",
	userNum: "用户量",
	handling: "业务量",
	rate: "成功率",
	duration: "业务时长",
	op: "操作"
};
configs.operationAnalysis.operationAnalysisGridName = {
	channel: "channel",
	type: "busiName",
	userNum: "user",
	handling: "busi_amount",
	rate: "succ_rate",
	duration: "avg_time",
	op: "operation"


}
configs.busiTopics = {
	busiTopicsBusiType: "busiTopicsBusiType",
	busiTopicsTime: "busiTopicsTime"
};
configs.busiTopics.area = "busiTopicsArea";
configs.busiTopicsGridText = {
	// step: "业务步骤",
	// command: "命令字",
	// handling: "调用量",
	// response: "响应率",
	// rate: "成功率",
	// duration: "响应时长",
	busiRetCode: "返回信息",
	cmdName: "命令字",
	codeType: "状态",
	req_Time: "请求时间",
	res_Time: "响应时间"
};
configs.busiTopicsGridName = {
	// step: "stepName",
	// command: "cmdName",
	// handling: "count",
	// response: "resprate",
	// rate: "successrate",
	// duration: "respTime",
	// 
	busiRetCode: "busiRetCode",
	cmdName: "cmdName",
	codeType: "codeType",
	req_Time: "req_Time",
	res_Time: "res_Time"
};


configs.moitorConfigName = {
	name: "busi_name",
	survey: "grid_display",
	keyBusi: "chart_display"
};
configs.moitorConfigText = {
	name: "业务类型",
	survey: "概况监控",
	keyBusi: "趋势分析"
};
configs.alarmConfigName = {
	name: "busiName",
	duration: "duration",
	rule: "ruleType",
	threshold: "threshold",
	status: "activate",
	sysSuccRate: "sysSuccRate",
	failedCount: "failedCount"
};
configs.alarmConfigText = {
	name: "业务类型",
	duration: "持续时间",
	rule: "规则",
	threshold: "阈值",
	status: "操作"
};

configs.detailMonitorGridName = {
	busiType: "busiType",
	channel: "channel",
	time: "endTime",
	phone: "user",
	operatorNo: "operator",
	duration: "M_effective_time",
	status: "M_QB_status"
};
configs.detailMonitorGridText = {
	busiType: "业务类型",
	channel: "交易渠道",
	time: "办理时间",
	phone: "手机号码",
	operatorNo: "操作工号",
	duration: "业务时长",
	status: "办理状态"
};
configs.stepColor = ["#C81E29", "#ED6C2A", "#F9BF3C", "#A1CA46", "#1674BC", "#00326B", "#82177E"];
configs.stepConfig = {
	lineHeight: 65,
	topHeight: 50,
	stepHeight: 50,
	fontSize: 12
}
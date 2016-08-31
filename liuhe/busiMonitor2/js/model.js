Ext.ns("model");
model.more = {
	getNowTime: function() {
		tools.loadData(configs.url.getNowTime, null, ctrl.setNowTime, null, null);
	},
	getTime: function() {
		tools.loadData(configs.url.getBusiProfileTime, null, ctrl.setTime, null, null);
	},
	getArea: function() {
		tools.loadData(configs.url.ajax_city, null, ctrl.setArea, null, null);
	},
	getChannel: function() {
		tools.loadData(configs.url.ajax_channel, null, ctrl.setChannel, null, null);
	},
	getStatus: function() {
		tools.loadData(configs.url.getBusiStatus, null, ctrl.setStatus, null, null);
	}
};
model.busiMoitor = {
	// getBusiProfileAll: function(params) {
	// 	tools.loadData(configs.url.getBusiProfileAll, params, ctrl.busiMoitor.setBusiProfileAll, null, null);
	// },
	getNowTime: function() {
		tools.loadData(configs.url.getNowTime, null, ctrl.busiMoitor.setNowTime, null, null);
	},
	getBusiProfile: function(params) {

		tools.loadData(configs.url.ajax_monitor_generalGrid, params, ctrl.busiMoitor.setBusiProfile, null, null);
	},
	getBusiAlarm: function(params) {
		tools.loadData(configs.url.alarm_view_listAlarm, params, ctrl.busiMoitor.setBusiAlarm, null, null);
	},
	getBusiProfileChart: function(params) {
		tools.loadData(configs.url.getBusiProfileChart, params, ctrl.busiMoitor.mainTop.setMainTop, null, null);
	},
	getTime: function() {
		tools.loadData(configs.url.getBusiProfileTime, null, ctrl.busiMoitor.setTime, null, null);
	},
	getTrendAnalysis: function(params) {

		tools.loadData(configs.url.getBusiMoitorTrendAnalysis, params, ctrl.busiMoitor.setTrendAnalysis, null, null);
	}
};
model.detailMonitor = {
	getBusiness: function(params) {
		tools.loadData(configs.url.view_getBusiness, params, ctrl.detailMonitor.setBusiness, null, null);
	},
	getNowTime: function() {
		tools.loadData(configs.url.getNowTime, null, ctrl.detailMonitor.setNowTime, null, null);
	},
	getChannel: function(params) {
		tools.loadData(configs.url.view_listChannelDim, params, ctrl.detailMonitor.setChannel, null, null)
	},
	getBusiType: function(params) {
		tools.loadData(configs.url.ajax_getConfig, params, ctrl.detailMonitor.setBusiType, null, null);
	},
	getRateChart: function(params) {
		tools.loadData(configs.url.view_getSuccRateTrandChartData, params, ctrl.detailMonitor.setRateChart, null, null);
	},
	getStatusChart: function(params) {
		tools.loadData(configs.url.getStatusChart, params, ctrl.detailMonitor.setStatusChart, null, null);
	},
	getBusiDetailChart: function(params) {
		tools.loadData(configs.url.getBusiDetailChart, params, ctrl.detailMonitor.setBusiDetailChart, null, null);
	},
	getBusiDetailGrid: function(params, busiName) {
		tools.loadData(configs.url.view_detail_getBusiListDetail, params, ctrl.detailMonitor.setBusiDetailGrid, busiName, null);
	}
};
model.busiTrack = {
	getChannel: function(params) {
		tools.loadData(configs.url.view_listChannelDim, params, ctrl.busiTrack.setChannel, null, null)
	},
	getBusiType: function(params) {
		tools.loadData(configs.url.ajax_busiType, params, ctrl.busiTrack.setBusiType, null, null);
	},
	getBusiTrackList: function(params) {
		tools.loadData(configs.url.ajax_busiTrack_gen_grid, params, ctrl.busiTrack.setBusiTrackList, null, null);
	},
	getBusiTrackSingleBusi: function(params) {
		tools.loadData(configs.url.view_getCmdList, params, ctrl.busiTrack.setSingleBusi, null, null);
	},
	getBusiStatus: function() {
		tools.loadData(configs.url.getBusiStatus, null, ctrl.busiTrack.setBusiStatus, null, null);
	}
};
model.operationAnalysis = {
	getBusiType: function(params){
		tools.loadData(configs.url.ajax_busiType, params, ctrl.operationAnalysis.setBusiType, null, null);
	},
	getBusiProfileList: function(params) {
		tools.loadData(configs.url.ajax_analysis_grid, params, ctrl.operationAnalysis.setBusiProfileList, null, null);
	},
	getChart: function(params) {
		tools.loadData(configs.url.operationAnalysisChart, params, ctrl.operationAnalysis.setChart, null, null)
	},
	getTrendAnalysisChart: function(params) {
		tools.loadData(configs.url.getTrendAnalysisChart, params, ctrl.operationAnalysis.setTrendAnalysisChart, null, null)
	}
};
model.busiTopics = {
	getBusiType: function(params) {
		tools.loadData(configs.url.ajax_sp_busi_step_select, params, ctrl.busiTopics.setBusiType, null, null);
	},
	getTime: function(params) {
		tools.loadData(configs.url.ajax_sp_time_select, params, ctrl.busiTopics.setTime, null, null);
	},
	// 仪表图
	getBusiTopicsBaseChart: function(params) {
		tools.loadData(configs.url.ajax_specialBusi_gauges, params, ctrl.busiTopics.setBusiTopicsBaseChart, null, null);
	},
	// 步骤列表
	getStepList: function(params) {
		tools.loadData(configs.url.ajax_areaChart_Select, params, ctrl.busiTopics.setStepList, null, null);
	},
	// 趋势图表
	getTrendAnalysis: function(params) {
		tools.loadData(configs.url.ajax_specialBusi_areaCharts, params, ctrl.busiTopics.setTrendAnalysis, null, null);
	},
	// 步骤图 
	getStepChartList: function(params) {
		tools.loadData(configs.url.ajax_funnel_stepNames, params, ctrl.busiTopics.setStepChartList, params, null);
	},
	getStepTimeList: function(params) {
		tools.loadData(configs.url.ajax_funnel_stepBusiTime, params, ctrl.busiTopics.setStepTimeList, params, null);
	},
	getStepWaitTimeList: function(params) {

		tools.loadData(configs.url.ajax_funnel_stepWaitTime, params, ctrl.busiTopics.setStepWaitTimeList, params, null);
	},
	getStepRateList: function(params) {
		tools.loadData(configs.url.ajax_funnel_stepAmountAndRate, params, ctrl.busiTopics.setStepRateList, params, null);
	},
	getCommandList: function(params) {
		tools.loadData(configs.url.ajax_sp_grid, params, ctrl.busiTopics.setCommandList, null, null);
	}

};
model.busiConfig = {
	getMoitorConfigList: function(params) {
		tools.loadData(configs.url.ajax_getConfig, params, ctrl.busiConfig.moitorConfig.setMoitorConfigList, null, null);
	},
	updateMoitorConfig: function(params) {
		tools.loadData(configs.url.ajax_setConfig, params, ctrl.busiConfig.moitorConfig.returnUpdateMoitorConfig, null, null);
	},
	getAlarmConfigList: function(params) {
		tools.loadData(configs.url.alarm_view_listRule, params, ctrl.busiConfig.alarmConfig.setAlarmConfigList, null, null);
	},
	updateAlarmConfig: function(params) {
		tools.loadData(configs.url.alarm_view_updateRules, params, ctrl.busiConfig.alarmConfig.returnUpdateAlarmConfig, null, null);
	}
};
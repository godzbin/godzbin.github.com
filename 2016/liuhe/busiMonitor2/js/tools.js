Ext.ns("tools");
tools.toast = function(text) {
	var toast = Ext.toast({
		html: "<div style='font-size: 15px;text-align: center;'>"+text+"</div>",
		title: "",
		width: 300,
		margin: "30 0 0 0",
		align: "t",
		border: false
	});
	setTimeout(function() {
		toast.close(100);
	}, 3000);
};
// html代码转化为纯文本
tools.htmlToText = function(text) {
	var text = text || "";
	text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	return text;
};
tools.setMax = function(maxValue) {
	var obj = {
		max: maxValue,
		//offset: -40,
		tickPositions: [
			0, parseInt(maxValue * 1 / 4), 
			parseInt(maxValue * 2 / 4), 
			parseInt(maxValue * 3 / 4), 
			maxValue
		]
	}
	return obj;
};
tools.setPlotBands = function(maxValue) {
	var plotBands = [{
		id: "gauge_chart1_1",
		from: 0,
		to: parseInt(maxValue * 1 / 4),
		color: '#DBDF02',
		outerRadius: '100%',
		thickness: '20%'
	}, {
		id: "gauge_chart1_2",
		from: parseInt(maxValue * 1 / 4),
		to: parseInt(maxValue * 2 / 4),
		color: '#90C31D',
		outerRadius: '100%',
		thickness: '20%'
	}, {
		id: "gauge_chart1_3",
		from: parseInt(maxValue * 2 / 4),
		to: maxValue,
		color: '#24AD38',
		outerRadius: '100%',
		thickness: '20%'
	}];
	return plotBands;
}
// 兼容火狐
tools.getTimeValue = function(timeStr) {
	timeStr = timeStr || "";
	var time = 0;
	var str1 = timeStr.split(" ")[0];
	var str2 = timeStr.split(" ")[1];
	if (str1 && str2) {
		var arr1 = str1.split("-");
		var arr2 = str2.split(":");
		time = new Date(arr1[0], arr1[1] - 1, arr1[2], arr2[0], arr2[1], arr2[2]).getTime();
	}
	return time;
};
tools.loadings = 0;
tools.loading = function() {
	$(".loading").show();
	tools.loadings++;
};
tools.closeLoading = function() {
	if (tools.loadings == 1) {
		$(".loading").hide();
	}
	tools.loadings--;
};
tools.loadData = function(url, params, callback, callbackParams, Env) {
	tools.loading();
	var Env = Env || "bpcMonitor";
	if (configs.isTest) {
		tools.loadDataTest(url, callback, callbackParams);
	} else {
		var dataUrl = "../../../dataProcess";
		var Env = Env || "bpcEnv";
		var dataParams = {
			FUNC: "view_invokeEnvFunc",
			FUNC_PARAMS: JSON.stringify({
				ENV: Env,
				FUNC: url,
				FUNC_PARAMS: JSON.stringify(params)
			})
		};
		$.ajax({
			url: dataUrl,
			data: dataParams,
			dataType: "JSON",
			type: "POST",
			success: function(data) {
				tools.closeLoading();
				if (data["STATE"] == 1) {
					callback(data["CONTENT"], callbackParams);
				} else {
					// alert(data["ERR_MSG"]);
					tools.toast("请求失败,请刷新");
				}

			},
			error: function(e) {
				tools.toast("请求失败,请刷新");
				tools.closeLoading();
			}
		});
	}
};
tools.loadDataTest = function(url, callback, callbackParams) {
	var data = testData[url];
	if (data) {
		callback(data["CONTENT"], callbackParams);
	} else {
		callback([], callbackParams);
	}
};
tools.dateZerofill = function(time) {
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	var date = time.getDate();
	var hours = time.getHours();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds();
	var timeArray = [year, month, date, hours, minutes, seconds];
	for (var i = 0, l = timeArray.length; i < l; i++) {
		if ((timeArray[i] + "").length < 2) {
			timeArray[i] = "0" + timeArray[i];
		}
	}
	var timeStr = timeArray[0] + "-" + timeArray[1] + "-" + timeArray[2] + " " + timeArray[3] + ":" + timeArray[4] + ":" + timeArray[5];
	return timeStr;
};
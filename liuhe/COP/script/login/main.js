/**
 * create 2016 07 26 godz
 * 
 */

$(function() {
	main.init();

});

var main = {
	url: {
		view_genCode: "view_genCode",
		view_login: "view_login"
	},
	code: "",
	// 初始化监听
	init: function() {
		$("#login-btn").click(main.loginClick);
		$('html').bind('keydown', function(e) {
			if (e.keyCode == 13) {
				main.loginClick();
			}
		});
	},
	// 获取验证码
	getCode: function() {
		$.ajax({
			type: "post",
			url: "../../../dataProcess",
			data: {
				FUNC: main.url.view_genCode,
				FUNC_PARAMS: ""
			},
			dataType: "JSON",
			success: function(data) {
				// var data = JSON.parse(data);
				if (data["STATE"]) {
					main.code = data["CONTENT"];
					main.login();
				} else {
					main.setError(data["ERR_MSG"]);
					main.getCode();
					// alert(data["ERR_MSG"]);
				}
			},
			error: function(e) {
				console.log(e);
			}
		});
	},
	// 登录
	login: function() {
		var username = $("#username").val();
		var password = $("#password").val();
		var code = main.code;
		// 域RDN
		var domain = "COP";
		var _pwd = hex_md5(hex_md5(username + hex_md5(password)) + code.toUpperCase());
		var params = {
			DOMAIN: domain,
			_NAME: username,
			_PWD: _pwd,
			CODE: main.code
		};
		$.ajax({
			type: "post",
			url: "../../../dataProcess",
			data: {
				FUNC: main.url.view_login,
				FUNC_PARAMS: JSON.stringify(params)
			},
			dataType: "JSON",
			success: function(data) {
				// var data = JSON.parse(data);
				console.log(data);
				if (data["STATE"]) {
					main.setError("登录成功");
					window.location.href = "index.html";
				} else {
					main.setError(data["ERR_MSG"]);
				}
			},
			error: function(e) {
				console.log(e);
			}
		});
	},
	// 点击登录 
	loginClick: function() {
		var mainBox = main.getErrorMainBox();
		mainBox.hide();
		var username = $("#username").val();
		var password = $("#password").val();
		if (!username) {
			main.setError("用户名不能为空");
			return;
		}
		if (!password) {
			main.setError("密码不能为空");
			return;
		};
		// 如果是测试模板
		if (tools.test) {
			window.location.href = "index.html";
			return;
		}
		
		main.getCode();
	},
	// 获取错误主Box
	getErrorMainBox: function() {
		var mainBox = $(".main-right-from-errorInfo");
		return mainBox;
	},
	// 写下错误信息
	setError: function(errorText) {
		var mainBox = main.getErrorMainBox();
		mainBox.show();
		var box = $(".main-right-from-errorInfo span");
		box.html("");
		box.html(errorText || "");
	}

}
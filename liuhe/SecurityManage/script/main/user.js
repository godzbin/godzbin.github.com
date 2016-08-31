/**
 * create 20160801
 * godz
 *
 * 获取用户信息
 */
function User() {
	this.userInfo = {};
	this.getUserInfo = function() {
		tools.getData(configes.url.view_getSelfInfo, null, this.setUserInfo, this);
	};
	this.setUserInfo = function(data, that) {
		that.userInfo = data;
		that.userInfo.isLogin = true;
		main.securityManage.getDomain();
		main.userSelfBtn && main.userSelfBtn.setUserInfoBtnText(data["_NICK_NAME"]);
	};
	
}
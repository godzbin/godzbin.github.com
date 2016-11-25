var App = App || {};
App.wechatPay = function() {
	var defaultUserDate = {
		"list": [],
		"price": 1,
		"discountArr": [],
		"deviceType": 0,
		"maxCoinCount": 30,
		"coinNum": 1, //单次币数
		"coinPrice": 100,
		"deviceMac":"",
	};
	var userData = userData || defaultUserDate;
	(function initList() {
		for (var i = 0, length = userData.list.length; i < length; i++) {
			if (userData.list[i] && userData.list[i].count === 1) {
				userData.list.splice(i, 1);
			}
		}
	})();

	function AllPay() {
		var that = this;
		this.isOther = false;
		this.feeClassName = "packages-box-main-package";
		var dom = document;
		this.feeDemo = dom.getElementById("feeDemo").innerHTML;

		this.feeMainEl = dom.getElementById("packagesBoxMain");
		this.feeMainEl.addEventListener("touchstart", this.feeMainElClick.bind(this));
		this.macEl = dom.getElementById("mac");
		this.coinPriceEl = dom.getElementById("coinPrice");
		this.coinNumEl = dom.getElementById("coinNum");
		this.payMoneyEl = dom.getElementById("payMoney");
		this.duibiNumberEl = dom.getElementById("duibiNumber");
		this.duibiNumberText = dom.getElementById("duibiNumberText");
		this.pulsEl = dom.getElementById("puls");
		this.minusEl = dom.getElementById("minus");
		this.duibiNumberToMoreEl = dom.getElementById("duibiNumberToMore");
		this.buttonDuibiNumberEl = dom.getElementById("buttonDuibiNumber");


		this.showConfirmPayEl = dom.getElementById("showConfirmPay");
		this.showConfirmPayEl.addEventListener("touchstart", this.showPayDialog.bind(this));

		this.pulsEl.addEventListener("touchstart", this.puls.bind(this));
		this.minusEl.addEventListener("touchstart", this.minus.bind(this));

		this.confirmPayBtnEl = dom.getElementById("confirmPay");
		this.confirmPayBtnEl.addEventListener("touchstart", this.confirmPay.bind(this));



		this.loadingEl = dom.getElementById("DialogLoading");
		this.alertDialogEl = dom.getElementById("alertDialog");
		this.alertDialogCloseEL = dom.getElementById("alertDialogClose");
		this.alertDialogCloseEL.addEventListener("touchstart", this.hideAlertDialog.bind(this));

		this.payDialogEl = dom.getElementById("payDialog");
		this.payDialogCloseEl = dom.getElementById("payDialogClose");
		this.payDialogCloseEl.addEventListener("touchstart", this.hidePayDialog.bind(this));
		this.selectFee = userData.list.length ? userData.list[0] : {
			pulseNum: userData.coinNum,
			fee: userData.coinPrice * userData.coinNum,
			count: 1
		};



		this.payCountBoxEl = dom.getElementById("payCountBox");
		this.payCountEl = dom.getElementById("payCount");
		this.payFeeEl = dom.getElementById("payFee");
		this.payPulseEl = dom.getElementById("payPulse");

		this.paySuccessDialogEl = dom.getElementById("paySuccessDialog");
		this.paySuccessCloseEl = dom.getElementById("paySuccessClose");
		this.paySuccessCloseEl.addEventListener("touchstart", this.hidePaySuccessDialog.bind(this));
		this.initSelectValue = 2000;
	};
	AllPay.prototype = {
		//  初始化界面
		init: function() {
			this.initDuiBiBox();
			this.listSort();
			this.setMac();
			this.setCoinPrice();
			this.setFeeList();
			this.initSelect();
		},
		// 加次数或者币数
		puls: function(e) {
			e.preventDefault();
			var coinPrice = userData.coinPrice;
			var coinNum = userData.coinNum;
			var maxCoinCount = userData.maxCoinCount;
			if (this.selectFee.pulseNum && this.selectFee.pulseNum > maxCoinCount - coinNum) return;
			if (this.isOther) {
				this.selectFee.count++;
				this.selectFee.pulseNum = coinNum * this.selectFee.count;
				this.selectFee.fee = coinPrice * this.selectFee.pulseNum;
			} else {
				this.selectFee.pulseNum++;
				this.selectFee.count++;
				this.selectFee.fee = coinPrice * this.selectFee.pulseNum;
			}
			this.setSelectFeeInfo();
			if (this.isOther) {
				var index = this.selectFeeOfIndex(this.isOther, this.selectFee.count);
			} else {
				var index = this.selectFeeOfIndex(this.isOther, this.selectFee.pulseNum);
			}

			this.selectFeeEl(index);
		},
		// 减次数或者币数
		minus: function(e) {
			e.preventDefault();
			var coinPrice = userData.coinPrice;
			var coinNum = userData.coinNum;
			var num = 0;
			if (this.isOther) {
				num = this.selectFee.count;
			} else {
				num = this.selectFee.pulseNum;
			}
			if (num === 1) return;
			if (this.selectFee.count === 1) return;
			if (this.isOther) {
				this.selectFee.count--;
				this.selectFee.pulseNum = coinNum * this.selectFee.count;
				this.selectFee.fee = coinPrice * this.selectFee.pulseNum;
			} else {
				this.selectFee.pulseNum--;
				this.selectFee.count = this.selectFee.pulseNum;
				this.selectFee.fee = coinPrice * this.selectFee.pulseNum;
			}
			this.setSelectFeeInfo();
			if (this.isOther) {
				var index = this.selectFeeOfIndex(this.isOther, this.selectFee.count);
			} else {
				var index = this.selectFeeOfIndex(this.isOther, this.selectFee.pulseNum);
			}

			this.selectFeeEl(index);
		},
		// 获取该币数的套餐索引
		selectFeeOfIndex: function(isOther, num) {
			var list = userData.list;
			var length = list.length;
			for (var i = 0; i < length; i++) {
				if (isOther) {
					if (list[i].count === num) {
						return i;
					}
				} else {
					if (list[i].pulseNum === num) {
						return i;
					}
				}
			}
			return null;
		},
		// 初始化兑币盒子
		initDuiBiBox: function() {
			var coinNum = userData.coinNum;
			var coinPrice = userData.coinPrice;
			var el = this.duibiBoxEl;
			if (coinPrice === 100 && coinNum === 1) {
				this.duibiNumberText.innerText = "币数";
				this.isOther = false;
			} else {
				this.duibiNumberText.innerText = "次数";
				this.isOther = true;
			}
		},
		// 数组排列
		listSort: function() {
			userData.list.sort(function(a, b) {
				// return b.fee - a.fee;
				return a.fee - b.fee;
			});
		},
		// 初始化选择
		// 默认选中规则：若套餐内有20元套餐，默认选中；若无选中价格倒数第二小的套餐。
		initSelect: function() {
			// var initSelect = this.hasInitSelectValue();
			// if (initSelect !== null) {
			//     this.selectFeeEl(initSelect);
			// } else if (userData.list.length >= 2) {
			//     this.selectFeeEl(userData.list.length - 2);
			//     this.selectFeeEl(0);
			// } else if (userData.list.length === 1) {
			//     this.selectFeeEl(0);
			// } else {
			//     this.setSelectFeeInfo();
			// }
			if (userData.list.length > 0) {
				this.selectFeeEl(0);
			} else {
				this.selectToSing();
				this.setSelectFeeInfo();
			}
		},
		hasInitSelectValue: function() {
			var length = userData.list.length;
			var value = this.initSelectValue;
			for (var i = 0; i < length; i++) {
				if (userData.list[i].fee === value) {
					return i;
				}
			}
			return null;
		},
		// 转价格 分 为 元
		parseFee: function(fee) {
			if (fee && fee != "") {
				if (fee % 100) {
					fee = parseFloat(fee / 100).toFixed(2);
				} else {
					fee = parseInt(fee / 100);
				}
			}
			return fee;
		},
		// 写下mac编号
		setMac: function() {
			var mac = userData.deviceMac.toString();
			var minMac = mac.substr(mac.length - 5)
			this.macEl.innerText = minMac;
		},
		// 写下单币价格
		setCoinPrice: function() {
			var coinPrice = this.parseFee(userData.coinPrice * userData.coinNum);
			var coinNum = userData.coinNum;
			this.coinNumEl.innerText = coinNum;
			this.coinPriceEl.innerText = coinPrice;
		},
		// 写下套餐列表
		setFeeList: function() {
			var fees = [];
			var list = userData.list;
			var coinPrice = userData.coinPrice
			var feeLength = list.length;
			for (var i = 0; i < feeLength; i++) {
				var pulseNum = "";
				if (this.isOther) {
					pulseNum = list[i].count + "次";
				} else {
					pulseNum = list[i].pulseNum + "币";
				}
				var giveNum = list[i].pulseNum * coinPrice - list[i].fee;
				var display = "";
				if (giveNum > 0) {
					display = "block";
				} else {
					display = "none";
				}
				var fee_html = this.feeDemo.replace(/{{index}}/g, i)
					.replace(/{{fee}}/g, this.parseFee(list[i].fee))
					.replace(/{{pulseNum}}/g, pulseNum)
					.replace(/{{display}}/g, display)
					.replace(/{{giveNum}}/g, this.parseFee(giveNum));
				fees.push(fee_html);
			}
			this.feeMainEl.innerHTML = fees.join("");
		},
		// 当套餐被点击是，设置选择套餐的为ative
		feeMainElClick: function(e) {
			e.stopPropagation();
			var target = e.target;
			var className = this.feeClassName;
			if (target.className.indexOf("active") !== -1) {
				this.initFeeMain();
				this.selectToSing();
				return;
			}
			if (target.className.indexOf(className) !== -1) {
				this.initFeeMain();
				target.className = target.className + " active";
				var index = target.getAttribute("index");
				var fee = userData.list[index]
				this.selectFee = {
					fee: fee.fee,
					pulseNum: fee.pulseNum,
					count: fee.count
				};
				this.setSelectFeeInfo();
			}
		},
		selectToSing: function() {
			var coinNum = userData.coinNum;
			var coinPrice = userData.coinPrice;
			this.selectFee = {
				count: 1,
				fee: coinPrice * coinNum,
				pulseNum: coinNum
			};
			this.setSelectFeeInfo();
		},
		// 重置套餐选择
		initFeeMain: function() {
			var length = this.feeMainEl.children.length;
			for (var i = 0; i < length; i++) {
				var el = this.feeMainEl.children[i];
				el.className = this.feeClassName;
			}
		},
		// 设置选择套餐信息
		setSelectFeeInfo: function() {
			var fee = this.selectFee;
			this.payMoneyEl.innerText = this.parseFee(fee.fee) + "元";
			if (this.isOther) {
				this.duibiNumberEl.innerText = fee.count;
				this.duibiNumberToMoreEl.innerText = fee.pulseNum + "币";
			} else {
				this.duibiNumberEl.innerText = fee.pulseNum;
			}
			if (fee.pulseNum >= 10) {
				this.buttonDuibiNumberEl.innerText = fee.pulseNum;
			} else {
				this.buttonDuibiNumberEl.innerText = "0" + fee.pulseNum;
			}

		},
		// 选择某个套餐
		selectFeeEl: function(index) {
			this.initFeeMain();
			if (index === null) return;
			var feeId = "fee" + index;
			var feeEl = document.getElementById(feeId);
			feeEl && (feeEl.className = feeEl.className + " active");
			var fee = userData.list[index]
			this.selectFee = {
				fee: fee.fee,
				pulseNum: fee.pulseNum,
				count: fee.count
			};
			this.setSelectFeeInfo();
		},
		confirmPay: function() {
			if (!this.selectFee.fee) {
				return;
			}
			this.toPay();
		}
	};
	AllPay.prototype.hidePaySuccessDialog = function() {
		this.paySuccessDialogEl.style.display = "none";
	};
	AllPay.prototype.showPaySuccessDialog = function() {
		this.paySuccessDialogEl.style.display = "block";
	};
	AllPay.prototype.showLoading = function() {
		var el = this.loadingEl;
		el.style.display = "block";
		setTimeout(function() {
			el.style.display = "none";
		}, 3000);
	};
	AllPay.prototype.showPayDialog = function() {
		var el = this.payDialogEl;
		if (this.isOther) {
			this.payCountBoxEl.style.display = "block";
		} else {
			this.payCountBoxEl.style.display = "none";
		}
		this.payCountEl.innerText = this.selectFee.count;
		this.payPulseEl.innerText = this.selectFee.pulseNum;
		this.payFeeEl.innerText = (this.selectFee.fee / 100).toFixed(2) || 0;

		el.style.display = "block";
	};
	AllPay.prototype.hidePayDialog = function() {
		var el = this.payDialogEl;
		el.style.display = "none";
	};
	AllPay.prototype.closeLoading = function() {
		this.loadingEl.style.display = "none";
	};
	AllPay.prototype.isShowAlertDialog = function(msg) {
		var info = this.alertDialogEl.getElementsByClassName("dialogAlertInfo")[0];
		info.innerText = msg;
		this.alertDialogEl.style.display = "block";
	};
	AllPay.prototype.hideAlertDialog = function() {
		this.alertDialogEl.style.display = "none";
	};
	AllPay.prototype.toPay = function() {
		var self = this;
		var parseData = function(dataObj) {
			var data = "";
			for (var key in dataObj) {
				data += key + "=" + dataObj[key] + "&";
			}
			return data.substring(0, data.length - 1);
		};
		var json = {
			"deviceId": userData.deviceId,
			"deviceMac": userData.deviceMac,
			"openId": userData.openId,
			"count": self.selectFee.count,
			"auth_token": userData.auth_token
		};
		this.showLoading();
		this.hidePayDialog();
		util.ajax({
			url: "./payment/toWechatPay",
			type: "POST",
			async: true,
			data: parseData(json),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function(data) {
				var _this = this;
				data = JSON.parse(data);
				self.closeLoading();
				console.log(data.code);
				if (data.code !== '200') {
					self.isShowAlertDialog(data.msg);
				} else {
					WeixinJSBridge.invoke('getBrandWCPayRequest', data.result, function(res) {
						self.closeLoading();
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							self.closeLoading();
							self.showPaySuccessDialog();
							self.init();
						}
					});
				}
			},
			error: function(error) {
				console.log(error);
			}
		});
	};
	this.page = new AllPay();
}
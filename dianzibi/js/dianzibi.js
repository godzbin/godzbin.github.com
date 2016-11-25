var App = App || {};
App.dianzibi_app = function() {
	var defaultUserData = {
		'deviceList': [],
		"coinNum": 1, //单次币数
		"coinPrice": 200,
		"deviceType": 0,
		"maxCoinCount": 30,
		// 余币
		"remainCoin": 10,
		"deviceId": 10,
		"feeList": []
	}
	var userData = userData || defaultUserData;
	(function test() {
		for (var i = 1; i < 22; i++) {
			userData.deviceList.push({
				deviceId: i,
				deviceName: String.fromCharCode(64 + parseInt(i)),
				coinNum: Math.random() > 0.8 ? 2 : 1,
				status: Math.random() > 0.9 ? false : true,
				maxCoinCount: 30
			});
		}
		var arr = [100, 500, 1000, 2000, 5000, 10000]
			// var arr = []
		for (var j = 0; j < arr.length; j++) {
			userData.feeList.push({
				count: arr[j] / 100,
				fee: arr[j],
				pulseNum: arr[j] / 100 + 1
			})
		}
	})();

	function getRandomTest() {
		var recordListTest = [];
		for (var k = 0; k < 5; k++) {
			var i = parseInt(Math.random() * 24);
			recordListTest.push({
				time: "2016-11-20 21:28:45",
				address: "这是测试" + String.fromCharCode(64 + parseInt(i)),
				device: String.fromCharCode(64 + parseInt(i)),
				type: Math.random() > 0.5 ? 0 : 1,
				coin: parseInt(Math.random() * 30),
				remainCoin: parseInt(Math.random() * 100),
				status: Math.random() > 0.9 ? false : true
			})
		}
		return recordListTest;
	}
	var configs = App.configs.dianzibi;

	function AllPay() {
		var that = this,
			dom = document,
			touch = "touchstart",
			touchMove = "touchmove",
			touchEnd = "touchend";

		this.currPage = 0;
		this.sPos = {};
		this.mPos = {};
		this.selectDevice = {};
		this.currCoinNum = 0;
		this.countDown = 3;
		//头部  余币/单币价格
		this.remainCoinEl = dom.getElementById("dianzibi-remainCoin");
		this.btnCoinPriceEl = dom.getElementById("dianzibi-btnCoinPrice");
		// 设备列表
		this.deviceListDemoText = dom.getElementById("dianzibi-deviceListDemo").innerHTML;
		this.deviceListEl = dom.getElementById("dianzibi-deviceList");
		this.deviceListMainEl = dom.getElementById("dianzibi-deviceListMain");
		this.deviceListMainEl.addEventListener(touch, this.deviceListTouchStart.bind(this));
		this.deviceListMainEl.addEventListener(touchMove, this.deviceListTouchMove.bind(this));
		this.deviceListMainEl.addEventListener(touchEnd, this.deviceListTouchEnd.bind(this));
		this.deviceListSpotEl = dom.getElementById("dianzibi-deviceListSpot");
		this.deviceListUpEl = dom.getElementById("dianzibi-deviceListUp");
		this.deviceListDownEl = dom.getElementById("dianzibi-deviceListDown");
		this.deviceListUpEl.addEventListener(touch, this.deviceListUp.bind(this));
		this.deviceListDownEl.addEventListener(touch, this.deviceListDown.bind(this));

		// 投币盒子
		this.currCoinNumEl = dom.getElementById("dianzibi-currCoinNum");
		this.minusEl = dom.getElementById("dianzibi-minus");
		this.plusEl = dom.getElementById("dianzibi-plus");
		this.minusEl.addEventListener(touch, this.minusCoinNum.bind(this));
		this.plusEl.addEventListener(touch, this.plusCoinNum.bind(this));

		this.coinNumBtnEl = dom.getElementById("dianzibi-coinNumBtn");
		this.coinNumBtnEl.addEventListener(touch, this.putCoin.bind(this));


		// 电子币套餐
		this.feeListDemoText = dom.getElementById("dianzibi-feeListDemo").innerHTML;
		this.buyCoinWinCoinPriceEl = dom.getElementById("dianzibi-buy-coin-win-coin-price");
		this.feeListEl = dom.getElementById("dianzibi-feeList");
		this.feeListEl.addEventListener(touch, this.touchFeeList.bind(this));

		this.confirmBuyWinShowBtn = dom.getElementById("dianzibi-confirm-buy-win-show");
		this.confirmBuyWinShowBtn.addEventListener(touch, this.showConfirmBuyWin.bind(this));
		// 弹窗
		this.buyCoinWinEl = dom.getElementById("dianzibi-buy-coin-win");
		this.buyCoinWinCloseBtn = dom.getElementById("dianzibi-buy-coin-win-close");
		this.buyCoinWinCloseBtn.addEventListener(touch, this.hideBuyCoinWin.bind(this));
		this.buyCoinWinShowBtn = dom.getElementById("dianzibi-buy-coin-win-show");
		this.buyCoinWinShowBtn.addEventListener(touch, this.showBuyCoinWin.bind(this));

		this.successPutCoinEl = dom.getElementById("dianzibi-success-put-coin");
		this.successBuyEl = dom.getElementById("dianzibi-success-buy");
		this.coinInsufficientEl = dom.getElementById("dianzibi-coin-insufficient");
		this.confirmBuyWinEl = dom.getElementById("dianzibi-confirm-buy-win");
		this.confirmBuyWinEl.getElementsByClassName("win-close")[0].addEventListener(touch, this.hideConfirmBuyWin.bind(this));
		this.confirmBuyWinEl.getElementsByClassName("confirm-btn")[0].addEventListener(touch, this.toPay.bind(this));
		this.recordWinEl = dom.getElementById("dianzibi-record-win");
		this.showRecordWinBtn = dom.getElementById("dianzibi-record-win-show");
		this.showRecordWinBtn.addEventListener(touch, this.showRecordWinEl.bind(this));
		this.recordWinEl.getElementsByClassName("retrun-btn")[0].addEventListener(touch, this.hideRecordWinEl.bind(this));
		this.recordUpBtn = this.recordWinEl.getElementsByClassName("up-btn")[0];
		this.recordDownBtn = this.recordWinEl.getElementsByClassName("down-btn")[0];
		this.recordUpBtn.addEventListener(touch, this.recordUp.bind(this));
		this.recordDownBtn.addEventListener(touch, this.recordDown.bind(this));
		// DialogLoading
		this.DialogLoading = dom.getElementById("DialogLoading");


		this.getRecordListDemo = function(){
			return dom.getElementById("dianzibi-recordListDemo");
		}
	}
	AllPay.prototype = {
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
		// 初始化
		init: function() {
			// 设置设备列表的分页盒子
			this.setDeviceListBox();
			this.setDeviceListSpotList();
			// 关闭loading
			this.closeLoading();
			// 初始化套餐列表
			this.initFeeList();
			// 设置余币，当余币为零时，弹出购币
			this.setRemainCoin();
			// 设置单币价格
			this.setCoinPrice();
			// 设置设备列表
			this.initDeviceList();
			// 设置当前选中的设备
			this.setDeviceListActive(userData.deviceId);
		},
		// 设置头部单币价格
		setCoinPrice: function() {
			this.btnCoinPriceEl.innerText = this.parseFee(userData.coinPrice);
			this.buyCoinWinCoinPriceEl.innerText = this.parseFee(userData.coinPrice);
		},
		// 设置设备列表分页盒子
		setDeviceListBox: function() {
			var width = this.deviceListMainEl.parentNode.offsetWidth;
			var pages = Math.ceil(userData.deviceList.length / 9);
			for (var i = 0; i < pages; i++) {
				var box = document.createElement("div");
				box.className = "list-main-box-child list-main-box-child" + i;
				box.style.width = width + "px";
				var new_box = this.deviceListEl.appendChild(box);
			}
		},
		// 设置余币
		setRemainCoin: function() {
			this.remainCoinEl.innerText = (userData.remainCoin || 0);
			if (!userData.remainCoin) {
				this.showBuyCoinWin();
			}
		},
		// 初始化设备列表
		initDeviceList: function() {
			var list = userData.deviceList;
			var length = list.length;
			var deviceIndex = this.findDeviceIndexInList(userData.deviceId);
			if (length > 9) {
				var newList = [];
				if (deviceIndex > 3 && deviceIndex < length - 4) {
					this.currPage = parseInt((deviceIndex + 4) / 9);
					newList = list.slice(deviceIndex - 4, deviceIndex + 5);
				} else if (deviceIndex > 3 && deviceIndex >= length - 4) {
					this.currPage = parseInt(length / 9);
					newList = list.slice(length - 9, length);
				} else {
					newList = list.slice(0, 9);
				}
				this.setDeviceList(newList);
			} else {
				this.setDeviceList(list);
			}

			this.setDeviceListSpotActive(this.currPage);
		},
		// 初始化套餐列表
		initFeeList: function() {
			var fee_msg = configs.feeList;
			var demo_html = this.feeListDemoText;
			var html_arr = [];
			var list = userData.feeList;
			var coinPrice = userData.coinPrice;
			var length = list.length;
			for (var i = 0; i < length; i++) {
				var give = list[i][fee_msg.pulseNum] - Math.ceil(list[i][fee_msg.fee] / coinPrice);
				var display = give > 0 ? "inline-block" : "none";
				var html = demo_html.replace(/{{fee}}/g, this.parseFee(list[i][fee_msg.fee]))
					.replace(/{{pulseNum}}/g, list[i][fee_msg.pulseNum])
					.replace(/{{index}}/g, i)
					.replace(/{{giveNum}}/g, give)
					.replace(/{{display}}/g, display);
				html_arr.push(html);
			}
			this.feeListEl.innerHTML = html_arr.join("") || "暂无套餐";
			this.initFeeListSelect();
			length > 0 && this.setFeeListActive(0);
		},
		// 初始化套餐选择
		initFeeListSelect: function() {
			var childrens = this.feeListEl.children;
			var length = childrens.length;
			for (var i = 0; i < length; i++) {
				childrens[i].className = childrens[i].className.replace(/active/g, "");
			}
		},
		setFeeListActive: function(index) {
			var childrens = this.feeListEl.children;
			childrens[index].className += " active";
			this.selectFee = userData.feeList[index];
		},
		touchFeeList: function(e) {
			e.preventDefault();
			var target = e.target;
			if (target.className.indexOf("fee-info") > -1) {
				var index = target.getAttribute("index");
				this.initFeeListSelect();
				this.setFeeListActive(index);
			}
		},
		// 写下设备列表
		setDeviceList: function(list, type) {
			var device_msg = configs.deviceList;
			var length = list.length;
			var html_arr = [];
			var mode = this.deviceListDemoText;
			for (var i = 0; i < length; i++) {
				var new_html = mode.replace(/{{index}}/g, list[i][device_msg.deviceId])
					.replace(/{{deviceName}}/g, list[i][device_msg.deviceName])
					.replace(/{{coinNum}}/g, list[i][device_msg.coinNum])
					.replace(/{{disable}}/g, list[i][device_msg.status] ? "" : "disable");
				html_arr.push(new_html);
			};
			var box = this.deviceListEl.getElementsByClassName("list-main-box-child" + this.currPage)[0];
			box.innerHTML = html_arr.join("");
			if (!type) {
				this.deviceListEl.style.transition = "none";
			} else {
				this.deviceListEl.style.transition = "left .5s";
			}
			this.deviceListEl.style.left = -(parseInt(box.offsetWidth) * this.currPage) + "px";
			this.selectDevice = {};
			this.currCoinNum = 0;
			this.setCoinNum();
		},
		setDeviceListSpotList: function() {
			var length = userData.deviceList.length;
			var pageNum = Math.ceil(length / 9);
			var html_arr = [];
			for (var i = 0; i < pageNum; i++) {
				var html = '<div class="spot"></div>';
				html_arr.push(html);
			}
			this.deviceListSpotEl.innerHTML = html_arr.join("");
			var parentNodeWidth = this.deviceListSpotEl.parentNode.offsetWidth;
			var spotListWidth = this.deviceListSpotEl.offsetWidth;
			this.deviceListSpotEl.style.left = (parentNodeWidth - spotListWidth) / 2 + "px";
		},
		setDeviceListSpotActive: function(index) {
			var childrens = this.deviceListSpotEl.children;
			var length = childrens.length;
			for (var i = 0; i < length; i++) {
				childrens[i].className = "spot";
			}
			childrens[index].className = "spot active";
		},
		// 获取设备在列表中的位置
		findDeviceIndexInList: function(deviceId) {
			var device_msg = configs.deviceList;
			var list = userData.deviceList;
			var length = list.length;
			for (var i = 0; i < length; i++) {
				if (list[i][device_msg.deviceId] == deviceId) {
					return i;
				}
			}
		},
		setDeviceListActive: function(deviceId) {
			var childrens = this.deviceListEl.getElementsByClassName("list-main-box-child" + this.currPage)[0].children;
			var length = childrens.length;
			for (var i = 0; i < length; i++) {
				childrens[i].className = childrens[i].className.replace(/active/g, "");
				if (childrens[i].getAttribute("index") == deviceId) {
					if (!this.getDevice(deviceId).status) {
						return;
					}
					this.selectDevice = this.getDevice(deviceId);
					this.currCoinNum = this.selectDevice.coinNum;
					this.setCoinNum();
					childrens[i].className += " active";
				}
			}
		},
		// 获取设备信息
		getDevice: function(deviceId) {
			var device_msg = configs.deviceList;
			var list = userData.deviceList;
			var length = list.length;
			for (var i = 0; i < length; i++) {
				if (list[i][device_msg.deviceId] == deviceId) {
					return list[i];
				}
			}
		},
		// 上一页
		deviceListUp: function(e) {
			e && e.preventDefault();
			if (this.currPage == 0) {
				return;
			}
			this.currPage--;
			this.isBtnShow();
			this.changeDeviceListUp();
		},
		// 下一页
		deviceListDown: function(e) {
			e && e.preventDefault();
			if (this.currPage == Math.ceil(userData.deviceList.length / 9) - 1) {
				return;
			}
			this.currPage++;
			this.isBtnShow();
			this.changeDeviceListDown();
		},
		// 控制按钮是否显示
		isBtnShow: function() {
			if (this.currPage == 0) {
				this.deviceListUpEl.style.opacity = 0.2;
			} else {
				this.deviceListUpEl.style.opacity = 1;
			}
			if (this.currPage == Math.ceil(userData.deviceList.length / 9) - 1) {
				this.deviceListDownEl.style.opacity = 0.2;
			} else {
				this.deviceListDownEl.style.opacity = 1;
			}
		},
		// 向上改变设备列表
		changeDeviceListUp: function() {
			var list = userData.deviceList;
			if (list.length === 0) return;
			var box = this.deviceListEl.getElementsByClassName("list-main-box-child" + (this.currPage + 1))[0];
			var firstChild = box.children[0];
			var deviceId = firstChild.getAttribute("index");
			var deviceIndex = this.findDeviceIndexInList(deviceId);
			var newList = [];
			if (deviceIndex > 9) {
				newList = list.slice(deviceIndex - 9, deviceIndex);
			} else {
				newList = list.slice(0, 9);
			}
			this.setDeviceList(newList, "right");
			this.setDeviceListSpotActive(this.currPage);
		},
		// 向下改变设备列表
		changeDeviceListDown: function() {
			var list = userData.deviceList;
			if (list.length === 0) return;
			var box = this.deviceListEl.getElementsByClassName("list-main-box-child" + (this.currPage - 1))[0];
			var length = box.children.length;
			var lastChild = box.children[length - 1];
			var deviceId = lastChild.getAttribute("index");
			var deviceIndex = this.findDeviceIndexInList(deviceId);
			var newList = [];
			if (list.length - deviceIndex > 9) {
				newList = list.slice(deviceIndex + 1, deviceIndex + 10);
			} else {
				newList = list.slice(list.length - 9, list.length);
			}
			this.setDeviceList(newList, "left");
			this.setDeviceListSpotActive(this.currPage);
		},
		// 当手指滑动时，计算滑动值;
		// 手势滑动或者点击
		deviceListTouchStart: function(e) {
			e.preventDefault();
			var point = e.touches ? e.touches[0] : e;
			this.sPos.x = point.screenX;
			this.mPos.x = point.screenX;
		},
		// 
		deviceListTouchMove: function(e) {
			e.preventDefault();
			var point = e.touches ? e.touches[0] : e;
			this.mPos.x = point.screenX;
		},
		// 
		deviceListTouchEnd: function(e) {
			e.preventDefault();
			var move = this.sPos.x - this.mPos.x;
			if (Math.abs(move) > 50) {
				if (move > 0) {
					this.deviceListDown();
				} else {
					this.deviceListUp();
				}
				return;
			} else if (Math.abs(move) < 10) {
				var target = e.target;
				var className = target.className;
				if (className.indexOf("list-box") === -1) {
					return;
				}
				if (className.indexOf("disable") > -1) {
					return;
				}
				var deviceId = target.getAttribute("index");
				this.setDeviceListActive(deviceId);
			}
		},
		// 手势滑动或者点击  end

		// 设置币数
		setCoinNum: function() {
			this.currCoinNumEl.innerText = this.currCoinNum ? this.currCoinNum + "币" : "?";
		},
		// 减币数
		minusCoinNum: function(e) {
			e && e.preventDefault();
			var device_msg = configs.deviceList;
			if (!this.currCoinNum) {
				return;
			}
			if (this.currCoinNum == this.selectDevice[device_msg.coinNum]) {
				return;
			}
			this.currCoinNum -= this.selectDevice[device_msg.coinNum];
			this.setCoinNum();
		},
		// 加币数
		plusCoinNum: function(e) {
			e && e.preventDefault();
			var device_msg = configs.deviceList;
			if (!this.currCoinNum) {
				return;
			}
			if (this.currCoinNum == this.selectDevice[device_msg.maxCoinCount]) {
				return;
			}
			this.currCoinNum += this.selectDevice[device_msg.coinNum];
			this.setCoinNum();
		},
		// 投币
		putCoin: function(e) {
			e && e.preventDefault();
			var device_msg = configs.deviceList;
			if (!this.selectDevice[device_msg.deviceId]) {
				// 请选择设备
				this.countDown = 1.5;
				this.showEorreWin("请选择设备");
				return;
			}
			if (userData.remainCoin < this.currCoinNum) {
				//余币不足
				this.coinInsufficientEl.style.display = "block";
				this.hideWin(this.coinInsufficientEl, 3);
				return;
			}
			// 调用投币接口
			// --------------------------------------------------------------------------------------
			this.showLoading();
			setTimeout(this.putCoinSuccess.bind(this), 1000);
			return;
			// 成功后减币数，并判断是否为零
			var device_msg = configs.deviceList;
			var self = this;
			var json = {
				openId: userData.openId,
				coinNum: this.currCoinNum,
				deviceId: this.selectDevice[device_msg.deviceId],

			};
			util.ajax({
				url: configs.url.putCoin,
				type: "POST",
				async: true,
				data: this.parseData(json),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: function(data) {
					data = JSON.parse(data);
					self.closeLoading();
					console.log(data.code);
					if (data.code !== '200') {
						self.showEorreWin(data.msg);
					} else {
						self.putCoinSuccess();
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		},
		// 封装请求数据
		parseData: function(obj) {
			var data_arr = [];
			for (var key in obj) {
				var data = key + "=" + obj[key];
				data_arr.push(data);
			}
			return data.join("&");
		},
		// 投币成功
		putCoinSuccess: function() {
			this.closeLoading();
			var pleaseBuyCoin = this.successPutCoinEl.getElementsByClassName("pleaseBuyCoin")[0],
				device = this.successPutCoinEl.getElementsByClassName("device")[0],
				coin = this.successPutCoinEl.getElementsByClassName("coin")[0];
			userData.remainCoin -= this.currCoinNum;
			if (userData.remainCoin === 0) {
				pleaseBuyCoin.style.display = "block";
				this.showBuyCoinWin();
			} else {
				pleaseBuyCoin.style.display = "none";
			}
			device.innerText = this.selectDevice.deviceName;
			coin.innerText = this.currCoinNum;
			this.setRemainCoin();
			this.successPutCoinEl.style.display = "block";
			this.hideWin(this.successPutCoinEl, 3);
			this.currCoinNum = this.selectDevice.coinNum;
			this.setCoinNum();
		},
		// 倒计时隐藏窗口
		hideWin: function(win, countDown) {
			var countDownEl = win.getElementsByClassName("countDown")[0];
			countDownEl.innerText = countDown + "s";
			win.style.opacity = 1;
			setTimeout(function() {
				if (countDown <= 1) {
					win.style.opacity = 0;
					setTimeout(function() {
						win.style.display = "none";
					}, 200);
				} else {
					countDown--;
					this.hideWin(win, countDown);
				}
			}.bind(this), 1000);
		},
		// 显示购币窗口
		showBuyCoinWin: function(e) {
			e && e.preventDefault();
			var list = userData.feeList;
			var length = list.length;
			this.initFeeListSelect();
			length > 0 && this.setFeeListActive(0);
			this.buyCoinWinEl.style.display = "block";
		},
		hideBuyCoinWin: function(e) {
			e && e.preventDefault();
			this.buyCoinWinEl.style.display = "none";
		},
		// 显示确认购币
		showConfirmBuyWin: function(e) {
			e.preventDefault();
			var fee_msg = configs.feeList;
			this.hideBuyCoinWin();
			var feeNum = this.confirmBuyWinEl.getElementsByClassName("feeNum")[0];
			var coinNum = this.confirmBuyWinEl.getElementsByClassName("coinNum")[0];
			feeNum.innerText = this.parseFee(this.selectFee[fee_msg.fee]);
			coinNum.innerText = this.selectFee[fee_msg.pulseNum];
			this.confirmBuyWinEl.style.display = "block";
		},
		hideConfirmBuyWin: function(e) {
			e && e.preventDefault();
			this.confirmBuyWinEl.style.display = "none";
		},
		toPay: function(e) {
			// 确认支付
			e.preventDefault();
			var fee_msg = configs.feeList;
			var self = this;
			var json = {
				"deviceId": userData.deviceId,
				"deviceMac": userData.deviceMac,
				"openId": userData.openId,
				"count": self.selectFee[fee_msg.count],
				"auth_token": userData.auth_token
			};
			this.showLoading();
			this.hideConfirmBuyWin();
			setTimeout(function() {
				userData.remainCoin += self.selectFee[fee_msg.pulseNum];
				self.showPaySuccessDialog();
				self.setRemainCoin();
				self.closeLoading();
			}.bind(this), 1000);
			return;
			// 支付接口
			util.ajax({
				url: configs.url.toPay,
				type: "POST",
				async: true,
				data: this.parseData(json),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: function(data) {
					data = JSON.parse(data);
					self.closeLoading();
					console.log(data.code);
					if (data.code !== '200') {
						self.showEorreWin(data.msg);
					} else {
						WeixinJSBridge.invoke('getBrandWCPayRequest', data.result, function(res) {
							if (res.err_msg == "get_brand_wcpay_request:ok") {
								userData.remainCoin += self.selectFee[fee_msg.pulseNum];
								self.showPaySuccessDialog();
								self.setRemainCoin();
							}
						});
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		},
		showLoading: function() {
			this.DialogLoading.style.display = "block";
		},
		closeLoading: function() {
			this.DialogLoading.style.display = "none";
		},
		showPaySuccessDialog: function(data) {
			// ------------------------------------------------------------
			var fee_msg = configs.feeList;
			var coinEl = this.successBuyEl.getElementsByClassName("coin")[0];
			var timeEl = this.successBuyEl.getElementsByClassName("time")[0];
			var dateEl = this.successBuyEl.getElementsByClassName("date")[0];
			coinEl.innerText = this.selectFee[fee_msg.pulseNum];
			timeEl.innerText = "三个月";
			dateEl.innerText = "2016年12月12日";
			this.successBuyEl.style.display = "block";
			this.hideWin(this.successBuyEl, 3);
		},
		// 消费记录
		_recordLoadingStart: 0,
		_recordLoadingCount: 5,
		_currPageRecord: 0,
		_recordLoading: false,
		_recordLoadingLast: false,
		_isLoading: false,
		showRecordWinEl: function(e) {
			e.preventDefault();
			this.recordWinEl.style.display = "block";
			if (!this._recordLoading) {
				this._currPageRecord = 1;
				this.loadRecordList(this._recordLoadingStart, this._recordLoadingCount);
			}
		},
		hideRecordWinEl: function(e) {
			e.preventDefault();
			this.recordWinEl.style.display = "none";
		},
		loadRecordList: function(start, count) {
			// 请求接口
			this.showLoading();
			this._isLoading = true;
			var device_msg = configs.deviceList;
			var self = this;
			var json = {
				openId: userData.openId,
				start: start,
				count: count,
				deviceId: this.selectDevice[device_msg.deviceId]
			};
			var data = getRandomTest();
			setTimeout(function() {
				this.setRecordList(data);
				this.closeLoading();
			}.bind(this), 1000);
			return;
			util.ajax({
				url: configs.url.getRecordList,
				type: "POST",
				async: true,
				data: this.parseData(json),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				success: function(data) {
					data = JSON.parse(data);
					var result = data.result;
					self.closeLoading();
					console.log(data.code);
					if (data.code !== '200') {
						self.showEorreWin(data.msg);
					} else {
						self.setRecordList(data);
						self.closeLoading();
					}
				},
				error: function(error) {
					console.log(error);
				}
			});
		},
		// 写下消费记录
		setRecordList: function(data) {
			if (!data) {
				return;
			}
			// 设置分页 总量；
			var total = data.total || 20;
			this._recordLoading = true;
			// this._recordLoadingStart += this._recordLoadingCount;
			if (this._recordLoadingStart > total) {
				this._recordLoadingLast = true;
			} else {
				this._recordLoadingLast = false;
			}
			this.setBtnStaus();
			this._isLoading = false;
			var record_msg = configs.recordList;
			var html_demo = this.getRecordListDemo().innerHTML;
			var html_list = this.recordWinEl.getElementsByClassName("record-list-box")[0];
			var html_arr = [];
			var list = data.list || data;
			var length = list.length;
			for (var i = 0; i < length; i++) {
				var html = html_demo.replace(/{{time}}/g, list[i][record_msg.time])
					.replace(/{{address}}/g, list[i][record_msg.address])
					.replace(/{{device}}/g, list[i][record_msg.device])
					.replace(/{{type}}/g, list[i].type ? "投币" : "购币")
					.replace(/{{coin}}/g, list[i][record_msg.coin])
					.replace(/{{display_error}}/g, list[i][record_msg.status] ? "none" : "block")
					.replace(/{{remainCoin}}/g, list[i][record_msg.remainCoin])
					.replace(/{{status}}/g, list[i][record_msg.status] ? "成功" : "待处理");
				html_arr.push(html)
			}
			html_list.innerHTML = html_arr.join("");
		},
		// 消费记录上一页
		recordUp: function(e) {
			e.preventDefault();
			if (this._currPageRecord == 1 || this._isLoading) {
				return;
			}
			this._currPageRecord--;
			this._recordLoadingStart = this._recordLoadingStart - this._recordLoadingCount;
			this.loadRecordList(this._recordLoadingStart, this._recordLoadingCount);
		},
		// 消费记录下一页
		recordDown: function(e) {
			e.preventDefault();
			if (this._recordLoadingLast || this._isLoading) {
				return;
			}
			this._currPageRecord++;
			this._recordLoadingStart = this._recordLoadingStart + this._recordLoadingCount;
			this.loadRecordList(this._recordLoadingStart, this._recordLoadingCount);
		},
		// 消费记录按钮状态
		setBtnStaus: function() {
			if (this._currPageRecord == 1) {
				this.recordUpBtn.className += " disable";
			} else {
				this.recordUpBtn.className = this.recordUpBtn.className.replace("disable", "");
			}
			if (this._recordLoadingLast) {
				this.recordDownBtn.className += " disable";
			} else {
				this.recordDownBtn.className = this.recordUpBtn.className.replace("disable", "");
			}
		},
		// 显示错误信息
		showEorreWin: function(msg) {
			var errorWin = document.getElementById("error-win");
			var errorMsgEl = errorWin.getElementsByClassName("msg")[0];
			errorMsgEl.innerText = msg || "";
			errorWin.style.display = "block";
			this.hideWin(errorWin, 1.5);
		}
	}
	this.page = new AllPay();
}
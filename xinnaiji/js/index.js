(function(){
	var defaultUserData = {
		'deviceList': [
			{
				deviceId: 1,
				deviceName: "1",
				coinNum: 1,
				status: true
			},
			{
				deviceId: 2,
				deviceName: "2",
				coinNum: 2,
				status: true
			},
			{
				deviceId: 3,
				deviceName: "3",
				coinNum: 1,
				status: true
			},
			{
				deviceId: 4,
				deviceName: "4",
				coinNum: 1,
				status: false
			},
			{
				deviceId: 5,
				deviceName: "5",
				coinNum: 1,
				status: true
			},
			{
				deviceId: 6,
				deviceName: "6",
				coinNum: 1,
				status: true
			},{
				deviceId: 7,
				deviceName: "7",
				coinNum: 1,
				status: true
			},
			{
				deviceId: 8,
				deviceName: "8",
				coinNum: 1,
				status: true
			},{
				deviceId: 9,
				deviceName: "9",
				coinNum: 1,
				status: true
			},{
				deviceId: 10,
				deviceName: "10",
				coinNum: 1,
				status: true
			},{
				deviceId: 11,
				deviceName: "11",
				coinNum: 1,
				status: true
			},{
				deviceId: 12,
				deviceName: "12",
				coinNum: 1,
				status: true
			},{
				deviceId: 13,
				deviceName: "13",
				coinNum: 1,
				status: true
			},{
				deviceId: 14,
				deviceName: "14",
				coinNum: 1,
				status: true
			},{
				deviceId: 15,
				deviceName: "15",
				coinNum: 1,
				status: true
			},{
				deviceId: 16,
				deviceName: "16",
				coinNum: 1,
				status: true
			},{
				deviceId: 17,
				deviceName: "17",
				coinNum: 1,
				status: true
			},{
				deviceId: 18,
				deviceName: "18",
				coinNum: 1,
				status: true
			},{
				deviceId: 19,
				deviceName: "19",
				coinNum: 1,
				status: true
			},{
				deviceId: 20,
				deviceName: "20",
				coinNum: 1,
				status: true
			}
		],
		"coinNum": 1, //单次币数
        "coinPrice": 100,
        "deviceType": 0,
        "maxCoinCount": 30,
        "remainCoin": 30,
        "deviceId": 10
	}
	var userData = userData || defaultUserData;

	function AllPay(){
		var that = this;
		var dom = document;
		var touch = "touchstart";
		var touchMove = "touchmove";
		var touchEnd = "touchend";
		this.currPage = 0;
		this.sPos = {};
		this.mPos = {};
		this.remainCoinEl = dom.getElementById("remainCoin");
		this.btnCoinPriceEl = dom.getElementById("btnCoinPrice"); 
		this.deviceListDemoText = dom.getElementById("deviceListDemo").innerHTML;
		this.deviceListEl = dom.getElementById("deviceList");
		this.deviceListMainEl = dom.getElementById("deviceListMain");
		this.deviceListMainEl.addEventListener(touch, this.deviceListTouchStart.bind(this));
		this.deviceListMainEl.addEventListener(touchMove, this.deviceListTouchMove.bind(this));
		this.deviceListMainEl.addEventListener(touchEnd, this.deviceListTouchEnd.bind(this));


		this.deviceListSpotEl =dom.getElementById("deviceListSpot");
		this.deviceListUpEl = dom.getElementById("deviceListUp");
		this.deviceListDownEl = dom.getElementById("deviceListDown");
		this.deviceListUpEl.addEventListener(touch, this.deviceListUp.bind(this)); 
		this.deviceListDownEl.addEventListener(touch, this.deviceListDown.bind(this));

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
		init : function(){
			this.remainCoinEl.innerText = (userData.remainCoin || 0 )  +"枚";
			this.btnCoinPriceEl.innerText = this.parseFee(userData.coinPrice);
			this.initDeviceList();
			this.setDeviceListActive(userData.deviceId);
		},
		// 初始化设备列表
		initDeviceList: function(){
			var list = userData.deviceList;
			var length = list.length;
			var deviceIndex = this.findDeviceIndexInList(userData.deviceId);
			if(length > 9){
				var newList = [];
				if(deviceIndex > 3 && deviceIndex < length-4){
					this.currPage = parseInt((deviceIndex + 4) /9);
					newList  = list.slice(deviceIndex -4 , deviceIndex + 5);
				}else if(deviceIndex > 3 && deviceIndex >= length-4 ){
					this.currPage = parseInt(length/9);
					newList  = list.slice(length-9 , length);
				}else{
					newList = list.slice(0,9);
				}
				this.setDeviceList(newList);
			}else{
				this.setDeviceList(list);
			}
			this.setDeviceListSpotList();
			this.setDeviceListSpotActive(this.currPage);
		},
		// 写下设备列表
		setDeviceList:function(list){
			var length = list.length;
			var html_arr = [];
			var mode = this.deviceListDemoText;
			for(var i=0;i<length;i++){
				var new_html = mode.replace(/{{index}}/g, list[i].deviceId)
								.replace(/{{deviceName}}/g, list[i].deviceName)
								.replace(/{{coinNum}}/g, list[i].coinNum)
								.replace(/{{disable}}/g, list[i].status ? "" : "disable" );
				html_arr.push(new_html);
			};
			this.deviceListEl.innerHTML = html_arr.join("");
		},

		setDeviceListSpotList: function(){
			var length = userData.deviceList.length;
			var pageNum = Math.ceil(length/9);
			var html_arr =[];
			for(var i=0;i< pageNum; i++){
				var html = '<div class="spot"></div>';
				html_arr.push(html);
			}
			this.deviceListSpotEl.innerHTML = html_arr.join("");
		},
		setDeviceListSpotActive: function(index){
			var childrens = this.deviceListSpotEl.children;
			var length = childrens.length;
			for(var i=0;i<length; i++){
				childrens[i].className = "spot";
			}
			childrens[index].className = "spot active";
		},
		// 获取设备在列表中的位置
		findDeviceIndexInList: function(deviceId){
			var list = userData.deviceList;
			var length = list.length;
			for(var i=0; i<length; i++){
				if(list[i].deviceId == deviceId){
					return i;
				}
			}
		},
		setDeviceListActive: function(deviceId){
			var childrens = this.deviceListEl.children;
			var length = childrens.length;
			for(var i=0;i<length; i++){
				childrens[i].className = childrens[i].className.replace(/active/g, "");
				if(childrens[i].getAttribute("index") == deviceId){
					childrens[i].className += " active";
				}
			}	
		},
		// 算出当前页的第一个设备
		deviceListUp: function(){
			if(this.currPage == 0){
				return;
			}
			this.currPage--;
			this.changeDeviceListUp();
		},
		// 
		deviceListDown: function(){
			if(this.currPage ==  parseInt(userData.deviceList.length/9)){
				return;
			}
			this.currPage++;
			this.changeDeviceListDown();
		},
		changeDeviceListUp: function(){
			var list = userData.deviceList;
			if(list.length ===  0) return;
			var firstChild = this.deviceListEl.children[0];
			var deviceId = firstChild.getAttribute("index");
			var deviceIndex = this.findDeviceIndexInList(deviceId);
			var newList = [];
			if(deviceIndex > 9){
				newList  = list.slice(deviceIndex - 9 , deviceIndex);
			}else{
				newList  = list.slice( 0 , 9);
			}
			this.setDeviceList(newList);
			this.setDeviceListSpotActive(this.currPage);
		},
		changeDeviceListDown: function(){
			var list = userData.deviceList;
			if(list.length ===  0) return;
			var length = this.deviceListEl.children.length;
			var lastChild = this.deviceListEl.children[length-1];
			var deviceId = lastChild.getAttribute("index");
			var deviceIndex = this.findDeviceIndexInList(deviceId);
			var newList = [];
			if(list.length - deviceIndex > 9){
				newList  = list.slice( deviceIndex + 1 ,deviceIndex + 10);
			}else{
				newList  = list.slice( list.length -9 , list.length);
			}
			this.setDeviceList(newList);
			this.setDeviceListSpotActive(this.currPage);
		},
		// 当手指滑动时，计算滑动值;
		deviceListTouchStart: function(e){
			var point = e.touches ? e.touches[0] : e;
         	this.sPos.x = point.screenX;
         	this.mPos.x = point.screenX;
		},
		deviceListTouchMove: function(e){
			var point = e.touches ? e.touches[0] : e;
		    this.mPos.x = point.screenX;
		},
		deviceListTouchEnd: function(e){
			var move = this.sPos.x - this.mPos.x;
			console.log(move);
			if(Math.abs(move) > 50){
				if(move > 0){
					this.deviceListDown();
				}else{
					this.deviceListUp();
				}
				return;
			}else if(Math.abs(move) < 10){
				var target =  e.target;
				var className = target.className;
				if(className.indexOf("list-box") === -1 ){
					return;
				}
				if(className.indexOf("disable") > -1 ){
					return;
				}
				var deviceId = target.getAttribute("index");
				this.setDeviceListActive(deviceId);
			}
		}
	}
	document.addEventListener("DOMContentLoaded", function() {
        var app = new AllPay();
        app.init();
    }, false);
})()
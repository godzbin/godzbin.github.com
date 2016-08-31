/**
 * Created by GodzBin on 2015/10/10.
 */
    var wechar = {
        open_id: '',
        nickName: '',
        appid_val: '' ,
        timestamp_val: 0,
        nonceStr_val: '',
        signature_val:'',
        href:window.location.href + "?openId=1",
        host: getHost(),
        np_href:"",
        localIds:"",
        serverId:"",
        jump_href:"http://gd.10086.cn/szshop/wxyw/oAuthServlet.let?reUrl=",
        error:"网络异常，请稍后再试！",
        title_name: function(){
                return "真的是9折，"+ this.nickName + "邀你上深圳移动官微9折充话费！";
        },
        share_content: "9折！真的是9折！限时特惠，快来抢先体验9折充值吧！",
        img_url: "http://gd.10086.cn/szshop/wxyw/CZYHtest/img/SZYD.png",
        link_url: "index.html"
    };
    var getOpenId = function(){
        //获取cookie
        var cookie_key =  document.cookie.split(":")[0].split("=")[0];
        var cookie_val = document.cookie.split(":")[0].split("=")[1];
        wechar.jump_href2 = wechar.jump_href + wechar.href;
        if(wechar.href.indexOf("?") !=-1)
        {
            var arr = wechar.href.split("?")[1];
            var arr2 = arr.split("&");
            for(var i = 0; i < arr2.length; i++){
                if(arr2[i].split("=")[0] == "openId"){
                    wechar.open_id = arr2[i].split("=")[1];
                }
                if(arr2[i].split("=")[0] == "nickName"){
                    wechar.nickName = decodeURIComponent(arr2[i].split("=")[1]) ;
                }
            }
            if( wechar.open_id == "" || !wechar.open_id)
            {
                wechar.href = encodeURIComponent(wechar.href);
                wechar.jump_href2 = wechar.jump_href + wechar.href;
                document.location.href = wechar.jump_href2;
                setTimeout(function(){
                    document.location.href = wechar.jump_href2;
                },1000);
            }
        }else{
            if(cookie_key && cookie_key == "openId"){
                if(cookie_val != "" || cookie_val)
                {
                    wechar.open_id = cookie_val;
                }else{
                         wechar.href = encodeURIComponent(wechar.href);
                        wechar.jump_href2 = wechar.jump_href + wechar.href;
                        document.location.href = wechar.jump_href2;
                        setTimeout(function(){
                            document.location.href = wechar.jump_href2;
                        },1000);
                        }
            }else{
                    wechar.href = encodeURIComponent(wechar.href);
                    wechar.jump_href2 = wechar.jump_href + wechar.href;
                    document.location.href = wechar.jump_href2;
                    setTimeout(function(){
                        document.location.href = wechar.jump_href2;
                    },1000);
            }
        }
    }
    getOpenId();

    function getHref(){
        var href = window.location.href;
        wechar.href = href;
        wechar.np_href = href.split("?")[0];
        return wechar;
    }
    getHref();
//获取签名
    $.ajax({
        type: 'GET',
        url: "http://gd.10086.cn/szshop/wxyw/getShareParms.action",
        timeout: 30000,
        data: { sign:"SZWX2015",
                url: wechar.href,
               openId: wechar.open_id },
        success: function(data){
            wechar.timestamp_val = data["timestamp"];
            wechar.nonceStr_val = data["noncestr"];
            wechar.signature_val = data["signature"];
            wechar.appid_val = data["appId"];
        },
        dataType: "json",
        async: false
    });
    wx.config({
        debug: false,
        appId: wechar.appid_val,
        timestamp: wechar.timestamp_val,
        nonceStr: wechar.nonceStr_val,
        signature: wechar.signature_val,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage',
            'chooseImage','previewImage','uploadImage','downloadImage']
    });
    wx.ready(function(){
        // 朋友圈
        //wechar.img_url = wechar.host + wechar.img_url;
        wechar.link_url = wechar.host + wechar.link_url;
        wx.checkJsApi({
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {

            }
        });
        wx.onMenuShareTimeline({
            title: wechar.title_name(),
            desc: wechar.share_content, // 分享描述
            link: wechar.link_url+"?actionfrom=sharetimeline", // 分享链接
            imgUrl: wechar.img_url,
            success: function () {
                addShare();
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数

            }
        });
        // 朋友
        wx.onMenuShareAppMessage({
            title: wechar.title_name(),
            desc: wechar.share_content, // 分享描述
            link: wechar.link_url+"?actionfrom=shareapp", // 分享链接
            imgUrl: wechar.img_url,
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                addShare();
            },
            cancel: function () {

            }
        });
    });
    wx.error(function(res){

    });

    //分享统计
        function addShare(){
            $.ajax({
                type:"get",
                url:"addShare.action",
                data:{openId:wechar.open_id },
                success:function(data) {

                }
            });
        }
    //拍照或从手机相册选取接口
    function chooseImage(){
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wechar.localIds = res.localIds;
                //预览图片
                options.imgSrc = wechar.localIds;
                $(options.imageBox).css("background-image","url("+ options.imgSrc +")");
            }
        });
    }
    function uploadImage(){
        if(wechar.localIds != '' && wechar.localIds){
            wx.uploadImage({
                localId: wechar.localIds,
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    wechar.serverId = res.serverId; // 返回图片的服务器端ID
                    upload();
                }
            });
        }else{
            alert("请选择图片");
        }
    }
    function getHost(){
        var host = window.location.host;
        var pathname = window.location.pathname;
        var end_pathname = pathname.lastIndexOf("/");
        pathname = pathname.substring(0,end_pathname+1);
        return host + pathname;
    }


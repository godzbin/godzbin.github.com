/**
 * Created by GodzBin on 2016/3/18.
 */
var tools = {
  test: false,
  // 随机字符串
  randomString: function() {
    var len = 10;　　
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
    var maxPos = $chars.length;　　
    var pwd = '';　　
    for (i = 0; i < len; i++) {　　　　
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
    }　　
    return pwd;
  },
  // 密码加密 RSA
  passwordNecToAdmin: function(password) {
    var pd_md5 = hex_md5(password);
    var module = "974F8D6621FAF4EF56B55304C799BB939CEB1D2B10C1BDA51FA2D30459A24531F793014A4E6E117A3A7B361478412E0BC09847E9F9E87DE18BCE9429A142C5A84F31D9F424292FFBCC50C175D3580B41ABF53FC9E607C6046FEFA6577033C46DCB5FBE51B0481EA80002055508B0E267F2709D992CCE6E85C0ED9E7E2E47FA6E22F17AF6AC697824B9CE3994B9E810449EDE03CD39955A1436339D550A1774E3764F5F3805FEFB4C6FD55B19746CEAC5F2D3DAEB0AAE08AC07A89C00A8835265F99850DFE3E93C9FCFFC90E87B4AE857383584EA6FEB1C12BF8E227242168C08176F6A100F4AAC5457AD3F36847CD70CD03EDB3AA4DF6DBA223C1ECF71B81077";
    var rsa = new RSAKey();
    rsa.setPublic(module, "10001");
    var res = rsa.encrypt(pd_md5);
    res = hex2b64(res);
    return res;
  },
  // 密码加密 md5
  passwordNec: function(password, username, code) {
    var pd_md5 = hex_md5(password);
    var module = "974F8D6621FAF4EF56B55304C799BB939CEB1D2B10C1BDA51FA2D30459A24531F793014A4E6E117A3A7B361478412E0BC09847E9F9E87DE18BCE9429A142C5A84F31D9F424292FFBCC50C175D3580B41ABF53FC9E607C6046FEFA6577033C46DCB5FBE51B0481EA80002055508B0E267F2709D992CCE6E85C0ED9E7E2E47FA6E22F17AF6AC697824B9CE3994B9E810449EDE03CD39955A1436339D550A1774E3764F5F3805FEFB4C6FD55B19746CEAC5F2D3DAEB0AAE08AC07A89C00A8835265F99850DFE3E93C9FCFFC90E87B4AE857383584EA6FEB1C12BF8E227242168C08176F6A100F4AAC5457AD3F36847CD70CD03EDB3AA4DF6DBA223C1ECF71B81077";
    var rsa = new RSAKey();
    rsa.setPublic(module, "10001");
    var res = rsa.encrypt(pd_md5);
    res = hex2b64(res);
    return res;
  },
  // 弹出信息
  toast: function(text) {
    var toast = Ext.toast({
      html: text,
      title: "",
      width: 300,
      align: "t",
      border: false,
      // closable: true,
    });
    setTimeout(function() {
      toast.close(100);
    }, 1000);
  },
  // 
  getData: function(url, params, callback, callbackParams) {
    // 如果是测试模板
    if (tools.test) {
      tools.getTestData(url, params, callback, callbackParams);
      return;
    }
    
    Ext.Ajax.timeout = 60000;
    var dataProcess = "../../dataProcess";
    params = {
      FUNC: url,
      FUNC_PARAMS: JSON.stringify(params)
    }
    Ext.Ajax.request({
      url: dataProcess,
      params: params,
      method: "POST",
      success: function(response, e, e2) {
        var data = JSON.parse(response.responseText);
        // process server response here
        if (data["STATE"] == 1) {
          callback(data["CONTENT"], callbackParams);
        } else if (data["STATE"] == 2) {
          window.location.href = "login.html";
        } else {
          tools.toast(data["ERR_MSG"]);
        }
      },
      failure: function() {
        Ext.Msg.alert("ERR_MSG", "HTTP ERROR");
      }
    });
  },

  getTestData: function(url, params, callback, callbackParams, Env, domain) {
    //  
    var data = test[url];
    callback(data, callbackParams);
  },
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
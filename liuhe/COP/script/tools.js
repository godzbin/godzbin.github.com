/**
 * Created by GodzBin on 2016/3/18.
 */
var tools = {

  test: true,
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

  // 系统请求
  getData: function(url, params, callback, callbackParams) {
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
  // 环境中的请求
  getDataToEnv: function(url, params, callback, callbackParams, Env, domain) {
    if (tools.test) {
      tools.getTestData(url, params, callback, callbackParams, Env, domain);
      return;
    }
    var dataProcess = "../../../dataProcess";
    var Env = Env || "flow_env";
    var dataParams = {
      FUNC: "view_invokeEnvFunc",
      FUNC_PARAMS: JSON.stringify({
        RDN: domain,
        ENV: Env,
        FUNC: url,
        FUNC_PARAMS: JSON.stringify(params)
      })
    };
    Ext.Ajax.request({
      url: dataProcess,
      params: dataParams,
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
  deepClone: function(obj) {
    var result, oClass = tools.isClass(obj);
    //确定result的类型
    if (oClass === "Object") {
      result = {};
    } else if (oClass === "Array") {
      result = [];
    } else {
      return obj;
    }
    for (key in obj) {
      var copy = obj[key];
      if (tools.isClass(copy) == "Object") {
        result[key] = arguments.callee(copy); //递归调用
      } else if (tools.isClass(copy) == "Array") {
        result[key] = arguments.callee(copy);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  },
  isClass: function(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
  },
  getTestData: function(url, params, callback, callbackParams, Env, domain) {
    //  
    var data = tools.deepClone(test2[url]);
    callback(data, callbackParams);
  },

  // 时间字符串固定格式
  dateZerofill: function(time) {
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
  },
  // 去空
  Trim: function(string) {
    return string.replace(/(^\s*)|(\s*$)/g, '');
  },
  // 对象是否相等
  isObjectEqual: function(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  },
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
  }
};
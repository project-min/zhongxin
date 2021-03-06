//var baseUrl = "https://103.233.5.238:8443/api/v1/sms/";
var baseUrl = "http://103.233.5.238:6688/api/v1/sms/";

var mapServiceUrl = "http://10.254.11.105:8399/arcgis/rest/services/SQEcoMap/MapServer";
//var mapServiceUrl = "https://server.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer";

Array.prototype.in_array = function(value) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == value) {
      return true;
    }
  }
  return false;
}

function Result(code, message) {
  this.code = code;
  this.message = message;
}

function RetrieveResult(code, message, data) {
  this.code = code;
  this.message = message;
  this.data = data;
}

function Security(userId, token, clientId) {
  this.userId = userId;
  this.token = token;
  this.clientId = clientId;
}

/**
 * 设置cookie
 * @param {string} name  键名
 * @param {string} value 键值
 * @param {integer} days cookie周期
 */
function setCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else {
    var expires = "";
  }
  document.cookie = name + "=" + value + expires; // + "; path=/";
}

// 获取cookie
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

// 删除cookie
function deleteCookie(name) {
  setCookie(name, "", -1);
}

function getFormatJsonTime(strDate, strTime) {
  var arrayDate = strDate.split('-');
  var arrayTime = strTime.split(':');
  var date = new Date(strDate);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strMonth = month.toString();
  if (month < 10) {
    strMonth = '0' + month.toString();
  }
  var day = date.getDate();
  var strDay = day.toString();
  if (day < 10) {
    strDay = '0' + day.toString();
  }
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return '';
  }
  else if (arrayTime.length < 2){
    return '';
  }
  var time = arrayTime[0] + arrayTime[1];
  if (arrayTime.length == 3) {
    time += arrayTime[2];
  }
  else {
    time += '00';
  }
  var result = year.toString() + strMonth + strDay + time;
  return result;
}

function getFormatJsonStartTime(strDate) {
  return getFormatJsonTime(strDate, '00:00:00');
}

function getFormatJsonEndTime(strDate) {
  return getFormatJsonTime(strDate, '23:59:59');
}

function getFormatDateTime(value) {
  if (value.length > 0) {
    return value.substring(0, 4) + '-' + value.substring(4, 6) + '-' + value.substring(6, 8) + ' ' + value.substring(8, 10) + ':' + value.substring(10, 12) + ':' + value.substring(12, 14)
  }
  else {
    return value;
  }
}

function formatTaskStatus(status) {
  switch (status) {
    case -1:
      return '已取消';
    case 1:
      return '正在执行';
    case 10:
      return '等待接受取消确认';
    case 100:
      return '执行完毕';
    default:
      return '未知';
  }
}

function showMessage(message) {
  $('#modal-message').empty();
  $('#modal-message').append(message);
  $('#error-message').modal();
}

function isInteger(obj) {
  return Math.round(obj) === obj   //是整数，则返回true，否则返回false
}

function AjaxHeader(userId, clientId, body, token) {
  var appId = 'STC1';
  var timestamp = new Date().getTime();
  var value = appId + userId + timestamp + clientId + body + token;
  var sign = $.sha1(value);
  this.appId = appId;
  this.userId = userId;
  this.clientId = clientId;
  this.timestamp = timestamp;
  this.sign = sign;
  this.contentType = 'application/json;charset=utf8';  
}

function setAjaxHeader(xhr, header) {
  xhr.setRequestHeader('appID', header.appId);
  xhr.setRequestHeader('clientID', header.clientId);
  xhr.setRequestHeader('userID', header.userId);
  xhr.setRequestHeader('timestamp', header.timestamp);
  xhr.setRequestHeader('Sign', header.sign);
  xhr.setRequestHeader('Content-Type', header.contentType);
}

function callAjax(url, header, body, callBackProcess) {
  var result;
  $.ajax({
    type: 'post',
    url: url,
    dataType: 'json',
    data: body,
    beforeSend: function(xhr) {
      setAjaxHeader(xhr, header);
    },
    async: false,
    success: function(ajaxResult) {
      result = callBackProcess(ajaxResult);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      var message = "<p>信息提交过程发生异常，请与管理员联系</p>";
      message += "<p>状态码：" + XMLHttpRequest.status + "</p>";
      message += "<p>状态：" + XMLHttpRequest.readyState + "</p>";
      message += "<p>异常信息：" + textStatus + "</p>";
      result = new Object;
      result.code = -1;
      result.message = message;
      result.data = null;
    }
  });
  return result;
}

function callRetrieveAjax(url, header, body, callBackProcess) {
  var result;
  $.ajax({
    type: 'post',
    url: url,
    dataType: 'json',
    data: body,
    beforeSend: function(xhr) {
      setAjaxHeader(xhr, header);
    },
    async: false,
    success: function(ajaxResult) {
      result = callBackProcess(ajaxResult);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      var message = "<p>信息提交过程发生异常，请与管理员联系</p>";
      message += "<p>状态码：" + XMLHttpRequest.status + "</p>";
      message += "<p>状态：" + XMLHttpRequest.readyState + "</p>";
      message += "<p>异常信息：" + textStatus + "</p>";
      result = new Object;
      result.code = -1;
      result.message = message;
      result.data = null;
    }
  });
  return result;
}

function loginCallBackProcess(ajaxResult) {
  if (ajaxResult.errcode >= 0) {
    var data = {
      userId: ajaxResult.data.userID, 
      token: ajaxResult.data.token, 
      clientId: ajaxResult.data.clientID
    };
    return new RetrieveResult(ajaxResult.errcode, '', data);
  }
  else {
    var message = "<p>登录失败</p>";
    message += "<p>" + ajaxResult.errmsg + "</p>";
    return new RetrieveResult(ajaxResult.errcode, message, null);
  }
}

function login(userName, password) {
  var query = new Object;
  query.username = userName;

  var body = JSON.stringify(query);
  var token = $.sha1(password);
  var header = new AjaxHeader('00000000', '000000', body, token);

  var url = baseUrl + 'login';
  
  var result = callRetrieveAjax(url, header, body, loginCallBackProcess);
  return result;
}

function logoutCallBackProcess(result) {
  if (result.errcode >= 0) {
    return new Result(result.errcode, '');
  }
  else {
    var message = "<p>Logout失败</p>";
    message += "<p>" + result.errmsg + "</p>";
    return new Result(result.errcode, result.errmsg);
  }
}

function logout() {
  var url = baseUrl + 'logout';
  var query = new Object;
  var body = JSON.stringify(query);
  var userId = getCookie('userId');
  var clientId = getCookie('clientId');
  var token = getCookie('token');
  var header = new AjaxHeader(userId, clientId, '', token);

  var result = callAjax(url, header, body, logoutCallBackProcess);
  if (result.code == 0) {
    deleteCookie("userId");
    deleteCookie("token");
    deleteCookie("clientId");
    location.href = 'login.html';
  }
  else {
    showMessage(result.message);
  }
}

$(document).ready(function () {
  $('#logout').click(function() {
    logout();
  });
});
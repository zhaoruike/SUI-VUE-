"use strict";
var base = {
  HTTP_HOST: '/chsea_app/'
};

var Con = {
  price: '',
  direction: '',
  todayOpen: '',
  lastClose: '',
};
var Ag = {
  price: '',
  direction: '',
  todayOpen: '',
  lastClose: '',
};

var ZB_Bank={
  getList: function(){
    var url = base.HTTP_HOST+'h5/banks';
    var params = {banktype:1};
    var result = ZB_Util.intfGet(url, params);
    return result.bankList;
  },
  getIcon: function(code){
    return '/static/images/bank/'+code+'.png';
  }
};

var ZB_Util={
  intfGet: function(url, params){
    var result = {};
    params.ts = new Date().getTime();
    $.ajax({
      url: url,
      dataType: "json",
      async: false,
      data: params,
      success: function(ret){
        result = ret;
      },
      error: function(){
        console.log('接口请求失败！');
      }
    })
    return result;
  },
  validRealName: function(name){
    return /^[\u4e00-\u9fa5]{2,5}$/.test(name);
  },
  validIDCard: function(id){
    return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(id);
  },
  validBankNum: function(num){
    return /^\d{16,19}$/.test(num);
  },
  validPhone: function(phone){
    return /^(13|14|15|16|17|18|19)[\d]{9}$/.test(phone);
  },
  vaildEmail: function(email){
    return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email);
  },
  getItemList: function(){
    var url = base.HTTP_HOST+'h5/itemList';
    var ret = ZB_Util.intfGet(url, {});
    return ret.categories;
  },
  getCookie: function(key){
    var search = key + "=";
    var begin = document.cookie.indexOf(search);
    if (begin != -1) {
      begin += search.length;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) end = document.cookie.length;
      return unescape(document.cookie.substring(begin, end));
    }
    return;
  },
  setCookie: function(key, value, hours){
    var date = new Date();
    if (typeof(hours) == "undefined") {
      hours = 30 * 24;
    }
    date.setTime(date.getTime() + hours * 3600 * 1000);
    document.cookie = key+"="+escape(value)+";expires="+date.toUTCString();
  },
  captcha: function(){
    var date = new Date();
    var url = base.HTTP_HOST+'h5/captcha?typeFlag=n&ts='+date.getTime();
    $('.j_captcha').attr('src', url);
  },
  sendSms: function(phone, fromtype){
    var url = base.HTTP_HOST+'h5/sms';
    var params = {
      mobile : phone,
      from : fromtype,
      captcha : $('.j_captcha_code').val()
    };
    var result = ZB_Util.intfGet(url, params);
    return result;
  },
  wxShare: function(){
    return;
    $.getScript('https://res.wx.qq.com/open/js/jweixin-1.0.0.js', function(){
      var cur_url = location.href;
      if (-1 != cur_url.indexOf('#')) {
        cur_url = cur_url.split('#')[0];
      }
      var url = base.HTTP_HOST+'h5/urlShare';
      var params = {
        pageUrl: encodeURIComponent(cur_url)
      };
      var result = ZB_Util.intfGet(url, params);
      if (0 != result.resultCode) return;
      wx.config({
        debug: false,
        appId: result.appId,
        timestamp:result.timestamp,
        nonceStr: result.nonceStr,
        signature: result.signature,
        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone']
      });
      wx.ready(function(){
        wx.onMenuShareTimeline({
          title: result.shareTitle, 
          link: result.shareLink, 
          imgUrl: result.shareTitleImgUrl, 
          success: function(){ 
          },
          cancel: function(){ 
          }
        });
        wx.onMenuShareAppMessage({
          title:result.shareTitle, 
          desc:result.shareDesc, 
          link:result.shareLink, 
          imgUrl: result.shareTitleImgUrl, 
          type: '', 
          dataUrl: '',
          success: function(){ 
          },
          cancel: function(){ 
          }
        });
        wx.onMenuShareQQ({
          title: result.shareTitle, 
          desc: result.shareDesc, 
          link: result.shareLink, 
          imgUrl:result.shareTitleImgUrl, 
          success: function(){ 
          },
          cancel: function(){ 
          }
        });
        wx.onMenuShareWeibo({
          title: result.shareTitle, 
          desc: result.shareDesc, 
          link: result.shareLink,
          imgUrl: result.shareTitleImgUrl, 
          success: function(){ 
          },
          cancel: function(){ 
          }
        });
        wx.onMenuShareQZone({
          title: result.shareTitle, 
          desc: result.shareDesc, 
          link: result.shareLink, 
          imgUrl: result.shareTitleImgUrl, 
          success: function(){ 
          },
          cancel: function(){ 
          }
        });
      });
    });
  },
  error: function(msg, url){
    if (typeof(url) == 'undefined') {
      layer.alert(msg);
    } else {
      layer.alert(msg, function(index){
        location.href = url;
      });
    }
  },
  success: function(msg, url){
    layer.alert(msg, function(index){
      location.href = url;
    });
  },
  msg: function(msg, url){
    layer.msg(msg, {shift:0}, function(){
      if (typeof(url) != 'undefined') {
        location.href = url;
      }
    });
  }
};

var ZB_User={
  idnum: '',
  is_login: '',
  is_realname: '',
  isLogin: function(){
    if (ZB_User.is_login !== '') {
      return ZB_User.is_login;
    }
    var url = base.HTTP_HOST+'h5/userinfo';
    var result = ZB_Util.intfGet(url, {});
    ZB_User.is_login = result.resultCode == 0 ? true : false;
    return ZB_User.is_login;
  },
  checkLogin: function(){
    if (!ZB_User.isLogin()) {
      ZB_Util.error('请先登录', 'login.html');
    }
    return true;
  },
  setLoginPhone: function(phone){
    var mask = phone.substr(0, 3)+'****'+phone.substr(-4);
    return ZB_Util.setCookie('loginPhone', mask);
  },
  getLoginPhone: function(){
    return ZB_Util.getCookie('loginPhone');
  },
  isRealName: function(){
    if (ZB_User.is_realname !== '') {
      return ZB_User.is_realname;
    }
    var url = base.HTTP_HOST+'h5/account';
    var result = ZB_Util.intfGet(url, {});
    if (0 != result.resultCode) {
      ZB_Util.msg('您目前无法进行充值操作，请先登录！');
      return;
    }
    ZB_User.is_realname = result.realName;
    return ZB_User.is_realname;
  },
  getBankList: function(){
    var url = base.HTTP_HOST+'h5/cards';
    var params = {act: 0};
    var result = ZB_Util.intfGet(url, params);
    ZB_User.idnum = result.idnum;
    return result.cardList;
  },
  getRealInfo: function(){
    var url = base.HTTP_HOST+'h5/cards';
    var params = {act: 0};
    var result = ZB_Util.intfGet(url, params);
    return {
      'name': result.name,
      'idnum': result.idnum
    };
  },
  delBank: function(bindid){
    var url = base.HTTP_HOST+'h5/cards';
    var params = {
      act: 3,
      bindid: bindid
    };
    return ZB_Util.intfGet(url, params);
  },
  getTicket: function(){
    var url = base.HTTP_HOST+'h5/account';
    var result = ZB_Util.intfGet(url, {});
    if (0 == result.resultCode && result.ticketCount > 0) {
      return result.tickets;
    }
    return [];
  }
};

$(document).on('click', '.j_back', function(){
  var forward = ZB_Util.getCookie('forward');
  if (forward) {
    $.router.load(forward, true);
  } else {
    $.router.load("/index.html", true);
  }
});
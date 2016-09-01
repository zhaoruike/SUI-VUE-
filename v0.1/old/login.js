$(document).ready(function() {
  $('#btn_login').bind('click', function() {
    var mobile = $.trim($('#mobile').val());
    var pwd    = $.trim($('#dealPwd').val());

    if (!/^\d+$/.test(mobile)) {
      ZB_Util.msg('手机号格式错误');
      return;
    }
    if (!pwd) {
      ZB_Util.msg('请输入交易密码');
      return;
    }

    var url = base.HTTP_HOST+'h5/login';
    var params = {
      mobile: mobile,
      dealPwd: $.base64.encode(pwd)
    };
    var result = ZB_Util.intfGet(url, params);
    if (0 != result.resultCode) {
      ZB_Util.msg(result.msg);
      return;
    }
    ZB_User.setLoginPhone(mobile);
    location.href = '../index.html';
  });

  $('#mobile').bind('keyup', function(){
    var value = $(this).val();
    if (value && !/^\d+$/.test(value)) {
      ZB_Util.msg('请输入手机号码');
      $(this).val('');
    }
  });

  $('#dealPwd').bind('keyup', function(){
    var value = $(this).val();
    if (value && !/^\d+$/.test(value)) {
      ZB_Util.msg('请输入6位数字交易密码');
      $(this).val('');
    }
  });
});
(function(){
  $('#me').siblings().removeClass('active');
  $('#me').addClass('active')
})()

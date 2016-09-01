$(document).on("pageInit", "#login_page", function(e, id, page){
    var script = document.createElement('script');
    script.async = "async";
    script.src = "static/libs/Base64.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
});

$(document).on('beforePageSwitch', '#login_page', function(e, id, page){
    $("script[src='static/libs/Base64.min.js']").remove();
});

$(document).on('click', '#login_submit', function(){
    var phone = $.trim($('#login_phone').val());
    var pwd   = $.trim($('#login_pwd').val());

    if ('' == phone) {
        $.toast("请输入登录账号");
        return;
    }

    if ('' == pwd) {
        $.toast("请输入交易密码");
        return;
    }

    var url = base.HTTP_HOST+'h5/login';
    var params = {
        mobile: phone,
        dealPwd: Base64.encode(pwd)
    };
    var ret = ZB_Util.intfGet(url, params);
    if (0 != ret.resultCode) {
        $.toast(ret.msg);
        return;
    }
    $.router.load("index.html", true);
});
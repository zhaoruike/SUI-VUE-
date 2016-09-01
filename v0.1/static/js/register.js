$(document).on("pageInit", "#register_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active')
    var script = document.createElement('script');
    script.async = "async";
    script.src = "static/libs/Base64.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
    if (window.location.href.match(/shareCode=([^&]+)/)) {
        $('#register_agentBox').hide();
    } else {
        $('#register_agentBox').show();
    }
    ZB_Util.captcha();

    //获取手机验证码
    var num = 60;

    function getCode(e) {
        var srcAfter;
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPaht = curWwwPath.substring(0, pos);
        srcAfter = localhostPaht + '/chsea_app/';

        var phone = $.trim($('#register_phone').val()),
            pwd = $.trim($('#register_pwd').val()),
            repwd = $.trim($('#register_repwd').val()),
            picCode = $.trim($('#register_picCode').val());

        e.preventDefault();
        var url=srcAfter + 'h5/sms';
        var params = {
            'mobile': phone,
            'captcha': picCode
        };
        var ret = ZB_Util.intfGet(url, params);
        if (0 != ret.resultCode) {
            $.toast(ret.msg);
            if (27 == data.resultCode) {
                ZB_Util.captcha();
            }
            return;
        }
    }


    function verifyCode(event) {
        window.clearTimeout(verifyCodeTimer)

        var phone = $.trim($('#register_phone').val()),
            pwd = $.trim($('#register_pwd').val()),
            repwd = $.trim($('#register_repwd').val()),
            picCode = $.trim($('#register_picCode').val());

        if ('' == phone) {
            $.toast("请输入手机号码");
            return;
        }

        if ('' == pwd) {
            $.toast("请输入交易密码");
            return;
        }

        if ('' == repwd) {
            $.toast("请确认交易密码");
            return;
        }

        if ('' == picCode) {
            $.toast("请输入图片验证码");
            return;
        }
        var verifyCodeTimer = setInterval(function () {
            $(document).off('click', '#register_getVerifyCodeBtn')
            event.target.style.backgroundColor = "#e1e1e1"
            num--;
            event.target.innerHTML = '重新获取(' + num + 's)'
            if (num < 1) {
                $(document).on('click', '#register_getVerifyCodeBtn', verifyCode);
                $(document).on('click', '#register_getVerifyCodeBtn', getCode);
                event.target.style.backgroundColor = "#4cd964"
                window.clearTimeout(verifyCodeTimer)
                num = 60;
                event.target.innerHTML = '获取验证码'
            }
        }, 1000)
    }

    $(document).on('click', '#register_getVerifyCodeBtn', verifyCode)
    $(document).on('click', '#register_getVerifyCodeBtn', getCode)

});

$(document).on('beforePageSwitch', '#register_page', function (e, id, page) {
    $("script[src='static/libs/Base64.min.js']").remove();
});

//提交信息
$(document).on('click', "#register_submit", function (event) {
    var phone = $.trim($('#register_phone').val()),
        pwd = $.trim($('#register_pwd').val()),
        repwd = $.trim($('#register_repwd').val()),
        picCode = $.trim($('#register_picCode').val()),
        verifyCode = $.trim($('#register_verifyCode').val()),
        agree = $('#register_agree').prop('checked');
    if ('' == phone) {
        $.toast("请输入手机号码");
        return;
    }

    if ('' == pwd) {
        $.toast("请输入交易密码");
        return;
    }

    if ('' == repwd) {
        $.toast("请确认交易密码");
        return;
    }
    if (pwd != repwd) {
        $.toast("两次密码不一致");
        return;
    }
    if ('' == picCode) {
        $.toast("请输入图片验证码");
        return;
    }

    if ('' == verifyCode) {
        $.toast("请输入手机验证码");
        return;
    }

    if (false == agree) {
        $.toast("请阅读《风险提示》和《免责声明》并同意");
        return;
    }


    var url = base.HTTP_HOST + 'h5/reg';
    var params = {
        mobile: phone,
        dealPwd: Base64.encode(pwd),
        verifyCode: verifyCode,
        shareCode: ''
    };
    var ret = ZB_Util.intfGet(url, params);
    if (0 != ret.resultCode) {
        $.toast(ret.msg);
        return;
    }
    $.router.load("login.html");
});

//获得图片验证码
$(document).on('click', '#register_getPicCode', function () {
    var phone = $.trim($('#register_phone').val()),
        pwd = $.trim($('#register_pwd').val()),
        repwd = $.trim($('#register_repwd').val());
    if ('' == phone) {
        $.toast("请输入手机号码");
        return;
    }

    if ('' == pwd) {
        $.toast("请输入交易密码");
        return;
    }

    if ('' == repwd) {
        $.toast("请确认交易密码");
        return;
    }

    ZB_Util.captcha();
})




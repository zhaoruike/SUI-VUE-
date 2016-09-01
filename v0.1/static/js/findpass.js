$(document).on("pageInit", "#recode_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active')
    var script = document.createElement('script');
    script.async = "async";
    script.src = "static/libs/Base64.min.js";
    document.getElementsByTagName("head")[0].appendChild(script);
    ZB_Util.captcha();
    getVerifyCode()
});

$(document).on('beforePageSwitch', '#recode_page', function (e, id, page) {
    $("script[src='static/libs/Base64.min.js']").remove();
});

//信息提交
$(document).on('click', '#recode_submit', function (event) {
    var phone = $.trim($('#recode_phone').val()),
        pwd = $.trim($('#recode_pwd').val()),
        repwd = $.trim($('#recode_repwd').val()),
        picCode = $.trim($('#recode_picCode').val()),
        verifyCode = $.trim($('#recode_verifyCode').val());
    if ('' == phone) {
        $.toast("请输入手机号码");
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

    event.preventDefault();
    var url = base.HTTP_HOST + 'h5/findDealPwd';

    var params = {
        verifyCode: verifyCode,
        dealPwd: Base64.encode(pwd),
    };

    var ret = ZB_Util.intfGet(url, params);
    if (0 != ret.resultCode) {
        $.toast(ret.msg);
        return;
    } else {
        $.toast('密码修改成功,2s后跳转登录页');
        setTimeout(function () {
            $.router.load("login.html");
        }, 2000)
    }

});

//获取图片验证码
$(document).on('click', '#recode_getPicCode', function () {
    var phone = $.trim($('#recode_phone').val()),
        pwd = $.trim($('#recode_pwd').val()),
        repwd = $.trim($('#recode_repwd').val());
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
})

//获取手机验证码
function getVerifyCode() {
    var num = 60;

    function getCode(e) {
        var srcAfter;
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPaht = curWwwPath.substring(0, pos);
        srcAfter = localhostPaht + '/chsea_app/';

        var phone = $.trim($('#recode_phone').val()),
            pwd = $.trim($('#recode_pwd').val()),
            repwd = $.trim($('#recode_repwd').val()),
            picCode = $.trim($('#recode_picCode').val());

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
        var phone = $.trim($('#recode_phone').val()),
            pwd = $.trim($('#recode_pwd').val()),
            repwd = $.trim($('#recode_repwd').val()),
            picCode = $.trim($('#recode_picCode').val());

        if ('' == phone) {
            $.toast("请输入手机号码");
            return;
        }

        if ('' == picCode) {
            $.toast("请输入图片验证码");
            return;
        }
        var verifyCodeTimer = setInterval(function () {
            $(document).off('click', '#recode_verifyCodeBtn')
            event.target.style.backgroundColor = "#e1e1e1"
            num--;
            event.target.innerHTML = '重新获取(' + num + 's)'
            if (num < 1) {
                $(document).on('click', '#recode_verifyCodeBtn', verifyCode);
                $(document).on('click', '#recode_verifyCodeBtn', getCode);
                event.target.style.backgroundColor = "#4cd964"
                window.clearTimeout(verifyCodeTimer)
                num = 60;
                event.target.innerHTML = '获取验证码'
            }
        }, 1000)
    }

    $(document).on('click', '#recode_verifyCodeBtn', verifyCode)
    $(document).on('click', '#recode_verifyCodeBtn', getCode)
}

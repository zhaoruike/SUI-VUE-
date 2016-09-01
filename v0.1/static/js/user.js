$(document).on("pageInit", "#user_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active')
    ZB_User.getLoginPhone() ? $('#user_pson_telnum').html(ZB_User.getLoginPhone()) : $('#user_pson_telnum').html('请登录');

    var srcAfter;
    var curWwwPath = window.document.location.href;
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    var localhostPaht = curWwwPath.substring(0, pos);
    srcAfter = localhostPaht + '/chsea_app/';
    console.log(srcAfter)
    var url = srcAfter + 'h5/account';
    var accountUser = {};
    var ret = ZB_Util.intfGet(url, accountUser)

    if (ret.resultCode == 0) {
        $('#user_money').html(ret.balance);
        $('#user_deposit').html(ret.lockBalance);
        if (!ret.bankCord) {
            $('#user_rechange').addClass('confirm-ok-cancel');
            $('#user_widthdraw').addClass('confirm-ok-cancel');
        }
    }
});

$(document).on('beforePageSwitch', '#user_page', function (e, id, page) {
    ZB_Util.setCookie('forward', 'user.html');
});


$(document).on('click', '#user_title', function () {
    if ($('#user_pson_telnum').html() == '请登录') {
        $.router.load("login.html", true);
    }
});
$(document).on('click', '#user_logout', function () {
    $.router.load("index.html");
});

$(document).on('click', '#user_rechange', function () {
    if ($('#user_rechange').hasClass('confirm-ok-cancel')) {
        $.confirm('您还没有绑定银行卡，是否绑定？',
            function () {
                $.router.load('/bindcard.html')
                return
            },
            function () {

            }
        );
    }
    $.router.load('addmoney.html')
});

$(document).on('click', '#user_widthdraw', function () {
    if ($('#user_rechange').hasClass('confirm-ok-cancel')) {
        $.confirm('您还没有绑定银行卡，是否绑定？',
            function () {
                $.router.load('bindcard.html')
                return
            },
            function () {

            }
        );
    }
    $.router.load('withdraw.html')
});

$(document).on('click', '#user_toactive', function () {
    $.alert('现金交易有优惠哦');
})
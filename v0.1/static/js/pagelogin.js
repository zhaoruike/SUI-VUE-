/**
 * Created by zrk on 2016/8/24.
 */
$(document).on("pageInit", "#index", function (e, id, page) {
        var mark=($('script').eq(0).attr('src').split('?'))
        var oScript = document.createElement('script');
        oScript.src = 'static/js/index.js';
        if ($("script[src='static/js/index.js']").length != 0) {
            $("script[src='static/js/index.js']").remove();
        }
        $('body').append(oScript)
    }
)
$(document).on("pageInit", "#register_page", function (e, id, page) {
        var oScript = document.createElement('script');
        oScript.src = 'static/js/register.js';
        if ($("script[src='static/js/register.js']").length != 0) {
            $("script[src='static/js/login.js']").remove();
        }
        $('body').append(oScript)
    }
)


$(document).on("pageInit", "#login_page", function (e, id, page) {
    var oScript = document.createElement('script');
    oScript.src = 'static/js/login.js';
    if ($("script[src='static/js/login.js']").length != 0) {
        $("script[src='static/js/login.js']").remove();
    }
    $('body').append(oScript)

})

$(document).on("pageInit", "#user_page", function (e, id, page) {
    var oScript = document.createElement('script');
    oScript.src = 'static/js/user.js';
    if ($("script[src='static/js/user.js']").length != 0) {
        $("script[src='static/js/user.js']").remove();
    }
    $('body').append(oScript)

})

$(document).on("pageInit", "#bindCord_page", function (e, id, page) {
    var oScript = document.createElement('script');
    oScript.src = 'static/js/bindCord.js';
    if ($("script[src='static/js/bindCord.js']").length != 0) {
        $("script[src='static/js/bindCord.js']").remove();
    }
    $('body').append(oScript)

})
$(document).on("pageInit", "#bindcard_page", function (e, id, page) {
    console.log('bindcard')
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active');

    var winW = document.documentElement.clientWidth;
    if (winW > 600) {
        document.documentElement.style.fontSize = '30px';
    } else {
        document.documentElement.style.fontSize = winW / 600 * 30 + "px";
    }

    //开户地区选择
    $("#bindcard_city").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">请选择开户银行</h1>\
    </header>'
    });

//开户银行选择
    $("#bindcard_bank").picker({
        toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">标题</h1>\
    </header>',
        cols: [
            {
                textAlign: 'center',
                values: ['中国银行', '建设银行', '交通银行', '招商银行', '渤海银行', '工商银行', '农业银行', '华夏银行', '光大银行', '民生银行', '平安银行', '浦发', '中国邮政银行', '兴业银行', '中信银行', '广发银行']
            }
        ]
    });

});

$(document).on('beforePageSwitch', '#myactive_page', function (e, id, page) {

});

var winW = document.documentElement.clientWidth;
if (winW > 600) {
    document.documentElement.style.fontSize = '30px';
} else {
    document.documentElement.style.fontSize = winW / 600 * 30 + "px";
}

$(document).on('click', '#bindcard_submit', function () {
    var phone = $.trim($('#bindcard_phone').val()),
        bankCord = $.trim($('#bindcard_bankCord').val()),
        city = $.trim($('#bindcard_city').val()),
        bank = $.trim($('#bindcard_bank').val()),
        id = $.trim($('#bindcard_id').val()),
        name = $.trim($('#bindcard_name').val());

    if ('' == name) {
        $.toast("请输入姓名");
        return;
    }

    if ('' == id) {
        $.toast("请输入身份证号码");
        return;
    }

    if ('' == bank) {
        $.toast("请选择开户银行");
        return;
    }
    if (''== city) {
        $.toast("请选择开户地区");
        return;
    }
    if ('' == bankCord) {
        $.toast("请输入银行卡号");
        return;
    }

    if ('' == phone) {
        $.toast("请输入预留手机号");
        return;
    }

    $.router.load("user.html");
});

var city = ['北京', '天津', '上海', '广州', '山西', '河北', '河南']
var dataList = [[1, 2, 3, 4], [5, 6, 5, 5], [1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [6, 6, 6, 6]]
var data = dataList[0]
$("#bindcard_city").cityPicker({
    toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">请选择开户银行</h1>\
    </header>'
});

//开户银行选择
$("#bindcard_bank").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">标题</h1>\
    </header>',
    cols: [
        {
            textAlign: 'center',
            values: ['中国银行', '建设银行', '交通银行', '招商银行', '渤海银行', '工商银行', '农业银行', '华夏银行', '光大银行', '民生银行', '平安银行', '浦发', '中国邮政银行', '兴业银行', '中信银行', '广发银行']
        }
    ]
});

$(document).on("pageInit", "#mycard_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active');
    var winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW/ 600 * 30 + "px";

    $("#mycard_bank").picker({
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

    $("#mycard_city").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">请选择开户银行</h1>\
    </header>'
    });
});

$(document).on('beforePageSwitch', '#myactive_page', function (e, id, page) {

});

$(document).on('click', '#user_title', function () {

});

$(document).on("pageInit", "#myactive_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active');

    var winW = document.documentElement.clientWidth;
    if (winW > 600) {
        document.documentElement.style.fontSize = '30px';
    } else {
        document.documentElement.style.fontSize = winW / 600 * 30 + "px";
    }

    //开户地区选择
    var city = ['北京', '天津', '上海', '广州', '山西', '河北', '河南']
    var dataList = [[1, 2, 3, 4], [5, 6, 5, 5], [1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4], [6, 6, 6, 6]]
    var data = dataList[0]
    $("#city").picker({
        toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">标题</h1>\
    </header>',
        cols: [
            {
                textAlign: 'center',
                values: city
            },
            {
                textAlign: 'center',
                values: data
            }
        ],
        onOpen: function () {
            $('.picker-modal').on('touchend', function () {
                var $selected = $('.picker-selected').html()
                var index = city.indexOf($selected)
                data = dataList[index]
                console.log($selected, index, data)
                var str = ''
                for (var i = 0, len = data.length; i < len; i++) {
                    str += '<div class="picker-item " data-picker-value="1">' + data[i] + '</div>'
                    console.log(str)
                }
                $('.picker-items-col-wrapper').eq(1).html(str)
            })
        }
    });

    //开户银行选择
    $("#bank").picker({
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

$(document).on('click', '#bindcord_submit', function () {
    var phone = $.trim($('#bindcord_phone').val()),
        bankCord = $.trim($('#bindcord_bankCord').val()),
        city = $.trim($('#bindcord_city').val()),
        bank = $.trim($('#bindcord_bank').val()),
        id = $.trim($('#bindcord_id').val()),
        name = $.trim($('#bindcord_name').val());

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

    $.router.load("/user.html");
});

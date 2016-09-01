$(document).on("pageInit", "#withdraw_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active')

});

$(document).on('beforePageSwitch', '#myactive_page', function (e, id, page) {

});

$(document).on('click', '#withdraw_submit', function () {
   var money=$('#withdraw_money').html(),
       value=$('#withdraw_value').val(),
       password=$('#widthdraw_paw').val();
    if(value==''){
        $.toast('请输入提现金额');
        return;
    }

    if(password==''){
        $.toast('请输入交易密码');
        return;
    }

    if(value>money){
        $.toast('账户余额不足');
        return;
    }

    if(value<5){
        $.toast('提现金额必须大于5元');
        return;
    }

});

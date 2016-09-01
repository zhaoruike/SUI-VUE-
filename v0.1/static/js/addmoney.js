$(document).on("pageInit", "#addmoney_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active')

});

$(document).on('beforePageSwitch', '#addmoney_page', function (e, id, page) {
    vue.$destroy();
});

$(document).on('click', '#value_box', function (event) {
    if (event.target.tagName = 'span') {
        $(event.target).siblings().removeClass('value-active');
        $(event.target).addClass('value-active')
        $('#addmoney_value>input').val($(event.target).html())
    }
});
$(document).on('click','#addmoney_JDpay',function(){
   var valueNum=$('#addmoney_value_num').val()
    if(valueNum==''){
        $.toast("请输入充值金额");
        return;
    }
    if(parseInt(valueNum)<10){
        $.toast("最小充值金额为10元");
        return;
    }
})

$(document).on('click','#addmoney_YLpay',function(){
    var valueNum=$('#addmoney_value_num').val()
    console.log(valueNum)
    if(valueNum==''){
        $.toast("请输入充值金额");
        return;
    }
    if(parseInt(valueNum)<10){
        $.toast("最小充值金额为10元");
        return;
    }
})

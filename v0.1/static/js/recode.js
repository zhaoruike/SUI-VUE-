$(document).on("pageInit", "#recode_page", function (e, id, page) {
    console.log('recode')
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active');
    $('#recode_detail').siblings().hide()

});

$(document).on('beforePageSwitch', '#myactive_page', function (e, id, page) {

});

$(document).on('click', '#recode_de', function () {
    $(this).siblings().removeClass('recode-activecolor');
    $(this).addClass('recode-activecolor');
    $('#recode_detail').siblings().hide();
    $("#recode_detail").show();
});

$(document).on('click', '#recode_add', function () {
    $(this).siblings().removeClass('recode-activecolor');
    $(this).addClass('recode-activecolor');
    $('#recode_addmoney').siblings().hide();
    $("#recode_addmoney").show();
});

$(document).on('click', '#recode_with', function () {
    $(this).siblings().removeClass('recode-activecolor');
    $(this).addClass('recode-activecolor');
    $('#recode_withdraw').siblings().hide();
    $("#recode_withdraw").show();
});

$(document).on("pageInit", "#myactive_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active')

});

$(document).on('beforePageSwitch', '#myactive_page', function (e, id, page) {

});

$(document).on('click', '#user_title', function () {

});


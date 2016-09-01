$(document).on("pageInit", "#changepass_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active')

});

$(document).on('beforePageSwitch', '#myactive_page', function (e, id, page) {

});

$(document).on('click', '#changepass_submit', function () {

    var oldPass=$('#changepass_oldpass').val(),
        newPass=$('#changepass_newpass').val(),
        rePass=$('#changepass_repass').val();
    console.log(oldPass)
    if(oldPass==''){
        $.toast('请输入旧密码');
        return ;
    }

    if(newPass==''){
        $.toast('请输入新密码');
        return ;
    }

    if(rePass==''){
        $.toast('请输入确认新密码');
        return ;
    }

});

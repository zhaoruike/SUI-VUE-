$(document).on("pageInit", "#changedetile_page", function (e, id, page) {
    $('#me').siblings().removeClass('active')
    $('#me').addClass('active');
    var winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW / 600 * 30 + "px";

});

$(document).on('beforePageSwitch', '#myactive_page', function (e, id, page) {

});

$(document).on('click', '#user_title', function () {

});

function changedetile_run() {
    vue = new Vue({
        el: '#changedetile_page',
        data: {
            classObject: {
                'gt': true,
                'lt': false
            },
            total: -9,
        },
        computed: {
            classObject: function () {
                if (this.total > 1) {
                    return {
                        'gt': true,
                        'lt': false
                    }
                }
                return {
                    'gt': false,
                    'lt': true,
                }
            }
        },
    });
}

changedetile_run();

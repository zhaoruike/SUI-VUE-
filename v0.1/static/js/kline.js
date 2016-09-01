$(document).on("pageInit", "#kline_page", function(e, id, page){
    kline_run();
});

$(document).on('beforePageSwitch', '#kline_page', function(e, id, page){
    vue.$destroy();
    clearInterval(kline_timer);
    console.log('kline remove');
});

var kline_type;
var kline_timer;

function kline_task() {
    console.log('kline task');
    var url =  base.HTTP_HOST+'appClient/price';
    var params = {
        kType: 'time',
        code: kline_type
    };
    ret = ZB_Util.intfGet(url, params);
    if ('888' == ret.resultCode) {
        clearInterval(index_timer);
    }
    vue.price = ret;
}

function kline_run() {
    vue = new Vue({
        el: '#kline_page',
        data: {
            item: {},
            price: {},
        }
    });
    kline_type = location.href.match(/type=([^&#]+)/)[1];
    $.each(ZB_Util.getItemList(), function(key, val){
        if (val.code == kline_type) {
            vue.item = val;
        }
    });

    kline_task();
    kline_timer = setInterval('kline_task()', 3000);
}
$(document).on("pageInit", "#price_page", function(e, id, page){
    price_run();
});

$(document).on('beforePageSwitch', '#price_page', function(e, id, page){
    vue.$destroy();
    clearInterval(price_timer);
});

var price_timer;

function price_task() {
    var url =  base.HTTP_HOST+'appClient/price';
    var params = {
        kType: 'time',
        code: 'CON,Ag'
    };
    ret = ZB_Util.intfGet(url, params);
    if ('888' == ret.resultCode) {
        clearInterval(price_timer);
    }
    vue.Con.price     = ret.price[0];
    vue.Con.dir       = ret.direction[0];
    vue.Con.todayOpen = ret.todayOpen[0];
    vue.Con.lastClose = ret.lastClose[0];
    vue.Ag.price      = ret.price[1];
    vue.Ag.dir        = ret.direction[1];
    vue.Ag.todayOpen  = ret.todayOpen[1];
    vue.Ag.lastClose  = ret.lastClose[1];
}

function price_run() {
    ZB_Util.setCookie('forward', 'price.html');
    vue = new Vue({
        el: '#price_page',
        data: {
            Con: {
                dir: '',
                todayOpen: '',
                lastClose: '',
                price: '',
                changeRate: '',
            },
            Ag: {
                dir: '',
                todayOpen: '',
                lastClose: '',
                price: '',
                changeRate: '',
            }
        },
        watch: {
            'Con.price': function(val){
                this.Con.changeRate = ((val - this.Con.todayOpen) / this.Con.todayOpen * 100).toFixed(2);
            },
            'Ag.price': function(val){
                this.Ag.changeRate = ((val - this.Ag.todayOpen) / this.Ag.todayOpen * 100).toFixed(2);
            }
        }
    });
    price_task();
    price_timer = setInterval(price_task, 3000);
}


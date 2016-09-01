~function () {
    var winW = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = winW/ 600 * 30 + "px";
}();

$(document).on('pageInit', '#index_page', function(e, id, page){
    index_run();
});

$(document).on('beforePageSwitch', '#index_page', function(e, id, page){
    $("script[src='static/libs/Base64.min.js']").remove();
    clearInterval(index_timer);
    vue.$destroy();
});

var vue;
var index_timer;

function index_task() {
    ZB_Util.setCookie('forward', 'index.html');
    var url =  base.HTTP_HOST+'appClient/price';
    var params = {
        kType: 'time',
        code: 'CON,Ag'
    };
    ret = ZB_Util.intfGet(url, params);
    if ('888' == ret.resultCode) {
        clearInterval(index_timer);
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

function index_run() {
    var url = '';
    var params = {};
    var ret = null;

    vue = new Vue({
        el: '#index_page',
        data:{
            Con:{
                dir: '',
                todayOpen: '',
                lastClose: '',
                price: ''
            },
            Ag:{
                dir: '',
                todayOpen: '',
                lastClose: '',
                price: ''
            },
            focus: '',
            items: '',
            winners: ''
        },
        watch: {
            focus: function(val){
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true
                });
            }
        }
    });

    // 滚动焦点图
    url = base.HTTP_HOST+'appClient/noticeInformation';
    params = {
        pageStart: 1,
        pageSize: 5
    };
    ret = ZB_Util.intfGet(url, params);
    vue.focus = ret.noticeInformation;

    // 初始化交易产品
    url = base.HTTP_HOST+'h5/itemList';
    ret = ZB_Util.intfGet(url, {});
    vue.items = ret.categories;

    // 初始化交易品基本信息
    index_task();
    index_timer = setInterval('index_task()', 3000);

    // 盈利排行
    url = base.HTTP_HOST+'appClient/profitRanking';
    ret = ZB_Util.intfGet(url, {});
    vue.winners = ret.profitRankingList;
}

index_run();
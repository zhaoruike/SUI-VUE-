var Config = {
  closeBusiness: false
};
var User = {
  balance: 0,
  giftBalance: 0,
  itemNumber: [],
};
var Con = {
  name: '中海油',
  code: 'CON',
  newPrice: 0,
  lastdayPrice: 0,
  todayPrice: 0,
  changePrice:function(){
    return (Con.newPrice-Con.lastdayPrice).toFixed(2);
  },
  changeScale: function(){
    return ((Con.newPrice-Con.lastdayPrice)/Con.lastdayPrice*100).toFixed(2)+'%';
  }
};
var Ag = {
  name: '中海银',
  code: 'Ag',
  newPrice: 0,
  lastdayPrice: 0,
  todayPrice: 0,
  changePrice:function(){
    return (Ag.newPrice-Ag.lastdayPrice).toFixed(2);
  },
  changeScale: function(){
    return ((Ag.newPrice-Ag.lastdayPrice)/Ag.lastdayPrice*100).toFixed(2)+'%';
  }
};
var KChart = {
  count: 50,
  type: 'time',
  data: [],
  x_data: [],
  option: {},
  initFlag: true,
  lock: false,
  option: ''
};

var g_item        = [];
var g_code        = Con.code; // 当前操作的商品代码
var g_product_arr = []; // 全部商品数组
var date          = new Date();
var k_after       = 0;
var order_timer   = null; // 订单信息计时器

var k_chart = echarts.init(document.getElementById('charts'));

function k_time_line() {
  KChart.lock = true;
  KChart.option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        return params.data.value[1];
      },
      axisPointer: {
        animation: false
      }
    },
    grid: {
      left: '13%',
      right: '5%',
      bottom: '15%',
      top:'15%',
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitNumber: 5,
      boundaryGap: ['5%', '5%'],
      splitLine: {
        show: true
      }
    },
    series: [{
      animation: false,
      name: '',
      type: 'line',
      showSymbol: false,
      hoverAnimation: false,
      itemStyle:{
        normal:{
          lineStyle:{
            width:2
          },
          areaStyle:{
            type: 'default',
            color:'rgba(240,128,128,0.5)' 
          }
        }
      },
      data: KChart.data
    }]
  };
  var params = {
    code: g_code,
    type: KChart.type,
    count: KChart.count,
    after: k_after,
    ts: new Date().getTime()
  }
  $.getJSON('/chsea_app/h5/lineData', params, function(ret) {
    if (0 != ret.resultCode) {
      return;
    };
    $.each(ret.time, function(i, item){
      item = item.substr(0, 5);
      if (KChart.initFlag == false) {
        KChart.data.shift();
        KChart.x_data.shift();
      }
      KChart.data.push({
        name: item,
        value: [item, ret.prices[i]]
      });
      KChart.x_data.push(item);
    });
    k_after = ret.endid;
    KChart.option.xAxis = {
      type: 'category',
      splitLine: {
        show: true
      },
      data: KChart.x_data
    };
    k_chart.setOption(KChart.option, true);
    KChart.initFlag = false;
    KChart.lock = false;
  });
}

// 油K线
function k_line() {
  KChart.data = {
    categoryData: [],
    values: []
  };
  KChart.option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (param) {
        return param[0].name+'<br/>'+'开盘:'+param[0].data[0]+'<br/>收盘:'+param[0].data[1]+'<br/>最低:'+param[0].data[2]+'<br/>最高:'+param[0].data[3];
      },
      textStyle:{
        fontSize:12,
        fontFamily:'Arial, Verdana, sans-serif',
        fontStyle:'normal',
        fontWeight:'normal'
      },
      axisPointer: {
        type: 'line'
      }
    },
    legend: {
      data: ['k线', 'MA5', 'MA10', 'MA15']
    },
    grid: {
      left: '13%',
      right: '5%',
      bottom: '15%',
      top:'15%',
    },
    xAxis: {
      type: 'category',
      data: KChart.data.categoryData,
      scale: true,
      boundaryGap : false,
      axisLine: {onZero: false},
      splitLine: {show: false},
      splitNumber: 10,
      splitLine: {
        lineStyle:{
          color:['#ddd'],
          type:'solid'
        }
      },
      min: 'dataMin',
      max: 'dataMax'
    },
    yAxis: {
      scale: true,
      splitLine: {
        lineStyle:{
          color:['#ccc'],
          type:'solid'
        }
      },
    } 
  };
  var params = {
    code: g_code,
    type: KChart.type,
    count: KChart.count,
    after: k_after,
    ts: new Date().getTime()
  }
  $.getJSON('/chsea_app/h5/lineData', params, function(ret){
    if (0 != ret.resultCode) return;
    $.each(ret.time, function(i, item){
      KChart.data.categoryData.push(item);
      KChart.data.values.push([ret.open[i],ret.close[i],ret.low[i],ret.hi[i]]);
    });
    KChart.option.series = [
    {
      name: 'k线',
      type: 'candlestick',
      itemStyle: {
        normal: {
          color0: '#00ff00'
        }
      },
      data: KChart.data.values,
      markPoint: {
        label: {
          normal: {
            formatter: function (param) {
              return param != null ? Math.round(param.value) : '';
            }
          }
        },
        tooltip: {
          formatter: function (param) {
            return param.name + '<br>' + (param.data.coord || '');
          }
        }
      },
    },
    {
      name: 'MA5',
      type: 'line',
      data: ret.ma5,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {opacity: 0.5}
      }
    },
    {
      name: 'MA10',
      type: 'line',
      data: ret.ma10,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        normal: {opacity: 0.5}
      }
    },
    {
      name: 'MA15',
      type: 'line',
      data: ret.ma15,
      showSymbol: false,
      smooth: true,
      lineStyle: {
        normal: {opacity: 0.5}
      }
    },
    ]
    k_chart.setOption(KChart.option);
    k_after = ret.endid;
  });
}

// 用户信息
function initUser() {
  $.getJSON('/chsea_app/h5/account', {ts:new Date().getTime()}, function(ret) {
    if (0 != ret.resultCode) {
      $('.y_login').hide();
      $('.n_login').show();      
      $('.yn_login').attr('href','login.html');
      $('#avatar').attr('src', 'static/images/user.png');
      return;
    }
    $('.y_login').show();
    $('.n_login').hide(); 
    $('.yn_login').attr('href','personal.html');
    $('#avatar').attr('src', 'static/images/y_login.png');    
    User.balance = ret.balance;
    User.giftBalance = ret.giftBalance;
    $('#balance').html(User.balance);
    $('#gift_balance').html(User.giftBalance);
    // if (ret.headPortraitUrl) {
    //   $('#avatar').attr('src', ret.headPortraitUrl);
    // }
  });
}

// 定时任务
function timerTask() {
  var params = {
    kType: KChart.type,
    code: 'CON,Ag',
    ts: new Date().getTime()
  };
  $.getJSON('/chsea_app/appClient/price', params, function(ret) {
    if (0 != ret.resultCode) {
      if ('888' == ret.resultCode) { // 休市状态码：888
        closeBusiness();
        return;
      }
    }
    var i = g_code == Con.code ? 0 : 1;
    Con.newPrice     = ret.price[0];
    Con.lastdayPrice = ret.lastClose[0];
    Con.todayPrice   = ret.todayOpen[0];
    Ag.newPrice      = ret.price[1];
    Ag.lastdayPrice  = ret.lastClose[1];
    Ag.todayPrice    = ret.todayOpen[1];

    vm.conPrice        = Con.newPrice;
    vm.conLastdayPrice = Con.lastdayPrice;
    vm.conTodayPrice   = Con.todayPrice;
    vm.conChange       = Con.changePrice();
    vm.conScale        = Con.changeScale();
    vm.agPrice         = Ag.newPrice;
    vm.agLastdayPrice  = Ag.lastdayPrice;
    vm.agTodayPrice    = Ag.todayPrice;
    vm.agChange        = Ag.changePrice();
    vm.agScale         = Ag.changeScale();

    /* 更新买单界面价格 */
    if ($('.j_buy_price').length) {
      $('.j_buy_price').html(ret.price[i]);
    }

    /* 更新油时时价格样式 */
    vm.conPriceDir = ret.direction[0];
    
    /* 更新银时时价格样式 */
    vm.agPriceDir = ret.direction[1];
    
    if (!KChart.lock) {
      if ('time' == KChart.type) {
        /* 画图分时线 */
        if (-1 == $.inArray(ret.position, KChart.x_data)) {
          KChart.data.shift();
          KChart.x_data.shift();
        } else {
          KChart.data.pop();
          KChart.x_data.pop();
        }
        KChart.data.push({
          name: ret.position,
          value: [ret.position, ret.price[i]]
        });
        KChart.x_data.push(ret.position);
        k_chart.setOption(KChart.option);
      } else {
        /* 画图K线 */
        if (-1 == $.inArray(ret.position, KChart.data.categoryData)) {
          KChart.data.categoryData.shift();
          KChart.data.values.shift();
          KChart.data.categoryData.push(ret.position);
          KChart.data.values.push([ret.price[i],ret.price[i],ret.price[i],ret.price[i]]);
        } else {
          /* 更新K线1当前价、2最低价、3最高价 */
          var arr = [];
          arr = KChart.data.values.pop();
          arr[1] = ret.price[i]; // 更新当前价
          if (arr[2] > ret.price[i]) { // 判断最低价
            arr[2] = ret.price[i];
          }
          if (arr[3] < ret.price[i]) { // 判断最高价
            arr[3] = ret.price[i];
          }
          KChart.data.values.push(arr);
        }
        k_chart.setOption(KChart.option);
      }
    }
  });
  setTimeout('timerTask()', 3000);
}

// K线图切换
$('.j_btn').bind('click', function() {
  KChart.type = $(this).attr('data-ktype');
  if ('time' == KChart.type) {
    KChart.count = 50;
  } else {
    KChart.count = 30;
  }
  $('.j_btn').removeClass('ktuActive');
  $(this).addClass('ktuActive');
  init_kchart();
});

// tab商品切换
$('.j_tab').bind('click', function(){
  $('.j_tab').removeClass('pro_active');
  $(this).addClass('pro_active');
  $('.j_tab_bg').css('backgroundImage', 'url('+$(this).attr('data-bg')+')');
  if ($(this).attr('data-code') == Con.code) {
    vm.latestPrice = Con.newPrice;
    $('#tab_con_price').hide();
    $('#tab_con_price+span').hide();
    $('#tab_ag_price').show();
    $('#tab_ag_price+span').show();
    vm.lastDayPrice = Con.lastdayPrice;
    vm.todayPrice = Con.todayPrice;
    vm.changePrice = Con.changePrice();
    vm.changeScale = Con.changeScale();
  } else {
    vm.latestPrice = Ag.newPrice;
    $('#tab_con_price').show();
    $('#tab_con_price+span').show();
    $('#tab_ag_price').hide();
    $('#tab_ag_price+span').hide();
    vm.lastDayPrice = Ag.lastdayPrice;
    vm.todayPrice = Ag.todayPrice;
    vm.changePrice = Ag.changePrice();
    vm.changeScale = Ag.changeScale();
  }
  g_code = $(this).attr('data-code');

  init_kchart(); // 重新渲染K线图
  initProduct(); // 重新渲染产品列表
});

// 订单仪表盘开启/关闭
$('.j_btn_dashboard').bind('click', function(){
  if (0 == $(this).attr('data-off')) {
    $('.j_btn_dashboard_img').attr('src', 'static/images/xia.png');
    $('.j_btn_dashboard').attr('data-off', '1');
    $('.j_order_list').hide();
  } else {
    $('.j_btn_dashboard_img').attr('src', 'static/images/shang.png');
    $('.j_btn_dashboard').attr('data-off', '0');
    $('.j_order_list').show();
  }
});

// 切换建仓现金、体验金tab
$(document).on('click', '.j_buy_tab', function(){
  $('.j_buy_tab').removeClass('operate-act-active');
  $(this).addClass('operate-act-active');
  $('#btn_order_submit').removeClass();
  if ($(this).attr('data-type') == 'gift') {
    $('.j_order_ticket_block').hide();
    $('#buy_pay_type').html('体验金：'+User.giftBalance);
    $('#buy_pay_type').attr('data-balance', User.giftBalance);
    $('#order_paytype').val(1);
    if (User.giftBalance>=parseInt($('#deposit').html())) {
      $('#btn_order_submit').html('购 买');
      $('#btn_order_submit').addClass('balance-enough');
    } else {
      $('#btn_order_submit').html('资金不足');
      $('#btn_order_submit').addClass('balance-no-enough');
    }
  } else {
    $('.j_order_ticket_block').show();
    $('#buy_pay_type').html('可用资产：'+User.balance);
    $('#buy_pay_type').attr('data-balance', User.balance);
    $('#order_paytype').val(0);
    if (User.balance>=parseInt($('#deposit').html())) {
      $('#btn_order_submit').html('购 买');
      $('#btn_order_submit').addClass('balance-enough');
    } else {
      $('#btn_order_submit').html('资金不足');
      $('#btn_order_submit').addClass('balance-no-enough');
    }
  }
});

var order_num_timer = '';
// 长按购买数量
$(document).on('touchstart', '.j_btn_order_num', function(e){
  e.preventDefault();
  var obj = $(this);
  order_num_timer = setInterval(function(){
    changeOrderNum(obj);
  }, 200);
});
// 单击购买数量增减按钮
$(document).on('touchend', '.j_btn_order_num', function(e){
  e.preventDefault();
  clearInterval(order_num_timer);
  changeOrderNum($(this));
});

function changeOrderNum(obj) {
  var num = parseInt($('#order_num').val()) + parseInt($(obj).attr('data-num'));
  if (num <= 1) {
    num = 1;
  } else if (num > $(obj).attr('data-max')) {
    num = $(obj).attr('data-max');
  }
  $('#order_num').val(num);
  var deposit = parseInt($('#deposit').attr('data-price')) * num;
  $('#deposit').html(deposit);
  $('#btn_order_submit').removeClass();
  if (deposit > $('#buy_pay_type').attr('data-balance')) {
    $('#btn_order_submit').html('资金不足');
    $('#btn_order_submit').addClass('balance-no-enough');
  } else {
    $('#btn_order_submit').html('购 买');
    $('#btn_order_submit').addClass('balance-enough');
  }
}

// 订单平常按钮
$(document).on('click', '.j_btn_order_view', function(){
  var content = '<table><tbody id="sellTabOne">';
  content+= '<tr style="display:none"><td colspan="2" id="order_sell_title">平仓</td></tr>';
  content+= '<tr><td>商品名称:</td><td>'+$(this).attr('data-name')+'</td></tr>';
  content+= '<tr><td>交易手数:</td><td>'+$(this).attr('data-num')+'</td></tr>';
  if ($(this).attr('data-code') == Con.code) {
    content+= '<tr id="order_sell_price"><td>预计成交价:</td><td class="j_con_new_price">'+Con.newPrice+'</td></tr>';
  } else {
    content+= '<tr id="order_sell_price"><td>预计成交价:</td><td class="j_ag_new_price">'+Ag.newPrice+'</td></tr>';
  }
  content+= '<tr id="order_sell_service" style="display:none"><td>手续费：</td><td></td></tr>';
  if ($(this).attr('data-profit') >= 0) {
    content+= '<tr id="order_sell_profit"><td>预计盈亏</td><td id="order_profit_'+$(this).attr('data-orderid')+'" class="price-up">'+$(this).attr('data-profit')+'</td></tr>';
  } else {
    content+= '<tr id="order_sell_profit"><td>预计盈亏</td><td id="order_profit_'+$(this).attr('data-orderid')+'" class="price-down">'+$(this).attr('data-profit')+'</td></tr>';
  }
  
  content+= '<tr><td class="sellBtn j_order_sell_btn" colspan="2"><a href="#nogo" class="conSell" onclick="orderSell(\''+$(this).attr('data-orderid')+'\')">确定</a></td></tr></tbody></table>';
  if ('U' == $(this).attr("data-dir")) {
    content+= '<div class="jiaoyiDir"><img src="static/images/zhang.png"></div>';
  } else {
    content+= '<div class="jiaoyiDir"><img src="static/images/die.png"></div>';
  }
  
  layer.open({
    type: 1,
    title: '平仓',
    skin: 'order-sell',
    content: content
  });
});

// 订单建仓
function orderSubmit() {
  if (0 == $('#order_paytype').val()) {
    if (User.balance < parseInt($('#deposit').html())) return;
  } else {
    if (User.giftBalance < parseInt($('#deposit').html())) return;
  }
  var itemid = $('#order_itemid').val();
  var name   = $('#order_name').val();
  var count  = $('#order_num').val();
  var dir    = $('#order_dir').val();
  var price  = $('.j_buy_price').html();
  var name   = $('#order_name').val();
  var type   = $('#order_paytype').val();
  var ticket = 0;

  // 使用余额支付可使用优惠券
  if (0 == type && $('.j_order_ticket').length > 0) {
    if ($('.j_order_ticket option:selected').val()) {
      ticket = $('.j_order_ticket option:selected').val();
    }
  }

  $.ajax({
    url: '/chsea_app/h5/buy',
    data: {
      itemid: itemid,
      count: count,
      dir: dir,
      ticket: ticket,
      zy: 0,
      zs: 0,
      buyType: 0,
      price: price,
      payType: type,
      ts: new Date().getTime()
    },
    dataType: 'JSON',
    success: function(ret) {
      if (0 != ret.resultCode) {
        layer.alert(ret.msg);
        return;
      }
      layer.closeAll();
      initOrder();
      initUser();
      var service = g_item[itemid].sellServiceFee * count;
      orderChange(ret.txid, name, count, dir, price, type, service);
    },
    error: function() {
      layer.alert('订单提交失败');
    }
  });
}

// 订单平仓
function orderSell(orderid) {
  $.ajax({
    url: '/chsea_app/h5/sell',
    dataType: 'JSON',
    data:{
      orderid: orderid,
      ts: new Date().getTime()
    },
    success: function(ret){
      if (0 != ret.resultCode) {
        layer.alert(ret.msg);
        return;
      }
      initUser();
      orderSellSuccess(orderid);
    }
  });
}

// 订单平仓成功提示
function orderSellSuccess(orderid) {
  $('#order_sell_title').html('平仓成功');
  $.ajax({
    url: '/chsea_app/h5/orderInfo',
    dataType: 'JSON',
    data: {
      orderid: orderid,
      ts: new Date().getTime()
    },
    success: function(ret){
      if (0 != ret.resultCode) {
        layer.alert(ret.msg);
        return;
      }
      $('#order_sell_price').html('<td>成交价格:</td><td>'+ret.sellPrice+'</td>');
      $('#order_sell_service').show();
      var html = parseFloat(ret.sellServiceFee)+parseFloat(ret.buyServiceFee);
      if (ret.ticketValue > 0) {
        html+= '&nbsp;<span class="price-up">(抵'+ret.ticketValue+'元)</span>';
      }
      $('#order_sell_service td').eq(1).html(html);
      if (ret.floatValue>=0) {
        $('#order_sell_profit').html('<td>盈亏:</td><td class="price-up">'+ret.floatValue+'</td>');
      } else {
        $('#order_sell_profit').html('<td>盈亏:</td><td class="price-down">'+ret.floatValue+'</td>');
      }
      $('.j_order_sell_btn').html('<a href="javascript:layer.closeAll()" class="conSell">关闭</a>');
      initOrder();
    }
  });
}

// 重新渲染K线图
function init_kchart() {
  k_after  = 0;
  KChart.x_data = [];
  KChart.initFlag   = true;
  KChart.option = null;

  if ('time' == KChart.type) {
    KChart.data = [];
    k_time_line();
  } else {
    KChart.data = {};
    k_line();
  }
}

// 重新初始化产品
function initProduct() {
  if (g_code == Con.code) {
    $('#pro_name').html('中海油(元/桶)');
    $('#pro_code').html(Con.code);
  } else {
    $('#pro_name').html('中海银(元/千克)');
    $('#pro_code').html(Ag.code);
  }
  if (typeof g_product_arr[g_code] == 'undefined') {
    $.ajax({
      url: '/chsea_app/h5/itemList',
      data: {ts: new Date().getTime()},
      async: false,
      dataType: 'json',
      success: function(ret) {
        $.each(ret.categories, function(i, item){
          g_product_arr[item.code] = item;
          $.each(item.itemList, function(k,v){
            g_item[v.itemId] = v;
          });
        });
        if (g_product_arr) {
          initProduct();
        }
      }
    });
  } else {
    var html = '';
    $.each(g_product_arr[g_code].itemList, function(i, item){
      html+= '<ul><li><a href="#nogo" data-code="'+g_code+'" data-name="'+item.name+'" data-dir="U" data-price="'+item.price+'" data-itemid="'+item.itemId+'" data-limit="'+item.buyLimit+'" class="operateRise j_buy">买多</a></li>';
      html+= '<li><div class="king_pro"><em>'+item.name+'</em><b>'+item.price+'元/手</b></div>';
      html+= '<div class="money_pto">波动盈亏:'+item.minFloat+'元</div></li>';
      html+= '<li><a href="#nogo" data-code="'+g_code+'" data-name="'+item.name+'" data-dir="D" data-price="'+item.price+'" data-itemid="'+item.itemId+'" data-limit="'+item.buyLimit+'" class="operateRise j_buy">卖空</a></li></ul>';
    });
    $('#product_block').html(html);
  }
}

// 定时刷新订单信息
function refreshOrder() {
  var url = base.HTTP_HOST+'h5/orders';
  var ret = ZB_Util.intfGet(url, {});
  if (0 != ret.resultCode) return;
  if (0 == ret.count) {
    $('.j_dashboard').hide();
    clearInterval(order_timer);
    order_timer = null;
    User.itemNumber = [];
    return;
  }
  $('#order_count').html(ret.count);
  /* 实时盈亏 */
  $('#now_profit').html(ret.totalFloat);
  $('#now_profit').removeClass();
  if (ret.totalFloat >= 0) {
    $('#now_profit').addClass('price-up');
  } else {
    $('#now_profit').addClass('price-down');
  }

  /*开启交易面板*/
  $('.j_dashboard').css('display', 'block');

  /* 渲染订单列表 */
  var html = '';
  User.itemNumber.length = 0;
  $.each(ret.orders, function(i, item){
    // 保存已建仓各产品手数\
    if ('undefined' == typeof(User.itemNumber[item.itemId])) {
      User.itemNumber[item.itemId] = item.amount;
    } else {
      User.itemNumber[item.itemId] += item.amount;
    }
    // 实时更新平常盈亏
    if ($('#order_profit_'+item.orderid).length) {
      $('#order_profit_'+item.orderid).html(item.floatValue);
      $('#order_profit_'+item.orderid).removeClass();
      if (item.floatValue >= 0) {
        $('#order_profit_'+item.orderid).addClass('price-up');
      } else {
        $('#order_profit_'+item.orderid).addClass('price-down');
      }
    }
    if (item.dir == 'U') {
      var dirname  = '涨';
      var dirclass = 'price-up';
    } else {
      var dirname  = '跌';
      var dirclass = 'price-down';
    }
    var price_class = item.floatValue >= 0 ? 'price-up' : 'price-down';
    html+= '<tr class="sellPro" title="361288">';
    html+= '<td>'+item.itemName+'</td><td><i class="orderListDir '+dirclass+'">'+dirname+'</i></td>';
    html+= '<td>'+item.amount+'手</td><td><i class="realFlo '+price_class+'">'+item.floatValue+'('+item.floatRate+'%)</i></td>';
    html+= '<td class="sell"><a href="#nogo"><span class="j_btn_order_view" data-name="'+item.itemName+'" data-code="'+item.code+'" data-num="'+item.amount+'" data-dir="'+item.dir+'" data-orderid="'+item.orderid+'" data-profit="'+item.floatValue+'">平仓</span></a></td></tr>';
  });
  $('#order_block').html(html);
}

// 初始化订单
function initOrder() {
  refreshOrder();
  if (!order_timer) {
    order_timer = setInterval('refreshOrder()', 3000);
  }
}

// 验证交易密码自动提交
$(document).on('keyup', '#valid_pwd', function(){
  var pwd_length = 6;
  var pwd = $('#valid_pwd').val();
  if ('' !== pwd && !/^\d+$/.test(pwd)) {
    $('.layui-layer-title').html('输入了非法字符');
    $('.layui-layer-title').css('color', 'red');
    $('#valid_pwd').val('');
    return;
  } else {
    $('.layui-layer-title').html('验证交易密码');
    $('.layui-layer-title').css('color', '#333');
  }
  if (pwd.length >= pwd_length) {
    $('#valid_pwd').blur();
    $.ajax({
      url: '/chsea_app/h5/validateDealPwd',
      dataType: 'JSON',
      data: {
        dealPwd: $.base64.encode(pwd),
        ts: new Date().getTime()
      },
      success: function(ret){
        if (0 == ret.resultCode) {
          layer.closeAll();
          activityTicket();
        } else {
          $('#valid_pwd').val('');
          $('.layui-layer-title').html(ret.msg);
          $('.layui-layer-title').css('color', 'red');
        }
      }
    });
  }
})

// 建仓操作
$(document).on('click', '.j_buy', function(){
  if (Config.closeBusiness) {
    closeBusinessMsg();
    return;
  }
  // 读取用户可用优惠券
  var user_ticket = ZB_User.getTicket();
  var content = '';
  content+= '<div class="operate_main">';
  content+= '<div class="operate-act-type">';
  content+= '<span class="operate-act-active j_buy_tab" data-type="cash">现金交易</span>';
  content+= '<span class="j_buy_tab" data-type="gift">体验金交易</span></div>';
  content+= '<div class="operate_line">';
  content+= '<span>当前价格: ';
  if ($(this).attr('data-code') == Con.code) {
    content+= '<b class="j_buy_price">'+Con.newPrice+'</b>';
  } else {
    content+= '<b class="j_buy_price">'+Ag.newPrice+'</b>';
  }
  content+= '</span></div>';
  content+= '<div class="operate_line"><div>';
  content+= '<i class="operate_name"></i>';
  content+= '<span id="buy_pay_type" data-balance="'+User.balance+'">可用资产：'+User.balance+'</span>';
  content+= '</div></div>';
  content+= '<div class="operate_line">';
  content+= '<span>选择数量:</span>';
  if ('U' == $(this).attr('data-dir')) {
    content+= '<span class="oper_dir"><img src="static/images/zhang.png" /></span>';
  } else {
    content+= '<span class="oper_dir"><img src="static/images/die.png" /></span>';
  }
  content+= '<div class="operate_num">';
  // 最大购买手数=限购手数-持仓手数
  var max_limit = 0;
  var itemid = $(this).attr('data-itemid');
  if (User.itemNumber[itemid]) {
    max_limit = $(this).attr('data-limit')-User.itemNumber[itemid];
  } else {
    max_limit = $(this).attr('data-limit');
  }
  content+= '<b class="j_btn_order_num" style="cursor:pointer" data-num="-1" data-max="'+max_limit+'">-</b>';
  content+= '<input type="tel" value="1" id="order_num" readonly="readonly">';
  content+= '<i class="j_btn_order_num" style="cursor:pointer" data-num="1" data-max="'+max_limit+'">+</i>';
  content+= '</div></div>';
  content+= '<div class="operate_line">';
  content+= '<span>占用保证金: <i id="deposit" data-price="'+$(this).attr('data-price')+'">'+$(this).attr('data-price')+'</i>元</span>';
  content+= '</div>';
  content+= '<div class="operate_line">';
  content+= '<span class="j_order_ticket_block">手续费抵用券: <select class="j_order_ticket">';
  $.each(user_ticket, function(i, item){
    content+= '<option value="'+item.tid+'">'+item.value+'元</option>';
  });
  content+= '<option value="">无</option>';
  content+= '</select></span></div>';
  
  content+= '<div class="operate_buy">';
  if (User.balance>$(this).attr('data-price')) {
    content+= '<a href="#nogo" onclick="orderSubmit()" id="btn_order_submit" class="balance-enough">购 买</a>';
  } else {
    content+= '<a href="#nogo" onclick="orderSubmit()" id="btn_order_submit" class="balance-no-enough">资金不足</a>';
  }
  content+= '<input type="hidden" id="order_name" value="'+$(this).attr('data-name')+'"/>';
  content+= '<input type="hidden" id="order_itemid" value="'+$(this).attr('data-itemid')+'"/>';
  content+= '<input type="hidden" id="order_dir" value="'+$(this).attr('data-dir')+'"/>';
  content+= '<input type="hidden" id="order_paytype" value="0"/>';
  content+= '</div></div>';
  layer.open({
    type: 1,
    title: $(this).attr('data-name'),
    shadeClose: true,
    skin: 'order-buy',
    content: content
  });
});

/**
 * 改变订单止盈止损
 * @param orderid 订单ID
 * @param name 产品名称
 * @param count 交易手数
 * @param dir 购买方向
 * @param price 成交价格
 * @param type 0现金建仓、1体验金建仓
 * @param service 手续费
 */
 function orderChange(orderid, name, count, dir, price, type, service) {
  var content = '';
  content+= '<div class="sucessBuy">';
  content+= '<div>交易名称 : <span>'+name+'</span></div>';
  content+= '<div style="position: relative;">交易手数 : <span>'+count+'</span>手';
  if ('U' ==  dir) {
    content+= '<img src="static/images/zhang.png" /></div>';
  } else {
    content+= '<img src="static/images/die.png" /></div>';
  }
  content+= '<div>成交价格 : <s>'+price+'</s></div>';
  content+= '<div class="Demo">';
  content+= '<span>止&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;盈：</span><input id="scroll_win" type="range" min="0" max="90" step="10" value="0" onchange="scrollWin()"/><span>0/90</span>';
  content+= '<div class="Main">';
  content+= '<p style="text-align:center;"></p></div></div>';
  content+= '<div class="Demo">';
  content+= '<span>止&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;损：</span><input id="scroll_lose" type="range" min="0" max="60" step="10" value="60" onchange="scrollLose()"/><span>60/60</span>';
  content+= '<div class="Main">';
  content+= '<p style="text-align:center;"></p></div></div>';
  content+= '<div class="sucBtnDiv"><a href="#nogo" class="sucBtn" onclick="orderSave(\''+orderid+'\')">保 存</a>';
  content+= '</div></div>';
  layer.open({
    type: 1,
    title: '购买成功',
    skin: 'order-change',
    content: content,
    end: function(){
      // 现金建仓手续费20%大于1元弹窗返券提醒
      if (0 == type && service * 0.2 >= 1) {
        layer.msg('恭喜您获得手续费抵用劵',{
          skin: 'ticket-notice'
        });
      }
    }
  });
}

// 止盈滚动条
function scrollWin() {
  var value = $('#scroll_win').val();
  if (value == 10) {
    value = 20;
    $('#scroll_win').val(value);
  }
  $('#scroll_win+span').html(value+'/90');
}

// 止损滚动条
function scrollLose() {
  var value = $('#scroll_lose').val();
  if (value == 10) {
    value = 20;
    $('#scroll_lose').val(value);
  }
  $('#scroll_lose+span').html(value+'/60');
}

// 保存订单
function orderSave(orderid) {
  var win_value  = $('#scroll_win').val();
  var lose_value = $('#scroll_lose').val();
  if (!win_value && !lose_value) {
    layer.closeAll();
    return;
  }
  var params = {
    orderid: orderid,
    zy: win_value,
    zs: lose_value,
    ts: new Date().getTime()
  };
  $.ajax({
    url: '/chsea_app/h5/changeOrder',
    dataType: 'json',
    data: params,
    success: function(ret){
      if (0 != ret.resultCode) {
        layer.alert(ret.msg);
        return;
      }
      layer.closeAll();
    },
    error: function(){
      layer.alert('接口请求失败请稍后重试');
    }
  });
}

// 休市
function closeBusiness() {
  Config.closeBusiness = true;
  vm.latestPrice  ='休市';
  vm.latestDirCss = 'price-up';
  vm.lastDayPrice = '';
  vm.todayPrice   = '';
  $('#tab_con_price').empty();
  $('#tab_ag_price').empty();
  $('#tab_con_price+span').removeClass();
  $('#tab_ag_price+span').removeClass();
  vm.changePrice = '';
  vm.changeScale = '';
  $('.j_dashboard').hide();
}

// 休市提醒
function closeBusinessMsg() {
  layer.open({
    title: '休市中',
    skin: 'index-closebusiness',
    btn: false,
    shadeClose: true,
    content: '周六4:00至周一8:00休市<br/>休市期间无法交易'
  });
}

// 打开优惠券对话框
function dialogTicket() {
  layer.closeAll();
  if (!ZB_User.isRealName()) {
    $('body').append(base.layout_realname);
    $('.j_realname').show();
    return;
  }
  var content = '<div class="card-ticket-lists j_ticket_dialog">';
  var tickets = ZB_User.getTicket();
  if (0 == tickets.length) {
    layer.msg('您的账号没有优惠券');
    return;
  }
  var cur_ticket = ZB_Util.getCookie('use_ticket_id');
  $.each(ZB_User.getTicket(), function(i, item){
    content+= '<div class="card-list-item j_user_ticket" data-id="'+item.tid+'" data-value="'+item.value+'" onclick="selectTicket(this)">';
    if (cur_ticket == item.tid) {
      content+= '<div class="card-active"><div></div></div>';
    }
    content+= '<div class="card-list-left"><h5>有效期:<span class="card-left-moth"></span>'+item.expire.substr(5, 2)+'月</h5>';
    content+= '<h6><span class="card-left-day">'+item.expire.substr(8, 2)+'</span>日</h6></div>';
    content+= '<div class="card-list-right">￥<span>'+item.value+'</span></div></div>';
  });
  content+= '</div>';
  layer.open({
    shift: 1,
    title:'选择后交易自动抵扣手续费',
    skin: 'index-ticket',
    content: content
  });
}

// 选择使用优惠券
function selectTicket(obj) {
  $('.j_user_ticket .card-active').remove();
  if ($(obj).attr('data-id') == ZB_Util.getCookie('use_ticket_id')) {
    ZB_Util.setCookie('use_ticket_id', '');
    return;
  }
  $(obj).prepend('<div class="card-active"><div></div></div>');
  ZB_Util.setCookie('use_ticket_id', $(obj).attr('data-id'), 1);
  ZB_Util.setCookie('use_ticket_value', $(obj).attr('data-value'), 1);
}

// 读取最新资讯
function initNews() {
  var url = base.HTTP_HOST+'h5/webNoticeInformation';
  var result = ZB_Util.intfGet(url, {pageSize:3});
  if (0 != result.resultCode || result.noticeInformation.length == 0) {
    $('.j_news_block').hide();
    return;
  }
  var html = '';
  $.each(result.noticeInformation, function(i, item){
    var date = new Date();
    date.getTime(item.date);
    html+= '<div class="news_main"><s></s>';
    html+= '<div class="news_zi">';
    html+= '<div class="news_up"><a href="'+item.address+'">'+item.title+'</a></div>';
    html+= '<div class="news_down">'+date.toLocaleDateString()+'</div>';
    html+= '</div></div>';
  });
  $('.j_news_block').append(html);
}

// 50元优惠券活动
function activityTicket() {
  if ('realname' == ZB_Util.getCookie('dialog_gift') || !ZB_Util.getCookie('notice_give')) {
    layer.open({
      title: '',
      closeBtn: 0,
      btn: false,
      skin: 'index-gift',
      content: '<img onclick="if(ZB_User.isRealName()){location.href=\'myticket.html\'}else{location.href=\'realname.html\'}" src="/static/images/tic_50.png" width="100%" height="100%">',
      success: function(index, layero){
        ZB_Util.setCookie('notice_give', 1, 72);
        ZB_Util.setCookie('dialog_gift', '');
      }
    });
  }
}

initUser();
k_time_line();
initOrder();
initProduct();
timerTask();
initNews();

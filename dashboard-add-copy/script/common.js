window.data = {block: [], trade: []};
// addBlockMock();
window.organizations = [];

function setRem() {
  var docEl = document.documentElement;
  var clientWidth = docEl.clientWidth;
  if (!clientWidth) return;
  docEl.style.fontSize = 100 * (clientWidth / 2560) + 'px';
}

function setBackgroundImgSize() {
  document.getElementsByTagName('body')[0].style.backgroundSize = $(window).width() + 'px ' + $(window).height() + 'px';
}

function setTableStyle() {
  var height = $('#latest-trade').height();
  $('th').height(Math.floor(height * 0.108)).css({'line-height': Math.floor(height * 0.108) + 'px'});
  $('td').height(Math.floor(height * 0.097)).css({'line-height': Math.floor(height * 0.108) + 'px'});
}

function initNumAni() {
  numAni['block_height'] = $('#block-height').numberAnimate({num: 10000, speed: 2000});
  window.numAniResize1 = function (spanHei) {
    numAni['block_height'].onResize(spanHei)
  };
  numAni['user_count'] = $('#user-count').numberAnimate({num: 1000, speed: 2000});
  window.numAniResize2 = function (spanHei) {
    numAni['user_count'].onResize(spanHei)
  };
  numAni['trade_count'] = $('#trade-count').numberAnimate({num: 1000000, speed: 2000});
  window.numAniResize3 = function (spanHei) {
    numAni['trade_count'].onResize(spanHei)
  };

  $.getJSON(
    'http://dashboard.baoquan.com/api/v1/main/bq_data',
    function (data) {
      if (typeof(data) !== 'object') data = JSON.parse(data);

      if (data.userCount && data.attestationCount && data.data) {
        numAni['user_count'].resetData(parseInt(data.userCount));

        numAni['trade_count'].resetData(parseInt(data.attestationCount));

        for (var i = 0; i < data.data.length; i++) {
          $.extend(data.data[i], {organizationName: simplifyName(data.data[i].organizationName)});
        }
        window.data.trade = data.data;
        buildTable('trade', window.data.trade);
        addMsg(window.data.trade);
      } else {
        console.error('error:数据错误');
      }
    }
  );

  $.getJSON(
    'http://dashboard.baoquan.com/api/v1/main/bq_factom',
    function (data) {
      if (typeof(data) !== 'object') data = JSON.parse(data);

      if (data.blockCount && data.blocks) {
        numAni['block_height'].resetData(parseInt(data.blockCount));

        window.data.block = data.blocks;
        buildTable('block', window.data.block);
      } else {
        console.error('error:数据错误');
      }
    }
  );
}

function getCohorts() {
  buildChart();
}

function useSocket() {
  var socket = io('http://bq.acz.xin:1337');

  socket.on('connect', function () {
    console.log('webSocket connect success!');
  });

  socket.on('add block height', function (msg) {
    console.log(msg);
    numAni['block_height'].resetData(msg)
  });

  socket.on('add user count', function (msg) {
    console.log(msg);
    numAni['user_count'].resetData(parseInt(msg));
  });

  socket.on('add trade count', function (msg) {
    console.log(msg);
    numAni['trade_count'].resetData(parseInt(msg))
  });

  socket.on('add blocks', function (msg) {
    console.log(msg);
    var msg1 = JSON.parse(msg);
    if (!(msg1 instanceof Array)) {
      msg1 = [msg1];
    }

    buildTable('block', data.block, msg1);
  });

  socket.on('add trades', function (msg) {
    console.log(msg);
    var msg1 = JSON.parse(msg);
    if (!(msg1 instanceof Array)) {
      msg1 = [msg1];
    }

    for (var i = 0; i < msg1.length; i++) {
      $.extend(msg1[i], {organizationName: simplifyName(msg1[i].organizationName)});
    }
    buildTable('trade', data.trade, msg1);
    addMsg(msg1);
  });

  socket.on();
}

function buildTable(id, originData, addData) {
  var d = originData || [
        {
          sequencenumber: '浙金网',
          keymr: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          trade_count: 2,
          timestamp: '2017-03-22   14:59:32'
        },
        {
          sequencenumber: '浙金网',
          keymr: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          trade_count: 2,
          timestamp: '2017-03-22   14:59:32'
        },
        {
          sequencenumber: '浙金网',
          keymr: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          trade_count: 2,
          timestamp: '2017-03-22   14:59:32'
        },
        {
          sequencenumber: '浙金网',
          keymr: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          trade_count: 2,
          timestamp: '2017-03-22   14:59:32'
        },
        {
          sequencenumber: '浙金网',
          keymr: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          trade_count: 2,
          timestamp: '2017-03-22   14:59:32'
        },
        {
          sequencenumber: '浙金网',
          keymr: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          trade_count: 2,
          timestamp: '2017-03-22   14:59:32'
        },
        {
          sequencenumber: '浙金网',
          keymr: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          trade_count: 2,
          timestamp: '2017-03-22   14:59:32'
        },
        {
          sequencenumber: '浙金网',
          keymr: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          trade_count: 2,
          timestamp: '2017-03-22   14:59:32'
        }
      ],
    trade = $('#' + id),
    children = trade.children(),
    tr, i;

  if (id === 'block') {
    if (addData) {
      for (i = Math.min(addData.length, 8) - 1; i >= 0; i--) {
        data.block.unshift(addData[i]);
        data.block.length = 8;
        children = trade.children();
        if (children.length >= 8) {
          children.remove(':last');
        }
        tr = $('<tr class="hidden">' +
          '<td class="line1">' + addData[i].sequencenumber + '</td>' +
          '<td class="line2">' + addData[i].keymr + '</td>' +
          '<td class="line3">' + addData[i].trade_count + '</td>' +
          '<td class="line4">' + addData[i].timestamp + '</td>' +
          '</tr>');
        trade.prepend(tr);
        tr.slideDown('slow');
      }
    } else {
      trade.empty();
      for (i = 0; i < Math.min(d.length, 8); i++) {
        tr = $('<tr class="hidden">' +
          '<td class="line1">' + d[i].sequencenumber + '</td>' +
          '<td class="line2">' + d[i].keymr + '</td>' +
          '<td class="line3">' + d[i].trade_count + '</td>' +
          '<td class="line4">' + d[i].timestamp + '</td>' +
          '</tr>');
        tr.appendTo(trade);
        tr.slideDown('slow');
      }
    }
  } else if (id === 'trade') {
    d = originData || [
        {
          organizationName: '浙金网',
          attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          tradeTime: '2017-03-22   14:59:32'
        },
        {
          organizationName: '浙金网',
          attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          tradeTime: '2017-03-22   14:59:32'
        },
        {
          organizationName: '浙金网',
          attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          tradeTime: '2017-03-22   14:59:32'
        },
        {
          organizationName: '浙金网',
          attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          tradeTime: '2017-03-22   14:59:32'
        },
        {
          organizationName: '浙金网',
          attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          tradeTime: '2017-03-22   14:59:32'
        },
        {
          organizationName: '浙金网',
          attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          tradeTime: '2017-03-22   14:59:32'
        },
        {
          organizationName: '浙金网',
          attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          tradeTime: '2017-03-22   14:59:32'
        },
        {
          organizationName: '浙金网',
          attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
          tradeTime: '2017-03-22   14:59:32'
        }
      ];
    if (addData) {
      for (i = Math.min(addData.length, 8) - 1; i >= 0; i--) {
        data.trade.unshift(addData[i]);
        data.trade.length = 8;
        children = trade.children();
        if (children.length >= 8) {
          children.remove(':last');
        }
        tr = $('<tr class="hidden">' +
          '<td class="trade-line1">' + addData[i].organizationName + '</td>' +
          '<td class="trade-line2">' + addData[i].attestationId + '</td>' +
          '<td class="trade-line3">' + addData[i].tradeTime + '</td>' +
          '</tr>');
        trade.prepend(tr);
        tr.slideDown('slow');
      }
    } else {
      trade.empty();
      for (i = 0; i < Math.min(d.length, 8); i++) {
        tr = $('<tr class="hidden">' +
          '<td class="trade-line1">' + d[i].organizationName + '</td>' +
          '<td class="trade-line2">' + d[i].attestationId + '</td>' +
          '<td class="trade-line3">' + d[i].tradeTime + '</td>' +
          '</tr>');
        tr.appendTo(trade);
        tr.slideDown('slow');
      }
    }
  }
  setTableStyle();
}

function buildChart(data) {
  var d = data || {};
  console.log(d);
}

function ellipsis(str, num) {
  if (str.length > num)
    return str.substr(0, num) + '...';
  else
    return str;
}

function addBlockMock() {
  setInterval(function () {
    buildTable('block', data.block, [{
      organizationName: '浙金',
      attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
      tradeTime: '2017-03-22   14:59:32'
    }])
  }, 2000);
}

function addMsg(msg) {
  for (var i = 0; i < msg.length; i++) {
    var m = Object.assign({}, msg[i]);

    if (window.msg) {
      window.msg.push(m);
    } else {
      m.index = setMsg3dIndex(m.organizationName);
      m.totalFrames = totalFrames;
      m.loopFrames = loopFrames;
      m.finalPosition = {
        x: 850,
        y: 330,
        z: 0
      };
      msg3d.push(m);
    }
  }
}

function setMsg3dIndex(m) {
  for (var i = 0; i < organizations.length; i++) {
    if (organizations[i].name === m) break;
  }
  if (i === organizations.length) {
    organizations.push({name: m, index: organizations.length});
  }

  return i;
}

function simplifyName(name) {
  var names = [
    '浙江数牛金融信息服务有限公司',
    '浙江算力网络科技有限公司',
    '卡联科技集团股份有限公司',
    '杭州乐筹金融信息服务有限公司',
    '广州力昇互联网金融信息服务有限公司',
    '北京恒善普惠信息咨询有限公司',
    'Baobabtree',
    'Diplomme',
    '浙江鉴信科技有限公司',
    '杭州千麦检测技术有限公司',
    '杭州拾贝知识产权服务有限公司',
    '天津易商互动软件技术咨询有限公司',
    '北方工业股权交易中心有限责任公司'
  ];
  var simpleNames = [
    '数牛金服',
    '算力宝',
    '卡联科技',
    '乐筹金融',
    '力昇金融',

    '恒善普惠',
    'Baobabtree',
    'Diplomme',
    '鉴信科技',
    '杭州千麦',

    '杭州拾贝',
    '易商互动',
    '北方工业'
  ];
  for (var i = 0; i < names.length; i++) {
    if (name === names[i] || name === simpleNames[i]) break;
  }
  if (i === names.length) {
    console.log('信息来源不明！请确认信息');
    return name;
  } else {
    return simpleNames[i];
  }
}

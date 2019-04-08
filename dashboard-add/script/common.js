window.data = {block: [], trade: []};
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
  numAni['block_height'] = $('#block-height').numberAnimate({num: 0, speed: 2000});
  window.numAniResize1 = function (spanHei) {
    numAni['block_height'].onResize(spanHei)
  };
  numAni['user_count'] = $('#user-count').numberAnimate({num: 0, speed: 2000});
  window.numAniResize2 = function (spanHei) {
    numAni['user_count'].onResize(spanHei)
  };
  numAni['trade_count'] = $('#trade-count').numberAnimate({num: 0, speed: 2000});
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

function useSocket() {
  var socket = io('http://bq.acz.xin:1337');

  socket.on('connect', function () {
    console.log('webSocket connect success!');
  });

  socket.on('add block height', function (msg) {
    // console.log(msg);
    numAni['block_height'].resetData(msg)
  });

  socket.on('add user count', function (msg) {
    // console.log(msg);
    numAni['user_count'].resetData(parseInt(msg));
  });

  socket.on('add trade count', function (msg) {
    // console.log(msg);
    numAni['trade_count'].resetData(parseInt(msg))
  });

  socket.on('add blocks', function (msg) {
    // console.log(msg);
    var msg1 = JSON.parse(msg);
    if (!(msg1 instanceof Array)) {
      msg1 = [msg1];
    }

    buildTable('block', data.block, msg1);
  });

  socket.on('add trades', function (msg) {
    // console.log(msg);
    var msg1 = JSON.parse(msg);
    if (!(msg1 instanceof Array)) {
      msg1 = [msg1];
    }

    buildTable('trade', data.trade, msg1);
    addMsg(msg1);
  });

  socket.on();
}

function buildTable(id, originData, addData) {
  var d = originData,
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
    d = originData;
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

function ellipsis(str, num) {
  if (str.length > num)
    return str.substr(0, num) + '...';
  else
    return str;
}

function addMsg(msg) {
  for (var i = 0; i < msg.length; i++) {
    var m = Object.assign({}, msg[i]);

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

function setMsg3dIndex(m) {
  for (var i = 0; i < organizations.length; i++) {
    if (organizations[i].name === m) break;
  }
  if (i === organizations.length) {
    organizations.push({name: m, index: organizations.length});
  }

  return i;
}

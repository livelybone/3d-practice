$(document).ready(function () {
  setRem();
  setBackgroundImgSize();
  setTableStyle();

  window.numAni = {};

  window.canvas = $('#canvas');
  window.c = canvas[0].getContext('2d');
  window.dot = [
    {
      x: 0,
      y: 0,
      r: 7,
      color: '235,97,0',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '235,97,0',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '255,244,92',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '255,244,92',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '255,244,92',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '0,255,255',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '0,255,255',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '0,255,255',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '0,255,255',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '0,255,255',
      shadowR: Math.floor(Math.random() * 11) + 7
    },
    {
      x: 0,
      y: 0,
      r: 7,
      color: '0,255,255',
      shadowR: Math.floor(Math.random() * 11) + 7
    }
  ];
  window.circle = new Image();
  window.img = [
    new Image(),
    new Image()
  ];
  window.shadow = new Image();
  window.gif = new Image();
  circle.setAttribute('crossOrigin', 'anonymous');
  img[0].setAttribute('crossOrigin', 'anonymous');
  img[1].setAttribute('crossOrigin', 'anonymous');
  shadow.setAttribute('crossOrigin', 'anonymous');
  circle.src = 'style/img/circle.png';
  img[0].src = 'style/img/img1.png';
  img[1].src = 'style/img/img2.png';
  shadow.src = 'style/img/shadow.png';

  window.timer = null;

  window.msg = [];

  window.renderSpeed = 100;
  window.dotAniFPS = 15;
  window.msgAniFPS = 35;

  window.winResize = function () {
    setRem();
    setBackgroundImgSize();
    setTableStyle();
    drawCanvas();
    var spanHei = parseFloat(document.documentElement.style.fontSize) * .7;
    numAniResize1(spanHei);
    numAniResize2(spanHei);
    numAniResize3(spanHei);
  };

  initNumAni();

  drawCanvas();
  window.addEventListener('resize', winResize, false);
  useSocket()
});

function drawCanvas() {
  clearInterval(timer);
  window.timer = setInterval(function () {
    buildCanvas();
  }, renderSpeed);
}

function buildCanvas() {
  var canvasBox = $('#canvas-box'),
    height = canvas[0].height = canvasBox.height(),
    width = canvas[0].width = canvasBox.width(),
    scale = document.documentElement.clientWidth / 2560 < document.documentElement.clientHeight / 1600 ?
      document.documentElement.clientWidth / 2560 : document.documentElement.clientHeight / 1600;
  c.translate(0.5, 0.5);
  c.scale(scale, scale);

  c.drawImage(circle, (width / 2 - circle.width * scale / 2) / scale, (height / 2 - circle.height * scale / 2) / scale);
  c.drawImage(img[0], (width / 2 - circle.width * scale / 2) / scale - img[0].width, (height / 2 - img[0].height * scale / 2) / scale);
  c.drawImage(img[1], width / 2 / scale + 270, height / 2 / scale - 136);
  c.drawImage(img[1], width / 2 / scale + 110, height / 2 / scale + 280);
  c.drawImage(shadow, (width / 2 - shadow.width * scale / 2) / scale, (height / 2 + circle.height * scale / 2) / scale - 20);

  setDotPosition(scale, width, height);
  for (var i = 0; i < dot.length; i++) {
    buildCircle(dot[i]);
  }
  reduceMsg();
  for (var j = 0; j < msg.length; j++) {
    buildTradeMessage(scale, msg[j]);
  }
}

function setDotPosition(scale, canvasWidth, canvasHeight) {
  dot[0].x = canvasWidth / 2 / scale - 141;
  dot[0].y = canvasHeight / 2 / scale - 80;
  dot[1].x = canvasWidth / 2 / scale - 200;
  dot[1].y = canvasHeight / 2 / scale - 210;
  dot[2].x = canvasWidth / 2 / scale - 216;
  dot[2].y = canvasHeight / 2 / scale - 23;
  dot[3].x = canvasWidth / 2 / scale - 328;
  dot[3].y = canvasHeight / 2 / scale - 97;
  dot[4].x = canvasWidth / 2 / scale - 293;
  dot[4].y = canvasHeight / 2 / scale + 166;
  dot[5].x = canvasWidth / 2 / scale + 169;
  dot[5].y = canvasHeight / 2 / scale - 80;
  dot[6].x = canvasWidth / 2 / scale + 249;
  dot[6].y = canvasHeight / 2 / scale - 70;
  dot[7].x = canvasWidth / 2 / scale + 278;
  dot[7].y = canvasHeight / 2 / scale - 140;
  dot[8].x = canvasWidth / 2 / scale + 140;
  dot[8].y = canvasHeight / 2 / scale - 233;
  dot[9].x = canvasWidth / 2 / scale + 336;
  dot[9].y = canvasHeight / 2 / scale + 26;
  dot[10].x = canvasWidth / 2 / scale + 320;
  dot[10].y = canvasHeight / 2 / scale + 150;
}

function buildCircle(dot) {
  c.fillStyle = 'rgba(' + dot.color + ',' + (1 - (dot.shadowR - 7) / dotAniFPS) + ')';
  c.beginPath();
  c.arc(dot.x, dot.y, dot.shadowR, 0, 2 * Math.PI);
  c.fill();

  dot.shadowR <= (7 + dotAniFPS) ? dot.shadowR += 1 : dot.shadowR = 7;

  c.fillStyle = 'rgb(' + dot.color + ')';
  c.beginPath();
  c.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
  c.fill();
}

function buildTradeMessage(scale, msg) {
  msg.dot = msg.dot === undefined ? Math.floor(Math.random() * 11) : msg.dot;
  msg.duration -= renderSpeed;

  var line1_offX = msg.dot > 4 ? -100 : 100,
    line2_offX = msg.dot > 4 ? -200 : 200,
    line2_offY = 200,
    rect_width = 200,
    rect_height = 120,
    rect_offX = line2_offX + rect_width / 2,
    rect_offY = line2_offY + rect_height;

  c.beginPath();
  c.strokeStyle = 'rgba(' + dot[msg.dot].color + ',.6)';
  c.lineWidth = 2 / scale;
  /*if (msg.duration === 0) {
   } else if (msg.duration === 100 * (msgAniFPS - 1) || msg.duration === 100) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.stroke();
   } else if (msg.duration === 100 * (msgAniFPS - 2) || msg.duration === 200) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - (line2_offX + line1_offX) / 2, dot[msg.dot].y - line2_offY / 2);
   c.stroke();
   } else if (msg.duration === 100 * (msgAniFPS - 3) || msg.duration === 300) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.stroke();
   } else if (msg.duration === 100 * (msgAniFPS - 4) || msg.duration === 400) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
   c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
   c.stroke();
   } else if (msg.duration === 100 * (msgAniFPS - 5) || msg.duration === 500) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - (line2_offY + rect_height / 2));
   c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (line2_offY + rect_height / 2));
   c.stroke();

   c.fillStyle = 'rgba(0,143,255,0.15)';
   c.lineWidth = 0;
   c.beginPath();
   c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + rect_height / 2));
   c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + rect_height / 2));
   c.fill();
   } else if (msg.duration === 100 * (msgAniFPS - 6) || msg.duration === 600) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);

   c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
   c.stroke();

   c.fillStyle = 'rgba(0,143,255,0.15)';
   c.lineWidth = 0;
   c.beginPath();
   c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
   c.fill();
   } else if (msg.duration === 100 * (msgAniFPS - 7) || msg.duration === 700) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.stroke();

   c.fillStyle = 'rgba(0,143,255,0.15)';
   c.lineWidth = 0;
   c.beginPath();
   c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
   c.fill();
   } else if (msg.duration === 100 * (msgAniFPS - 8) || msg.duration === 800) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.stroke();

   c.fillStyle = 'rgba(0,143,255,0.15)';
   c.lineWidth = 0;
   c.beginPath();
   c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
   c.fill();
   } else if (msg.duration === 100 * (msgAniFPS - 9) || msg.duration === 900) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.stroke();

   c.fillStyle = 'rgba(0,143,255,0.15)';
   c.lineWidth = 0;
   c.beginPath();
   c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
   c.fill();

   c.font = '30px Arial,Microsoft YaHei';
   c.fillStyle = 'rgb(0,255,255)';
   c.fillText(ellipsis(msg.organizationName,6), dot[msg.dot].x - (rect_offX - 15), dot[msg.dot].y - (rect_offY - 40));
   } else if (msg.duration === 100 * (msgAniFPS - 10) || msg.duration === 1000) {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.stroke();

   c.fillStyle = 'rgba(0,143,255,0.15)';
   c.lineWidth = 0;
   c.beginPath();
   c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
   c.fill();

   c.font = '30px Arial,Microsoft YaHei';
   c.fillStyle = 'rgb(0,255,255)';
   c.fillText(ellipsis(msg.organizationName,6), dot[msg.dot].x - (rect_offX - 15), dot[msg.dot].y - (rect_offY - 40));

   c.font = '24px Arial,Microsoft YaHei';
   c.
   }else {
   c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
   c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

   c.stroke();

   c.fillStyle = 'rgba(0,143,255,0.15)';
   c.lineWidth = 0;
   c.beginPath();
   c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
   c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
   c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
   c.fill();

   c.font = '30px Arial,Microsoft YaHei';
   c.fillStyle = 'rgb(0,255,255)';
   c.fillText(ellipsis(msg.organizationName,6), dot[msg.dot].x - (rect_offX - 15), dot[msg.dot].y - (rect_offY - 40));

   c.font = '24px Arial,Microsoft YaHei';
   c.
   c.fillStyle = 'rgb(168,235,255)';
   c.fillText('ID：' + ellipsis(msg.attestationId,6), dot[msg.dot].x - (rect_offX - 15), dot[msg.dot].y - (rect_offY - 105));
   }*/
  if (msg.duration === 0) {
  } else if (msg.duration === 100 * (msgAniFPS - 1) || msg.duration === 100) {
    c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
    c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
    c.stroke();
  } else if (msg.duration === 100 * (msgAniFPS - 2) || msg.duration === 200) {
    c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
    c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

    c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

    c.stroke();

    c.fillStyle = 'rgba(0,143,255,0.15)';
    c.lineWidth = 0;
    c.beginPath();
    c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
    c.fill();
  } else if (msg.duration === 100 * (msgAniFPS - 3) || msg.duration === 300) {
    c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
    c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

    c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

    c.stroke();

    c.fillStyle = 'rgba(0,143,255,0.15)';
    c.lineWidth = 0;
    c.beginPath();
    c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
    c.fill();

    c.font = '30px Arial,Microsoft YaHei';
    c.fillStyle = 'rgb(0,255,255)';
    c.fillText(ellipsis(msg.organizationName, 6), dot[msg.dot].x - (rect_offX - 15), dot[msg.dot].y - (rect_offY - 50));
  } else {
    c.moveTo(dot[msg.dot].x, dot[msg.dot].y);
    c.lineTo(dot[msg.dot].x - line1_offX, dot[msg.dot].y);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - rect_offX, dot[msg.dot].y - rect_offY);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

    c.moveTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - line2_offY);
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width), dot[msg.dot].y - (rect_offY - 20));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 20), dot[msg.dot].y - rect_offY);
    c.lineTo(dot[msg.dot].x - line2_offX, dot[msg.dot].y - rect_offY);

    c.stroke();

    c.fillStyle = 'rgba(0,143,255,0.15)';
    c.lineWidth = 0;
    c.beginPath();
    c.moveTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (line2_offY + 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (line2_offY + 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5), dot[msg.dot].y - (rect_offY - 5 - 20));
    c.lineTo(dot[msg.dot].x - (rect_offX - rect_width + 5 + 20), dot[msg.dot].y - (rect_offY - 5));
    c.lineTo(dot[msg.dot].x - (rect_offX - 5), dot[msg.dot].y - (rect_offY - 5));
    c.fill();

    c.font = '30px Arial,Microsoft YaHei';
    c.fillStyle = 'rgb(0,255,255)';
    c.fillText(ellipsis(msg.organizationName, 4), dot[msg.dot].x - (rect_offX - 15), dot[msg.dot].y - (rect_offY - 50));

    c.font = '24px Arial,Microsoft YaHei';
    c.fillStyle = 'rgb(168,235,255)';
    c.fillText('ID：' + ellipsis(msg.attestationId, 6), dot[msg.dot].x - (rect_offX - 15), dot[msg.dot].y - (rect_offY - 95));
  }
}

function reduceMsg() {
  for (var i = 0; i < msg.length; i++) {
    if (msg[i].duration <= 0) {
      msg.splice(i, 1);
    }
  }
}

function addMsgMock() {
  var m = {
    organizationName: '浙金网',
    attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
    tradeTime: '2017-03-22   14:59:32',
    duration: 100 * msgAniFPS
  };
  buildTable('trade', data.trade, [m]);
  msg.push(m);
}
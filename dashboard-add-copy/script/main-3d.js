var camera, renderer, scene;
var group, msgGroup, bgGroup, geometry, mesh, light;
var points = [];
var times = 9;
var dotColor = ['#fff99f', '#fff129', '#ffe21f', '#fca001', '#fff45c',
    '#ece400', '#ffa26a', '#fc5f01', '#ff7a2b', '#ff7734',
    '#fc5401', '#ff904d', '#ff452c', '#ffffff', '#01fcdb',
    '#00ffff', '#7dbbf5', '#00a2ff', '#1eadff', '#7690ff'],
  msg3d = [],
  reduceIndex = [];
var msgPlaneWidth = 200,
  msgPlaneHeight = 120;
var totalFrames = 18000,
  loopFrames = 150;

$(document).ready(function () {
  setRem();
  setBackgroundImgSize();
  setTableStyle();
  setScale();

  window.numAni = {};

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

  window.renderSpeed = 100;
  window.dotAniFPS = 15;
  window.msgAniFPS = 35;

  window.winResize = function () {
    setRem();
    setBackgroundImgSize();
    setTableStyle();
    setScale();
    var spanHei = parseFloat(document.documentElement.style.fontSize) * .7;
    numAniResize1(spanHei);
    numAniResize2(spanHei);
    numAniResize3(spanHei);
    rendererResize();
  };

  initNumAni();

  // getCohorts();
  window.timer1 = setInterval(function () {
    var isLoaded = imgLoad([img[0], img[1], shadow], function () {
      initRender();
      animate();
    });
    if (isLoaded) {
      clearInterval(timer1);
    }
  }, 100);
  window.addEventListener('resize', winResize, false);
  useSocket()
});

function imgLoad(images, onLoad) {
  for (var i = 0; i < images.length; i++) {
    if (!images[i].complete)
      break;
  }
  if (i === images.length) {
    onLoad();
    return true;
  } else {
    return false;
  }
}

function setScale() {
  /*window.scale = document.documentElement.clientWidth / 2560 < document.documentElement.clientHeight / 1600 ?
   document.documentElement.clientWidth / 2560 : document.documentElement.clientHeight / 1600;*/
  window.scale = 1;
}

function initRender() {

  var canvasBox = $('#canvas-box');

  camera = new THREE.PerspectiveCamera(100, canvasBox.width() / canvasBox.height(), 1, 5500);
  camera.position.z = 4500;
  camera.zoom = scale * times;
  camera.updateProjectionMatrix();


  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(canvasBox.width(), canvasBox.height());

  $(renderer.domElement).appendTo(canvasBox);

  light = new THREE.HemisphereLight(0x00395b, 0xb34670, 1);
  light.position.set(0, 380, 0);
  scene.add(light);

  light = new THREE.DirectionalLight(0xb34670);
  light.position.set(0, -1, 100);
  scene.add(light);

  light = new THREE.DirectionalLight(0x00395b);
  light.position.set(0, 1, 100);
  scene.add(light);

  light = new THREE.DirectionalLight(0x00395b);
  light.position.set(0, 1, 0);
  scene.add(light);

  group = new THREE.Group();
  scene.add(group);

  msgGroup = new THREE.Group();
  msgGroup.rotation.z = Math.PI * 23 / 180;
  scene.add(msgGroup);

  bgGroup = new THREE.Group();
  bgGroup.rotation.z = Math.PI * 23 / 180;
  scene.add(bgGroup);

  var bg = createBgMesh(1);
  bg.mesh.position.set(-380 - bg.texture.image.width / 2 - 10, 0, 0);
  bgGroup.add(bg.mesh);

  bg = createBgMesh(2);
  bg.mesh.position.set(380 + bg.texture.image.width / 2 - 110, bg.texture.image.height / 2 + 180, -200);
  bgGroup.add(bg.mesh);

  bg = createBgMesh(2);
  bg.mesh.position.set(380 + bg.texture.image.width / 2 - 270, bg.texture.image.height / 2 - 280, 500);
  bgGroup.add(bg.mesh);

  bg = createBgMesh(3);
  bg.mesh.position.set(0, -380 - bg.texture.image.height / 2, 0);
  bgGroup.add(bg.mesh);

  geometry = new THREE.IcosahedronGeometry(380, 3);

  var material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });

  mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  var vertices = geometry.vertices;
  for (var i = 0; i < 20; i++) {
    var point = vertices[Math.floor(Math.random() * vertices.length)];
    if (i >= 0 && i < 6) {
      while (point.y > -120 || point.y < -300) {
        point = vertices[Math.floor(Math.random() * vertices.length)];
      }
    } else if (i >= 6 && i < 13) {
      while (point.y > 80 || point.y < -80) {
        point = vertices[Math.floor(Math.random() * vertices.length)];
      }
    } else if (i >= 13) {
      while (point.y > 300 || point.y < 120) {
        point = vertices[Math.floor(Math.random() * vertices.length)];
      }
    }
    points.push({point: point, color: dotColor[i]});
    createDotMesh(point, dotColor[i]);
  }
}

function animate() {
  reduceIndex = [];
  for (var i = 0; i < msg3d.length; i++) {
    if (msg3d[i].totalFrames > 0) {
      msg3dAnimation(msg3d[i], i);
    } else {
      reduceIndex.push(i);
      break;
    }
  }

  if (reduceIndex.length > 0) {
    reduceMsg3d(reduceIndex);
  }

  camera.lookAt(scene.position);

  camera.rotation.z = Math.PI * 23 / 180;

  group.rotation.y += Math.PI / 720;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

function createDotMesh(point, color) {
  var dot = new THREE.SphereGeometry(8, 20, 20);
  var dotMaterial = new THREE.MeshBasicMaterial({
    color: color,
    wireframeLinewidth: 0
  });
  var dotMesh = new THREE.Mesh(dot, dotMaterial);
  dotMesh.position.set(point.x, point.y, point.z);
  group.add(dotMesh);
}

function createBgMesh(value) {
  var image = null;

  if (value === 1) {
    image = img[0];
  } else if (value === 2) {
    image = img[1];
  } else if (value === 3) {
    image = shadow;
  }

  var bgPlane = new THREE.PlaneGeometry(image.width, image.height);
  var canvas = createBgCanvas(value, image.width, image.height);
  var src = canvas.toDataURL('image/png');
  var texture = new THREE.TextureLoader().load(src);
  var bgMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });

  return {
    mesh: new THREE.Mesh(bgPlane, bgMaterial),
    texture: texture
  };
}

function createBgCanvas(value, width, height) {
  var canvas = $('<canvas></canvas>')[0];
  canvas.width = width;
  canvas.height = height;
  var c = canvas.getContext('2d');
  if (value === 1) {
    c.drawImage(img[0], 0, 0);
  } else if (value === 2) {
    c.drawImage(img[1], 0, 0);
  } else if (value === 3) {
    c.drawImage(shadow, 0, 0);
  }

  return canvas;
}

function msg3dAnimation(m, index) {
  if (points.length > 0) {

    if (!m.outerGlowMesh) {
      var outerGlow = new THREE.SphereGeometry(8, 60, 60);
      var outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: points[m.index].color,
        transparent: true,
        opacity: 1
      });
      m.outerGlowMesh = new THREE.Mesh(outerGlow, outerGlowMaterial);
      m.outerGlowMesh.position.set(points[m.index].point.x, points[m.index].point.y, points[m.index].point.z);
      group.add(m.outerGlowMesh);
    } else {
      if (m.outerGlowMesh.material.opacity <= 0) {
        group.remove(m.outerGlowMesh);
      } else {
        m.outerGlowMesh.material.opacity -= 1 / (loopFrames / 2);
        m.outerGlowMesh.scale.x += 3 / (loopFrames / 2);
        m.outerGlowMesh.scale.y += 3 / (loopFrames / 2);
        m.outerGlowMesh.scale.z += 3 / (loopFrames / 2);
      }
    }

    if (!m.rePoint) {
      m.rePoint = getRelativePosition(points[m.index].point);
      if (m.rePoint.x < 0) {
        m.finalPosition.x *= -1;
      }
    }

    if (!m.msgGroup) {
      m.msgGroup = new THREE.Group();
      msgGroup.add(m.msgGroup);

      var msgPlane = new THREE.PlaneGeometry(msgPlaneWidth, msgPlaneHeight);

      var canvas = createMsgCanvas(m, points[m.index].color);
      var texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
      var msgPlaneMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      });
      m.msgPlaneMesh = new THREE.Mesh(msgPlane, msgPlaneMaterial);
      m.msgGroup.add(m.msgPlaneMesh);

      m.msgGroup.position.set(points[m.index].point.x, points[m.index].point.y, points[m.index].point.z);
      m.msgGroup.scale.x = 0.01;
      m.msgGroup.scale.y = 0.01;
      m.msgGroup.scale.z = 0.01;
      m.msgPlanePosition = m.rePoint;
      m.delta = {
        x: (m.rePoint.x - m.finalPosition.x) / 10,
        y: (m.rePoint.y - m.finalPosition.y) / 10,
        z: (m.rePoint.z - m.finalPosition.z) / 10
      };

      for (var i = 0; i < index; i++) {
        if (msg3d[i].finalPosition.x === m.finalPosition.x && msg3d[i].msgGroup) {
          msg3d[i].finalPosition.y -= 140;
          msg3d[i].msgPlaneMesh.material.opacity -= 0.16;
        }
      }
    } else {
      if (m.msgGroup.scale.x <= 1) {
        m.msgGroup.scale.x += 0.1;
        m.msgGroup.scale.y += 0.1;
        m.msgGroup.scale.z += 0.1;
        m.msgPlanePosition.x -= m.delta.x;
        m.msgPlanePosition.y -= m.delta.y;
        m.msgPlanePosition.z -= m.delta.z;
        m.msgGroup.position.set(m.msgPlanePosition.x, m.msgPlanePosition.y, m.msgPlanePosition.z);
      } else {
        m.msgGroup.position.set(m.finalPosition.x, m.finalPosition.y, m.finalPosition.z)
      }
    }

    m.totalFrames--;
    if (m.totalFrames <= 0) {
      group.remove(m.group);
      msgGroup.remove(m.msgGroup);
    }
  }
}

function createMsgCanvas(m, color) {
  var canvas = $('<canvas></canvas>')[0];
  canvas.width = msgPlaneWidth;
  canvas.height = msgPlaneHeight;
  var c = canvas.getContext('2d');
  c.fillStyle = 'rgba(10,33,61,1)';
  c.beginPath(8, 8);
  c.moveTo(8, msgPlaneHeight - 8);
  c.lineTo(msgPlaneWidth - 8, msgPlaneHeight - 8);
  c.lineTo(msgPlaneWidth - 8, 25);
  c.lineTo(msgPlaneWidth - 25, 8);
  c.lineTo(8, 8);
  c.fill();

  c.strokeStyle = color;
  c.lineJoin = 'round';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(1, 1);
  c.lineTo(1, msgPlaneHeight - 1);
  c.lineTo(msgPlaneWidth - 1, msgPlaneHeight - 1);
  c.lineTo(msgPlaneWidth - 1, 20);
  c.lineTo(msgPlaneWidth - 20, 1);
  c.lineTo(1, 1);
  c.stroke();

  c.font = '28px Arial,Microsoft YaHei';
  c.fillStyle = 'rgb(0,255,255)';
  c.fillText(m.organizationName, 10, 40);

  c.font = '24px Arial,Microsoft YaHei';

  c.fillStyle = 'rgb(168,235,255)';
  c.fillText('ID：' + ellipsis(m.attestationId, 6), 10, 100);

  return canvas;
}

function reduceMsg3d(index) {
  for (var i = 0; i < index.length; i++) {
    msg3d.splice(index[i], 1);
  }
}

function rendererResize() {
  var canvasBox = $('#canvas-box');

  camera.aspect = canvasBox.width() / canvasBox.height();
  camera.zoom = scale * times;

  camera.updateProjectionMatrix();

  renderer.setSize(canvasBox.width(), canvasBox.height());
}

function addMsg3dMock() {
  var m = {
    organizationName: '浙金网',
    index: setMsg3dIndex('浙金网'),
    attestationId: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
    tradeTime: '2017-04-21 08:29:38',
    totalFrames: totalFrames,
    loopFrames: loopFrames,
    finalPosition: {
      x: 650,
      y: 330,
      z: 0
    }
  };
  buildTable('trade', data.trade, [m]);
  msg3d.push(m);
}

function getRelativePosition(point) {
  var rotate = group.rotation.y;

  var r = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.z, 2));
  var angle = calcAngle(point.x, point.z, rotate);
  var _point = {
    x: r * Math.cos(angle),
    y: point.y,
    z: r * Math.sin(angle)
  };

  var r1 = Math.sqrt(Math.pow(_point.x, 2) + Math.pow(_point.y, 2));
  var angle1 = calcAngle(_point.x, _point.y, Math.PI * 23 / 180);

  return {
    x: r1 * Math.cos(angle1),
    y: r1 * Math.sin(angle1),
    z: _point.z
  }
}

function calcAngle(x, y, rotate) {
  var angle = 0;
  if (x === 0) {
    if (y > 0) {
      angle = Math.PI / 2;
    } else {
      angle = -Math.PI / 2;
    }
  } else if (x > 0) {
    angle = Math.atan(y / x);
  } else {
    if (y > 0) {
      angle = Math.atan(y / x) - Math.PI;
    } else {
      angle = Math.atan(y / x) + Math.PI;
    }
  }

  angle = (angle - rotate) % (Math.PI * 2);

  if (angle < -Math.PI) {
    angle += Math.PI * 2;
  }

  return angle;
}

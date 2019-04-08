var camera, renderer, scene;
var group, msgGroup, bgGroup, geometry, mesh, light;
var points = [];
var times = 13;
var dotColor = ['#fff45c', '#eb6100', '#00ffff'],
  msg3d = [],
  reduceIndex = [];
var msgPlaneWidth = 200,
  msgPlaneHeight = 120;

$(document).ready(function () {
  setRem();
  setBackgroundImgSize();
  setTableStyle();
  setScale();

  window.numAni = {};

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

  window.renderSpeed = 100;
  window.dotAniFPS = 15;
  window.msgAniFPS = 35;

  window.winResize = function () {
    setRem();
    setBackgroundImgSize();
    setTableStyle();
    setScale();
    // drawCanvas();
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
  window.scale = document.documentElement.clientWidth / 2560 < document.documentElement.clientHeight / 1600 ?
    document.documentElement.clientWidth / 2560 : document.documentElement.clientHeight / 1600;
}

function initRender() {

  var canvasBox = $('#canvas-box');

  camera = new THREE.PerspectiveCamera(100, canvasBox.width() / canvasBox.height(), 1, 4500);
  camera.position.z = 3500;
  camera.zoom = scale * times;
  camera.updateProjectionMatrix();


  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(canvasBox.width(), canvasBox.height());

  $(renderer.domElement).appendTo(canvasBox);

  light = new THREE.HemisphereLight(0x00395b, 0xb34670, 1);
  light.position.set(0, 380, 0);
  scene.add(light);

  /*light = new THREE.DirectionalLight(0xb34670);
   light.position.set(0, -20, 0);
   scene.add(light);*/

  /*light = new THREE.DirectionalLight(0xf4792a);
   light.position.set(0, -1, 1);
   scene.add(light);*/

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
  for (var i = 0; i < vertices.length; i++) {
    if (vertices[i].y <= 600 && vertices[i].y >= -600) {
      if (Math.round(Math.random())) {
        points.push(vertices[i]);
      }
    }
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
  // group.rotation.z += Math.PI / 720;

  renderer.render(scene, camera);

  requestAnimationFrame(animate);
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
    m.point = m.point || points[Math.floor(Math.random() * (points.length))];

    if (m.point.y > 140) {
      m.color = m.color || dotColor[2];
    } else if (m.point.y < -200) {
      m.color = m.color || dotColor[0];
    } else {
      m.color = m.color || dotColor[1];
    }
    if (!m.group) {
      m.group = new THREE.Group();
      group.add(m.group);
    }
    if (!m.dotMesh) {
      var dot = new THREE.SphereGeometry(8, 20, 20);
      var dotMaterial = new THREE.MeshBasicMaterial({
        color: m.color
      });
      m.dotMesh = new THREE.Mesh(dot, dotMaterial);
      m.dotMesh.position.set(m.point.x, m.point.y, m.point.z);
      m.group.add(m.dotMesh);
    }

    if (!m.outerGlowMesh) {
      var outerGlow = new THREE.SphereGeometry(8, 60, 60);
      var outerGlowMaterial = new THREE.MeshBasicMaterial({
        color: m.color,
        transparent: true,
        opacity: 1
      });
      m.outerGlowMesh = new THREE.Mesh(outerGlow, outerGlowMaterial);
      m.outerGlowMesh.position.set(m.point.x, m.point.y, m.point.z);
      m.group.add(m.outerGlowMesh);
    } else {
      if (m.outerGlowMesh.material.opacity <= 0) {
        m.outerGlowMesh.material.opacity = 1;
        m.outerGlowMesh.scale.x = 1;
        m.outerGlowMesh.scale.y = 1;
        m.outerGlowMesh.scale.z = 1;
      } else {
        m.outerGlowMesh.material.opacity -= 1 / (loopFrames / 2);
        m.outerGlowMesh.scale.x += 2 / (loopFrames / 2);
        m.outerGlowMesh.scale.y += 2 / (loopFrames / 2);
        m.outerGlowMesh.scale.z += 2 / (loopFrames / 2);
      }
    }

    if (!m.rePoint) {
      m.rePoint = getRelativePosition(m.point);
      if (m.rePoint.x < 0) {
        m.finalPosition.x *= -1;
      }
    }

    if (!m.msgGroup) {
      m.msgGroup = new THREE.Group();
      msgGroup.add(m.msgGroup);

      var msgPlane = new THREE.PlaneGeometry(msgPlaneWidth, msgPlaneHeight);

      var canvas = createMsgCanvas(m, m.color);
      var texture = new THREE.CanvasTexture(canvas);
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
      var msgPlaneMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: texture,
        // wireframe: true,
        transparent: true
      });
      m.msgPlaneMesh = new THREE.Mesh(msgPlane, msgPlaneMaterial);
      m.msgGroup.add(m.msgPlaneMesh);

      m.msgGroup.position.set(m.point.x, m.point.y, m.point.z);
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
  // c.fillStyle = 'rgba(0,143,255,0.15)';
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
  c.fillText(m.app, 10, 40);

  c.font = '24px Arial,Microsoft YaHei';
  c.fillStyle = 'rgb(168,235,255)';
  c.fillText('交易量：' + m.count, 10, 75);

  c.fillStyle = 'rgb(168,235,255)';
  c.fillText('ID：' + ellipsis(m.id), 10, 100);

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
  msg3d.push(
    {
      app: '浙金网',
      id: '2505b5b57b4bba4d32429efcc5ee5eaf4b...',
      count: 2,
      totalFrames: totalFrames,
      loopFrames: loopFrames,
      finalPosition: {
        x: 650,
        y: 330,
        z: 0
      }
    }
  );
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
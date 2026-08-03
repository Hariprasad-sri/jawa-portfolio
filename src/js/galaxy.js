/* ==========================================================================
   ULTRA-FAST 60 FPS VIBRANT 3D GALAXY & FLOATING OBJECTS (OPTIMIZED ENGINE)
   ========================================================================== */

import * as THREE from 'three';

export function initGalaxyBackground(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07040d, 0.0008);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1500
  );
  camera.position.set(0, 0, 500);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false, // Performance boost
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Cap pixel ratio to 1.5 for ultra-fast rendering on Retina/mobile screens
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // LIGHTING SYSTEM (Optimized count)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const pinkLight = new THREE.PointLight(0xFF3CAC, 4, 800);
  pinkLight.position.set(200, 300, 150);
  scene.add(pinkLight);

  const cyanLight = new THREE.PointLight(0x00F5FF, 3.5, 800);
  cyanLight.position.set(-200, -250, 150);
  scene.add(cyanLight);

  // 1. OPTIMIZED GALAXY PARTICLE SYSTEM (1,800 points for smooth FPS)
  const particleCount = 1800;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const palette = [
    new THREE.Color(0xFF3CAC), // Pink
    new THREE.Color(0x7B2FF7), // Purple
    new THREE.Color(0x00F5FF), // Cyan
    new THREE.Color(0xFF8A00), // Orange
    new THREE.Color(0x00E676)  // Emerald
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1300;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 800 - 50;

    const pColor = palette[i % palette.length];
    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 4.5,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 2. LIGHTWEIGHT FLOATING 3D CREATIVE OBJECTS (25 Objects)
  const floatingObjectsGroup = new THREE.Group();
  const floatingObjectsList = [];

  // LIGHTWEIGHT PERFORMANCE MATERIALS (MeshStandardMaterial instead of MeshPhysicalMaterial)
  const pinkMat = new THREE.MeshStandardMaterial({ color: 0xFF3CAC, roughness: 0.3, metalness: 0.7 });
  const purpleMat = new THREE.MeshStandardMaterial({ color: 0x7B2FF7, roughness: 0.3, metalness: 0.7 });
  const cyanMat = new THREE.MeshStandardMaterial({ color: 0x00F5FF, roughness: 0.3, metalness: 0.7 });
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xFF8A00, roughness: 0.3, metalness: 0.7 });

  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x00F5FF,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });

  function spawnFloatingObject(geometry, material, x, y, z, scale = 1) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(scale, scale, scale);

    const objData = {
      mesh,
      baseX: x,
      baseY: y,
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      bobSpeed: Math.random() * 1.2 + 0.6,
      bobHeight: Math.random() * 20 + 10,
      phaseOffset: Math.random() * Math.PI * 2
    };

    floatingObjectsGroup.add(mesh);
    floatingObjectsList.push(objData);
  }

  // Optimized Geometries (Lower segment counts)
  const boxGeo = new THREE.BoxGeometry(24, 24, 24);
  const sphereGeo = new THREE.SphereGeometry(18, 16, 16);
  const torusGeo = new THREE.TorusGeometry(20, 5, 12, 40);
  const octaGeo = new THREE.OctahedronGeometry(22, 0);
  const icosaGeo = new THREE.IcosahedronGeometry(22, 0);

  const materialsList = [pinkMat, purpleMat, cyanMat, orangeMat, wireframeMat];

  for (let i = 0; i < 26; i++) {
    const x = (Math.random() - 0.5) * 950;
    const y = 450 - (i * 170) + (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 350 - 30;

    const rType = i % 5;
    const selectedMat = materialsList[i % materialsList.length];

    if (rType === 0) spawnFloatingObject(boxGeo, selectedMat, x, y, z, 0.8 + Math.random() * 0.4);
    else if (rType === 1) spawnFloatingObject(sphereGeo, selectedMat, x, y, z, 0.7 + Math.random() * 0.5);
    else if (rType === 2) spawnFloatingObject(torusGeo, selectedMat, x, y, z, 0.7 + Math.random() * 0.4);
    else if (rType === 3) spawnFloatingObject(octaGeo, wireframeMat, x, y, z, 0.8 + Math.random() * 0.5);
    else spawnFloatingObject(icosaGeo, selectedMat, x, y, z, 0.7 + Math.random() * 0.4);
  }

  scene.add(floatingObjectsGroup);

  // MOUSE & SCROLL PARALLAX TRACKING
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let currentScrollY = window.scrollY;
  let targetScrollY = window.scrollY;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.08;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.08;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ANIMATION LOOP (Butter smooth 60 FPS)
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    currentScrollY += (targetScrollY - currentScrollY) * 0.09;

    camera.position.y = -currentScrollY * 0.45;
    camera.position.x = mouseX * 0.5;
    camera.lookAt(0, camera.position.y, 0);

    particleSystem.rotation.y = elapsedTime * 0.015;

    // Animate Floating Objects
    floatingObjectsList.forEach(obj => {
      obj.mesh.rotation.x += obj.rotSpeedX;
      obj.mesh.rotation.y += obj.rotSpeedY;

      obj.mesh.position.y = obj.baseY + Math.sin(elapsedTime * obj.bobSpeed + obj.phaseOffset) * obj.bobHeight;
      obj.mesh.position.x = obj.baseX + mouseX * 0.3;
    });

    renderer.render(scene, camera);
  }

  animate();
}

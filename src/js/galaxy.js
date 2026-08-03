/* ==========================================================================
   VIBRANT 3D MULTI-COLOR GALAXY, AURORA & FLOATING CREATIVE OBJECTS (THREE.JS)
   Colors: Electric Purple, Pink, Cyan, Orange, Yellow, Emerald Green, Violet
   ========================================================================== */

import * as THREE from 'three';

export function initGalaxyBackground(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07040d, 0.0007);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 0, 500);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // MULTI-COLOR LIGHTING SYSTEM
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const pinkLight = new THREE.PointLight(0xFF3CAC, 6, 900);
  pinkLight.position.set(300, 400, 200);
  scene.add(pinkLight);

  const cyanLight = new THREE.PointLight(0x00F5FF, 5, 900);
  cyanLight.position.set(-300, -300, 200);
  scene.add(cyanLight);

  const yellowLight = new THREE.PointLight(0xFFD93D, 4, 800);
  yellowLight.position.set(0, 100, -100);
  scene.add(yellowLight);

  // 1. GALAXY & BOKEH SPARKLE PARTICLE SYSTEM
  const particleCount = 4200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const palette = [
    new THREE.Color(0xFF3CAC), // Pink
    new THREE.Color(0x7B2FF7), // Purple
    new THREE.Color(0x00F5FF), // Cyan
    new THREE.Color(0xFF8A00), // Orange
    new THREE.Color(0xFFD93D), // Yellow
    new THREE.Color(0x00E676), // Emerald
    new THREE.Color(0xFFFFFF)  // White Glow
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1400;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4500; // Spans entire vertical scroll
    positions[i * 3 + 2] = (Math.random() - 0.5) * 900 - 100;

    const pColor = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;

    sizes[i] = Math.random() * 5 + 2;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular Bokeh Texture
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 64;
  pCanvas.height = 64;
  const pCtx = pCanvas.getContext('2d');
  const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  pGrad.addColorStop(0, 'rgba(255,255,255,1)');
  pGrad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
  pGrad.addColorStop(1, 'rgba(255,255,255,0)');
  pCtx.fillStyle = pGrad;
  pCtx.fillRect(0, 0, 64, 64);

  const particleTexture = new THREE.CanvasTexture(pCanvas);

  const particleMat = new THREE.PointsMaterial({
    size: 6,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    map: particleTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 2. VIBRANT 3D FLOATING CREATIVE OBJECTS SCATTERED ACROSS ALL SECTIONS
  const floatingObjectsGroup = new THREE.Group();
  const floatingObjectsList = [];

  // VIBRANT MATERIALS
  const glassPhysicalMat = new THREE.MeshPhysicalMaterial({
    color: 0x00F5FF,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 1.8,
    reflectivity: 0.95,
    clearcoat: 1.0
  });

  const pinkGlowMat = new THREE.MeshStandardMaterial({
    color: 0xFF3CAC,
    roughness: 0.2,
    metalness: 0.85,
    emissive: 0x660033
  });

  const purpleGlowMat = new THREE.MeshStandardMaterial({
    color: 0x7B2FF7,
    roughness: 0.15,
    metalness: 0.9,
    emissive: 0x330066
  });

  const orangeGlowMat = new THREE.MeshStandardMaterial({
    color: 0xFF8A00,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x663300
  });

  const emeraldGlowMat = new THREE.MeshStandardMaterial({
    color: 0x00E676,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x004d26
  });

  const wireframeCyanMat = new THREE.MeshBasicMaterial({
    color: 0x00F5FF,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });

  // Helper to spawn floating 3D objects
  function spawnFloatingObject(geometry, material, x, y, z, scale = 1) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(scale, scale, scale);

    const objData = {
      mesh,
      baseX: x,
      baseY: y,
      baseZ: z,
      rotSpeedX: (Math.random() - 0.5) * 0.025,
      rotSpeedY: (Math.random() - 0.5) * 0.025,
      bobSpeed: Math.random() * 1.8 + 0.8,
      bobHeight: Math.random() * 30 + 15,
      phaseOffset: Math.random() * Math.PI * 2
    };

    floatingObjectsGroup.add(mesh);
    floatingObjectsList.push(objData);
  }

  // Geometries
  const boxGeo = new THREE.BoxGeometry(26, 26, 26);
  const sphereGeo = new THREE.SphereGeometry(20, 32, 32);
  const torusGeo = new THREE.TorusGeometry(22, 6, 16, 100);
  const octaGeo = new THREE.OctahedronGeometry(24, 0);
  const icosaGeo = new THREE.IcosahedronGeometry(25, 0);
  const coneGeo = new THREE.ConeGeometry(18, 30, 32);
  const torusKnotGeo = new THREE.TorusKnotGeometry(18, 5, 100, 16);

  // Spawn 60 vibrant floating 3D objects along vertical scroll span (+500 down to -4000)
  for (let i = 0; i < 60; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = 450 - (i * 75) + (Math.random() - 0.5) * 60;
    const z = (Math.random() - 0.5) * 450 - 40;

    const rType = i % 7;
    const rMat = i % 5;
    let selectedMat = glassPhysicalMat;
    if (rMat === 1) selectedMat = pinkGlowMat;
    else if (rMat === 2) selectedMat = purpleGlowMat;
    else if (rMat === 3) selectedMat = orangeGlowMat;
    else if (rMat === 4) selectedMat = emeraldGlowMat;

    if (rType === 0) spawnFloatingObject(boxGeo, selectedMat, x, y, z, 0.8 + Math.random() * 0.5);
    else if (rType === 1) spawnFloatingObject(sphereGeo, glassPhysicalMat, x, y, z, 0.7 + Math.random() * 0.6);
    else if (rType === 2) spawnFloatingObject(torusGeo, selectedMat, x, y, z, 0.7 + Math.random() * 0.5);
    else if (rType === 3) spawnFloatingObject(octaGeo, wireframeCyanMat, x, y, z, 0.9 + Math.random() * 0.6);
    else if (rType === 4) spawnFloatingObject(icosaGeo, selectedMat, x, y, z, 0.8 + Math.random() * 0.5);
    else if (rType === 5) spawnFloatingObject(coneGeo, selectedMat, x, y, z, 0.7 + Math.random() * 0.5);
    else spawnFloatingObject(torusKnotGeo, glassPhysicalMat, x, y, z, 0.6 + Math.random() * 0.4);
  }

  scene.add(floatingObjectsGroup);

  // MOUSE & SCROLL PARALLAX TRACKING
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  let currentScrollY = window.scrollY;
  let targetScrollY = window.scrollY;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.12;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.12;
  });

  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ANIMATION LOOP (60 FPS)
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Mouse & Scroll Inertia
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    currentScrollY += (targetScrollY - currentScrollY) * 0.08;

    // Smooth Camera Scroll Depth
    camera.position.y = -currentScrollY * 0.45;
    camera.position.x = mouseX * 0.6;
    camera.lookAt(0, camera.position.y, 0);

    // Rotate Galaxy Particles
    particleSystem.rotation.y = elapsedTime * 0.025;

    // Animate 60 Floating 3D Objects (Continuous 360 rotation + Sine wave bobbing)
    floatingObjectsList.forEach(obj => {
      obj.mesh.rotation.x += obj.rotSpeedX;
      obj.mesh.rotation.y += obj.rotSpeedY;

      const newY = obj.baseY + Math.sin(elapsedTime * obj.bobSpeed + obj.phaseOffset) * obj.bobHeight;
      obj.mesh.position.y = newY;
      obj.mesh.position.x = obj.baseX + mouseX * 0.35;
      obj.mesh.rotation.z = Math.sin(elapsedTime + obj.phaseOffset) * 0.18;
    });

    // Pulsing Colorful Lights
    pinkLight.intensity = 5 + Math.sin(elapsedTime * 2) * 2;
    cyanLight.intensity = 5 + Math.cos(elapsedTime * 2) * 2;
    yellowLight.intensity = 4 + Math.sin(elapsedTime * 1.5) * 1.5;

    renderer.render(scene, camera);
  }

  animate();
}

/* ==========================================================================
   ADVANCED HERO 3D CANVAS - DSLR CAMERA, CINEMA OBJECTS & 9 FLOATING SOFTWARE PANELS
   ========================================================================== */

import * as THREE from 'three';

export function init3DCameraCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const width = canvas.parentElement.clientWidth || 550;
  const height = canvas.parentElement.clientHeight || 550;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // LIGHTING SYSTEM
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const purplePointLight = new THREE.PointLight(0x7B2FF7, 5, 50);
  purplePointLight.position.set(10, 12, 10);
  scene.add(purplePointLight);

  const cyanPointLight = new THREE.PointLight(0x00D4FF, 4.5, 50);
  cyanPointLight.position.set(-10, -10, 10);
  scene.add(cyanPointLight);

  // MAIN HERO ROTATABLE GROUP
  const heroGroup = new THREE.Group();

  // 1. PROCEDURAL 3D DSLR CAMERA
  const cameraGroup = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x141418, roughness: 0.3, metalness: 0.85 });
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0d, roughness: 0.9, metalness: 0.1 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.2, metalness: 0.95 });

  const lensGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x00D4FF,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 1.2,
    reflectivity: 0.9,
    clearcoat: 1.0
  });

  // Body
  const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, 1.8), bodyMat);
  cameraGroup.add(bodyMesh);

  // Grip
  const gripMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.6, 1.4), gripMat);
  gripMesh.position.set(-1.8, 0, 0.3);
  cameraGroup.add(gripMesh);

  // Prism / Viewfinder
  const prismMesh = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.0, 4), bodyMat);
  prismMesh.rotation.y = Math.PI / 4;
  prismMesh.position.set(0, 1.8, 0);
  cameraGroup.add(prismMesh);

  // Rotatable Lens
  const lensGroup = new THREE.Group();
  const lensBase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.5, 1.2, 32), bodyMat);
  lensBase.rotation.x = Math.PI / 2;
  lensBase.position.z = 1.0;
  lensGroup.add(lensBase);

  const focusRing = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 1.42, 0.6, 32), gripMat);
  focusRing.rotation.x = Math.PI / 2;
  focusRing.position.z = 1.5;
  lensGroup.add(focusRing);

  const neonRing = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.05, 16, 100), new THREE.MeshBasicMaterial({ color: 0x7B2FF7 }));
  neonRing.position.z = 1.85;
  lensGroup.add(neonRing);

  const frontGlass = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3), lensGlassMat);
  frontGlass.rotation.x = -Math.PI / 2;
  frontGlass.position.z = 2.0;
  lensGroup.add(frontGlass);

  cameraGroup.add(lensGroup);
  heroGroup.add(cameraGroup);

  // 2. PROCEDURAL 3D DIRECTOR CLAPBOARD
  const clapperGroup = new THREE.Group();
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.4 });
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const boardBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 0.15), boardMat);
  clapperGroup.add(boardBase);

  const topStick = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 0.15), stripeMat);
  topStick.position.set(0, 0.95, 0);
  clapperGroup.add(topStick);

  clapperGroup.position.set(-4.5, 2.5, -1);
  clapperGroup.rotation.set(0.2, 0.3, -0.2);
  heroGroup.add(clapperGroup);

  // 3. PROCEDURAL 3D DRONE WITH 4 SPINNING PROPELLERS
  const droneGroup = new THREE.Group();
  const droneBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 1.4), metalMat);
  droneGroup.add(droneBody);

  const propellers = [];
  const propPositions = [[0.9, 0.3, 0.9], [-0.9, 0.3, 0.9], [0.9, 0.3, -0.9], [-0.9, 0.3, -0.9]];
  propPositions.forEach(pos => {
    const propArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8), bodyMat);
    propArm.position.set(pos[0]*0.6, 0, pos[2]*0.6);
    droneGroup.add(propArm);

    const propBlade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.02, 0.15), new THREE.MeshBasicMaterial({ color: 0x00D4FF }));
    propBlade.position.set(pos[0], pos[1], pos[2]);
    droneGroup.add(propBlade);
    propellers.push(propBlade);
  });

  droneGroup.position.set(4.5, 2.8, -1.2);
  heroGroup.add(droneGroup);

  // 4. FLOATING CINEMA FILM ROLL / STRIP
  const filmGroup = new THREE.Group();
  const filmReel = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32), metalMat);
  filmReel.rotation.x = Math.PI / 2;
  filmGroup.add(filmReel);

  filmGroup.position.set(-4.2, -2.5, -0.8);
  heroGroup.add(filmGroup);

  // 5. 9 FLOATING 3D SOFTWARE GLASS PANELS
  const softwarePanels = [];
  const softwareConfig = [
    { name: 'Pr', color: 0x9999FF, x: -3.8, y: 1.2, z: 1 },
    { name: 'Ae', color: 0xCF96D8, x: 3.8, y: 1.0, z: 1.2 },
    { name: 'Bl', color: 0xEA7600, x: -3.5, y: -1.2, z: 0.8 },
    { name: 'C4D', color: 0x0093FF, x: 3.5, y: -1.4, z: 1 },
    { name: 'Ps', color: 0x31A8FF, x: -5.2, y: 0, z: -1 },
    { name: 'Ai', color: 0xFF9A00, x: 5.2, y: 0, z: -1 },
    { name: 'Lr', color: 0x2EB4FF, x: 0, y: 3.5, z: -1.5 },
    { name: 'Dv', color: 0xFF5555, x: -2.0, y: -3.2, z: -0.5 },
    { name: 'Cc', color: 0xFFFFFF, x: 2.0, y: -3.2, z: -0.5 }
  ];

  softwareConfig.forEach(sw => {
    const paneGroup = new THREE.Group();
    const paneGeo = new THREE.BoxGeometry(1.6, 1.2, 0.1);
    const paneMat = new THREE.MeshStandardMaterial({
      color: sw.color,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85
    });

    const paneMesh = new THREE.Mesh(paneGeo, paneMat);
    paneGroup.add(paneMesh);

    // Border highlight
    const edges = new THREE.EdgesGeometry(paneGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00D4FF });
    const wireframe = new THREE.LineSegments(edges, lineMat);
    paneGroup.add(wireframe);

    paneGroup.position.set(sw.x, sw.y, sw.z);
    heroGroup.add(paneGroup);

    softwarePanels.push({
      group: paneGroup,
      baseX: sw.x,
      baseY: sw.y,
      baseZ: sw.z,
      phase: Math.random() * Math.PI * 2
    });
  });

  scene.add(heroGroup);

  // MOUSE TILT & SPRING PHYSICS
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouseX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      mouseY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    }
  });

  window.addEventListener('resize', () => {
    const w = canvas.parentElement.clientWidth || 550;
    const h = canvas.parentElement.clientHeight || 550;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ANIMATION LOOP
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Continuous lens rotation & clapper motion
    lensGroup.rotation.z = elapsedTime * 0.8;
    topStick.rotation.z = Math.sin(elapsedTime * 2) * 0.15;

    // 2. Drone propeller spinning
    propellers.forEach(p => p.rotation.y += 0.4);
    droneGroup.position.y = 2.8 + Math.sin(elapsedTime * 2) * 0.15;

    // 3. Floating 9 Software panels bobbing & rotating
    softwarePanels.forEach(p => {
      p.group.position.y = p.baseY + Math.sin(elapsedTime * 1.5 + p.phase) * 0.25;
      p.group.rotation.y = Math.sin(elapsedTime * 0.8 + p.phase) * 0.2;
      p.group.rotation.x = Math.cos(elapsedTime * 0.8 + p.phase) * 0.15;
    });

    // 4. Hero Camera Group Bobbing & Spring Mouse Tilt
    heroGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.3;

    targetRotY += (mouseX * 0.7 - targetRotY) * 0.05;
    targetRotX += (mouseY * 0.5 - targetRotX) * 0.05;

    heroGroup.rotation.y = targetRotY;
    heroGroup.rotation.x = targetRotX;

    // Pulsing cyan & purple lighting reflections
    cyanPointLight.intensity = 4 + Math.sin(elapsedTime * 2) * 1.5;
    purplePointLight.intensity = 5 + Math.cos(elapsedTime * 2) * 1.5;

    renderer.render(scene, camera);
  }

  animate();
}

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const FoodCanvas3D = () => {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIngredient, setActiveIngredient] = useState('Brioche Bun');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 0.4, 4.6);

    // High performance WebGL Renderer with Alpha
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Lighting Setup - Cinematic Studio Food Lighting
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.9);
    scene.add(ambientLight);

    // Warm Sun Key Light
    const keyLight = new THREE.DirectionalLight(0xffecc7, 2.2);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Vibrant Burnt-Orange Rim Light (Backlight)
    const rimLightOrange = new THREE.PointLight(0xff5400, 3.5, 12);
    rimLightOrange.position.set(-3, 2, -3);
    scene.add(rimLightOrange);

    // Tomato Crimson Rim Light (Opposite Rim)
    const rimLightCrimson = new THREE.PointLight(0xe11d48, 2.8, 10);
    rimLightCrimson.position.set(3, -1, -2);
    scene.add(rimLightCrimson);

    // Warm Amber Fill Light
    const fillLight = new THREE.PointLight(0xf59e0b, 1.2, 8);
    fillLight.position.set(0, -3, 2);
    scene.add(fillLight);

    // Main Burger Root Group
    const burgerGroup = new THREE.Group();
    scene.add(burgerGroup);

    // Common Materials
    const bunMaterial = new THREE.MeshStandardMaterial({
      color: 0xc87b38,
      roughness: 0.38,
      metalness: 0.05,
    });

    const pattyMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d2012,
      roughness: 0.85,
      metalness: 0.1,
    });

    const cheeseMaterial = new THREE.MeshStandardMaterial({
      color: 0xffa000,
      roughness: 0.25,
      metalness: 0.05,
    });

    const tomatoMaterial = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.2,
      metalness: 0.08,
    });

    const lettuceMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.45,
      metalness: 0.02,
    });

    const sesameMaterial = new THREE.MeshStandardMaterial({
      color: 0xfff9e6,
      roughness: 0.2,
    });

    // Layer 1: Bottom Bun
    const bottomBunGeo = new THREE.CylinderGeometry(1.25, 1.15, 0.38, 36);
    const bottomBun = new THREE.Mesh(bottomBunGeo, bunMaterial);
    bottomBun.position.y = -0.72;
    bottomBun.castShadow = true;
    bottomBun.receiveShadow = true;
    burgerGroup.add(bottomBun);

    // Layer 2: Emerald Ruffled Lettuce
    const lettuceGroup = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const leafGeo = new THREE.CylinderGeometry(0.55, 0.45, 0.06, 12);
      const leaf = new THREE.Mesh(leafGeo, lettuceMaterial);
      leaf.position.set(Math.cos(angle) * 0.95, -0.46, Math.sin(angle) * 0.95);
      leaf.rotation.x = Math.sin(angle) * 0.2;
      leaf.rotation.z = Math.cos(angle) * 0.2;
      lettuceGroup.add(leaf);
    }
    burgerGroup.add(lettuceGroup);

    // Layer 3: Grilled Angus Patty
    const pattyGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.42, 36);
    const patty = new THREE.Mesh(pattyGeo, pattyMaterial);
    patty.position.y = -0.32;
    patty.castShadow = true;
    patty.receiveShadow = true;
    burgerGroup.add(patty);

    // Layer 4: Melted Aged Cheddar (Draped corners)
    const cheeseGeo = new THREE.BoxGeometry(1.7, 0.08, 1.7);
    const cheese = new THREE.Mesh(cheeseGeo, cheeseMaterial);
    cheese.position.y = -0.08;
    cheese.rotation.y = Math.PI / 4;
    cheese.castShadow = true;
    burgerGroup.add(cheese);

    // Layer 5: Heirloom Ripe Tomato Slice
    const tomatoGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.18, 32);
    const tomato = new THREE.Mesh(tomatoGeo, tomatoMaterial);
    tomato.position.y = 0.12;
    tomato.castShadow = true;
    burgerGroup.add(tomato);

    // Layer 6: Top Brioche Bun Dome
    const topBunGeo = new THREE.SphereGeometry(1.32, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2.15);
    const topBun = new THREE.Mesh(topBunGeo, bunMaterial);
    topBun.position.y = 0.22;
    topBun.castShadow = true;
    topBun.receiveShadow = true;
    burgerGroup.add(topBun);

    // Scattered 3D Golden Sesame Seeds
    const sesameGeo = new THREE.SphereGeometry(0.032, 8, 8);
    sesameGeo.scale(1, 0.45, 1.6);
    for (let i = 0; i < 48; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * 0.78;
      const r = 1.33;

      const seed = new THREE.Mesh(sesameGeo, sesameMaterial);
      seed.position.x = r * Math.sin(phi) * Math.cos(theta);
      seed.position.y = 0.22 + r * Math.cos(phi);
      seed.position.z = r * Math.sin(phi) * Math.sin(theta);
      seed.lookAt(0, 0.22, 0);
      burgerGroup.add(seed);
    }

    // Orbiting Floating Ingredients (Cinematic Storytelling)
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    // Floating Onion Ring
    const onionGeo = new THREE.TorusGeometry(0.55, 0.07, 16, 32);
    const onionMat = new THREE.MeshStandardMaterial({
      color: 0xfbf2d5,
      roughness: 0.3,
    });
    const onionRing = new THREE.Mesh(onionGeo, onionMat);
    onionRing.position.set(1.9, 0.8, 0.4);
    onionRing.rotation.x = Math.PI / 3;
    floatingGroup.add(onionRing);

    // Floating Chili Flakes
    const chiliFlakes = [];
    const flakeMat = new THREE.MeshStandardMaterial({
      color: 0xe11d48,
      roughness: 0.3,
      emissive: 0x9f1239,
      emissiveIntensity: 0.2,
    });
    for (let i = 0; i < 18; i++) {
      const flakeGeo = new THREE.DodecahedronGeometry(0.045);
      const flake = new THREE.Mesh(flakeGeo, flakeMat);
      flake.position.set(
        (Math.random() - 0.5) * 4.5,
        (Math.random() - 0.5) * 3.5,
        (Math.random() - 0.5) * 2.5,
      );
      floatingGroup.add(flake);
      chiliFlakes.push({ mesh: flake, speed: 0.008 + Math.random() * 0.015 });
    }

    // Floating Basil Leaves
    const basilGeo = new THREE.SphereGeometry(0.25, 12, 12);
    basilGeo.scale(1.4, 0.15, 0.7);
    const basilLeaf1 = new THREE.Mesh(basilGeo, lettuceMaterial);
    basilLeaf1.position.set(-1.8, 0.9, 0.6);
    basilLeaf1.rotation.set(0.4, 0.8, -0.3);
    floatingGroup.add(basilLeaf1);

    const basilLeaf2 = new THREE.Mesh(basilGeo, lettuceMaterial);
    basilLeaf2.position.set(1.7, -0.9, 0.8);
    basilLeaf2.rotation.set(-0.5, 0.3, 0.6);
    floatingGroup.add(basilLeaf2);

    // Glowing Ambient Spice Particles
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 6;
      particlePositions[i + 1] = (Math.random() - 0.5) * 4;
      particlePositions[i + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffa726,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // Mouse Tracking Physics & Interaction
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.45;
      targetY = y * 0.35;

      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        burgerGroup.rotation.y += deltaX * 0.01;
        burgerGroup.rotation.x += deltaY * 0.01;
      }
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow Continuous Majestic Rotation + Lerped Mouse Tilt
      if (!isDragging) {
        burgerGroup.rotation.y += 0.0075;
        burgerGroup.rotation.x = THREE.MathUtils.lerp(burgerGroup.rotation.x, targetY, 0.05);
        burgerGroup.rotation.z = THREE.MathUtils.lerp(burgerGroup.rotation.z, -targetX * 0.5, 0.05);
      }

      // Breathing Float Motion
      burgerGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.12;

      // Orbiting Floating Ingredients
      floatingGroup.rotation.y -= 0.006;
      onionRing.rotation.z += 0.012;
      basilLeaf1.rotation.y += 0.008;
      basilLeaf2.rotation.x -= 0.009;

      // Subtle Ingredient Flake Drift
      chiliFlakes.forEach((flake, index) => {
        flake.mesh.position.y += Math.sin(elapsedTime + index) * 0.003;
        flake.mesh.rotation.x += flake.speed;
        flake.mesh.rotation.y += flake.speed;
      });

      // Particle Drift
      particleCloud.rotation.y = elapsedTime * 0.04;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[620px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Ambient Behind Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-[#ff5400]/25 via-[#e11d48]/20 to-transparent blur-3xl animate-pulse-glow" />
      </div>

      {/* Floating 3D Telemetry Chips (Futuristic Food-Tech UI) */}
      <div className="absolute top-6 left-2 sm:left-6 bg-[#0e121d]/85 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl pointer-events-none transform -rotate-3 animate-float-slow hidden sm:flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#ff5400]/20 flex items-center justify-center text-[#ff5400] font-black text-xs">
          🔥
        </div>
        <div>
          <span className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
            Artisanal Brioche
          </span>
          <span className="text-xs font-black text-white">480 kcal • 32g Protein</span>
        </div>
      </div>

      <div className="absolute bottom-10 right-2 sm:right-6 bg-[#0e121d]/85 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl pointer-events-none transform rotate-3 animate-float-reverse hidden sm:flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-black text-xs">
          ⭐
        </div>
        <div>
          <span className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
            Chef's Signature
          </span>
          <span className="text-xs font-black text-white">4.98 / 5 • 18K+ Ordered</span>
        </div>
      </div>

      {/* Interactive 3D Rotation Cue */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[11px] font-bold text-white/80 pointer-events-none">
        <span className="inline-block animate-spin">🔄</span>
        <span>Drag to rotate 3D food in real-time</span>
      </div>
    </div>
  );
};

export default FoodCanvas3D;

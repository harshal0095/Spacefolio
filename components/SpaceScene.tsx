
import React, { useRef, useEffect } from 'react';
import * as THREE_LIB from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const THREE = THREE_LIB;
gsap.registerPlugin(ScrollTrigger);

const SpaceScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04060A);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    camera.position.z = 10;

    // --- Starfields ---
    const createStarfield = (count: number, size: number, color: number, distance: number) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * distance;
        positions[i3 + 1] = (Math.random() - 0.5) * distance;
        positions[i3 + 2] = (Math.random() - 0.5) * distance;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        size,
        color,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });
      return new THREE.Points(geometry, material);
    };

    const bgStars = createStarfield(12000, 0.4, 0xffffff, 2500);
    const midStars = createStarfield(3000, 1.0, 0x3b82f6, 1500);
    const fgStars = createStarfield(800, 2.8, 0xffffff, 800);

    scene.add(bgStars, midStars, fgStars);

    // --- Asteroid Field ---
    const asteroidGroup = new THREE.Group();
    const asteroidCount = 60;
    const asteroidMat = new THREE.MeshStandardMaterial({ 
      color: 0x222222, 
      roughness: 0.9, 
      metalness: 0.1 
    });

    for (let i = 0; i < asteroidCount; i++) {
      const size = Math.random() * 2 + 0.5;
      const geo = new THREE.DodecahedronGeometry(size, 0);
      const mesh = new THREE.Mesh(geo, asteroidMat);
      
      mesh.position.set(
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1500 - 1000
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      asteroidGroup.add(mesh);
    }
    scene.add(asteroidGroup);

    // --- Nebula Clouds ---
    const nebulaGroup = new THREE.Group();
    const createNebulaPart = (color: number, x: number, y: number, z: number, scale: number) => {
      const geo = new THREE.SphereGeometry(150 * scale, 32, 32);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.04,
        side: THREE.BackSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      return mesh;
    };
    nebulaGroup.add(createNebulaPart(0x4c1d95, 300, 200, -800, 1.5));
    nebulaGroup.add(createNebulaPart(0x0A1628, -300, -200, -500, 1.2));
    scene.add(nebulaGroup);

    // --- Satellite Model ---
    const satelliteGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(2, 2, 4);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    satelliteGroup.add(body);

    const panelGeo = new THREE.PlaneGeometry(8, 3);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x003366, metalness: 0.9, roughness: 0.1, side: THREE.DoubleSide });
    
    const leftPanel = new THREE.Mesh(panelGeo, panelMat);
    leftPanel.position.x = -5;
    leftPanel.rotation.y = Math.PI / 6;
    satelliteGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeo, panelMat);
    rightPanel.position.x = 5;
    rightPanel.rotation.y = -Math.PI / 6;
    satelliteGroup.add(rightPanel);

    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const antenna = new THREE.Mesh(antennaGeo, bodyMat);
    antenna.position.set(0, 1.5, 0);
    satelliteGroup.add(antenna);

    satelliteGroup.position.set(-15, 8, -50);
    scene.add(satelliteGroup);

    // --- Planet ---
    const planetGroup = new THREE.Group();
    const planetGeometry = new THREE.SphereGeometry(120, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0x0A1628,
      roughness: 0.9,
      metalness: 0.1,
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    const atmosphereGeometry = new THREE.SphereGeometry(125, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    
    planetGroup.add(planet);
    planetGroup.add(atmosphere);
    planetGroup.position.set(250, -150, -1200);
    scene.add(planetGroup);

    // --- Moon ---
    const moonGroup = new THREE.Group();
    const moonGeometry = new THREE.SphereGeometry(30, 64, 64);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xaaaaaa,
      roughness: 0.8,
      metalness: 0.05,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    
    // Moon subtle glow
    const moonGlowGeo = new THREE.SphereGeometry(32, 32, 32);
    const moonGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
    });
    const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
    
    moonGroup.add(moon);
    moonGroup.add(moonGlow);
    moonGroup.position.set(-150, 100, -600);
    scene.add(moonGroup);

    // Lighting
    const pointLight = new THREE.PointLight(0x3b82f6, 2, 3000);
    pointLight.position.set(-400, 300, 300);
    scene.add(pointLight);

    const moonlight = new THREE.PointLight(0xffffff, 0.8, 1000);
    moonlight.position.set(200, 200, 0);
    scene.add(moonlight);

    const ambientLight = new THREE.AmbientLight(0x202020, 0.3);
    scene.add(ambientLight);

    // --- Interaction Logic ---
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetTiltX = mouseY * 0.05;
      targetTiltY = -mouseX * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Enhanced Scroll Depth & Dolly Zoom ---
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });

    mainTl.to(camera.position, { z: -1200, ease: 'none' }, 0);
    mainTl.to(camera, { 
      fov: 50, 
      ease: 'power1.inOut',
      onUpdate: () => camera.updateProjectionMatrix() 
    }, 0);
    
    mainTl.to(bgStars.position, { z: 600, ease: 'none' }, 0);
    mainTl.to(midStars.position, { z: 800, ease: 'none' }, 0);
    mainTl.to(fgStars.position, { z: 1200, ease: 'none' }, 0);
    mainTl.to(asteroidGroup.position, { z: 300, ease: 'none' }, 0);
    
    mainTl.to(satelliteGroup.position, { x: 80, y: -40, z: -100, ease: 'power1.inOut' }, 0.1);
    mainTl.to(satelliteGroup.rotation, { x: 4, y: 6, ease: 'none' }, 0);

    mainTl.to(planetGroup.position, { x: 30, y: 15, z: -400, ease: 'power2.inOut' }, 0.5);
    
    // Moon Parallax: Moves independently to create depth relative to planet
    mainTl.to(moonGroup.position, { x: -20, y: -10, z: -100, ease: 'power1.inOut' }, 0.3);

    const animate = () => {
      requestAnimationFrame(animate);

      bgStars.rotation.y += 0.00008;
      midStars.rotation.y += 0.00015;
      fgStars.rotation.y += 0.0003;
      planet.rotation.y += 0.0008;
      moon.rotation.y += 0.001;
      
      // Satellite rotation logic
      satelliteGroup.rotation.z += 0.002;
      satelliteGroup.rotation.y += 0.001;

      asteroidGroup.children.forEach((ast: any) => {
        ast.rotation.x += 0.001;
        ast.rotation.y += 0.001;
        ast.position.y += 0.01;
      });

      camera.position.x += (mouseX * 10 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 10 - camera.position.y) * 0.03;
      
      camera.rotation.x += (targetTiltX - camera.rotation.x) * 0.05;
      camera.rotation.y += (targetTiltY - camera.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default SpaceScene;

'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function FloatingSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const backLight = new THREE.DirectionalLight(0x818cf8, 0.3);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Sphere with custom shader for distortion effect
    const geometry = new THREE.IcosahedronGeometry(1, 2);

    const material = new THREE.MeshPhysicalMaterial({
      color: '#6366f1',
      emissive: '#6366f1',
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.8,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Mouse tracking
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Original vertex positions for distortion
    const positionAttribute = geometry.attributes.position;
    const originalPositions = positionAttribute.array.slice() as Float32Array;
    const vertexCount = positionAttribute.count;

    let animId: number;
    let visible = true;

    const handleVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const animate = () => {
      if (!visible) {
        animId = requestAnimationFrame(animate);
        return;
      }

      const t = performance.now() * 0.001;

      // Distort vertices
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < vertexCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const ox = originalPositions[ix];
        const oy = originalPositions[iy];
        const oz = originalPositions[iz];

        const distortion = Math.sin(t * 2 + ox * 3 + oy * 2 + oz) * 0.08;
        positions[ix] = ox + ox * distortion;
        positions[iy] = oy + oy * distortion;
        positions[iz] = oz + oz * distortion;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Floating
      sphere.position.y = Math.sin(t * 0.3) * 0.3;
      sphere.rotation.x = Math.sin(t * 0.2) * 0.1;
      sphere.rotation.y = Math.sin(t * 0.15) * 0.1;

      // Mouse follow
      sphere.position.x += (mouse.x * 0.5 - sphere.position.x) * 0.02;
      sphere.position.y += (mouse.y * 0.5 - sphere.position.y) * 0.02;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

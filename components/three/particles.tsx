'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Generate random shape textures
function createShapeTexture(shape: 'circle' | 'star' | 'diamond' | 'hexagon' | 'ring') {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const cx = 32, cy = 32, r = 28;

  ctx.clearRect(0, 0, 64, 64);

  switch (shape) {
    case 'circle': {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(255,255,255,0.9)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'star': {
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      // Glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.5);
      glow.addColorStop(0, 'rgba(255,255,255,0.3)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 64, 64);
      break;
    }
    case 'diamond': {
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx + r, cy);
      ctx.lineTo(cx, cy + r);
      ctx.lineTo(cx - r, cy);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'hexagon': {
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6 - Math.PI / 6;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'ring': {
      const gradient = ctx.createRadialGradient(cx, cy, 4, cx, cy, r);
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.6, 'rgba(255,255,255,0.9)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
  return new THREE.CanvasTexture(canvas);
}

const shapes: ('circle' | 'star' | 'diamond' | 'hexagon' | 'ring')[] = [
  'circle', 'star', 'diamond', 'hexagon', 'ring',
];

// Pre-generate all shape textures
const shapeTextures = shapes.map(createShapeTexture);

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const shapeIds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spherical distribution
      const radius = 5 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color palette: indigo / purple / teal
      const palette = Math.random();
      if (palette < 0.4) {
        colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 1.0;   // indigo
      } else if (palette < 0.7) {
        colors[i * 3] = 0.7; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 0.9;   // purple
      } else {
        colors[i * 3] = 0.2; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 0.8;   // teal
      }
      sizes[i] = 0.06 + Math.random() * 0.2;
      shapeIds[i] = Math.floor(Math.random() * shapes.length);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Store initial positions
    const initialPos = new Float32Array(positions);

    let animId: number;
    const animate = () => {
      const t = performance.now() * 0.001;
      const pos = geometry.attributes.position.array as Float32Array;

      // Animate each particle individually
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const phase = i * 0.05;
        // Gentle orbital drift
        const angle = t * (0.05 + Math.sin(phase) * 0.03);
        const r = Math.sqrt(initialPos[idx] * initialPos[idx] + initialPos[idx + 2] * initialPos[idx + 2]);
        const origAngle = Math.atan2(initialPos[idx + 2], initialPos[idx]);
        pos[idx] = r * Math.cos(origAngle + angle);
        pos[idx + 2] = r * Math.sin(origAngle + angle);
        // Gentle vertical wave
        pos[idx + 1] = initialPos[idx + 1] + Math.sin(t * 0.4 + phase) * 0.3;
      }
      geometry.attributes.position.needsUpdate = true;

      // Rotate shape texture based on time for variety
      const textureIdx = Math.floor(t * 0.5) % shapes.length;
      material.map = shapeTextures[textureIdx];

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
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      shapeTextures.forEach((t) => t.dispose());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

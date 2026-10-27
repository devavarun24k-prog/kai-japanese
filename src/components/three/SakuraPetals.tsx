// src/components/three/SakuraPetals.tsx
// High-performance GPU-instanced falling Sakura petals with dynamic wind physics
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SakuraPetalsProps {
  count?: number;
}

export const SakuraPetals: React.FC<SakuraPetalsProps> = ({ count = 450 }) => {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);

  // Generate petal geometry (slightly curved, heart-notched petal quad)
  const petalGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.06, 0.08, 0.12, 0.22, 0.04, 0.32);
    shape.bezierCurveTo(0.02, 0.34, 0, 0.32, -0.01, 0.31);
    shape.bezierCurveTo(-0.02, 0.32, -0.04, 0.34, -0.06, 0.32);
    shape.bezierCurveTo(-0.14, 0.22, -0.08, 0.08, 0, 0);

    const geom = new THREE.ShapeGeometry(shape, 6);
    // Center origin
    geom.center();
    return geom;
  }, []);

  const petalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#FFB7C5',
      roughness: 0.4,
      metalness: 0.05,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.88,
      emissive: '#FF8FA3',
      emissiveIntensity: 0.18
    });
  }, []);

  // Initialize particle simulation attributes
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 28,
        y: Math.random() * 22 - 2,
        z: 14 - Math.random() * 140,
        vx: (Math.random() - 0.5) * 0.02,
        vy: -0.015 - Math.random() * 0.025,
        vz: (Math.random() - 0.5) * 0.02,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.04,
        rotSpeedZ: (Math.random() - 0.5) * 0.025,
        scale: 0.6 + Math.random() * 0.5,
        seed: Math.random() * 100
      });
    }
    return data;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Animate petals on each frame
  useFrame(({ clock, camera }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Wind oscillation
      const windX = Math.sin(t * 0.6 + p.seed) * 0.012 + 0.008;
      const windZ = Math.cos(t * 0.5 + p.seed) * 0.009;

      p.x += p.vx + windX;
      p.y += p.vy;
      p.z += p.vz + windZ;

      p.rx += p.rotSpeedX;
      p.ry += p.rotSpeedY;
      p.rz += p.rotSpeedZ;

      // Wrap around relative to camera position
      if (p.y < -3) {
        p.y = 18;
        p.x = camera.position.x + (Math.random() - 0.5) * 26;
        p.z = camera.position.z - Math.random() * 80;
      }
      if (p.x < camera.position.x - 16) p.x = camera.position.x + 16;
      if (p.x > camera.position.x + 16) p.x = camera.position.x - 16;

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[petalGeometry, petalMaterial, count]}
      frustumCulled={false}
    />
  );
};

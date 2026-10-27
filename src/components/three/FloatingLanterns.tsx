// src/components/three/FloatingLanterns.tsx
// Procedural floating Japanese paper lanterns with gentle bobbing and warm emissive glow
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingLanternsProps {
  count?: number;
}

export const FloatingLanterns: React.FC<FloatingLanternsProps> = ({ count = 26 }) => {
  const groupRef = useRef<THREE.Group | null>(null);

  // Generate deterministic lantern coordinates alongside the winding path
  const lanterns = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const z = 8 - i * 5.5;
      const x = Math.sin(i * 0.4) * 2.2 + side * (3.8 + (i % 3) * 0.7);
      const y = 1.4 + (i % 4) * 0.5 + Math.sin(i * 1.2) * 0.4;
      const phase = i * 0.8;
      const scale = 0.85 + (i % 3) * 0.15;
      list.push({ id: i, basePos: [x, y, z] as [number, number, number], phase, scale });
    }
    return list;
  }, [count]);

  // Instanced materials
  const { washiMat, woodMat, ringMat } = useMemo(() => {
    const washi = new THREE.MeshStandardMaterial({
      color: '#F4C26B',
      emissive: '#F49D37',
      emissiveIntensity: 1.4,
      roughness: 0.3,
      metalness: 0.05
    });

    const wood = new THREE.MeshStandardMaterial({
      color: '#1C1917',
      roughness: 0.7,
      metalness: 0.2
    });

    const ring = new THREE.MeshStandardMaterial({
      color: '#B45309',
      roughness: 0.4,
      metalness: 0.6
    });

    return { washiMat: washi, woodMat: wood, ringMat: ring };
  }, []);

  // Soft atmospheric bobbing and flicker in animation loop
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Gentle global lantern sway and individual floating
    groupRef.current.children.forEach((child, idx) => {
      const l = lanterns[idx];
      if (!l) return;
      child.position.y = l.basePos[1] + Math.sin(t * 1.1 + l.phase) * 0.14;
      child.rotation.y = Math.sin(t * 0.4 + l.phase) * 0.12;
      child.rotation.z = Math.cos(t * 0.6 + l.phase) * 0.04;
    });
  });

  return (
    <group ref={groupRef}>
      {lanterns.map((l) => (
        <group key={l.id} position={l.basePos} scale={l.scale}>
          {/* Top Wooden Cap */}
          <mesh position={[0, 0.45, 0]} material={woodMat}>
            <cylinderGeometry args={[0.22, 0.26, 0.12, 16]} />
          </mesh>
          {/* Top Ring Loop */}
          <mesh position={[0, 0.56, 0]} material={ringMat}>
            <torusGeometry args={[0.08, 0.02, 8, 16]} />
          </mesh>

          {/* Glowing Washi Paper Body (Egg/Oval Silhouette) */}
          <mesh position={[0, 0, 0]} material={washiMat}>
            <cylinderGeometry args={[0.32, 0.26, 0.72, 16, 1]} />
          </mesh>

          {/* Rib Lines (Traditional Japanese Chōchin Bamboo Ribs) */}
          <mesh position={[0, 0.18, 0]} material={woodMat}>
            <cylinderGeometry args={[0.33, 0.33, 0.02, 16]} />
          </mesh>
          <mesh position={[0, -0.18, 0]} material={woodMat}>
            <cylinderGeometry args={[0.29, 0.29, 0.02, 16]} />
          </mesh>

          {/* Bottom Wooden Cap & Tassel */}
          <mesh position={[0, -0.42, 0]} material={woodMat}>
            <cylinderGeometry args={[0.22, 0.18, 0.1, 16]} />
          </mesh>
          {/* Red/Gold Silk Tassel */}
          <mesh position={[0, -0.65, 0]}>
            <cylinderGeometry args={[0.04, 0.08, 0.35, 8]} />
            <meshStandardMaterial color="#E63946" roughness={0.6} />
          </mesh>

          {/* Warm Point Light on select key lanterns for high FPS */}
          {l.id % 3 === 0 && (
            <pointLight
              color="#F4C26B"
              intensity={0.8}
              distance={6}
              decay={2}
            />
          )}
        </group>
      ))}
    </group>
  );
};

// src/components/three/ToriiCorridor.tsx
// Procedural ceremonial pathway of glowing vermilion Japanese Torii gates
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface ToriiCorridorProps {
  count?: number;
}

export const ToriiCorridor: React.FC<ToriiCorridorProps> = ({ count = 10 }) => {
  // Shared materials for 60fps performance
  const { vermilionMat, bronzeMat, goldMat } = useMemo(() => {
    const vermilion = new THREE.MeshStandardMaterial({
      color: '#E63946',
      roughness: 0.35,
      metalness: 0.1,
      emissive: '#7A1821',
      emissiveIntensity: 0.25
    });

    const bronze = new THREE.MeshStandardMaterial({
      color: '#1A181C',
      roughness: 0.5,
      metalness: 0.6
    });

    const gold = new THREE.MeshStandardMaterial({
      color: '#F4C26B',
      roughness: 0.25,
      metalness: 0.85,
      emissive: '#D97706',
      emissiveIntensity: 0.3
    });

    return { vermilionMat: vermilion, bronzeMat: bronze, goldMat: gold };
  }, []);

  // Compute positions along a winding ceremonial spline
  const gates = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const z = 4 - i * 14;
      const x = Math.sin(i * 0.55) * 1.8;
      const rotY = Math.sin(i * 0.55) * 0.12;
      const scale = 1.0 + Math.sin(i * 0.3) * 0.05;
      list.push({ id: i, position: [x, 0, z] as [number, number, number], rotation: [0, rotY, 0] as [number, number, number], scale });
    }
    return list;
  }, [count]);

  return (
    <group>
      {gates.map((g) => (
        <group key={g.id} position={g.position} rotation={g.rotation} scale={g.scale}>
          {/* Left Pillar */}
          <mesh position={[-2.4, 2.7, 0]} material={vermilionMat} castShadow>
            <cylinderGeometry args={[0.22, 0.26, 5.4, 16]} />
          </mesh>
          {/* Left Base Stone (Kamaboko) */}
          <mesh position={[-2.4, 0.25, 0]} material={bronzeMat}>
            <cylinderGeometry args={[0.34, 0.38, 0.5, 16]} />
          </mesh>
          {/* Left Gold Collar Ring */}
          <mesh position={[-2.4, 4.6, 0]} material={goldMat}>
            <cylinderGeometry args={[0.26, 0.26, 0.15, 16]} />
          </mesh>

          {/* Right Pillar */}
          <mesh position={[2.4, 2.7, 0]} material={vermilionMat} castShadow>
            <cylinderGeometry args={[0.22, 0.26, 5.4, 16]} />
          </mesh>
          {/* Right Base Stone */}
          <mesh position={[2.4, 0.25, 0]} material={bronzeMat}>
            <cylinderGeometry args={[0.34, 0.38, 0.5, 16]} />
          </mesh>
          {/* Right Gold Collar Ring */}
          <mesh position={[2.4, 4.6, 0]} material={goldMat}>
            <cylinderGeometry args={[0.26, 0.26, 0.15, 16]} />
          </mesh>

          {/* Lower Horizontal Tie-Beam (Nuki) */}
          <mesh position={[0, 4.2, 0]} material={vermilionMat} castShadow>
            <boxGeometry args={[5.6, 0.28, 0.32]} />
          </mesh>
          {/* Tie-Beam Bronze Wedges */}
          <mesh position={[-2.4, 4.2, 0]} material={bronzeMat}>
            <boxGeometry args={[0.7, 0.32, 0.36]} />
          </mesh>
          <mesh position={[2.4, 4.2, 0]} material={bronzeMat}>
            <boxGeometry args={[0.7, 0.32, 0.36]} />
          </mesh>

          {/* Upper Lintel Sub-Beam (Shimaki) */}
          <mesh position={[0, 5.25, 0]} material={vermilionMat} castShadow>
            <boxGeometry args={[6.2, 0.32, 0.4]} />
          </mesh>

          {/* Top Curved Main Lintel (Kasagi with curved flared ends) */}
          <mesh position={[0, 5.65, 0]} material={bronzeMat} castShadow>
            <boxGeometry args={[6.8, 0.35, 0.46]} />
          </mesh>

          {/* Gold Lintel Ridge Inscription / Cap */}
          <mesh position={[0, 5.85, 0]} material={goldMat}>
            <boxGeometry args={[6.9, 0.08, 0.48]} />
          </mesh>

          {/* Central Tablet / Plaque (Gakuzuka) */}
          <mesh position={[0, 4.75, 0]} material={bronzeMat}>
            <boxGeometry args={[0.5, 0.75, 0.18]} />
          </mesh>
          <mesh position={[0, 4.75, 0.1]} material={goldMat}>
            <boxGeometry args={[0.38, 0.6, 0.04]} />
          </mesh>

          {/* Torii Soft Glow Lantern Hanging Beneath */}
          <group position={[0, 3.8, 0]}>
            <mesh material={goldMat}>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <sphereGeometry args={[0.18, 12, 12]} />
              <meshStandardMaterial
                color="#F4C26B"
                emissive="#F4C26B"
                emissiveIntensity={1.8}
                roughness={0.2}
              />
            </mesh>
            <pointLight color="#F4C26B" intensity={1.2} distance={4} decay={2} />
          </group>
        </group>
      ))}
    </group>
  );
};

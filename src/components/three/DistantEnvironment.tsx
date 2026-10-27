// src/components/three/DistantEnvironment.tsx
// Mount Fuji silhouette, giant glowing moon, drifting mist layers, and reflective ground
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DistantEnvironmentProps {
  scrollProgress: number; // 0 to 1
}

export const DistantEnvironment: React.FC<DistantEnvironmentProps> = ({ scrollProgress }) => {
  const moonRef = useRef<THREE.Mesh | null>(null);
  const mist1Ref = useRef<THREE.Mesh | null>(null);
  const mist2Ref = useRef<THREE.Mesh | null>(null);

  // Time-of-day progression colors
  // Midnight (#07070C) -> Purple Dawn (#141026) -> Sunrise Amber/Vermilion (#2D151D / #D9483B)
  const p = Math.max(0, Math.min(1, scrollProgress));

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mist1Ref.current) {
      mist1Ref.current.position.x = Math.sin(t * 0.12) * 4;
      mist1Ref.current.position.z = -35 + Math.cos(t * 0.08) * 3;
    }
    if (mist2Ref.current) {
      mist2Ref.current.position.x = -Math.cos(t * 0.1) * 6;
      mist2Ref.current.position.z = -75 + Math.sin(t * 0.06) * 4;
    }
    if (moonRef.current) {
      // Moon gently descends or shifts into sunrise orb as you scroll
      moonRef.current.position.y = 22 - p * 6;
      moonRef.current.position.x = Math.sin(t * 0.1) * 0.5 + 4 - p * 3;
    }
  });

  return (
    <group>
      {/* 1. Reflective Ground / Stone Pathway Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -50]}>
        <planeGeometry args={[70, 180]} />
        <meshStandardMaterial
          color="#06060A"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Central Stone Path (Walkway through Torii) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -50]}>
        <planeGeometry args={[3.2, 180]} />
        <meshStandardMaterial
          color="#16151B"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* 2. Giant Celestial Moon */}
      <group position={[4, 22, -140]}>
        {/* Core Moon Orb */}
        <mesh ref={moonRef}>
          <circleGeometry args={[14, 32]} />
          <meshBasicMaterial
            color={p > 0.6 ? '#FFA07A' : '#FDF7E7'}
            transparent
            opacity={0.92}
          />
        </mesh>
        {/* Corona Glow Halo */}
        <mesh position={[0, 0, -1]}>
          <circleGeometry args={[22, 32]} />
          <meshBasicMaterial
            color={p > 0.6 ? '#E63946' : '#F4C26B'}
            transparent
            opacity={0.25}
          />
        </mesh>
        <mesh position={[0, 0, -2]}>
          <circleGeometry args={[36, 32]} />
          <meshBasicMaterial
            color={p > 0.6 ? '#F4C26B' : '#7C3AED'}
            transparent
            opacity={0.12}
          />
        </mesh>
      </group>

      {/* 3. Mountain Silhouettes (Mount Fuji & Japanese Range) */}
      <group position={[0, 0, -160]}>
        {/* Mount Fuji Iconic Symmetrical Cone Peak */}
        <mesh position={[0, 14, 0]}>
          <coneGeometry args={[32, 28, 4]} />
          <meshStandardMaterial
            color="#080912"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
        {/* Snow Peak Cap */}
        <mesh position={[0, 22, 1]}>
          <coneGeometry args={[12, 10, 4]} />
          <meshStandardMaterial
            color="#E2E8F0"
            roughness={0.6}
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* Flanking Foothills */}
        <mesh position={[-42, 6, -10]}>
          <coneGeometry args={[38, 18, 4]} />
          <meshStandardMaterial color="#05060A" roughness={0.95} />
        </mesh>
        <mesh position={[42, 7, -10]}>
          <coneGeometry args={[40, 20, 4]} />
          <meshStandardMaterial color="#05060A" roughness={0.95} />
        </mesh>
      </group>

      {/* 4. Layered Procedural Mist Planes */}
      <mesh ref={mist1Ref} position={[0, 1.2, -35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshBasicMaterial
          color="#151226"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={mist2Ref} position={[0, 1.8, -75]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 50]} />
        <meshBasicMaterial
          color="#1A1530"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Distant Fog Wall */}
      <mesh position={[0, 6, -110]}>
        <planeGeometry args={[120, 40]} />
        <meshBasicMaterial
          color={p > 0.6 ? '#3B1A24' : '#090812'}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

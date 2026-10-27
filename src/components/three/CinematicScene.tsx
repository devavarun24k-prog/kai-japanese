// src/components/three/CinematicScene.tsx
// Persistent WebGL Canvas hosting the 3D Japanese Night to Sunrise Journey
import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { ToriiCorridor } from './ToriiCorridor';
import { FloatingLanterns } from './FloatingLanterns';
import { SakuraPetals } from './SakuraPetals';
import { KanjiParticleMorph } from './KanjiParticleMorph';
import { DistantEnvironment } from './DistantEnvironment';
import { PostProcessingPipeline } from './PostProcessingPipeline';

interface CinematicSceneProps {
  scrollProgress: number; // 0 to 1
  isReducedMotion?: boolean;
}

const DynamicLightingAndFog: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p = Math.max(0, Math.min(1, scrollProgress));

  // Interpolate fog & background colors
  const fogColor = p > 0.7 ? '#2A1622' : p > 0.35 ? '#120F24' : '#07070C';
  const ambientIntensity = p > 0.7 ? 0.9 : 0.45;
  const sunIntensity = p > 0.6 ? (p - 0.6) * 4.5 : 0;

  return (
    <>
      <color attach="background" args={[fogColor]} />
      <fog attach="fog" args={[fogColor, 12, 160]} />

      {/* Atmospheric Moon/Ambient Lighting */}
      <ambientLight color="#93C5FD" intensity={ambientIntensity} />

      {/* Cool Moonlight Directional Beam */}
      <directionalLight
        position={[8, 24, 10]}
        intensity={0.8}
        color="#E0E7FF"
        castShadow
      />

      {/* Warm Golden Lantern Ambient fill */}
      <directionalLight
        position={[-6, 4, -20]}
        intensity={0.6}
        color="#F4C26B"
      />

      {/* Sunrise Warm Rim Light from the Horizon */}
      {sunIntensity > 0 && (
        <directionalLight
          position={[0, 8, -140]}
          intensity={sunIntensity}
          color="#F97316"
        />
      )}
    </>
  );
};

export const CinematicScene: React.FC<CinematicSceneProps> = ({
  scrollProgress,
  isReducedMotion = false
}) => {
  const [dpr, setDpr] = useState(1.5);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07070C]">
      <Canvas
        camera={{ position: [0, 2.7, 12], fov: 50, near: 0.1, far: 240 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1
        }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(1.5)}
          onDecline={() => setDpr(1.0)}
        />
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          <DynamicLightingAndFog scrollProgress={scrollProgress} />
          <CameraRig scrollProgress={scrollProgress} isReducedMotion={isReducedMotion} />
          <ToriiCorridor count={isMobile ? 7 : 10} />
          <FloatingLanterns count={isMobile ? 14 : 24} />
          <SakuraPetals count={isMobile ? 180 : 420} />
          <KanjiParticleMorph scrollProgress={scrollProgress} />
          <DistantEnvironment scrollProgress={scrollProgress} />
          <PostProcessingPipeline enabled={!isReducedMotion} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
};

// src/components/three/CameraRig.tsx
// Scroll-driven 3D spline camera flight with smooth mouse parallax dampening
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  scrollProgress: number; // 0 to 1
  isReducedMotion?: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({ scrollProgress, isReducedMotion = false }) => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Track window mouse coordinates normalized to [-1, 1]
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D Spline Path through the Torii Corridor towards Mount Fuji & Sunrise
  const { cameraSpline, lookAtSpline } = useMemo(() => {
    const camPoints = [
      new THREE.Vector3(0, 2.7, 12),       // 0. Hero: Front of first Torii gate
      new THREE.Vector3(0.5, 2.5, -4),     // 1. Manifesto: Passing into the misty avenue
      new THREE.Vector3(-1.2, 2.4, -22),   // 2. Feature 1 & 2: Winding curve left
      new THREE.Vector3(1.4, 2.4, -48),    // 3. Feature 3 & 4: Winding curve right
      new THREE.Vector3(-0.6, 2.6, -72),   // 4. Feature 5 & 6: Approaching inner sanctuary
      new THREE.Vector3(0, 3.0, -92),      // 5. Showcase & Stats: Elevated perspective
      new THREE.Vector3(0, 4.4, -114)      // 6. Final Sunrise CTA: Elevated vista overlooking Fuji
    ];

    const lookPoints = [
      new THREE.Vector3(0, 2.2, 0),
      new THREE.Vector3(0, 2.2, -18),
      new THREE.Vector3(0, 2.2, -36),
      new THREE.Vector3(0, 2.2, -62),
      new THREE.Vector3(0, 2.4, -86),
      new THREE.Vector3(0, 2.8, -106),
      new THREE.Vector3(0, 10.0, -160) // Looking up at the giant rising sun
    ];

    const cSpline = new THREE.CatmullRomCurve3(camPoints, false, 'catmullrom', 0.5);
    const lSpline = new THREE.CatmullRomCurve3(lookPoints, false, 'catmullrom', 0.5);

    return { cameraSpline: cSpline, lookAtSpline: lSpline };
  }, []);

  const currentCamPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    // Smooth mouse interpolation
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * (delta * 4.5);
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * (delta * 4.5);

    const p = Math.max(0, Math.min(1, scrollProgress));

    // Sample spline points for current scroll progress
    const targetCamPos = cameraSpline.getPointAt(p);
    const targetLookAt = lookAtSpline.getPointAt(p);

    // Apply mouse parallax offsets (disabled or reduced if prefers-reduced-motion)
    const parallaxFactor = isReducedMotion ? 0.05 : 0.45;
    targetCamPos.x += mouse.current.x * parallaxFactor;
    targetCamPos.y += mouse.current.y * (parallaxFactor * 0.6);

    // Smoothly interpolate camera position and look target
    currentCamPos.current.lerp(targetCamPos, delta * 5.0);
    currentLookAt.current.lerp(targetLookAt, delta * 5.0);

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

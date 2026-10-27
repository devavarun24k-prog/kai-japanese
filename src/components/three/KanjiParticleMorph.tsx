// src/components/three/KanjiParticleMorph.tsx
// Morphing kanji point cloud (改 -> 日本語 -> KAI -> Celestial Scatter)
import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KanjiParticleMorphProps {
  scrollProgress: number; // 0 to 1
}

export const KanjiParticleMorph: React.FC<KanjiParticleMorphProps> = ({ scrollProgress }) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const particleCount = 1600;

  // Helper to sample 2D pixel coordinates of rendered text
  const sampleTextPoints = (text: string, count: number, fontSize = 54, width = 200, height = 200): Float32Array => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const positions = new Float32Array(count * 3);

    if (!ctx) return positions;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${fontSize}px "Noto Serif JP", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    const imgData = ctx.getImageData(0, 0, width, height).data;
    const validPixels: [number, number][] = [];

    // Step through pixels
    const step = 2;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (imgData[idx] > 140) {
          validPixels.push([x, y]);
        }
      }
    }

    if (validPixels.length === 0) {
      // Fallback ring if canvas font failed
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * 3;
        positions[i * 3 + 1] = Math.sin(angle) * 3 + 4;
        positions[i * 3 + 2] = -12;
      }
      return positions;
    }

    for (let i = 0; i < count; i++) {
      const p = validPixels[i % validPixels.length];
      const jitterX = (Math.random() - 0.5) * 0.12;
      const jitterY = (Math.random() - 0.5) * 0.12;
      const jitterZ = (Math.random() - 0.5) * 0.4;

      // Normalize to 3D world units (scale to ~5.5 width)
      positions[i * 3] = ((p[0] - width / 2) / (width / 2)) * 3.2 + jitterX;
      positions[i * 3 + 1] = -((p[1] - height / 2) / (height / 2)) * 3.2 + 3.8 + jitterY;
      positions[i * 3 + 2] = -14 + jitterZ;
    }

    return positions;
  };

  // Generate target point configurations
  const { shapeA, shapeB, shapeC, scatter } = useMemo(() => {
    // Shape A: "改" (Renew / Transform)
    const a = sampleTextPoints('改', particleCount, 80);
    // Shape B: "日本語" (Japanese)
    const b = sampleTextPoints('日本語', particleCount, 46);
    // Shape C: "KAI"
    const c = sampleTextPoints('KAI', particleCount, 64);

    // Scattered nebula
    const sc = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 6 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      sc[i * 3] = r * Math.cos(phi) * Math.sin(theta);
      sc[i * 3 + 1] = r * Math.sin(phi) + 6;
      sc[i * 3 + 2] = -40 - Math.random() * 60;
    }

    return { shapeA: a, shapeB: b, shapeC: c, scatter: sc };
  }, [particleCount]);

  // Current interpolated buffer
  const currentPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

  // Colors buffer
  const colors = useMemo(() => {
    const col = new Float32Array(particleCount * 3);
    const colorGold = new THREE.Color('#F4C26B');
    const colorVermilion = new THREE.Color('#E63946');
    const colorSakura = new THREE.Color('#FFB7C5');

    for (let i = 0; i < particleCount; i++) {
      const rnd = Math.random();
      const c = rnd < 0.5 ? colorGold : rnd < 0.8 ? colorVermilion : colorSakura;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return col;
  }, [particleCount]);

  // Soft circular particle texture
  const particleTexture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(244, 194, 107, 0.8)');
      grad.addColorStop(0.7, 'rgba(230, 57, 70, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Update morphing positions based on scrollProgress
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const t = clock.getElapsedTime();

    // Determine morph stages:
    // 0.0 - 0.25: Shape A ("改")
    // 0.25 - 0.55: Transition to Shape B ("日本語")
    // 0.55 - 0.80: Transition to Shape C ("KAI")
    // 0.80 - 1.0: Transition to Scatter Nebula
    const p = Math.max(0, Math.min(1, scrollProgress));

    let fromArr = shapeA;
    let toArr = shapeB;
    let factor = 0;

    if (p < 0.28) {
      fromArr = shapeA;
      toArr = shapeB;
      factor = Math.max(0, (p - 0.18) / 0.1);
    } else if (p < 0.6) {
      fromArr = shapeB;
      toArr = shapeC;
      factor = Math.max(0, (p - 0.45) / 0.15);
    } else {
      fromArr = shapeC;
      toArr = scatter;
      factor = Math.max(0, (p - 0.72) / 0.18);
    }

    // Ease factor
    const ease = factor < 0.5 ? 2 * factor * factor : -1 + (4 - 2 * factor) * factor;

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      const x1 = fromArr[idx];
      const y1 = fromArr[idx + 1];
      const z1 = fromArr[idx + 2];

      const x2 = toArr[idx];
      const y2 = toArr[idx + 1];
      const z2 = toArr[idx + 2];

      // Subtle breathing wave
      const wave = Math.sin(t * 1.5 + i * 0.1) * 0.04;

      currentPositions[idx] = x1 + (x2 - x1) * ease + wave;
      currentPositions[idx + 1] = y1 + (y2 - y1) * ease + wave;
      currentPositions[idx + 2] = z1 + (z2 - z1) * ease;
    }

    posAttr.copyArray(currentPositions);
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.42}
        vertexColors
        map={particleTexture}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

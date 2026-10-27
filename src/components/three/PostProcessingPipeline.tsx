// src/components/three/PostProcessingPipeline.tsx
// Cinematic post-processing with Bloom, Vignette, and subtle Chromatic Aberration
import React, { useMemo } from 'react';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise
} from '@react-three/postprocessing';
import * as THREE from 'three';

interface PostProcessingPipelineProps {
  enabled?: boolean;
  isMobile?: boolean;
}

export const PostProcessingPipeline: React.FC<PostProcessingPipelineProps> = ({
  enabled = true,
  isMobile = false
}) => {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), []);

  if (!enabled || isMobile) {
    return null;
  }

  // Soft Japanese lantern and moonlight bloom, subtle film noise, cinematic vignette, and edge fringe
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={0.75}
        luminanceThreshold={0.52}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <Noise opacity={0.025} />
      <Vignette offset={0.32} darkness={0.65} />
      <ChromaticAberration
        offset={aberrationOffset}
        radialModulation={true}
        modulationOffset={0.3}
      />
    </EffectComposer>
  );
};

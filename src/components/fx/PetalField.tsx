// src/components/fx/PetalField.tsx
// High-performance canvas sakura petal field. Cursor-reactive, pauses on tab hide,
// clamped to max 40 petals on mobile devices. Respects prefers-reduced-motion.
import React, { useRef, useEffect } from 'react';

export interface PetalFieldProps {
  maxPetalsDesktop?: number;
  maxPetalsMobile?: number;
  className?: string;
  interactive?: boolean;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  swaySpeed: number;
  swayAngle: number;
  flip: number;
  flipSpeed: number;
}

export const PetalField: React.FC<PetalFieldProps> = ({
  maxPetalsDesktop = 55,
  maxPetalsMobile = 35,
  className = '',
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReducedMotion = mediaQuery.matches;

    let animationFrameId: number | null = null;
    let isVisible = document.visibilityState === 'visible';

    let width = 0;
    let height = 0;
    let dpr = 1;

    const mousePos = { x: -1000, y: -1000, prevX: -1000, prevY: -1000, vx: 0, vy: 0 };

    const isMobile = () => window.innerWidth < 768;
    const getPetalCount = () => (isMobile() ? Math.min(40, maxPetalsMobile) : maxPetalsDesktop);

    const petals: Petal[] = [];

    const createPetal = (spawnTop = true): Petal => {
      const size = Math.random() * 8 + 8;
      return {
        x: Math.random() * (width || window.innerWidth),
        y: spawnTop ? -20 - Math.random() * 40 : Math.random() * (height || window.innerHeight),
        size,
        speedX: Math.random() * 0.9 + 0.3,
        speedY: Math.random() * 1.2 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.025,
        opacity: Math.random() * 0.45 + 0.35,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayAngle: Math.random() * Math.PI * 2,
        flip: Math.random(),
        flipSpeed: Math.random() * 0.03 + 0.01
      };
    };

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      const targetCount = getPetalCount();
      while (petals.length < targetCount) {
        petals.push(createPetal(false));
      }
      if (petals.length > targetCount) {
        petals.length = targetCount;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mousePos.vx = (currentX - mousePos.prevX) * 0.2;
      mousePos.vy = (currentY - mousePos.prevY) * 0.2;
      mousePos.prevX = currentX;
      mousePos.prevY = currentY;
      mousePos.x = currentX;
      mousePos.y = currentY;
    };

    const handleMouseLeave = () => {
      mousePos.x = -1000;
      mousePos.y = -1000;
      mousePos.vx = 0;
      mousePos.vy = 0;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    // Visibility Listener: pause when hidden
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && !animationFrameId && !isReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      } else if (!isVisible && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Draw single stylized Sakura petal
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(Math.cos(p.flip), 1);

      ctx.beginPath();
      // Traditional cherry blossom notched petal geometry
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.4, p.size * 0.9, -p.size * 0.8, 0, -p.size * 1.3);
      ctx.bezierCurveTo(-p.size * 0.9, -p.size * 0.8, -p.size * 0.5, -p.size * 0.4, 0, 0);

      // Gradient fill (soft vermilion/pink to delicate cream)
      const grad = ctx.createLinearGradient(0, 0, 0, -p.size * 1.3);
      grad.addColorStop(0, `rgba(217, 72, 59, ${p.opacity * 0.65})`);
      grad.addColorStop(0.5, `rgba(244, 162, 155, ${p.opacity * 0.85})`);
      grad.addColorStop(1, `rgba(255, 235, 230, ${p.opacity * 0.9})`);

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Dampen mouse velocity
      mousePos.vx *= 0.92;
      mousePos.vy *= 0.92;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        if (!isReducedMotion) {
          p.swayAngle += p.swaySpeed;
          p.flip += p.flipSpeed;
          p.rotation += p.rotationSpeed;

          // Natural gentle drift
          p.x += p.speedX + Math.sin(p.swayAngle) * 0.75;
          p.y += p.speedY;

          // Cursor attraction / perturbation
          if (mousePos.x > 0 && mousePos.y > 0) {
            const dx = p.x - mousePos.x;
            const dy = p.y - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 140 && dist > 0) {
              const force = (1 - dist / 140) * 2.5;
              p.x += (dx / dist) * force + mousePos.vx * 0.4;
              p.y += (dy / dist) * force + mousePos.vy * 0.4;
            }
          }

          // Respawn at top or left boundary
          if (p.y > height + 25 || p.x > width + 25) {
            petals[i] = createPetal(true);
          }
        }

        drawPetal(p);
      }

      if (!isReducedMotion && isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Initial render
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [maxPetalsDesktop, maxPetalsMobile, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

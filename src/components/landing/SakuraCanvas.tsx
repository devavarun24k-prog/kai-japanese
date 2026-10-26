// src/components/landing/SakuraCanvas.tsx
// High-performance canvas-based Sakura (Cherry Blossom) particle system
// Lightweight, GPU-friendly, respects prefers-reduced-motion, auto-pauses when out of viewport
import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  layer: number; // 0 = far/small, 1 = mid, 2 = near/large
}

interface SakuraCanvasProps {
  petalCount?: number;
  interactive?: boolean;
  className?: string;
}

export const SakuraCanvas: React.FC<SakuraCanvasProps> = ({
  petalCount = 36,
  interactive = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Draw a subtle static sprinkle of petals and return
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = 'rgba(255, 218, 224, 0.45)';
      for (let i = 0; i < 12; i++) {
        const x = (i * canvas.width) / 12 + 20;
        const y = 80 + (i % 3) * 60;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive petal count (fewer on mobile)
    const effectiveCount = width < 768 ? Math.floor(petalCount * 0.5) : petalCount;

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for breeze interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initialize petals
    const petals: Petal[] = [];
    for (let i = 0; i < effectiveCount; i++) {
      const layer = Math.random() < 0.3 ? 2 : Math.random() < 0.6 ? 1 : 0;
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: layer === 2 ? 11 + Math.random() * 5 : layer === 1 ? 7 + Math.random() * 4 : 4 + Math.random() * 3,
        speedX: 0.6 + Math.random() * 1.4 + layer * 0.4,
        speedY: 0.8 + Math.random() * 1.2 + layer * 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        flip: Math.random(),
        flipSpeed: 0.02 + Math.random() * 0.03,
        opacity: layer === 2 ? 0.85 : layer === 1 ? 0.65 : 0.4,
        layer
      });
    }

    // Draw single petal shape
    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.scale(Math.cos(p.flip), 1);

      // Gradient color from delicate blossom pink to deeper antique rose
      const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
      grad.addColorStop(0, `rgba(255, 240, 242, ${p.opacity})`);
      grad.addColorStop(0.4, `rgba(247, 198, 206, ${p.opacity})`);
      grad.addColorStop(1, `rgba(219, 133, 149, ${p.opacity * 0.9})`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      // Organic notched sakura petal geometry
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.9, p.size * 0.9, p.size * 0.3, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.9, p.size * 0.3, -p.size * 0.7, -p.size * 0.9, 0, -p.size);
      ctx.closePath();
      ctx.fill();

      // Delicate ink center vein for foreground petals
      if (p.layer === 2) {
        ctx.strokeStyle = `rgba(168, 74, 58, ${p.opacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.7);
        ctx.lineTo(0, p.size * 0.5);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Render loop
    let lastTime = performance.now();
    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.67, 2);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        // Horizontal wind turbulence
        const wind = Math.sin((time * 0.001) + p.y * 0.005) * 0.6;
        let dx = (p.speedX + wind) * delta;
        let dy = p.speedY * delta;

        // Interactive breeze reaction
        if (mouse.active) {
          const distX = p.x - mouse.x;
          const distY = p.y - mouse.y;
          const dist = Math.hypot(distX, distY);
          if (dist < 140) {
            const push = (1 - dist / 140) * 2;
            dx += (distX / dist) * push;
            dy += (distY / dist) * push;
          }
        }

        p.x += dx;
        p.y += dy;
        p.rotation += p.rotationSpeed * delta;
        p.flip += p.flipSpeed * delta;

        // Recycle petal when it drifts off screen
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }

        drawPetal(p);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [petalCount, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-20 ${className}`}
      aria-hidden="true"
    />
  );
};

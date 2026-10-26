// src/components/common/DrawingCanvas.tsx
// Digital canvas for Japanese handwriting with 4-quadrant genkō yōshi grid and stroke capture
import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Trash2, CheckCircle2 } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface DrawingCanvasProps {
  onStrokeComplete?: (strokeCount: number, dataUrl: string) => void;
  width?: number;
  height?: number;
  guideCharacter?: string;
  showGuide?: boolean;
}

interface Point {
  x: number;
  y: number;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onStrokeComplete,
  width = 280,
  height = 280,
  guideCharacter,
  showGuide = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentStroke = useRef<Point[]>([]);

  // Redraw canvas with grid lines and strokes
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clear background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Traditional 4-Quadrant Grid (Genkō Yōshi guide)
    ctx.strokeStyle = '#E8E3D9';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Reset dash for outer border
    ctx.setLineDash([]);
    ctx.strokeStyle = '#D8D2C5';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // 2. Draw Faint Guide Character if enabled
    if (guideCharacter && showGuide) {
      ctx.fillStyle = 'rgba(217, 72, 59, 0.12)'; // Faint Vermilion watermark
      ctx.font = `${Math.floor(height * 0.65)}px "Noto Sans JP", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(guideCharacter, width / 2, height / 2 + 8);
    }

    // 3. Draw Recorded Strokes with traditional sumi-e calligraphy brush feel
    ctx.strokeStyle = '#1A1817'; // Sumi-e deep ink
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach((stroke) => {
      if (stroke.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);

      for (let i = 1; i < stroke.length; i++) {
        // Smooth curve interpolation
        const midX = (stroke[i - 1].x + stroke[i].x) / 2;
        const midY = (stroke[i - 1].y + stroke[i].y) / 2;
        ctx.quadraticCurveTo(stroke[i - 1].x, stroke[i - 1].y, midX, midY);
      }
      ctx.lineTo(stroke[stroke.length - 1].x, stroke[stroke.length - 1].y);
      ctx.stroke();
    });

    ctx.restore();
  };

  useEffect(() => {
    redraw();
  }, [strokes, guideCharacter, showGuide]);

  // Touch and Mouse handlers
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return null;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pt = getCoordinates(e);
    if (!pt) return;
    setIsDrawing(true);
    currentStroke.current = [pt];
    soundEffects.playClick();
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pt = getCoordinates(e);
    if (!pt) return;

    currentStroke.current.push(pt);

    // Live preview on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#1A1817';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const pts = currentStroke.current;
    if (pts.length > 1) {
      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.current.length > 1) {
      const newStrokes = [...strokes, currentStroke.current];
      setStrokes(newStrokes);
      currentStroke.current = [];

      if (onStrokeComplete && canvasRef.current) {
        onStrokeComplete(newStrokes.length, canvasRef.current.toDataURL('image/png'));
      }
    }
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    soundEffects.playClick();
    if (onStrokeComplete && canvasRef.current) {
      onStrokeComplete(newStrokes.length, canvasRef.current.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    setStrokes([]);
    currentStroke.current = [];
    soundEffects.playClick();
    redraw();
    if (onStrokeComplete && canvasRef.current) {
      onStrokeComplete(0, canvasRef.current.toDataURL('image/png'));
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Canvas container with paper shadow */}
      <div className="relative rounded-2xl overflow-hidden shadow-washi-md border border-kai-border dark:border-kai-dark-border bg-white touch-none">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="cursor-crosshair block"
        />

        {/* Live Stroke Counter badge */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-kai-indigo/80 text-white font-mono text-2xs select-none">
          {strokes.length} strokes
        </div>
      </div>

      {/* Drawing controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleUndo}
          disabled={strokes.length === 0}
          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-kai-dark-card text-kai-muted dark:text-kai-dark-muted hover:text-kai-ink dark:hover:text-white disabled:opacity-40 text-xs font-medium flex items-center gap-1.5 transition-colors border border-kai-border/50"
        >
          <RotateCcw size={14} />
          Undo
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={strokes.length === 0}
          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-kai-dark-card text-kai-muted dark:text-kai-dark-muted hover:text-kai-vermilion disabled:opacity-40 text-xs font-medium flex items-center gap-1.5 transition-colors border border-kai-border/50"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>
    </div>
  );
};

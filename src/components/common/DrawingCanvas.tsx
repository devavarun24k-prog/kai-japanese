// src/components/common/DrawingCanvas.tsx
// Physical practice board for Japanese handwriting with 4-quadrant genkō yōshi grid,
// stroke replay animation, guide watermark toggle, and smooth sumi-e brush dynamics
import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Trash2, Play, Eye, EyeOff } from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface DrawingCanvasProps {
  onStrokeComplete?: (strokeCount: number, dataUrl: string) => void;
  width?: number;
  height?: number;
  guideCharacter?: string;
  showGuide?: boolean;
  ghostGuide?: boolean;
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
  showGuide: initialShowGuide = true,
  ghostGuide = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [guideVisible, setGuideVisible] = useState<boolean>(initialShowGuide);
  const [isReplaying, setIsReplaying] = useState<boolean>(false);
  const currentStroke = useRef<Point[]>([]);

  // Update guide visibility if prop changes
  useEffect(() => {
    setGuideVisible(initialShowGuide);
  }, [initialShowGuide]);

  // Redraw canvas with grid lines and strokes
  const redraw = (customStrokes = strokes, renderGuide = guideVisible) => {
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

    // Warm washi paper background
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Traditional 4-Quadrant Grid (Genkō Yōshi guide)
    ctx.strokeStyle = '#E2DAD0';
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
    ctx.strokeStyle = '#D5CBC0';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, width - 2, height - 2);

    // 2. Draw Faint Guide Character if enabled
    if (guideCharacter && renderGuide) {
      if (ghostGuide) {
        // Ghost trace mode: delicate dashed outline with faint carbon fill
        ctx.save();
        ctx.font = `${Math.floor(height * 0.65)}px "Noto Sans JP", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(26, 24, 23, 0.08)';
        ctx.fillText(guideCharacter, width / 2, height / 2 + 6);
        ctx.strokeStyle = 'rgba(217, 72, 59, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.strokeText(guideCharacter, width / 2, height / 2 + 6);
        ctx.restore();
      } else {
        ctx.fillStyle = 'rgba(217, 72, 59, 0.14)'; // Soft Vermilion watermark
        ctx.font = `${Math.floor(height * 0.65)}px "Noto Sans JP", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(guideCharacter, width / 2, height / 2 + 6);
      }
    }

    // 3. Draw Recorded Strokes with traditional sumi-e calligraphy brush feel
    ctx.strokeStyle = '#1A1817'; // Sumi-e deep carbon ink
    ctx.lineWidth = 8.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    customStrokes.forEach((stroke) => {
      if (stroke.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);

      for (let i = 1; i < stroke.length; i++) {
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
    if (!isReplaying) {
      redraw();
    }
  }, [strokes, guideCharacter, guideVisible]);

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
    if (isReplaying) return;
    e.preventDefault();
    const pt = getCoordinates(e);
    if (!pt) return;
    setIsDrawing(true);
    currentStroke.current = [pt];
    soundEffects.playClick();
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isReplaying) return;
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
    ctx.lineWidth = 8.5;
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
    if (!isDrawing || isReplaying) return;
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
    if (strokes.length === 0 || isReplaying) return;
    const newStrokes = strokes.slice(0, -1);
    setStrokes(newStrokes);
    soundEffects.playClick();
    if (onStrokeComplete && canvasRef.current) {
      onStrokeComplete(newStrokes.length, canvasRef.current.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    if (isReplaying) return;
    setStrokes([]);
    currentStroke.current = [];
    soundEffects.playClick();
    redraw([], guideVisible);
    if (onStrokeComplete && canvasRef.current) {
      onStrokeComplete(0, canvasRef.current.toDataURL('image/png'));
    }
  };

  // Replay stroke sequence animation
  const handleReplay = () => {
    if (strokes.length === 0 || isReplaying) return;
    setIsReplaying(true);
    soundEffects.playClick();

    let strokeIdx = 0;
    const interval = setInterval(() => {
      strokeIdx++;
      redraw(strokes.slice(0, strokeIdx), guideVisible);

      if (strokeIdx >= strokes.length) {
        clearInterval(interval);
        setTimeout(() => setIsReplaying(false), 300);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Canvas container with physical washi paper shadow and grain */}
      <div className="relative rounded-2xl overflow-hidden shadow-washi-md border-2 border-[#D5CBC0] dark:border-[#2D3A4F] bg-[#FAF7F2] touch-none">
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
        <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-[#1A1817]/85 text-white font-mono text-2xs select-none shadow-sm">
          {strokes.length} {strokes.length === 1 ? 'stroke' : 'strokes'}
        </div>

        {/* Replay indicator */}
        {isReplaying && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-white text-[#D9483B] font-mono text-xs font-bold shadow-md animate-pulse">
              Replaying Strokes...
            </span>
          </div>
        )}
      </div>

      {/* Drawing controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Toggle Guide */}
        {guideCharacter && (
          <button
            type="button"
            onClick={() => setGuideVisible((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              guideVisible
                ? 'bg-[#D9483B]/10 border-[#D9483B]/40 text-[#D9483B]'
                : 'bg-stone-100 dark:bg-[#1E293B] border-stone-200 dark:border-stone-700 text-[#7A7165]'
            }`}
            title="Toggle watermark stroke guide"
          >
            {guideVisible ? <Eye size={13} /> : <EyeOff size={13} />}
            <span>Guide {guideVisible ? 'On' : 'Off'}</span>
          </button>
        )}

        {/* Undo */}
        <button
          type="button"
          onClick={handleUndo}
          disabled={strokes.length === 0 || isReplaying}
          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1E293B] text-[#554E45] dark:text-[#CBD5E1] hover:text-[#1A1817] disabled:opacity-40 text-xs font-medium flex items-center gap-1.5 transition-colors border border-stone-200 dark:border-stone-700"
        >
          <RotateCcw size={13} />
          <span>Undo</span>
        </button>

        {/* Replay */}
        <button
          type="button"
          onClick={handleReplay}
          disabled={strokes.length === 0 || isReplaying}
          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1E293B] text-[#554E45] dark:text-[#CBD5E1] hover:text-[#1A1817] disabled:opacity-40 text-xs font-medium flex items-center gap-1.5 transition-colors border border-stone-200 dark:border-stone-700"
        >
          <Play size={13} />
          <span>Replay</span>
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={handleClear}
          disabled={strokes.length === 0 || isReplaying}
          className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#1E293B] text-[#554E45] dark:text-[#CBD5E1] hover:text-[#D9483B] disabled:opacity-40 text-xs font-medium flex items-center gap-1.5 transition-colors border border-stone-200 dark:border-stone-700"
        >
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};

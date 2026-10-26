// src/components/handwriting/HandwritingStudio.tsx
// Digital canvas and photo upload handwriting OCR analyzer with downloadable correction report
import React, { useState, useRef } from 'react';
import {
  PenTool,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Download,
  Sparkles,
  ArrowRight,
  FileText
} from 'lucide-react';
import { DrawingCanvas } from '../common/DrawingCanvas';
import { ocrService } from '../../services/ocrService';
import { HandwritingAnalysisResult } from '../../types';
import { useLearning } from '../../context/LearningContext';
import { storageService } from '../../services/storageService';
import { soundEffects } from '../../services/soundEffects';
import { MascotKai } from '../common/MascotKai';

export const HandwritingStudio: React.FC = () => {
  const { displayMode, awardXP, recordAttempt } = useLearning();
  const [inputMode, setInputMode] = useState<'canvas' | 'upload'>('canvas');
  const [targetChar, setTargetChar] = useState<string>('あ');
  const [recordedStrokes, setRecordedStrokes] = useState<number>(0);
  const [canvasDataUrl, setCanvasDataUrl] = useState<string | null>(null);

  // Photo upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageRotation, setImageRotation] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<HandwritingAnalysisResult | null>(null);

  const targetCharacters = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ', '日', '本', '人'];

  const handleCanvasStroke = (count: number, dataUrl: string) => {
    setRecordedStrokes(count);
    setCanvasDataUrl(dataUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        setImageRotation(0);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const rotateImage = () => {
    setImageRotation((prev) => (prev + 90) % 360);
  };

  const handleAnalyze = async () => {
    const imageToAnalyze = inputMode === 'canvas' ? canvasDataUrl : uploadedImage;
    if (!imageToAnalyze) return;

    soundEffects.playClick();
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const result = await ocrService.analyzeHandwriting(
      imageToAnalyze,
      targetChar,
      3,
      inputMode === 'canvas' ? recordedStrokes : 0
    );

    setIsAnalyzing(false);
    setAnalysisResult(result);

    if (result.is_correct) {
      soundEffects.playCorrect();
      awardXP(25, `Analyzed handwriting for ${targetChar}`);
    } else {
      soundEffects.playWrong();
      // Log to private mistake notebook
      storageService.logMistake(
        `handwriting_${targetChar}`,
        'kana',
        `Handwriting ${targetChar}`,
        result.detected_text,
        targetChar,
        'handwriting_stroke_error',
        result.explanations_en,
        result.explanations_te
      );
    }

    recordAttempt({
      item_id: `hw_${targetChar}`,
      item_type: 'kana',
      skill: 'writing',
      question_type: inputMode === 'canvas' ? 'canvas_handwriting' : 'photo_ocr',
      user_response: result.detected_text,
      expected_response: targetChar,
      is_correct: result.is_correct,
      response_time_ms: 2800,
      hint_used: false,
      retry_count: 0
    });
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    const reportText = `KAI JAPANESE MASTERY PLATFORM — HANDWRITING REPORT
Date: ${new Date().toLocaleString()}
Target Character: ${analysisResult.target_character}
Recognized Text: ${analysisResult.detected_text}
Confidence Score: ${analysisResult.confidence}%
Evaluation: ${analysisResult.is_correct ? 'PASSED' : 'RETRY RECOMMENDED'}

Stroke Feedback:
${analysisResult.stroke_feedback.join('\n')}

English Diagnosis:
${analysisResult.explanations_en}

Telugu Diagnosis (తెలుగు వివరణ):
${analysisResult.explanations_te}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kai_handwriting_report_${targetChar}_${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-kai-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-serif_jp text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
            <span>手書き解析</span>
            <span className="text-sm font-sans font-normal text-kai-muted">Handwriting & OCR Studio</span>
          </h1>
          <p className="text-xs text-kai-muted">
            Draw on digital canvas or upload homework notebook photos for character OCR inspection.
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-kai-dark-card border border-kai-border/50 text-xs">
          <button
            onClick={() => {
              setInputMode('canvas');
              setAnalysisResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              inputMode === 'canvas' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink' : 'text-kai-muted'
            }`}
          >
            <PenTool size={13} />
            <span>Digital Canvas</span>
          </button>
          <button
            onClick={() => {
              setInputMode('upload');
              setAnalysisResult(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              inputMode === 'upload' ? 'bg-white dark:bg-kai-dark-surface shadow-sm text-kai-ink' : 'text-kai-muted'
            }`}
          >
            <Camera size={13} />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Target Character Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-2xs font-mono text-kai-muted uppercase flex-shrink-0">Target:</span>
        {targetCharacters.map((char) => (
          <button
            key={char}
            onClick={() => {
              setTargetChar(char);
              setAnalysisResult(null);
            }}
            className={`w-9 h-9 rounded-xl font-japanese font-bold text-base flex-shrink-0 border transition-all ${
              targetChar === char
                ? 'bg-kai-vermilion text-white border-kai-vermilion shadow-vermilion'
                : 'bg-white dark:bg-kai-dark-card border-kai-border text-kai-ink hover:border-kai-vermilion/50'
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Input Stage: Canvas or File Upload */}
      {inputMode === 'canvas' ? (
        <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi flex flex-col items-center gap-5">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-md px-2 gap-4">
            <div className="text-left space-y-0.5">
              <span className="text-2xs font-mono text-kai-muted uppercase tracking-wider">
                Target Character
              </span>
              <div className="text-3xl font-bold font-japanese text-kai-ink dark:text-kai-dark-ink flex items-center gap-2">
                <span>{targetChar}</span>
                <span className="text-xs font-mono font-normal text-kai-muted">
                  (Click &apos;Guide On&apos; below to trace)
                </span>
              </div>
            </div>

            <MascotKai
              mood={
                isAnalyzing
                  ? 'thinking'
                  : analysisResult?.is_correct
                  ? 'celebrating'
                  : analysisResult
                  ? 'reacting_to_mistake'
                  : 'curious'
              }
              speechText={
                isAnalyzing
                  ? 'Inspecting your stroke order and proportions...'
                  : analysisResult?.is_correct
                  ? 'Excellent stroke balance! Beautiful calligraphy!'
                  : analysisResult
                  ? 'Close! Notice where the stroke curves. Try again!'
                  : `Draw "${targetChar}" with smooth deliberate strokes!`
              }
              size="sm"
              bubblePlacement="bottom"
            />
          </div>

          <DrawingCanvas
            width={280}
            height={280}
            guideCharacter={targetChar}
            showGuide={true}
            onStrokeComplete={handleCanvasStroke}
          />

          <button
            onClick={handleAnalyze}
            disabled={recordedStrokes === 0 || isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-kai-indigo hover:bg-kai-indigo-dark text-white font-semibold text-xs disabled:opacity-40 shadow-sm transition-transform active:scale-95 flex items-center gap-2"
          >
            <Sparkles size={14} />
            <span>{isAnalyzing ? 'Analyzing Strokes...' : 'Analyze My Canvas Writing'}</span>
          </button>
        </div>
      ) : (
        /* Photo Upload Mode */
        <div className="p-6 rounded-3xl bg-white dark:bg-kai-dark-card border border-kai-border dark:border-kai-dark-border shadow-washi flex flex-col items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {!uploadedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm h-52 rounded-2xl border-2 border-dashed border-kai-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-kai-vermilion hover:bg-stone-50 transition-colors p-4 text-center"
            >
              <Upload size={32} className="text-kai-faint" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-kai-ink dark:text-kai-dark-ink">
                  Upload notebook or homework photograph
                </span>
                <p className="text-2xs text-kai-muted">
                  Supports JPG, PNG, WEBP. Ensure character is well-lit and centered.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              <div
                className="relative rounded-2xl overflow-hidden border border-kai-border max-w-xs shadow-sm"
                style={{ transform: `rotate(${imageRotation}deg)` }}
              >
                <img src={uploadedImage} alt="Uploaded notebook" className="max-h-64 object-contain" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={rotateImage}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 text-kai-ink text-xs font-medium flex items-center gap-1.5"
                >
                  <RotateCw size={13} />
                  <span>Rotate 90°</span>
                </button>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 text-kai-muted text-xs font-medium"
                >
                  Change Photo
                </button>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-kai-indigo hover:bg-kai-indigo-dark text-white font-semibold text-xs shadow-sm transition-transform active:scale-95 flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>{isAnalyzing ? 'Extracting Japanese Script...' : `Analyze for "${targetChar}"`}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Analysis Result Card */}
      {analysisResult && (
        <div
          className={`p-6 rounded-3xl border space-y-4 animate-in fade-in ${
            analysisResult.is_correct
              ? 'bg-green-50/80 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-900 dark:text-green-200'
              : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {analysisResult.is_correct ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
              <span className="font-bold text-base">
                OCR Status: {analysisResult.is_correct ? 'Recognized & Verified' : 'Needs Correction'}
              </span>
            </div>

            <button
              onClick={handleDownloadReport}
              className="px-3 py-1 rounded-xl bg-white/70 dark:bg-black/30 border border-current text-xs font-semibold flex items-center gap-1"
            >
              <Download size={13} />
              <span>Download Report</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-black/30">
              <span className="text-3xs font-mono text-kai-muted uppercase block">Target</span>
              <span className="text-xl font-bold font-japanese">{analysisResult.target_character}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-black/30">
              <span className="text-3xs font-mono text-kai-muted uppercase block">Detected</span>
              <span className="text-xl font-bold font-japanese">{analysisResult.detected_text}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/70 dark:bg-black/30">
              <span className="text-3xs font-mono text-kai-muted uppercase block">Confidence</span>
              <span className="text-xl font-bold font-mono">{analysisResult.confidence}%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/70 dark:bg-black/30 space-y-2 text-xs">
            <p className="leading-relaxed">{analysisResult.explanations_en}</p>
            {(displayMode === 'telugu' || displayMode === 'bilingual') && (
              <p className="font-telugu text-kai-vermilion leading-relaxed">
                {analysisResult.explanations_te}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

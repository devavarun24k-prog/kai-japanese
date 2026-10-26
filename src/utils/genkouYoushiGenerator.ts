// src/utils/genkouYoushiGenerator.ts
// Printable Genkō Yōshi (原稿用紙) traditional 4-quadrant Japanese manuscript handwriting practice sheet generator
import { KanaItem } from '../types';

export const openPrintableGenkouYoushi = (title: string, characters: KanaItem[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open the printable practice sheet.');
    return;
  }

  const dateStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${title} — KAI Genkō Yōshi Practice Sheet</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Serif+JP:wght@600;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Noto Sans JP', sans-serif;
      color: #1A1817;
      background: #FFFFFF;
      padding: 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid #D9483B;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .header h1 {
      font-family: 'Noto Serif JP', serif;
      font-size: 18pt;
      color: #1A1817;
    }
    .header h1 span {
      color: #D9483B;
      font-size: 13pt;
      margin-left: 8px;
      font-family: sans-serif;
    }
    .meta-fields {
      display: flex;
      gap: 20px;
      font-size: 9pt;
      color: #666;
    }
    .meta-line {
      border-bottom: 1px solid #999;
      display: inline-block;
      width: 120px;
      height: 14px;
    }
    .instruction-bar {
      background: #FAF7F2;
      border: 1px solid #E5DED4;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 8pt;
      color: #555;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
    }
    .char-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .char-info {
      width: 80px;
      flex-shrink: 0;
      padding-right: 10px;
    }
    .char-info .main-char {
      font-family: 'Noto Serif JP', serif;
      font-size: 26pt;
      font-weight: bold;
      line-height: 1;
      color: #1A1817;
    }
    .char-info .romaji {
      font-family: monospace;
      font-size: 9pt;
      color: #2E4370;
      font-weight: bold;
    }
    .char-info .telugu {
      font-size: 8pt;
      color: #D9483B;
      font-weight: bold;
    }
    .grid-container {
      display: flex;
      gap: 6px;
      flex-grow: 1;
    }
    /* Genko Yoshi 4-Quadrant Box */
    .quadrant-box {
      width: 58px;
      height: 58px;
      border: 1.5px solid #C59B27;
      position: relative;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    /* Dashed quadrant lines */
    .quadrant-box::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      border-left: 1px dashed #DDD2C4;
    }
    .quadrant-box::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      border-top: 1px dashed #DDD2C4;
    }
    .char-guide-solid {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 34pt;
      color: #1A1817;
      z-index: 2;
    }
    .char-guide-ghost-dark {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 34pt;
      color: rgba(217, 72, 59, 0.35);
      z-index: 2;
    }
    .char-guide-ghost-light {
      font-family: 'Noto Sans JP', sans-serif;
      font-size: 34pt;
      color: rgba(217, 72, 59, 0.15);
      z-index: 2;
    }
    .footer {
      margin-top: 18px;
      padding-top: 8px;
      border-top: 1px solid #E5DED4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #777;
    }
    .print-btn-bar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999;
      background: #1A1817;
      color: #FFF;
      padding: 10px 18px;
      border-radius: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      display: flex;
      gap: 12px;
      align-items: center;
      font-size: 11pt;
    }
    .print-btn {
      background: #D9483B;
      color: #FFF;
      border: none;
      padding: 6px 16px;
      border-radius: 20px;
      font-weight: bold;
      cursor: pointer;
      font-size: 10pt;
    }
    @media print {
      .print-btn-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-btn-bar">
    <span>Ready to print A4 handwriting sheet</span>
    <button class="print-btn" onclick="window.print()">Print Sheet (印刷)</button>
  </div>

  <div class="header">
    <div>
      <h1>原稿用紙 <span>KAI Japanese Mastery</span></h1>
      <div style="font-size: 9pt; color: #666; margin-top: 3px;">${title} — Traditional 4-Quadrant Practice Sheet</div>
    </div>
    <div class="meta-fields">
      <div>Name: <span class="meta-line"></span></div>
      <div>Date: <span style="font-family: monospace;">${dateStr}</span></div>
      <div>Score: <span class="meta-line" style="width: 50px;"></span></div>
    </div>
  </div>

  <div class="instruction-bar">
    <div><strong>Practice Rules:</strong> Center each character within the crosshair lines. Trace guide characters first, then write freehand in the blank quadrants.</div>
    <div>${characters.length} Characters • ${characters.reduce((acc, c) => acc + c.stroke_count, 0)} Total Strokes</div>
  </div>

  <div class="rows-container">
    ${characters
      .map(
        (c) => `
    <div class="char-row">
      <div class="char-info">
        <div class="main-char">${c.character}</div>
        <div class="romaji">${c.romaji} (${c.stroke_count}s)</div>
        <div class="telugu">${c.telugu_phonetic}</div>
      </div>
      <div class="grid-container">
        <!-- 1. Exemplar -->
        <div class="quadrant-box" title="Exemplar">
          <span class="char-guide-solid">${c.character}</span>
        </div>
        <!-- 2. Dark Ghost Trace -->
        <div class="quadrant-box" title="Ghost Trace 1">
          <span class="char-guide-ghost-dark">${c.character}</span>
        </div>
        <!-- 3. Light Ghost Trace -->
        <div class="quadrant-box" title="Ghost Trace 2">
          <span class="char-guide-ghost-light">${c.character}</span>
        </div>
        <!-- 4-8. Freehand Quadrants -->
        <div class="quadrant-box" title="Freehand 1"></div>
        <div class="quadrant-box" title="Freehand 2"></div>
        <div class="quadrant-box" title="Freehand 3"></div>
        <div class="quadrant-box" title="Freehand 4"></div>
        <div class="quadrant-box" title="Freehand 5"></div>
      </div>
    </div>
    `
      )
      .join('')}
  </div>

  <div class="footer">
    <div>
      Kanji & Kana stroke data derived from <strong>KanjiVG</strong> (copyright &copy; 2009-2023 Ulrich Apel), released under <strong>Creative Commons Attribution-Share Alike 3.0 (CC BY-SA 3.0)</strong>.
    </div>
    <div>
      KAI — www.kai-mastery.app
    </div>
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

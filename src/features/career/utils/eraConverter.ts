// src/features/career/utils/eraConverter.ts
// Accurate Western Calendar to Japanese Imperial Era (Showa, Heisei, Reiwa) Converter
// Strict era boundaries:
// Showa: 1926-12-25 to 1989-01-07 (Ends 1989-01-07, Showa 64)
// Heisei: 1989-01-08 to 2019-04-30 (Starts 1989-01-08, Ends 2019-04-30, Heisei 31)
// Reiwa: 2019-05-01 onwards (Starts 2019-05-01, Reiwa 1 = 令和元年)

export interface JapaneseEraResult {
  era: 'Showa' | 'Heisei' | 'Reiwa';
  eraJp: '昭和' | '平成' | '令和';
  yearInEra: number;
  formattedYear: string; // e.g. "令和元年" or "令和6年"
  formattedFull: string; // e.g. "令和6年10月27日" or "令和6年10月"
  westernYear: number;
  month?: number;
  day?: number;
}

/**
 * Parses date string in YYYY, YYYY-MM, or YYYY-MM-DD format
 */
function parseDateParts(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split('-');
  const year = parseInt(parts[0], 10);
  if (isNaN(year) || year < 1926) return null;

  const month = parts.length > 1 ? parseInt(parts[1], 10) : 1;
  const day = parts.length > 2 ? parseInt(parts[2], 10) : 1;

  if (isNaN(month) || month < 1 || month > 12) return null;
  if (isNaN(day) || day < 1 || day > 31) return null;

  return { year, month, day };
}

/**
 * Converts a Gregorian date string (YYYY-MM-DD or YYYY-MM) to Japanese Era representation
 */
export function convertToJapaneseEra(dateStr: string): JapaneseEraResult | null {
  const parsed = parseDateParts(dateStr);
  if (!parsed) return null;

  const { year, month, day } = parsed;
  // Construct date comparable integer: YYYYMMDD
  const dateKey = year * 10000 + month * 100 + day;

  // Exact boundary conditions
  // Reiwa: >= 2019-05-01 (20190501)
  // Heisei: 1989-01-08 (19890108) to 2019-04-30 (20190430)
  // Showa: 1926-12-25 (19261225) to 1989-01-07 (19890107)

  let era: 'Showa' | 'Heisei' | 'Reiwa';
  let eraJp: '昭和' | '平成' | '令和';
  let startYear: number;

  if (dateKey >= 20190501) {
    era = 'Reiwa';
    eraJp = '令和';
    startYear = 2019;
  } else if (dateKey >= 19890108) {
    era = 'Heisei';
    eraJp = '平成';
    startYear = 1989;
  } else if (dateKey >= 19261225) {
    era = 'Showa';
    eraJp = '昭和';
    startYear = 1926;
  } else {
    // Before Showa is outside scope for standard modern resumes
    return null;
  }

  const yearInEra = year - startYear + 1;
  const yearStr = yearInEra === 1 ? '元年' : `${yearInEra}年`;
  const formattedYear = `${eraJp}${yearStr}`;

  // Check if original dateStr had month or day
  const rawParts = dateStr.trim().split('-');
  let formattedFull = formattedYear;

  if (rawParts.length >= 2) {
    formattedFull += `${month}月`;
  }
  if (rawParts.length >= 3) {
    formattedFull += `${day}日`;
  }

  return {
    era,
    eraJp,
    yearInEra,
    formattedYear,
    formattedFull,
    westernYear: year,
    month: rawParts.length >= 2 ? month : undefined,
    day: rawParts.length >= 3 ? day : undefined
  };
}

/**
 * Format a date string into standard Rirekisho date format (e.g., "令和6年10月")
 */
export function formatRirekishoDate(dateStr: string): string {
  const res = convertToJapaneseEra(dateStr);
  if (!res) return dateStr || '';
  return res.formattedFull;
}

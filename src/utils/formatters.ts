import type { Language } from '../types/index.ts';

export const toBengaliDigits = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined) return '';
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
};

export const formatNumber = (num: number | null | undefined, lang: Language): string => {
  const safeNum = typeof num === 'number' && !isNaN(num) ? num : 0;
  if (lang === 'bn') {
    return toBengaliDigits(safeNum.toLocaleString('en-US'));
  }
  return safeNum.toLocaleString('en-US');
};

export const formatCurrency = (amount: number | null | undefined, lang: Language): string => {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const formatted = formatNumber(safeAmount, lang);
  return lang === 'bn' ? `৳ ${formatted}` : `BDT ${formatted}`;
};

export const formatDate = (dateStr: string, lang: Language): string => {
  if (!dateStr) return '';
  if (lang === 'bn') {
    return toBengaliDigits(dateStr);
  }
  return dateStr;
};



/**
 * Converts a number to Arabic digits when in Arabic mode
 * @param num - The number to convert
 * @param isArabic - Whether to convert to Arabic digits
 * @returns The formatted number as a string
 */
export const toLocaleDigits = (num: number | string, isArabic: boolean): string => {
  if (!isArabic) return typeof num === 'string' ? num : num.toString();
  
  const str = typeof num === 'string' ? num : num.toString();
  return str.replace(/[0-9]/g, d => 
    String.fromCharCode(1632 + parseInt(d, 10))
  );
};

/**
 * Formats a time string (e.g., "1h 30m") based on the current language
 * @param timeStr - The time string to format
 * @param isArabic - Whether to convert to Arabic format
 * @returns The formatted time string
 */
export const formatTimeString = (timeStr: string, isArabic: boolean): string => {
  if (!isArabic) return timeStr;
  
  // Replace hours and minutes format with Arabic digits and labels
  const arabicTimeStr = timeStr
    .replace(/(\d+)h/g, (_, num) => `${toLocaleDigits(parseInt(num, 10), true)}س`)
    .replace(/(\d+)m/g, (_, num) => `${toLocaleDigits(parseInt(num, 10), true)}د`);
    
  return arabicTimeStr;
};

export function getTextDirection(text: string): "ltr" | "rtl" {
  if (!text) return "ltr";
  if (/^\s*[a-zA-Z]/.test(text)) {
    return "ltr";
  }
  if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) {
    return "rtl";
  }
  return "ltr";
}

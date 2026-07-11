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

export function formatMessagePreview(message: string): string {
  if (!message) return "";
  const mediaRegex = /((?:(?:\/api\/files\/|\/chats\/)|https?:\/\/)[^\n]+?\.(?:jpg|jpeg|png|webp|heic|heif|mp4|mov|avi|webm|wmv|mpeg|mpg|flv|3gpp|pdf))/i;
  const match = message.match(mediaRegex);
  if (match) {
    const textContent = message.replace(match[1], '').trim();
    if (textContent) {
      return `${textContent} <Attachment>`;
    }
    return "<Attachment>";
  }
  return message;
}

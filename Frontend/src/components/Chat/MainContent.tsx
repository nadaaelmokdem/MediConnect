import React, { useState, useRef, useEffect } from "react";
import { FiPaperclip, FiSend, FiUser } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import type Message from "../../types/Message";
import { toast } from "react-toastify";
import api from "../../services/api";

import { getTextDirection } from "../../utils/textUtils";

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-[3px] h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#474553] animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
        />
      ))}
    </span>
  );
}

export function MessageBubble({ msg, isMe }: { msg: Message; isMe: boolean }) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const isTyping = msg.text === "...";
  
  const mediaRegex = /((?:(?:\/api\/files\/|\/chats\/)|https?:\/\/)[^\n]+?\.(?:jpg|jpeg|png|webp|heic|heif|mp4|mov|avi|webm|wmv|mpeg|mpg|flv|3gpp|pdf))/i;
  const match = msg.text.match(mediaRegex);
  let textContent = msg.text;
  let mediaUrl = null;
  if (match) {
    mediaUrl = match[1].trim();
    if (mediaUrl.startsWith('/api/')) {
       const baseUrl = api.defaults.baseURL?.replace(/\/api\/?$/, '') || '';
       mediaUrl = `${baseUrl}${mediaUrl}`;
    }
    textContent = msg.text.replace(match[1], '').trim();
  }
  
  const textDir = getTextDirection(textContent);

  return (
    <div
      className={`flex gap-[12px] sm:gap-[16px] ${isMe ? "max-w-[95%] sm:max-w-[85%] self-end flex-row-reverse" : "max-w-[95%] sm:max-w-[85%]"}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-[4px] ${isMe ? "bg-[#e5deff] text-[#474553]" : "bg-[#6a5acd] text-[#f0ebff]"}`}
      >
        {isMe ? (
          <FiUser className="text-[18px]" />
        ) : (
          <HiSparkles className="text-[18px]" />
        )}
      </div>
      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl p-3 sm:p-[16px] shadow-[0px_4px_20px_rgba(42,36,85,0.05)] ${isMe ? "bg-[#5140b3] text-[#ffffff] rounded-tr-sm" : "bg-[#ffffff] border border-[#e5deff] text-[#1a1345] rounded-tl-sm"}`}
        >
          {isTyping && !isMe ? (
            <TypingDots />
          ) : (
            <div className="flex flex-col gap-3">
              {textContent && (
                <p
                  dir={textDir}
                  className={`text-[14px] sm:text-[16px] leading-[1.5] sm:leading-[1.6] font-normal whitespace-pre-wrap ${isMe ? "" : "text-[#1a1345]"}`}
                >
                  {textContent}
                </p>
              )}
              {mediaUrl && (
                ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'].includes(mediaUrl.split('.').pop()?.split('?')[0].toLowerCase() || '') ? (
                  <>
                    <div className="relative group cursor-pointer" onClick={() => setIsFullScreen(true)}>
                      <img src={mediaUrl} alt="attachment" className="max-w-full sm:max-w-[300px] h-auto rounded-lg shadow-sm border border-[#e5deff]" />
                    </div>
                    {isFullScreen && (
                      <div 
                        className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFullScreen(false);
                        }}
                      >
                        <img 
                          src={mediaUrl} 
                          alt="attachment full" 
                          className="max-w-full max-h-full object-contain cursor-default rounded-md shadow-2xl" 
                          onClick={(e) => e.stopPropagation()} 
                        />
                        <button 
                          className="absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFullScreen(false);
                          }}
                        >
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    )}
                  </>
                ) : ['mp4', 'mov', 'avi', 'webm', 'mkv', 'wmv', 'mpeg', 'mpg', 'flv', '3gpp'].includes(mediaUrl.split('.').pop()?.split('?')[0].toLowerCase() || '') ? (
                  <video src={mediaUrl} controls className="max-w-full sm:max-w-[300px] rounded-lg shadow-sm" />
                ) : (
                  <a href={mediaUrl} target="_blank" rel="noreferrer" className="underline font-semibold break-all flex items-center gap-2">
                    <FiPaperclip /> View Attached Document
                  </a>
                )
              )}
            </div>
          )}
        </div>
        <span className="text-[10px] sm:text-[12px] leading-[1] font-medium text-[#787584] mt-[4px] px-1">
          {msg.timestamp}
        </span>
      </div>
    </div>
  );
}

export function ChatInput({
  onSendMessage,
  isLoading,
  disabled = false,
  acceptedFileTypes,
  onFileUpload,
}: {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  acceptedFileTypes?: string;
  onFileUpload?: (file: File, onProgress: (p: number) => void) => Promise<string>;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textDir = getTextDirection(text);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 128)}px`;
      ta.style.overflowY = ta.scrollHeight > 128 ? "auto" : "hidden";
    }
  }, [text]);

  const handleSend = async () => {
    if ((!text.trim() && !selectedFile) || isLoading || isUploading) return;
    
    let messageText = text;
    
    if (selectedFile && onFileUpload) {
      setIsUploading(true);
      setUploadProgress(0);
      try {
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          currentProgress += Math.random() * 15;
          if (currentProgress > 90) currentProgress = 90;
          setUploadProgress(currentProgress);
        }, 200);
        
        const fileUrl = await onFileUpload(selectedFile, (p) => {
          if (p > currentProgress) currentProgress = p;
          setUploadProgress(currentProgress);
        });
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (text.trim()) {
           messageText = `${text}\n${fileUrl}`;
        } else {
           messageText = fileUrl;
        }
      } catch (err) {
        console.error("Upload error", err);
        toast.error("Failed to upload file");
        setIsUploading(false);
        setUploadProgress(0);
        return;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }

    onSendMessage(messageText);
    setText("");
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#ffffff] border-t border-[#e5deff] p-3 sm:p-[16px] shrink-0 shadow-[0px_-4px_20px_rgba(42,36,85,0.03)] z-10 pb-safe">
      <div className="max-w-4xl mx-auto flex flex-col gap-[4px]">
        {selectedFile && (
          <div className="flex flex-col gap-2 p-2 bg-[#f0ebff] rounded-lg mb-2 relative w-fit shadow-sm border border-[#e5deff]">
            <div className="flex items-center gap-2">
              {previewUrl ? (
                 <img src={previewUrl} alt="preview" className="h-12 w-12 object-cover rounded-md" />
              ) : (
                 <div className="h-12 w-12 bg-[#e5deff] text-[#5140b3] flex items-center justify-center rounded-md font-bold text-[10px] uppercase">
                   {selectedFile.name.split('.').pop()?.substring(0, 4)}
                 </div>
              )}
              <div className="flex flex-col max-w-[150px] pr-4">
                 <span className="text-xs font-bold text-[#1a1345] truncate">{selectedFile.name}</span>
                 <span className="text-[10px] font-medium text-[#787584]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
            
            {!isUploading && (
              <button 
                type="button" 
                onClick={() => { 
                  setSelectedFile(null); 
                  if (previewUrl) URL.revokeObjectURL(previewUrl); 
                  setPreviewUrl(null); 
                }} 
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {isUploading && (
              <div className="w-full bg-[#eae5ff] rounded-full h-1.5 overflow-hidden shrink-0 mt-1">
                <div className="bg-[#5140b3] h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>
        )}
        <div className="relative flex items-center gap-[8px] sm:gap-[12px] bg-[#f6f1ff] rounded-xl border border-[#e5deff] focus-within:border-[#5140b3] focus-within:ring-1 focus-within:ring-[#5140b3] transition-all p-[4px]">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={acceptedFileTypes}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (acceptedFileTypes && !acceptedFileTypes.split(',').some(type => {
                  const t = type.trim();
                  return t.startsWith('.') ? file.name.toLowerCase().endsWith(t.toLowerCase()) : file.type.match(new RegExp(t.replace('*', '.*')));
                })) {
                  toast.error("Unsupported file type.");
                  if (e.target) e.target.value = "";
                  return;
                }
                
                setSelectedFile(file);
                if (file.type.startsWith('image/')) {
                  setPreviewUrl(URL.createObjectURL(file));
                } else {
                  setPreviewUrl(null);
                }
              }
              if (e.target) {
                e.target.value = "";
              }
            }}
          />
          {onFileUpload ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer p-2 sm:p-[12px] text-[#474553] hover:text-[#5140b3] transition-colors shrink-0 rounded-lg hover:bg-[#eae5ff]"
            >
              <FiPaperclip className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer p-2 sm:p-[12px] text-[#474553] hover:text-[#5140b3] transition-colors shrink-0 rounded-lg hover:bg-[#eae5ff]"
            >
              <FiPaperclip className="h-5 w-5" />
            </button>
          )}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Chat is disabled..." : "Type your message..."}
            rows={1}
            disabled={disabled}
            dir={textDir}
            className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none max-h-32 min-h-[44px] py-[10px] sm:py-[12px] px-[4px] text-[14px] sm:text-[16px] leading-[1.5] sm:leading-[1.6] font-normal text-[#1a1345] placeholder-[#474553]/50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={(!text.trim() && !selectedFile) || isLoading || disabled || isUploading}
            className="cursor-pointer p-2 sm:p-[12px] mb-0.5 sm:mb-0 bg-[#5140b3] text-[#ffffff] hover:bg-[#5d4cbf] transition-colors shrink-0 rounded-lg shadow-[0px_4px_20px_rgba(42,36,85,0.05)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px]"
          >
            {isLoading || isUploading ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FiSend className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

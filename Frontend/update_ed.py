import re

path = r'c:\My Files\Tabibi\Frontend\src\components\Profile\EditableDetail.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
if 'MdAssignment' not in content:
    content = content.replace('import { FiCheck, FiX } from "react-icons/fi";', 'import { FiCheck, FiX } from "react-icons/fi";\nimport { MdAssignment } from "react-icons/md";\nimport { CachedImage } from "../common/CachedImage";\nimport { getFileUrl } from "../../utils/fileUtils";')

# Add isPdfUrl
if 'isPdfUrl' not in content:
    isPdfUrl = """
const isPdfUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  return trimmed.endsWith(".pdf") || trimmed.includes(".pdf?");
};
"""
    content = content.replace('const isImageUrl', isPdfUrl + '\nconst isImageUrl')

# Add validation
handleFileUpload_new = """  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fieldName) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Only images and PDFs are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {"""
content = content.replace("""  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fieldName) return;

    try {""", handleFileUpload_new)

# Modify preview JSX
preview_old = """                    {isImageUrl(localValue) && (
                      <img
                        src={localValue}
                        alt="Preview"
                        className="w-8 h-8 object-cover rounded border border-[#E6E1FF] cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                        title="Click to preview"
                      />
                    )}
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />"""
                    
preview_new = """                    {isImageUrl(localValue) && (
                      <CachedImage
                        src={localValue!}
                        alt="Preview"
                        className="w-8 h-8 object-cover rounded border border-[#E6E1FF] cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                        title="Click to preview"
                      />
                    )}
                    {isPdfUrl(localValue) && (
                      <a href={getFileUrl(localValue!)} target="_blank" rel="noreferrer" title="View PDF">
                        <div className="w-8 h-8 flex items-center justify-center bg-[#f0ebff] rounded border border-[#E6E1FF] text-[#5140b3] cursor-pointer hover:bg-[#e5deff]">
                          <MdAssignment size={18} />
                        </div>
                      </a>
                    )}
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />"""
                    
content = content.replace(preview_old, preview_new)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")

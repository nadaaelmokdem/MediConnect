const fs = require('fs');
const path = 'c:\\My Files\\Tabibi\\Frontend\\src\\pages\\DoctorAdditionalData.tsx';
let content = fs.readFileSync(path, 'utf8');

const helpers = 
  const handleProofChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    errorKey: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, [errorKey]: "Only images and PDFs are allowed." }));
        setFile(null);
        e.target.value = '';
        return;
      }
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
      setFile(file);
    } else {
      setFile(null);
    }
  };

  const renderProofPreview = (file: File | null, url: string) => {
    if (file) {
      if (file.type.startsWith("image/")) {
        return <img src={URL.createObjectURL(file)} alt="Preview" className="h-16 w-16 object-cover rounded mt-2 border border-[#e5deff]" />;
      }
      if (file.type === "application/pdf") {
        return <div className="mt-2 flex items-center gap-2 text-[#5140b3] font-medium"><MdAssignment className="text-xl" /> <span>{file.name}</span></div>;
      }
    }
    if (url) {
      if (url.toLowerCase().endsWith(".pdf") || url.includes(".pdf?")) {
        return <div className="mt-2 text-[12px]">Current proof: <a href={getFileUrl(url)} target="_blank" rel="noreferrer" className="text-[#5140b3] font-medium underline flex items-center gap-1"><MdAssignment/> View PDF</a></div>;
      }
      return <div className="mt-2 text-[12px] flex items-center gap-2">Current proof: <a href={getFileUrl(url)} target="_blank" rel="noreferrer" className="text-[#5140b3] font-medium underline"><CachedImage src={url} alt="Current Preview" className="h-16 w-16 object-cover rounded border border-[#e5deff]" /></a></div>;
    }
    return null;
  };
;

content = content.replace('  const validateForm = () => {', helpers + '\n  const validateForm = () => {');

if (!content.includes('CachedImage')) {
  content = content.replace('import { getFileUrl } from "../utils/fileUtils";', 'import { getFileUrl } from "../utils/fileUtils";\\nimport { CachedImage } from "../components/common/CachedImage";');
}

content = content.replace(
  /\{licenseProofUrl && \([\\s\\S]*?View Document<\\/a>\\s*<\\/div>\\s*\\)\\}/,
  '{renderProofPreview(licenseProofFile, licenseProofUrl)}'
);

content = content.replace(
  /onChange=\\{\\(e\\) =>\\s*setLicenseProofFile\\(e\\.target\\.files\\?\\.\\[0\\] \\|\\| null\\)\\s*\\}/,
  'onChange={(e) => handleProofChange(e, setLicenseProofFile, "licenseProof")}'
);

content = content.replace(
  /\{idProofUrl && \([\\s\\S]*?View Document<\\/a>\\s*<\\/div>\\s*\\)\\}/,
  '{renderProofPreview(idProofFile, idProofUrl)}'
);

content = content.replace(
  /onChange=\\{\\(e\\) =>\\s*setIdProofFile\\(e\\.target\\.files\\?\\.\\[0\\] \\|\\| null\\)\\s*\\}/,
  'onChange={(e) => handleProofChange(e, setIdProofFile, "idProof")}'
);

content = content.replace(
  /\{degreeProofUrl && \([\\s\\S]*?View Document<\\/a>\\s*<\\/div>\\s*\\)\\}/,
  '{renderProofPreview(degreeProofFile, degreeProofUrl)}'
);

content = content.replace(
  /onChange=\\{\\(e\\) =>\\s*setDegreeProofFile\\(e\\.target\\.files\\?\\.\\[0\\] \\|\\| null\\)\\s*\\}/,
  'onChange={(e) => handleProofChange(e, setDegreeProofFile, "degreeProof")}'
);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated DoctorAdditionalData.tsx");

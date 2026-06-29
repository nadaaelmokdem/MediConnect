import { MdMedicalServices } from "react-icons/md";

/**
 * Simple site footer with branding and copyright.
 */
export default function Footer() {
  return (
    <footer className="bg-background border-t border-surface-variant">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <MdMedicalServices className="text-primary text-3xl" />
          <h2 className="text-xl font-heading font-bold text-primary tracking-tight">
            Tabibi
          </h2>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

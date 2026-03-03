"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import FileUploadZone from "@/components/FileUploadZone";
import { useBrief } from "@/components/BriefContext";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setDocument } = useBrief();
  const router = useRouter();

  const handleContinue = async () => {
    if (!file) return;

    setIsExtracting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Extraction failed");
        return;
      }

      setDocument({
        text: data.text,
        filename: data.filename,
        fileType: data.fileType,
        pageCount: data.pageCount,
      });

      router.push("/review");
    } catch {
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <StepLayout
      title="Upload RFP Document"
      subtitle="Upload the Request for Proposal or related bid document to begin analysis."
      backHref="/"
      nextLabel={isExtracting ? "Extracting..." : "Continue"}
      nextDisabled={!file || isExtracting}
      onNext={handleContinue}
    >
      <FileUploadZone selectedFile={file} onFileSelect={(f) => { setFile(f); setError(null); }} />

      {isExtracting && (
        <div className="mt-6 flex items-center gap-3 rounded-md border border-brand-light bg-brand-light p-4">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          <p className="text-sm font-medium text-brand">
            Extracting text from {file?.name}...
          </p>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}
    </StepLayout>
  );
}

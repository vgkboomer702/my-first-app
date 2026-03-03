"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import FileUploadZone from "@/components/FileUploadZone";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  return (
    <StepLayout
      title="Upload RFP Document"
      subtitle="Upload the Request for Proposal or related bid document to begin analysis."
      backHref="/"
      nextLabel="Continue"
      nextHref="/review"
      nextDisabled={!file}
    >
      <FileUploadZone selectedFile={file} onFileSelect={setFile} />
    </StepLayout>
  );
}

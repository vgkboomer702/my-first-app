"use client";

import { useState, useCallback } from "react";

const ACCEPTED_TYPES = [
  { ext: "PDF", mime: "application/pdf" },
  { ext: "DOCX", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  { ext: "XLSX", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { ext: "PPTX", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
];

const ACCEPT_STRING = ACCEPTED_TYPES.map((t) => t.mime).join(",");

interface FileUploadZoneProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

export default function FileUploadZone({ onFileSelect, selectedFile }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const isAccepted = ACCEPTED_TYPES.some((t) => t.mime === file.type);
      if (isAccepted) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
          isDragging
            ? "border-brand bg-brand-light"
            : selectedFile
              ? "border-teal bg-teal-light"
              : "border-border bg-subtle"
        }`}
      >
        {selectedFile ? (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-teal">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-body">{selectedFile.name}</p>
            <p className="mt-1 text-xs text-muted">{formatSize(selectedFile.size)}</p>
            <button
              onClick={() => onFileSelect(null)}
              className="mt-3 text-xs font-medium text-brand hover:underline"
            >
              Remove and choose another file
            </button>
          </>
        ) : (
          <>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-light">
              <svg className="h-6 w-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-body">
              Drag & drop your file here
            </p>
            <p className="mt-1 text-xs text-muted">or click to browse</p>
            <label className="mt-4 cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark">
              Browse Files
              <input
                type="file"
                accept={ACCEPT_STRING}
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {ACCEPTED_TYPES.map((t) => (
          <span
            key={t.ext}
            className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-muted"
          >
            {t.ext}
          </span>
        ))}
      </div>
    </div>
  );
}

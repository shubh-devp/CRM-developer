"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CsvUploaderProps {
  onFileSelect: (_file: File) => void;
  isParsing: boolean;
  error: string | null;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function CsvUploader({ onFileSelect, isParsing, error }: CsvUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      if (selectedFile.size > MAX_FILE_SIZE) {
        return;
      }

      onFileSelect(selectedFile);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isParsing,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200",
          "hover:border-primary/50 hover:bg-primary/5",
          isDragActive && "border-primary bg-primary/10",
          isDragReject && "border-destructive bg-destructive/10",
          isParsing && "pointer-events-none opacity-50",
          error && "border-destructive"
        )}
      >
        <input {...getInputProps()} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-2xl",
              isDragActive ? "bg-primary/20" : "bg-muted"
            )}
          >
            {isDragActive ? (
              <FileText className="h-8 w-8 text-primary" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-lg font-medium">
              {isDragActive
                ? "Drop your CSV here"
                : "Drag & drop your CSV file"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse &middot; .csv only &middot; max 10MB
            </p>
          </div>
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {isParsing && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Parsing CSV...</span>
        </div>
      )}
    </div>
  );
}

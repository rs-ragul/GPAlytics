"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileImage, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
  progress?: number;
  status?: "idle" | "processing" | "success" | "error";
}

export function UploadZone({ 
  onFileSelect, 
  isProcessing = false,
  progress = 0,
  status = "idle"
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {selectedFile && status !== "idle" ? (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "relative p-6 rounded-2xl border-2 transition-all",
              status === "processing" && "border-primary/50 bg-primary/5",
              status === "success" && "border-success/50 bg-success/5",
              status === "error" && "border-error/50 bg-error/5"
            )}
          >
            <div className="flex items-center gap-4">
              {status === "processing" && (
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              )}
              {status === "success" && (
                <CheckCircle className="w-12 h-12 text-success" />
              )}
              {status === "error" && (
                <AlertCircle className="w-12 h-12 text-error" />
              )}
              
              <div className="flex-1">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {status === "processing" && `Processing... ${Math.round(progress)}%`}
                  {status === "success" && "Scan completed successfully!"}
                  {status === "error" && "Failed to process image"}
                </p>
                
                {status === "processing" && (
                  <div className="mt-2 h-2 bg-primary/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
              
              <button
                onClick={clearFile}
                className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <label
              htmlFor="file-upload"
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-64 cursor-pointer",
                "rounded-2xl border-2 border-dashed transition-all",
                isDragging 
                  ? "border-primary bg-primary/10 scale-[1.02]" 
                  : "border-border hover:border-primary/50 hover:bg-white/5",
                isProcessing && "pointer-events-none opacity-50"
              )}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className={cn(
                  "w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-colors",
                  isDragging ? "bg-primary/20" : "bg-white/10"
                )}>
                  {isDragging ? (
                    <FileImage className="w-8 h-8 text-primary" />
                  ) : (
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <p className="mb-2 text-lg text-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG or JPEG (max. 10MB)
                </p>
              </div>
              
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileInput}
                disabled={isProcessing}
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


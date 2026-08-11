import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  acceptedFormats?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isLoading = false,
  acceptedFormats = ['.csv', '.xlsx', '.xls'],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(extension)) {
      setError(`Invalid file type. Please upload ${acceptedFormats.join(', ')} files.`);
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const clearSelection = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8 transition-all duration-300',
          'flex flex-col items-center justify-center gap-4',
          isDragging
            ? 'border-accent bg-accent/10 scale-[1.02]'
            : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50',
          isLoading && 'opacity-50 pointer-events-none'
        )}
      >
        {selectedFile ? (
          <div className="flex items-center gap-4 animate-scale-in">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/20">
              <FileSpreadsheet className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            {!isLoading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearSelection}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            {isLoading && (
              <div className="flex items-center gap-2 text-accent">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 animate-pulse-slow">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                Drop your file here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Supports CSV, Excel (xlsx, xls) • Max 10MB</span>
            </div>
            <input
              type="file"
              accept={acceptedFormats.join(',')}
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-3 text-sm text-destructive animate-fade-in">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && !isLoading && !error && (
        <div className="flex items-center gap-2 mt-3 text-sm text-accent animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>File ready for analysis</span>
        </div>
      )}
    </div>
  );
};

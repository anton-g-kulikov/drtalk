"use client";

import type { ChangeEvent } from 'react';
import { FileText, Upload, X } from 'lucide-react';

export type SendDocumentAttachedFile = {
  id: string;
  name: string;
  size: string;
  type: string;
};

type SendDocumentUploadSectionProps = {
  inputId: string;
  attachedFiles: SendDocumentAttachedFile[];
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (fileId: string) => void;
  onAttachMockScan: () => void;
};

export function SendDocumentUploadSection({
  inputId,
  attachedFiles,
  onFileSelect,
  onRemoveFile,
  onAttachMockScan,
}: SendDocumentUploadSectionProps) {
  return (
    <>
      {attachedFiles.length > 0 && (
        <div className="space-y-2 border-b border-black border-dashed pb-3">
          <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">
            Attached Files ({attachedFiles.length})
          </span>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {attachedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 border-2 border-black bg-zinc-50">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText size={12} className="shrink-0 text-black" />
                  <div className="truncate">
                    <p className="text-[10px] font-black uppercase truncate">{file.name}</p>
                    <p className="text-[8px] font-bold uppercase text-muted-foreground">
                      {file.size} • {file.type.toUpperCase()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(file.id)}
                  className="text-black hover:text-red-600 p-0.5 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative border-2 border-dashed border-black p-4 bg-gray-50 hover:bg-black/5 cursor-pointer transition-all text-center flex flex-col items-center justify-center gap-1.5 min-h-[120px]">
        <input
          type="file"
          id={inputId}
          className="hidden"
          onChange={onFileSelect}
        />

        <div
          onClick={() => document.getElementById(inputId)?.click()}
          className="absolute inset-0 z-0"
        />

        <Upload size={20} className="text-black z-10" />
        <span className="text-xs font-black uppercase tracking-wider text-black z-10">
          Attach Document
        </span>
        <span className="text-[8px] font-bold text-muted-foreground uppercase z-10">
          Click to browse files or drag and drop here
        </span>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onAttachMockScan();
          }}
          className="relative z-10 mt-1 px-4 py-1.5 bg-black text-white hover:bg-gray-800 text-[8px] uppercase font-black tracking-widest border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-[1px]"
        >
          Quick attach mock scan
        </button>
      </div>
    </>
  );
}

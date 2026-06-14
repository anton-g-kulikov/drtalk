"use client";

import { Mail, Paperclip, Send, Smile } from 'lucide-react';
import type { Channel } from '@/prototype/channelTypes';
import {
  AttachedDocumentPreview,
  ChannelAttachmentDrawer,
  type AttachmentOption,
} from '@/components/prototype/ChannelAttachmentControls';

type ChannelMessageComposerProps = {
  activeChannel: Channel;
  inputText: string;
  attachedDocument: AttachmentOption | null;
  showAttachmentDrawer: boolean;
  attachmentOptions: AttachmentOption[];
  onInputChange: (value: string) => void;
  onToggleAttachmentDrawer: () => void;
  onAttachNew: () => void;
  onAttachRecent: (file: AttachmentOption) => void;
  onCloseAttachmentDrawer: () => void;
  onRemoveAttachment: () => void;
  onSendMessage: () => void;
};

export function ChannelMessageComposer({
  activeChannel,
  inputText,
  attachedDocument,
  showAttachmentDrawer,
  attachmentOptions,
  onInputChange,
  onToggleAttachmentDrawer,
  onAttachNew,
  onAttachRecent,
  onCloseAttachmentDrawer,
  onRemoveAttachment,
  onSendMessage,
}: ChannelMessageComposerProps) {
  const canSend = inputText.trim().length > 0 || attachedDocument !== null;

  return (
    <div className="p-4 sm:p-6 bg-white border-t-2 border-black relative shrink-0">
      <div className="max-w-4xl mx-auto w-full relative">
        {showAttachmentDrawer && (
          <ChannelAttachmentDrawer
            attachments={attachmentOptions}
            onAttachNew={onAttachNew}
            onAttachRecent={onAttachRecent}
            onClose={onCloseAttachmentDrawer}
          />
        )}

        <div className="wireframe-card p-4 space-y-4">
          {activeChannel.isExternal && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/10 border border-black/30 text-black text-[9px] font-black uppercase">
              <Mail size={12} className="text-black shrink-0" />
              <span>Counterpart is not on drTalk. Messages and files will be delivered via Secure Email.</span>
            </div>
          )}

          {attachedDocument && (
            <AttachedDocumentPreview
              document={attachedDocument}
              onRemove={onRemoveAttachment}
            />
          )}

          <textarea
            placeholder={`MESSAGE #${activeChannel.name}...`}
            value={inputText}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                onSendMessage();
              }
            }}
            className="w-full bg-transparent border-none focus:ring-0 text-xs resize-none h-12 outline-none text-black"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-black border-dashed">
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
              <button
                onClick={onToggleAttachmentDrawer}
                className={`hover:text-black transition-colors p-1 ${showAttachmentDrawer ? 'bg-black text-white' : ''}`}
                title="Attach Document"
              >
                <Paperclip size={18} />
              </button>
              <button className="hover:text-black transition-colors">
                <Smile size={18} />
              </button>

              {activeChannel.type === 'patient' ? (
                <>
                  <div className="h-4 w-[1px] bg-black/20 mx-1" />
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] font-black uppercase text-black">Delivery Method:</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer group">
                        <input type="radio" name="transport" defaultChecked className="hidden peer" />
                        <div className="w-3 h-3 border border-black flex items-center justify-center peer-checked:bg-black transition-all">
                          <div className="w-1 h-1 bg-white" />
                        </div>
                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">
                          <span className="text-[8px] font-black uppercase">Both (Email + SMS)</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer group">
                        <input type="radio" name="transport" className="hidden peer" />
                        <div className="w-3 h-3 border border-black flex items-center justify-center peer-checked:bg-black transition-all">
                          <div className="w-1 h-1 bg-white" />
                        </div>
                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 peer-checked:opacity-100">
                          <span className="text-[8px] font-black uppercase">SMS</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onSendMessage}
                disabled={!canSend}
                className="wireframe-button bg-black text-white text-[10px] uppercase font-bold px-6 py-2.5 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white hover:bg-white hover:text-black transition-colors"
              >
                Send Message <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

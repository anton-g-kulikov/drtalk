"use client";

import { Download, Mail, Paperclip, Send } from 'lucide-react';
import type { UnifiedReferral } from '@/lib/referrals';
import type { MessageItem } from '@/prototype/channelTypes';

type ExternalViewerChatPanelProps = {
  referral: UnifiedReferral;
  messages: MessageItem[];
  inputText: string;
  attachedReport: string | null;
  onInputTextChange: (value: string) => void;
  onAttachReport: (value: string | null) => void;
  onSendReply: () => void;
  onToast: (message: string) => void;
};

export function ExternalViewerChatPanel({
  referral,
  messages,
  inputText,
  attachedReport,
  onInputTextChange,
  onAttachReport,
  onSendReply,
  onToast,
}: ExternalViewerChatPanelProps) {
  return (
    <div className="wireframe-card bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex-1 flex flex-col max-h-[600px]">
      <div className="p-4 border-b-2 border-black bg-black text-white flex items-center gap-2">
        <Mail size={16} className="text-white" />
        <div>
          <h3 className="text-xs font-black uppercase">Secure Case Discussion</h3>
          <p className="text-[7px] text-zinc-400 uppercase font-bold mt-0.5">Replies delivered via Secure Email to sender</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 min-h-[300px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col max-w-[85%] ${
              message.user === referral.specialist ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <span className="text-[8px] font-black uppercase text-gray-400 mb-1">
              {message.user}
            </span>

            <div className={`p-3 border-2 border-black text-xs font-medium leading-relaxed ${
              message.user === referral.specialist
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)]'
                : 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05)]'
            }`}>
              {message.text.split('\n').map((line, index) => (
                <p key={`${message.id}-${index}`}>{line}</p>
              ))}

              {message.document && (
                <div className={`mt-2 p-2 border flex items-center justify-between gap-4 text-[9px] font-black uppercase ${
                  message.user === referral.specialist ? 'border-white/20 bg-white/5' : 'border-black/10 bg-zinc-50'
                }`}>
                  <span className="truncate">{message.document.name}</span>
                  <button
                    onClick={() => onToast(`Downloading secure file: ${message.document?.name}`)}
                    className="shrink-0 hover:underline flex items-center gap-1"
                  >
                    <Download size={10} />
                  </button>
                </div>
              )}
            </div>
            <span className="text-[7px] font-bold text-gray-400 mt-1 uppercase flex items-center gap-1">
              {message.time} • Sent via {message.transport || 'Email'}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t-2 border-black bg-white space-y-3">
        {attachedReport && (
          <div className="flex items-center justify-between p-1.5 bg-zinc-100 border border-black text-[8px] font-black uppercase animate-fade-in">
            <span>Attached: {attachedReport}</span>
            <button onClick={() => onAttachReport(null)} className="hover:text-red-500 font-black px-1 text-[10px]">×</button>
          </div>
        )}

        <textarea
          placeholder="Compose secure reply back to referring practice..."
          value={inputText}
          onChange={(event) => onInputTextChange(event.target.value)}
          className="w-full text-xs border border-black p-2 bg-white text-black outline-none focus:ring-0 resize-none h-16 font-bold"
        />

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => onAttachReport('POST_OP_IMAGING_REPLY.PNG')}
            className="p-2 border border-black hover:bg-zinc-50 flex items-center justify-center"
            title="Attach Scan"
          >
            <Paperclip size={12} className="text-black" />
          </button>

          <button
            onClick={onSendReply}
            disabled={!inputText.trim() && !attachedReport}
            className="wireframe-button bg-black text-white hover:bg-zinc-800 disabled:opacity-50 text-[10px] font-black uppercase px-6 py-2 flex items-center gap-1.5"
          >
            Send Reply <Send size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

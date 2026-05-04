"use client";

import React, { useState } from 'react';
import { useComments } from './CommentContext';

export function CommentPanel() {
  const { activeMarker, comments, addComment, isPanelOpen, setIsPanelOpen, isLoading } = useComments();
  const [newComment, setNewComment] = useState("");

  if (!isPanelOpen || !activeMarker) return null;

  const markerComments = comments[activeMarker.id] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(activeMarker.id, newComment);
      setNewComment("");
    }
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40 transition-opacity"
        onClick={() => setIsPanelOpen(false)}
      />
      
      {/* Side Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white border-l-4 border-black z-50 shadow-[-8px_0px_0px_0px_rgba(0,0,0,0.1)] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b-2 border-black flex justify-between items-start">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">
              {activeMarker.title}
            </h2>
            <p className="text-[10px] font-bold uppercase text-muted-foreground mt-2 tracking-widest">
              Reviewer Notes
            </p>
          </div>
          <button 
            onClick={() => setIsPanelOpen(false)}
            className="wireframe-button text-xs py-1 px-2"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div className="wireframe-card bg-muted/30 border-dashed">
            <p className="text-sm font-medium italic">
              &quot;{activeMarker.description}&quot;
            </p>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest border-b border-black pb-1">
              Feedback ({markerComments.length})
            </h3>
            
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest">Loading Feedback...</p>
              </div>
            ) : markerComments.length === 0 ? (
              <p className="text-xs italic text-muted-foreground py-4">
                No comments yet. Be the first to leave feedback!
              </p>
            ) : (
              markerComments.map((comment) => (
                <div key={comment.id} className="wireframe-card p-3 space-y-2 animate-slide-in">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase italic">{comment.author}</span>
                    <span className="text-[8px] text-muted-foreground uppercase">
                      {new Date(comment.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer / Input */}
        <div className="p-6 border-t-2 border-black bg-white">
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your feedback here..."
              className="wireframe-input text-xs h-24 resize-none focus:outline-none focus:ring-2 focus:ring-black/5"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="wireframe-button w-full bg-black text-white uppercase text-xs tracking-widest py-3 disabled:opacity-50"
            >
              Post Comment
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

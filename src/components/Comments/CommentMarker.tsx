"use client";

import React from 'react';
import { useComments, MarkerData } from './CommentContext';

interface CommentMarkerProps extends MarkerData {
  className?: string;
}

export function CommentMarker({ id, title, description, className = "" }: CommentMarkerProps) {
  const { setActiveMarker, activeMarker } = useComments();
  
  const isActive = activeMarker?.id === id;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setActiveMarker({ id, title, description });
      }}
      className={`
        inline-flex items-center justify-center w-6 h-6 rounded-full 
        border-2 border-black font-black text-[10px] italic
        transition-all transform hover:scale-110 active:scale-95
        ${isActive ? 'bg-black text-white scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]' : 'bg-white text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]'}
        ${className}
      `}
      title={`Comment on ${title}`}
    >
      i
    </button>
  );
}

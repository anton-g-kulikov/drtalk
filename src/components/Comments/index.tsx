"use client";

import React from 'react';
import { CommentProvider } from './CommentContext';
import { CommentPanel } from './CommentPanel';

export function CommentSystem({ children }: { children: React.ReactNode }) {
  return (
    <CommentProvider>
      {children}
      <CommentPanel />
    </CommentProvider>
  );
}

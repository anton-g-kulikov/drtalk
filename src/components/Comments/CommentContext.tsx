"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type Comment = {
  id: string;
  text: string;
  author: string;
  timestamp: number;
  marker_id: string;
};

export type MarkerData = {
  id: string;
  title: string;
  description: string;
};

type CommentContextType = {
  activeMarker: MarkerData | null;
  setActiveMarker: (marker: MarkerData | null) => void;
  comments: Record<string, Comment[]>;
  addComment: (markerId: string, text: string) => void;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  isLoading: boolean;
};

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [activeMarker, setActiveMarker] = useState<MarkerData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load from Supabase
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching comments:", error);
      } else if (data) {
        // Group comments by marker_id
        const grouped: Record<string, Comment[]> = {};
        
        data.forEach((curr: any) => {
          const mId = curr.marker_id || curr.markerId;
          if (!mId) return;
          
          if (!grouped[mId]) grouped[mId] = [];
          
          grouped[mId].push({
            id: curr.id,
            text: curr.text,
            author: curr.author || 'Viewer',
            timestamp: new Date(curr.created_at || curr.timestamp || Date.now()).getTime(),
            marker_id: mId
          });
        });
        
        setComments(grouped);
      }
      setIsLoading(false);
    };

    fetchComments();

    // Set up real-time subscription
    const channel = supabase
      .channel('comments-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments' },
        (payload) => {
          const newComment = payload.new as any;
          const mId = newComment.marker_id || newComment.markerId;
          
          if (!mId) return;

          setComments(prev => {
            const currentMarkerComments = prev[mId] || [];
            if (currentMarkerComments.some(c => c.id === newComment.id)) return prev;

            return {
              ...prev,
              [mId]: [
                ...currentMarkerComments,
                {
                  id: newComment.id,
                  text: newComment.text,
                  author: newComment.author || 'Viewer',
                  timestamp: new Date(newComment.created_at || Date.now()).getTime(),
                  marker_id: mId
                }
              ]
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addComment = async (markerId: string, text: string) => {
    // Optimistic update
    const tempId = Math.random().toString(36).substr(2, 9);
    const optimisticComment: Comment = {
      id: tempId,
      text,
      author: 'You (sending...)',
      timestamp: Date.now(),
      marker_id: markerId
    };

    setComments(prev => ({
      ...prev,
      [markerId]: [...(prev[markerId] || []), optimisticComment]
    }));

    const { error } = await supabase
      .from('comments')
      .insert([
        { marker_id: markerId, text: text, author: 'Viewer' }
      ]);

    if (error) {
      console.error("Error adding comment:", error);
      setComments(prev => ({
        ...prev,
        [markerId]: (prev[markerId] || []).filter(c => c.id !== tempId)
      }));
    }
  };

  const handleSetMarker = (marker: MarkerData | null) => {
    setActiveMarker(marker);
    if (marker) setIsPanelOpen(true);
  };

  return (
    <CommentContext.Provider value={{ 
      activeMarker, 
      setActiveMarker: handleSetMarker, 
      comments, 
      addComment,
      isPanelOpen,
      setIsPanelOpen,
      isLoading
    }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (!context) throw new Error("useComments must be used within CommentProvider");
  return context;
}

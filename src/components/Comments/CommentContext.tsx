"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const generateId = () => Math.random().toString(36).substr(2, 9);

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
  resolvedCommentIds: string[];
  toggleResolveComment: (commentId: string) => void;
};

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [activeMarker, setActiveMarker] = useState<MarkerData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedCommentIds, setResolvedCommentIds] = useState<string[]>([]);

  // Load resolved comment IDs on mount is no longer needed from localStorage,
  // we will load it directly from Supabase comments.resolved column.

  const toggleResolveComment = async (commentId: string) => {
    const isCurrentlyResolved = resolvedCommentIds.includes(commentId);
    
    // Optimistic local state update
    setResolvedCommentIds(prev => 
      isCurrentlyResolved 
        ? prev.filter(id => id !== commentId) 
        : [...prev, commentId]
    );

    const { error } = await supabase
      .from('comments')
      .update({ resolved: !isCurrentlyResolved })
      .eq('id', commentId);

    if (error) {
      console.error("Error toggling resolve status on Supabase:", error);
      // Revert local state on error
      setResolvedCommentIds(prev => 
        isCurrentlyResolved 
          ? [...prev, commentId] 
          : prev.filter(id => id !== commentId)
      );
    }
  };

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
        // Group comments by marker_id and collect resolved comment IDs
        const grouped: Record<string, Comment[]> = {};
        const resolvedIds: string[] = [];
        
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

          if (curr.resolved) {
            resolvedIds.push(curr.id);
          }
        });
        
        setComments(grouped);
        setResolvedCommentIds(resolvedIds);
      }
      setIsLoading(false);
    };

    fetchComments();

    // Set up real-time subscription for INSERT and UPDATE
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

          if (newComment.resolved) {
            setResolvedCommentIds(prev => 
              prev.includes(newComment.id) ? prev : [...prev, newComment.id]
            );
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'comments' },
        (payload) => {
          const updatedComment = payload.new as any;
          if (updatedComment.resolved) {
            setResolvedCommentIds(prev => 
              prev.includes(updatedComment.id) ? prev : [...prev, updatedComment.id]
            );
          } else {
            setResolvedCommentIds(prev => 
              prev.filter(id => id !== updatedComment.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addComment = async (markerId: string, text: string) => {
    // Optimistic update
    const tempId = generateId();
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
      isLoading,
      resolvedCommentIds,
      toggleResolveComment
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

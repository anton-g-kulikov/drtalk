import React from 'react';
import { Sidebar, Header } from './Navigation';

export const MainLayout = ({ children, title, noPadding = false }: { children: React.ReactNode, title?: string, noPadding?: boolean }) => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="animate-fade-in flex-1 flex flex-col overflow-y-auto">
            {noPadding ? (
              children
            ) : (
              <div className="p-10 bg-gray-50 min-h-full">
                {children}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

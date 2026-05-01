import React from 'react';
import { Sidebar, Header } from './Navigation';

export const MainLayout = ({ children, title, noPadding = false }: { children: React.ReactNode, title?: string, noPadding?: boolean }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="animate-fade-in flex-1 flex flex-col overflow-y-auto">
            {noPadding ? (
              children
            ) : (
              <div className="p-4 sm:p-6 md:p-10 bg-gray-50 min-h-full">
                {children}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

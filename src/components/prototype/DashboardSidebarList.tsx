import type { ReactNode } from 'react';

export type DashboardSidebarItem = {
  id: string | number;
  name: string;
  message: string;
  meta: string;
  initials?: string;
  timestamp?: string;
  parentChannel?: string;
  unreadCount?: number;
  actionLabel?: string;
  onClick?: () => void;
  onAction?: () => void;
  onDismiss?: () => void;
};

type DashboardSidebarListProps = {
  title: string;
  icon?: ReactNode;
  items: DashboardSidebarItem[];
};

export function DashboardSidebarList({
  title,
  icon,
  items,
}: DashboardSidebarListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-black pb-2">
        {icon}
        <h3 className="font-bold uppercase text-xs tracking-widest">{title}</h3>
      </div>

      <div className="wireframe-card p-0 divide-y-2 divide-black bg-white overflow-hidden">
        {items.map((item) => {
          if (item.actionLabel) {
            return (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-[10px] font-bold uppercase truncate">{item.name}</p>
                    <span className="text-[7px] font-bold px-1.5 py-0.5 border border-black uppercase text-muted-foreground shrink-0">{item.meta}</span>
                  </div>
                  <p className="text-[8px] uppercase text-muted-foreground">
                    {item.message}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={item.onAction}
                    className="wireframe-button text-[8px] font-black uppercase px-2.5 py-1 bg-black text-white hover:bg-zinc-800 transition-all"
                    aria-label={`${item.actionLabel} ${item.name}`}
                  >
                    {item.actionLabel}
                  </button>
                  {item.onDismiss && (
                    <button
                      onClick={item.onDismiss}
                      className="wireframe-button text-[8px] font-black uppercase px-2.5 py-1 bg-white text-black hover:bg-gray-100 border border-black transition-all"
                      aria-label={`Dismiss ${item.name}`}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="p-4 flex gap-3 hover:bg-gray-50 cursor-pointer transition-colors relative"
              onClick={item.onClick}
            >
              {item.initials && (
                <div className="w-8 h-8 border-2 border-black flex flex-col items-center justify-center bg-white font-bold text-[10px] shrink-0">{item.initials}</div>
              )}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    {item.parentChannel && (
                      <p className="text-[7px] font-bold uppercase text-gray-500 tracking-wider mb-0.5">
                        {item.parentChannel}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                      <p className="text-[9px] font-bold uppercase truncate">{item.name}</p>
                      <span className="text-[7px] font-bold px-1 py-0.25 border border-black uppercase text-black shrink-0 scale-90 origin-left">{item.meta}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {item.timestamp && (
                      <span className="text-[7px] text-muted-foreground uppercase shrink-0 whitespace-pre-line text-right leading-none">{item.timestamp}</span>
                    )}
                    {item.unreadCount ? (
                      <span className="bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center shrink-0">
                        {item.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
                <p className="text-[9px] uppercase truncate opacity-70 italic">
                  {item.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

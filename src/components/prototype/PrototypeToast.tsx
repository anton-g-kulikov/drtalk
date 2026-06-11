type PrototypeToastAction = {
  label: string;
  onClick: () => void;
};

type PrototypeToastProps = {
  message: string;
  action?: PrototypeToastAction | null;
  onDismiss?: () => void;
  placement?: 'bottom-right' | 'top-right';
};

export function PrototypeToast({
  message,
  action,
  onDismiss,
  placement = 'bottom-right',
}: PrototypeToastProps) {
  const isTop = placement === 'top-right';

  return (
    <div
      className={
        isTop
          ? 'fixed top-20 right-6 z-50 bg-black text-white border-2 border-white px-4 py-3 font-bold uppercase text-[9px] tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-fade-in flex items-center gap-3'
          : 'fixed bottom-4 right-4 z-50 bg-black text-white border-2 border-white p-4 max-w-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 duration-300 flex flex-col gap-2'
      }
    >
      <p className={isTop ? '' : 'text-[10px] font-black uppercase tracking-tight'}>{message}</p>
      <div className={isTop ? 'flex items-center gap-3' : 'flex gap-3 justify-end items-center'}>
        {action && (
          <button
            onClick={action.onClick}
            className={
              isTop
                ? 'bg-white text-black px-2 py-0.5 font-black uppercase text-[8px] hover:bg-zinc-200 transition-colors'
                : 'text-[9px] font-black uppercase bg-white text-black px-1.5 py-0.5 hover:bg-zinc-200 transition-all border border-white'
            }
          >
            {action.label}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={isTop ? 'text-[8px] font-black uppercase underline hover:text-zinc-300' : 'text-[9px] font-black uppercase underline hover:text-zinc-300'}
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

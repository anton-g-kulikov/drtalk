import type { LucideIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

export type DashboardTimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'last_year';

export type DashboardStat = {
  label: string;
  value: string;
  icon: LucideIcon;
  path: string;
};

type DashboardStatsProps = {
  timeRange: DashboardTimeRange;
  onTimeRangeChange: (range: DashboardTimeRange) => void;
  stats: DashboardStat[];
  onStatClick: (path: string) => void;
};

export function DashboardStats({
  timeRange,
  onTimeRangeChange,
  stats,
  onStatClick,
}: DashboardStatsProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-start items-center">
        <div className="relative">
          <select
            value={timeRange}
            onChange={(event) => onTimeRangeChange(event.target.value as DashboardTimeRange)}
            className="wireframe-input py-2 pl-4 pr-10 text-[10px] font-black uppercase appearance-none bg-white cursor-pointer hover:bg-gray-50 focus:outline-none h-10 border-2 border-black"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="last_year">Last Year</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown size={14} className="text-black" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            onClick={() => onStatClick(stat.path)}
            className="wireframe-card p-5 bg-white flex items-center gap-4 hover:bg-zinc-50 cursor-pointer transition-colors"
          >
            <stat.icon size={32} className="text-black shrink-0" />
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-muted-foreground">{stat.label}</p>
              <span className="text-3xl font-bold tracking-tighter block leading-none">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

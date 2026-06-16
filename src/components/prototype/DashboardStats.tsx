import type { LucideIcon } from 'lucide-react';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

export type DashboardTimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

export type DashboardStat = {
  label: string;
  value: string;
  icon: LucideIcon;
  path: string;
  trend?: number;
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
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 12 Months</option>
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
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold tracking-tighter block leading-none">{stat.value}</span>
                {stat.trend !== undefined && (
                  <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 ${stat.trend > 0 ? 'text-green-700 bg-green-50' : stat.trend < 0 ? 'text-red-700 bg-red-50' : 'text-gray-600 bg-gray-100'}`}>
                    {stat.trend > 0 ? <TrendingUp size={12} /> : stat.trend < 0 ? <TrendingDown size={12} /> : null}
                    {Math.abs(stat.trend)}%
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

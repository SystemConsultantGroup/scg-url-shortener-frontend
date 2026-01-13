'use client';

import { useMemo } from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger, 
} from "@radix-ui/react-tooltip";

interface HeatmapChartProps {
  data: { date: string; count: number }[];
}

export default function HeatmapChart({ data }: HeatmapChartProps) {
  // Process data to fill missing dates if necessary, though mock data is complete.
  // We assume data is sorted chronologically or we will sort it.
  
  const processedData = useMemo(() => {
    // Ensure we have exactly 365 days (or close to 52 weeks)
    // For a year view, we usually want 52 weeks * 7 days.
    return data; 
  }, [data]);

  // Determine weeks
  const weeks = useMemo(() => {
    const weeksArray: { date: string; count: number; level: number }[][] = [];
    let currentWeek: { date: string; count: number; level: number }[] = [];

    processedData.forEach((day, index) => {
      // Determine intensity level 0-4
      let level = 0;
      if (day.count === 0) level = 0;
      else if (day.count < 5) level = 1;
      else if (day.count < 10) level = 2;
      else if (day.count < 20) level = 3;
      else level = 4;

      currentWeek.push({ ...day, level });

      // If Sunday (0) or end of data, push week
      // Only push if we have 7 days or it's the last chunk
      // GitHub starts weeks on Sunday usually.
      if (currentWeek.length === 7 || index === processedData.length - 1) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });
    return weeksArray;
  }, [processedData]);

  // GitHub colors (light mode / dark mode adaptation)
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-zinc-100 dark:bg-zinc-800";
      case 1: return "bg-emerald-200 dark:bg-emerald-900/40";
      case 2: return "bg-emerald-300 dark:bg-emerald-800/60";
      case 3: return "bg-emerald-400 dark:bg-emerald-600";
      case 4: return "bg-emerald-500 dark:bg-emerald-500";
      default: return "bg-zinc-100 dark:bg-zinc-800";
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day) => (
               <TooltipProvider key={day.date}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`h-3 w-3 rounded-sm ${getLevelColor(day.level)} transition-colors hover:ring-1 hover:ring-zinc-400 dark:hover:ring-zinc-500`}
                    />
                  </TooltipTrigger>
                  <TooltipContent 
                    className="z-50 rounded bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xl"
                    sideOffset={5}
                  >
                    {day.count} clicks on {day.date}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-zinc-400">
        <span>Less</span>
        <div className="flex gap-1">
            <div className={`h-3 w-3 rounded-sm ${getLevelColor(0)}`}></div>
            <div className={`h-3 w-3 rounded-sm ${getLevelColor(1)}`}></div>
            <div className={`h-3 w-3 rounded-sm ${getLevelColor(2)}`}></div>
            <div className={`h-3 w-3 rounded-sm ${getLevelColor(3)}`}></div>
            <div className={`h-3 w-3 rounded-sm ${getLevelColor(4)}`}></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

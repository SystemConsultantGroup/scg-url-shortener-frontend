'use client';

type ChartData = {
  label: string;
  value: number;
};

interface SimpleBarChartProps {
  data: ChartData[];
  height?: number;
}

export default function SimpleBarChart({ data, height = 200 }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex h-full items-end justify-between gap-1 pb-6 relative">
        {data.map((d, i) => (
          <div key={i} className="group relative flex h-full flex-1 flex-col justify-end">
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-10">
              {d.value} clicks on {d.label}
            </div>
            
            <div 
              className="w-full rounded-t bg-zinc-100 transition-all group-hover:bg-zinc-800 dark:bg-zinc-800 dark:group-hover:bg-zinc-600"
              style={{ height: `${(d.value / maxValue) * 100}%` }}
            />
          </div>
        ))}
        
        {/* X-axis Labels */}
        <div className="absolute bottom-0 left-0 text-xs font-medium text-zinc-400">
          {data[0]?.label}
        </div>
        <div className="absolute bottom-0 right-0 text-xs font-medium text-zinc-400">
          {data[data.length - 1]?.label}
        </div>
      </div>
    </div>
  );
}

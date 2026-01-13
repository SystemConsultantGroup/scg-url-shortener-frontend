'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ReactLenis } from 'lenis/react';
import Link from "next/link";
import { ArrowLeft, Clock, CalendarBlank } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import TextReveal from "@/app/components/ui/TextReveal";
import SimpleBarChart from "@/app/components/analytics/SimpleBarChart";
import HeatmapChart from "@/app/components/analytics/HeatmapChart";

type AnalyticsData = {
  totalClicks: number;
  hourlyStats: { time: string; count: number }[];
  dailyStats: { date: string; count: number }[];
};

export default function AnalyticsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');

  useEffect(() => {
    if (!slug) return;
    const fetchAnalytics = async () => {
      try {
        const result = await api.get<AnalyticsData>(`/api/v1/urls/${slug}/analytics`);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-soft-gray">
        <p className="text-zinc-400">Loading Analytics...</p>
      </div>
    );
  }

  if (!data) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-soft-gray">
          <p className="text-red-500">Failed to load data.</p>
        </div>
      );
  }

  const chartData = viewMode === 'daily' 
    ? data.dailyStats.slice(-30).map(s => ({
        label: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: s.count
      }))
    : data.hourlyStats.map(s => ({
        label: new Date(s.time).toLocaleTimeString(undefined, { hour: '2-digit', hour12: false }),
        value: s.count
      }));

  return (
    <ReactLenis root>
      <div className="min-h-screen bg-soft-gray p-8 selection:bg-foreground selection:text-background">
        <nav className="mb-12">
          <Link href="/dashboard" className="group flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-foreground">
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </nav>

        <main className="mx-auto max-w-5xl">
          <header className="mb-16">
            <div className="flex items-baseline gap-4">
              <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-400">/{slug}</h1>
            </div>
            <div className="mt-8">
              <TextReveal>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[8vw] font-bold leading-none tracking-tighter text-foreground md:text-[6vw]">
                    {data.totalClicks.toLocaleString()}
                  </span>
                  <span className="text-xl font-medium text-zinc-400">Total Clicks</span>
                </div>
              </TextReveal>
            </div>
          </header>

          <div className="grid gap-8">
            {/* Main Chart */}
            <div className="rounded-3xl bg-background p-8 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                 <h2 className="text-lg font-bold">
                   {viewMode === 'daily' ? 'Daily Trends' : 'Last 24 Hours'}
                 </h2>
                 <div className="flex gap-2 rounded-full bg-zinc-100 p-1">
                    <button 
                      onClick={() => setViewMode('daily')}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'daily' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                      <CalendarBlank weight="bold" />
                      Days
                    </button>
                    <button 
                      onClick={() => setViewMode('hourly')}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'hourly' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                      <Clock weight="bold" />
                      Hours
                    </button>
                 </div>
              </div>
              <SimpleBarChart data={chartData} height={400} />
            </div>

            {/* Heatmap Chart */}
            <div className="rounded-3xl bg-background p-8 shadow-sm">
                <h2 className="mb-8 text-lg font-bold">Contribution Map (Last 1 Year)</h2>
                <HeatmapChart data={data.dailyStats} />
            </div>
          </div>
        </main>
      </div>
    </ReactLenis>
  );
}

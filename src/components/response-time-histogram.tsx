"use client";

import { useState, useEffect, useMemo } from "react";
import type { ServiceRequest } from "@/lib/types";
import { calculateHistogramBuckets } from "@/ai/flows/response-time-histogram-bucketing";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

interface HistogramData {
  name: string;
  requests: number;
}

export default function ResponseTimeHistogram({ data }: { data: ServiceRequest[] }) {
  const [histogramData, setHistogramData] = useState<HistogramData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const responseTimes = useMemo(() => data.map(d => d.response_time_in_days), [data]);

  useEffect(() => {
    async function generateBuckets() {
      setIsLoading(true);
      try {
        const { buckets } = await calculateHistogramBuckets({ responseTimes });
        
        const counts = new Array(buckets.length - 1).fill(0);
        for (const time of responseTimes) {
          for (let i = 0; i < buckets.length - 1; i++) {
            if (time >= buckets[i] && time < buckets[i+1]) {
              counts[i]++;
              break;
            }
          }
          if (time === buckets[buckets.length - 1] && buckets.length > 1) {
            counts[counts.length-1]++;
          }
        }

        const formattedData = counts.map((count, i) => ({
          name: `${Math.round(buckets[i])}-${Math.round(buckets[i+1])}`,
          requests: count,
        }));
        setHistogramData(formattedData);
      } catch (error) {
        console.error("AI Error:", error);
        const maxTime = Math.max(...responseTimes, 1);
        const bucketCount = Math.min(10, Math.ceil(maxTime));
        const bucketSize = Math.ceil(maxTime / bucketCount) || 1;
        const buckets = Array.from({length: bucketCount + 1}, (_, i) => i * bucketSize);
        
        const counts = new Array(bucketCount).fill(0);
        for (const time of responseTimes) {
          let bucketIndex = Math.floor(time / bucketSize);
          if (time === maxTime) bucketIndex = bucketCount - 1;
          if (counts[bucketIndex] !== undefined) {
             counts[bucketIndex]++;
          }
        }
        const formattedData = counts.map((count, i) => ({
            name: `${buckets[i]}-${buckets[i+1]}`,
            requests: count,
        }));
        setHistogramData(formattedData);

      } finally {
        setIsLoading(false);
      }
    }

    if (responseTimes.length > 0) {
      generateBuckets();
    } else {
        setIsLoading(false);
    }
  }, [responseTimes]);

  const chartConfig = {
    requests: {
      label: "Number of Requests",
      color: "hsl(var(--accent))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Response Time Distribution</CardTitle>
        <CardDescription>
          Distribution of all request response times. Bucket sizes determined by AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[350px] w-full p-6">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={histogramData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="requests" fill="var(--color-requests)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

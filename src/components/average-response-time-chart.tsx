"use client";

import { useMemo } from "react";
import type { ServiceRequest } from "@/lib/types";
import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface ChartData {
  request_type: string;
  "Average Response Time": number;
}

export default function AverageResponseTimeChart({ data }: { data: ServiceRequest[] }) {
  const { chartData, chartConfig } = useMemo(() => {
    const groupedData: { [key: string]: number[] } = {};
    data.forEach((req) => {
      if (!groupedData[req.request_type]) {
        groupedData[req.request_type] = [];
      }
      groupedData[req.request_type].push(req.response_time_in_days);
    });

    const averagedData: ChartData[] = Object.entries(groupedData).map(
      ([request_type, times]) => ({
        request_type,
        "Average Response Time":
          times.reduce((a, b) => a + b, 0) / times.length,
      })
    );
    
    const sortedData = averagedData.sort((a, b) => a["Average Response Time"] - b["Average Response Time"]);

    const chartConfig = {
      "Average Response Time": {
        label: "Avg. Response (days)",
        color: "hsl(var(--primary))",
      },
    } satisfies ChartConfig;

    return { chartData: sortedData, chartConfig };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Average Response Time by Type</CardTitle>
        <CardDescription>Sorted from fastest to slowest response time.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 40 }}>
            <XAxis type="number" dataKey="Average Response Time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              dataKey="request_type"
              type="category"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={100}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                formatter={(value) => `${(value as number).toFixed(1)} days`}
                labelClassName="font-bold"
              />}
            />
            <Bar dataKey="Average Response Time" layout="vertical" radius={4} fill="var(--color-Average-Response-Time)">
              <LabelList 
                dataKey="Average Response Time" 
                position="right" 
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `${value.toFixed(1)}d`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

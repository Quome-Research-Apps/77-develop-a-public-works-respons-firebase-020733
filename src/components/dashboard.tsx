"use client";

import { useMemo } from "react";
import type { ServiceRequest } from "@/lib/types";
import KpiCard from "@/components/kpi-card";
import AverageResponseTimeChart from "@/components/average-response-time-chart";
import ResponseTimeHistogram from "@/components/response-time-histogram";
import DataTable from "@/components/data-table";
import { Clock, ListChecks } from "lucide-react";

interface DashboardProps {
  data: ServiceRequest[];
}

export default function Dashboard({ data }: DashboardProps) {
  const { totalRequests, overallAverageResponseTime } = useMemo(() => {
    if (!data || data.length === 0) {
      return { totalRequests: 0, overallAverageResponseTime: 0 };
    }
    const totalRequests = data.length;
    const totalResponseTime = data.reduce(
      (sum, req) => sum + req.response_time_in_days,
      0
    );
    const overallAverageResponseTime = totalResponseTime / totalRequests;
    return {
      totalRequests,
      overallAverageResponseTime,
    };
  }, [data]);

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-500">
      <div className="grid gap-4 md:grid-cols-2">
        <KpiCard
          title="Total Requests Analyzed"
          value={totalRequests.toLocaleString()}
          icon={<ListChecks className="w-6 h-6 text-muted-foreground" />}
        />
        <KpiCard
          title="Overall Average Response Time"
          value={`${overallAverageResponseTime.toFixed(1)} days`}
          icon={<Clock className="w-6 h-6 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <AverageResponseTimeChart data={data} />
        <ResponseTimeHistogram data={data} />
      </div>

      <div>
        <DataTable data={data} />
      </div>
    </div>
  );
}

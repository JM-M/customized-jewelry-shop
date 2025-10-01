"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  { date: "2024-01-01", revenue: 12500 },
  { date: "2024-01-02", revenue: 15200 },
  { date: "2024-01-03", revenue: 11800 },
  { date: "2024-01-04", revenue: 18900 },
  { date: "2024-01-05", revenue: 22100 },
  { date: "2024-01-06", revenue: 16800 },
  { date: "2024-01-07", revenue: 19400 },
  { date: "2024-01-08", revenue: 23600 },
  { date: "2024-01-09", revenue: 20300 },
  { date: "2024-01-10", revenue: 18700 },
  { date: "2024-01-11", revenue: 25400 },
  { date: "2024-01-12", revenue: 21800 },
  { date: "2024-01-13", revenue: 19200 },
  { date: "2024-01-14", revenue: 27100 },
  { date: "2024-01-15", revenue: 22900 },
  { date: "2024-01-16", revenue: 19600 },
  { date: "2024-01-17", revenue: 28300 },
  { date: "2024-01-18", revenue: 24500 },
  { date: "2024-01-19", revenue: 21200 },
  { date: "2024-01-20", revenue: 29800 },
  { date: "2024-01-21", revenue: 26100 },
  { date: "2024-01-22", revenue: 22700 },
  { date: "2024-01-23", revenue: 31400 },
  { date: "2024-01-24", revenue: 27800 },
  { date: "2024-01-25", revenue: 24300 },
  { date: "2024-01-26", revenue: 32900 },
  { date: "2024-01-27", revenue: 29400 },
  { date: "2024-01-28", revenue: 25800 },
  { date: "2024-01-29", revenue: 34500 },
  { date: "2024-01-30", revenue: 31100 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const RevenueTrendChart = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
          <CardDescription>Track revenue performance over time</CardDescription>
        </div>
        <Select defaultValue="monthly">
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-auto w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  return `₦${(value / 1000).toFixed(0)}k`;
                }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="revenue"
                type="monotone"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                // dot={{
                //   fill: "#3b82f6",
                //   strokeWidth: 2,
                //   r: 4,
                // }}
                // activeDot={{
                //   r: 6,
                //   strokeWidth: 2,
                //   stroke: "#3b82f6",
                //   fill: "#3b82f6",
                // }}
                connectNulls={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

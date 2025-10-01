"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
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
  {
    month: "Jan",
    "First-time Orders": 145,
    "Repeat Orders": 89,
  },
  {
    month: "Feb",
    "First-time Orders": 167,
    "Repeat Orders": 112,
  },
  {
    month: "Mar",
    "First-time Orders": 189,
    "Repeat Orders": 134,
  },
  {
    month: "Apr",
    "First-time Orders": 156,
    "Repeat Orders": 98,
  },
  {
    month: "May",
    "First-time Orders": 178,
    "Repeat Orders": 145,
  },
  {
    month: "Jun",
    "First-time Orders": 203,
    "Repeat Orders": 167,
  },
  {
    month: "Jul",
    "First-time Orders": 234,
    "Repeat Orders": 189,
  },
  {
    month: "Aug",
    "First-time Orders": 198,
    "Repeat Orders": 156,
  },
  {
    month: "Sep",
    "First-time Orders": 221,
    "Repeat Orders": 178,
  },
  {
    month: "Oct",
    "First-time Orders": 245,
    "Repeat Orders": 203,
  },
  {
    month: "Nov",
    "First-time Orders": 267,
    "Repeat Orders": 234,
  },
  {
    month: "Dec",
    "First-time Orders": 289,
    "Repeat Orders": 267,
  },
];

const chartConfig = {
  "First-time Orders": {
    label: "First-time Orders",
    color: "var(--primary)",
  },
  "Repeat Orders": {
    label: "Repeat Orders",
    color: "blue",
  },
} satisfies ChartConfig;

export const OrderVolumeChart = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Order Volume</CardTitle>
          <CardDescription>
            Track order patterns by customer type
          </CardDescription>
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
      <CardContent>
        <div className="h-auto w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="First-time Orders"
                stackId="a"
                fill="var(--primary)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="Repeat Orders"
                stackId="a"
                fill="#555"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

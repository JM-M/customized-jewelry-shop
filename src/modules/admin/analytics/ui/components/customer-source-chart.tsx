/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CustomerSourceData {
  name: string;
  value: number;
  color: string;
}

const data: CustomerSourceData[] = [
  { name: "TikTok", value: 1247, color: "#000000" },
  { name: "Instagram", value: 892, color: "#833AB4" },
  { name: "WhatsApp", value: 784, color: "#25D366" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = payload.reduce(
      (sum: number, item: any) => sum + item.value,
      0,
    );
    const percentage = ((data.value / total) * 100).toFixed(1);
    return (
      <div className="bg-background rounded-lg border p-3 shadow-md">
        <p className="font-medium">{data.name}</p>
        <p className="text-muted-foreground text-sm">
          {data.value.toLocaleString()} customers ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export const CustomerSourceChart = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Source Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => {
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${name}: ${percentage}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-muted-foreground mt-4 text-center text-sm">
          Total: {total.toLocaleString()} customers
        </div>
      </CardContent>
    </Card>
  );
};

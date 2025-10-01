"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { SiInstagram, SiTiktok, SiWhatsapp } from "react-icons/si";

interface CustomerSourceCardProps {
  title: string;
  totalCustomers: number;
  newCustomers: number;
  percentage: number;
  change: number;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
  color: string;
}

const CustomerSourceCard = ({
  title,
  totalCustomers,
  newCustomers,
  percentage,
  change,
  changeType,
  icon,
  color,
}: CustomerSourceCardProps) => {
  const isPositive = changeType === "increase";
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {totalCustomers.toLocaleString()}
          </div>
          <div className="text-muted-foreground text-sm">
            {newCustomers} new this month
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium">{percentage}%</span> of total
            customers
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <ChangeIcon
              className={`h-3 w-3 ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            />
            <span className={isPositive ? "text-green-600" : "text-red-600"}>
              {Math.abs(change)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const CustomerSourceCards = () => {
  return (
    <div className="@container grid gap-4 @lg:grid-cols-3">
      <CustomerSourceCard
        title="TikTok Customers"
        totalCustomers={1247}
        newCustomers={89}
        percentage={42}
        change={15.3}
        changeType="increase"
        icon={<SiTiktok className="h-4 w-4" />}
        color="bg-black"
      />
      <CustomerSourceCard
        title="Instagram Customers"
        totalCustomers={892}
        newCustomers={67}
        percentage={30}
        change={8.7}
        changeType="increase"
        icon={<SiInstagram className="h-4 w-4" />}
        color="bg-gradient-to-r from-purple-500 to-pink-500"
      />
      <CustomerSourceCard
        title="WhatsApp Customers"
        totalCustomers={784}
        newCustomers={45}
        percentage={28}
        change={3.2}
        changeType="decrease"
        icon={<SiWhatsapp className="h-4 w-4" />}
        color="bg-green-500"
      />
    </div>
  );
};

import { BalanceChart } from "@/components/balance-chart";
import TransactionsTable from "@/components/transactions-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-picker";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";

export default function DashboardPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold md:text-3xl">Dashboard</h1>
        <DatePickerWithRange />
        <Tabs defaultValue="1w" className="w-[400px] hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="1w">1W</TabsTrigger>
            <TabsTrigger value="1m">1M</TabsTrigger>
            <TabsTrigger value="3-month">3M</TabsTrigger>
            <TabsTrigger value="password">1Y</TabsTrigger>
          </TabsList>
          <TabsContent value="week"></TabsContent>
          <TabsContent value="password"></TabsContent>
        </Tabs>
      </div>
      <Separator />
      <div className="">
        <div className="flex justify-start gap-2 md:gap-4 overflow-x-hidden">
          <Card className="min-w-60 border-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">All</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Income</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Groceries</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rent</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
          <Card className="min-w-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rent</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <BalanceChart />
        <TransactionsTable />
      </div>
    </>
  );
}

import { getLoggedInUser } from "@/lib/actions/user.actions";
import Greeting from "@/components/dashboard/Greeting";
import { Separator } from "@/components/ui/separator";
import Transactions from "@/components/dashboard/Transactions";
import Balance from "@/components/dashboard/Balance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getLoggedInUser();

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold md:text-2xl">
          <Greeting />, {user?.firstName}
        </h1>
        <div>Time range selector</div>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-5">
        <div className="grid grid-cols-1 gap-5 col-span-2">
          <div className="grid grid-cols-3 gap-5">
            <Card>
              <CardHeader>
                <CardTitle>Income</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold">$2890.63</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold">$2890.63</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Net Change</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold">$2890.63</div>
              </CardContent>
            </Card>
          </div>
          <Balance />
          <Transactions />
        </div>
        <div className="grid grid-cols-1 gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Connect an account</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}

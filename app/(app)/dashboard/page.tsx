import { getLoggedInUser } from "@/lib/actions/user.actions";
import Greeting from "@/components/dashboard/Greeting";

export default async function DashboardPage() {
  const user = await getLoggedInUser();

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold md:text-3xl">
          <Greeting />, {user?.firstName}
        </h1>
      </div>
    </>
  );
}

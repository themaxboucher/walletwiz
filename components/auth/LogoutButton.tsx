"use client";

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/user.actions";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logout();
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}

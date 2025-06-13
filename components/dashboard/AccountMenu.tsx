"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/user.actions";
import { Settings, HelpCircle, LogOut } from "lucide-react";
import { ThemeSelector } from "../ThemeSelector";

export default function AccountMenu(props: { user: User }) {
  const handleLogout = async () => {
    await logout();
  };

  const userInitials = (
    props.user.firstName[0] + props.user.lastName[0]
  ).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-10 shadow-inn">
            <AvatarImage src={props.user?.avatar} />
            <AvatarFallback className="text-sm font-extrabold text-white/80 bg-primary">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-56 w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span className="font-semibold text-sm">
              <span>
                {props.user.firstName} {props.user.lastName}
              </span>
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {props.user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex justify-between items-center py-1">
            <DropdownMenuLabel className="text-sm font-medium">
              Theme
            </DropdownMenuLabel>
            <ThemeSelector />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {}} className="cursor-pointer">
            <Settings className="mr-1 size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-1 size-4" />
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={handleLogout}>
            <button className="w-full" type="submit">
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-1 size-4" />
                Logout
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

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
import {
  Settings,
  HelpCircle,
  LogOut,
  Sparkle,
  Heart,
  MessageCircle,
} from "lucide-react";
import { ThemeSelector } from "../ThemeSelector";
import SettingsDialog from "../settings/SettingsDialog";
import { useState } from "react";

export default function AccountMenu(props: { user: User }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<string | undefined>(
    undefined
  );

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
          <Avatar className="size-10 border border-border">
            <AvatarImage
              className="object-cover shadow-inner"
              src={props.user?.avatar}
            />
            <AvatarFallback className="font-bold text-primary bg-primary/20">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-56 w-56">
          <DropdownMenuLabel
            className="flex flex-col cursor-pointer"
            onClick={() => {
              setSettingsSection("account");
              setSettingsOpen(true);
            }}
          >
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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSettingsSection(undefined);
              setSettingsOpen(true);
            }}
          >
            <Settings className="mr-1 size-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <HelpCircle className="mr-1 size-4" />
            Support
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href="https://walletwiz.featurebase.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full"
            >
              <MessageCircle className="mr-1 size-4" />
              Give Feadback
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href="https://senja.io/p/walletwiz/r/KG1SqQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full"
            >
              <Heart className="mr-1 size-4" />
              Leave a Testimonial
            </a>
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
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        section={settingsSection}
        user={props.user}
      />
    </>
  );
}

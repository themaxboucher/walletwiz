import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, SlidersHorizontal, User } from "lucide-react";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
} from "@/components/ui/sidebar";
import AccountSettings from "./AccountSettings";
import GeneralSettings from "./GeneralSettings";
import PreferencesSettings from "./PreferencesSettings";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: string;
  user: User;
}

export default function SettingsDialog({
  open,
  onOpenChange,
  section = "general",
  user,
}: SettingsDialogProps) {
  const [selected, setSelected] = useState(section);

  // Update selected section when dialog is opened or section prop changes
  useEffect(() => {
    if (open) setSelected(section);
  }, [open, section]);

  const SECTIONS = [
    {
      key: "general",
      label: "General",
      icon: Settings,
      content: <GeneralSettings />,
    },
    {
      key: "account",
      label: "Account",
      icon: User,
      content: <AccountSettings user={user} />,
    },
    {
      key: "preferences",
      label: "Preferences",
      icon: SlidersHorizontal,
      content: <PreferencesSettings />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-[65rem] h-[80vh] grid grid-cols-4 grid-rows-1 gap-0 p-0 overflow-hidden">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  {SECTIONS.map((section) => (
                    <SidebarMenuItem key={section.key}>
                      <SidebarMenuButton
                        isActive={selected === section.key}
                        onClick={() => setSelected(section.key)}
                      >
                        <section.icon className="size-4" />
                        {section.label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
        <div className="col-span-3 p-6 overflow-y-auto h-full">
          {SECTIONS.find((section) => section.key === selected)?.content}
        </div>
      </DialogContent>
    </Dialog>
  );
}

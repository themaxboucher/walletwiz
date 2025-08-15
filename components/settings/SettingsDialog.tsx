import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChartPie, Tag, User } from "lucide-react";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
} from "@/components/ui/sidebar";
import AccountSettings from "./AccountSettings";
import CategoriesSettings from "./CategoriesSettings";
import BudgetSettings from "./BudgetSettings";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: string;
  user: User;
}

export default function SettingsDialog({
  open,
  onOpenChange,
  section = "account",
  user,
}: SettingsDialogProps) {
  const [selected, setSelected] = useState(section);

  // Update selected section when dialog is opened or section prop changes
  useEffect(() => {
    if (open) setSelected(section);
  }, [open, section]);

  const SECTIONS = [
    {
      key: "account",
      label: "Account",
      icon: User,
      content: <AccountSettings user={user} />,
    },
    {
      key: "categories",
      label: "Categories",
      icon: Tag,
      content: <CategoriesSettings user={user} />,
    },
    {
      key: "budget",
      label: "Budget",
      icon: ChartPie,
      content: <BudgetSettings user={user} />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-[55rem] h-[80vh] grid grid-cols-4 grid-rows-1 gap-0 p-0 overflow-hidden">
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <SidebarProvider>
          <Sidebar className="w-54">
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

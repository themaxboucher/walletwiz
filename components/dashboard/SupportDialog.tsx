"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, Copy } from "lucide-react";
import { toast } from "sonner";

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SupportDialog({
  open,
  onOpenChange,
}: SupportDialogProps) {
  const supportEmail = "maxime@maximeboucher.com";

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(supportEmail);
      toast("Email copied to clipboard", {
        icon: <CircleCheck className="text-primary size-5" />,
      });
    } catch (error) {
      console.error("Failed to copy email:", error);
      toast("Failed to copy email", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Support</DialogTitle>
          <DialogDescription>
            Contact us at {supportEmail} for help and support.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 file:text-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm">
            <span className="font-mono text-sm mb-0.5 ml-1">
              {supportEmail}
            </span>
            <Button variant="outline" size="sm" onClick={handleCopyEmail}>
              <Copy className="mr-1 size-4" />
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

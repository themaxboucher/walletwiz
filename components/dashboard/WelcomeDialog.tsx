"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { markDashboardSeen } from "@/lib/actions/user.actions";

interface WelcomeDialogProps {
  userId: string;
  show: boolean;
}

export default function WelcomeDialog({ userId, show }: WelcomeDialogProps) {
  const [open, setOpen] = useState<boolean>(!!show);

  useEffect(() => {
    setOpen(!!show);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    (async () => {
      try {
        const { default: confetti } = await import("canvas-confetti");
        confetti({ particleCount: 140, spread: 70, origin: { y: 0.6 } });
        await markDashboardSeen(userId);
      } catch {}
    })();
  }, [show, userId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md flex flex-col items-center text-center"
      >
        <DialogHeader>
          <DialogTitle>Welcome to WalletWiz 🎉</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground max-w-xs">
          You’re all set! Explore your dashboard and start tracking your money.
        </p>
        <Button onClick={() => setOpen(false)} className="w-full">
          Let's go!
        </Button>
      </DialogContent>
    </Dialog>
  );
}

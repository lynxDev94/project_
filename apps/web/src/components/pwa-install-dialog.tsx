"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePwaInstall } from "@/providers/PwaInstall";

type PwaInstallDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PwaInstallDialog({ open, onOpenChange }: PwaInstallDialogProps) {
  const { isIos } = usePwaInstall();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-background-dark text-slate-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Install Shadow Journal</DialogTitle>
          <DialogDescription className="text-slate-400">
            {isIos
              ? "On iPhone or iPad you add the app from Safari’s share menu."
              : "Your browser will offer install once the app is ready, or you can install from the menu."}
          </DialogDescription>
        </DialogHeader>
        {isIos ? (
          <ol className="list-decimal space-y-2 pl-4 text-sm text-slate-300">
            <li>Tap the Share button (square with arrow) at the bottom or top of Safari.</li>
            <li>Scroll and tap <span className="font-medium text-white">Add to Home Screen</span>.</li>
            <li>Confirm the name and tap <span className="font-medium text-white">Add</span>.</li>
          </ol>
        ) : (
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              In <span className="font-medium text-white">Chrome</span> or{" "}
              <span className="font-medium text-white">Edge</span>, open the menu (three dots,
              top-right). Choose <span className="font-medium text-white">Install Shadow Journal</span>{" "}
              or <span className="font-medium text-white">Save and share</span> →{" "}
              <span className="font-medium text-white">Install page as app</span>.
            </p>
            <p className="text-slate-400">
              If you do not see that yet, refresh this page or open another page (for example Sign
              in) and come back—then try again.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Smartphone } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { PwaInstallDialog } from "@/components/pwa-install-dialog";
import { usePwaInstall } from "@/providers/PwaInstall";
import { cn } from "@/lib/utils";

type InstallAppButtonProps = Omit<ButtonProps, "onClick" | "children"> & {
  label?: string;
};

export function InstallAppButton({
  label = "Install the app",
  className,
  variant = "outlineDark",
  size = "default",
  ...props
}: InstallAppButtonProps) {
  const { ready, isStandalone, canNativeInstall, promptInstall } =
    usePwaInstall();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!ready || isStandalone) return null;

  const onClick = async () => {
    if (canNativeInstall) {
      const result = await promptInstall();
      if (result.outcome === "unavailable") {
        setDialogOpen(true);
      }
      return;
    }
    setDialogOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={() => void onClick()}
        {...props}
      >
        <Smartphone
          className="size-4 shrink-0"
          aria-hidden
        />
        {label}
      </Button>
      <PwaInstallDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}

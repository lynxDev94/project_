"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { isIosSafari, isStandaloneDisplay } from "@/lib/pwa-install-shared";
import { usePwaInstall } from "@/providers/PwaInstall";

const DISMISS_KEY = "pwa-install-helper-dismissed";

export function PwaInstallHelper() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { canNativeInstall, promptInstall } = usePwaInstall();

  const ios = useMemo(() => isIosSafari(), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandaloneDisplay()) return;
    if (window.localStorage.getItem(DISMISS_KEY) === "1") return;

    if (ios) {
      setShow(true);
    } else {
      setShow(true);
      const onControllerChange = () => setShow(true);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
        void navigator.serviceWorker.ready.then(() => setShow(true));
      }

      return () => {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
        }
      };
    }
  }, [ios]);

  const dismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result.outcome === "accepted") {
      setShow(false);
    }
  };

  if (!show || !mounted || typeof document === "undefined") return null;

  const panel = (
    <div className="fixed right-4 bottom-4 z-[9999] w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
      <p className="text-sm font-semibold text-slate-900">Install Shadow Journal</p>
      {canNativeInstall ? (
        <p className="mt-1 text-xs text-slate-600">
          Add this app to your device for quicker access and app-like behavior.
        </p>
      ) : ios ? (
        <p className="mt-1 text-xs text-slate-600">
          On iPhone: tap Share, then choose Add to Home Screen. Or use{" "}
          <span className="font-medium">Install the app</span> in the menu above.
        </p>
      ) : (
        <p className="mt-1 text-xs text-slate-600">
          Use <span className="font-medium">Install the app</span> in the header for steps. In
          Chrome or Edge you can also use the menu (three dots) → Install, once your browser
          shows it.
        </p>
      )}
      <div className="mt-3 flex gap-2">
        {canNativeInstall ? (
          <Button
            size="sm"
            className="h-8 rounded-lg px-3"
            onClick={() => void handleInstall()}
          >
            Install
          </Button>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg px-3"
          onClick={dismiss}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}

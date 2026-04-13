"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type BeforeInstallPromptEvent,
  isIosSafari,
  isStandaloneDisplay,
} from "@/lib/pwa-install-shared";

export type PromptInstallResult =
  | { outcome: "accepted" | "dismissed"; platform: string }
  | { outcome: "unavailable" };

type PwaInstallContextValue = {
  ready: boolean;
  isStandalone: boolean;
  isIos: boolean;
  canNativeInstall: boolean;
  promptInstall: () => Promise<PromptInstallResult>;
};

const PwaInstallContext = createContext<PwaInstallContextValue | null>(null);

export function PwaInstallProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setStandalone(isStandaloneDisplay());
    setIos(isIosSafari());
    setReady(true);

    if (isStandaloneDisplay()) return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  const promptInstall = useCallback(async (): Promise<PromptInstallResult> => {
    const ev = deferredPrompt;
    if (!ev) return { outcome: "unavailable" };
    await ev.prompt();
    const choice = await ev.userChoice;
    setDeferredPrompt(null);
    return choice;
  }, [deferredPrompt]);

  const value = useMemo(
    () => ({
      ready,
      isStandalone: standalone,
      isIos: ios,
      canNativeInstall: deferredPrompt !== null,
      promptInstall,
    }),
    [ready, standalone, ios, deferredPrompt, promptInstall],
  );

  return (
    <PwaInstallContext.Provider value={value}>
      {children}
    </PwaInstallContext.Provider>
  );
}

export function usePwaInstall(): PwaInstallContextValue {
  const ctx = useContext(PwaInstallContext);
  if (!ctx) {
    throw new Error("usePwaInstall must be used within PwaInstallProvider");
  }
  return ctx;
}

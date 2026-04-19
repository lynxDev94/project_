"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    const pwaEnabled = process.env.NEXT_PUBLIC_ENABLE_PWA === "true";

    if (!pwaEnabled) {
      void navigator.serviceWorker
        .getRegistrations()
        .then(async (registrations) => {
          await Promise.all(registrations.map((registration) => registration.unregister()));
          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(
              keys
                .filter((key) => key.startsWith("shadow-journal-v"))
                .map((key) => caches.delete(key)),
            );
          }
        })
        .catch((error) =>
          console.error("Service worker cleanup failed:", error),
        );
      return;
    }

    void navigator.serviceWorker
      .register("/sw.js")
      .catch((error) =>
        console.error("Service worker registration failed:", error),
      );
  }, []);

  return null;
}

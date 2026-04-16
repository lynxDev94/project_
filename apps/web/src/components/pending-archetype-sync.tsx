"use client";

import { useEffect, useRef } from "react";
import { useAuthContext } from "@/providers/Auth";

type PendingArchetype = {
  id: string;
  label: string;
  version: number;
  computedAt: string;
  scores?: Record<string, number>;
};

const STORAGE_KEY = "pending_archetype_v1";

export function PendingArchetypeSync() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuthContext();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    if (isLoading) return;
    if (!isAuthenticated || !user) return;

    ranRef.current = true;

    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return;
    }

    if (!raw) return;

    let pending: PendingArchetype | null = null;
    try {
      pending = JSON.parse(raw) as PendingArchetype;
    } catch {
      pending = null;
    }
    if (!pending?.id || !pending?.label) return;

    const current = (user.metadata as Record<string, unknown> | undefined)
      ?.archetype as PendingArchetype | undefined;
    if (current?.id === pending.id && current?.version === pending.version) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      return;
    }

    void (async () => {
      const merged = {
        ...(user.metadata ?? {}),
        archetype: pending,
      };
      const { error } = await updateUser({ metadata: merged });
      if (!error) {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
      }
    })();
  }, [isAuthenticated, isLoading, updateUser, user]);

  return null;
}

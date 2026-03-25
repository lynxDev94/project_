"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuthContext } from "@/providers/Auth";
import { supabase } from "@/lib/auth/supabase-client";

interface CreditsContextProps {
  credits: number | null;
  /** Stripe Price ID for the active subscription, if any */
  subscriptionPriceId: string | null;
  /** Raw Stripe subscription status (e.g. active, trialing, canceled) */
  subscriptionStatus: string | null;
  loading: boolean;
  error: string | null;
  refreshCredits: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
  deductCredits: (amount: number) => void;
  addCredits: (amount: number) => void;
}

const CreditsContext = createContext<CreditsContextProps | undefined>(
  undefined,
);

export function CreditsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthContext();
  const [credits, setCredits] = useState<number | null>(null);
  const [subscriptionPriceId, setSubscriptionPriceId] = useState<string | null>(
    null,
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCredits = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setCredits(null);
      setSubscriptionPriceId(null);
      setSubscriptionStatus(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("users")
        .select("credits_available, subscription_status, price_id")
        .eq("id", user.id)
        .single();

      if (supabaseError) {
        console.error("Error fetching credits:", supabaseError);
        setError("Failed to fetch credits");
        setCredits(0); // Fallback to 0 credits
        setSubscriptionPriceId(null);
        setSubscriptionStatus(null);
        return;
      }

      setCredits((data?.credits_available as number) ?? 0);
      setSubscriptionPriceId((data?.price_id as string) || null);
      setSubscriptionStatus((data?.subscription_status as string) || null);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setError("Failed to fetch credits");
      setCredits(0); // Fallback to 0 credits on any error
      setSubscriptionPriceId(null);
      setSubscriptionStatus(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Update credits optimistically
  const updateCredits = (newCredits: number) => {
    setCredits(newCredits);
  };

  // Deduct credits optimistically
  const deductCredits = (amount: number) => {
    setCredits((prevCredits) => {
      if (prevCredits === null) return null;
      return Math.max(0, prevCredits - amount);
    });
  };

  // Add credits optimistically
  const addCredits = (amount: number) => {
    setCredits((prevCredits) => {
      if (prevCredits === null) return null;
      return prevCredits + amount;
    });
  };

  // Initial fetch when user changes
  useEffect(() => {
    void refreshCredits();
  }, [refreshCredits]);

  const value = {
    credits,
    subscriptionPriceId,
    subscriptionStatus,
    loading,
    error,
    refreshCredits,
    updateCredits,
    deductCredits,
    addCredits,
  };

  return (
    <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
  );
}

export function useCreditsContext() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCreditsContext must be used within a CreditsProvider");
  }
  return context;
}

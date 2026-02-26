"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, UserX, BookOpen } from "lucide-react";
import { useAuthContext } from "@/providers/Auth";

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuthContext();
  const [journalDialogOpen, setJournalDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [journalLoading, setJournalLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);

  const handleDeleteJournal = async () => {
    setJournalLoading(true);
    try {
      const res = await fetch("/api/settings/delete-journal", {
        method: "DELETE",
      });
      if (res.ok) {
        setJournalDialogOpen(false);
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setJournalLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setAccountLoading(true);
    try {
      const res = await fetch("/api/settings/delete-account", {
        method: "DELETE",
      });
      if (res.ok) {
        setAccountDialogOpen(false);
        await signOut();
        router.push("/");
      }
    } finally {
      setAccountLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl font-sans text-slate-800">
      <h1 className="font-headline mb-2 text-3xl font-bold text-slate-800">
        Settings
      </h1>
      <p className="mb-10 text-slate-600">
        Manage your journal and account. Destructive actions cannot be undone.
      </p>

      {/* Remove journal data */}
      <div className="border-dashboard-stroke shadow-card-layered mb-6 rounded-2xl border bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="bg-brand/10 text-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-sans text-lg font-semibold text-slate-800">
              Remove journal data
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Delete all your journal entries and reflections. This cannot be
              undone. Your account will remain active.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="mt-4 gap-2 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={() => setJournalDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete journal data
            </Button>
          </div>
        </div>
      </div>

      {/* Remove account */}
      <div className="border-dashboard-stroke shadow-card-layered mb-10 rounded-2xl border bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="bg-brand/10 text-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <UserX className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-sans text-lg font-semibold text-slate-800">
              Remove account
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Permanently delete your account and all associated data, including
              your journal. This action is irreversible.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="mt-4 gap-2 border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={() => setAccountDialogOpen(true)}
            >
              <UserX className="h-4 w-4" />
              Remove account
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link href="/dashboard">
          <Button variant="outline" size="lg">
            Cancel
          </Button>
        </Link>
      </div>

      <Dialog open={journalDialogOpen} onOpenChange={setJournalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete journal data</DialogTitle>
            <DialogDescription>
              This will permanently delete all your journal entries and mood entries.
              Your account will remain active. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setJournalDialogOpen(false)}
              disabled={journalLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteJournal}
              disabled={journalLoading}
            >
              {journalLoading ? "Deleting..." : "Delete journal data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={accountDialogOpen} onOpenChange={setAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data,
              including your journal and mood history. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAccountDialogOpen(false)}
              disabled={accountLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={accountLoading}
            >
              {accountLoading ? "Deleting..." : "Remove account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

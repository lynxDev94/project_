"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, UserX, BookOpen } from "lucide-react";

export default function SettingsPage() {
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
          <Button
            variant="outline"
            size="lg"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}

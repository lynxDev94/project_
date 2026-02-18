"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, UserX, BookOpen } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-dashboard-main-bg font-sans text-slate-800">
      {/* Header */}
      <header className="border-b border-dashboard-stroke bg-dashboard-sidebar-bg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-end gap-6 px-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-500 hover:text-slate-800"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-brand"
          >
            Journal
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 font-headline text-3xl font-bold text-slate-800">
          Settings
        </h1>
        <p className="mb-10 text-slate-600">
          Manage your journal and account. Destructive actions cannot be undone.
        </p>

        {/* Remove journal data */}
        <div className="mb-6 rounded-2xl border border-dashboard-stroke bg-white p-6 shadow-card-layered">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <BookOpen className="h-5 w-5 text-amber-600" />
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
                className="mt-4 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Delete journal data
              </Button>
            </div>
          </div>
        </div>

        {/* Remove account */}
        <div className="mb-10 rounded-2xl border border-dashboard-stroke bg-white p-6 shadow-card-layered">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-sans text-lg font-semibold text-slate-800">
                Remove account
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Permanently delete your account and all associated data,
                including your journal. This action is irreversible.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="mt-4 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
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
      </main>
    </div>
  );
}

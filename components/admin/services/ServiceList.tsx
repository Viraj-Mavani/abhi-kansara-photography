"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, AlertTriangle, Layers, ExternalLink, GripVertical } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";
import { deleteService } from "@/app/actions/services";
import type { DetailedService } from "@/lib/api";

// ─────────────────────────────────────────────────────────
//  ServiceList — Managed table for Admin Services
//  Implements "Replace Row" deletion UX.
// ─────────────────────────────────────────────────────────

interface ServiceListProps {
  initialServices: DetailedService[];
}

export default function ServiceList({ initialServices }: ServiceListProps) {
  const [services, setServices] = useState(initialServices);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    const idToDelete = confirmDeleteId;
    setError("");

    startTransition(async () => {
      try {
        await deleteService(idToDelete);
        setServices((prev) => prev.filter((s) => s.id !== idToDelete));
        setConfirmDeleteId(null);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to delete service");
      }
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-4">
                Service Details
              </th>
              <th className="text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-4">
                Public Slug
              </th>
              <th className="text-left text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-4">
                Category
              </th>
              <th className="text-center text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-4">
                Status
              </th>
              <th className="text-right text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 px-5 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {services.map((service) => {
              const isConfirming = confirmDeleteId === service.id;

              return (
                <tr
                  key={service.id}
                  className={`transition-all duration-300 ${
                    isConfirming 
                      ? "bg-red-500/[0.06]" 
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  {isConfirming ? (
                    /* ── Inline Deletion Confirmation (Full Row) ── */
                    <td colSpan={5} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-4 animate-in fade-in slide-in-from-left-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-red-200">Delete "{service.title}"?</p>
                            <p className="text-[11px] text-red-400/60">This service and all its content will be permanently removed.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <AdminButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDeleteId(null)}
                            disabled={isPending}
                            className="text-white/40 hover:text-white"
                          >
                            Cancel
                          </AdminButton>
                          <AdminButton
                            variant="danger"
                            size="sm"
                            onClick={handleConfirmDelete}
                            isLoading={isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Confirm Delete
                          </AdminButton>
                        </div>
                      </div>
                    </td>
                  ) : (
                    /* ── Normal Row ── */
                    <>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                            {service.icon ? (
                              <span className="material-symbols-outlined text-[#c9a96e] text-lg">
                                {service.icon}
                              </span>
                            ) : (
                              <Layers size={18} className="text-white/20" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white/90 truncate">
                              {service.title}
                            </p>
                            <p className="text-[11px] text-white/30 truncate mt-0.5">
                              {service.tagline}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <code className="text-[10px] text-white/40 bg-white/[0.04] px-2 py-0.5 rounded font-mono border border-white/[0.06]">
                          /{service.slug}
                        </code>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-white/50 font-medium">
                          {service.category || "General"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {service.isFeatured ? (
                          <span className="inline-flex h-5 items-center px-2 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/20 text-[9px] font-bold text-[#c9a96e] uppercase tracking-wider">
                            Featured
                          </span>
                        ) : (
                          <span className="text-white/10 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/services/${service.id}`}>
                            <AdminButton variant="ghost" size="sm" className="h-8 px-3 border-transparent hover:border-white/10">
                              Edit
                            </AdminButton>
                          </Link>
                          <button
                            onClick={() => setConfirmDeleteId(service.id)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            title="Delete Service"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {services.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01]">
            <p className="text-white/20 text-sm font-medium">No services found.</p>
            <Link href="/admin/services/new" className="mt-4 inline-block">
              <AdminButton variant="ghost" size="sm">Create First Service</AdminButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

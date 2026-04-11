"use client";

import { useState, useTransition } from "react";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import { updateBio, updatePageConfig } from "@/app/actions/site-config";
import type { SiteBio, PageConfig } from "@/lib/api";
import { Check, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
//  SiteConfigEditor — Two-tab interface for Bio + Page Config
//  Refined to remove unused Section Headers and Portfolio CTAs.
// ─────────────────────────────────────────────────────────

interface SiteConfigEditorProps {
  bio: SiteBio;
  pageConfigs: PageConfig[];
}

export default function SiteConfigEditor({ bio, pageConfigs }: SiteConfigEditorProps) {
  const [activeTab, setActiveTab] = useState<"bio" | "pages">("bio");

  const tabs = [
    { key: "bio" as const, label: "Artist Bio", icon: User },
    { key: "pages" as const, label: "Page Heroes", icon: FileText },
  ];

  return (
    <div className="max-w-4xl space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-1 rounded-lg bg-white/[0.02] border border-white/[0.06] p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                activeTab === tab.key
                  ? "bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/15"
                  : "text-white/40 hover:text-white/60 border border-transparent"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bio Tab */}
      {activeTab === "bio" && <BioEditor bio={bio} />}

      {/* Pages Tab */}
      {activeTab === "pages" && <PagesEditor pageConfigs={pageConfigs} />}
    </div>
  );
}

// ── Bio Editor ──────────────────────────────────────────

function BioEditor({ bio }: { bio: SiteBio }) {
  const [formData, setFormData] = useState({
    artistName: bio.artistName,
    tagline: bio.tagline,
    intro: bio.intro,
    history: bio.history,
    philosophy: bio.philosophy,
    portraitImage: bio.portraitImage,
  });
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");
    setSaved(false);
    startTransition(async () => {
      try {
        await updateBio(bio.id, { id: bio.id, ...formData });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update bio");
      }
    });
  };

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white/70 mb-2 font-serif tracking-wide italic">Personal Artist Profile</h2>

      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Artist Name" value={formData.artistName} onChange={(e) => update("artistName", e.target.value)} />
        <AdminInput label="Tagline" value={formData.tagline} onChange={(e) => update("tagline", e.target.value)} />
      </div>

      <AdminInput label="Portrait Image URL" placeholder="https://..." value={formData.portraitImage} onChange={(e) => update("portraitImage", e.target.value)} />

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e] mb-1.5 block">Introduction</label>
          <textarea
            className="w-full h-24 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 transition-all resize-none"
            value={formData.intro}
            onChange={(e) => update("intro", e.target.value)}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e] mb-1.5 block">Artist History</label>
          <textarea
            className="w-full h-24 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 transition-all resize-none"
            value={formData.history}
            onChange={(e) => update("history", e.target.value)}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e] mb-1.5 block">Creative Philosophy</label>
          <textarea
            className="w-full h-24 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 transition-all resize-none"
            value={formData.philosophy}
            onChange={(e) => update("philosophy", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.04] mt-2">
        {saved && (
          <span className="text-sm text-green-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2">
            <Check className="h-4 w-4" /> Changes saved
          </span>
        )}
        <AdminButton onClick={handleSave} isLoading={isPending} className="px-8 shadow-lg shadow-[#c9a96e]/5">
          Save Profile
        </AdminButton>
      </div>
    </div>
  );
}

// ── Pages Editor ────────────────────────────────────────

function PagesEditor({ pageConfigs }: { pageConfigs: PageConfig[] }) {
  const [activePageKey, setActivePageKey] = useState(pageConfigs[0]?.pageKey || "");
  const activeConfig = pageConfigs.find((p) => p.pageKey === activePageKey);

  if (pageConfigs.length === 0) {
    return (
      <div className="text-center py-12 text-white/30 text-sm rounded-xl border border-white/[0.06]">
        No page configurations found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page Key Tabs */}
      <div className="flex items-center gap-2">
        {pageConfigs.map((config) => (
          <button
            key={config.pageKey}
            onClick={() => setActivePageKey(config.pageKey)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300",
              activePageKey === config.pageKey
                ? "bg-[#c9a96e] text-black shadow-lg shadow-[#c9a96e]/20"
                : "text-white/40 hover:text-white/60 bg-white/[0.03] border border-white/[0.06]"
            )}
          >
            {config.pageKey}
          </button>
        ))}
      </div>

      {activeConfig && <PageConfigForm key={activeConfig.id} config={activeConfig} />}
    </div>
  );
}

function PageConfigForm({ config }: { config: PageConfig }) {
  // Only the 'services' page should have CTA fields in its hero.
  const hasCta = config.pageKey === "services";

  const [formData, setFormData] = useState({
    heroTagline: config.heroTagline,
    heroTitle: config.heroTitle,
    heroSubtitle: config.heroSubtitle,
    ctaText: hasCta ? (config.ctaText || "") : "",
    ctaLink: hasCta ? (config.ctaLink || "") : "",
  });

  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");
    setSaved(false);
    startTransition(async () => {
      try {
        await updatePageConfig(config.id, {
          id: config.id,
          pageKey: config.pageKey,
          ...formData,
          // Explicitly clear legacy section headers as they are unused
          sectionTitle1: "",
          sectionSubtitle1: "",
          sectionTitle2: "",
          sectionSubtitle2: "",
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to update page config");
      }
    });
  };

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  return (
    <div className="rounded-xl border border-white/[0.06] p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
        <h2 className="text-sm font-semibold text-white/70">
          Editing Hero for: <span className="text-[#c9a96e] italic serif ml-1">{config.pageKey}</span>
        </h2>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Hero Content */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e]/60">Hero Content</h3>
        <AdminInput label="Small Tagline" placeholder="EXCELLENCE IN ART" value={formData.heroTagline} onChange={(e) => update("heroTagline", e.target.value)} />
        <AdminInput label="Main Title" placeholder="Cinematic Photography" value={formData.heroTitle} onChange={(e) => update("heroTitle", e.target.value)} />
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e]/60 block">Hero Subtitle</label>
          <textarea
            className="w-full h-20 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 transition-all resize-none"
            value={formData.heroSubtitle}
            onChange={(e) => update("heroSubtitle", e.target.value)}
          />
        </div>
      </div>

      {/* CTA Section - Re-restricted to keep UI clean */}
      {hasCta && (
        <div className="space-y-4 pt-4 border-t border-white/[0.04]">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e]/60">Call to Action</h3>
          <div className="grid grid-cols-2 gap-4">
            <AdminInput label="Button Label" placeholder="View Packages" value={formData.ctaText} onChange={(e) => update("ctaText", e.target.value)} />
            <AdminInput label="Button Link" placeholder="/contact" value={formData.ctaLink} onChange={(e) => update("ctaLink", e.target.value)} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.04]">
        {saved && (
          <span className="text-sm text-green-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2">
            <Check className="h-4 w-4" /> Config saved
          </span>
        )}
        <AdminButton onClick={handleSave} isLoading={isPending} className="px-8 shadow-lg shadow-[#c9a96e]/5">
          Save Hero Config
        </AdminButton>
      </div>
    </div>
  );
}

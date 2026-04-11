"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import { createGallery, updateGallery } from "@/app/actions/galleries";
import type { Gallery } from "@/lib/api";
import { Plus, Trash2, GripVertical, ImageIcon, Film } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  GalleryForm — Gallery + nested MediaItems
// ─────────────────────────────────────────────────────────

interface MediaItemForm {
  type: "photo" | "video";
  url: string;
  width: number;
  height: number;
  alt: string;
  posterUrl: string;
  hlsUrl: string;
  duration: string;
  order: number;
}

interface GalleryFormValues {
  clientName: string;
  slug: string;
  category: string;
  coverPhotoUrl: string;
  location: string;
  description: string;
  isFeatured: boolean;
  order: number;
  media: MediaItemForm[];
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CATEGORIES = [
  "Wedding",
  "Pre-Wedding",
  "Baby Shower",
  "Event",
  "Product",
  "Editorial",
  "Portrait",
];

interface GalleryFormProps {
  initialData?: Gallery;
}

export default function GalleryForm({ initialData }: GalleryFormProps) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const { register, control, handleSubmit, watch, setValue } =
    useForm<GalleryFormValues>({
      defaultValues: initialData
        ? {
            clientName: initialData.clientName,
            slug: initialData.slug,
            category: initialData.category,
            coverPhotoUrl: initialData.coverPhotoUrl,
            location: initialData.location || "",
            description: initialData.description || "",
            isFeatured: initialData.isFeatured || false,
            order: initialData.order || 0,
            media: (initialData.media || []).map((m, i) => ({
              type: m.type as "photo" | "video",
              url: m.url,
              width: m.width,
              height: m.height,
              alt: m.alt || "",
              posterUrl: m.posterUrl || "",
              hlsUrl: m.hlsUrl || "",
              duration: m.duration || "",
              order: i,
            })),
          }
        : {
            clientName: "",
            slug: "",
            category: "Wedding",
            coverPhotoUrl: "",
            location: "",
            description: "",
            isFeatured: false,
            order: 0,
            media: [],
          },
    });

  const mediaField = useFieldArray({ control, name: "media" });

  const addMedia = (type: "photo" | "video") => {
    mediaField.append({
      type,
      url: "",
      width: type === "photo" ? 1600 : 1920,
      height: type === "photo" ? 1067 : 1080,
      alt: "",
      posterUrl: "",
      hlsUrl: "",
      duration: "",
      order: mediaField.fields.length,
    });
  };

  const onSubmit = (formData: GalleryFormValues) => {
    setError("");
    const payload = {
      ...(isEditing ? { id: initialData.id } : {}),
      clientName: formData.clientName,
      slug: formData.slug || slugify(formData.clientName),
      category: formData.category,
      coverPhotoUrl: formData.coverPhotoUrl,
      location: formData.location || null,
      description: formData.description || null,
      isFeatured: formData.isFeatured,
      order: formData.order,
      media: formData.media.map((m, i) => ({
        type: m.type,
        url: m.url,
        width: m.width,
        height: m.height,
        alt: m.alt || null,
        posterUrl: m.posterUrl || null,
        hlsUrl: m.hlsUrl || null,
        duration: m.duration || null,
        order: i,
      })),
    };

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateGallery(initialData.id, payload);
        } else {
          await createGallery(payload);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to save gallery");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-wide mb-1">
            {isEditing ? "Edit Gallery" : "New Gallery"}
          </h1>
          <p className="text-sm text-white/40">
            {isEditing ? `Editing "${initialData.clientName}"` : "Create a new client gallery"}
          </p>
        </div>
        <AdminButton variant="ghost" size="sm" type="button" onClick={() => router.back()}>
          Cancel
        </AdminButton>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Core Info */}
      <div className="rounded-xl border border-white/[0.06] p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white/70 mb-2">Gallery Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <AdminInput
            label="Client Name"
            placeholder="Aaina & Daideep"
            {...register("clientName", { required: true })}
            onChange={(e) => {
              register("clientName").onChange(e);
              if (!isEditing || !watch("slug")) {
                setValue("slug", slugify(e.target.value));
              }
            }}
          />
          <AdminInput label="Slug" placeholder="aaina-daideep" {...register("slug", { required: true })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">Category</label>
            <select
              {...register("category")}
              className="h-11 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-sm text-white/90 outline-none focus:border-[#c9a96e]/50 focus:ring-1 focus:ring-[#c9a96e]/20 transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0a0a0f]">{cat}</option>
              ))}
            </select>
          </div>
          <AdminInput label="Location" placeholder="Mumbai, India" {...register("location")} />
        </div>
        <AdminInput label="Cover Photo URL" placeholder="https://..." {...register("coverPhotoUrl", { required: true })} />
        <div>
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1.5 block">Description</label>
          <textarea
            className="w-full h-20 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 transition-all resize-none"
            placeholder="Optional description..."
            {...register("description")}
          />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
            <input type="checkbox" {...register("isFeatured")} className="accent-[#c9a96e]" />
            Featured Gallery
          </label>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">Order</label>
            <input
              type="number"
              {...register("order", { valueAsNumber: true })}
              className="h-9 w-20 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-sm text-white/90 outline-none focus:border-[#c9a96e]/50 transition-all text-center"
            />
          </div>
        </div>
      </div>

      {/* Media Items */}
      <div className="rounded-xl border border-white/[0.06] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white/70">
            Media Items{" "}
            <span className="text-white/30 font-normal">({mediaField.fields.length})</span>
          </h2>
          <div className="flex items-center gap-2">
            <AdminButton type="button" variant="ghost" size="sm" onClick={() => addMedia("photo")}>
              <ImageIcon className="h-3.5 w-3.5" /> Add Photo
            </AdminButton>
            <AdminButton type="button" variant="ghost" size="sm" onClick={() => addMedia("video")}>
              <Film className="h-3.5 w-3.5" /> Add Video
            </AdminButton>
          </div>
        </div>

        {mediaField.fields.map((field, index) => {
          const mediaType = watch(`media.${index}.type`);
          const isVideo = mediaType === "video";

          return (
            <div
              key={field.id}
              className="rounded-lg border border-white/[0.06] bg-white/[0.01] p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-white/15" />
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded ${isVideo ? "text-blue-400 bg-blue-500/10" : "text-green-400 bg-green-500/10"}`}>
                    {isVideo ? "Video" : "Photo"}
                  </span>
                  <span className="text-xs text-white/30 font-mono">#{index + 1}</span>
                </div>
                <button type="button" onClick={() => mediaField.remove(index)} className="p-1 text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <AdminInput label="URL" placeholder="https://..." {...register(`media.${index}.url`)} />
              <div className="grid grid-cols-3 gap-3">
                <AdminInput label="Width" type="number" {...register(`media.${index}.width`, { valueAsNumber: true })} />
                <AdminInput label="Height" type="number" {...register(`media.${index}.height`, { valueAsNumber: true })} />
                <AdminInput label="Alt Text" placeholder="Description..." {...register(`media.${index}.alt`)} />
              </div>

              {isVideo && (
                <div className="grid grid-cols-3 gap-3 pt-1 border-t border-white/[0.04]">
                  <AdminInput label="Poster URL" placeholder="https://..." {...register(`media.${index}.posterUrl`)} />
                  <AdminInput label="HLS URL" placeholder="https://..." {...register(`media.${index}.hlsUrl`)} />
                  <AdminInput label="Duration" placeholder="3:45" {...register(`media.${index}.duration`)} />
                </div>
              )}
            </div>
          );
        })}

        {mediaField.fields.length === 0 && (
          <div className="text-center py-8 text-white/20 text-sm">
            No media items yet. Add photos or videos above.
          </div>
        )}
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/[0.06] px-8 py-4 flex items-center justify-between z-50">
        <p className="text-xs text-white/30">
          {isEditing ? "Changes will replace all media items" : "A new gallery will be created"}
        </p>
        <div className="flex items-center gap-3">
          <AdminButton variant="ghost" type="button" onClick={() => router.back()}>Cancel</AdminButton>
          <AdminButton type="submit" isLoading={isPending}>
            {isEditing ? "Save Changes" : "Create Gallery"}
          </AdminButton>
        </div>
      </div>
    </form>
  );
}

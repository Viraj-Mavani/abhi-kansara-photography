"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import { createService, updateService } from "@/app/actions/services";
import type { DetailedService } from "@/lib/api";
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
//  ServiceForm — Deep Nested Form for Service CRUD
//  Uses useFieldArray for all dynamic collections.
// ─────────────────────────────────────────────────────────

interface ServiceFormValues {
  title: string;
  slug: string;
  tagline: string;
  coverImage: string;
  icon: string;
  shortDescription: string;
  detailedDescription: string;
  startingPrice: string;
  priceNote: string;
  category: string;
  minDuration: string;
  maxCapacity: string;
  travelAvailable: boolean;
  indoorOutdoor: string;
  order: number;
  isFeatured: boolean;
  features: { value: string }[];
  highlights: { value: string }[];
  tags: { value: string }[];
  galleryImages: { value: string }[];
  packages: {
    name: string;
    price: string;
    priceNote: string;
    duration: string;
    description: string;
    isPopular: boolean;
    order: number;
    deliverables: { item: string; detail: string; order: number }[];
  }[];
  addOns: { name: string; price: string; description: string; order: number }[];
  processSteps: { stepNumber: number; title: string; description: string; icon: string; order: number }[];
  testimonials: { clientName: string; event: string; quote: string; rating: number; avatar: string; order: number }[];
  faqs: { question: string; answer: string; order: number }[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Collapsible section component
function Section({
  title,
  count,
  children,
  defaultOpen = false,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-3">
          {open ? (
            <ChevronDown className="h-4 w-4 text-white/30" />
          ) : (
            <ChevronRight className="h-4 w-4 text-white/30" />
          )}
          <span className="text-sm font-semibold text-white/70">{title}</span>
          {count !== undefined && (
            <span className="text-xs text-white/30 bg-white/[0.06] px-2 py-0.5 rounded-full tabular-nums">
              {count}
            </span>
          )}
        </div>
      </button>
      {open && <div className="p-5 pt-4 space-y-4">{children}</div>}
    </div>
  );
}

interface ServiceFormProps {
  initialData?: DetailedService;
}

export default function ServiceForm({ initialData }: ServiceFormProps) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<ServiceFormValues>({
      defaultValues: initialData
        ? {
            title: initialData.title,
            slug: initialData.slug,
            tagline: initialData.tagline,
            coverImage: initialData.coverImage,
            icon: initialData.icon || "",
            shortDescription: initialData.shortDescription,
            detailedDescription: initialData.detailedDescription,
            startingPrice: initialData.startingPrice || "",
            priceNote: initialData.priceNote || "",
            category: initialData.category || "",
            minDuration: initialData.minDuration || "",
            maxCapacity: initialData.maxCapacity || "",
            travelAvailable: initialData.travelAvailable || false,
            indoorOutdoor: initialData.indoorOutdoor || "",
            order: initialData.order || 0,
            isFeatured: initialData.isFeatured || false,
            features: (initialData.features || []).map((v) => ({ value: v })),
            highlights: (initialData.highlights || []).map((v) => ({ value: v })),
            tags: (initialData.tags || []).map((v) => ({ value: v })),
            galleryImages: (initialData.galleryImages || []).map((v) => ({ value: v })),
            packages: (initialData.packages || []).map((p, pi) => ({
              name: p.name,
              price: p.price || "",
              priceNote: p.priceNote || "",
              duration: p.duration || "",
              description: p.description || "",
              isPopular: p.isPopular || false,
              order: pi,
              deliverables: (p.deliverables || []).map((d, di) => ({
                item: d.item,
                detail: d.detail || "",
                order: di,
              })),
            })),
            addOns: (initialData.addOns || []).map((a, i) => ({
              name: a.name,
              price: a.price || "",
              description: a.description || "",
              order: i,
            })),
            processSteps: (initialData.process || []).map((p, i) => ({
              stepNumber: p.stepNumber,
              title: p.title,
              description: p.description,
              icon: p.icon || "",
              order: i,
            })),
            testimonials: (initialData.testimonials || []).map((t, i) => ({
              clientName: t.clientName,
              event: t.event || "",
              quote: t.quote,
              rating: t.rating || 5,
              avatar: t.avatar || "",
              order: i,
            })),
            faqs: (initialData.faqs || []).map((f, i) => ({
              question: f.question,
              answer: f.answer,
              order: i,
            })),
          }
        : {
            title: "",
            slug: "",
            tagline: "",
            coverImage: "",
            icon: "",
            shortDescription: "",
            detailedDescription: "",
            startingPrice: "",
            priceNote: "",
            category: "",
            minDuration: "",
            maxCapacity: "",
            travelAvailable: false,
            indoorOutdoor: "",
            order: 0,
            isFeatured: false,
            features: [],
            highlights: [],
            tags: [],
            galleryImages: [],
            packages: [],
            addOns: [],
            processSteps: [],
            testimonials: [],
            faqs: [],
          },
    });

  // Field arrays for all nested collections
  const featuresField = useFieldArray({ control, name: "features" });
  const highlightsField = useFieldArray({ control, name: "highlights" });
  const tagsField = useFieldArray({ control, name: "tags" });
  const galleryImagesField = useFieldArray({ control, name: "galleryImages" });
  const packagesField = useFieldArray({ control, name: "packages" });
  const addOnsField = useFieldArray({ control, name: "addOns" });
  const processField = useFieldArray({ control, name: "processSteps" });
  const testimonialsField = useFieldArray({ control, name: "testimonials" });
  const faqsField = useFieldArray({ control, name: "faqs" });

  // Auto-slug from title
  const watchTitle = watch("title");

  const onSubmit = (formData: ServiceFormValues) => {
    setError("");

    // Transform the form data into the API shape
    const payload = {
      ...(isEditing ? { id: initialData.id } : {}),
      title: formData.title,
      slug: formData.slug || slugify(formData.title),
      tagline: formData.tagline,
      coverImage: formData.coverImage,
      icon: formData.icon || null,
      shortDescription: formData.shortDescription,
      detailedDescription: formData.detailedDescription,
      startingPrice: formData.startingPrice || null,
      priceNote: formData.priceNote || null,
      category: formData.category || null,
      minDuration: formData.minDuration || null,
      maxCapacity: formData.maxCapacity || null,
      travelAvailable: formData.travelAvailable,
      indoorOutdoor: formData.indoorOutdoor || null,
      order: formData.order,
      isFeatured: formData.isFeatured,
      features: formData.features.map((f) => f.value).filter(Boolean),
      highlights: formData.highlights.map((h) => h.value).filter(Boolean),
      tags: formData.tags.map((t) => t.value).filter(Boolean),
      galleryImages: formData.galleryImages.map((g) => g.value).filter(Boolean),
      packages: formData.packages.map((pkg, i) => ({
        name: pkg.name,
        price: pkg.price || null,
        priceNote: pkg.priceNote || null,
        duration: pkg.duration || null,
        description: pkg.description || null,
        isPopular: pkg.isPopular,
        order: i,
        deliverables: pkg.deliverables.map((d, j) => ({
          item: d.item,
          detail: d.detail || null,
          order: j,
        })),
      })),
      addOns: formData.addOns.map((a, i) => ({
        name: a.name,
        price: a.price || null,
        description: a.description || null,
        order: i,
      })),
      processSteps: formData.processSteps.map((p, i) => ({
        stepNumber: p.stepNumber || i + 1,
        title: p.title,
        description: p.description,
        icon: p.icon || null,
        order: i,
      })),
      testimonials: formData.testimonials.map((t, i) => ({
        clientName: t.clientName,
        event: t.event || null,
        quote: t.quote,
        rating: t.rating || null,
        avatar: t.avatar || null,
        order: i,
      })),
      faqs: formData.faqs.map((f, i) => ({
        question: f.question,
        answer: f.answer,
        order: i,
      })),
    };

    startTransition(async () => {
      try {
        if (isEditing) {
          await updateService(initialData.id, payload);
        } else {
          await createService(payload);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to save service");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white/90 tracking-wide mb-1">
            {isEditing ? "Edit Service" : "New Service"}
          </h1>
          <p className="text-sm text-white/40">
            {isEditing
              ? `Editing "${initialData.title}"`
              : "Create a new photography service offering"}
          </p>
        </div>
        <AdminButton variant="ghost" size="sm" type="button" onClick={() => router.back()}>
          Cancel
        </AdminButton>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/8 border border-red-500/15 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ── Core Info ── */}
      <Section title="Core Information" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <AdminInput
            label="Title"
            placeholder="Wedding Photography"
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
            onChange={(e) => {
              register("title").onChange(e);
              if (!isEditing || !watch("slug")) {
                setValue("slug", slugify(e.target.value));
              }
            }}
          />
          <AdminInput
            label="Slug"
            placeholder="wedding-photography"
            {...register("slug", { required: "Slug is required" })}
            error={errors.slug?.message}
          />
        </div>
        <AdminInput
          label="Tagline"
          placeholder="Capturing your most precious moments"
          {...register("tagline", { required: "Tagline is required" })}
          error={errors.tagline?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Cover Image URL" placeholder="https://..." {...register("coverImage", { required: "Cover image is required" })} error={errors.coverImage?.message} />
          <AdminInput label="Icon (Material Symbols)" placeholder="photo_camera" {...register("icon")} />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1.5 block">
            Short Description
          </label>
          <textarea
            className="w-full h-20 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#c9a96e]/20 transition-all resize-none"
            placeholder="Brief overview of the service..."
            {...register("shortDescription", { required: true })}
          />
        </div>
        <div>
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1.5 block">
            Detailed Description
          </label>
          <textarea
            className="w-full h-32 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-[#c9a96e]/20 transition-all resize-none"
            placeholder="Full detailed description..."
            {...register("detailedDescription", { required: true })}
          />
        </div>
      </Section>

      {/* ── Pricing ── */}
      <Section title="Pricing">
        <div className="grid grid-cols-2 gap-4">
          <AdminInput label="Starting Price" placeholder="$3,500" {...register("startingPrice")} />
          <AdminInput label="Price Note" placeholder="Starting from" {...register("priceNote")} />
        </div>
      </Section>

      {/* ── Features (string array) ── */}
      <Section title="Features" count={featuresField.fields.length}>
        {featuresField.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-white/15 flex-shrink-0" />
            <AdminInput placeholder="Feature item..." className="flex-1" {...register(`features.${index}.value`)} />
            <button type="button" onClick={() => featuresField.remove(index)} className="p-2 text-white/20 hover:text-red-400 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => featuresField.append({ value: "" })}>
          <Plus className="h-3.5 w-3.5" /> Add Feature
        </AdminButton>
      </Section>

      {/* ── Highlights (string array) ── */}
      <Section title="Highlights" count={highlightsField.fields.length}>
        {highlightsField.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-white/15 flex-shrink-0" />
            <AdminInput placeholder="Highlight..." className="flex-1" {...register(`highlights.${index}.value`)} />
            <button type="button" onClick={() => highlightsField.remove(index)} className="p-2 text-white/20 hover:text-red-400 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => highlightsField.append({ value: "" })}>
          <Plus className="h-3.5 w-3.5" /> Add Highlight
        </AdminButton>
      </Section>

      {/* ── Tags (string array) ── */}
      <Section title="Tags" count={tagsField.fields.length}>
        {tagsField.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <AdminInput placeholder="Tag..." className="flex-1" {...register(`tags.${index}.value`)} />
            <button type="button" onClick={() => tagsField.remove(index)} className="p-2 text-white/20 hover:text-red-400 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => tagsField.append({ value: "" })}>
          <Plus className="h-3.5 w-3.5" /> Add Tag
        </AdminButton>
      </Section>

      {/* ── Gallery Images (string array) ── */}
      <Section title="Gallery Images" count={galleryImagesField.fields.length}>
        {galleryImagesField.fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-white/15 flex-shrink-0" />
            <AdminInput placeholder="https://..." className="flex-1" {...register(`galleryImages.${index}.value`)} />
            <button type="button" onClick={() => galleryImagesField.remove(index)} className="p-2 text-white/20 hover:text-red-400 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => galleryImagesField.append({ value: "" })}>
          <Plus className="h-3.5 w-3.5" /> Add Image URL
        </AdminButton>
      </Section>

      {/* ── Packages (nested: Package → Deliverables) ── */}
      <Section title="Packages" count={packagesField.fields.length}>
        {packagesField.fields.map((pkgField, pkgIdx) => (
          <PackageCard
            key={pkgField.id}
            index={pkgIdx}
            register={register}
            control={control}
            onRemove={() => packagesField.remove(pkgIdx)}
          />
        ))}
        <AdminButton
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            packagesField.append({
              name: "",
              price: "",
              priceNote: "",
              duration: "",
              description: "",
              isPopular: false,
              order: packagesField.fields.length,
              deliverables: [],
            })
          }
        >
          <Plus className="h-3.5 w-3.5" /> Add Package
        </AdminButton>
      </Section>

      {/* ── Add-Ons ── */}
      <Section title="Add-Ons" count={addOnsField.fields.length}>
        {addOnsField.fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono">Add-On {index + 1}</span>
              <button type="button" onClick={() => addOnsField.remove(index)} className="p-1 text-white/20 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AdminInput placeholder="Name" {...register(`addOns.${index}.name`)} />
              <AdminInput placeholder="Price" {...register(`addOns.${index}.price`)} />
            </div>
            <AdminInput placeholder="Description" {...register(`addOns.${index}.description`)} />
          </div>
        ))}
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => addOnsField.append({ name: "", price: "", description: "", order: addOnsField.fields.length })}>
          <Plus className="h-3.5 w-3.5" /> Add Add-On
        </AdminButton>
      </Section>

      {/* ── Process Steps ── */}
      <Section title="Process Steps" count={processField.fields.length}>
        {processField.fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono">Step {index + 1}</span>
              <button type="button" onClick={() => processField.remove(index)} className="p-1 text-white/20 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <AdminInput placeholder="Title" {...register(`processSteps.${index}.title`)} />
              <AdminInput placeholder="Icon name" {...register(`processSteps.${index}.icon`)} />
              <AdminInput type="number" placeholder="Step #" {...register(`processSteps.${index}.stepNumber`, { valueAsNumber: true })} />
            </div>
            <textarea
              className="w-full h-16 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 transition-all resize-none"
              placeholder="Description..."
              {...register(`processSteps.${index}.description`)}
            />
          </div>
        ))}
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => processField.append({ stepNumber: processField.fields.length + 1, title: "", description: "", icon: "", order: processField.fields.length })}>
          <Plus className="h-3.5 w-3.5" /> Add Step
        </AdminButton>
      </Section>

      {/* ── Testimonials ── */}
      <Section title="Testimonials" count={testimonialsField.fields.length}>
        {testimonialsField.fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono">Testimonial {index + 1}</span>
              <button type="button" onClick={() => testimonialsField.remove(index)} className="p-1 text-white/20 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AdminInput placeholder="Client Name" {...register(`testimonials.${index}.clientName`)} />
              <AdminInput placeholder="Event (e.g. Wedding — Jan 2025)" {...register(`testimonials.${index}.event`)} />
            </div>
            <textarea
              className="w-full h-20 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 transition-all resize-none"
              placeholder="Quote..."
              {...register(`testimonials.${index}.quote`)}
            />
            <div className="grid grid-cols-2 gap-3">
              <AdminInput type="number" placeholder="Rating (1-5)" {...register(`testimonials.${index}.rating`, { valueAsNumber: true })} />
              <AdminInput placeholder="Avatar URL" {...register(`testimonials.${index}.avatar`)} />
            </div>
          </div>
        ))}
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => testimonialsField.append({ clientName: "", event: "", quote: "", rating: 5, avatar: "", order: testimonialsField.fields.length })}>
          <Plus className="h-3.5 w-3.5" /> Add Testimonial
        </AdminButton>
      </Section>

      {/* ── FAQs ── */}
      <Section title="FAQs" count={faqsField.fields.length}>
        {faqsField.fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border border-white/[0.06] bg-white/[0.01] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/30 font-mono">FAQ {index + 1}</span>
              <button type="button" onClick={() => faqsField.remove(index)} className="p-1 text-white/20 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <AdminInput placeholder="Question" {...register(`faqs.${index}.question`)} />
            <textarea
              className="w-full h-16 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/90 placeholder:text-white/25 outline-none focus:border-[#c9a96e]/50 transition-all resize-none"
              placeholder="Answer..."
              {...register(`faqs.${index}.answer`)}
            />
          </div>
        ))}
        <AdminButton type="button" variant="ghost" size="sm" onClick={() => faqsField.append({ question: "", answer: "", order: faqsField.fields.length })}>
          <Plus className="h-3.5 w-3.5" /> Add FAQ
        </AdminButton>
      </Section>

      {/* ── Metadata ── */}
      <Section title="Metadata & Display">
        <div className="grid grid-cols-3 gap-4">
          <AdminInput label="Category" placeholder="Wedding" {...register("category")} />
          <AdminInput label="Min Duration" placeholder="4 Hours" {...register("minDuration")} />
          <AdminInput label="Max Capacity" placeholder="200 Guests" {...register("maxCapacity")} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <AdminInput label="Indoor/Outdoor" placeholder="Both" {...register("indoorOutdoor")} />
          <AdminInput label="Display Order" type="number" {...register("order", { valueAsNumber: true })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">Options</label>
            <div className="flex items-center gap-6 h-11">
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" {...register("travelAvailable")} className="accent-[#c9a96e]" />
                Travel Available
              </label>
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} className="accent-[#c9a96e]" />
                Featured
              </label>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Sticky Save Bar ── */}
      <div className="fixed bottom-0 left-64 right-0 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/[0.06] px-8 py-4 flex items-center justify-between z-50">
        <p className="text-xs text-white/30">
          {isEditing ? "Changes will replace the entire service tree" : "A new service will be created"}
        </p>
        <div className="flex items-center gap-3">
          <AdminButton variant="ghost" type="button" onClick={() => router.back()}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" isLoading={isPending}>
            {isEditing ? "Save Changes" : "Create Service"}
          </AdminButton>
        </div>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────
//  PackageCard — Nested component for Package + Deliverables
// ─────────────────────────────────────────────────────────

function PackageCard({
  index,
  register,
  control,
  onRemove,
}: {
  index: number;
  register: ReturnType<typeof useForm<ServiceFormValues>>["register"];
  control: ReturnType<typeof useForm<ServiceFormValues>>["control"];
  onRemove: () => void;
}) {
  const deliverables = useFieldArray({
    control,
    name: `packages.${index}.deliverables`,
  });

  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.015] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#c9a96e]/60">
          Package {index + 1}
        </span>
        <button type="button" onClick={onRemove} className="p-1 text-white/20 hover:text-red-400 transition-colors">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AdminInput placeholder="Package Name" {...register(`packages.${index}.name`)} />
        <AdminInput placeholder="Price (e.g. $5,500)" {...register(`packages.${index}.price`)} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <AdminInput placeholder="Price Note" {...register(`packages.${index}.priceNote`)} />
        <AdminInput placeholder="Duration" {...register(`packages.${index}.duration`)} />
        <div className="flex items-center h-11">
          <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
            <input type="checkbox" {...register(`packages.${index}.isPopular`)} className="accent-[#c9a96e]" />
            Popular
          </label>
        </div>
      </div>
      <AdminInput placeholder="Description" {...register(`packages.${index}.description`)} />

      {/* Nested Deliverables */}
      <div className="pl-4 border-l-2 border-white/[0.06] space-y-2 mt-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
          Deliverables ({deliverables.fields.length})
        </span>
        {deliverables.fields.map((delField, delIdx) => (
          <div key={delField.id} className="flex items-center gap-2">
            <AdminInput placeholder="Item" className="flex-1" {...register(`packages.${index}.deliverables.${delIdx}.item`)} />
            <AdminInput placeholder="Detail" className="flex-1" {...register(`packages.${index}.deliverables.${delIdx}.detail`)} />
            <button type="button" onClick={() => deliverables.remove(delIdx)} className="p-1 text-white/20 hover:text-red-400">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => deliverables.append({ item: "", detail: "", order: deliverables.fields.length })}
          className="text-xs text-[#c9a96e]/60 hover:text-[#c9a96e] flex items-center gap-1 transition-colors"
        >
          <Plus className="h-3 w-3" /> Add Deliverable
        </button>
      </div>
    </div>
  );
}

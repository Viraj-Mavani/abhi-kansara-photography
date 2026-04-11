"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminButton from "@/components/admin/ui/AdminButton";
import { createService, updateService } from "@/app/actions/services";
import type { DetailedService } from "@/lib/api";
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from "lucide-react";

// ─────────────────────────────────────────────────────────
//  ServiceForm — Simplified deep form for Service CRUD
// ─────────────────────────────────────────────────────────

interface ServiceFormValues {
  title: string;
  slug: string;
  tagline: string;
  coverImage: string;
  icon: string;
  shortDescription: string;
  detailedDescription: string;
  category: string;
  order: number;
  isFeatured: boolean;
  features: { value: string }[];
  highlights: { value: string }[];
  galleryImages: { value: string }[];
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
            category: initialData.category || "",
            order: initialData.order || 0,
            isFeatured: initialData.isFeatured || false,
            features: (initialData.features || []).map((v) => ({ value: v })),
            highlights: (initialData.highlights || []).map((v) => ({ value: v })),
            galleryImages: (initialData.galleryImages || []).map((v) => ({ value: v })),
            processSteps: (initialData.processSteps || []).map((p, i) => ({
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
            category: "",
            order: 0,
            isFeatured: false,
            features: [],
            highlights: [],
            galleryImages: [],
            processSteps: [],
            testimonials: [],
            faqs: [],
          },
    });

  // Field arrays for nested collections
  const featuresField = useFieldArray({ control, name: "features" });
  const highlightsField = useFieldArray({ control, name: "highlights" });
  const galleryImagesField = useFieldArray({ control, name: "galleryImages" });
  const processField = useFieldArray({ control, name: "processSteps" });
  const testimonialsField = useFieldArray({ control, name: "testimonials" });
  const faqsField = useFieldArray({ control, name: "faqs" });

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
      category: formData.category || null,
      order: formData.order,
      isFeatured: formData.isFeatured,
      features: formData.features.map((f) => f.value).filter(Boolean),
      highlights: formData.highlights.map((h) => h.value).filter(Boolean),
      galleryImages: formData.galleryImages.map((g) => g.value).filter(Boolean),
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
          await updateService(initialData.id, payload as any);
        } else {
          await createService(payload as any);
        }
        router.push("/admin/services");
        router.refresh();
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
        
        {/* Consolidated Metadata Fields */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-4 mt-2">
          <AdminInput label="Category" placeholder="Wedding" {...register("category")} />
          <AdminInput label="Display Order" type="number" {...register("order", { valueAsNumber: true })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">Featured</label>
            <div className="flex items-center h-11">
              <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} className="accent-[#c9a96e]" />
                Show on Homepage
              </label>
            </div>
          </div>
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

      {/* ── Features ── */}
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

      {/* ── Highlights ── */}
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

      {/* ── Gallery Images ── */}
      <Section title="Gallery Content" count={galleryImagesField.fields.length}>
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

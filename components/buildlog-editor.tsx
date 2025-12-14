"use client";

import {
  RichTextEditor,
  type ContentField,
} from "@/components/rich-text-editor";
import { ImageUpload, type UploadedImage } from "@/components/image-upload";
import {
  createBuildLogEntry,
  updateBuildLogEntry,
  type BuildLogEntry,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

const buildLogFields: ContentField[] = [
  {
    name: "title",
    label: "Title",
    type: "text",
    placeholder: "Entry title...",
    required: true,
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    required: true,
    defaultValue: new Date().toISOString().split("T")[0],
  },
  {
    name: "social_links",
    label: "Social Links",
    type: "textarea",
    placeholder:
      "instagram: https://instagram.com/p/...\nyoutube: https://youtube.com/...",
    rows: 3,
    helpText: "Format: platform: url (one per line)",
  },
];

interface BuildLogEditorProps {
  onSuccess?: (entry?: BuildLogEntry) => void;
  existingEntry?: BuildLogEntry;
  isEditMode?: boolean;
}

export function BuildLogEditor({
  onSuccess,
  existingEntry,
  isEditMode = false,
}: BuildLogEditorProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabase = createClient();

  // Initialize images from existing entry
  useEffect(() => {
    if (existingEntry?.build_images) {
      setImages(
        existingEntry.build_images
          .filter((img) => img.path !== null)
          .map((img) => ({
            url: img.path!,
            path: img.path!,
            name: img.path!.split("/").pop() || "image",
          })),
      );
    }
  }, [existingEntry]);

  const handleSubmit = async (
    formData: Record<string, any>,
    content: string,
  ): Promise<boolean> => {
    // Get current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      alert("You must be logged in to create entries");
      return false;
    }

    const imageArray = images.map((img) => img.url);

    const socialLinksArray = formData.social_links
      ? formData.social_links
          .split("\n")
          .map((line: string) => line.trim())
          .filter((line: string) => line.length > 0)
          .map((line: string) => {
            const [platform, url] = line.split(":").map((s) => s.trim());
            return { platform, url };
          })
          .filter((link: any) => link.platform && link.url)
      : [];

    let entry;

    if (isEditMode && existingEntry) {
      // Update existing entry
      entry = await updateBuildLogEntry(
        existingEntry.id,
        {
          title: formData.title,
          date: formData.date, // Just store the YYYY-MM-DD string as-is
          content,
        },
        imageArray,
        socialLinksArray,
      );
    } else {
      // Create new entry
      entry = await createBuildLogEntry(
        {
          title: formData.title,
          date: formData.date, // Just store the YYYY-MM-DD string as-is
          content,
          user_id: session.user.id,
        },
        imageArray.length > 0 ? imageArray : undefined,
        socialLinksArray.length > 0 ? socialLinksArray : undefined,
      );
    }

    if (entry && onSuccess) {
      onSuccess(entry);
      // Reset images after successful submission (only for create mode)
      if (!isEditMode) {
        setImages([]);
      }
    }

    return !!entry;
  };

  // Prepare initial data for edit mode
  const initialData =
    isEditMode && existingEntry
      ? {
          title: existingEntry.title,
          // Just use the date string as-is from the database
          date:
            existingEntry.date?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          social_links:
            existingEntry.build_links
              ?.map((link) => `${link.platform}: ${link.link}`)
              .join("\n") || "",
        }
      : undefined;

  const initialContent =
    isEditMode && existingEntry
      ? (existingEntry.content ?? undefined)
      : undefined;

  return (
    <RichTextEditor
      title={isEditMode ? "Edit Build Log Entry" : "New Build Log Entry"}
      fields={buildLogFields}
      onSubmit={handleSubmit}
      submitButtonText={
        isEditMode ? "Update Build Log Entry" : "Create Build Log Entry"
      }
      initialData={initialData}
      initialContent={initialContent}
      extraFields={
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
            Images
          </label>
          <ImageUpload
            images={images}
            onImagesChange={setImages}
            maxImages={12}
            onSuccess={(msg) => {
              setUploadMessage({ type: "success", text: msg });
              setTimeout(() => setUploadMessage(null), 3000);
            }}
            onError={(msg) => {
              setUploadMessage({ type: "error", text: msg });
              setTimeout(() => setUploadMessage(null), 5000);
            }}
          />
          {uploadMessage && (
            <p
              className={`text-xs mt-2 ${
                uploadMessage.type === "error"
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {uploadMessage.text}
            </p>
          )}
        </div>
      }
    />
  );
}

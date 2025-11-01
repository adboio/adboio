"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

export interface ContentField {
  name: string;
  label: string;
  type: "text" | "date" | "textarea" | "url";
  placeholder?: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
  helpText?: string;
}

export interface RichTextEditorProps {
  title: string;
  fields: ContentField[];
  onSubmit: (
    data: Record<string, any>,
    htmlContent: string,
  ) => Promise<boolean>;
  onSuccess?: () => void;
  submitButtonText?: string;
  extraFields?: React.ReactNode;
  initialData?: Record<string, any>;
  initialContent?: string;
}

export function RichTextEditor({
  title,
  fields,
  onSubmit,
  onSuccess,
  submitButtonText = "Create Entry",
  extraFields,
  initialData,
  initialContent,
}: RichTextEditorProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData ||
      fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]:
            field.defaultValue ||
            (field.type === "date"
              ? new Date().toISOString().split("T")[0]
              : ""),
        }),
        {},
      ),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Preserve whitespace
        paragraph: {
          HTMLAttributes: {
            class: "whitespace-pre-wrap",
            style: "white-space: pre-wrap;",
          },
        },
      }),
    ],
    content: initialContent || "<p></p>",
    immediatelyRender: false,
    parseOptions: {
      preserveWhitespace: "full",
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 font-mono [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:my-3 [&_li]:mb-1 [&_p]:mb-3",
      },
    },
  });

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    const resetData = fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]:
          field.defaultValue ||
          (field.type === "date" ? new Date().toISOString().split("T")[0] : ""),
      }),
      {},
    );
    setFormData(resetData);
    editor?.commands.setContent("<p>Start writing...</p>");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    setIsSubmitting(true);

    const content = editor.getHTML();
    const success = await onSubmit(formData, content);

    setIsSubmitting(false);

    if (success) {
      resetForm();
      if (onSuccess) {
        onSuccess();
      }
    } else {
      alert("Failed to save entry. Check console for errors.");
    }
  };

  return (
    <div className="border border-border p-6">
      <h2 className="text-lg font-bold mb-6 uppercase tracking-wider">
        {title}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-xs font-bold mb-2 uppercase tracking-wider"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="w-full px-3 py-2 border border-border bg-background focus:outline-none focus:border-foreground font-mono text-sm"
                placeholder={field.placeholder}
                required={field.required}
                rows={field.rows || 3}
              />
            ) : (
              <input
                id={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="w-full px-3 py-2 border border-border bg-background focus:outline-none focus:border-foreground font-mono text-sm"
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            {field.helpText && (
              <p className="text-xs text-muted-foreground mt-1">
                {field.helpText}
              </p>
            )}
          </div>
        ))}

        {extraFields}

        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
            Content<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="border border-border">
            <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/30">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`px-3 py-1 border border-border text-xs font-bold transition-colors ${
                  editor?.isActive("bold")
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-muted"
                }`}
              >
                B
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`px-3 py-1 border border-border text-xs italic transition-colors ${
                  editor?.isActive("italic")
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-muted"
                }`}
              >
                I
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`px-3 py-1 border border-border text-xs transition-colors ${
                  editor?.isActive("bulletList")
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-muted"
                }`}
              >
                • UL
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={`px-3 py-1 border border-border text-xs transition-colors ${
                  editor?.isActive("orderedList")
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-muted"
                }`}
              >
                1. OL
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`px-3 py-1 border border-border text-xs font-bold transition-colors ${
                  editor?.isActive("heading", { level: 2 })
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-muted"
                }`}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`px-3 py-1 border border-border text-xs font-bold transition-colors ${
                  editor?.isActive("heading", { level: 3 })
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-muted"
                }`}
              >
                H3
              </button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 border border-border bg-foreground text-background hover:bg-background hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold uppercase tracking-wider"
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </button>
      </form>
    </div>
  );
}

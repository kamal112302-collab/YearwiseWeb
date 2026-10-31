import { ImagePlus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { mediaUrl } from "../../lib/media";

type ImageDropzoneProps = {
  label: string;
  name?: string;
  defaultUrl?: string;
  defaultPublicId?: string;
  folder?: "media" | "services";
  multiple?: boolean;
  valueField?: "url" | "publicId";
  onUploaded?: (payload: { url: string; publicId: string }) => void;
};

function previewSrc(value: string, valueField: "url" | "publicId") {
  if (!value) return "";
  if (valueField === "url" || value.startsWith("http") || value.startsWith("/")) return value;
  return mediaUrl(value, 800);
}

export function ImageDropzone({
  label,
  name,
  defaultUrl = "",
  defaultPublicId = "",
  folder = "media",
  multiple = false,
  valueField = "url",
  onUploaded,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initialValue = valueField === "publicId" ? defaultPublicId : defaultUrl;
  const [value, setValue] = useState(initialValue);
  const [preview, setPreview] = useState(previewSrc(initialValue, valueField));
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputId = `${name ?? label}-file`.toLowerCase().replace(/\s+/g, "-");

  async function uploadFiles(files: File[]) {
    const queue = multiple ? files : files.slice(0, 1);
    if (queue.length === 0) return;
    setUploading(true);
    setError("");
    let latestValue = value;
    let latestPreview = preview;
    try {
      for (const file of queue) {
        if (!file.type.startsWith("image/")) {
          throw new Error("Use a JPG, PNG, WebP, or GIF.");
        }
        if (file.size > 8 * 1024 * 1024) {
          throw new Error("Image must be under 8 MB.");
        }
        const body = new FormData();
        body.set("file", file);
        body.set("folder", folder);
        body.set("alt", file.name.replace(/\.[^.]+$/, ""));
        const response = await fetch("/admin/api/media-upload", { method: "POST", body });
        const payload = (await response.json().catch(() => null)) as
          | { url?: string; publicId?: string; error?: string }
          | null;
        if (!response.ok || !payload?.url || !payload.publicId) {
          throw new Error(payload?.error || "Upload failed.");
        }
        latestValue = valueField === "publicId" ? payload.publicId : payload.url;
        latestPreview = payload.url;
        setValue(latestValue);
        setPreview(latestPreview);
        onUploaded?.({ url: payload.url, publicId: payload.publicId });
      }
      if (multiple) {
        setValue("");
        setPreview("");
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      if (latestValue && !multiple) {
        setValue(latestValue);
        setPreview(latestPreview);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-brand-navy">{label}</p>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <label
        htmlFor={inputId}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void uploadFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "flex min-h-44 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-4 py-6 text-center transition-colors",
          dragging ? "border-brand-green bg-brand-mint" : "border-brand-green/30 bg-brand-surface hover:border-brand-green",
          uploading && "pointer-events-none opacity-70",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            void uploadFiles(Array.from(event.target.files ?? []));
          }}
        />
        {preview && !multiple ? (
          <img src={preview} alt="" className="h-36 w-full rounded-xl object-cover" />
        ) : (
          <span className="flex size-12 items-center justify-center rounded-full bg-white text-brand-green">
            {uploading ? <Upload className="size-5" aria-hidden /> : <ImagePlus className="size-5" aria-hidden />}
          </span>
        )}
        <span className="text-sm text-brand-navy">
          {uploading ? "Uploading…" : "Drop an image here, or click to browse"}
        </span>
        <span className="text-xs text-muted-foreground">JPG, PNG, WebP, or GIF. Up to 8 MB.</span>
      </label>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {value && name ? (
        <button
          type="button"
          className="self-start text-sm font-medium text-brand-navy underline-offset-2 hover:underline cursor-pointer"
          onClick={() => {
            setValue("");
            setPreview("");
          }}
        >
          Remove image
        </button>
      ) : null}
    </div>
  );
}

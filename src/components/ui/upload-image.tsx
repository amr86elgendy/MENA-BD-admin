import React from "react";
import {
  useDropzone,
  type DropzoneOptions,
  type DropzoneState,
} from "react-dropzone";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { File } from "buffer";

const UploadContext = React.createContext<DropzoneState | null>(null);

function useUpload() {
  const context = React.useContext(UploadContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

function Upload({
  children,
  ...options
}: {
  children: React.ReactNode;
} & DropzoneOptions) {
  const dropzone = useDropzone({
    multiple: false,
    onDrop: options?.onDrop,
    accept: {
      "image/*": [],
    },
    ...options,
  });
  return (
    <UploadContext.Provider value={dropzone}>{children}</UploadContext.Provider>
  );
}

const UploadArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  const { getRootProps } = useUpload();
  return <div ref={ref} {...getRootProps()} {...props} />;
});

UploadArea.displayName = "UploadArea";

const UploadTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLLabelElement>
>(({ className, children, ...props }, ref) => {
  const { getInputProps } = useUpload();
  return (
    <div ref={ref}>
      <Input type="file" {...getInputProps({ name: "base64" })} />
      <Label className={cn("pointer-events-auto", className)} {...props}>
        {children}
      </Label>
    </div>
  );
});

UploadTrigger.displayName = "UploadTrigger";

const mapper = {
  "file-invalid-type": (file: globalThis.File) =>
    `".${file.name.split(".")[1]}" File format is not allowed`,
} as const;

const UploadError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { fileRejections } = useUpload();
  return fileRejections.map(({ file, errors }) =>
    errors.map((err) => {
      return (
        <p ref={ref} {...props} className={cn("text-red-500", className)}>
          {children ?? mapper[err.code as keyof typeof mapper](file)}
        </p>
      );
    })
  );
});

UploadError.displayName = "UploadError";

export { Upload, UploadArea, UploadTrigger, UploadError };

import Image from "next/image";

type MediaProps = {
  src: string | null;
  alt: string;
  label: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function Media({
  src,
  alt,
  label,
  className = "",
  priority = false,
  sizes = "100vw",
}: MediaProps) {
  const classes = `media-placeholder ${src ? "has-image" : ""} ${className}`.trim();

  if (src) {
    const runtimeUpload = src.startsWith("/uploads/");
    return (
      <div className={classes}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          unoptimized={runtimeUpload}
        />
      </div>
    );
  }

  return (
    <div className={classes} role="img" aria-label={label}>
      <span className="media-mark" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

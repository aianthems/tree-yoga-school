import type { ComponentPropsWithoutRef } from "react";
import images from "../../lib/responsive-images.json";

type Props = Omit<ComponentPropsWithoutRef<"img">, "src" | "srcSet" | "loading" | "fetchPriority"> & {
  image: keyof typeof images;
  sizes: string;
  priority?: boolean;
};

// Full-frame, pre-sized assets: the browser chooses one file, with no image API
// or client-side sizing work. The content hash makes immutable caching safe.
export default function ResponsiveImage({ image, sizes, priority = false, width, height, ...props }: Props) {
  const asset = images[image];
  const fallback = asset.variants.find(variant => variant.width === (image === "logo" ? 192 : 1200))!;
  return <img {...props} src={fallback.src}
    srcSet={asset.variants.map(variant => `${variant.src} ${variant.width}w`).join(", ")}
    sizes={sizes} width={width ?? asset.width} height={height ?? asset.height}
    loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />;
}

import Image from "next/image";
import type { Photo as PhotoType } from "@/content/images";

type Props = {
  photo: PhotoType;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * Foto que llena su contenedor (el contenedor define la proporción con aspect-*).
 * Funciona igual con fotos locales o remotas, así que reemplazarlas es solo cambiar el src.
 */
export function Photo({ photo, sizes, priority, className = "" }: Props) {
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      style={{ objectPosition: photo.focus ?? "50% 50%" }}
    />
  );
}

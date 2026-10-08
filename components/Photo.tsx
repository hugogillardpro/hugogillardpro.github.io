import Image, { type ImageProps } from 'next/image';
import type { Img } from '@/lib/images';

type Props = Omit<ImageProps, 'src' | 'width' | 'height' | 'alt' | 'placeholder' | 'blurDataURL'> & {
  image: Img;
  alt: string;
};

// Une image du manifeste : le chargeur (lib/image-loader.ts) retrouve les variantes WebP
// grâce à la largeur d'origine ajoutée après « ~ ».
export default function Photo({ image, alt, ...reste }: Props) {
  return (
    <Image
      src={`${image.id}~${image.width}`}
      width={image.width}
      height={image.height}
      alt={alt}
      placeholder="blur"
      blurDataURL={image.blur}
      {...reste}
    />
  );
}

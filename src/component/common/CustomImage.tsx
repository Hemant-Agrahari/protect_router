import React from 'react';
import Image, { ImageProps } from 'next/image';
/**
 * CustomImage is a wrapper around the Next.js `Image` component, providing a streamlined way to display images
 * with the benefits of automatic optimization, such as responsive resizing, lazy loading, and more.
 * 
 * It accepts all the standard props from the `Image` component in Next.js, including `src`, `alt`, `width`, `height`,
 * and any other properties that are supported by the Next.js `Image` component.
 * */

const CustomImage: React.FC<ImageProps> = ({ src, alt, width, height,className, ...props }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default CustomImage;

import { useState, useEffect } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export function Image({ src, alt, fallback = '/placeholder.webp', className = '', style = {}, ...props }: ImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
  }, [src]);

  // Convert to WebP if possible
  const webpSrc = imageSrc.replace(/\.(jpe?g|png)$/i, '.webp');

  const imageStyle = {
    ...style,
    objectFit: 'cover' as const,
    height: '100%',
    width: '100%',
  };

  return (
    <>
      <picture className={`${className} ${isLoading ? 'animate-pulse' : ''}`}>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageSrc(fallback);
            setIsLoading(false);
          }}
          className={`${className} transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          style={imageStyle}
          {...props}
        />
      </picture>
      {isLoading && (
        <div className={`${className} absolute inset-0 bg-gray-200 rounded`} />
      )}
    </>
  );
}
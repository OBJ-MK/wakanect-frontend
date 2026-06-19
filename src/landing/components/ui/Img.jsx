/**
 * Image with a built-in warm-gradient placeholder. Until a real file exists at `src`
 * (drop yours into /public/images/), the gradient + grain shows — so layouts never
 * look broken. Set `tone="dark"` for a neutral navy placeholder instead.
 *
 * Emits a <picture> with a WebP source (derived by swapping the extension) and the
 * original as fallback. Pass `width`/`height` to lock intrinsic ratio (no CLS) and
 * `eager` for above-the-fold images.
 */
export default function Img({
  src,
  alt,
  className = '',
  imgClassName = '',
  tone = 'warm',
  width,
  height,
  eager = false,
  children,
}) {
  const bg = tone === 'dark' ? 'bg-navy-dark' : 'gradient-warm';
  const webp = src && /\.(jpe?g|png)$/i.test(src) ? src.replace(/\.(jpe?g|png)$/i, '.webp') : null;

  return (
    <div className={`relative overflow-hidden ${bg} ${className}`}>
      {src && (
        <picture>
          {webp && <source srcSet={webp} type="image/webp" />}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={`relative z-[1] h-full w-full object-cover ${imgClassName}`}
            onError={(e) => {
              e.currentTarget.closest('picture').style.display = 'none';
            }}
          />
        </picture>
      )}
      {children}
    </div>
  );
}

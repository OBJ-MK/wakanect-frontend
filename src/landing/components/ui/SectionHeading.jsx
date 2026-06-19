export default function SectionHeading({ eyebrow, title, intro, align = 'left', className = '' }) {
  const isCenter = align === 'center';
  return (
    <div className={`${isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <span data-reveal className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-orange" />
          {eyebrow}
        </span>
      )}
      <h2 data-reveal className="mt-5 font-display text-display-md font-bold">
        {title}
      </h2>
      {intro && (
        <p data-reveal className={`mt-5 text-pretty text-lg text-cream/65 ${isCenter ? 'mx-auto' : ''} max-w-prose`}>
          {intro}
        </p>
      )}
    </div>
  );
}

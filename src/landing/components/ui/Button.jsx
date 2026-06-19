import { useRef } from 'react';
import { prefersReducedMotion } from '../../lib/gsap';

const base =
  'group relative inline-flex items-center justify-center gap-2 font-medium rounded-xl ' +
  'transition-[transform,background-color,border-color,box-shadow] duration-200 ease-out ' +
  'select-none whitespace-nowrap active:scale-[0.98] focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-amber';

const sizes = {
  md: 'h-11 px-5 text-[0.95rem]',
  lg: 'h-[3.25rem] px-7 text-base',
};

const variants = {
  primary:
    'bg-orange text-navy-deep shadow-[0_10px_30px_-12px_rgba(236,94,42,0.7)] ' +
    'hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_18px_40px_-14px_rgba(236,94,42,0.85)]',
  ghost:
    'border border-cream/25 text-cream hover:border-amber/70 hover:bg-cream/[0.06] hover:-translate-y-0.5',
  link: 'text-orange hover:text-amber px-0 h-auto rounded-none',
};

export default function Button({
  as = 'a',
  variant = 'primary',
  size = 'md',
  magnetic = false,
  className = '',
  children,
  ...props
}) {
  const ref = useRef(null);
  const Tag = as;

  const onMove = (e) => {
    if (!magnetic || prefersReducedMotion) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${variant !== 'link' ? sizes[size] : ''} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

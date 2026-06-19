import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export default function StickyCta() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('wk-cta-dismissed') === '1'
  );

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      aria-hidden={!show}
      {...(!show ? { inert: '' } : {})}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-transform duration-500 ease-out lg:hidden ${
        show ? 'translate-y-0' : 'translate-y-[150%]'
      }`}
    >
      <div className="glass flex items-center gap-2 rounded-2xl border-cream/15 bg-navy/90 p-2 shadow-lift">
        <Link
          to="/register"
          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-orange font-semibold text-navy-deep active:scale-[0.98]"
        >
          Essayer gratuitement
        </Link>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            localStorage.setItem('wk-cta-dismissed', '1');
          }}
          aria-label="Masquer"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-cream/60 hover:bg-cream/10"
        >
          <Icon name="x" size={20} />
        </button>
      </div>
    </div>
  );
}

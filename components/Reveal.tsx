'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Fait apparaître un bloc en douceur quand il entre dans l'écran.
// Sans JavaScript (ou avec « réduire les animations »), le bloc est simplement visible.
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('est-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (e.isIntersecting) {
            el.classList.add('est-visible');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const classes = ['reveal', delay ? `reveal--${delay}` : '', className].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
}

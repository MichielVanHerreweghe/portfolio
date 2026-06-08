/* primitives.jsx — shared UI primitives: useReveal, Reveal, Button, Kicker, Marquee */
import { useEffect, useRef } from 'react';

/* ---- scroll reveal hook ---- */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("in");
    // reveal immediately if already within (or near) the viewport
    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < (window.innerHeight || 800) * 0.96 && r.bottom > 0;
    };
    // Synchronous (not rAF): when App arms reveals on mount, already-in-view
    // elements must already carry `.in` so html.reveal-armed can't blink them
    // out. Child effects run before App's, so this lands first.
    if (inView()) { show(); return; }
    let done = false;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting && !done) { done = true; show(); io.disconnect(); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    // failsafe: if the observer never fires, reveal on scroll/timer
    const onScroll = () => { if (!done && inView()) { done = true; show(); io.disconnect(); window.removeEventListener("scroll", onScroll); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = setTimeout(() => { if (!done) { done = true; show(); io.disconnect(); } }, 2600);
    return () => { io.disconnect(); clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);
  return ref;
}

export function Reveal({ children, delay = 0, as = "div", className = "", style = {}, ...rest }) {
  const ref = useReveal();
  const Tag = as;
  return <Tag ref={ref} className={"reveal " + className} style={{ transitionDelay: delay + "ms", ...style }} {...rest}>{children}</Tag>;
}

/* ---- button ---- */
export function Button({ children, variant = "primary", as = "button", icon, className = "", ...rest }) {
  const Tag = as;
  return (
    <Tag className={"btn btn-" + variant + (className ? " " + className : "")} {...rest}>
      {children}{icon}
    </Tag>
  );
}

/* ---- kicker ---- */
export function Kicker({ children, noRule }) {
  return <span className={"kicker" + (noRule ? " no-rule" : "")}>{children}</span>;
}

/* ---- marquee ---- */
export function Marquee({ items }) {
  return (
    <div className="marquee">
      <div className="marquee-track">
        <span className="marquee-item">{items.map((t, i) => <span key={i} style={{ display: "inline-flex", gap: 56 }}>{t}<span style={{ color: "var(--volt-text)" }}>/</span></span>)}</span>
        <span className="marquee-item" aria-hidden="true">{items.map((t, i) => <span key={i} style={{ display: "inline-flex", gap: 56 }}>{t}<span style={{ color: "var(--volt-text)" }}>/</span></span>)}</span>
      </div>
    </div>
  );
}

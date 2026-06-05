/* ContactFooter.jsx — contact CTA band, form with validation, footer bar */
import { useState } from 'react';
import { Icon } from './icons.jsx';
import { Button, Reveal, Kicker } from './primitives.jsx';
import { useT } from '../lib/i18n.jsx';
import { sendContactMail } from '../lib/api.js';

export function ContactFooter({ go }) {
  const { C } = useT();
  const u = C.ui;
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(false);
  const [err, setErr] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  // Mirror the backend's FluentValidation rules so invalid input is caught
  // before the request rather than coming back as a 400.
  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const next = {};
    if (form.name.trim().length < 6) next.name = true;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) next.email = true;
    if (form.message.trim().length < 10) next.message = true;
    setErr(next);
    if (Object.keys(next).length > 0) return;

    setSendErr(false);
    setSending(true);
    try {
      await sendContactMail({
        senderName: form.name.trim(),
        senderEmailAddress: form.email.trim(),
        message: form.message.trim(),
      });
      setSent(true);
    } catch {
      setSendErr(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <footer id="contact" style={{ borderTop: "1px solid var(--line)", marginTop: 0, background: "var(--bg)" }}>
      {/* CTA band */}
      <div className="wrap" style={{ padding: "110px 40px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 64, alignItems: "start" }} className="contact-grid">
          <div>
            <Reveal><Kicker>{u.contactKicker}</Kicker></Reveal>
            <Reveal delay={60}>
              <h2 className="display" style={{ fontSize: "clamp(40px, 6vw, 84px)", marginTop: 26 }}>
                {u.contactH1a}<br />{u.contactH1b}<span style={{ color: "var(--volt-text)" }}>{u.contactH1c}</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p style={{ fontSize: 19, color: "var(--muted)", maxWidth: 440, marginTop: 26, lineHeight: 1.6 }}>
                {u.contactP}
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 4 }}>
                {C.socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" className="footer-social" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--line-soft)", maxWidth: 440 }}>
                    <span style={{ fontWeight: 600, fontSize: 18 }}>{s.label}</span>
                    <span className="mono" style={{ color: "var(--faint)", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 10 }}>{s.handle} <Icon.arrowUR /></span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={120}>
            <div className="card" style={{ padding: 28 }}>
              {sent ? (
                <div style={{ padding: "40px 8px", textAlign: "center" }}>
                  <div style={{ width: 54, height: 54, borderRadius: 99, background: "var(--volt)", color: "#0B0B0C", display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <h3 style={{ fontSize: 24 }}>{u.sentTitle}</h3>
                  <p style={{ color: "var(--muted)", marginTop: 10, fontSize: 16 }}>{u.sentBody(form.name.trim().split(" ")[0] || "")}</p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className="mono" style={{ fontSize: 12, letterSpacing: "0.18em", color: "var(--faint)", marginBottom: 20 }}>{u.sendLabel}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <input className="field" placeholder={u.phName} value={form.name} onChange={set("name")} style={err.name ? { borderColor: "#ff6b6b" } : {}} />
                    </div>
                    <div>
                      <input className="field" placeholder={u.phEmail} value={form.email} onChange={set("email")} style={err.email ? { borderColor: "#ff6b6b" } : {}} />
                    </div>
                    <div>
                      <textarea className="field" placeholder={u.phMsg} rows={4} value={form.message} onChange={set("message")} style={{ resize: "vertical", ...(err.message ? { borderColor: "#ff6b6b" } : {}) }} />
                    </div>
                    {sendErr && (
                      <div role="alert" style={{ color: "#ff6b6b", fontSize: 14, lineHeight: 1.5 }}>{u.sendError}</div>
                    )}
                    <Button type="submit" icon={<Icon.arrow />} disabled={sending} style={{ justifyContent: "center", width: "100%", marginTop: 4, ...(sending ? { opacity: 0.6, pointerEvents: "none" } : {}) }}>{sending ? u.sending : u.sendMsg}</Button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>

      {/* bottom bar */}
      <div style={{ borderTop: "1px solid var(--line)" }}>
        <div className="wrap" style={{ padding: "26px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <span className="mono" style={{ fontSize: 13, color: "var(--faint)", letterSpacing: "0.08em" }}>© {new Date().getFullYear()} {C.name}</span>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="mono" style={{ fontSize: 13, color: "var(--faint)", background: "none", border: "none", letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: 8 }}>
            {u.backToTop} <span style={{ color: "var(--volt-text)" }}>↑</span>
          </button>
        </div>
      </div>

      <style>{`
        .footer-social:hover .mono { color: var(--volt-text); }
        @media (max-width: 820px){ .contact-grid { grid-template-columns: 1fr !important; gap: 44px !important; } }
      `}</style>
    </footer>
  );
}

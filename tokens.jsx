// Shared design tokens, icons, primitive components for the meeting app.
// All screens read from window.__TOKENS so Tweaks can swap them live.

const ICONS = {
  back: 'M15 6l-6 6 6 6',
  forward: 'M9 6l6 6-6 6',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12l5 5 9-10',
  plus: 'M12 5v14M5 12h14',
  search: 'M11 4a7 7 0 1 0 4.9 12L20 20M11 4a7 7 0 0 1 7 7',
  bell: 'M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 20a2 2 0 0 0 4 0',
  calendar: 'M4 7h16M4 7v12a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M8 3v3M16 3v3',
  list: 'M4 6h16M4 12h16M4 18h16',
  pin: 'M12 2a6 6 0 0 0-6 6c0 5 6 12 6 12s6-7 6-12a6 6 0 0 0-6-6zM12 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  clock: 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 21a6 6 0 0 1 12 0M16 3a4 4 0 0 1 0 8M21 21a6 6 0 0 0-5-5.91',
  doc: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5zM14 3v5h5',
  qr: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h3v3h-3zM18 18h3M14 21h3M21 14v3M18 21v-3',
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.5a7 7 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.4 2.4-.9a7 7 0 0 0 2 1.2L10 21h4l.5-2.5a7 7 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
  briefcase: 'M3 9h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9zM8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3',
  edit: 'M4 20h4l10-10-4-4L4 16v4zM14 6l4 4',
  trash: 'M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13',
  flag: 'M5 21V4M5 4h12l-2 4 2 4H5',
  attach: 'M21 12l-8.5 8.5a5 5 0 0 1-7-7L14 5a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-2.8-2.8L15 8',
  arrow_right: 'M5 12h14M13 5l7 7-7 7',
  filter: 'M3 5h18l-7 9v6l-4-2v-4z',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5',
  warning: 'M12 4l10 17H2zM12 10v5M12 18v.5',
  refresh: 'M4 12a8 8 0 0 1 14-5.3L21 9M21 4v5h-5M20 12a8 8 0 0 1-14 5.3L3 15M3 20v-5h5',
};

function Icon({ d, size = 20, stroke = 'currentColor', sw = 1.6, fill = 'none', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={ICONS[d] || d} />
    </svg>
  );
}

// ─── Avatar ────────────────────────────────────────────────────
function Avatar({ name = '', size = 32, bg, fg = '#fff', style }) {
  const initial = name ? name.slice(-1) : '?';
  // deterministic muted color from name
  const palette = ['#3a3a3a', '#4a4a4a', '#5a5a5a', '#2c3e50', '#34495e', '#475569', '#525252', '#1f2937'];
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) | 0;
  const color = bg || palette[Math.abs(h) % palette.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: fg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 500, flexShrink: 0,
      letterSpacing: 0, userSelect: 'none', ...style,
    }}>{initial}</div>
  );
}

// ─── Status pill ───────────────────────────────────────────────
function Pill({ children, tone = 'neutral', size = 'sm', style }) {
  const tones = {
    neutral: { bg: 'var(--c-pill-bg)', fg: 'var(--c-pill-fg)' },
    accent:  { bg: 'var(--c-accent-soft)', fg: 'var(--c-accent)' },
    success: { bg: 'rgba(46,125,50,0.10)', fg: '#2e7d32' },
    warning: { bg: 'rgba(180,83,9,0.10)', fg: '#b45309' },
    danger:  { bg: 'rgba(176,30,45,0.10)', fg: '#b01e2d' },
    inverse: { bg: '#1a1a1a', fg: '#fafaf7' },
  };
  const t = tones[tone] || tones.neutral;
  const sizes = {
    xs: { padding: '2px 7px', fontSize: 10, h: 18 },
    sm: { padding: '3px 9px', fontSize: 11, h: 22 },
    md: { padding: '5px 11px', fontSize: 12, h: 26 },
  };
  const sz = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: t.bg, color: t.fg,
      padding: sz.padding, fontSize: sz.fontSize, height: sz.h, boxSizing: 'border-box',
      borderRadius: 'var(--r-pill)', fontWeight: 500, letterSpacing: 0.1,
      lineHeight: 1, whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  );
}

// ─── Top bar (custom, not the stock M3 one) ────────────────────
function TopBar({ title, subtitle, leading, trailing, border = true, style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '12px 16px', minHeight: 52, boxSizing: 'border-box',
      borderBottom: border ? '1px solid var(--c-divider)' : 'none',
      background: 'var(--c-surface)', ...style,
    }}>
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', letterSpacing: 0.4, textTransform: 'uppercase' }}>{subtitle}</div>}
        {title && <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.1, lineHeight: 1.2 }}>{title}</div>}
      </div>
      {trailing}
    </div>
  );
}

// Round icon button used for back/close/etc
function IconBtn({ d, onClick, size = 36, iconSize = 20, style, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: size, height: size, borderRadius: 'var(--r-control)',
      background: 'transparent', border: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--c-text)', padding: 0, ...style,
    }}>
      <Icon d={d} size={iconSize} />
    </button>
  );
}

// ─── Buttons ───────────────────────────────────────────────────
function Btn({ children, variant = 'primary', onClick, full, disabled, leading, style }) {
  const variants = {
    primary: { bg: 'var(--c-accent)', fg: 'var(--c-on-accent)', bd: 'transparent' },
    secondary: { bg: 'var(--c-surface)', fg: 'var(--c-text)', bd: 'var(--c-border)' },
    ghost: { bg: 'transparent', fg: 'var(--c-text)', bd: 'transparent' },
    danger: { bg: 'transparent', fg: '#b01e2d', bd: 'rgba(176,30,45,0.3)' },
  };
  const v = variants[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? '100%' : 'auto',
      height: 48, padding: '0 20px',
      borderRadius: 'var(--r-control)',
      background: v.bg, color: v.fg, border: `1px solid ${v.bd}`,
      fontSize: 15, fontWeight: 500, letterSpacing: 0.1,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'inherit', ...style,
    }}>
      {leading}
      {children}
    </button>
  );
}

// ─── Field (text input) ────────────────────────────────────────
function Field({ label, value, placeholder, onChange, type = 'text', trailing, hint, multiline, style }) {
  const Cmp = multiline ? 'textarea' : 'input';
  return (
    <label style={{ display: 'block', ...style }}>
      {label && (
        <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginBottom: 6, fontWeight: 500, letterSpacing: 0.2 }}>{label}</div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
        borderRadius: 'var(--r-input)', padding: multiline ? '10px 12px' : '0 12px',
        minHeight: multiline ? 76 : 44,
      }}>
        <Cmp
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          rows={multiline ? 3 : undefined}
          style={{
            flex: 1, border: 'none', background: 'transparent',
            outline: 'none', color: 'var(--c-text)', fontSize: 15,
            fontFamily: 'inherit', resize: 'none',
            padding: multiline ? 0 : 0, lineHeight: 1.4,
          }}
        />
        {trailing}
      </div>
      {hint && <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 4 }}>{hint}</div>}
    </label>
  );
}

// ─── List row ──────────────────────────────────────────────────
function Row({ leading, title, subtitle, trailing, onClick, style }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px', minHeight: 56, boxSizing: 'border-box',
      cursor: onClick ? 'pointer' : 'default',
      borderBottom: '1px solid var(--c-divider)',
      background: 'var(--c-surface)', ...style,
    }}>
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 15, color: 'var(--c-text)', fontWeight: 500, letterSpacing: -0.05 }}>{title}</div>}
        {subtitle && <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {trailing}
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────
function Empty({ icon, title, hint }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, gap: 12, color: 'var(--c-text-tertiary)',
    }}>
      {icon && <Icon d={icon} size={32} stroke="var(--c-text-tertiary)" sw={1.4} />}
      <div style={{ fontSize: 14, color: 'var(--c-text-secondary)', textAlign: 'center' }}>{title}</div>
      {hint && <div style={{ fontSize: 12, textAlign: 'center', maxWidth: 240, lineHeight: 1.5 }}>{hint}</div>}
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────
function SectionHead({ children, action, style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 16px 8px', ...style,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--c-text-tertiary)' }}>{children}</div>
      {action}
    </div>
  );
}

// Tab bar at bottom of phone
function TabBar({ items, current, onChange }) {
  return (
    <div style={{
      display: 'flex', borderTop: '1px solid var(--c-divider)',
      background: 'var(--c-surface)', padding: '6px 0 4px',
    }}>
      {items.map((it) => {
        const active = it.id === current;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 0', color: active ? 'var(--c-accent)' : 'var(--c-text-tertiary)',
            fontFamily: 'inherit',
          }}>
            <Icon d={it.icon} size={22} sw={active ? 1.8 : 1.4} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, letterSpacing: 0.2 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// In-app banner (live reminder)
function Banner({ tone = 'accent', icon, title, body, action, onDismiss, style }) {
  const tones = {
    accent: { bg: 'var(--c-accent)', fg: 'var(--c-on-accent)' },
    warning: { bg: '#b45309', fg: '#fff' },
    success: { bg: '#2e7d32', fg: '#fff' },
  };
  const t = tones[tone];
  return (
    <div style={{
      background: t.bg, color: t.fg,
      padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
      ...style,
    }}>
      {icon && <Icon d={icon} size={18} stroke={t.fg} sw={1.8} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.1 }}>{title}</div>}
        {body && <div style={{ fontSize: 11, opacity: 0.85, marginTop: 1 }}>{body}</div>}
      </div>
      {action && (
        <button onClick={action.onClick} style={{
          background: 'rgba(255,255,255,0.18)', color: t.fg, border: 'none',
          padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.2,
        }}>{action.label}</button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} style={{
          background: 'transparent', color: t.fg, border: 'none', opacity: 0.7,
          width: 24, height: 24, borderRadius: 999, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        }}><Icon d="close" size={14} stroke={t.fg} sw={2} /></button>
      )}
    </div>
  );
}

Object.assign(window, {
  Icon, Avatar, Pill, TopBar, IconBtn, Btn, Field, Row, Empty, SectionHead, TabBar, Banner,
});

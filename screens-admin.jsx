// Admin (HR) screens: meeting create form, meeting list with confirm status, attendance dashboard.

// ─── Pickers ─────────────────────────────────────────
function PopoverSheet({ title, onClose, children, footer }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'flex-end', animation: 'fadeIn .15s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxHeight: '80%', background: 'var(--c-surface)',
        borderTopLeftRadius: 18, borderTopRightRadius: 18,
        display: 'flex', flexDirection: 'column', animation: 'slideUp .2s ease-out',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.18)',
      }}>
        <div style={{
          padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--c-divider)',
        }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', fontSize: 13, color: 'var(--c-text-secondary)',
            cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0',
          }}>取消</button>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text)' }}>{title}</div>
          <div style={{ width: 28 }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>{children}</div>
        {footer && <div style={{ padding: 12, borderTop: '1px solid var(--c-divider)', background: 'var(--c-surface)' }}>{footer}</div>}
      </div>
    </div>
  );
}

function DatePicker({ value, onChange, onClose }) {
  // value 'YYYY-MM-DD'
  const today = new Date('2026-04-25');
  const [cur, setCur] = React.useState(() => {
    const [y, m] = value.split('-').map(Number);
    return { y, m };
  });
  const monthDays = (y, m) => new Date(y, m, 0).getDate();
  const firstDow = (y, m) => new Date(`${y}-${String(m).padStart(2,'0')}-01`).getDay();

  const days = monthDays(cur.y, cur.m);
  const fdow = firstDow(cur.y, cur.m);
  const cells = [];
  for (let i = 0; i < fdow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  const fmt = (d) => `${cur.y}-${String(cur.m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const isToday = (d) => fmt(d) === '2026-04-25';

  const shift = (delta) => {
    let { y, m } = cur;
    m += delta;
    if (m < 1) { m = 12; y -= 1; }
    if (m > 12) { m = 1; y += 1; }
    setCur({ y, m });
  };

  return (
    <PopoverSheet title="选择日期" onClose={onClose}>
      <div style={{ padding: 16 }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button onClick={() => shift(-1)} style={{
            width: 34, height: 34, borderRadius: 8, border: '1px solid var(--c-border)',
            background: 'var(--c-surface)', cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
          }}><Icon d="back" size={14} stroke="var(--c-text)" /></button>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--c-text)' }}>
            {cur.y} 年 {cur.m} 月
          </div>
          <button onClick={() => shift(1)} style={{
            width: 34, height: 34, borderRadius: 8, border: '1px solid var(--c-border)',
            background: 'var(--c-surface)', cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', transform: 'rotate(180deg)',
          }}><Icon d="back" size={14} stroke="var(--c-text)" /></button>
        </div>

        {/* Weekdays */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
          {['日','一','二','三','四','五','六'].map(w => (
            <div key={w} style={{ textAlign: 'center', fontSize: 11, color: 'var(--c-text-tertiary)', fontWeight: 500 }}>{w}</div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} style={{ height: 38 }} />;
            const dStr = fmt(d);
            const sel = dStr === value;
            const tod = isToday(d);
            return (
              <button key={i} onClick={() => { onChange(dStr); onClose(); }} style={{
                height: 38, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: sel ? 'var(--c-text)' : 'transparent',
                  color: sel ? 'var(--c-surface)' : 'var(--c-text)',
                  border: !sel && tod ? '1px solid var(--c-text)' : 'none',
                  fontSize: 13, fontWeight: tod ? 700 : 500,
                  fontVariantNumeric: 'tabular-nums',
                }}>{d}</div>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--c-text-secondary)' }}>已选</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        </div>
      </div>
    </PopoverSheet>
  );
}

function TimePicker({ title, value, onChange, onClose, minTime }) {
  // 30-min increments from 07:00 to 22:00
  const slots = React.useMemo(() => {
    const arr = [];
    for (let h = 7; h <= 22; h++) {
      arr.push(`${String(h).padStart(2,'0')}:00`);
      if (h < 22) arr.push(`${String(h).padStart(2,'0')}:30`);
    }
    return arr;
  }, []);
  // scroll to current value on open
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (scrollRef.current) {
      const idx = slots.indexOf(value);
      if (idx >= 0) scrollRef.current.scrollTop = Math.max(0, idx * 44 - 80);
    }
  }, []); // eslint-disable-line

  const ge = (a, b) => a >= b;

  return (
    <PopoverSheet title={title} onClose={onClose}>
      <div ref={scrollRef} style={{ maxHeight: 420, overflowY: 'auto' }}>
        {slots.map(s => {
          const disabled = minTime && !ge(s, minTime);
          const sel = s === value;
          return (
            <button key={s} disabled={disabled} onClick={() => { onChange(s); onClose(); }} style={{
              width: '100%', padding: '14px 18px', border: 'none', background: 'transparent',
              borderBottom: '1px solid var(--c-divider)', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'inherit', cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.35 : 1,
            }}>
              <span style={{
                fontSize: 16, color: sel ? 'var(--c-text)' : 'var(--c-text-secondary)',
                fontWeight: sel ? 600 : 400, fontVariantNumeric: 'tabular-nums', letterSpacing: 0.5,
              }}>{s}</span>
              {sel && <Icon d="check" size={18} stroke="var(--c-text)" sw={2.2} />}
            </button>
          );
        })}
      </div>
    </PopoverSheet>
  );
}

const ATTENDEE_DIRECTORY = [
  { name: '李思琪', dept: '勘探部', title: '主任工程师' },
  { name: '王浩然', dept: '开发部', title: '高级工程师' },
  { name: '赵小冉', dept: '开发部', title: '工程师' },
  { name: '周明',   dept: '工程技术部', title: '主任工程师' },
  { name: '陈敏',   dept: '人力资源部', title: '部长' },
  { name: '杨建国', dept: '安全环保部', title: 'HSE 主管' },
  { name: '张建军', dept: '勘探部', title: '部长' },
  { name: '王志刚', dept: '开发部', title: '部长' },
  { name: '李震东', dept: '工程技术部', title: '部长' },
  { name: '赵文锐', dept: '安全环保部', title: '部长' },
  { name: '周雪峰', dept: '财务部', title: '部长' },
  { name: '孙丽',   dept: '综合办公室', title: '主任' },
  { name: '刘洋',   dept: '勘探部', title: '工程师' },
  { name: '马辉',   dept: '工程技术部', title: '工程师' },
  { name: '韩晓燕', dept: '人力资源部', title: '专员' },
  { name: '高鹏',   dept: '财务部', title: '会计师' },
];

function AttendeePicker({ value, onChange, onClose }) {
  const [draft, setDraft] = React.useState(value);
  const [q, setQ] = React.useState('');
  const filtered = ATTENDEE_DIRECTORY.filter(p =>
    !q || p.name.includes(q) || p.dept.includes(q) || p.title.includes(q)
  );
  // group by dept
  const groups = {};
  filtered.forEach(p => { (groups[p.dept] ||= []).push(p); });
  const toggle = (name) => {
    setDraft(d => d.includes(name) ? d.filter(x => x !== name) : [...d, name]);
  };
  return (
    <PopoverSheet
      title={`选择参会人 · 已选 ${draft.length}`}
      onClose={onClose}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn variant="secondary" onClick={() => { setDraft([]); }} style={{ height: 42 }}>清空</Btn>
          <Btn full onClick={() => { onChange(draft); onClose(); }} style={{ height: 42 }}>确定 · {draft.length} 人</Btn>
        </div>
      }
    >
      {/* search */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--c-divider)', background: 'var(--c-surface)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
          borderRadius: 999, padding: '6px 12px',
        }}>
          <Icon d="search" size={15} stroke="var(--c-text-tertiary)" />
          <input
            value={q} onChange={e => setQ(e.target.value)} placeholder="搜索姓名 / 部门"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontSize: 13, color: 'var(--c-text)', fontFamily: 'inherit',
            }}
          />
          {q && (
            <button onClick={() => setQ('')} style={{
              border: 'none', background: 'transparent', color: 'var(--c-text-tertiary)',
              cursor: 'pointer', padding: 0, fontFamily: 'inherit', fontSize: 14,
            }}>×</button>
          )}
        </div>
      </div>

      {/* selected chips */}
      {draft.length > 0 && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--c-divider)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {draft.map(n => (
            <div key={n} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 4px 4px 10px', background: 'var(--c-text)', color: 'var(--c-surface)',
              borderRadius: 999, fontSize: 12,
            }}>
              {n}
              <button onClick={() => toggle(n)} style={{
                width: 18, height: 18, borderRadius: 999, border: 'none',
                background: 'rgba(255,255,255,0.18)', color: 'var(--c-surface)',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'inherit', padding: 0,
              }}><Icon d="close" size={10} sw={2.4} stroke="var(--c-surface)" /></button>
            </div>
          ))}
        </div>
      )}

      {/* people grouped by dept */}
      <div>
        {Object.entries(groups).map(([dept, list]) => (
          <div key={dept}>
            <div style={{
              padding: '10px 16px 6px', fontSize: 11, color: 'var(--c-text-tertiary)',
              letterSpacing: 0.4, textTransform: 'uppercase', background: 'var(--c-surface-2)',
            }}>{dept} · {list.length} 人</div>
            {list.map(p => {
              const selected = draft.includes(p.name);
              return (
                <button key={p.name} onClick={() => toggle(p.name)} style={{
                  width: '100%', padding: '12px 16px', border: 'none', background: 'transparent',
                  borderBottom: '1px solid var(--c-divider)', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'inherit', cursor: 'pointer',
                }}>
                  <Avatar name={p.name} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, color: 'var(--c-text)', fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 2 }}>{p.title}</div>
                  </div>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    border: '1.5px solid ' + (selected ? 'var(--c-text)' : 'var(--c-border)'),
                    background: selected ? 'var(--c-text)' : 'transparent',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selected && <Icon d="check" size={12} stroke="var(--c-surface)" sw={2.6} />}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
        {Object.keys(groups).length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--c-text-tertiary)', fontSize: 13 }}>
            没有匹配的同事
          </div>
        )}
      </div>
    </PopoverSheet>
  );
}

function AdminCreateScreen({ onBack, onSubmit }) {
  const [form, setForm] = React.useState({
    title: 'Q3 战略对齐会',
    type: '评审',
    date: '2026-05-08',
    start: '14:00',
    end: '15:30',
    online: false,
    location: '总部 · 3F 启明会议室',
    onlineLink: '',
    host: '陈敏',
    attendees: ['李思琪', '王浩然', '赵小冉', '周明'],
    agenda: '1. 战略目标对齐\n2. 业务部门 Q3 计划\n3. 资源协调与排期',
    requireConfirm: true,
    requireCheckin: true,
  });
  const types = ['例会', '培训', '评审', '临时'];
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      <TopBar leading={<IconBtn d="close" onClick={onBack} />} title="新建会议" trailing={
        <button style={{
          background: 'transparent', border: 'none', color: 'var(--c-text-secondary)',
          fontSize: 13, fontWeight: 500, padding: '8px 4px', cursor: 'pointer', fontFamily: 'inherit',
        }}>草稿</button>
      } />
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="会议主题" value={form.title} onChange={v => set('title', v)} placeholder="如：Q3 战略评审" />

        <div>
          <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginBottom: 8, fontWeight: 500, letterSpacing: 0.2 }}>会议类型</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {types.map(t => (
              <button key={t} onClick={() => set('type', t)} style={{
                flex: 1, height: 38, border: '1px solid ' + (form.type === t ? 'var(--c-text)' : 'var(--c-border)'),
                background: form.type === t ? 'var(--c-text)' : 'var(--c-surface)',
                color: form.type === t ? 'var(--c-surface)' : 'var(--c-text-secondary)',
                fontSize: 13, fontWeight: form.type === t ? 600 : 400, borderRadius: 'var(--r-input)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{t}</button>
            ))}
          </div>
        </div>

        <Field label="日期" value={form.date} onChange={v => set('date', v)} trailing={<Icon d="calendar" size={16} stroke="var(--c-text-tertiary)" />} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Field label="开始" value={form.start} onChange={v => set('start', v)} style={{ flex: 1 }} />
          <Field label="结束" value={form.end} onChange={v => set('end', v)} style={{ flex: 1 }} />
        </div>

        {/* Location toggle */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginBottom: 8, fontWeight: 500, letterSpacing: 0.2 }}>会议地点</div>
          <div style={{
            display: 'flex', background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-control)', padding: 3, marginBottom: 10,
          }}>
            {[{ id: false, label: '线下' }, { id: true, label: '线上' }].map(o => (
              <button key={String(o.id)} onClick={() => set('online', o.id)} style={{
                flex: 1, height: 32, border: 'none',
                background: form.online === o.id ? 'var(--c-surface)' : 'transparent',
                color: form.online === o.id ? 'var(--c-text)' : 'var(--c-text-tertiary)',
                fontSize: 12, fontWeight: form.online === o.id ? 600 : 400, borderRadius: 6,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: form.online === o.id ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
              }}>{o.label}</button>
            ))}
          </div>
          {form.online ? (
            <Field value={form.onlineLink} onChange={v => set('onlineLink', v)} placeholder="粘贴会议链接" trailing={<Icon d="link" size={16} stroke="var(--c-text-tertiary)" />} />
          ) : (
            <Field value={form.location} onChange={v => set('location', v)} placeholder="选择会议室" trailing={<Icon d="pin" size={16} stroke="var(--c-text-tertiary)" />} />
          )}
        </div>

        <Field label="主持人" value={form.host} onChange={v => set('host', v)} trailing={<Icon d="user" size={16} stroke="var(--c-text-tertiary)" />} />

        {/* Attendees */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginBottom: 8, fontWeight: 500, letterSpacing: 0.2, display: 'flex', justifyContent: 'space-between' }}>
            <span>参会人员</span>
            <span style={{ color: 'var(--c-text-tertiary)' }}>{form.attendees.length} 人</span>
          </div>
          <div style={{
            background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
            borderRadius: 'var(--r-input)', padding: 8, display: 'flex', flexWrap: 'wrap', gap: 6,
          }}>
            {form.attendees.map((n, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 4px 4px 4px', background: 'var(--c-surface)',
                border: '1px solid var(--c-border)', borderRadius: 999,
              }}>
                <Avatar name={n} size={20} />
                <span style={{ fontSize: 12, color: 'var(--c-text-secondary)' }}>{n}</span>
                <button style={{
                  width: 18, height: 18, borderRadius: 999, border: 'none',
                  background: 'transparent', color: 'var(--c-text-tertiary)', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                }}><Icon d="close" size={11} sw={2} /></button>
              </div>
            ))}
            <button style={{
              padding: '4px 10px', borderRadius: 999, border: '1px dashed var(--c-border)',
              background: 'transparent', fontSize: 12, color: 'var(--c-text-secondary)',
              cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 4,
            }}><Icon d="plus" size={12} /> 添加</button>
          </div>
        </div>

        <Field label="议程 / 备注" multiline value={form.agenda} onChange={v => set('agenda', v)} />

        {/* Attachment */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginBottom: 8, fontWeight: 500, letterSpacing: 0.2 }}>附件</div>
          <div style={{
            border: '1px dashed var(--c-border)', borderRadius: 'var(--r-input)',
            padding: 14, background: 'var(--c-surface-2)',
            display: 'flex', alignItems: 'center', gap: 10, color: 'var(--c-text-tertiary)',
          }}>
            <Icon d="attach" size={18} />
            <div style={{ flex: 1, fontSize: 12 }}>点击上传 PDF / Excel / 图片</div>
            <span style={{ fontSize: 11 }}>≤ 50 MB</span>
          </div>
        </div>

        {/* Toggles */}
        <div style={{
          background: 'var(--c-surface)', border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-card)',
        }}>
          <ToggleRow label="需要回执确认" sub="参会人收到后须点击确认或请假" value={form.requireConfirm} onChange={v => set('requireConfirm', v)} />
          <div style={{ height: 1, background: 'var(--c-divider)', marginLeft: 16 }} />
          <ToggleRow label="需要现场签到" sub="生成专属二维码，到场扫码计入出勤" value={form.requireCheckin} onChange={v => set('requireCheckin', v)} />
        </div>

        {/* Reminder schedule preview */}
        <div style={{
          padding: 14, background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
          borderRadius: 'var(--r-card)',
        }}>
          <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', fontWeight: 500, marginBottom: 8 }}>提醒计划（自动）</div>
          {[
            { t: '前一天 20:00', l: '次日会议预告' },
            { t: '会前 1 小时', l: '准备出发 / 进入会议室' },
            { t: '会前 10 分钟', l: '最后提醒' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0', fontSize: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-accent)' }} />
              <div style={{ color: 'var(--c-text)', fontWeight: 500, width: 96 }}>{r.t}</div>
              <div style={{ color: 'var(--c-text-tertiary)' }}>{r.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--c-divider)', padding: '10px 14px', background: 'var(--c-surface)', display: 'flex', gap: 10 }}>
        <Btn variant="secondary" onClick={onBack} style={{ height: 44 }}>取消</Btn>
        <Btn full onClick={onSubmit} style={{ height: 44 }}>发布会议</Btn>
      </div>
    </div>
  );
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, color: 'var(--c-text)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 2 }}>{sub}</div>
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 42, height: 24, borderRadius: 999, border: 'none',
        background: value ? 'var(--c-text)' : 'var(--c-border)',
        position: 'relative', cursor: 'pointer', padding: 0, transition: 'background 0.15s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: value ? 20 : 2,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

// ─── Meetings I organized (everyone can create meetings) ──
function AdminListScreen({ meetings, onCreate, onOpen, onBack }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      <div style={{
        padding: '14px 16px', background: 'var(--c-surface)',
        borderBottom: '1px solid var(--c-divider)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
          {onBack && <IconBtn d="back" onClick={onBack} />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', letterSpacing: 0.4, textTransform: 'uppercase' }}>Organized by me</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.3 }}>我发起的会议</div>
          </div>
        </div>
        <button onClick={onCreate} style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'var(--c-text)', color: 'var(--c-surface)',
          border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon d="plus" size={20} stroke="var(--c-surface)" sw={2} /></button>
      </div>

      {/* segmented filter */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: 6, overflowX: 'auto', background: 'var(--c-surface)', borderBottom: '1px solid var(--c-divider)' }}>
        {['全部', '今日', '本周', '已结束', '草稿'].map((t, i) => (
          <button key={t} style={{
            padding: '6px 12px', border: '1px solid ' + (i === 1 ? 'var(--c-text)' : 'var(--c-border)'),
            background: i === 1 ? 'var(--c-text)' : 'var(--c-surface)',
            color: i === 1 ? 'var(--c-surface)' : 'var(--c-text-secondary)',
            borderRadius: 999, fontSize: 12, fontWeight: i === 1 ? 600 : 400,
            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {meetings.map(m => {
          const pct = Math.round(m.stats.confirmed / m.stats.total * 100);
          return (
            <div key={m.id} onClick={() => onOpen(m.id)} style={{
              padding: 16, borderBottom: '1px solid var(--c-divider)',
              background: 'var(--c-surface)', cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 44, padding: '6px 0', borderRadius: 8, background: 'var(--c-surface-2)',
                  border: '1px solid var(--c-border)', textAlign: 'center', flexShrink: 0,
                }}>
                  <div style={{ fontSize: 9, color: 'var(--c-text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.4 }}>4 月</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.3, lineHeight: 1.1, marginTop: 1 }}>{parseInt(m.date.slice(-2),10)}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Pill tone="accent" size="xs">{m.type}</Pill>
                    <span style={{ fontSize: 11, color: 'var(--c-text-tertiary)' }}>{m.start} – {m.end}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.1 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginTop: 2 }}>主持 · {m.host}</div>

                  {/* progress: confirmed / total */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <div style={{ fontSize: 11, color: 'var(--c-text-secondary)' }}>
                        回执 <span style={{ color: 'var(--c-text)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{m.stats.confirmed}</span>
                        <span style={{ color: 'var(--c-text-tertiary)' }}>/{m.stats.total}</span>
                        <span style={{ color: 'var(--c-text-tertiary)', marginLeft: 8 }}>· 待回 {m.stats.pending}</span>
                        {m.stats.leave > 0 && <span style={{ color: 'var(--c-text-tertiary)', marginLeft: 8 }}>· 请假 {m.stats.leave}</span>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</div>
                    </div>
                    <div style={{ height: 4, background: 'var(--c-surface-2)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: pct + '%', height: '100%', background: 'var(--c-text)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* admin tabbar handled by parent */}
    </div>
  );
}

// ─── Admin attendance dashboard ────────────────────────
function AdminDashboardScreen({ m, onBack }) {
  const [tab, setTab] = React.useState('confirm');
  const allMembers = m.attendees.map((n, i) => ({
    name: n,
    dept: ['产品部','市场部','技术部','人力部','财务部'][i % 5],
    confirm: i < 5 ? 'confirmed' : i < 7 ? 'pending' : 'leave',
    checkin: i < 4 ? 'in' : i < 5 ? 'late' : 'none',
  }));
  const stats = {
    confirmed: allMembers.filter(x => x.confirm === 'confirmed').length,
    pending: allMembers.filter(x => x.confirm === 'pending').length,
    leave: allMembers.filter(x => x.confirm === 'leave').length,
    in: allMembers.filter(x => x.checkin === 'in').length,
    late: allMembers.filter(x => x.checkin === 'late').length,
    absent: allMembers.filter(x => x.checkin === 'none' && x.confirm !== 'leave').length,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      <TopBar leading={<IconBtn d="back" onClick={onBack} />} title="出勤看板" trailing={<IconBtn d="refresh" />} />
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* meeting summary */}
        <div style={{ padding: 16, background: 'var(--c-surface)', borderBottom: '1px solid var(--c-divider)' }}>
          <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', letterSpacing: 0.3, textTransform: 'uppercase' }}>{formatDateLabel(m.date)} · {m.start}</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--c-text)', marginTop: 2, letterSpacing: -0.1 }}>{m.title}</div>

          {/* Donut + stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
            <Donut total={m.attendees.length} segments={[
              { v: stats.in, color: '#2e7d32', label: '已签到' },
              { v: stats.late, color: '#b45309', label: '迟到' },
              { v: stats.leave, color: '#888', label: '请假' },
              { v: stats.absent, color: '#b01e2d', label: '缺席' },
            ]} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: '已签到', v: stats.in, color: '#2e7d32' },
                { label: '迟到', v: stats.late, color: '#b45309' },
                { label: '请假', v: stats.leave, color: '#888' },
                { label: '缺席', v: stats.absent, color: '#b01e2d' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                  <span style={{ fontSize: 11, color: 'var(--c-text-secondary)', flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--c-text)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', padding: '0 16px', background: 'var(--c-surface)', borderBottom: '1px solid var(--c-divider)' }}>
          {[
            { id: 'confirm', label: `回执（${stats.confirmed + stats.leave}/${m.attendees.length}）` },
            { id: 'checkin', label: `签到（${stats.in + stats.late}/${m.attendees.length}）` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '12px 0', marginRight: 24, border: 'none', background: 'transparent',
              borderBottom: '2px solid ' + (tab === t.id ? 'var(--c-text)' : 'transparent'),
              color: tab === t.id ? 'var(--c-text)' : 'var(--c-text-tertiary)',
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Member list */}
        <div>
          {allMembers.map((p, i) => {
            const status = tab === 'confirm'
              ? { confirmed: { tone: 'success', label: '已确认' }, pending: { tone: 'warning', label: '待回执' }, leave: { tone: 'neutral', label: '已请假' } }[p.confirm]
              : { in: { tone: 'success', label: '已签到 09:58' }, late: { tone: 'warning', label: '迟到 10:08' }, none: p.confirm === 'leave' ? { tone: 'neutral', label: '请假' } : { tone: 'danger', label: '未到' } }[p.checkin];
            return (
              <Row
                key={i}
                leading={<Avatar name={p.name} size={36} />}
                title={p.name}
                subtitle={p.dept}
                trailing={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Pill tone={status.tone} size="sm">{status.label}</Pill>
                    {tab === 'confirm' && p.confirm === 'pending' && (
                      <button style={{
                        padding: '5px 10px', border: '1px solid var(--c-border)',
                        background: 'var(--c-surface)', borderRadius: 8, fontSize: 11,
                        color: 'var(--c-text)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                      }}>催办</button>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Donut({ total, segments }) {
  const size = 92, r = 36, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--c-divider)" strokeWidth={10} />
        {segments.map((s, i) => {
          const len = (s.v / total) * c;
          const dash = `${len} ${c - len}`;
          const dashOffset = -offset;
          offset += len;
          return <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={s.color} strokeWidth={10} strokeDasharray={dash} strokeDashoffset={dashOffset} />;
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.4, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{Math.round((segments[0].v / total) * 100)}%</div>
        <div style={{ fontSize: 10, color: 'var(--c-text-tertiary)', marginTop: 2 }}>出勤率</div>
      </div>
    </div>
  );
}

Object.assign(window, { AdminCreateScreen, AdminListScreen, AdminDashboardScreen, ToggleRow, Donut });

// Employee screens: calendar home, list home, detail, reminder banner/lockscreen,
// confirm receipt dialog, scan check-in, leave request, my-meetings/profile.

// ─── Calendar (月视图 + 当日列表) ─────────────────────────────
function CalendarHome({ meetings, onOpen, onTabChange, view, setView, onOpenLockscreen, todayStr }) {
  const [selected, setSelected] = React.useState(todayStr);
  const meetingsByDate = React.useMemo(() => {
    const m = {};
    meetings.forEach(x => { (m[x.date] ||= []).push(x); });
    return m;
  }, [meetings]);

  // Build the 4/2026 grid
  const year = 2026, month = 4; // April
  const firstWeekday = new Date(`${year}-${String(month).padStart(2,'0')}-01`).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(`${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`);
  while (cells.length % 7) cells.push(null);

  const dayMeetings = (meetingsByDate[selected] || []).sort((a,b) => a.start.localeCompare(b.start));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 10px', background: 'var(--c-surface)',
        borderBottom: '1px solid var(--c-divider)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', letterSpacing: 0.4, textTransform: 'uppercase' }}>April 2026</div>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.4, lineHeight: 1.2 }}>四月</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')} style={{
              border: '1px solid var(--c-border)', background: 'var(--c-surface)',
              padding: '6px 10px', borderRadius: 'var(--r-input)', fontSize: 12,
              color: 'var(--c-text-secondary)', cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center',
              fontFamily: 'inherit',
            }}>
              <Icon d={view === 'calendar' ? 'list' : 'calendar'} size={14} />
              {view === 'calendar' ? '列表' : '日历'}
            </button>
            <IconBtn d="search" />
          </div>
        </div>

        {/* Weekdays */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
          {['日','一','二','三','四','五','六'].map((w,i) => (
            <div key={i} style={{
              textAlign: 'center', fontSize: 10, color: 'var(--c-text-tertiary)',
              letterSpacing: 0.4, padding: '4px 0', fontWeight: 500,
            }}>{w}</div>
          ))}
        </div>
        {/* Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 2 }}>
          {cells.map((c, i) => {
            if (!c) return <div key={i} style={{ height: 40 }} />;
            const day = parseInt(c.slice(-2), 10);
            const has = (meetingsByDate[c] || []).length;
            const isSel = c === selected;
            const isToday = c === todayStr;
            return (
              <button key={i} onClick={() => setSelected(c)} style={{
                height: 40, border: 'none', background: 'transparent', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 3, padding: 0, position: 'relative', fontFamily: 'inherit',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSel ? 'var(--c-text)' : 'transparent',
                  color: isSel ? 'var(--c-surface)' : 'var(--c-text)',
                  fontSize: 13, fontWeight: isToday ? 700 : 400,
                  border: !isSel && isToday ? '1px solid var(--c-text)' : 'none',
                }}>{day}</div>
                <div style={{ display: 'flex', gap: 3, height: 6, alignItems: 'center', justifyContent: 'center' }}>
                  {has > 0 && (
                    isSel ? (
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--c-surface)' }} />
                    ) : (
                      Array.from({ length: Math.min(has, 3) }).map((_, k) => (
                        <div key={k} style={{ width: 5, height: 5, borderRadius: '50%', background: '#e11d2e', boxShadow: '0 0 0 0.5px rgba(225,29,46,0.25)' }} />
                      ))
                    )
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day list */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <SectionHead>
          {selected === todayStr ? '今日会议' : `${parseInt(selected.slice(-2),10)} 日 · ${dayMeetings.length} 场`}
        </SectionHead>
        {dayMeetings.length === 0 && <Empty icon="calendar" title="这一天没有会议" hint="可以专注做事" />}
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {dayMeetings.map(m => <MeetingCard key={m.id} m={m} onClick={() => onOpen(m.id)} />)}
        </div>
      </div>
    </div>
  );
}

// ─── List home (按日期分组) ──────────────────────────────────
function ListHome({ meetings, onOpen, view, setView }) {
  const groups = React.useMemo(() => {
    const m = {};
    meetings.forEach(x => { (m[x.date] ||= []).push(x); });
    return Object.entries(m).sort(([a],[b]) => a.localeCompare(b));
  }, [meetings]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      <div style={{
        padding: '14px 16px', background: 'var(--c-surface)',
        borderBottom: '1px solid var(--c-divider)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', letterSpacing: 0.4, textTransform: 'uppercase' }}>This week</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.3 }}>本周会议</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')} style={{
            border: '1px solid var(--c-border)', background: 'var(--c-surface)',
            padding: '6px 10px', borderRadius: 'var(--r-input)', fontSize: 12,
            color: 'var(--c-text-secondary)', cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center',
            fontFamily: 'inherit',
          }}>
            <Icon d={view === 'calendar' ? 'list' : 'calendar'} size={14} />
            {view === 'calendar' ? '列表' : '日历'}
          </button>
          <IconBtn d="filter" iconSize={18} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {groups.map(([date, ms]) => (
          <div key={date}>
            <SectionHead>{formatDateLabel(date)}</SectionHead>
            <div style={{ padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ms.map(m => <MeetingCard key={m.id} m={m} onClick={() => onOpen(m.id)} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDateLabel(date) {
  const d = parseInt(date.slice(-2), 10);
  const today = '2026-04-25';
  if (date === today) return '今天 · 4 月 ' + d + ' 日';
  if (date === '2026-04-26') return '明天 · 4 月 ' + d + ' 日';
  return `4 月 ${d} 日 · ` + ['周日','周一','周二','周三','周四','周五','周六'][new Date(date).getDay()];
}

// ─── Meeting card (compact list item) ───────────────────────────
function MeetingCard({ m, onClick }) {
  const tone = { '评审': 'accent', '例会': 'neutral', '培训': 'warning', '临时': 'danger' }[m.type] || 'neutral';
  const statusMap = {
    pending: { tone: 'warning', label: '待确认' },
    confirmed: { tone: 'success', label: '已确认' },
    leave: { tone: 'neutral', label: '已请假' },
    declined: { tone: 'danger', label: '已拒绝' },
  };
  const st = statusMap[m.myStatus];
  return (
    <div onClick={onClick} style={{
      background: 'var(--c-surface)', border: '1px solid var(--c-border)',
      borderRadius: 'var(--r-card)', padding: 14, cursor: 'pointer',
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <div style={{ width: 4, alignSelf: 'stretch', background: 'var(--c-text)', borderRadius: 2, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Pill tone={tone} size="xs">{m.type}</Pill>
          {m.requireCheckin && <Pill tone="neutral" size="xs">需签到</Pill>}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.1, lineHeight: 1.3 }}>{m.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, fontSize: 12, color: 'var(--c-text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon d="clock" size={13} stroke="var(--c-text-secondary)" sw={1.5} />
            {m.start} – {m.end}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
            <Icon d={m.online ? 'link' : 'pin'} size={13} stroke="var(--c-text-secondary)" sw={1.5} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.online ? '线上' : m.location.split('·').pop().trim()}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ display: 'flex' }}>
            {m.attendees.slice(0, 4).map((n, i) => (
              <Avatar key={i} name={n} size={22} style={{ marginLeft: i === 0 ? 0 : -6, border: '1.5px solid var(--c-surface)' }} />
            ))}
            {m.attendees.length > 4 && (
              <div style={{
                width: 22, height: 22, borderRadius: '50%', marginLeft: -6,
                background: 'var(--c-surface-2)', border: '1.5px solid var(--c-surface)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: 'var(--c-text-secondary)',
              }}>+{m.attendees.length - 4}</div>
            )}
          </div>
          <Pill tone={st.tone} size="xs">{st.label}</Pill>
        </div>
      </div>
    </div>
  );
}

// ─── Detail ─────────────────────────────────────────────────────
function DetailScreen({ m, onBack, onConfirm, onLeave, onCheckin, onShowReceipt }) {
  if (!m) return null;
  const statusMap = {
    pending: { tone: 'warning', label: '待确认', desc: '请确认能否参加这次会议' },
    confirmed: { tone: 'success', label: '已确认', desc: '已通知主持人，请准时到场' },
    leave: { tone: 'neutral', label: '已请假', desc: '请假申请已提交' },
  };
  const st = statusMap[m.myStatus];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      <TopBar
        leading={<IconBtn d="back" onClick={onBack} />}
        title="会议详情"
        trailing={<IconBtn d="more" />}
      />
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* Hero */}
        <div style={{ padding: '20px 16px 16px', background: 'var(--c-surface)' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <Pill tone="accent" size="sm">{m.type}</Pill>
            {m.requireCheckin && <Pill size="sm">需签到</Pill>}
            {m.requireConfirm && <Pill size="sm">需回执</Pill>}
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.4, lineHeight: 1.3 }}>{m.title}</div>

          <div style={{
            marginTop: 16, padding: 14, borderRadius: 'var(--r-card)',
            background: 'var(--c-bg)', border: '1px solid var(--c-border)',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <DetailRow icon="clock" label="时间">
              <div style={{ fontSize: 14, color: 'var(--c-text)', fontWeight: 500 }}>{formatDateLabel(m.date)} · {m.start} – {m.end}</div>
            </DetailRow>
            <div style={{ height: 1, background: 'var(--c-divider)' }} />
            <DetailRow icon={m.online ? 'link' : 'pin'} label="地点" action={m.online ? '复制' : '导航'}>
              <div style={{ fontSize: 14, color: 'var(--c-text)', fontWeight: 500 }}>{m.location}</div>
              <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginTop: 2 }}>{m.address}</div>
            </DetailRow>
            <div style={{ height: 1, background: 'var(--c-divider)' }} />
            <DetailRow icon="user" label="主持人">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Avatar name={m.host} size={26} />
                <div>
                  <div style={{ fontSize: 13, color: 'var(--c-text)', fontWeight: 500 }}>{m.host}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-secondary)' }}>{m.hostDept}</div>
                </div>
              </div>
            </DetailRow>
          </div>
        </div>

        {/* Attendees */}
        <SectionHead action={<span style={{ fontSize: 11, color: 'var(--c-text-tertiary)' }}>共 {m.attendees.length} 人</span>}>
          参会人员
        </SectionHead>
        <div style={{ padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {m.attendees.map((n, i) => (
            <div key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px 4px 4px', background: 'var(--c-surface)',
              border: '1px solid var(--c-border)', borderRadius: 999,
            }}>
              <Avatar name={n} size={20} />
              <span style={{ fontSize: 12, color: 'var(--c-text-secondary)' }}>{n}</span>
            </div>
          ))}
        </div>

        {/* Agenda */}
        <SectionHead>议程</SectionHead>
        <div style={{ padding: '0 16px 8px' }}>
          <div style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-card)' }}>
            {m.agenda.map((a, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '12px 14px',
                borderBottom: i < m.agenda.length - 1 ? '1px solid var(--c-divider)' : 'none',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-text)', width: 42, fontVariantNumeric: 'tabular-nums' }}>{a.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--c-text)' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 2 }}>{a.who}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attachments */}
        {m.attachments.length > 0 && (
          <>
            <SectionHead>附件</SectionHead>
            <div style={{ padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {m.attachments.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 12, background: 'var(--c-surface)',
                  border: '1px solid var(--c-border)', borderRadius: 'var(--r-card)',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, background: 'var(--c-surface-2)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon d="doc" size={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--c-text)', fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)' }}>{a.size}</div>
                  </div>
                  <Icon d="arrow_right" size={16} stroke="var(--c-text-tertiary)" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Status / actions footer */}
        <div style={{ height: 100 }} />
      </div>

      {/* Sticky bottom action bar */}
      <div style={{
        borderTop: '1px solid var(--c-divider)', background: 'var(--c-surface)',
        padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Pill tone={st.tone} size="sm">{st.label}</Pill>
          <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 4 }}>{st.desc}</div>
        </div>
        {m.myStatus === 'pending' && (
          <>
            <Btn variant="secondary" onClick={onLeave} style={{ height: 40, padding: '0 14px', fontSize: 13 }}>请假</Btn>
            <Btn onClick={onShowReceipt} style={{ height: 40, padding: '0 18px', fontSize: 13 }}>已知悉</Btn>
          </>
        )}
        {m.myStatus === 'confirmed' && m.requireCheckin && (
          <Btn onClick={onCheckin} leading={<Icon d="qr" size={16} stroke="var(--c-on-accent)" sw={2} />} style={{ height: 40, padding: '0 16px', fontSize: 13 }}>扫码签到</Btn>
        )}
        {m.myStatus === 'confirmed' && !m.requireCheckin && (
          <Btn variant="secondary" onClick={onLeave} style={{ height: 40, padding: '0 16px', fontSize: 13 }}>申请请假</Btn>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <Icon d={icon} size={16} stroke="var(--c-text-tertiary)" sw={1.5} style={{ marginTop: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
        {children}
      </div>
      {action && <span style={{ fontSize: 12, color: 'var(--c-accent)', fontWeight: 500 }}>{action}</span>}
    </div>
  );
}

// ─── Lockscreen reminder ─────────────────────────────────────
function LockscreenReminder({ onTap, onClose, m }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0e0e0e 100%)',
      display: 'flex', flexDirection: 'column', color: '#fafaf7',
    }}>
      {/* faux statusbar */}
      <div style={{
        height: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', fontSize: 13, fontWeight: 500,
      }}>
        <span>9:48</span>
        <span style={{ display: 'flex', gap: 4, opacity: 0.85, fontSize: 11 }}>● ● ●</span>
      </div>

      {/* Time */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <div style={{ fontSize: 14, opacity: 0.6, letterSpacing: 0.5 }}>4 月 25 日 周六</div>
        <div style={{ fontSize: 80, fontWeight: 200, letterSpacing: -3, lineHeight: 1, marginTop: 4 }}>9:48</div>
      </div>

      {/* Notifications stack */}
      <div style={{ marginTop: 'auto', padding: '0 12px 60px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 14,
          display: 'flex', gap: 12,
        }} onClick={onTap}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'var(--c-accent)', color: 'var(--c-on-accent)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
          }}>会</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.9 }}>会议日程 · 提醒</span>
              <span style={{ fontSize: 11, opacity: 0.5 }}>10 分钟前</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{m.title} · 即将开始</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2, lineHeight: 1.4 }}>10:00 · {m.location}</div>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: 12,
          opacity: 0.6, fontSize: 12,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>会议日程 · 提醒</div>
          <div style={{ opacity: 0.8 }}>{m.title} 将于 1 小时后开始</div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 11, opacity: 0.5 }}>
        点击卡片返回 App
        <button onClick={onClose} style={{
          marginLeft: 12, background: 'rgba(255,255,255,0.1)', border: 'none',
          color: '#fff', padding: '4px 10px', borderRadius: 999, fontSize: 11, cursor: 'pointer',
        }}>关闭</button>
      </div>
    </div>
  );
}

// ─── Receipt dialog ─────────────────────────────────────────
function ReceiptModal({ m, onConfirm, onLeave, onClose }) {
  const [choice, setChoice] = React.useState('confirm');
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.2 }}>会议回执</div>
        <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
          请告知主持人你能否参加。已收到 {m.stats.confirmed}/{m.stats.total} 人回执。
        </div>

        <div style={{
          marginTop: 16, padding: 12, background: 'var(--c-surface-2)',
          borderRadius: 'var(--r-card)', border: '1px solid var(--c-border)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.4 }}>会议</div>
          <div style={{ fontSize: 14, color: 'var(--c-text)', fontWeight: 500, marginTop: 4 }}>{m.title}</div>
          <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginTop: 2 }}>{formatDateLabel(m.date)} · {m.start} – {m.end}</div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'confirm', label: '确认参加', desc: '我会准时到场' },
            { id: 'leave', label: '申请请假', desc: '我无法参加，提交请假说明' },
          ].map(o => (
            <button key={o.id} onClick={() => setChoice(o.id)} style={{
              textAlign: 'left', padding: 14,
              background: choice === o.id ? 'var(--c-surface)' : 'var(--c-surface-2)',
              border: choice === o.id ? '1.5px solid var(--c-text)' : '1px solid var(--c-border)',
              borderRadius: 'var(--r-card)', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: '50%',
                border: '1.5px solid ' + (choice === o.id ? 'var(--c-text)' : 'var(--c-border)'),
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {choice === o.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--c-text)' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--c-text)', fontWeight: 500 }}>{o.label}</div>
                <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 2 }}>{o.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
          <Btn variant="secondary" full onClick={onClose}>稍后</Btn>
          <Btn full onClick={() => choice === 'confirm' ? onConfirm() : onLeave()}>
            {choice === 'confirm' ? '确认参加' : '去请假'}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--c-bg)',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        animation: 'slideUp 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--c-border)' }} />
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Scan check-in ─────────────────────────────────────
function CheckinScreen({ m, onBack, onSuccess, succeeded }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: '#0f0f0f', color: '#fff', minHeight: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
      }}>
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 999, border: 'none',
          background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon d="back" size={20} stroke="#fff" /></button>
        <div style={{ flex: 1, fontSize: 15, fontWeight: 600, textAlign: 'center', marginRight: 36 }}>扫码签到</div>
      </div>

      {/* viewfinder */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{
          width: 240, height: 240, position: 'relative',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
          border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 8,
          overflow: 'hidden',
        }}>
          {/* corners */}
          {[
            { top: -1, left: -1, br: '0 0 4px 0' }, { top: -1, right: -1, br: '0 0 0 4px' },
            { bottom: -1, left: -1, br: '0 4px 0 0' }, { bottom: -1, right: -1, br: '4px 0 0 0' },
          ].map((c, i) => (
            <div key={i} style={{
              position: 'absolute', width: 28, height: 28,
              borderTop: c.top != null ? '3px solid #fff' : 'none',
              borderBottom: c.bottom != null ? '3px solid #fff' : 'none',
              borderLeft: c.left != null ? '3px solid #fff' : 'none',
              borderRight: c.right != null ? '3px solid #fff' : 'none',
              ...c,
            }} />
          ))}
          {/* scan line */}
          {!succeeded && (
            <div style={{
              position: 'absolute', left: 8, right: 8, height: 2,
              background: 'linear-gradient(90deg, transparent, var(--c-accent), transparent)',
              animation: 'scan 2s linear infinite',
            }} />
          )}
          {succeeded && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(46,125,50,0.18)', flexDirection: 'column', gap: 10,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: '#2e7d32',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon d="check" size={32} stroke="#fff" sw={2.5} /></div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>签到成功</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '20px 20px 30px', textAlign: 'center' }}>
        <div style={{ fontSize: 12, opacity: 0.6, letterSpacing: 0.3 }}>{succeeded ? '已记录到出勤名单' : '请将二维码对准取景框'}</div>
        <div style={{ fontSize: 14, marginTop: 8, opacity: 0.9 }}>{m.title}</div>
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{m.location}</div>
        {!succeeded && (
          <button onClick={onSuccess} style={{
            marginTop: 18, background: 'var(--c-accent)', color: 'var(--c-on-accent)',
            border: 'none', padding: '12px 28px', borderRadius: 999,
            fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          }}>模拟扫描成功</button>
        )}
      </div>
    </div>
  );
}

// ─── Leave request ─────────────────────────────────────
function LeaveScreen({ m, onBack, onSubmit }) {
  const [reason, setReason] = React.useState('客户拜访');
  const [detail, setDetail] = React.useState('已与客户提前约好同一时间见面，无法调整。');
  const reasons = ['客户拜访', '出差', '生病', '其他会议冲突', '个人事务'];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      <TopBar leading={<IconBtn d="back" onClick={onBack} />} title="请假申请" />
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <div style={{
          padding: 14, borderRadius: 'var(--r-card)', background: 'var(--c-surface)',
          border: '1px solid var(--c-border)', marginBottom: 18,
        }}>
          <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', letterSpacing: 0.4, textTransform: 'uppercase' }}>申请请假</div>
          <div style={{ fontSize: 15, color: 'var(--c-text)', fontWeight: 600, marginTop: 4 }}>{m.title}</div>
          <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginTop: 2 }}>{formatDateLabel(m.date)} · {m.start} – {m.end}</div>
        </div>

        <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginBottom: 8, fontWeight: 500 }}>请假原因</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {reasons.map(r => (
            <button key={r} onClick={() => setReason(r)} style={{
              border: '1px solid ' + (reason === r ? 'var(--c-text)' : 'var(--c-border)'),
              background: reason === r ? 'var(--c-text)' : 'var(--c-surface)',
              color: reason === r ? 'var(--c-surface)' : 'var(--c-text-secondary)',
              padding: '7px 14px', borderRadius: 999, fontSize: 12, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: reason === r ? 600 : 400,
            }}>{r}</button>
          ))}
        </div>

        <Field label="详细说明" multiline value={detail} onChange={setDetail} hint="主持人会看到，请简明扼要" />

        <div style={{ marginTop: 18, padding: 12, background: 'var(--c-surface-2)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--c-text)', fontWeight: 500 }}>
            <Icon d="warning" size={16} stroke="var(--c-text)" sw={1.5} /> 提交后无法撤回
          </div>
          <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 4, marginLeft: 24, lineHeight: 1.5 }}>
            如需修改，请联系主持人 {m.host}。请假记录将归档至月度考勤。
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--c-divider)', padding: '10px 14px', background: 'var(--c-surface)' }}>
        <Btn full onClick={onSubmit}>提交请假</Btn>
      </div>
    </div>
  );
}

// ─── My / Profile ─────────────────────────────────────
function ProfileScreen({ user, meetings, onOpen, onOpenOrg, onOpenMyOrganized, onOpenCreate }) {
  const stats = {
    upcoming: meetings.filter(m => m.myStatus !== 'leave').length,
    pending: meetings.filter(m => m.myStatus === 'pending').length,
    leave: meetings.filter(m => m.myStatus === 'leave').length,
  };
  const [toast, setToast] = React.useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1600); };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      <TopBar title="我的" />
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* Profile card */}
        <div onClick={() => showToast('个人资料 · 点击编辑')} style={{
          margin: 16, padding: 18, background: 'var(--c-surface)',
          border: '1px solid var(--c-border)', borderRadius: 'var(--r-card)',
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
        }}>
          <Avatar name={user.name} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--c-text)' }}>{user.name}</div>
            <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginTop: 2 }}>{user.dept} · {user.email}</div>
          </div>
          <Icon d="forward" size={16} stroke="var(--c-text-tertiary)" />
        </div>

        {/* Stats */}
        <div style={{ padding: '0 16px', display: 'flex', gap: 10, marginBottom: 8 }}>
          {[
            { label: '即将参加', value: stats.upcoming, k: 'upcoming' },
            { label: '待回执', value: stats.pending, k: 'pending' },
            { label: '已请假', value: stats.leave, k: 'leave' },
          ].map((s, i) => (
            <div key={i} onClick={() => showToast(s.label + ' · ' + s.value + ' 项')} style={{
              flex: 1, padding: 14, background: 'var(--c-surface)',
              border: '1px solid var(--c-border)', borderRadius: 'var(--r-card)',
              cursor: 'pointer',
            }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.4, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <SectionHead>会议</SectionHead>
        <div style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
          {[
            { icon: 'plus', label: '新建会议', sub: '发起一场新会议', onClick: onOpenCreate },
            { icon: 'briefcase', label: '我发起的会议', sub: '查看回执 / 出勤情况', onClick: onOpenMyOrganized },
          ].map((it, i, arr) => (
            <Row
              key={i}
              leading={<Icon d={it.icon} size={18} stroke="var(--c-text-secondary)" />}
              title={it.label}
              subtitle={it.sub}
              trailing={<Icon d="forward" size={16} stroke="var(--c-text-tertiary)" />}
              onClick={it.onClick}
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--c-divider)' : 'none' }}
            />
          ))}
        </div>

        <SectionHead>企业</SectionHead>
        <div style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
          {[
            { icon: 'users', label: '人事组织架构', sub: '查看冀东油田西部勘探开发区人员', onClick: onOpenOrg },
            { icon: 'briefcase', label: '部门同事', sub: user.dept + ' · 12 人', onClick: () => showToast('部门同事') },
          ].map((it, i, arr) => (
            <Row
              key={i}
              leading={<Icon d={it.icon} size={18} stroke="var(--c-text-secondary)" />}
              title={it.label}
              subtitle={it.sub}
              trailing={<Icon d="forward" size={16} stroke="var(--c-text-tertiary)" />}
              onClick={it.onClick}
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--c-divider)' : 'none' }}
            />
          ))}
        </div>

        <SectionHead>偏好</SectionHead>
        <div style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
          {[
            { icon: 'bell', label: '提醒设置', sub: '会前 1 天 / 1 小时 / 10 分钟', onClick: () => showToast('提醒设置') },
            { icon: 'calendar', label: '日历同步', sub: '与系统日历双向同步', onClick: () => showToast('已启用同步') },
            { icon: 'settings', label: '账户与隐私', sub: '密码、登录设备', onClick: () => showToast('账户设置') },
          ].map((it, i, arr) => (
            <Row
              key={i}
              leading={<Icon d={it.icon} size={18} stroke="var(--c-text-secondary)" />}
              title={it.label}
              subtitle={it.sub}
              trailing={<Icon d="forward" size={16} stroke="var(--c-text-tertiary)" />}
              onClick={it.onClick}
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--c-divider)' : 'none' }}
            />
          ))}
        </div>

        <div style={{ padding: 16 }}>
          <Btn full variant="secondary" onClick={() => showToast('已退出')}>退出登录</Btn>
        </div>
      </div>
      {toast && (
        <div style={{
          position: 'absolute', bottom: 88, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(26,26,26,0.92)', color: '#fff', padding: '10px 18px',
          borderRadius: 999, fontSize: 13, zIndex: 100, whiteSpace: 'nowrap',
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
        }}>{toast}</div>
      )}
    </div>
  );
}

// ─── Org structure screen ─────────────────────────────────────
function OrgScreen({ onBack }) {
  const orgs = [
    {
      dept: '冀东油田西部勘探开发区',
      sub: [
        { name: '勘探部', count: 18, head: '张建军' },
        { name: '开发部', count: 22, head: '王志刚' },
        { name: '工程技术部', count: 15, head: '李震东' },
        { name: '安全环保部', count: 9, head: '赵文锐' },
        { name: '人力资源部', count: 7, head: '陈敏' },
        { name: '财务部', count: 6, head: '周雪峰' },
        { name: '综合办公室', count: 8, head: '孙丽' },
      ],
    },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)', minHeight: 0 }}>
      <TopBar leading={<IconBtn d="back" onClick={onBack} />} title="人事组织架构" trailing={<IconBtn d="search" />} />
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <div style={{
          margin: 16, padding: 16, background: 'var(--c-surface)',
          border: '1px solid var(--c-border)', borderRadius: 'var(--r-card)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: '#c8102e',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.5,
          }}>冀</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--c-text)' }}>{orgs[0].dept}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', marginTop: 2, letterSpacing: 0.3 }}>CNPC · 中国石油 · 85 人</div>
          </div>
        </div>

        <SectionHead>下属部门</SectionHead>
        <div style={{ background: 'var(--c-surface)', borderTop: '1px solid var(--c-border)', borderBottom: '1px solid var(--c-border)' }}>
          {orgs[0].sub.map((d, i, arr) => (
            <Row
              key={i}
              leading={
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'var(--c-surface-2)', border: '1px solid var(--c-border)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600, color: 'var(--c-text-secondary)',
                }}>{d.name.slice(0, 1)}</div>
              }
              title={d.name}
              subtitle={`负责人 · ${d.head}`}
              trailing={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Pill size="xs">{d.count} 人</Pill>
                  <Icon d="forward" size={16} stroke="var(--c-text-tertiary)" />
                </div>
              }
              onClick={() => {}}
              style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--c-divider)' : 'none' }}
            />
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

Object.assign(window, {
  CalendarHome, ListHome, MeetingCard, DetailScreen, LockscreenReminder, ReceiptModal, Modal, CheckinScreen, LeaveScreen, ProfileScreen, OrgScreen, formatDateLabel, DetailRow,
});

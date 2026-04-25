// app.jsx — main app: routing between screens, Tweaks, design canvas assembly.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#1a1a1a",
  "dark": false,
  "fontSize": 15,
  "viewMode": "calendar"
}/*EDITMODE-END*/;

// Tone helpers
function buildTokens(t) {
  const dark = t.dark;
  const accent = t.primaryColor;
  // contrast for accent
  const onAccent = (() => {
    const c = accent.replace('#','');
    const r = parseInt(c.slice(0,2), 16), g = parseInt(c.slice(2,4), 16), b = parseInt(c.slice(4,6), 16);
    return (r*299 + g*587 + b*114)/1000 > 150 ? '#1a1a1a' : '#fafaf7';
  })();
  // soft accent (12% alpha)
  const soft = accent + '1f';
  return dark ? {
    '--c-bg': '#0e0e0e',
    '--c-surface': '#171717',
    '--c-surface-2': '#1f1f1f',
    '--c-text': '#f0efea',
    '--c-text-secondary': 'rgba(240,239,234,0.7)',
    '--c-text-tertiary': 'rgba(240,239,234,0.45)',
    '--c-border': 'rgba(255,255,255,0.10)',
    '--c-divider': 'rgba(255,255,255,0.06)',
    '--c-pill-bg': 'rgba(255,255,255,0.08)',
    '--c-pill-fg': 'rgba(240,239,234,0.85)',
    '--c-accent': accent === '#1a1a1a' ? '#fafaf7' : accent,
    '--c-on-accent': accent === '#1a1a1a' ? '#1a1a1a' : onAccent,
    '--c-accent-soft': soft,
    '--r-card': '12px',
    '--r-input': '10px',
    '--r-control': '10px',
    '--r-pill': '999px',
  } : {
    '--c-bg': '#f5f3ee',
    '--c-surface': '#ffffff',
    '--c-surface-2': '#f0eee7',
    '--c-text': '#1a1a1a',
    '--c-text-secondary': 'rgba(26,26,26,0.7)',
    '--c-text-tertiary': 'rgba(26,26,26,0.45)',
    '--c-border': 'rgba(0,0,0,0.08)',
    '--c-divider': 'rgba(0,0,0,0.05)',
    '--c-pill-bg': 'rgba(0,0,0,0.06)',
    '--c-pill-fg': 'rgba(26,26,26,0.75)',
    '--c-accent': accent,
    '--c-on-accent': onAccent,
    '--c-accent-soft': soft,
    '--r-card': '12px',
    '--r-input': '10px',
    '--r-control': '10px',
    '--r-pill': '999px',
  };
}

// ─── Phone Frame container ─────────────────────────────────
function Phone({ children, label, dark, vars, fontSize, dataLabel }) {
  const styleVars = { ...vars, fontSize, '--phone-fs': fontSize + 'px' };
  return (
    <div data-screen-label={dataLabel} style={{
      ...styleVars,
      fontFamily: '"Inter", "Noto Sans SC", -apple-system, system-ui, sans-serif',
      fontSize: 'var(--phone-fs)',
      color: 'var(--c-text)',
    }}>
      <AndroidDevice width={384} height={780} dark={dark}>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'var(--c-bg)', position: 'relative', minHeight: 0, overflow: 'hidden',
        }}>
          {children}
        </div>
      </AndroidDevice>
      {label && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(60,50,40,.55)', textAlign: 'center', letterSpacing: 0.3 }}>{label}</div>
      )}
    </div>
  );
}

// ─── Tab bar items ──────────────────────────────────────
const TABS = [
  { id: 'home', label: '首页', icon: 'home' },
  { id: 'mine', label: '我的会议', icon: 'briefcase' },
  { id: 'profile', label: '我', icon: 'user' },
];

// ─── Live phone (the interactive prototype card) ─────────
function LivePhone({ tweaks }) {
  const [route, setRoute] = React.useState({ name: 'login' });
  const [user, setUser] = React.useState(null);
  const [meetings, setMeetings] = React.useState(MOCK.meetings);
  const [view, setView] = React.useState(tweaks.viewMode);
  const [showReceipt, setShowReceipt] = React.useState(false);
  const [showLockscreen, setShowLockscreen] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(true);
  const [checkinDone, setCheckinDone] = React.useState(false);

  React.useEffect(() => { setView(tweaks.viewMode); }, [tweaks.viewMode]);

  const todayStr = '2026-04-25';
  const m = meetings.find(x => x.id === route.id);

  const handleLogin = () => {
    setUser(MOCK.currentUser);
    setRoute({ name: 'home' });
  };
  const updateMeeting = (id, patch) => {
    setMeetings(ms => ms.map(x => x.id === id ? { ...x, ...patch } : x));
  };

  // render
  let content = null;
  let dataLabel = '';
  let tabbar = null;

  if (route.name === 'login') {
    content = <LoginScreen onLogin={handleLogin} onSwitch={() => setRoute({ name: 'register' })} />;
    dataLabel = '01 登录';
  } else if (route.name === 'register') {
    content = <RegisterScreen onSubmit={() => setRoute({ name: 'login' })} onBack={() => setRoute({ name: 'login' })} />;
    dataLabel = '02 注册';
  } else if (route.name === 'home') {
    if (view === 'calendar') {
      content = <CalendarHome meetings={meetings} todayStr={todayStr} view={view} setView={setView} onOpen={(id) => setRoute({ name: 'detail', id })} />;
      dataLabel = '03 首页(日历)';
    } else {
      content = <ListHome meetings={meetings} view={view} setView={setView} onOpen={(id) => setRoute({ name: 'detail', id })} />;
      dataLabel = '04 首页(列表)';
    }
    tabbar = <TabBar items={TABS} current={'home'} onChange={(t) => {
      if (t === 'mine') setRoute({ name: 'mine' });
      else if (t === 'profile') setRoute({ name: 'profile' });
    }} />;
  } else if (route.name === 'mine') {
    content = <ListHome meetings={meetings} view={'list'} setView={() => setRoute({ name: 'home' })} onOpen={(id) => setRoute({ name: 'detail', id })} />;
    dataLabel = '我的会议';
    tabbar = <TabBar items={TABS} current={'mine'} onChange={(t) => {
      if (t === 'home') setRoute({ name: 'home' });
      else if (t === 'profile') setRoute({ name: 'profile' });
    }} />;
  } else if (route.name === 'profile') {
    content = <ProfileScreen
      user={user || MOCK.currentUser}
      meetings={meetings}
      onOpenOrg={() => setRoute({ name: 'org' })}
      onOpenMyOrganized={() => setRoute({ name: 'organized' })}
      onOpenCreate={() => setRoute({ name: 'create' })}
    />;
    dataLabel = '个人中心';
    tabbar = <TabBar items={TABS} current={'profile'} onChange={(t) => {
      if (t === 'home') setRoute({ name: 'home' });
      else if (t === 'mine') setRoute({ name: 'mine' });
    }} />;
  } else if (route.name === 'org') {
    content = <OrgScreen onBack={() => setRoute({ name: 'profile' })} />;
    dataLabel = '人事组织架构';
  } else if (route.name === 'detail') {
    content = (
      <DetailScreen m={m}
        onBack={() => setRoute({ name: 'home' })}
        onShowReceipt={() => setShowReceipt(true)}
        onLeave={() => setRoute({ name: 'leave', id: m.id })}
        onCheckin={() => { setCheckinDone(false); setRoute({ name: 'checkin', id: m.id }); }}
      />
    );
    dataLabel = '05 会议详情';
  } else if (route.name === 'leave') {
    content = <LeaveScreen m={m}
      onBack={() => setRoute({ name: 'detail', id: m.id })}
      onSubmit={() => { updateMeeting(m.id, { myStatus: 'leave' }); setRoute({ name: 'detail', id: m.id }); }} />;
    dataLabel = '请假申请';
  } else if (route.name === 'checkin') {
    content = <CheckinScreen m={m}
      succeeded={checkinDone}
      onBack={() => setRoute({ name: 'detail', id: m.id })}
      onSuccess={() => { setCheckinDone(true); setTimeout(() => setRoute({ name: 'detail', id: m.id }), 1200); }} />;
    dataLabel = '扫码签到';
  } else if (route.name === 'organized') {
    content = <AdminListScreen meetings={meetings}
      onBack={() => setRoute({ name: 'profile' })}
      onCreate={() => setRoute({ name: 'create' })}
      onOpen={(id) => setRoute({ name: 'organized_dashboard', id })}
    />;
    dataLabel = '我发起的会议';
  } else if (route.name === 'create') {
    content = <AdminCreateScreen
      onBack={() => setRoute({ name: 'home' })}
      onSubmit={() => setRoute({ name: 'organized' })} />;
    dataLabel = '新建会议';
  } else if (route.name === 'organized_dashboard') {
    content = <AdminDashboardScreen m={m} onBack={() => setRoute({ name: 'organized' })} />;
    dataLabel = '出勤看板';
  }

  const bannerVisible = showBanner && (route.name === 'home' || route.name === 'mine');
  const showCreateFab = route.name === 'home' || route.name === 'mine';

  return (
    <>
      {bannerVisible && (
        <Banner
          tone="accent"
          icon="bell"
          title="10 分钟后开始 · Q2 产品评审会"
          body="3F 启明会议室 · 距离你 80m"
          action={{ label: '查看', onClick: () => { setShowBanner(false); setRoute({ name: 'detail', id: 'm1' }); } }}
          onDismiss={() => setShowBanner(false)}
        />
      )}
      {content}
      {tabbar}
      {showReceipt && m && (
        <ReceiptModal m={m}
          onClose={() => setShowReceipt(false)}
          onConfirm={() => { updateMeeting(m.id, { myStatus: 'confirmed' }); setShowReceipt(false); }}
          onLeave={() => { setShowReceipt(false); setRoute({ name: 'leave', id: m.id }); }}
        />
      )}
      {showLockscreen && (
        <LockscreenReminder
          m={meetings[0]}
          onTap={() => { setShowLockscreen(false); setRoute({ name: 'detail', id: 'm1' }); }}
          onClose={() => setShowLockscreen(false)}
        />
      )}
      {/* Floating "新建会议" FAB — every user can create */}
      {showCreateFab && (
        <button onClick={() => setRoute({ name: 'create' })} title="新建会议" style={{
          position: 'absolute', bottom: 76, right: 14, zIndex: 30,
          height: 48, padding: '0 18px 0 14px', borderRadius: 999,
          background: 'var(--c-text)', color: 'var(--c-surface)',
          border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          boxShadow: '0 8px 22px rgba(0,0,0,0.22)',
        }}>
          <Icon d="plus" size={18} stroke="var(--c-surface)" sw={2.2} />
          新建会议
        </button>
      )}
      {/* Floating "show lockscreen" mini-button */}
      {!showLockscreen && (route.name === 'home' || route.name === 'mine' || route.name === 'detail') && (
        <button onClick={() => setShowLockscreen(true)} title="预览锁屏推送" style={{
          position: 'absolute', bottom: showCreateFab ? 134 : 72, right: 14, zIndex: 30,
          width: 38, height: 38, borderRadius: '50%',
          background: 'var(--c-surface)', color: 'var(--c-text)',
          border: '1px solid var(--c-border)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
        }}><Icon d="bell" size={16} stroke="var(--c-text)" sw={1.8} /></button>
      )}
    </>
  );
}

// ─── Static screen builders for the canvas ──────────────
function buildStaticScreens(vars, fontSize) {
  const m = MOCK.meetings[0];
  const phoneProps = { vars, fontSize, dark: false };
  return {
    login: <LoginScreen onLogin={() => {}} onSwitch={() => {}} />,
    register: <RegisterScreen onBack={() => {}} onSubmit={() => {}} />,
    calendar: <CalendarHomeStatic />,
    list: <ListHomeStatic />,
    detail: <DetailScreen m={m} onBack={() => {}} onShowReceipt={() => {}} onLeave={() => {}} onCheckin={() => {}} />,
    receipt: <ReceiptOver m={m} />,
    leave: <LeaveScreen m={m} onBack={() => {}} onSubmit={() => {}} />,
    checkin: <CheckinScreen m={m} onBack={() => {}} onSuccess={() => {}} succeeded={false} />,
    profile: <ProfileScreen user={MOCK.currentUser} meetings={MOCK.meetings} onOpenOrg={() => {}} onOpenMyOrganized={() => {}} onOpenCreate={() => {}} />,
    org: <OrgScreen onBack={() => {}} />,
    lockscreen: <LockscreenOver />,
    bannerHome: <BannerHomeOver />,
    organizedList: <AdminListScreen meetings={MOCK.meetings} onBack={() => {}} onCreate={() => {}} onOpen={() => {}} />,
    create: <AdminCreateScreen onBack={() => {}} onSubmit={() => {}} />,
    dashboard: <AdminDashboardScreen m={m} onBack={() => {}} />,
  };
}

function CalendarHomeStatic() {
  const [view, setView] = React.useState('calendar');
  return (
    <>
      <CalendarHome meetings={MOCK.meetings} todayStr="2026-04-25" view={view} setView={setView} onOpen={() => {}} />
      <TabBar items={TABS} current={'home'} onChange={() => {}} />
    </>
  );
}
function ListHomeStatic() {
  const [view, setView] = React.useState('list');
  return (
    <>
      <ListHome meetings={MOCK.meetings} view={view} setView={setView} onOpen={() => {}} />
      <TabBar items={TABS} current={'home'} onChange={() => {}} />
    </>
  );
}

function ReceiptOver({ m }) {
  return (
    <>
      <DetailScreen m={m} onBack={() => {}} onShowReceipt={() => {}} onLeave={() => {}} onCheckin={() => {}} />
      <ReceiptModal m={m} onClose={() => {}} onConfirm={() => {}} onLeave={() => {}} />
    </>
  );
}
function LockscreenOver() {
  return <LockscreenReminder m={MOCK.meetings[0]} onTap={() => {}} onClose={() => {}} />;
}
function BannerHomeOver() {
  const [view, setView] = React.useState('list');
  return (
    <>
      <Banner tone="accent" icon="bell"
        title="10 分钟后开始 · Q2 产品评审会"
        body="3F 启明会议室 · 距离你 80m"
        action={{ label: '查看', onClick: () => {} }}
        onDismiss={() => {}} />
      <ListHome meetings={MOCK.meetings} view={view} setView={setView} onOpen={() => {}} />
      <TabBar items={TABS} current={'home'} onChange={() => {}} />
    </>
  );
}

// ─── App root ──────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const vars = buildTokens(t);

  const screens = React.useMemo(() => buildStaticScreens(vars, t.fontSize), [vars, t.fontSize]);

  // expose vars on the canvas root
  const rootStyle = { ...vars, fontFamily: '"Inter", "Noto Sans SC", -apple-system, system-ui, sans-serif' };

  return (
    <div style={rootStyle}>
      <DesignCanvas>
        <DCSection id="overview" title="会议日程 App" subtitle="商务企业风 · Android · 完整可点击原型">
          <DCArtboard id="live" label="① 交互原型 · 可点击" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="00 交互原型">
              <LivePhone tweaks={t} />
            </Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="auth" title="登录 / 注册" subtitle="统一企业账户入口">
          <DCArtboard id="login" label="登录" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="01 登录">{screens.login}</Phone>
          </DCArtboard>
          <DCArtboard id="register" label="注册" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="02 注册">{screens.register}</Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="employee" title="员工端" subtitle="日历 / 列表 / 详情 / 提醒 / 回执 / 签到 / 请假">
          <DCArtboard id="cal" label="03 首页 · 日历视图" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="03 首页(日历)">{screens.calendar}</Phone>
          </DCArtboard>
          <DCArtboard id="list" label="04 首页 · 列表视图" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="04 首页(列表)">{screens.list}</Phone>
          </DCArtboard>
          <DCArtboard id="banner" label="05 App 内顶部横幅" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="05 顶部横幅提醒">{screens.bannerHome}</Phone>
          </DCArtboard>
          <DCArtboard id="lock" label="06 锁屏推送" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="06 锁屏推送">{screens.lockscreen}</Phone>
          </DCArtboard>
          <DCArtboard id="detail" label="07 会议详情" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="07 会议详情">{screens.detail}</Phone>
          </DCArtboard>
          <DCArtboard id="receipt" label="08 已读 / 确认回执" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="08 回执弹窗">{screens.receipt}</Phone>
          </DCArtboard>
          <DCArtboard id="leave" label="09 请假申请" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="09 请假">{screens.leave}</Phone>
          </DCArtboard>
          <DCArtboard id="checkin" label="10 扫码签到" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="10 扫码签到">{screens.checkin}</Phone>
          </DCArtboard>
          <DCArtboard id="profile" label="11 个人中心" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="11 我的">{screens.profile}</Phone>
          </DCArtboard>
          <DCArtboard id="org" label="12 人事组织架构" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="12 组织架构">{screens.org}</Phone>
          </DCArtboard>
        </DCSection>

        <DCSection id="organize" title="我发起的会议" subtitle="任何用户都可以发起会议 · 新建 / 列表 / 出勤看板">
          <DCArtboard id="create" label="13 新建会议" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="13 新建会议">{screens.create}</Phone>
          </DCArtboard>
          <DCArtboard id="organizedList" label="14 我发起的会议" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="14 我发起的">{screens.organizedList}</Phone>
          </DCArtboard>
          <DCArtboard id="dashboard" label="15 出勤看板" width={420} height={830}>
            <Phone vars={vars} fontSize={t.fontSize} dark={t.dark} dataLabel="15 出勤看板">{screens.dashboard}</Phone>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="主题" />
        <TweakColor label="主色调" value={t.primaryColor} onChange={v => setTweak('primaryColor', v)} />
        <TweakToggle label="深色模式" value={t.dark} onChange={v => setTweak('dark', v)} />
        <TweakSlider label="字体大小" value={t.fontSize} min={13} max={17} unit="px" onChange={v => setTweak('fontSize', v)} />
        <TweakSection label="视图" />
        <TweakRadio label="首页视图" value={t.viewMode} options={[{value:'calendar',label:'日历'},{value:'list',label:'列表'}]} onChange={v => setTweak('viewMode', v)} />
      </TweaksPanel>
    </div>
  );
}

// scan-line keyframes injection
if (!document.getElementById('app-anim')) {
  const s = document.createElement('style');
  s.id = 'app-anim';
  s.textContent = `
    @keyframes scan { 0% { top: 12px; } 50% { top: calc(100% - 14px); } 100% { top: 12px; } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  `;
  document.head.appendChild(s);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

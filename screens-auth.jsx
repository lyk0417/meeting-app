// Auth screens: login + register
// Both screens use a simple monochrome layout with a brand mark on top.

// 冀东油田 / CNPC mark — knockout silhouette of the user-provided logo, tinted via CSS mask
function BrandMark({ size = 56, color = '#fff' }) {
  return (
    <div style={{
      width: size, height: size * (234/200), flexShrink: 0,
      backgroundColor: color,
      WebkitMaskImage: 'url(assets/jidong-logo-white.png)',
      maskImage: 'url(assets/jidong-logo-white.png)',
      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
      WebkitMaskSize: 'contain', maskSize: 'contain',
      WebkitMaskPosition: 'center', maskPosition: 'center',
    }} />
  );
}

function LoginScreen({ onLogin, onSwitch }) {
  const [email, setEmail] = React.useState('lisiqi@company.com');
  const [pwd, setPwd] = React.useState('••••••••');

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: 'var(--c-bg)',
    }}>
      {/* Hero band — knockout brand */}
      <div style={{
        background: '#1a1a1a',
        padding: '36px 24px 30px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* subtle radial backlight behind the logo */}
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(225,29,46,0.22), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <BrandMark size={72} color="#ffffff" />
        <div style={{ marginTop: 14, textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 11, color: '#e11d2e', letterSpacing: 1.4, fontWeight: 600 }}>CNPC · 中国石油</div>
          <div style={{ fontSize: 17, fontWeight: 600, color: '#fafaf7', letterSpacing: 0.2, marginTop: 4 }}>冀东油田 · 西部勘探开发区</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '28px 24px 20px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--c-text)', letterSpacing: -0.4, lineHeight: 1.2 }}>会议提醒</div>
          <div style={{ fontSize: 13, color: 'var(--c-text-secondary)', marginTop: 6 }}>使用企业账户登录，查看与发起会议。</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="企业邮箱 / 工号" value={email} onChange={setEmail} />
          <Field label="密码" value={pwd} onChange={setPwd} type="password"
            trailing={<span style={{ fontSize: 12, color: 'var(--c-accent)', cursor: 'pointer' }}>忘记</span>} />
        </div>

        <div style={{ marginTop: 24 }}>
          <Btn full onClick={() => onLogin()}>登录</Btn>
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--c-text-tertiary)', textAlign: 'center' }}>
          还没有账户？<span onClick={onSwitch} style={{ color: 'var(--c-text)', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>立即注册</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 11, color: 'var(--c-text-tertiary)', letterSpacing: 0.3,
        }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--c-text-tertiary)', opacity: 0.5 }} />
          登录即代表同意《服务协议》与《隐私政策》
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onSubmit, onBack }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pwd, setPwd] = React.useState('');
  const [code, setCode] = React.useState('');
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--c-bg)' }}>
      <TopBar
        leading={<IconBtn d="back" onClick={onBack} />}
        title="注册账户"
        border={false}
      />
      <div style={{ flex: 1, padding: '12px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
            注册需企业邀请码。如未收到邀请码，请联系所在部门人事。
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="姓名" value={name} onChange={setName} placeholder="请输入真实姓名" />
          <Field label="企业邮箱" value={email} onChange={setEmail} placeholder="name@company.com" />
          <Field label="设置密码" value={pwd} onChange={setPwd} type="password" hint="至少 8 位，包含字母与数字" />
          <Field label="企业邀请码" value={code} onChange={setCode} placeholder="6 位字符，区分大小写" />
        </div>

        <div style={{ flex: 1 }} />
        <Btn full onClick={onSubmit} style={{ marginTop: 24 }}>提交注册</Btn>
        <div style={{ fontSize: 11, color: 'var(--c-text-tertiary)', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
          注册成功后将进入审核，预计 1 个工作日内完成。
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreen, RegisterScreen, BrandMark });

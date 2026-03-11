import { useState, useEffect } from 'react';
import Head from 'next/head';

/* ── Types ─────────────────────────────────────────────── */

interface Config {
  channel: string;
  sevenTVEmotes: boolean;
  sevenTVCosmetics: boolean;
  theme: string;
  textSize: string;
  textShadow: string;
  stroke: string;
  animation: string;
  fade: number | false;
  showPin: boolean;
  textBg: boolean;
  textBgWidth: string;
  emoteScale: number;
  smallCaps: boolean;
  nlAfterName: boolean;
  hideNames: boolean;
}

const DEFAULTS: Config = {
  channel: '',
  sevenTVEmotes: true,
  sevenTVCosmetics: true,
  theme: 'dark',
  textSize: 'medium',
  textShadow: 'small',
  stroke: 'none',
  animation: 'slide',
  fade: false,
  showPin: false,
  textBg: false,
  textBgWidth: 'min',
  emoteScale: 1,
  smallCaps: false,
  nlAfterName: false,
  hideNames: false,
};

/* ── Fake preview messages ─────────────────────────────── */

const PREVIEW_MSGS = [
  { badge: '#53fc18', username: 'Broadcaster', color: '#53fc18',  msg: 'Welcome to my stream! PogChamp' },
  { badge: '#5b87ff', username: 'ModeratorUser', color: '#5b87ff', msg: 'chat is so hype tonight KEKW' },
  { badge: null,      username: 'chatter123',    color: '#D399FF', msg: 'Hello, this is what your chat looks like! 👋' },
  { badge: null,      username: 'subscriber99',  color: '#FF8C00', msg: 'Great stream bro LUL' },
];

/* ── Main component ────────────────────────────────────── */

export default function LandingPage() {
  const [cfg, setCfg] = useState<Config>(DEFAULTS);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://your-domain.vercel.app');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const set = <K extends keyof Config>(k: K, v: Config[K]) =>
    setCfg(prev => ({ ...prev, [k]: v }));

  const params = new URLSearchParams({
    channel: cfg.channel || 'yourchannel',
    sevenTVEmotesEnabled: String(cfg.sevenTVEmotes),
    sevenTVCosmeticsEnabled: String(cfg.sevenTVCosmetics),
    theme: cfg.theme,
    textSize: cfg.textSize,
    textShadow: cfg.textShadow,
    stroke: cfg.stroke,
    animation: cfg.animation,
    ...(cfg.fade !== false ? { fade: String(cfg.fade) } : {}),
    showPinEnabled: String(cfg.showPin),
    textBackgroundEnabled: String(cfg.textBg),
    textBackgroundWidth: cfg.textBgWidth,
    emoteScale: String(cfg.emoteScale),
    smallCaps: String(cfg.smallCaps),
    nlAfterName: String(cfg.nlAfterName),
    hideNames: String(cfg.hideNames),
  });

  const overlayUrl = `${baseUrl}/?${params.toString()}`;

  const copy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Preview styles ── */
  const previewFontSize = cfg.textSize === 'small' ? '0.82rem' : cfg.textSize === 'large' ? '1.25rem' : '1rem';
  const previewShadow =
    cfg.textShadow === 'small'  ? '1px 1px 2px #000,-1px -1px 2px #000' :
    cfg.textShadow === 'medium' ? '1px 1px 3px #000,-1px -1px 3px #000,0 0 5px #000' :
    cfg.textShadow === 'large'  ? '1px 1px 4px #000,-1px -1px 4px #000,0 0 10px #000' : 'none';
  const previewStroke: React.CSSProperties =
    cfg.stroke === 'thin'    ? { WebkitTextStroke: '1px black' } :
    cfg.stroke === 'medium'  ? { WebkitTextStroke: '2px black' } :
    cfg.stroke === 'thick'   ? { WebkitTextStroke: '3px black' } :
    cfg.stroke === 'thicker' ? { WebkitTextStroke: '4px black' } : {};

  return (
    <>
      <Head>
        <title>Kick Chat Overlay</title>
        <meta name="description" content="Free Kick chat overlay for OBS with 7TV support." />
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #0d0d0d; color: #fff; font-family: 'Segoe UI', system-ui, sans-serif; }
        select option { background: #1e1e1e; }
        .preview-bg {
          background: repeating-conic-gradient(#111 0% 25%, #0a0a0a 0% 50%) 0 0 / 18px 18px;
        }
        .control-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .control-label { min-width: 130px; font-size: 0.8rem; color: #888; }
        select, input[type=text], input[type=number] {
          background: #1c1c1c; border: 1px solid #333; border-radius: 4px;
          color: #fff; padding: 3px 7px; font-size: 0.82rem; outline: none;
        }
        select:focus, input:focus { border-color: #53fc18; }
        .toggle-chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 99px; cursor: pointer;
          font-size: 0.78rem; border: 1px solid #333; background: #181818;
          transition: all .15s; user-select: none;
        }
        .toggle-chip.on { border-color: #53fc18; background: rgba(83,252,24,0.08); color: #53fc18; }
        .toggle-chip .dot { width: 7px; height: 7px; border-radius: 50%; background: #555; transition: background .15s; }
        .toggle-chip.on .dot { background: #53fc18; }
        .section-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: .08em; color: #555; margin: 14px 0 6px; }
        a { color: #53fc18; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1e1e1e', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#53fc18', display: 'inline-block', boxShadow: '0 0 6px #53fc18' }} />
          <strong style={{ fontSize: '0.95rem' }}>Kick Chat Overlay</strong>
        </div>
        <a href="https://github.com/gxufy/kick-chat-overlay3" target="_blank" rel="noreferrer"
           style={{ fontSize: '0.75rem', color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
          <GithubIcon /> GitHub
        </a>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28 }}>

        {/* ── Left: controls ── */}
        <div>
          {/* About */}
          <p style={{ color: '#666', fontSize: '0.82rem', marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>
            A clean Kick chat overlay for OBS/Streamlabs with 7TV emotes, cosmetics, name-paints, and zero-width emote stacking.
            No login required.
          </p>

          {/* Channel */}
          <div className="section-title">Channel *</div>
          <input
            type="text"
            placeholder="e.g. xqc"
            value={cfg.channel}
            onChange={e => set('channel', e.target.value)}
            style={{ width: '100%', padding: '6px 10px', fontSize: '0.9rem', marginBottom: 6 }}
          />

          {/* Size / font */}
          <div className="section-title">Appearance</div>

          <div className="control-row">
            <span className="control-label">Text Size</span>
            <InlineRadio
              options={[['small','Small'],['medium','Medium'],['large','Large']]}
              value={cfg.textSize} onChange={v => set('textSize', v)}
            />
          </div>

          <div className="control-row">
            <span className="control-label">Stroke</span>
            <InlineRadio
              options={[['none','Off'],['thin','Thin'],['medium','Medium'],['thick','Thick'],['thicker','Thicker']]}
              value={cfg.stroke} onChange={v => set('stroke', v)}
            />
          </div>

          <div className="control-row">
            <span className="control-label">Shadow</span>
            <InlineRadio
              options={[['none','Off'],['small','Small'],['medium','Medium'],['large','Large']]}
              value={cfg.textShadow} onChange={v => set('textShadow', v)}
            />
          </div>

          <div className="control-row">
            <span className="control-label">Emote Scale</span>
            <input
              type="number" min={0.5} max={3} step={0.1}
              value={cfg.emoteScale}
              onChange={e => set('emoteScale', parseFloat(e.target.value) || 1)}
              style={{ width: 64 }}
            />
            <span style={{ color: '#555', fontSize: '0.75rem' }}>× default size</span>
          </div>

          <div className="control-row">
            <span className="control-label">Theme</span>
            <InlineRadio
              options={[['dark','Dark'],['light','Light'],['system','System']]}
              value={cfg.theme} onChange={v => set('theme', v)}
            />
          </div>

          {/* Behaviour */}
          <div className="section-title">Behaviour</div>

          <div className="control-row">
            <span className="control-label">Animation</span>
            <InlineRadio
              options={[['none','None'],['slide','Slide'],['fade','Fade']]}
              value={cfg.animation} onChange={v => set('animation', v)}
            />
          </div>

          <div className="control-row">
            <span className="control-label">Fade after</span>
            <input
              type="number" min={5} max={300} step={5}
              value={cfg.fade === false ? '' : cfg.fade}
              placeholder="off"
              onChange={e => set('fade', e.target.value === '' ? false : parseInt(e.target.value))}
              style={{ width: 64 }}
            />
            <span style={{ color: '#555', fontSize: '0.75rem' }}>seconds (blank = off)</span>
          </div>

          <div className="control-row">
            <span className="control-label">Text Background Width</span>
            <InlineRadio
              options={[['min','Fit content'],['max','Full width']]}
              value={cfg.textBgWidth} onChange={v => set('textBgWidth', v)}
            />
          </div>

          {/* Toggles */}
          <div className="section-title">Features</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {([
              ['sevenTVEmotes',    '7TV Emotes'],
              ['sevenTVCosmetics', '7TV Cosmetics'],
              ['textBg',           'Text Background'],
              ['showPin',          'Pinned Messages'],
              ['smallCaps',        'Small Caps'],
              ['nlAfterName',      'Newline after name'],
              ['hideNames',        'Hide Usernames'],
            ] as [keyof Config, string][]).map(([k, label]) => (
              <Chip key={k} label={label} value={cfg[k] as boolean} onChange={v => set(k, v as any)} />
            ))}
          </div>

          {/* URL output */}
          <div className="section-title">Your Overlay URL</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
            <code style={{
              flex: 1, display: 'block', background: '#0a0a0a', border: '1px solid #222',
              borderRadius: 5, padding: '8px 10px', fontSize: '0.72rem', color: '#53fc18',
              wordBreak: 'break-all', lineHeight: 1.7, cursor: 'text',
            }}>
              {overlayUrl}
            </code>
            <button onClick={copy} style={{
              flexShrink: 0, background: copied ? '#44d412' : '#53fc18',
              color: '#000', border: 'none', borderRadius: 5, fontWeight: 700,
              fontSize: '0.82rem', padding: '0 16px', cursor: 'pointer', transition: 'background .2s'
            }}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          {/* OBS instructions */}
          <div className="section-title">OBS Setup</div>
          <ol style={{ color: '#666', fontSize: '0.8rem', lineHeight: 2, paddingLeft: 18, margin: 0 }}>
            <li>Configure your settings above and copy the URL</li>
            <li>In OBS: <strong style={{ color: '#bbb' }}>Add Source → Browser Source</strong></li>
            <li>Paste the URL — recommended size: <strong style={{ color: '#bbb' }}>400 × 600</strong></li>
            <li>Enable <strong style={{ color: '#bbb' }}>"Shutdown source when not visible"</strong></li>
            <li>Enable <strong style={{ color: '#bbb' }}>"Refresh browser when scene becomes active"</strong></li>
          </ol>
        </div>

        {/* ── Right: live preview ── */}
        <div>
          <div className="section-title" style={{ marginTop: 0 }}>Preview</div>

          <div className="preview-bg" style={{ borderRadius: 6, border: '1px solid #222', overflow: 'hidden', height: 320, position: 'relative' }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '4px 0',
              fontSize: previewFontSize, textShadow: previewShadow, color: '#fff',
              ...previewStroke,
            }}>
              {PREVIEW_MSGS.map((m, i) => (
                <PreviewMsg
                  key={i}
                  {...m}
                  textBg={cfg.textBg}
                  textBgWidth={cfg.textBgWidth}
                  hideNames={cfg.hideNames}
                  nlAfterName={cfg.nlAfterName}
                  smallCaps={cfg.smallCaps}
                />
              ))}
            </div>
          </div>

          {/* Feature list */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 6, padding: '12px 14px', marginTop: 12 }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '.08em', color: '#444' }}>Features</p>
            {[
              '7TV global + channel emotes',
              '7TV cosmetics (badges, name-paints)',
              'Zero-width emote stacking',
              'Sub, Mod, VIP, Broadcaster badges',
              'Slide / Fade / None animations',
              'Name-paint gradient support',
              'Pinned message banner',
              'Dark / Light / System theme',
            ].map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, fontSize: '0.78rem', color: '#666', lineHeight: 1.9 }}>
                <span style={{ color: '#53fc18' }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>

      </div>

      <p style={{ textAlign: 'center', color: '#333', fontSize: '0.72rem', paddingBottom: 24 }}>
        Open source · Built for Kick streamers
      </p>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────── */

function InlineRadio({
  options, value, onChange,
}: {
  options: [string, string][];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {options.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            padding: '2px 9px', borderRadius: 4, cursor: 'pointer', fontSize: '0.78rem',
            border: `1px solid ${value === v ? '#53fc18' : '#2e2e2e'}`,
            background: value === v ? 'rgba(83,252,24,0.1)' : '#161616',
            color: value === v ? '#53fc18' : '#888',
            transition: 'all .15s',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Chip({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`toggle-chip${value ? ' on' : ''}`}
    >
      <span className="dot" />
      {label}
    </button>
  );
}

function PreviewMsg({
  badge, username, color, msg, textBg, textBgWidth, hideNames, nlAfterName, smallCaps,
}: {
  badge: string | null;
  username: string;
  color: string;
  msg: string;
  textBg: boolean;
  textBgWidth: string;
  hideNames: boolean;
  nlAfterName: boolean;
  smallCaps: boolean;
}) {
  const wrapStyle: React.CSSProperties = {
    display: textBg && textBgWidth === 'max' ? 'block' : 'inline-block',
    background: textBg ? 'rgba(0,0,0,0.5)' : 'transparent',
    borderRadius: textBg ? 3 : 0,
    padding: textBg ? '0 4px' : 0,
    margin: '1px 4px',
    wordBreak: 'break-word',
  };

  return (
    <div style={wrapStyle}>
      {badge && (
        <span style={{ display: 'inline-block', width: '1em', height: '1em', verticalAlign: 'middle', background: badge, borderRadius: 2, marginRight: 3, opacity: 0.85 }} />
      )}
      {!hideNames && (
        <span style={{ fontWeight: 700, color, fontVariant: smallCaps ? 'small-caps' : undefined }}>{username}</span>
      )}
      {!hideNames && !nlAfterName && <span>:&nbsp;</span>}
      {nlAfterName && <br />}
      <span>{msg}</span>
    </div>
  );
}

function GithubIcon() {
  return (
    <svg height={13} width={13} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}

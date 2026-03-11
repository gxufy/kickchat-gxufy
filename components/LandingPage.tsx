import { useState, useEffect } from 'react';
import Head from 'next/head';

/* ─── Exact fonts from chatis CSS files ─────────────────── */
const FONTS: [string, string, string][] = [
  // [param value, display label, CSS font-family]
  ['default',     'Default',                    'inherit'],
  ['baloo',       'Baloo Tammudu',               "'Baloo Tammudu 2', cursive"],
  ['segoe',       'Segoe UI (Chatterino)',        "'Segoe UI', sans-serif"],
  ['roboto',      'Roboto',                      "'Roboto', sans-serif"],
  ['lato',        'Lato',                        "'Lato', sans-serif"],
  ['noto',        'Noto Sans',                   "'Noto Sans JP', sans-serif"],
  ['sourcecode',  'Source Code Pro',             "'Source Code Pro', monospace"],
  ['impact',      'Impact',                      "'Impact', sans-serif"],
  ['comfortaa',   'Comfortaa',                   "'Comfortaa', cursive"],
  ['dancing',     'Dancing Script',              "'Dancing Script', cursive"],
  ['indieflower', 'Indie Flower',                "'Indie Flower', cursive"],
  ['opensans',    'Open Sans',                   "'Open Sans', sans-serif"],
  ['alsina',      'Alsina Ultrajada (Vsauce)',   "'Alsina', cursive"],
];

/* ─── Preview messages ─────────────────────────────────── */
const PREVIEW = [
  { badge: '#53fc18', username: 'Broadcaster',   color: '#53fc18', msg: 'Welcome to the stream! PogChamp' },
  { badge: '#5b87ff', username: 'ModeratorUser', color: '#5b87ff', msg: 'chat is so hype KEKW' },
  { badge: null,      username: 'chatter123',    color: '#D399FF', msg: 'Hello, this is what your chat looks like! 👋' },
  { badge: null,      username: 'subscriber99',  color: '#FF8C00', msg: 'Great stream bro LUL' },
];

export default function LandingPage() {
  const [channel,          setChannel]          = useState('');
  const [sevenTVEmotes,    setSevenTVEmotes]    = useState(true);
  const [sevenTVCosmetics, setSevenTVCosmetics] = useState(true);
  const [theme,            setTheme]            = useState('dark');
  const [textSize,         setTextSize]         = useState('medium');
  const [font,             setFont]             = useState('default');
  const [textShadow,       setTextShadow]       = useState('small');
  const [stroke,           setStroke]           = useState('none');
  const [animation,        setAnimation]        = useState('slide');
  const [fade,             setFade]             = useState('');
  const [showPin,          setShowPin]          = useState(false);
  const [textBg,           setTextBg]           = useState(false);
  const [textBgWidth,      setTextBgWidth]      = useState('min');
  const [emoteScale,       setEmoteScale]       = useState('1');
  const [smallCaps,        setSmallCaps]        = useState(false);
  const [nlAfterName,      setNlAfterName]      = useState(false);
  const [hideNames,        setHideNames]        = useState(false);
  const [copied,           setCopied]           = useState(false);
  const [baseUrl,          setBaseUrl]          = useState('https://your-domain.vercel.app');

  useEffect(() => { setBaseUrl(window.location.origin); }, []);

  const params = new URLSearchParams({
    channel:                 channel || 'yourchannel',
    sevenTVEmotesEnabled:    String(sevenTVEmotes),
    sevenTVCosmeticsEnabled: String(sevenTVCosmetics),
    theme,
    textSize,
    font,
    textShadow,
    stroke,
    animation,
    ...(fade !== '' ? { fade } : {}),
    showPinEnabled:          String(showPin),
    textBackgroundEnabled:   String(textBg),
    textBackgroundWidth:     textBgWidth,
    emoteScale,
    smallCaps:               String(smallCaps),
    nlAfterName:             String(nlAfterName),
    hideNames:               String(hideNames),
  });

  const overlayUrl = `${baseUrl}/?${params.toString()}`;
  const copy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Current font CSS for preview
  const currentFontCSS = FONTS.find(([v]) => v === font)?.[2] ?? 'inherit';

  // Exact px values from chatis size_*.css
  const previewFontSize =
    textSize === 'small' ? '20px' : textSize === 'large' ? '48px' : '34px';
  const previewLineHeight =
    textSize === 'small' ? '30px' : textSize === 'large' ? '75px' : '55px';
  // Exact drop-shadow from chatis shadow_*.css
  const previewFilter =
    textShadow === 'small'  ? 'drop-shadow(2px 2px 0.2rem black)' :
    textShadow === 'medium' ? 'drop-shadow(2px 2px 0.35rem black)' :
    textShadow === 'large'  ? 'drop-shadow(2px 2px 0.5rem black)' : '';
  const previewStroke: React.CSSProperties =
    stroke === 'thin'    ? { WebkitTextStroke: '1px black' } :
    stroke === 'medium'  ? { WebkitTextStroke: '2px black' } :
    stroke === 'thick'   ? { WebkitTextStroke: '3px black' } :
    stroke === 'thicker' ? { WebkitTextStroke: '4px black' } : {};

  return (
    <>
      <Head>
        <title>Kick Chat Overlay</title>
        <meta name="description" content="Free Kick chat overlay for OBS with 7TV support." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* All Google Fonts used by chatis */}
        <link href="https://fonts.googleapis.com/css2?family=Baloo+Tammudu+2:wght@400;700;800&family=Comfortaa:wght@300;400;700&family=Dancing+Script:wght@400;700&family=Indie+Flower&family=Lato:ital,wght@0,400;0,700;0,800;1,400&family=Noto+Sans+JP:wght@400;700;900&family=Open+Sans:wght@400;700;800&family=Roboto:wght@400;700;900&family=Source+Code+Pro:wght@400;700;900&display=swap" rel="stylesheet" />
        {/* Alsina — custom font from chatis CDN */}
        <style>{`
          @font-face {
            font-family: Alsina;
            src: url(https://chatis.is2511.com/v2/styles/Alsina_Ultrajada.ttf);
          }
        `}</style>
      </Head>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #0d0d0d; color: #fff; font-family: 'Segoe UI', system-ui, sans-serif; }
        select option { background: #1e1e1e; }
        .preview-bg {
          background: repeating-conic-gradient(#111 0% 25%, #0a0a0a 0% 50%) 0 0/18px 18px;
        }
        .row { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .lbl { min-width: 138px; font-size: 0.78rem; color: #777; flex-shrink: 0; }
        input[type=text], input[type=number], select {
          background: #1b1b1b; border: 1px solid #2e2e2e; border-radius: 4px;
          color: #fff; padding: 3px 8px; font-size: 0.8rem; outline: none;
        }
        input[type=text]:focus, input[type=number]:focus, select:focus { border-color: #53fc18; }
        .sec { font-size: 0.68rem; text-transform: uppercase; letter-spacing: .09em;
               color: #444; margin: 12px 0 5px; }
        .chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 2px 10px; border-radius: 99px; cursor: pointer;
          font-size: 0.76rem; border: 1px solid #2e2e2e; background: #161616;
          color: #666; transition: all .12s; user-select: none;
        }
        .chip.on { border-color: #53fc18; background: rgba(83,252,24,0.08); color: #53fc18; }
        .chip .dot { width: 6px; height: 6px; border-radius: 50%; background: #444; transition: background .12s; }
        .chip.on .dot { background: #53fc18; }
        .rbtn {
          padding: 2px 9px; border-radius: 4px; cursor: pointer; font-size: 0.76rem;
          border: 1px solid #2a2a2a; background: #141414; color: #666; transition: all .12s;
        }
        .rbtn.on { border-color: #53fc18; background: rgba(83,252,24,0.1); color: #53fc18; }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '9px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#53fc18', display: 'inline-block', boxShadow: '0 0 5px #53fc18' }} />
          <strong style={{ fontSize: '0.9rem', letterSpacing: '-.01em' }}>Kick Chat Overlay</strong>
        </div>
        <a href="https://github.com/gxufy/kick-chat-overlay3" target="_blank" rel="noreferrer"
           style={{ fontSize: '0.72rem', color: '#444', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          <GithubIcon /> GitHub
        </a>
      </header>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '20px 20px 40px', display: 'grid', gridTemplateColumns: '1fr 350px', gap: 28 }}>

        {/* ── Left: controls ── */}
        <div>
          <p style={{ color: '#555', fontSize: '0.78rem', marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
            Clean Kick chat overlay for OBS/Streamlabs — 7TV emotes, name-paints, zero-width stacking, live emote updates.
          </p>

          <div className="sec">Channel *</div>
          <input type="text" placeholder="e.g. xqc" value={channel}
            onChange={e => setChannel(e.target.value)}
            style={{ width: '100%', padding: '6px 10px', fontSize: '0.88rem', marginBottom: 4 }} />

          <div className="sec">Appearance</div>

          {/* Font picker — uses actual font-family in the option so it previews */}
          <div className="row">
            <span className="lbl">Font</span>
            <select value={font} onChange={e => setFont(e.target.value)}
              style={{ flex: 1, fontFamily: currentFontCSS }}>
              {FONTS.map(([v, label, css]) => (
                <option key={v} value={v} style={{ fontFamily: css }}>{label}</option>
              ))}
            </select>
          </div>

          <div className="row">
            <span className="lbl">Text Size</span>
            <Radios options={[['small','Small'],['medium','Medium'],['large','Large']]} value={textSize} onChange={setTextSize} />
          </div>

          <div className="row">
            <span className="lbl">Stroke</span>
            <Radios options={[['none','Off'],['thin','Thin'],['medium','Medium'],['thick','Thick'],['thicker','Thicker']]} value={stroke} onChange={setStroke} />
          </div>

          <div className="row">
            <span className="lbl">Shadow</span>
            <Radios options={[['none','Off'],['small','Small'],['medium','Medium'],['large','Large']]} value={textShadow} onChange={setTextShadow} />
          </div>

          <div className="row">
            <span className="lbl">Emote Scale</span>
            <input type="number" min={0.5} max={3} step={0.25} value={emoteScale}
              onChange={e => setEmoteScale(e.target.value)} style={{ width: 60 }} />
            <span style={{ color: '#555', fontSize: '0.72rem' }}>× default</span>
          </div>

          <div className="row">
            <span className="lbl">Theme</span>
            <Radios options={[['dark','Dark'],['light','Light'],['system','System']]} value={theme} onChange={setTheme} />
          </div>

          <div className="sec">Behaviour</div>

          <div className="row">
            <span className="lbl">Animation</span>
            <Radios options={[['none','None'],['slide','Slide'],['fade','Fade']]} value={animation} onChange={setAnimation} />
          </div>

          <div className="row">
            <span className="lbl">Fade after</span>
            <input type="number" min={5} max={300} step={5} value={fade} placeholder="off"
              onChange={e => setFade(e.target.value)} style={{ width: 60 }} />
            <span style={{ color: '#555', fontSize: '0.72rem' }}>seconds (blank = off)</span>
          </div>

          <div className="row" style={{ alignItems: 'flex-start' }}>
            <span className="lbl" style={{ paddingTop: 3 }}>Text Background</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Chip label="Enable" value={textBg} onChange={setTextBg} />
              {textBg && (
                <Radios options={[['min','Fit content'],['max','Full width']]} value={textBgWidth} onChange={setTextBgWidth} />
              )}
            </div>
          </div>

          <div className="sec">Features</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            <Chip label="7TV Emotes"         value={sevenTVEmotes}    onChange={setSevenTVEmotes} />
            <Chip label="7TV Cosmetics"      value={sevenTVCosmetics} onChange={setSevenTVCosmetics} />
            <Chip label="Pinned Messages"    value={showPin}          onChange={setShowPin} />
            <Chip label="Small Caps"         value={smallCaps}        onChange={setSmallCaps} />
            <Chip label="Newline after name" value={nlAfterName}      onChange={setNlAfterName} />
            <Chip label="Hide Usernames"     value={hideNames}        onChange={setHideNames} />
          </div>

          <div className="sec">Your Overlay URL</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <code style={{
              flex: 1, background: '#080808', border: '1px solid #1e1e1e', borderRadius: 5,
              padding: '7px 10px', fontSize: '0.7rem', color: '#53fc18',
              wordBreak: 'break-all', lineHeight: 1.8,
            }}>
              {overlayUrl}
            </code>
            <button onClick={copy} style={{
              flexShrink: 0, background: copied ? '#44d412' : '#53fc18',
              color: '#000', border: 'none', borderRadius: 5, fontWeight: 700,
              fontSize: '0.8rem', padding: '0 16px', cursor: 'pointer', transition: 'background .2s',
            }}>
              {copied ? '✓' : 'Copy'}
            </button>
          </div>

          <div className="sec">OBS Setup</div>
          <ol style={{ color: '#555', fontSize: '0.77rem', lineHeight: 2.1, paddingLeft: 18, margin: 0 }}>
            <li>Configure your settings and copy the URL above</li>
            <li>In OBS: <strong style={{ color: '#aaa' }}>Add Source → Browser Source</strong></li>
            <li>Paste the URL — recommended: <strong style={{ color: '#aaa' }}>400 × 600</strong></li>
            <li>Enable <strong style={{ color: '#aaa' }}>"Shutdown source when not visible"</strong></li>
            <li>Enable <strong style={{ color: '#aaa' }}>"Refresh browser when scene becomes active"</strong></li>
          </ol>
        </div>

        {/* ── Right: live preview ── */}
        <div>
          <div className="sec" style={{ marginTop: 0 }}>Live Preview</div>
          <div className="preview-bg" style={{
            borderRadius: 6, border: '1px solid #1e1e1e',
            overflow: 'hidden', height: 300, position: 'relative',
          }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '4px 0',
              fontSize: previewFontSize,
              lineHeight: previewLineHeight,
              fontFamily: currentFontCSS,
              fontWeight: 800,
              color: '#fff',
              ...(previewFilter ? { filter: previewFilter } : {}),
              ...previewStroke,
            }}>
              {PREVIEW.map((m, i) => (
                <PreviewMsg key={i} {...m}
                  textBg={textBg} textBgWidth={textBgWidth}
                  hideNames={hideNames} nlAfterName={nlAfterName}
                  smallCaps={smallCaps}
                />
              ))}
            </div>
          </div>

          <div style={{ marginTop: 5, fontSize: '0.69rem', color: '#444', textAlign: 'right' }}>
            Font: <span style={{ color: '#555', fontFamily: currentFontCSS }}>
              {FONTS.find(([v]) => v === font)?.[1]}
            </span>
          </div>

          <div style={{
            background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 6,
            padding: '11px 14px', marginTop: 10,
          }}>
            <p style={{ margin: '0 0 7px', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '.09em', color: '#3a3a3a' }}>Features</p>
            {[
              '7TV global + channel emotes',
              '7TV cosmetics — badges & name-paints',
              'Zero-width emote stacking',
              'Sub, Mod, VIP, Broadcaster badges',
              'Batched slide / fade / none animations',
              'Live emote updates via 7TV EventAPI',
              'Pinned message banner',
              'Dark / Light / System theme',
            ].map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, fontSize: '0.76rem', color: '#555', lineHeight: 1.9 }}>
                <span style={{ color: '#53fc18', flexShrink: 0 }}>✓</span>{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: '#2a2a2a', fontSize: '0.7rem', paddingBottom: 20 }}>
        Open source · Built for Kick streamers
      </p>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────── */
function Radios({ options, value, onChange }: {
  options: [string, string][];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} className={`rbtn${value === v ? ' on' : ''}`}>{l}</button>
      ))}
    </div>
  );
}

function Chip({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className={`chip${value ? ' on' : ''}`}>
      <span className="dot" />{label}
    </button>
  );
}

function PreviewMsg({ badge, username, color, msg, textBg, textBgWidth, hideNames, nlAfterName, smallCaps }: {
  badge: string | null; username: string; color: string; msg: string;
  textBg: boolean; textBgWidth: string; hideNames: boolean; nlAfterName: boolean; smallCaps: boolean;
}) {
  const wrapStyle: React.CSSProperties = {
    display: 'inline-block',
    margin: '1px 4px',
    padding: textBg ? '0 4px' : 0,
    background: textBg ? 'rgba(0,0,0,0.5)' : 'transparent',
    borderRadius: textBg ? 3 : 0,
    width: textBg && textBgWidth === 'max' ? 'calc(100% - 8px)' : undefined,
    wordBreak: 'break-word',
  };

  return (
    <p style={{ margin: '1px 0', padding: 0 }}>
      <span style={wrapStyle}>
        {badge && (
          <span style={{
            display: 'inline-block', width: '1.1em', height: '1.1em',
            verticalAlign: 'middle', background: badge,
            borderRadius: 3, marginRight: 4, opacity: 0.9,
          }} />
        )}
        {!hideNames && (
          <span style={{ fontWeight: 700, color, fontVariant: smallCaps ? 'small-caps' : undefined }}>
            {username}
          </span>
        )}
        {!hideNames && !nlAfterName && <span>:&nbsp;</span>}
        {nlAfterName && <br />}
        <span>{msg}</span>
      </span>
    </p>
  );
}

function GithubIcon() {
  return (
    <svg height={13} width={13} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}

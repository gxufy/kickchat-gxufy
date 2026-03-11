import { useState, useEffect } from 'react';
import Head from 'next/head';

/* ─── Exact fonts from chatis font_*.css ─────────────────── */
const FONTS: [string, string, string][] = [
  ['default',     'Default',                  'inherit'],
  ['baloo',       'Baloo Tammudu',             "'Baloo Tammudu 2', cursive"],
  ['segoe',       'Segoe UI (Chatterino)',     "'Segoe UI', sans-serif"],
  ['roboto',      'Roboto',                   "'Roboto', sans-serif"],
  ['lato',        'Lato',                     "'Lato', sans-serif"],
  ['noto',        'Noto Sans JP',             "'Noto Sans JP', sans-serif"],
  ['sourcecode',  'Source Code Pro',          "'Source Code Pro', monospace"],
  ['impact',      'Impact',                   "'Impact', sans-serif"],
  ['comfortaa',   'Comfortaa',                "'Comfortaa', cursive"],
  ['dancing',     'Dancing Script',           "'Dancing Script', cursive"],
  ['indieflower', 'Indie Flower',             "'Indie Flower', cursive"],
  ['opensans',    'Open Sans',                "'Open Sans', sans-serif"],
  ['alsina',      'Alsina Ultrajada (Vsauce)','Alsina, cursive'],
];

/* Exact px from size_*.css */
const PREVIEW_SIZE: Record<string, { fontSize:string; lineHeight:string; badgeH:string }> = {
  small:  { fontSize:'20px', lineHeight:'30px', badgeH:'16px' },
  medium: { fontSize:'34px', lineHeight:'55px', badgeH:'28px' },
  large:  { fontSize:'48px', lineHeight:'75px', badgeH:'40px' },
};

const PREVIEW_MSGS = [
  { color:'#53fc18', username:'Broadcaster', msg:'Welcome to the stream! PogChamp',  dot:'#53fc18' },
  { color:'#5b87ff', username:'ModeratorUser', msg:'chat is so hype KEKW',           dot:'#5b87ff' },
  { color:'#D399FF', username:'chatter123',  msg:'Hello! This is how your chat looks 👋', dot:null },
  { color:'#FF8C00', username:'subscriber99',msg:'Great stream bro LUL',             dot:null },
];

export default function LandingPage() {
  const [channel,     setChannel]     = useState('');
  const [sevenTVE,    setSevenTVE]    = useState(true);
  const [sevenTVC,    setSevenTVC]    = useState(true);
  const [theme,       setTheme]       = useState('dark');
  const [textSize,    setTextSize]    = useState('medium');
  const [font,        setFont]        = useState('default');
  const [textShadow,  setTextShadow]  = useState('small');
  const [stroke,      setStroke]      = useState('none');
  const [animation,   setAnimation]   = useState('slide');
  const [fade,        setFade]        = useState('');
  const [showPin,     setShowPin]     = useState(false);
  const [textBg,      setTextBg]      = useState(false);
  const [textBgWidth, setTextBgWidth] = useState('min');
  const [emoteScale,  setEmoteScale]  = useState('1');
  const [smallCaps,   setSmallCaps]   = useState(false);
  const [nlAfterName, setNlAfterName] = useState(false);
  const [hideNames,   setHideNames]   = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [baseUrl,     setBaseUrl]     = useState('https://kick-chat-overlay3.vercel.app');

  useEffect(() => { setBaseUrl(window.location.origin); }, []);

  const params = new URLSearchParams({
    channel: channel || 'yourchannel',
    sevenTVEmotesEnabled:    String(sevenTVE),
    sevenTVCosmeticsEnabled: String(sevenTVC),
    theme, textSize, font, textShadow, stroke, animation,
    ...(fade !== '' ? { fade } : {}),
    showPinEnabled:        String(showPin),
    textBackgroundEnabled: String(textBg),
    textBackgroundWidth:   textBgWidth,
    emoteScale, smallCaps: String(smallCaps),
    nlAfterName: String(nlAfterName),
    hideNames:   String(hideNames),
  });
  const overlayUrl = `${baseUrl}/?${params.toString()}`;

  const copy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fontCSS = FONTS.find(([v]) => v === font)?.[2] ?? 'inherit';
  const psz = PREVIEW_SIZE[textSize] ?? PREVIEW_SIZE.medium;

  /* Exact drop-shadow from chatis shadow_*.css */
  const previewFilter =
    textShadow === 'small'  ? 'drop-shadow(2px 2px 0.2rem black)' :
    textShadow === 'medium' ? 'drop-shadow(2px 2px 0.35rem black)' :
    textShadow === 'large'  ? 'drop-shadow(2px 2px 0.5rem black)' : '';

  const previewStrokeCSS =
    stroke === 'thin'    ? '1px black' :
    stroke === 'medium'  ? '2px black' :
    stroke === 'thick'   ? '3px black' :
    stroke === 'thicker' ? '4px black' : '';

  return (
    <>
      <Head>
        <title>Kick Chat Overlay</title>
        <meta name="description" content="Free Kick chat overlay for OBS — 7TV emotes, name-paints, badges." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+Tammudu+2:wght@400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Indie+Flower&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,400&family=Noto+Sans+JP:wght@100;300;400;500;700;900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,400&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
        <style>{`@font-face{font-family:Alsina;src:url(https://chatis.is2511.com/v2/styles/Alsina_Ultrajada.ttf);}`}</style>
      </Head>

      <style>{`
        *{box-sizing:border-box;}
        html,body{margin:0;padding:0;background:#0f0f0f;color:#e8e8e8;font-family:'Open Sans',system-ui,sans-serif;font-size:15px;}
        a{color:#53fc18;text-decoration:none;}
        a:hover{text-decoration:underline;}

        .page{max-width:760px;margin:0 auto;padding:0 18px 60px;}

        /* Header — chatis style: channel name + dot */
        .hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 0 10px;}
        .hdr-left{display:flex;align-items:center;gap:10px;}
        .hdr-dot{width:9px;height:9px;border-radius:50%;background:#53fc18;box-shadow:0 0 6px #53fc18;}
        .hdr-title{font-size:1rem;font-weight:700;letter-spacing:-.01em;color:#fff;}
        .hdr-sub{font-size:0.72rem;color:#3a3a3a;}

        .divider{border:none;border-top:1px solid #1c1c1c;margin:0;}

        /* Section labels */
        .sec-label{font-size:0.68rem;text-transform:uppercase;letter-spacing:.1em;color:#3a3a3a;margin:18px 0 8px;}

        /* Control rows */
        .ctrl-row{display:flex;align-items:center;gap:8px;margin-bottom:7px;flex-wrap:wrap;}
        .ctrl-lbl{min-width:140px;font-size:0.78rem;color:#666;flex-shrink:0;}

        /* Radio buttons */
        .rbtn{padding:3px 10px;border-radius:4px;cursor:pointer;font-size:0.76rem;border:1px solid #252525;background:#111;color:#555;transition:all .1s;white-space:nowrap;font-family:inherit;}
        .rbtn:hover{border-color:#333;color:#888;}
        .rbtn.on{border-color:#53fc18;background:rgba(83,252,24,0.08);color:#53fc18;}

        /* Chips */
        .chip{display:inline-flex;align-items:center;gap:5px;padding:3px 11px;border-radius:99px;cursor:pointer;font-size:0.76rem;border:1px solid #252525;background:#111;color:#555;transition:all .1s;user-select:none;font-family:inherit;}
        .chip:hover{border-color:#333;color:#888;}
        .chip.on{border-color:#53fc18;background:rgba(83,252,24,0.08);color:#53fc18;}
        .chip .dot{width:6px;height:6px;border-radius:50%;background:#333;transition:background .1s;flex-shrink:0;}
        .chip.on .dot{background:#53fc18;}

        /* Inputs */
        input[type=text],input[type=number],select{
          background:#111;border:1px solid #252525;border-radius:4px;
          color:#e8e8e8;padding:4px 9px;font-size:0.8rem;outline:none;font-family:inherit;
        }
        input[type=text]:focus,input[type=number]:focus,select:focus{border-color:#53fc18;}
        select option{background:#111;}

        /* URL box */
        .url-box{display:flex;gap:8px;align-items:stretch;margin-bottom:4px;}
        .url-code{flex:1;background:#080808;border:1px solid #1a1a1a;border-radius:5px;padding:8px 11px;font-family:monospace;font-size:0.7rem;color:#53fc18;word-break:break-all;line-height:1.7;}
        .url-copy{flex-shrink:0;background:#53fc18;color:#000;border:none;border-radius:5px;font-weight:800;font-size:0.82rem;padding:0 18px;cursor:pointer;transition:background .15s;font-family:inherit;}
        .url-copy.ok{background:#44d412;}

        /* Preview */
        .preview-wrap{border:1px solid #1c1c1c;border-radius:6px;overflow:hidden;margin-bottom:4px;position:relative;}
        .preview-checker{background:repeating-conic-gradient(#111 0% 25%,#0a0a0a 0% 50%) 0 0/20px 20px;height:220px;position:relative;}
        .preview-msgs{position:absolute;bottom:0;left:0;width:calc(100% - 20px);padding:10px;}

        /* Feature list */
        .feat-item{display:flex;gap:8px;font-size:0.78rem;color:#555;line-height:2;}
        .feat-item span:first-child{color:#53fc18;flex-shrink:0;}

        /* Steps */
        .steps{counter-reset:step;list-style:none;padding:0;margin:0;}
        .steps li{counter-increment:step;display:flex;gap:10px;align-items:flex-start;margin-bottom:8px;font-size:0.8rem;color:#555;line-height:1.5;}
        .steps li::before{content:counter(step);background:#1a1a1a;border:1px solid #252525;border-radius:50%;min-width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;color:#444;flex-shrink:0;margin-top:1px;}
        .steps li strong{color:#888;}
      `}</style>

      <div className="page">

        {/* ── Header ── */}
        <div className="hdr">
          <div className="hdr-left">
            <div className="hdr-dot" />
            <span className="hdr-title">Kick Chat Overlay</span>
          </div>
          <a href="https://github.com/gxufy/kick-chat-overlay3" target="_blank" rel="noreferrer"
             style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.72rem', color:'#3a3a3a' }}>
            <GithubIcon /> GitHub
          </a>
        </div>
        <hr className="divider" />

        <p style={{ color:'#444', fontSize:'0.8rem', lineHeight:1.7, margin:'12px 0 0' }}>
          Free Kick chat overlay for OBS / Streamlabs with 7TV emote support, name-paints, zero-width stacking, and live emote updates.
        </p>

        {/* ── Channel ── */}
        <div className="sec-label">Channel</div>
        <input type="text" placeholder="your channel name (e.g. xqc)" value={channel}
          onChange={e => setChannel(e.target.value)}
          style={{ width:'100%', padding:'7px 11px', fontSize:'0.88rem' }} />

        {/* ── Appearance ── */}
        <div className="sec-label">Appearance</div>

        <div className="ctrl-row">
          <span className="ctrl-lbl">Font</span>
          <select value={font} onChange={e=>setFont(e.target.value)} style={{ flex:1, fontFamily:fontCSS }}>
            {FONTS.map(([v,label,css]) => (
              <option key={v} value={v} style={{ fontFamily:css }}>{label}</option>
            ))}
          </select>
        </div>

        <div className="ctrl-row">
          <span className="ctrl-lbl">Text Size</span>
          <Radios opts={[['small','Small'],['medium','Medium'],['large','Large']]} val={textSize} set={setTextSize} />
        </div>

        <div className="ctrl-row">
          <span className="ctrl-lbl">Stroke</span>
          <Radios opts={[['none','Off'],['thin','Thin'],['medium','Medium'],['thick','Thick'],['thicker','Thicker']]} val={stroke} set={setStroke} />
        </div>

        <div className="ctrl-row">
          <span className="ctrl-lbl">Shadow</span>
          <Radios opts={[['none','Off'],['small','Small'],['medium','Medium'],['large','Large']]} val={textShadow} set={setTextShadow} />
        </div>

        <div className="ctrl-row">
          <span className="ctrl-lbl">Emote Scale</span>
          <input type="number" min={0.5} max={3} step={0.25} value={emoteScale}
            onChange={e=>setEmoteScale(e.target.value)} style={{ width:64 }} />
          <span style={{ color:'#444', fontSize:'0.72rem' }}>× default size</span>
        </div>

        <div className="ctrl-row">
          <span className="ctrl-lbl">Theme</span>
          <Radios opts={[['dark','Dark'],['light','Light'],['system','System']]} val={theme} set={setTheme} />
        </div>

        {/* ── Behaviour ── */}
        <div className="sec-label">Behaviour</div>

        <div className="ctrl-row">
          <span className="ctrl-lbl">Animation</span>
          <Radios opts={[['none','None'],['slide','Slide'],['fade','Fade']]} val={animation} set={setAnimation} />
        </div>

        <div className="ctrl-row">
          <span className="ctrl-lbl">Fade after</span>
          <input type="number" min={5} max={300} step={5} value={fade} placeholder="off"
            onChange={e=>setFade(e.target.value)} style={{ width:64 }} />
          <span style={{ color:'#444', fontSize:'0.72rem' }}>seconds — blank = never</span>
        </div>

        <div className="ctrl-row" style={{ alignItems:'flex-start' }}>
          <span className="ctrl-lbl" style={{ paddingTop:3 }}>Text Background</span>
          <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
            <Chip label="Enable" on={textBg} toggle={()=>setTextBg(v=>!v)} />
            {textBg && (
              <Radios opts={[['min','Fit content'],['max','Full width']]} val={textBgWidth} set={setTextBgWidth} />
            )}
          </div>
        </div>

        {/* ── Features ── */}
        <div className="sec-label">Features</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          <Chip label="7TV Emotes"         on={sevenTVE}    toggle={()=>setSevenTVE(v=>!v)} />
          <Chip label="7TV Cosmetics"      on={sevenTVC}    toggle={()=>setSevenTVC(v=>!v)} />
          <Chip label="Pinned Messages"    on={showPin}     toggle={()=>setShowPin(v=>!v)} />
          <Chip label="Small Caps"         on={smallCaps}   toggle={()=>setSmallCaps(v=>!v)} />
          <Chip label="Newline after name" on={nlAfterName} toggle={()=>setNlAfterName(v=>!v)} />
          <Chip label="Hide Usernames"     on={hideNames}   toggle={()=>setHideNames(v=>!v)} />
        </div>

        {/* ── URL ── */}
        <div className="sec-label">Your Overlay URL</div>
        <div className="url-box">
          <div className="url-code">{overlayUrl}</div>
          <button onClick={copy} className={`url-copy${copied?' ok':''}`}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p style={{ color:'#2e2e2e', fontSize:'0.7rem', margin:'4px 0 0' }}>
          Paste this URL into OBS as a Browser Source. Recommended size: 400 × 600 or wider.
        </p>

        {/* ── Live Preview ── */}
        <div className="sec-label">Live Preview</div>
        <div className="preview-wrap">
          <div className="preview-checker">
            <div className="preview-msgs" style={{
              fontFamily: fontCSS,
              fontSize: psz.fontSize,
              lineHeight: psz.lineHeight,
              fontWeight: 800,
              color: '#fff',
              wordBreak: 'break-word',
              ...(previewFilter ? { filter: previewFilter } : {}),
              ...(previewStrokeCSS ? { WebkitTextStroke: previewStrokeCSS } : {}),
              ...(smallCaps ? { fontVariant: 'small-caps' } : {}),
            }}>
              {PREVIEW_MSGS.map((m, i) => (
                <div key={i} style={{
                  lineHeight: psz.lineHeight,
                  ...(textBg ? {
                    background:'rgba(0,0,0,0.5)', borderRadius:2, padding:'0 4px',
                    display: textBgWidth==='max' ? 'block' : 'table', marginBottom:1,
                  } : {}),
                }}>
                  {!hideNames && (
                    <span style={{ display:'inline-block' }}>
                      {/* Badge placeholder */}
                      {m.dot && (
                        <span style={{
                          display:'inline-block', width:psz.badgeH, height:psz.badgeH,
                          background:m.dot, borderRadius:'10%', verticalAlign:'middle',
                          marginRight:4, marginBottom:2, opacity:0.85,
                        }} />
                      )}
                      <span style={{ color:m.color }}>{m.username}</span>
                      {!nlAfterName ? <span style={{ marginRight:'0.3em' }}>:</span> : <br />}
                    </span>
                  )}{' '}
                  <span>{m.msg}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background:'#0a0a0a', borderTop:'1px solid #161616', padding:'6px 10px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:'0.7rem', color:'#333' }}>
              Size: <strong style={{ color:'#444' }}>{psz.fontSize}</strong>
              {previewFilter && <> · Shadow: <strong style={{ color:'#444' }}>on</strong></>}
              {previewStrokeCSS && <> · Stroke: <strong style={{ color:'#444' }}>on</strong></>}
            </span>
            <span style={{ fontSize:'0.7rem', color:'#333', fontFamily:fontCSS }}>
              {FONTS.find(([v])=>v===font)?.[1]}
            </span>
          </div>
        </div>

        {/* ── OBS Setup ── */}
        <div className="sec-label">OBS Setup</div>
        <ol className="steps">
          <li>Configure settings above, then copy the URL</li>
          <li>In OBS: <strong>Add Source → Browser Source</strong></li>
          <li>Paste the URL — recommended: <strong>400 × 600</strong> (or match your chat area)</li>
          <li>Enable <strong>"Shutdown source when not visible"</strong></li>
          <li>Enable <strong>"Refresh browser when scene becomes active"</strong></li>
        </ol>

        {/* ── Features list ── */}
        <div className="sec-label">What's included</div>
        <div style={{ columns:2, columnGap:16 }}>
          {[
            '7TV global + channel emotes',
            '7TV cosmetics (badges & name-paints)',
            'Zero-width emote stacking',
            'Sub, Mod, VIP, Broadcaster badges',
            'Batched animations (slide / fade)',
            'Live emote updates via 7TV EventAPI',
            'Pinned message banner',
            'Dark / Light / System theme',
            'Message fade-out timer',
            'Stroke + drop-shadow text FX',
          ].map(f => (
            <div key={f} className="feat-item"><span>✓</span>{f}</div>
          ))}
        </div>

      </div>

      <footer style={{ borderTop:'1px solid #141414', padding:'14px 0', textAlign:'center', fontSize:'0.7rem', color:'#252525' }}>
        Open source · <a href="https://github.com/gxufy/kick-chat-overlay3" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────── */
function Radios({ opts, val, set }: { opts:[string,string][]; val:string; set:(v:string)=>void }) {
  return (
    <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
      {opts.map(([v,l]) => (
        <button key={v} onClick={()=>set(v)} className={`rbtn${val===v?' on':''}`}>{l}</button>
      ))}
    </div>
  );
}

function Chip({ label, on, toggle }: { label:string; on:boolean; toggle:()=>void }) {
  return (
    <button onClick={toggle} className={`chip${on?' on':''}`}>
      <span className="dot" />{label}
    </button>
  );
}

function GithubIcon() {
  return (
    <svg height={13} width={13} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}

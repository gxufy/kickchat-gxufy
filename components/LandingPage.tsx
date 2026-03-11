import { useState, useEffect } from 'react';
import Head from 'next/head';

/* Fonts — exact from chatis font_*.css, same order as chatis <select> */
const FONTS: [string, string, string][] = [
  ['baloo',       'Baloo Tammudu',             "'Baloo Tammudu 2', cursive"],
  ['segoe',       'Segoe UI (Chatterino)',      "'Segoe UI', sans-serif"],
  ['roboto',      'Roboto',                    "'Roboto', sans-serif"],
  ['lato',        'Lato',                      "'Lato', sans-serif"],
  ['noto',        'Noto Sans',                 "'Noto Sans JP', sans-serif"],
  ['sourcecode',  'Source Code Pro',           "'Source Code Pro', monospace"],
  ['impact',      'Impact',                    "'Impact', sans-serif"],
  ['comfortaa',   'Comfortaa',                 "'Comfortaa', cursive"],
  ['dancing',     'Dancing Script',            "'Dancing Script', cursive"],
  ['indieflower', 'Indie Flower',              "'Indie Flower', cursive"],
  ['opensans',    'Open Sans',                 "'Open Sans', sans-serif"],
  ['alsina',      'Alsina (Vsauce)',            "Alsina, cursive"],
];

/* Preview size data — exact chatis size_*.css */
const PSZ = {
  small:  { fs:'20px', lh:'30px', bh:'16px', bw:'16px', bmr:'2px', bmb:'3px', blmr:'3px', cmr:'8px',  eh:'25px', ew:'75px'  },
  medium: { fs:'34px', lh:'55px', bh:'28px', bw:'28px', bmr:'4px', bmb:'6px', blmr:'6px', cmr:'14px', eh:'42px', ew:'128px' },
  large:  { fs:'48px', lh:'75px', bh:'40px', bw:'40px', bmr:'5px', bmb:'8px', blmr:'8px', cmr:'20px', eh:'60px', ew:'180px' },
} as const;
type SzKey = keyof typeof PSZ;

/* Sample preview messages */
const PREV_MSGS = [
  { color:'#53fc18', user:'Broadcaster',       msg:'Welcome to the stream!',         dot:'#53fc18', dots:1 },
  { color:'#5b87ff', user:'ModeratorUser',     msg:'chat is so hype',                dot:'#5b87ff', dots:1 },
  { color:'#D399FF', user:'classybeef_fan',    msg:'Hello! This is your chat overlay 👋', dot:null, dots:0 },
  { color:'#FF8C00', user:'subscriber_dude',   msg:'Looks amazing bro',              dot:'#FF8C00', dots:1 },
  { color:'#e040fb', user:'AntiGeorgiSoldier', msg:'so are those the ducks that are like bred to be pets?', dot:null, dots:0 },
];

export default function LandingPage() {
  const [channel,     setChannel]     = useState('');
  const [sevenTVE,    setSevenTVE]    = useState(true);
  const [sevenTVC,    setSevenTVC]    = useState(true);
  const [theme,       setTheme]       = useState('dark');
  const [textSize,    setTextSize]    = useState('medium');
  const [font,        setFont]        = useState('opensans');
  const [textShadow,  setTextShadow]  = useState('small');
  const [stroke,      setStroke]      = useState('none');
  const [animation,   setAnimation]   = useState('slide');
  const [fade,        setFade]        = useState('');
  const [fadeBool,    setFadeBool]    = useState(false);
  const [showPin,     setShowPin]     = useState(false);
  const [textBg,      setTextBg]      = useState(false);
  const [textBgWidth, setTextBgWidth] = useState('min');
  const [emoteScale,  setEmoteScale]  = useState('');
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
    ...(fadeBool && fade !== '' ? { fade } : {}),
    showPinEnabled:        String(showPin),
    textBackgroundEnabled: String(textBg),
    textBackgroundWidth:   textBgWidth,
    ...(emoteScale !== '' ? { emoteScale } : {}),
    smallCaps:   String(smallCaps),
    nlAfterName: String(nlAfterName),
    hideNames:   String(hideNames),
  });
  const overlayUrl = `${baseUrl}/?${params.toString()}`;

  const copy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fontCSS   = FONTS.find(([v]) => v === font)?.[2] ?? "'Open Sans', sans-serif";
  const psz       = PSZ[(textSize as SzKey)] ?? PSZ.medium;

  const pFilter =
    textShadow === 'small'  ? 'drop-shadow(2px 2px 0.2rem black)'  :
    textShadow === 'medium' ? 'drop-shadow(2px 2px 0.35rem black)' :
    textShadow === 'large'  ? 'drop-shadow(2px 2px 0.5rem black)'  : '';
  const pStroke =
    stroke === 'thin'    ? '1px black' :
    stroke === 'medium'  ? '2px black' :
    stroke === 'thick'   ? '3px black' :
    stroke === 'thicker' ? '4px black' : '';

  return (
    <>
      <Head>
        <title>Kick Chat Overlay Setup</title>
        <meta name="description" content="Free Kick chat overlay for OBS with 7TV emotes, badges, name-paints." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Baloo+Tammudu+2:wght@400;500;600;700;800&family=Comfortaa:wght@300;400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Indie+Flower&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,400&family=Noto+Sans+JP:wght@100;300;400;500;700;900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,400&family=Source+Code+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet" />
        <style>{`@font-face{font-family:Alsina;src:url(https://chatis.is2511.com/v2/styles/Alsina_Ultrajada.ttf);}`}</style>
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0; padding: 0;
          background: #1a1a2e;
          color: #e8e8f0;
          font-family: 'Open Sans', system-ui, sans-serif;
          font-size: 16px;
        }
        a { color: #9d60ff; }
        a:hover { color: #c084fc; }

        /* ── Page wrapper ── */
        .page { max-width: 820px; margin: 0 auto; padding: 0 20px 60px; }

        /* ── Header — matches chatis header style ── */
        header {
          display: flex; align-items: center; gap: 16px;
          padding: 20px 0 16px;
          border-bottom: 1px solid #2a2a45;
          margin-bottom: 20px;
        }
        header h1 { margin: 0; font-size: 1.8rem; font-weight: 800; color: #fff; letter-spacing: -.02em; }
        header h2 { margin: 0; font-size: 1rem; font-weight: 400; color: #6b6b9a; }

        /* ── Intro text ── */
        .intro { font-size: 1rem; line-height: 1.7; color: #9090b8; margin-bottom: 20px; }
        .intro em { color: #c084fc; font-style: normal; font-weight: 700; }
        .intro a { color: #53fc18; }

        /* ── Feature list ── */
        #feature-list { color: #7070a0; font-size: 0.9rem; line-height: 1.9; padding-left: 1.2rem; margin-bottom: 24px; }
        #feature-list li::marker { color: #9d60ff; }

        /* ── Form ── */
        form[name="generator"] { background: #12122a; border: 1px solid #2a2a45; border-radius: 8px; padding: 20px; margin-bottom: 20px; }

        .form_row.center { display: flex; justify-content: center; margin-bottom: 14px; }
        .form_row.center input[type=text] { width: 100%; max-width: 400px; text-align: center; font-size: 1.1rem; padding: 8px 14px; }

        .form_table { display: flex; gap: 0; margin-bottom: 14px; }
        .form_col { flex: 1; }
        .form_col:first-child { border-right: 1px solid #2a2a45; padding-right: 20px; }
        .form_col:last-child  { padding-left: 20px; }

        .form_row { display: flex; align-items: center; margin-bottom: 10px; gap: 8px; }
        .form_row.left  { justify-content: flex-start; }
        .form_row.right { justify-content: flex-end; }
        .form_row.right label { order: -1; }

        /* Inputs & selects */
        input[type=text], input[type=number], select {
          background: #1e1e3a; border: 1px solid #3a3a5a;
          border-radius: 4px; color: #e8e8f0;
          padding: 4px 10px; font-size: 0.88rem;
          font-family: inherit; outline: none;
          transition: border-color .15s;
        }
        input[type=text]:focus, input[type=number]:focus, select:focus { border-color: #9d60ff; }
        select option { background: #1e1e3a; }
        input[type=text]:disabled { opacity: 0.35; cursor: not-allowed; }

        input[type=text].short { width: 52px; }

        /* Checkboxes — larger, styled */
        input[type=checkbox] {
          width: 16px; height: 16px; cursor: pointer;
          accent-color: #9d60ff;
        }

        /* Form labels */
        label { font-size: 0.88rem; color: #8080aa; cursor: pointer; user-select: none; }
        label abbr { text-decoration: underline dotted; cursor: help; }

        /* ── Submit / preview area ── */
        #submit_container {
          display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap;
          margin-top: 14px;
        }

        /* ── Preview box — replicates chatis #example ── */
        #example {
          flex: 1; min-width: 280px;
          background: repeating-conic-gradient(#111827 0% 25%, #0f172a 0% 50%) 0 0 / 18px 18px;
          border: 1px solid #2a2a45; border-radius: 6px;
          overflow: hidden; position: relative;
          min-height: 180px;
        }
        .example-inner {
          /* Replicates the #chat_container positioning inside the preview */
          position: absolute; bottom: 0; left: 0;
          width: calc(100% - 20px);
          padding: 10px;
          word-break: break-word;
          font-weight: 800;
          color: white;
        }
        .chat_line { /* .chat_line from chatis — uses dynamic line-height */ }
        .user_info { display: inline-block; }
        .nick { /* colored inline */ }
        .colon { /* margin-right set dynamically */ }
        .message { /* inline */ }

        /* Generate button */
        input[type=submit] {
          background: #9d60ff; color: #fff; border: none;
          border-radius: 6px; font-size: 1rem; font-weight: 700;
          padding: 10px 28px; cursor: pointer; font-family: inherit;
          transition: background .15s; align-self: flex-end;
        }
        input[type=submit]:hover { background: #b07fff; }

        /* ── URL result ── */
        #result { margin-bottom: 20px; }
        .url-box { display: flex; gap: 8px; align-items: stretch; }
        .url-code {
          flex: 1; background: #080818; border: 1px solid #1e1e3a;
          border-radius: 5px; padding: 9px 12px;
          font-family: 'Roboto Mono', monospace; font-size: 0.72rem;
          color: #9d60ff; word-break: break-all; line-height: 1.7;
        }
        .url-copy {
          flex-shrink: 0; background: #9d60ff; color: #fff; border: none;
          border-radius: 5px; font-weight: 800; font-size: 0.85rem;
          padding: 0 20px; cursor: pointer; transition: background .15s; font-family: inherit;
        }
        .url-copy.ok { background: #53fc18; color: #000; }
        #result p { color: #5a5a7a; font-size: 0.82rem; margin: 6px 0 0; }

        /* ── Setup instructions ── */
        .setup-section { margin-top: 20px; }
        .setup-section h2 { font-size: 1rem; color: #9d60ff; font-weight: 700; margin: 0 0 10px; text-transform: uppercase; letter-spacing: .07em; }
        .steps { list-style: none; padding: 0; margin: 0; counter-reset: s; }
        .steps li { counter-increment: s; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 9px; font-size: 0.88rem; color: #7070a0; line-height: 1.5; }
        .steps li::before { content: counter(s); background: #1e1e3a; border: 1px solid #3a3a5a; border-radius: 50%; min-width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; color: #6060a0; flex-shrink: 0; margin-top: 1px; }
        .steps li strong { color: #a0a0cc; }

        /* ── Footer ── */
        footer { border-top: 1px solid #1e1e3a; padding: 20px 0; text-align: center; font-size: 0.82rem; color: #3a3a5a; margin-top: 40px; }
        footer p { margin: 4px 0; }
        footer a { color: #5a5a8a; }

        /* ── Bot names row (full width) ── */
        #botNamesContainer {
          border-top: 1px solid #2a2a45; margin-top: 10px; padding-top: 12px;
          justify-content: flex-start; gap: 10px;
        }
        #botNamesContainer input { flex: 1; }
        #botNamesContainer label { white-space: nowrap; color: #8080aa; font-size: 0.88rem; }
      `}</style>

      <div className="page">

        {/* ── Header — matches chatis header ── */}
        <header>
          <div>
            <h1>Kick Chat Overlay</h1>
            <h2>Setup</h2>
          </div>
        </header>

        {/* ── Intro — mirrors chatis intro text style ── */}
        <p className="intro">
          <em>Kick Chat Overlay</em> is a free browser source overlay for OBS, Streamlabs, and any streaming software that supports browser sources.
          It supports <a href="https://7tv.app/" target="_blank" rel="noreferrer">7TV</a> emotes, name-paints, zero-width stacking, and live emote updates via the 7TV EventAPI.
          You can choose a font, enable smooth animations for new messages, or fade old ones after some time.
        </p>

        <p style={{ marginBottom:'0.2rem', fontSize:'1rem', color:'#9090b8' }}>Feature list:</p>
        <ul id="feature-list">
          <li>7TV global + channel emotes with live updates</li>
          <li>7TV cosmetics — name-paints and badges</li>
          <li>Zero-width emote stacking</li>
          <li>Sub, Mod, VIP, Broadcaster, Founder badges</li>
          <li>Batched slide / fade animations (no stutter on fast chat)</li>
          <li>Stroke, shadow, font options</li>
          <li>Name-paints from 7TV</li>
          <li>Pinned message banner</li>
        </ul>

        {/* ── Generator form — matches chatis layout exactly ── */}
        <form name="generator" onSubmit={e => { e.preventDefault(); copy(); }}>

          {/* Channel name — centered, full width */}
          <div className="form_row center">
            <input type="text" name="channel" placeholder="Channel name"
              value={channel} onChange={e => setChannel(e.target.value)} required />
          </div>

          {/* Two-column table — left: selects, right: checkboxes */}
          <div className="form_table">

            {/* Left column — selects */}
            <div className="form_col">
              <div className="form_row left">
                <select name="size" value={textSize} onChange={e => setTextSize(e.target.value)}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <label htmlFor="size">Size</label>
              </div>

              <div className="form_row left">
                <select name="font" value={font} onChange={e => setFont(e.target.value)}
                  style={{ fontFamily: fontCSS }}>
                  {FONTS.map(([v, label, css]) => (
                    <option key={v} value={v} style={{ fontFamily: css }}>{label}</option>
                  ))}
                </select>
                <label htmlFor="font">Font</label>
              </div>

              <div className="form_row left">
                <select name="stroke" value={stroke} onChange={e => setStroke(e.target.value)}>
                  <option value="none">Off</option>
                  <option value="thin">Thin</option>
                  <option value="medium">Medium</option>
                  <option value="thick">Thick</option>
                  <option value="thicker">Thicker</option>
                </select>
                <label htmlFor="stroke">Stroke</label>
              </div>

              <div className="form_row left">
                <select name="shadow" value={textShadow} onChange={e => setTextShadow(e.target.value)}>
                  <option value="none">Off</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <label htmlFor="shadow">Shadow</label>
              </div>

              <div className="form_row left">
                <select name="animation" value={animation} onChange={e => setAnimation(e.target.value)}>
                  <option value="none">None</option>
                  <option value="slide">Slide</option>
                  <option value="fade">Fade</option>
                </select>
                <label htmlFor="animation">Animation</label>
              </div>

              <div className="form_row left">
                <select name="theme" value={theme} onChange={e => setTheme(e.target.value)}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="system">System</option>
                </select>
                <label htmlFor="theme">Theme</label>
              </div>

              <div className="form_row left">
                <input type="text" name="emoteScale" placeholder="1.0 (0–3)"
                  style={{ width: 120 }}
                  value={emoteScale} onChange={e => setEmoteScale(e.target.value)} />
                <label htmlFor="emoteScale">Emote scale</label>
              </div>
            </div>

            {/* Right column — checkboxes, right-aligned labels like chatis */}
            <div className="form_col">
              <div className="form_row right">
                <label htmlFor="animate">7TV Emotes</label>
                <input type="checkbox" name="sevenTVEmotes" checked={sevenTVE}
                  onChange={e => setSevenTVE(e.target.checked)} />
              </div>

              <div className="form_row right">
                <label htmlFor="cosmetics">7TV Cosmetics</label>
                <input type="checkbox" name="sevenTVCosmetics" checked={sevenTVC}
                  onChange={e => setSevenTVC(e.target.checked)} />
              </div>

              <div className="form_row right">
                <label htmlFor="fade_bool">Fade</label>
                <input type="text" name="fade" value={fade} placeholder="30"
                  className="short" style={{ display: fadeBool ? 'inline-block' : 'none' }}
                  onChange={e => setFade(e.target.value)} />
                <span style={{ fontSize:'0.8rem', color:'#6060a0', display: fadeBool ? 'inline' : 'none' }}>sec</span>
                <input type="checkbox" name="fade_bool" checked={fadeBool}
                  onChange={e => setFadeBool(e.target.checked)} />
              </div>

              <div className="form_row right">
                <label htmlFor="small_caps">Small Caps</label>
                <input type="checkbox" name="small_caps" checked={smallCaps}
                  onChange={e => setSmallCaps(e.target.checked)} />
              </div>

              <div className="form_row right">
                <label htmlFor="nl_after_name"><abbr title="New Line">NL</abbr> after name</label>
                <input type="checkbox" name="nl_after_name" checked={nlAfterName}
                  onChange={e => setNlAfterName(e.target.checked)} />
              </div>

              <div className="form_row right">
                <label htmlFor="hide_names">Hide usernames</label>
                <input type="checkbox" name="hide_names" checked={hideNames}
                  onChange={e => setHideNames(e.target.checked)} />
              </div>

              <div className="form_row right">
                <label htmlFor="show_pin">Pinned messages</label>
                <input type="checkbox" name="show_pin" checked={showPin}
                  onChange={e => setShowPin(e.target.checked)} />
              </div>

              <div className="form_row right">
                <label htmlFor="text_bg">Text background</label>
                <input type="checkbox" name="text_bg" checked={textBg}
                  onChange={e => setTextBg(e.target.checked)} />
              </div>

              {textBg && (
                <div className="form_row right" style={{ gap: 6 }}>
                  <label style={{ fontSize:'0.78rem' }}>BG width</label>
                  {(['min','max'] as const).map(v => (
                    <label key={v} style={{ display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>
                      <input type="radio" name="textBgWidth" value={v}
                        checked={textBgWidth === v} onChange={() => setTextBgWidth(v)}
                        style={{ accentColor:'#9d60ff' }} />
                      <span style={{ fontSize:'0.78rem', color: textBgWidth===v ? '#c084fc' : '#6060a0' }}>
                        {v === 'min' ? 'Fit' : 'Full'}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit + live preview side-by-side — matches chatis #submit_container */}
          <div id="submit_container">

            {/* Live preview — matches chatis #example div */}
            <div id="example">
              <div className="example-inner" style={{
                fontFamily: fontCSS,
                fontSize: psz.fs,
                lineHeight: psz.lh,
                fontVariant: smallCaps ? 'small-caps' : undefined,
                ...(pFilter ? { filter: pFilter } : {}),
                ...(pStroke ? { WebkitTextStroke: pStroke } : {}),
              }}>
                <style>{`
                  .preview-badge {
                    width: ${psz.bw} !important;
                    height: ${psz.bh} !important;
                    min-width: ${psz.bw}; min-height: ${psz.bh};
                    max-width: ${psz.bw}; max-height: ${psz.bh};
                    vertical-align: middle;
                    border-radius: 10%;
                    display: inline-block;
                    margin-right: ${psz.bmr};
                    margin-bottom: ${psz.bmb};
                  }
                  .preview-badge:last-of-type { margin-right: ${psz.blmr}; }
                  .preview-colon { margin-right: ${psz.cmr}; }
                `}</style>

                {PREV_MSGS.map((m, i) => (
                  <div key={i} style={{
                    lineHeight: psz.lh,
                    ...(textBg ? {
                      background:'rgba(0,0,0,0.5)', borderRadius:2, padding:'0 4px',
                      display: textBgWidth==='max' ? 'block' : 'table', marginBottom:1,
                    } : {}),
                  }}>
                    {!hideNames && (
                      <span style={{ display:'inline-block' }}>
                        {/* Badge placeholder — sized to match size tier */}
                        {m.dot && Array.from({ length: m.dots }).map((_, bi) => (
                          <span key={bi} className="preview-badge"
                            style={{ background: m.dot!, opacity: 0.9 }} />
                        ))}
                        <span className="nick" style={{ color: m.color, fontWeight:800 }}>{m.user}</span>
                        {!nlAfterName
                          ? <span className="preview-colon">:</span>
                          : <br />}
                      </span>
                    )}{' '}
                    <span className="message">{m.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <input type="submit" value="Generate" />
          </div>
        </form>

        {/* ── URL result — shown always (matches chatis #result) ── */}
        <div id="result">
          <div className="url-box">
            <div className="url-code">{overlayUrl}</div>
            <button onClick={copy} className={`url-copy${copied ? ' ok' : ''}`} type="button">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p>Configure a new browser source on your streaming software with the given URL.</p>
        </div>

        {/* ── Setup instructions ── */}
        <div className="setup-section">
          <h2>OBS Setup</h2>
          <ol className="steps">
            <li>Fill in your channel name and configure options, then click <strong>Generate</strong> / Copy</li>
            <li>In OBS: <strong>Add Source → Browser Source</strong></li>
            <li>Paste the URL — recommended: <strong>400 × 600</strong> or wider</li>
            <li>Enable <strong>"Shutdown source when not visible"</strong></li>
            <li>Enable <strong>"Refresh browser when scene becomes active"</strong></li>
          </ol>
        </div>

      </div>

      {/* ── Footer — matches chatis footer ── */}
      <footer>
        <p>Kick Chat Overlay with ❤ — <a href="https://github.com/gxufy/kick-chat-overlay3" target="_blank" rel="noreferrer">GitHub</a></p>
        <p>Inspired by <a href="https://chatis.is2511.com/" target="_blank" rel="noreferrer">ChatIS</a> by IS2511 &amp; giambaJ</p>
        <p>This application is not affiliated with <a href="https://kick.com">Kick</a></p>
      </footer>
    </>
  );
}

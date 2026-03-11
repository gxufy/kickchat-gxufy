import { Fragment, useEffect, useRef, useState } from 'react';
import type { OverlayConfig } from '../pages/index';
import type { ParsedMessage } from '../lib/kick';

interface Props {
  config: OverlayConfig;
  messages: ParsedMessage[];
  pinnedMessage: ParsedMessage | null;
  debugLines: string[];
  showDebug: boolean;
}

/* ─── Exact font families from chatis CSS files ─────────── */
const FONT_FAMILIES: Record<string, string> = {
  default:     'inherit',
  baloo:       "'Baloo Tammudu 2', cursive",
  segoe:       "'Segoe UI', sans-serif",
  roboto:      "'Roboto', sans-serif",
  lato:        "'Lato', sans-serif",
  noto:        "'Noto Sans JP', sans-serif",
  sourcecode:  "'Source Code Pro', monospace",
  impact:      "'Impact', sans-serif",
  comfortaa:   "'Comfortaa', cursive",
  dancing:     "'Dancing Script', cursive",
  indieflower: "'Indie Flower', cursive",
  opensans:    "'Open Sans', sans-serif",
  alsina:      "'Alsina', cursive",
};

/* ─── Exact values from chatis size_*.css files ─────────── */
const SIZE_STYLES: Record<string, {
  fontSize: string;
  lineHeight: string;
  badgeSize: string;
  badgeMarginRight: string;
  badgeMarginBottom: string;
  badgeLastMarginRight: string;
  colonMarginRight: string;
  emoteMaxWidth: string;
  emoteMaxHeight: string;
  emoteMarginRight: string;
  emojiHeight: string;
}> = {
  small: {
    fontSize:            '20px',
    lineHeight:          '30px',
    badgeSize:           '16px',
    badgeMarginRight:    '2px',
    badgeMarginBottom:   '3px',
    badgeLastMarginRight:'3px',
    colonMarginRight:    '8px',
    emoteMaxWidth:       '75px',
    emoteMaxHeight:      '25px',
    emoteMarginRight:    '-3px',
    emojiHeight:         '22px',
  },
  medium: {
    fontSize:            '34px',
    lineHeight:          '55px',
    badgeSize:           '28px',
    badgeMarginRight:    '4px',
    badgeMarginBottom:   '6px',
    badgeLastMarginRight:'6px',
    colonMarginRight:    '14px',
    emoteMaxWidth:       '128px',
    emoteMaxHeight:      '42px',
    emoteMarginRight:    '-6px',
    emojiHeight:         '39px',
  },
  large: {
    fontSize:            '48px',
    lineHeight:          '75px',
    badgeSize:           '40px',
    badgeMarginRight:    '5px',
    badgeMarginBottom:   '8px',
    badgeLastMarginRight:'8px',
    colonMarginRight:    '20px',
    emoteMaxWidth:       '180px',
    emoteMaxHeight:      '60px',
    emoteMarginRight:    '-8px',
    emojiHeight:         '55px',
  },
};

/* ─── Exact shadow from chatis shadow_*.css (drop-shadow) ── */
function getShadowFilter(shadow: string): string {
  if (shadow === 'small')  return 'drop-shadow(2px 2px 0.2rem black)';
  if (shadow === 'medium') return 'drop-shadow(2px 2px 0.35rem black)';
  if (shadow === 'large')  return 'drop-shadow(2px 2px 0.5rem black)';
  return '';
}

/* ─── Exact stroke from chatis stroke_*.css ─────────────── */
function getStrokeCss(stroke: string): string {
  const map: Record<string, string> = {
    thin: '1px black', medium: '2px black', thick: '3px black', thicker: '4px black',
  };
  return map[stroke] ?? '';
}

/* ─── Batch slide animation (chatis 200ms queue flush) ─────
   All messages that arrive within a 200ms window are grouped
   into one batch and animated together as a single block.
   This prevents a backlog of individual animations during
   fast chat, matching chatis's setInterval(fn, 200) behaviour.
──────────────────────────────────────────────────────────── */
function SlideGroup({ children }: { children: React.ReactNode }) {
  const [height, setHeight] = useState<number | 'auto'>(0);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!innerRef.current) return;
    const h = innerRef.current.getBoundingClientRect().height;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setHeight(h);
        setTimeout(() => setHeight('auto'), 155);
      })
    );
  }, []);

  return (
    <div style={{
      height: height === 'auto' ? 'auto' : height,
      overflow: 'hidden',
      transition: height === 'auto' ? 'none' : 'height 150ms ease-out',
    }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

function FadeGroup({ children }: { children: React.ReactNode }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
  }, []);
  return (
    <div style={{ opacity, transition: 'opacity 220ms ease-in-out' }}>{children}</div>
  );
}

/* ─── Overlay root ──────────────────────────────────────── */
export default function ChatOverlay({ config, messages, pinnedMessage, debugLines, showDebug }: Props) {
  const cfg = config as OverlayConfig & {
    font?: string; stroke?: string; emoteScale?: number;
    smallCaps?: boolean; nlAfterName?: boolean; hideNames?: boolean;
  };

  const size     = SIZE_STYLES[cfg.textSize] ?? SIZE_STYLES.medium;
  const filter   = getShadowFilter(cfg.textShadow);
  const strokeCss = getStrokeCss(cfg.stroke ?? 'none');
  const fontFamily = FONT_FAMILIES[cfg.font ?? 'default'] ?? 'inherit';

  // Emote scale multiplier
  const emoteScale  = cfg.emoteScale ?? 1;
  const emoteMaxH   = `${parseFloat(size.emoteMaxHeight) * emoteScale}px`;
  const emoteMaxW   = `${parseFloat(size.emoteMaxWidth) * emoteScale}px`;

  /* ── Batch queue (matches chatis setInterval 200ms) ── */
  const pendingRef  = useRef<ParsedMessage[]>([]);
  const batchSeqRef = useRef(0);
  const [batches, setBatches] = useState<{ id: number; msgs: ParsedMessage[] }[]>([]);
  const prevLenRef = useRef(0);

  // Detect new messages arriving
  useEffect(() => {
    const newMsgs = messages.slice(prevLenRef.current);
    prevLenRef.current = messages.length;
    if (newMsgs.length > 0) pendingRef.current.push(...newMsgs);
  }, [messages]);

  // 200ms flush — exact chatis interval
  useEffect(() => {
    const iv = setInterval(() => {
      if (pendingRef.current.length === 0) return;
      const batch = pendingRef.current.splice(0);
      const id = ++batchSeqRef.current;
      setBatches(prev => {
        const next = [...prev, { id, msgs: batch }];
        // Keep max 100 messages total (chatis: 100 lines max)
        let total = next.reduce((s, b) => s + b.msgs.length, 0);
        while (total > 100 && next.length > 0) {
          total -= next[0].msgs.length;
          next.shift();
        }
        return next;
      });
    }, 200);
    return () => clearInterval(iv);
  }, []);

  // Sync deletions/bans
  useEffect(() => {
    const ids = new Set(messages.map(m => m.id));
    setBatches(prev => {
      const next = prev
        .map(b => ({ ...b, msgs: b.msgs.filter(m => ids.has(m.id)) }))
        .filter(b => b.msgs.length > 0);
      return next.length === prev.length ? prev : next;
    });
  }, [messages]);

  const wrapStyle = (full: boolean): React.CSSProperties => ({
    ...(cfg.textBackgroundEnabled ? {
      background: 'rgba(0,0,0,0.5)',
      borderRadius: 2,
      padding: '0 4px',
      display: full ? 'block' : 'table', // table = fit-content cross-browser
    } : {}),
  });

  const renderMsg = (msg: ParsedMessage) => (
    <div key={msg.id} style={{ margin: '0 10px', ...wrapStyle(cfg.textBackgroundWidth === 'max') }}>
      <MessageLine
        msg={msg}
        size={size}
        emoteMaxH={emoteMaxH}
        emoteMaxW={emoteMaxW}
        strokeCss={strokeCss}
        smallCaps={cfg.smallCaps ?? false}
        nlAfterName={cfg.nlAfterName ?? false}
        hideNames={cfg.hideNames ?? false}
      />
    </div>
  );

  /* ── Container style — mirrors chatis style.css + size CSS ── */
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: 'calc(100% - 20px)',
    padding: '10px',
    overflow: 'hidden',
    color: 'white',
    fontWeight: 800,           // chatis: font-weight: 800 on entire container
    wordBreak: 'break-word',
    fontFamily,
    fontSize: size.fontSize,
    ...(cfg.smallCaps ? { fontVariant: 'small-caps' } : {}),
    ...(filter ? { filter } : {}),
    ...(strokeCss ? { WebkitTextStroke: strokeCss } : {}),
  };

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
      {/* Alsina custom font */}
      {cfg.font === 'alsina' && (
        <style>{`
          @font-face {
            font-family: Alsina;
            src: url(https://chatis.is2511.com/v2/styles/Alsina_Ultrajada.ttf);
          }
        `}</style>
      )}

      {/* Per-message CSS overrides for emote/badge/emoji sizing */}
      <style>{`
        .chat-badge {
          width: ${size.badgeSize} !important;
          height: ${size.badgeSize} !important;
          margin-right: ${size.badgeMarginRight};
          margin-bottom: ${size.badgeMarginBottom};
          vertical-align: middle;
          border-radius: 10%;
          display: inline-block;
        }
        .chat-badge:last-of-type {
          margin-right: ${size.badgeLastMarginRight};
        }
        .chat-emote {
          max-width: ${emoteMaxW};
          max-height: ${emoteMaxH};
          margin-right: ${size.emoteMarginRight};
          vertical-align: middle;
          display: inline-block;
        }
        .chat-emoji {
          height: ${size.emojiHeight};
          vertical-align: middle;
          display: inline-block;
        }
        .chat-colon {
          margin-right: ${size.colonMarginRight};
        }
      `}</style>

      {/* Debug */}
      {showDebug && debugLines.length > 0 && (
        <div style={{
          position: 'absolute', top: 12, left: 12, fontSize: 13,
          background: 'rgba(0,0,0,0.65)', borderRadius: 4, padding: '4px 8px', zIndex: 20,
        }}>
          {debugLines.map((l, i) => <p key={i} style={{ margin: 0, lineHeight: '1.4' }}>{l}</p>)}
        </div>
      )}

      {/* Pinned */}
      {cfg.showPinEnabled && pinnedMessage && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          padding: '6px 10px 8px', borderRadius: '0 0 6px 6px',
          animation: 'chatPinSlide 150ms ease-out',
          fontFamily, fontWeight: 800, fontSize: size.fontSize,
          ...(filter ? { filter } : {}),
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 4, opacity: 0.6, fontSize: '0.7em' }}>
            <PinSVG /> <span style={{ fontWeight: 700 }}>Pinned Message</span>
          </div>
          <MessageLine
            msg={pinnedMessage} size={size} emoteMaxH={emoteMaxH} emoteMaxW={emoteMaxW}
            strokeCss={strokeCss} smallCaps={cfg.smallCaps ?? false}
            nlAfterName={cfg.nlAfterName ?? false} hideNames={cfg.hideNames ?? false}
          />
        </div>
      )}

      {/* Messages container */}
      <div style={containerStyle}>
        {batches.map(({ id, msgs }) => {
          const content = msgs.map(renderMsg);
          if (cfg.animation === 'slide') return <SlideGroup key={id}>{content}</SlideGroup>;
          if (cfg.animation === 'fade')  return <FadeGroup  key={id}>{content}</FadeGroup>;
          return <div key={id}>{content}</div>;
        })}
      </div>

      <style>{`
        @keyframes chatPinSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Single message line ───────────────────────────────── */
function MessageLine({
  msg, size, emoteMaxH, emoteMaxW, strokeCss, smallCaps, nlAfterName, hideNames,
}: {
  msg: ParsedMessage;
  size: typeof SIZE_STYLES[string];
  emoteMaxH: string;
  emoteMaxW: string;
  strokeCss: string;
  smallCaps: boolean;
  nlAfterName: boolean;
  hideNames: boolean;
}) {
  const isPaint = !!msg.identity.background;

  const usernameStyle: React.CSSProperties = isPaint
    ? {
        background: msg.identity.background,
        filter: msg.identity.filter,
        WebkitTextFillColor: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        backgroundSize: 'cover',
        // Name-paints must reset stroke/shadow or they break
        WebkitTextStroke: '0px',
        textShadow: 'none',
      }
    : {
        color: msg.identity.color,
      };

  return (
    // chatis: .user_info is inline-block, everything inline
    // line-height comes from .chat_line in size CSS
    <div style={{ lineHeight: size.lineHeight, display: hideNames ? 'block' : undefined }}>
      {/* user_info: badges + username + colon — inline-block like chatis */}
      {!hideNames && (
        <span style={{ display: 'inline-block' }}>
          {/* Badges */}
          {msg.identity.badges.length > 0 && (
            <>
              {msg.identity.badges.map((badge, i) => (
                // Wrap each badge node — force .chat-badge class onto the img inside
                <span key={i} className="chat-badge-wrap">
                  {badge}
                </span>
              ))}
            </>
          )}
          {/* Username */}
          <span style={{ ...usernameStyle, fontVariant: smallCaps ? 'small-caps' : undefined }}>
            {msg.identity.username}
          </span>
          {/* Colon or newline */}
          {!nlAfterName
            ? <span className="chat-colon">:</span>
            : <br />
          }
        </span>
      )}

      {/* Message body */}
      <span className="chat-msg-body">
        {msg.message.map((node, i) => <Fragment key={i}>{node}</Fragment>)}
      </span>

      {/* Force correct classes onto badge/emote imgs rendered by kick.ts */}
      <style>{`
        .chat-badge-wrap img {
          width: ${size.badgeSize} !important;
          height: ${size.badgeSize} !important;
          margin-right: ${size.badgeMarginRight};
          margin-bottom: ${size.badgeMarginBottom};
          vertical-align: middle;
          border-radius: 10%;
          display: inline-block;
        }
        .chat-msg-body img {
          max-width: ${emoteMaxW};
          max-height: ${emoteMaxH};
          vertical-align: middle;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

function PinSVG() {
  return (
    <svg height={12} width={12} fill="currentColor" viewBox="0 0 490.125 490.125">
      <path d="M300.625,5.025c-6.7-6.7-17.6-6.7-24.3,0l-72.6,72.6c-6.7,6.7-6.7,17.6,0,24.3l16.3,16.3l-40.3,40.3l-63.5-7 c-3-0.3-6-0.5-8.9-0.5c-21.7,0-42.2,8.5-57.5,23.8l-20.8,20.8c-6.7,6.7-6.7,17.6,0,24.3l108.5,108.5l-132.4,132.4 c-6.7,6.7-6.7,17.6,0,24.3c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5l132.5-132.5l108.5,108.5c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5 l20.8-20.8c17.6-17.6,26.1-41.8,23.3-66.4l-7-63.5l40.3-40.3l16.2,16.2c6.7,6.7,17.6,6.7,24.3,0l72.6-72.6c3.2-3.2,5-7.6,5-12.1 s-1.8-8.9-5-12.1L300.625,5.025z"/>
    </svg>
  );
}

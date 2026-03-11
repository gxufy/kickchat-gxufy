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

/* ─── Style helpers ─────────────────────────────────────── */

function getSizeStyle(size: string): React.CSSProperties {
  if (size === 'small')  return { fontSize: '0.85rem',  lineHeight: '1.5' };
  if (size === 'large')  return { fontSize: '1.3rem',   lineHeight: '1.5' };
  return                         { fontSize: '1.05rem', lineHeight: '1.5' };
}

function getEmoteMaxHeight(size: string): number {
  if (size === 'small')  return 25;
  if (size === 'large')  return 52;
  return 36;
}

function getShadow(shadow: string): string {
  if (shadow === 'small')  return '1px 1px 2px #000, -1px -1px 2px #000';
  if (shadow === 'medium') return '1px 1px 3px #000, -1px -1px 3px #000, 0 0 5px #000';
  if (shadow === 'large')  return '1px 1px 4px #000, -1px -1px 4px #000, 0 0 10px #000, 0 0 14px #000';
  return '';
}

function getStroke(stroke: string): React.CSSProperties {
  const m: Record<string, string> = { thin: '1px', medium: '2px', thick: '3px', thicker: '4px' };
  if (m[stroke]) return { WebkitTextStroke: `${m[stroke]} black`, paintOrder: 'stroke fill' as any };
  return {};
}

/* ─── ChatIS-style slide animation ──────────────────────────
   ChatIS measures the real content height in a hidden div,
   then animates a wrapper from 0 to that height in 150ms
   before replacing with auto. This is smoother than pure CSS
   transitions because there's no FOUC on wrapping long lines.
──────────────────────────────────────────────────────────── */
function SlideMessage({ children, cls }: { children: React.ReactNode; cls: string }) {
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
    <div
      style={{
        height: height === 'auto' ? 'auto' : height,
        overflow: 'hidden',
        transition: height === 'auto' ? 'none' : 'height 150ms ease-out',
      }}
    >
      <div ref={innerRef} className={cls}>
        {children}
      </div>
    </div>
  );
}

function FadeMessage({ children, cls }: { children: React.ReactNode; cls: string }) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
  }, []);
  return (
    <div style={{ opacity, transition: 'opacity 220ms ease-in-out' }} className={cls}>
      {children}
    </div>
  );
}

/* ─── Overlay root ──────────────────────────────────────── */

export default function ChatOverlay({
  config,
  messages,
  pinnedMessage,
  debugLines,
  showDebug,
}: Props) {
  const sizeStyle   = getSizeStyle(config.textSize);
  const emoteH      = getEmoteMaxHeight(config.textSize);
  const shadowVal   = getShadow(config.textShadow);
  const strokeStyle = getStroke((config as any).stroke ?? 'none');

  const globalStyle: React.CSSProperties = {
    ...sizeStyle,
    ...strokeStyle,
    color: '#fff',
    ...(shadowVal ? { textShadow: shadowVal } : {}),
  };

  const wrapCls = (msg: ParsedMessage) => {
    const bg = config.textBackgroundEnabled ? 'bg-black/50 rounded-sm px-1' : '';
    const w  = config.textBackgroundEnabled && config.textBackgroundWidth === 'max' ? 'w-full' : 'w-fit';
    return `mx-1 my-0.5 ${bg} ${w}`.trim();
  };

  const line = (msg: ParsedMessage) => (
    <MessageLine msg={msg} emoteH={emoteH} shadow={shadowVal} />
  );

  return (
    <div className="fixed inset-0 overflow-hidden" style={globalStyle}>
      <style>{`
        /* Emotes */
        .emote { max-height: ${emoteH}px !important; vertical-align: middle; display: inline-block; }
        /* Badges — always 1em tall, vertically centred */
        .chat-badge { height: 1em; width: auto; vertical-align: middle; display: inline-block; }
      `}</style>

      {/* Debug */}
      {showDebug && debugLines.length > 0 && (
        <div className="absolute top-3 left-3 text-sm">
          {debugLines.map((l, i) => <p key={i} className="leading-5">{l}</p>)}
        </div>
      )}

      {/* Pinned */}
      {config.showPinEnabled && pinnedMessage && (
        <div className="absolute top-0 z-10 w-full bg-black/70 backdrop-blur-sm rounded-b p-2"
             style={{ animation: 'chatSlideDown 150ms ease-out' }}>
          <div className="flex items-center gap-1 pb-0.5 text-xs font-semibold opacity-60">
            <PinSVG /> <span>Pinned Message</span>
          </div>
          {line(pinnedMessage)}
        </div>
      )}

      {/* Messages */}
      <div className="absolute bottom-0 left-0 w-full pb-1">
        {messages.map((msg) => {
          const cls = wrapCls(msg);
          if (config.animation === 'slide') return <SlideMessage key={msg.id} cls={cls}>{line(msg)}</SlideMessage>;
          if (config.animation === 'fade')  return <FadeMessage  key={msg.id} cls={cls}>{line(msg)}</FadeMessage>;
          return <div key={msg.id} className={cls}>{line(msg)}</div>;
        })}
      </div>

      <style>{`
        @keyframes chatSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Message line ──────────────────────────────────────── */

function MessageLine({
  msg,
  emoteH,
  shadow,
}: {
  msg: ParsedMessage;
  emoteH: number;
  shadow: string;
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
        // Stroke + shadow break name-paints — reset them
        WebkitTextStroke: '0px',
        textShadow: 'none',
      }
    : { color: msg.identity.color };

  return (
    /*
      Inline layout (not flex) — exactly how ChatIS works.
      Badges/emotes use vertical-align: middle so they sit
      centred on the text line without pushing the baseline.
    */
    <p style={{ margin: 0, wordBreak: 'break-word' }}>
      {/* Badges */}
      {msg.identity.badges.length > 0 && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginRight: '4px', verticalAlign: 'middle' }}>
          {msg.identity.badges.map((badge, i) => (
            <Fragment key={i}>{badge}</Fragment>
          ))}
        </span>
      )}

      {/* Username */}
      <span className="font-bold" style={usernameStyle}>
        {msg.identity.username}
      </span>

      {/* Colon */}
      <span>:&nbsp;</span>

      {/* Message */}
      <span>
        {msg.message.map((node, i) => <Fragment key={i}>{node}</Fragment>)}
      </span>
    </p>
  );
}

function PinSVG() {
  return (
    <svg height={12} width={12} fill="currentColor" viewBox="0 0 490.125 490.125">
      <path d="M300.625,5.025c-6.7-6.7-17.6-6.7-24.3,0l-72.6,72.6c-6.7,6.7-6.7,17.6,0,24.3l16.3,16.3l-40.3,40.3l-63.5-7 c-3-0.3-6-0.5-8.9-0.5c-21.7,0-42.2,8.5-57.5,23.8l-20.8,20.8c-6.7,6.7-6.7,17.6,0,24.3l108.5,108.5l-132.4,132.4 c-6.7,6.7-6.7,17.6,0,24.3c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5l132.5-132.5l108.5,108.5c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5 l20.8-20.8c17.6-17.6,26.1-41.8,23.3-66.4l-7-63.5l40.3-40.3l16.2,16.2c6.7,6.7,17.6,6.7,24.3,0l72.6-72.6c3.2-3.2,5-7.6,5-12.1 s-1.8-8.9-5-12.1L300.625,5.025z"/>
    </svg>
  );
}

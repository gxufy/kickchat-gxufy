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

/* ─── Font map (matches LandingPage options) ───────────── */
const FONT_FAMILIES: Record<string, string> = {
  default:      'inherit',
  segoe:        '"Segoe UI", sans-serif',
  roboto:       '"Roboto", sans-serif',
  lato:         '"Lato", sans-serif',
  noto:         '"Noto Sans", sans-serif',
  sourcecode:   '"Source Code Pro", monospace',
  impact:       'Impact, fantasy',
  comfortaa:    '"Comfortaa", cursive',
  dancing:      '"Dancing Script", cursive',
  indieflower:  '"Indie Flower", cursive',
  opensans:     '"Open Sans", sans-serif',
  baloo:        '"Baloo 2", cursive',
};

/* ─── Style helpers ─────────────────────────────────────── */
function getFontSize(size: string) {
  if (size === 'small')  return '0.875rem';
  if (size === 'large')  return '1.3rem';
  return '1.05rem';
}

// Badge height = slightly larger than cap-height of the font.
// ChatIS uses ~18–20px badges regardless of font size.
// We derive it from the font size so it scales proportionally.
function getBadgeSize(size: string) {
  if (size === 'small')  return '1.1em';
  if (size === 'large')  return '1.1em';
  return '1.1em';  // always 1.1× the current font size — same ratio chatis uses
}

function getShadow(shadow: string) {
  if (shadow === 'small')  return '1px 1px 2px #000, -1px -1px 2px #000';
  if (shadow === 'medium') return '1px 1px 3px #000, -1px -1px 3px #000, 0 0 5px #000';
  if (shadow === 'large')  return '1px 1px 5px #000, -1px -1px 5px #000, 0 0 10px #000, 0 0 15px rgba(0,0,0,0.6)';
  return 'none';
}

function getStroke(stroke: string): React.CSSProperties {
  const map: Record<string, string> = { thin: '1px', medium: '2px', thick: '3px', thicker: '4px' };
  return map[stroke] ? { WebkitTextStroke: `${map[stroke]} black`, paintOrder: 'stroke fill' as any } : {};
}

/* ─── ChatIS-style slide: measure → animate 0→h → auto ── */
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
    <div style={{
      height: height === 'auto' ? 'auto' : height,
      overflow: 'hidden',
      transition: height === 'auto' ? 'none' : 'height 150ms ease-out',
    }}>
      <div ref={innerRef} className={cls}>{children}</div>
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
export default function ChatOverlay({ config, messages, pinnedMessage, debugLines, showDebug }: Props) {
  const fontSize   = getFontSize(config.textSize);
  const badgeSize  = getBadgeSize(config.textSize);
  const shadowVal  = getShadow(config.textShadow);
  const strokeStyle = getStroke((config as any).stroke ?? 'none');
  const fontFamily = FONT_FAMILIES[(config as any).font ?? 'default'] ?? 'inherit';

  const containerStyle: React.CSSProperties = {
    fontSize,
    fontFamily,
    lineHeight: 1.5,
    color: '#fff',
    ...strokeStyle,
    ...(shadowVal !== 'none' ? { textShadow: shadowVal } : {}),
  };

  const wrapCls = (msg: ParsedMessage) => {
    const bg = config.textBackgroundEnabled ? 'bg-black/50 rounded-sm px-1' : '';
    const w  = config.textBackgroundEnabled && config.textBackgroundWidth === 'max' ? 'w-full' : 'w-fit';
    return `mx-1 my-px ${bg} ${w}`.trim();
  };

  const line = (msg: ParsedMessage) => (
    <MessageLine msg={msg} badgeSize={badgeSize} shadowVal={shadowVal} strokeStyle={strokeStyle} />
  );

  return (
    <div className="fixed inset-0 overflow-hidden" style={containerStyle}>
      {/* Debug */}
      {showDebug && debugLines.length > 0 && (
        <div className="absolute top-3 left-3 text-sm bg-black/60 rounded p-1">
          {debugLines.map((l, i) => <p key={i} className="leading-5 m-0">{l}</p>)}
        </div>
      )}

      {/* Pinned */}
      {config.showPinEnabled && pinnedMessage && (
        <div className="absolute top-0 z-10 w-full bg-black/70 backdrop-blur-sm rounded-b px-2 pt-1 pb-2"
             style={{ animation: 'chatPinSlide 150ms ease-out' }}>
          <div className="flex items-center gap-1 pb-0.5 opacity-60" style={{ fontSize: '0.75em' }}>
            <PinSVG /> <span className="font-semibold">Pinned Message</span>
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
  msg,
  badgeSize,
  shadowVal,
  strokeStyle,
}: {
  msg: ParsedMessage;
  badgeSize: string;
  shadowVal: string;
  strokeStyle: React.CSSProperties;
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
        // Name-paints break with stroke/shadow — reset them
        WebkitTextStroke: '0px',
        textShadow: 'none',
      }
    : { color: msg.identity.color };

  return (
    /*
      Pure inline layout — exactly what chatis does.
      - Badges: inline-flex, height=1.1em, verticalAlign=middle
        This makes badges the same visual size as the cap-height of the
        current font, matching how chatis renders them.
      - No flex-wrap on the outer span — text wraps naturally around badges.
    */
    <p style={{ margin: 0, padding: 0, wordBreak: 'break-word', lineHeight: 'inherit' }}>
      {/* Badges */}
      {msg.identity.badges.length > 0 && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          marginRight: '4px',
          verticalAlign: 'middle',
          // Force badge images inside to the right height
        }}>
          <style>{`
            .chat-badge-wrap img {
              height: ${badgeSize} !important;
              width: auto !important;
              vertical-align: middle;
              display: inline-block;
            }
          `}</style>
          <span className="chat-badge-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            {msg.identity.badges.map((badge, i) => (
              <Fragment key={i}>{badge}</Fragment>
            ))}
          </span>
        </span>
      )}

      {/* Username */}
      <span className="font-bold" style={{ ...usernameStyle, verticalAlign: 'baseline' }}>
        {msg.identity.username}
      </span>

      {/* Colon */}
      <span style={{ verticalAlign: 'baseline' }}>:&nbsp;</span>

      {/* Message body — emotes also need vertical-align: middle */}
      <span style={{ verticalAlign: 'baseline' }}>
        <style>{`
          .chat-msg-body img {
            vertical-align: middle;
            display: inline-block;
          }
        `}</style>
        <span className="chat-msg-body">
          {msg.message.map((node, i) => <Fragment key={i}>{node}</Fragment>)}
        </span>
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

import { Fragment, useEffect, useRef, useState, useCallback } from 'react';
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

/* ─── Style helpers ─────────────────────────────────────── */
function getFontSize(size: string) {
  if (size === 'small')  return '0.875rem';
  if (size === 'large')  return '1.3rem';
  return '1.05rem';
}

function getShadow(shadow: string) {
  if (shadow === 'small')  return '1px 1px 2px #000, -1px -1px 2px #000';
  if (shadow === 'medium') return '1px 1px 3px #000, -1px -1px 3px #000, 0 0 5px #000';
  if (shadow === 'large')  return '1px 1px 5px #000, -1px -1px 5px #000, 0 0 10px #000, 0 0 15px rgba(0,0,0,0.6)';
  return '';
}

function getStroke(stroke: string): React.CSSProperties {
  const map: Record<string, string> = { thin: '1px', medium: '2px', thick: '3px', thicker: '4px' };
  return map[stroke] ? { WebkitTextStroke: `${map[stroke]} black`, paintOrder: 'stroke fill' as any } : {};
}

/* ─── Displayed message with a "batch generation" stamp ─── */
interface DisplayedMessage {
  msg: ParsedMessage;
  batchId: number; // all messages in the same flush share one batchId
}

/* ─── Batch-animated group ──────────────────────────────────
   ChatIS behaviour:
   - Incoming messages are pushed into a pending queue
   - Every 200ms, the entire queue is flushed as ONE group
   - That group gets a single height-expand animation (0 → full height)
   - During fast chat, many messages animate together as one block,
     so the overlay never gets a backlog of individual animations
─────────────────────────────────────────────────────────── */
function BatchGroup({
  children,
  animate,
  wrapCls,
}: {
  children: React.ReactNode;
  animate: boolean;
  wrapCls: string;
}) {
  const [height, setHeight] = useState<number | 'auto'>(animate ? 0 : 'auto');
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) return;
    if (!innerRef.current) return;
    const h = innerRef.current.getBoundingClientRect().height;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setHeight(h);
        setTimeout(() => setHeight('auto'), 155);
      })
    );
  }, [animate]);

  if (!animate) {
    return <div className={wrapCls}>{children}</div>;
  }

  return (
    <div style={{
      height: height === 'auto' ? 'auto' : height,
      overflow: 'hidden',
      transition: height === 'auto' ? 'none' : 'height 150ms ease-out',
    }}>
      <div ref={innerRef} className={wrapCls}>{children}</div>
    </div>
  );
}

function FadeBatch({
  children,
  wrapCls,
}: {
  children: React.ReactNode;
  wrapCls: string;
}) {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setOpacity(1)));
  }, []);
  return (
    <div style={{ opacity, transition: 'opacity 220ms ease-in-out' }} className={wrapCls}>
      {children}
    </div>
  );
}

/* ─── Overlay root ──────────────────────────────────────── */
export default function ChatOverlay({ config, messages, pinnedMessage, debugLines, showDebug }: Props) {
  const cfg = config as OverlayConfig & {
    font?: string; stroke?: string; emoteScale?: number;
    smallCaps?: boolean; nlAfterName?: boolean; hideNames?: boolean;
  };

  const fontSize    = getFontSize(cfg.textSize);
  const shadowVal   = getShadow(cfg.textShadow);
  const strokeStyle = getStroke(cfg.stroke ?? 'none');
  const fontFamily  = FONT_FAMILIES[cfg.font ?? 'default'] ?? 'inherit';

  const containerStyle: React.CSSProperties = {
    fontSize,
    fontFamily,
    lineHeight: 1.5,
    color: '#fff',
    ...strokeStyle,
    ...(shadowVal ? { textShadow: shadowVal } : {}),
  };

  /* ── Batching logic ──────────────────────────────────────
     We maintain a pendingRef queue. Every 200ms (matching chatis)
     we flush everything in the queue into displayedBatches as one
     new batch. Each batch animates once as a unit.
  ──────────────────────────────────────────────────────── */
  const pendingRef  = useRef<ParsedMessage[]>([]);
  const batchSeqRef = useRef(0);

  // displayedBatches: array of { batchId, messages[] }
  const [displayedBatches, setDisplayedBatches] = useState<
    { batchId: number; msgs: ParsedMessage[] }[]
  >([]);

  // Track the last seen message list length to detect new arrivals
  const prevLenRef = useRef(0);

  useEffect(() => {
    const newMsgs = messages.slice(prevLenRef.current);
    prevLenRef.current = messages.length;
    if (newMsgs.length > 0) {
      pendingRef.current.push(...newMsgs);
    }
  }, [messages]);

  // 200ms flush interval — exactly like chatis setInterval(fn, 200)
  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingRef.current.length === 0) return;
      const batch = pendingRef.current.splice(0);
      const batchId = ++batchSeqRef.current;
      setDisplayedBatches(prev => {
        const next = [...prev, { batchId, msgs: batch }];
        // Keep at most 100 total messages across all batches
        let total = next.reduce((s, b) => s + b.msgs.length, 0);
        while (total > 100 && next.length > 0) {
          total -= next[0].msgs.length;
          next.shift();
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // When messages are externally cleared (delete/ban), sync displayed batches
  useEffect(() => {
    const ids = new Set(messages.map(m => m.id));
    setDisplayedBatches(prev => {
      const next = prev
        .map(b => ({ ...b, msgs: b.msgs.filter(m => ids.has(m.id)) }))
        .filter(b => b.msgs.length > 0);
      return next.length === prev.length ? prev : next;
    });
  }, [messages]);

  const msgWrapCls = (full: boolean) => {
    const bg = cfg.textBackgroundEnabled ? 'bg-black/50 rounded-sm px-1' : '';
    const w  = cfg.textBackgroundEnabled && cfg.textBackgroundWidth === 'max' ? 'w-full' : 'w-fit';
    return `${bg} ${w}`.trim();
  };

  const renderLine = (msg: ParsedMessage) => (
    <div key={msg.id} className={`mx-1 my-px ${msgWrapCls(cfg.textBackgroundWidth === 'max')}`}>
      <MessageLine
        msg={msg}
        shadowVal={shadowVal}
        strokeStyle={strokeStyle}
        smallCaps={cfg.smallCaps ?? false}
        nlAfterName={cfg.nlAfterName ?? false}
        hideNames={cfg.hideNames ?? false}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 overflow-hidden" style={containerStyle}>
      {/* Alsina font loaded inline if selected */}
      {(cfg.font === 'alsina') && (
        <style>{`
          @font-face {
            font-family: Alsina;
            src: url(https://chatis.is2511.com/v2/styles/Alsina_Ultrajada.ttf);
          }
        `}</style>
      )}

      {/* Debug */}
      {showDebug && debugLines.length > 0 && (
        <div className="absolute top-3 left-3 text-sm bg-black/60 rounded p-1 z-20">
          {debugLines.map((l, i) => <p key={i} className="leading-5 m-0">{l}</p>)}
        </div>
      )}

      {/* Pinned */}
      {cfg.showPinEnabled && pinnedMessage && (
        <div className="absolute top-0 z-10 w-full bg-black/70 backdrop-blur-sm rounded-b px-2 pt-1 pb-2"
             style={{ animation: 'chatPinSlide 150ms ease-out' }}>
          <div className="flex items-center gap-1 pb-0.5 opacity-60" style={{ fontSize: '0.75em' }}>
            <PinSVG /> <span className="font-semibold">Pinned Message</span>
          </div>
          <MessageLine
            msg={pinnedMessage} shadowVal={shadowVal} strokeStyle={strokeStyle}
            smallCaps={cfg.smallCaps ?? false} nlAfterName={cfg.nlAfterName ?? false}
            hideNames={cfg.hideNames ?? false}
          />
        </div>
      )}

      {/* Messages — rendered as batches */}
      <div className="absolute bottom-0 left-0 w-full pb-1">
        {displayedBatches.map(({ batchId, msgs }) => {
          const content = msgs.map(renderLine);

          if (cfg.animation === 'slide') {
            return (
              <BatchGroup key={batchId} animate wrapCls="">
                {content}
              </BatchGroup>
            );
          }
          if (cfg.animation === 'fade') {
            return (
              <FadeBatch key={batchId} wrapCls="">
                {content}
              </FadeBatch>
            );
          }
          return <div key={batchId}>{content}</div>;
        })}
      </div>

      <style>{`
        @keyframes chatPinSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Badge images: 1.1em tall, vertically centred — matches chatis */
        .chat-badge-wrap img {
          height: 1.1em !important;
          width: auto !important;
          vertical-align: middle;
          display: inline-block;
        }
        /* Emote images: vertically centred */
        .chat-msg-body img {
          vertical-align: middle;
          display: inline-block;
        }
      `}</style>
    </div>
  );
}

/* ─── Single message line ───────────────────────────────── */
function MessageLine({
  msg, shadowVal, strokeStyle, smallCaps, nlAfterName, hideNames,
}: {
  msg: ParsedMessage;
  shadowVal: string;
  strokeStyle: React.CSSProperties;
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
        WebkitTextStroke: '0px',
        textShadow: 'none',
      }
    : {
        color: msg.identity.color,
        fontVariant: smallCaps ? 'small-caps' : undefined,
      };

  return (
    <p style={{ margin: 0, padding: 0, wordBreak: 'break-word', lineHeight: 'inherit' }}>
      {/* Badges — inline-flex, 1.1em height via global CSS above */}
      {msg.identity.badges.length > 0 && (
        <span className="chat-badge-wrap" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          marginRight: '4px',
          verticalAlign: 'middle',
        }}>
          {msg.identity.badges.map((badge, i) => (
            <Fragment key={i}>{badge}</Fragment>
          ))}
        </span>
      )}

      {/* Username */}
      {!hideNames && (
        <span className="font-bold" style={{ ...usernameStyle, verticalAlign: 'baseline' }}>
          {msg.identity.username}
        </span>
      )}

      {/* Colon or newline */}
      {!hideNames && !nlAfterName && <span style={{ verticalAlign: 'baseline' }}>:&nbsp;</span>}
      {!hideNames && nlAfterName && <br />}

      {/* Message body */}
      <span className="chat-msg-body" style={{ verticalAlign: 'baseline' }}>
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

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

function getShadowClass(shadow: string) {
  if (shadow === 'small') return 'dark:text-shadow-sm';
  if (shadow === 'medium') return 'dark:text-shadow-md';
  if (shadow === 'large') return 'dark:text-shadow-lg';
  return '';
}

function getSizeClass(size: string) {
  if (size === 'small') return 'text-sm';
  if (size === 'large') return 'text-xl';
  return 'text-base';
}

// ChatIS-style: height expands from 0 to full over 150ms
function AnimatedMessage({
  msg,
  config,
  shadow,
  size,
}: {
  msg: ParsedMessage;
  config: OverlayConfig;
  shadow: string;
  size: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (!innerRef.current) return;
    const h = innerRef.current.getBoundingClientRect().height;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHeight(h);
        // After transition completes, set to undefined so it handles wrapping text fine
        setTimeout(() => setHeight(undefined), 160);
      });
    });
  }, []);

  return (
    <div
      style={{
        height: height === undefined ? 'auto' : height,
        overflow: 'hidden',
        transition: height === undefined ? 'none' : 'height 150ms ease-out',
      }}
    >
      <div
        ref={innerRef}
        className={`m-1 ${config.textBackgroundEnabled ? 'bg-black bg-opacity-50 rounded-sm px-1' : ''} ${config.textBackgroundWidth === 'min' ? 'w-fit' : 'w-full'}`}
      >
        <MessageLine msg={msg} shadow={shadow} size={size} />
      </div>
    </div>
  );
}

// Fade animation: opacity 0 → 1 over 200ms
function FadeMessage({
  msg,
  config,
  shadow,
  size,
}: {
  msg: ParsedMessage;
  config: OverlayConfig;
  shadow: string;
  size: string;
}) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOpacity(1));
    });
  }, []);

  return (
    <div
      style={{ opacity, transition: 'opacity 200ms ease-in-out' }}
      className={`m-1 ${config.textBackgroundEnabled ? 'bg-black bg-opacity-50 rounded-sm px-1' : ''} ${config.textBackgroundWidth === 'min' ? 'w-fit' : 'w-full'}`}
    >
      <MessageLine msg={msg} shadow={shadow} size={size} />
    </div>
  );
}

export default function ChatOverlay({ config, messages, pinnedMessage, debugLines, showDebug }: Props) {
  const shadow = getShadowClass(config.textShadow);
  const size = getSizeClass(config.textSize);

  return (
    <div className="fixed inset-0 overflow-hidden dark:text-white">
      {/* Debug overlay */}
      {showDebug && debugLines.length > 0 && (
        <div className={`absolute top-3 left-3 text-sm transition-opacity duration-1000 opacity-100 dark:text-white ${shadow}`}>
          {debugLines.map((line, i) => (
            <p key={i} className="leading-5">{line}</p>
          ))}
        </div>
      )}

      {/* Pinned message */}
      {pinnedMessage && (
        <div className={`absolute top-3 z-10 w-full backdrop-blur-sm rounded-sm bg-black bg-opacity-70 p-2 dark:text-white ${shadow} ${size}`}
          style={{ animation: 'slide 150ms ease-out' }}>
          <div className="flex items-center pb-1 text-sm font-semibold opacity-70">
            <svg height={14} width={14} fill="currentColor" viewBox="0 0 490.125 490.125" xmlns="http://www.w3.org/2000/svg">
              <path d="M300.625,5.025c-6.7-6.7-17.6-6.7-24.3,0l-72.6,72.6c-6.7,6.7-6.7,17.6,0,24.3l16.3,16.3l-40.3,40.3l-63.5-7 c-3-0.3-6-0.5-8.9-0.5c-21.7,0-42.2,8.5-57.5,23.8l-20.8,20.8c-6.7,6.7-6.7,17.6,0,24.3l108.5,108.5l-132.4,132.4 c-6.7,6.7-6.7,17.6,0,24.3c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5l132.5-132.5l108.5,108.5c3.3,3.3,7.7,5,12.1,5s8.8-1.7,12.1-5 l20.8-20.8c17.6-17.6,26.1-41.8,23.3-66.4l-7-63.5l40.3-40.3l16.2,16.2c6.7,6.7,17.6,6.7,24.3,0l72.6-72.6c3.2-3.2,5-7.6,5-12.1 s-1.8-8.9-5-12.1L300.625,5.025z M400.425,250.025l-16.2-16.3c-6.4-6.4-17.8-6.4-24.3,0l-58.2,58.3c-3.7,3.7-5.5,8.8-4.9,14 l7.9,71.6c1.6,14.3-3.3,28.3-13.5,38.4l-8.7,8.7l-217.1-217.1l8.7-8.6c10.1-10.1,24.2-15,38.4-13.5l71.7,7.9 c5.2,0.6,10.3-1.2,14-4.9l58.2-58.2c6.7-6.7,6.7-17.6,0-24.3l-16.3-16.3l48.3-48.3l160.3,160.3L400.425,250.025z" />
            </svg>
            <span className="pl-1">Pinned Message</span>
          </div>
          <MessageLine msg={pinnedMessage} shadow={shadow} size={size} />
        </div>
      )}

      {/* Messages */}
      <div className={`absolute bottom-0 left-0 w-full ${size}`}>
        {messages.map((msg) => {
          if (config.animation === 'slide') {
            return <AnimatedMessage key={msg.id} msg={msg} config={config} shadow={shadow} size={size} />;
          }
          if (config.animation === 'fade') {
            return <FadeMessage key={msg.id} msg={msg} config={config} shadow={shadow} size={size} />;
          }
          return (
            <div
              key={msg.id}
              className={`m-1 ${config.textBackgroundEnabled ? 'bg-black bg-opacity-50 rounded-sm px-1' : ''} ${config.textBackgroundWidth === 'min' ? 'w-fit' : 'w-full'}`}
            >
              <MessageLine msg={msg} shadow={shadow} size={size} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MessageLine({ msg, shadow, size }: { msg: ParsedMessage; shadow: string; size: string }) {
  const usernameStyle: React.CSSProperties = msg.identity.background
    ? {
        background: msg.identity.background,
        filter: msg.identity.filter,
        WebkitTextFillColor: 'transparent',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        backgroundSize: 'cover',
      }
    : { color: msg.identity.color };

  return (
    <span className="leading-7 flex flex-wrap items-center gap-x-0.5">
      {msg.identity.badges.length > 0 && (
        <span className="inline-flex space-x-0.5 items-center flex-shrink-0 mr-1">
          {msg.identity.badges.map((badge, i) => (
            <Fragment key={i}>{badge}</Fragment>
          ))}
        </span>
      )}
      <span className={`font-bold ${!msg.identity.background ? shadow : ''}`} style={usernameStyle}>
        {msg.identity.username}
      </span>
      <span className={shadow}>:&nbsp;</span>
      <span className={`break-words ${shadow}`}>
        {msg.message.map((node, i) => (
          <Fragment key={i}>{node}</Fragment>
        ))}
      </span>
    </span>
  );
}

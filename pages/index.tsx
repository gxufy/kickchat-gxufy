'use client';

import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { z } from 'zod';
import Pusher from 'pusher-js';
import {
  getKickChannel,
  getSevenTVGlobalEmotes,
  getSevenTVChannelEmotes,
  decimalToRGBA,
  type KickChannel,
  type SevenTVEmote,
  type SevenTVBadge,
  type SevenTVPaint,
  type Entitlements,
  type ParsedMessage,
} from '../lib/kick';
import LandingPage from '../components/LandingPage';
import ChatOverlay from '../components/ChatOverlay';

const QuerySchema = z.object({
  channel: z.string().min(1),
  sevenTVCosmeticsEnabled: z.string().optional().transform(v => v !== 'false'),
  sevenTVEmotesEnabled: z.string().optional().transform(v => v !== 'false'),
  theme: z.string().optional().transform(v => v === 'light' ? 'light' : v === 'system' ? 'system' : 'dark'),
  textShadow: z.string().optional().transform(v => v === 'none' ? 'none' : v === 'medium' ? 'medium' : v === 'large' ? 'large' : 'small'),
  textSize: z.string().optional().transform(v => v === 'small' ? 'small' : v === 'large' ? 'large' : 'medium'),
  animation: z.string().optional().transform(v => v === 'slide' ? 'slide' : v === 'fade' ? 'fade' : 'none'),
  showPinEnabled: z.string().optional().transform(v => v === 'true'),
  textBackgroundEnabled: z.string().optional().transform(v => v === 'true'),
  textBackgroundWidth: z.string().optional().transform(v => v === 'max' ? 'max' : 'min'),
  font: z.string().optional().transform(v => v ?? 'default'),
  stroke: z.string().optional().transform(v => ['thin','medium','thick','thicker'].includes(v ?? '') ? v! : 'none'),
  emoteScale: z.string().optional().transform(v => { const n = parseFloat(v ?? ''); return isNaN(n) ? 1 : n; }),
  fade: z.string().optional().transform(v => { const n = parseInt(v ?? ''); return isNaN(n) ? (false as const) : n; }),
  smallCaps: z.string().optional().transform(v => v === 'true'),
  nlAfterName: z.string().optional().transform(v => v === 'true'),
  hideNames: z.string().optional().transform(v => v === 'true'),
});

export type OverlayConfig = z.infer<typeof QuerySchema>;

export default function Page() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState<OverlayConfig | null>(null);
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [pinnedMessage, setPinnedMessage] = useState<ParsedMessage | null>(null);
  const [debugLines, setDebugLines] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mutable state that doesn't trigger rerenders
  const stateRef = useRef<{
    emotes: SevenTVEmote[];
    badges: SevenTVBadge[];
    paints: SevenTVPaint[];
    entitlements: Entitlements;
    messages: ParsedMessage[];
    channel: KickChannel | null;
    config: OverlayConfig | null;
  }>({
    emotes: [],
    badges: [],
    paints: [],
    entitlements: {},
    messages: [],
    channel: null,
    config: null,
  });

  useEffect(() => {
    if (!router.isReady) return;
    setReady(true);

    const parsed = QuerySchema.safeParse(router.query);
    if (!parsed.success || !router.query.channel) return;

    const cfg = parsed.data;
    setConfig(cfg);
    stateRef.current.config = cfg;

    // Apply theme
    const applyTheme = (theme: string) => {
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    applyTheme(cfg.theme);

    const s = stateRef.current;

    function parseMessageText(content: string, emotes: SevenTVEmote[]): React.ReactNode[] {
      content = content.replace(/\s\s+/g, ' ').trim();
      const nodes: React.ReactNode[] = [];
      const kickEmoteRe = /\[(emote|emoji):(\w+):[^\]]*\]/g;
      const words = content.split(' ');

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const emoteIdx = emotes.findIndex(e => e.name === word);
        if (emoteIdx === -1) {
          const kickMatches = [...word.matchAll(kickEmoteRe)];
          if (kickMatches.length) {
            for (const m of kickMatches) {
              nodes.push(
                <img
                  key={`ke-${i}-${m[2]}`}
                  className="inline-flex max-h-7 h-auto w-auto pr-1"
                  src={`https://files.kick.com/emotes/${m[2]}/fullsize`}
                  alt="emote"
                  height={28}
                  width={28}
                />
              );
            }
          } else {
            nodes.push(i !== words.length - 1 ? word + ' ' : word);
          }
        } else {
          const emote = emotes[emoteIdx];
          const zeroWidths: React.ReactNode[] = [];
          while (i + 1 < words.length) {
            const nextIdx = emotes.findIndex(e => e.name === words[i + 1]);
            if (nextIdx === -1 || !emotes[nextIdx].zeroWidth) break;
            zeroWidths.push(
              <img
                key={`zw-${i}`}
                className="max-h-7 h-auto w-auto m-auto row-[1] col-[1]"
                src={emotes[nextIdx].image}
                alt={emotes[nextIdx].name}
                height={emotes[nextIdx].height}
                width={emotes[nextIdx].width}
              />
            );
            i++;
          }
          if (zeroWidths.length === 0) {
            nodes.push(
              <img
                key={`em-${i}`}
                className="inline-flex max-h-7 h-auto w-auto pr-1"
                src={emote.image}
                alt={emote.name}
                height={emote.height}
                width={emote.width}
              />
            );
          } else {
            nodes.push(
              <span key={`zws-${i}`} className="inline-grid align-middle pr-1">
                <img className="max-h-7 h-auto w-auto m-auto row-[1] col-[1]" src={emote.image} alt={emote.name} height={emote.height} width={emote.width} />
                {zeroWidths}
              </span>
            );
          }
        }
      }
      return nodes;
    }

    function buildBadges(senderBadges: any[], subscriberBadges: KickChannel['subscriber_badges']): React.ReactNode[] {
      const badgeNodes: React.ReactNode[] = [];
      for (const badge of senderBadges) {
        switch (badge.type) {
          case 'broadcaster':
            badgeNodes.push(<img key="broadcaster" className="ck-badge-img" src="/badges/broadcaster.svg" alt="broadcaster" height={16} width={16} />);
            break;
          case 'moderator':
            badgeNodes.push(<img key="mod" className="ck-badge-img" src="/badges/moderator.svg" alt="moderator" height={16} width={16} />);
            break;
          case 'vip':
            badgeNodes.push(<img key="vip" className="ck-badge-img" src="/badges/vip.svg" alt="vip" height={16} width={16} />);
            break;
          case 'founder':
            badgeNodes.push(<img key="founder" className="ck-badge-img" src="/badges/founder.svg" alt="founder" height={16} width={16} />);
            break;
          case 'og':
            badgeNodes.push(<img key="og" className="ck-badge-img" src="/badges/og.svg" alt="og" height={16} width={16} />);
            break;
          case 'verified':
            badgeNodes.push(<img key="verified" className="ck-badge-img" src="/badges/verified.svg" alt="verified" height={16} width={16} />);
            break;
          case 'staff':
            badgeNodes.push(<img key="staff" className="ck-badge-img" src="/badges/staff.svg" alt="staff" height={16} width={16} />);
            break;
          case 'subscriber': {
            const sorted = [...subscriberBadges].sort((a, b) => b.months - a.months);
            const match = sorted.find(sb => badge.count >= sb.months);
            if (match) {
              badgeNodes.push(<img key="sub" className="ck-badge-img" src={match.badge_image.src} alt="subscriber" />);
            } else {
              badgeNodes.push(<img key="sub-default" className="ck-badge-img" src="/badges/subscriber.svg" alt="subscriber" height={16} width={16} />);
            }
            break;
          }
          case 'sub_gifter': {
            const count = badge.count ?? 0;
            const gifterBadge = count >= 200 ? 'subGifter200' : count >= 100 ? 'subGifter100' : count >= 50 ? 'subGifter50' : count >= 25 ? 'subGifter25' : 'subGifter';
            badgeNodes.push(<img key="gifter" className="ck-badge-img" src={`/badges/${gifterBadge}.svg`} alt="gifter" height={16} width={16} />);
            break;
          }
        }
      }
      return badgeNodes;
    }

    function buildPaintStyle(paint: SevenTVPaint): { background: string; filter: string } {
      const parts: string[] = [];
      const shadows: string[] = [];
      let prefix = '';

      if (paint.func === 'URL') {
        parts.push(paint.image_url ?? '');
      } else {
        if (paint.func === 'LINEAR_GRADIENT') parts.push(`${paint.angle ?? 0}deg`);
        else if (paint.func === 'RADIAL_GRADIENT') parts.push(paint.shape ?? 'circle');
        prefix = paint.repeat ? 'repeating-' : '';
        for (const stop of paint.stops) {
          parts.push(`${decimalToRGBA(stop.color)} ${stop.at * 100}%`);
        }
      }
      for (const shadow of paint.shadows) {
        shadows.push(`drop-shadow(${decimalToRGBA(shadow.color)} ${shadow.x_offset}px ${shadow.y_offset}px ${shadow.radius}px)`);
      }

      const background = `${prefix}${paint.func.toLowerCase().replace('_', '-')}(${parts.join(', ')})`;
      return { background, filter: shadows.join(' ') };
    }

    function buildMessage(rawMsg: any): ParsedMessage | null {
      try {
        const channel = s.channel!;
        const msgNodes = parseMessageText(rawMsg.content, s.emotes);
        const badgeNodes = buildBadges(rawMsg.sender?.identity?.badges ?? [], channel.subscriber_badges ?? []);

        // 7TV cosmetics
        let background = '';
        let filter = '';
        const entitlement = s.entitlements[rawMsg.sender.id.toString()];
        if (entitlement && s.config?.sevenTVCosmeticsEnabled) {
          if (entitlement.badge) {
            const badge = s.badges.find(b => b.id === entitlement.badge);
            if (badge) badgeNodes.push(<img key="7tv-badge" className="ck-badge-img" src={badge.image} alt="7tv badge" />);
          }
          if (entitlement.paint) {
            const paint = s.paints.find(p => p.id === entitlement.paint);
            if (paint) {
              const style = buildPaintStyle(paint);
              background = style.background;
              filter = style.filter;
            }
          }
        }

        return {
          id: rawMsg.id,
          timestamp: Date.now(),
          identity: {
            username: rawMsg.sender.username,
            color: rawMsg.sender.identity.color || '#ffffff',
            background,
            filter,
            badges: badgeNodes,
          },
          message: msgNodes,
        };
      } catch {
        return null;
      }
    }

    function addMessage(msg: ParsedMessage) {
      s.messages.push(msg);
      if (s.messages.length > 50) s.messages.shift();
      setMessages([...s.messages]);
    }

    async function init() {
      const debug: string[] = ['🟢 Connecting to Kick...'];
      setDebugLines([...debug]);

      const channel = await getKickChannel(cfg.channel);
      if (!channel) {
        setError(`Could not find Kick channel: "${cfg.channel}". Make sure the channel name is correct.`);
        return;
      }
      s.channel = channel;
      debug.push(`✅ Channel found: ${channel.user.username} (chatroom #${channel.chatroom.id})`);
      setDebugLines([...debug]);

      if (cfg.sevenTVEmotesEnabled) {
        const globalEmotes = await getSevenTVGlobalEmotes();
        s.emotes.push(...globalEmotes);
        debug.push(`✅ Loaded ${globalEmotes.length} 7TV global emotes`);
        setDebugLines([...debug]);

        const { emotes: channelEmotes, setId } = await getSevenTVChannelEmotes(channel.user_id.toString());
        s.emotes.push(...channelEmotes);
        debug.push(`✅ Loaded ${channelEmotes.length} 7TV channel emotes`);
        setDebugLines([...debug]);

        // 7TV SSE for cosmetics + live emotes
        if (cfg.sevenTVCosmeticsEnabled) {
          const sseUrl = `https://events.7tv.io/v3@entitlement.*<ctx=channel;platform=KICK;id=${channel.user.id}>,cosmetic.*<ctx=channel;platform=KICK;id=${channel.user.id}>${setId ? `,emote_set.*<object_id=${setId}>` : ''}`;
          const sse = new EventSource(sseUrl);
          sse.addEventListener('dispatch', (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            handle7TVDispatch(data);
          });
        }
      }

      debug.push('🟢 Connecting to Kick chat...');
      setDebugLines([...debug]);

      // Kick Pusher connection
      const pusher = new Pusher('32cbd69e4b950bf97679', { cluster: 'us2' });
      const chatroom = pusher.subscribe(`chatrooms.${channel.chatroom.id}.v2`);

      chatroom.bind('App\\Events\\ChatMessageEvent', (data: any) => {
        const msg = buildMessage(data);
        if (msg) addMessage(msg);
      });

      chatroom.bind('App\\Events\\MessageDeletedEvent', (data: any) => {
        s.messages = s.messages.filter(m => m.id !== data.message.id);
        setMessages([...s.messages]);
      });

      chatroom.bind('App\\Events\\UserBannedEvent', (data: any) => {
        s.messages = s.messages.filter(m => m.identity.username !== data.user.username);
        setMessages([...s.messages]);
      });

      chatroom.bind('App\\Events\\PinnedMessageCreatedEvent', (data: any) => {
        if (cfg.showPinEnabled) {
          const msg = buildMessage(data.message);
          if (msg) setPinnedMessage(msg);
        }
      });

      chatroom.bind('App\\Events\\PinnedMessageDeletedEvent', () => {
        setPinnedMessage(null);
      });

      pusher.connection.bind('connected', () => {
        debug.push('✅ Connected to Kick chat!');
        setDebugLines([...debug]);
        setTimeout(() => setShowDebug(false), 4000);
      });

      pusher.connection.bind('error', () => {
        debug.push('❌ Pusher connection error');
        setDebugLines([...debug]);
      });
    }

    function handle7TVDispatch(data: any) {
      if (data.type === 'cosmetic.create') {
        if (data.body.object.kind === 'BADGE') {
          s.badges.push({ id: data.body.id, image: `https://cdn.7tv.app/badge/${data.body.id}/3x` });
        }
        if (data.body.object.kind === 'PAINT') {
          const d = data.body.object.data;
          s.paints.push({ id: data.body.id, func: d.function, angle: d.angle, color: d.color, repeat: d.repeat, shadows: d.shadows, stops: d.stops, image_url: d.image_url, shape: d.shape });
        }
      }
      if (data.type === 'entitlement.create') {
        for (const conn of (data.body.object.user.connections ?? [])) {
          if (conn.platform === 'KICK') {
            s.entitlements[conn.id] = {
              ...s.entitlements[conn.id],
              [data.body.object.kind === 'BADGE' ? 'badge' : 'paint']: data.body.object.ref_id,
            };
          }
        }
      }
      if (data.type === 'entitlement.delete') {
        for (const conn of (data.body.object.user.connections ?? [])) {
          if (conn.platform === 'KICK') {
            const key = data.body.object.kind === 'BADGE' ? 'badge' : 'paint';
            if (s.entitlements[conn.id]?.[key] === data.body.object.ref_id) {
              s.entitlements[conn.id] = { ...s.entitlements[conn.id], [key]: undefined };
            }
          }
        }
      }
    }

    init();

    let fadeInterval: ReturnType<typeof setInterval> | null = null;
    if (cfg.fade !== false) {
      const fadeMs = (cfg.fade as number) * 1000;
      fadeInterval = setInterval(() => {
        const cutoff = Date.now() - fadeMs;
        s.messages = s.messages.filter(m => (m.timestamp ?? 0) > cutoff);
        setMessages([...s.messages]);
      }, 1000);
    }

    return () => { if (fadeInterval) clearInterval(fadeInterval); };
  }, [router.isReady]);

  if (!ready) return null;

  // Show landing page if no channel specified
  if (!router.query.channel) {
    return <LandingPage />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white p-8">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2">Connection Error</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!config) return null;

  return (
    <>
      <Head>
        <title>Kick Chat Overlay</title>
      </Head>
      <ChatOverlay
        config={config}
        messages={messages}
        pinnedMessage={pinnedMessage}
        debugLines={debugLines}
        showDebug={showDebug}
      />
    </>
  );
}

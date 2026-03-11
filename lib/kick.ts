export interface KickChannel {
  id: number;
  user_id: number;
  slug: string;
  chatroom: { id: number };
  subscriber_badges: Array<{
    id: number;
    months: number;
    badge_image: { src: string };
  }>;
  user: { id: number; username: string };
}

export interface SevenTVEmote {
  name: string;
  image: string;
  height: number;
  width: number;
  zeroWidth: boolean;
}

export interface SevenTVPaint {
  id: string;
  func: string;
  angle?: number;
  color?: number;
  repeat: boolean;
  shadows: Array<{ color: number; x_offset: number; y_offset: number; radius: number }>;
  stops: Array<{ color: number; at: number }>;
  image_url?: string;
  shape?: string;
}

export interface SevenTVBadge {
  id: string;
  image: string;
}

export interface Entitlements {
  [userId: string]: { badge?: string; paint?: string };
}

export interface ParsedMessage {
  id: string;
  identity: {
    username: string;
    color: string;
    background: string;
    filter: string;
    badges: React.ReactNode[];
  };
  message: React.ReactNode[];
}

export async function getKickChannel(channel: string): Promise<KickChannel | null> {
  try {
    const res = await fetch(`https://kick.com/api/v2/channels/${channel}`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getSevenTVGlobalEmotes(): Promise<SevenTVEmote[]> {
  try {
    const res = await fetch('https://7tv.io/v3/emote-sets/global');
    if (!res.ok) return [];
    const data = await res.json();
    return (data.emotes || []).map((e: any) => ({
      name: e.name,
      image: `https://cdn.7tv.app/emote/${e.id}/1x.webp`,
      height: e.data?.host?.files?.[1]?.height ?? 28,
      width: e.data?.host?.files?.[1]?.width ?? 28,
      zeroWidth: e.data?.flags === 256,
    }));
  } catch {
    return [];
  }
}

export async function getSevenTVChannelEmotes(userId: string): Promise<{ emotes: SevenTVEmote[]; setId: string | null }> {
  try {
    const res = await fetch(`https://7tv.io/v3/users/kick/${userId}`);
    if (!res.ok) return { emotes: [], setId: null };
    const data = await res.json();
    const emoteSet = data?.emote_set;
    if (!emoteSet) return { emotes: [], setId: null };
    return {
      setId: emoteSet.id,
      emotes: (emoteSet.emotes || []).map((e: any) => ({
        name: e.name,
        image: `https://cdn.7tv.app/emote/${e.id}/1x.webp`,
        height: e.data?.host?.files?.[1]?.height ?? 28,
        width: e.data?.host?.files?.[1]?.width ?? 28,
        zeroWidth: e.data?.flags === 256,
      })),
    };
  } catch {
    return { emotes: [], setId: null };
  }
}

export function decimalToRGBA(decimal: number): string {
  const r = (decimal >>> 24) & 255;
  const g = (decimal >>> 16) & 255;
  const b = (decimal >>> 8) & 255;
  const a = ((decimal & 255) / 255).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

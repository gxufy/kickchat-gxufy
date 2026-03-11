# kickchat-gxufy

A Kick chat overlay for OBS and streaming software — built by [@Gxufy_](https://x.com/Gxufy_).

**Live:** [kickchat-gxufy.vercel.app](https://kickchat-gxufy.vercel.app)

---

## Features

- 7TV global + channel emotes with live updates via EventAPI
- 7TV cosmetics — name-paints and badges
- Zero-width emote stacking
- Kick badges — Broadcaster, Mod, VIP, Subscriber, Founder, OG, Verified, Staff
- Batched slide / fade animations (no stutter on fast chat)
- Stroke, shadow, font options (12 fonts including Alsina)
- Pinned message banner
- Bot filtering — ignore known bots + custom list
- Chat commands (`!kickchat`) for broadcaster / mods

---

## Chat Commands

Trigger these in Kick chat. Broadcaster has full access; mods have access to most.

| Command | Description | Access |
|---|---|---|
| `!kickchat ping` | Shows a Pong overlay on screen | Mod+ |
| `!kickchat reload` | Reloads the browser source | Mod+ |
| `!kickchat stop` | Stops all active overlays | Mod+ |
| `!kickchat show` / `hide` | Shows or hides the chat overlay | Mod+ |
| `!kickchat refresh emotes` | Reloads 7TV emotes live | Mod+ |
| `!kickchat img [url] -t [sec] -o [opacity]` | Displays an image overlay | Mod+ |
| `!kickchat yt [url or preset] -t [sec] -m` | Plays YouTube video/sound. Presets: `bruh` `vine-boom` `dc-ping` `rickroll` `win-error` | Broadcaster |
| `!kickchat tts [message] -v [volume]` | Text-to-speech via StreamElements | Mod+ |

---

## OBS Setup

1. Go to [kickchat-gxufy.vercel.app](https://kickchat-gxufy.vercel.app), fill in your channel and configure options
2. Click **Generate** / Copy
3. In OBS: **Add Source → Browser Source**, paste the URL
4. Recommended size: **830 × 230**

---

## Stack

Next.js 14 · TypeScript · Tailwind CSS · Pusher (Kick chat) · 7TV EventAPI

---

*Inspired by [ChatIS](https://chatis.is2511.com/) by IS2511 & giambaJ. Not affiliated with Kick.*

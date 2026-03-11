# Kick Chat Overlay

A clean, feature-rich Kick chat overlay for OBS/Streamlabs with 7TV emote and cosmetics support.

## Features

- ✅ Real-time Kick chat via Pusher WebSocket
- ✅ 7TV global + channel emotes
- ✅ 7TV cosmetics (badges, name paints)
- ✅ Zero-width emote stacking
- ✅ Subscriber, mod, VIP, broadcaster badges
- ✅ Slide / fade / none animations
- ✅ Dark / light / system theme
- ✅ Small / medium / large text sizes
- ✅ Text shadow options
- ✅ Optional text background
- ✅ Pinned message banner
- ✅ Beautiful landing page with URL generator

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/kick-chat-overlay)

1. Fork/clone this repo
2. Push to GitHub
3. Import into [Vercel](https://vercel.com) — zero config needed
4. Share your overlay URL with OBS

## Usage

Visit your deployed site to use the URL generator, or construct the URL manually:

```
https://your-site.vercel.app/?channel=xqc&sevenTVEmotesEnabled=true&sevenTVCosmeticsEnabled=true&theme=dark&textShadow=large&textSize=medium&animation=slide&showPinEnabled=false&textBackgroundEnabled=false&textBackgroundWidth=min
```

### URL Parameters

| Parameter | Values | Default | Description |
|---|---|---|---|
| `channel` | string | **required** | Kick channel slug |
| `sevenTVEmotesEnabled` | true/false | true | Load 7TV emotes |
| `sevenTVCosmeticsEnabled` | true/false | true | Load 7TV badges & name paints |
| `theme` | dark/light/system | dark | Color theme |
| `textShadow` | none/small/medium/large | small | Text shadow intensity |
| `textSize` | small/medium/large | medium | Font size |
| `animation` | none/slide/fade | slide | Message entrance animation |
| `showPinEnabled` | true/false | false | Show pinned message banner |
| `textBackgroundEnabled` | true/false | false | Dark background behind text |
| `textBackgroundWidth` | min/max | min | Text background width |

## OBS Setup

1. Add a **Browser Source**
2. Paste your overlay URL
3. Set width: `400`, height: `600` (adjust to taste)
4. Enable **"Shutdown source when not visible"**
5. Enable **"Refresh browser when scene becomes active"**

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT

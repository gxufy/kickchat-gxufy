import { useState } from 'react';
import Head from 'next/head';

export default function LandingPage() {
  const [channel, setChannel] = useState('');
  const [sevenTVCosmetics, setSevenTVCosmetics] = useState(true);
  const [sevenTVEmotes, setSevenTVEmotes] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [textShadow, setTextShadow] = useState('small');
  const [textSize, setTextSize] = useState('medium');
  const [animation, setAnimation] = useState('slide');
  const [showPin, setShowPin] = useState(false);
  const [textBg, setTextBg] = useState(false);
  const [textBgWidth, setTextBgWidth] = useState('min');
  const [copied, setCopied] = useState(false);

  const params = new URLSearchParams({
    channel: channel || 'yourchannel',
    sevenTVCosmeticsEnabled: String(sevenTVCosmetics),
    sevenTVEmotesEnabled: String(sevenTVEmotes),
    theme,
    textShadow,
    textSize,
    animation,
    showPinEnabled: String(showPin),
    textBackgroundEnabled: String(textBg),
    textBackgroundWidth: textBgWidth,
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.vercel.app';
  const overlayUrl = `${baseUrl}/?${params.toString()}`;

  const copy = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Head>
        <title>Kick Chat Overlay</title>
        <meta name="description" content="Free Kick chat overlay for OBS with 7TV support. Works instantly — no login required." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a2e] text-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#53fc18]/10 border border-[#53fc18]/30 rounded-full px-4 py-1.5 mb-6 text-[#53fc18] text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#53fc18] animate-pulse" />
              Free · No login required · Open source
            </div>
            <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Kick Chat Overlay
            </h1>
            <p className="text-gray-400 text-lg">
              Drop your Kick chat into OBS in seconds. 7TV emotes &amp; cosmetics included.
            </p>
          </div>

          {/* Config panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 backdrop-blur">
            <h2 className="text-lg font-bold mb-5 text-white/80">⚙️ Configure your overlay</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Channel */}
              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Kick Channel Name *</label>
                <input
                  type="text"
                  placeholder="e.g. xqc"
                  value={channel}
                  onChange={e => setChannel(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-[#53fc18]/50 focus:ring-1 focus:ring-[#53fc18]/30 transition"
                />
              </div>

              {/* Theme */}
              <SelectField label="Theme" value={theme} onChange={setTheme} options={[['dark', 'Dark'], ['light', 'Light'], ['system', 'System']]} />

              {/* Text Size */}
              <SelectField label="Text Size" value={textSize} onChange={setTextSize} options={[['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']]} />

              {/* Text Shadow */}
              <SelectField label="Text Shadow" value={textShadow} onChange={setTextShadow} options={[['none', 'None'], ['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']]} />

              {/* Animation */}
              <SelectField label="Message Animation" value={animation} onChange={setAnimation} options={[['none', 'None'], ['slide', 'Slide in'], ['fade', 'Fade in']]} />

              {/* Text Bg Width */}
              <SelectField label="Text Background Width" value={textBgWidth} onChange={setTextBgWidth} options={[['min', 'Fit content'], ['max', 'Full width']]} disabled={!textBg} />

              {/* Toggles */}
              <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Toggle label="7TV Emotes" value={sevenTVEmotes} onChange={setSevenTVEmotes} />
                <Toggle label="7TV Cosmetics" value={sevenTVCosmetics} onChange={setSevenTVCosmetics} />
                <Toggle label="Text Background" value={textBg} onChange={setTextBg} />
                <Toggle label="Pinned Messages" value={showPin} onChange={setShowPin} />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Preview</p>
            <div className={`${textSize === 'small' ? 'text-sm' : textSize === 'large' ? 'text-xl' : 'text-base'} flex flex-wrap items-center gap-1`}>
              <span className="inline-flex items-center gap-0.5 mr-1">
                {/* broadcaster badge placeholder */}
                <span className="w-4 h-4 rounded bg-[#53fc18]/80 inline-block" title="broadcaster" />
              </span>
              <span className="font-bold" style={{ color: '#D399FF' }}>YourChannel</span>
              <span className="text-white">: Hello, this is what a chat message looks like! 👋</span>
            </div>
          </div>

          {/* URL output */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Your overlay URL</p>
            <div className="flex gap-2">
              <code className="flex-1 text-[#53fc18] text-xs break-all bg-black/30 rounded-lg px-3 py-2 select-all">
                {overlayUrl}
              </code>
              <button
                onClick={copy}
                className="flex-shrink-0 bg-[#53fc18] hover:bg-[#53fc18]/80 text-black font-bold text-sm px-4 py-2 rounded-lg transition"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* How to use */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold mb-3 text-white/80">🎬 How to add to OBS</h2>
            <ol className="text-gray-400 text-sm space-y-1.5 list-decimal list-inside">
              <li>Enter your Kick channel name above and configure your settings</li>
              <li>Copy the overlay URL</li>
              <li>In OBS, add a <strong className="text-white">Browser Source</strong></li>
              <li>Paste the URL and set width/height (e.g. 400×600 for a sidebar)</li>
              <li>Check <strong className="text-white">"Shutdown source when not visible"</strong> and <strong className="text-white">"Refresh browser when scene becomes active"</strong></li>
            </ol>
          </div>

          <p className="text-center text-gray-600 text-sm mt-8">
            Open source · Built for Kick streamers
          </p>
        </div>
      </div>
    </>
  );
}

function SelectField({
  label, value, onChange, options, disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#53fc18]/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {options.map(([val, lbl]) => (
          <option key={val} value={val} className="bg-[#1a1a2e]">{lbl}</option>
        ))}
      </select>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex flex-col items-center gap-2 cursor-pointer select-none">
      <span className="text-xs text-gray-400 text-center">{label}</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors ${value ? 'bg-[#53fc18]' : 'bg-white/20'} relative`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </button>
    </label>
  );
}

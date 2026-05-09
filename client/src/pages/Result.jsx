import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import heroPlaceholder from '../assets/hero_placeholder.jpg'

const STYLE_PRESETS = [
  { label: 'None',         value: '',                                                                 icon: '🎯', tip: 'No style — your prompt as-is' },
  { label: 'Oil Painting', value: 'oil painting style, thick brushstrokes, textured canvas',          icon: '🎨', tip: 'Classic painted look with rich texture' },
  { label: 'Anime',        value: 'anime style, Studio Ghibli inspired, vibrant colors, detailed',    icon: '🌸', tip: 'Japanese animation, Ghibli-inspired' },
  { label: 'Realistic',    value: 'photorealistic, 8k, DSLR, cinematic lighting, ultra detailed',     icon: '📸', tip: 'Hyper-real, like a photograph' },
  { label: 'Cinematic',    value: 'cinematic shot, anamorphic lens, dramatic lighting, movie still',  icon: '🎬', tip: 'Movie-grade lighting & composition' },
  { label: 'Watercolor',   value: 'watercolor painting, soft edges, pastel tones, artistic',          icon: '🖌️', tip: 'Soft, dreamy watercolor illustration' },
  { label: 'Cyberpunk',    value: 'cyberpunk style, neon lights, futuristic, dark atmosphere',        icon: '🤖', tip: 'Neon-lit futuristic dark aesthetic' },
  { label: 'Cartoon',      value: 'cartoon style, flat design, bold outlines, vibrant colors',        icon: '🧸', tip: 'Fun bold cartoon illustration' },
]

const Result = () => {
  const { generateImage, backendUrl, token } = useContext(AppContext)

  const [image, setImage] = useState(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('')
  const [enhancing, setEnhancing] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [hoveredTip, setHoveredTip] = useState(null)

  const enhancePrompt = async () => {
    if (!input.trim()) { toast.error('Enter a prompt first'); return }
    setEnhancing(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/image/enhance-prompt`,
        { prompt: input.trim() },
        { headers: { token } }
      )
      if (data.success) { setInput(data.enhancedPrompt); toast.success('Prompt enhanced! ✨') }
      else toast.error(data.message || 'Enhancement failed')
    } catch { toast.error('Could not enhance prompt') }
    finally { setEnhancing(false) }
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    try {
      const finalPrompt = selectedStyle ? `${input.trim()}, ${selectedStyle}` : input.trim()
      const img = await generateImage(finalPrompt)
      if (img) { setIsImageLoaded(true); setImage(img) }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes pulse-glow { 0%,100% { opacity:0.4 } 50% { opacity:0.8 } }
        .preset-btn:hover { border-color: #a78bfa !important; color: #a78bfa !important; }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .generate-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1a2e; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: '90vh', display: 'flex',
          background: '#0d0d0d',
        }}
      >
        {/* ── LEFT PANEL — Controls ── */}
        <div style={{
          flex: 1, padding: '44px 44px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          overflowY: 'auto', position: 'relative', zIndex: 1,
        }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <motion.p
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              style={{ color: '#a78bfa', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}
            >
              Zent.ai · Studio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ fontSize: 30, fontWeight: 800, color: '#f9fafb', letterSpacing: '-0.5px', marginBottom: 8, lineHeight: 1.2 }}
            >
              Generate an Image
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.6 }}
            >
              Describe anything. Our AI turns your words into stunning visuals instantly.
            </motion.p>
          </div>

          <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Step 1 — Prompt */}
            <div>
              <div style={labelRow}>
                <span style={badge}>1</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#e5e7eb' }}>Describe your image</span>
              </div>
              <p style={hint}>Be specific — include subject, setting, mood, and colors for best results.</p>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: '1px solid #2a2a2a', borderRadius: 12,
                padding: '4px 4px 4px 14px', background: '#161616', marginTop: 10,
              }}>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder='"A samurai cat in a neon Tokyo alley at midnight"'
                  style={{
                    flex: 1, border: 'none', background: 'transparent',
                    outline: 'none', fontSize: 13, color: '#f3f4f6',
                    padding: '10px 0',
                  }}
                />
                <button type="button" onClick={enhancePrompt} disabled={enhancing}
                  style={{
                    background: enhancing ? '#1f1f1f' : 'linear-gradient(135deg,#6366f1,#a855f7)',
                    color: enhancing ? '#555' : '#fff',
                    border: 'none', borderRadius: 9, padding: '10px 14px',
                    fontSize: 12, fontWeight: 600,
                    cursor: enhancing ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {enhancing ? 'Enhancing…' : '✨ AI Enhance'}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#4b5563', marginTop: 6 }}>
                💡 <span style={{ color: '#7c3aed' }}>AI Enhance</span> uses Groq LLM to rewrite your prompt with rich detail — better prompts = better images.
              </p>
            </div>

            {/* Step 2 — Style */}
            <div>
              <div style={labelRow}>
                <span style={badge}>2</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: '#e5e7eb' }}>Choose a style</span>
              </div>
              <p style={hint}>Style presets inject artistic direction automatically. Hover each to see what it does.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
                {STYLE_PRESETS.map(s => (
                  <div key={s.label} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      className="preset-btn"
                      onClick={() => setSelectedStyle(s.value)}
                      onMouseEnter={() => setHoveredTip(s.label)}
                      onMouseLeave={() => setHoveredTip(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '6px 12px', borderRadius: 999, fontSize: 12,
                        border: selectedStyle === s.value ? '1.5px solid #7c3aed' : '1px solid #2a2a2a',
                        background: selectedStyle === s.value ? '#1e1133' : '#161616',
                        color: selectedStyle === s.value ? '#a78bfa' : '#9ca3af',
                        fontWeight: selectedStyle === s.value ? 600 : 400,
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >
                      {s.icon} {s.label}
                    </button>
                    {hoveredTip === s.label && (
                      <div style={{
                        position: 'absolute', bottom: '115%', left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#1f1f1f', color: '#e5e7eb', border: '1px solid #2a2a2a',
                        fontSize: 11, padding: '5px 10px', borderRadius: 6,
                        whiteSpace: 'nowrap', zIndex: 20, pointerEvents: 'none',
                      }}>
                        {s.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 — Advanced */}
            <div>
              <button type="button" onClick={() => setShowAdvanced(!showAdvanced)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#6b7280', fontWeight: 600, padding: 0,
                }}
              >
                <span style={badge}>3</span>
                Advanced options <span style={{ fontSize: 10 }}>{showAdvanced ? '▲' : '▼'}</span>
              </button>
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: 12 }}>
                      <p style={hint}>
                        <span style={{ color: '#e5e7eb', fontWeight: 600 }}>Negative prompt</span> — describe what you <em>don't</em> want. The AI will actively exclude these elements.
                      </p>
                      <input
                        value={negativePrompt}
                        onChange={e => setNegativePrompt(e.target.value)}
                        placeholder='e.g. blurry, low quality, watermark, extra fingers, text'
                        style={{
                          width: '100%', border: '1px solid #2a2a2a', borderRadius: 10,
                          padding: '11px 14px', fontSize: 13, color: '#f3f4f6',
                          outline: 'none', background: '#161616',
                          boxSizing: 'border-box', marginTop: 8,
                        }}
                      />
                      <p style={{ fontSize: 11, color: '#4b5563', marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        Common:
                        {['blurry', 'watermark', 'bad anatomy', 'duplicate'].map(t => (
                          <code key={t} style={{
                            background: '#1a1a1a', border: '1px solid #2a2a2a',
                            padding: '1px 6px', borderRadius: 4, color: '#6b7280', fontSize: 11,
                          }}>{t}</code>
                        ))}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate Button */}
            <button type="submit" disabled={loading || !input.trim()} className="generate-btn"
              style={{
                width: '100%',
                background: loading || !input.trim()
                  ? '#1a1a1a'
                  : 'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)',
                color: loading || !input.trim() ? '#333' : '#fff',
                border: loading || !input.trim() ? '1px solid #222' : 'none',
                borderRadius: 12, padding: '15px',
                fontSize: 15, fontWeight: 700,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s', letterSpacing: '-0.2px',
              }}
            >
              {loading ? 'Generating…' : '🚀 Generate Image'}
            </button>

            {isImageLoaded && (
              <button type="button"
                onClick={() => { setIsImageLoaded(false); setImage(null) }}
                style={{
                  width: '100%', background: 'transparent',
                  border: '1px solid #2a2a2a', borderRadius: 12,
                  padding: '13px', fontSize: 14, fontWeight: 600,
                  color: '#9ca3af', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                🔄 Generate Another
              </button>
            )}
          </form>

          <p style={{ marginTop: 28, fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
            Each generation costs <span style={{ color: '#6b7280' }}>1 credit</span>. Use <span style={{ color: '#7c3aed' }}>✨ AI Enhance</span> first — better prompts waste fewer credits.
          </p>
        </div>

        {/* ── RIGHT PANEL — Image ── */}
        <div style={{
          flex: '0 0 48%', position: 'relative',
          background: '#0d0d0d', overflow: 'hidden',
          minHeight: '90vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <AnimatePresence mode="wait">
            {!isImageLoaded ? (
              <motion.div key="placeholder"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                {/* Robot hand image — fades into black on left */}
                <img src={heroPlaceholder} alt="AI visual"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    objectPosition: 'center',
                    opacity: loading ? 0.15 : 1,
                    transition: 'opacity 0.5s',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 25%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%)',
                  }}
                />

                {/* Bottom tagline */}
                {!loading && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: '80px 36px 36px',
                    background: 'linear-gradient(to top, rgba(13,13,13,0.95) 0%, transparent 100%)',
                  }}>
                    <p style={{ color: '#a78bfa', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>
                      AI · Imagination · Reality
                    </p>
                    <h2 style={{
                      color: '#f9fafb', fontSize: 26, fontWeight: 800,
                      lineHeight: 1.25, margin: '0 0 10px', letterSpacing: '-0.5px'
                    }}>
                      Where your words<br />
                      <span style={{ color: '#a78bfa' }}>become reality.</span>
                    </h2>
                    <p style={{ color: '#4b5563', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                      Type a prompt → pick a style →<br />watch AI paint your vision in seconds.
                    </p>
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18,
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      border: '3px solid rgba(255,255,255,0.05)',
                      borderTop: '3px solid #a78bfa',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    <p style={{ color: '#9ca3af', fontSize: 14, fontWeight: 500 }}>Generating your image…</p>
                    <div style={{ width: 200, height: 2, background: '#1a1a1a', borderRadius: 999 }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: '85%' }}
                        transition={{ duration: 7, ease: 'easeInOut' }}
                        style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#a855f7)', borderRadius: 999 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="result"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <img src={image} alt="Generated"
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 20%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%)',
                  }}
                />
                <div style={{
                  position: 'absolute', bottom: 24, left: '50%',
                  transform: 'translateX(-50%)', display: 'flex', gap: 10,
                }}>
                  <button className="action-btn"
                    onClick={() => { navigator.clipboard.writeText(input); toast.success('Copied!') }}
                    style={darkActionBtn}
                  >
                    📋 Copy Prompt
                  </button>
                  <a href={image} download="zent-ai.png" className="action-btn"
                    style={{ ...darkActionBtn, background: '#6366f1', border: '1px solid #6366f1', textDecoration: 'none' }}
                  >
                    ⬇️ Download
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

const labelRow = { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }
const hint = { fontSize: 12, color: '#4b5563', lineHeight: 1.6, margin: '4px 0 0' }
const badge = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 22, height: 22, borderRadius: '50%',
  background: '#1e1133', color: '#a78bfa',
  fontSize: 11, fontWeight: 700, flexShrink: 0, border: '1px solid #2d1b69',
}
const darkActionBtn = {
  background: 'rgba(13,13,13,0.85)', color: '#e5e7eb',
  border: '1px solid #2a2a2a', borderRadius: 999,
  padding: '10px 18px', fontSize: 12, fontWeight: 600,
  cursor: 'pointer', backdropFilter: 'blur(8px)',
  display: 'inline-flex', alignItems: 'center', gap: 6,
  transition: 'all 0.2s',
}

export default Result

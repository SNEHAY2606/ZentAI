import React, { useContext } from 'react'
import { assets } from "../assets/assets"
import { motion } from "motion/react"
import { AppContext } from "../context/AppContext"
import { useNavigate } from 'react-router-dom'
import heroPlaceholder from '../assets/robotichand.jpg'

const SAMPLE_PROMPTS = [
  'A futuristic city at sunset',
  'A cozy cabin in a snowy forest',
  'An astronaut riding a horse on Mars',
  'A dragon made of clouds',
]

const Header = () => {
  const { user, setshowLogin } = useContext(AppContext)
  const navigate = useNavigate()

  const onClickHandler = () => {
    if (user) navigate('/result')
    else setshowLogin(true)
  }

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      overflow: 'hidden',
      background: '#0d0d0d',
    }}>
      <style>{`
        .prompt-chip:hover { border-color: #7c3aed !important; color: #a78bfa !important; }
        .cta-btn:hover { opacity: 0.9; transform: translateY(-2px); }
      `}</style>

      {/* ── LEFT — Text content ── */}
      <div style={{
        flex: 1,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 56px',
        zIndex: 2, position: 'relative',
      }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#1a1133', border: '1px solid #2d1b69',
            borderRadius: 999, padding: '6px 16px',
            fontSize: 12, color: '#a78bfa', fontWeight: 500,
            marginBottom: 28, width: 'fit-content',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          AI-Powered Text to Image Generation
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: 'clamp(36px, 4vw, 62px)',
            fontWeight: 800,
            letterSpacing: '-2px',
            lineHeight: 1.1,
            color: '#f9fafb',
            marginBottom: 20,
          }}
        >
          Turn your words into{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            stunning visuals
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 16, color: '#6b7280',
            maxWidth: 460, lineHeight: 1.7, marginBottom: 36,
          }}
        >
          Describe any image in plain English. Our AI instantly generates high-quality artwork, illustrations, and photos — in seconds.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={onClickHandler}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          className="cta-btn"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: '#fff', border: 'none', borderRadius: 999,
            padding: '14px 36px', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', marginBottom: 48, width: 'fit-content',
            boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
            transition: 'all 0.2s',
          }}
        >
          <img src={assets.star_icon} alt="" style={{ width: 17, filter: 'brightness(10)' }} />
          Start Generating — It's Free
        </motion.button>

        {/* Sample prompt chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
        >
          <p style={{ width: '100%', fontSize: 11, color: '#4b5563', marginBottom: 4, letterSpacing: 1 }}>
            TRY THESE PROMPTS →
          </p>
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={onClickHandler}
              className="prompt-chip"
              style={{
                background: '#161616', border: '1px solid #2a2a2a',
                borderRadius: 999, padding: '7px 14px',
                fontSize: 12, color: '#6b7280', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {prompt}
            </button>
          ))}
        </motion.div>

        {/* Sample images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          style={{ display: 'flex', gap: 10, marginTop: 44, flexWrap: 'wrap' }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.img
              key={i}
              whileHover={{ scale: 1.1, y: -4 }}
              transition={{ duration: 0.2 }}
              src={i % 2 === 0 ? assets.sample_img_1 : assets.sample_img_2}
              alt="sample"
              onClick={onClickHandler}
              style={{
                width: 64, height: 64, borderRadius: 12,
                objectFit: 'cover', cursor: 'pointer',
                border: '1.5px solid #1f1f1f',
                filter: 'brightness(0.85)',
                transition: 'filter 0.2s',
              }}
            />
          ))}
          <div style={{
            width: 64, height: 64, borderRadius: 12,
            border: '1px dashed #2a2a2a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#4b5563', fontSize: 11,
          }}
            onClick={onClickHandler}
          >
            + more
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{ marginTop: 12, fontSize: 11, color: '#374151' }}
        >
          Sample images generated with Zent.ai
        </motion.p>
      </div>

      {/* ── RIGHT — Robot hand image ── */}
      <div style={{
        flex: '0 0 45%',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <img
          src={heroPlaceholder}
          alt="AI visual"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            maskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%)',
            opacity: 0.9,
          }}
        />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
          background: 'linear-gradient(to top, #0d0d0d, transparent)',
          pointerEvents: 'none',
        }} />
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}

export default Header

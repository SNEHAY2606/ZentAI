import React, { useContext } from 'react'
import { assets } from "../assets/assets"
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const { user, setshowLogin, logout, credit } = useContext(AppContext)
  const navigate = useNavigate()

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 32px',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #f0f0f0',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <img src={assets.logo_icon} alt="Zent.ai logo" style={{ width: 32, height: 32 }} />
        <span style={{ fontWeight: 700, fontSize: 20, color: '#111', letterSpacing: '-0.5px' }}>Zent<span style={{ color: '#6366f1' }}>.ai</span></span>
      </Link>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Credits badge */}
          <button
            onClick={() => navigate('/buy')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#f0f0ff', border: '1px solid #c7d2fe',
              borderRadius: 999, padding: '7px 14px',
              cursor: 'pointer', transition: 'all 0.2s',
              fontSize: 13, fontWeight: 500, color: '#4338ca'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e0e7ff'}
            onMouseLeave={e => e.currentTarget.style.background = '#f0f0ff'}
          >
            <img src={assets.credit_star} alt="" style={{ width: 16 }} />
            {credit} credits
          </button>

          {/* User greeting */}
          <span style={{ fontSize: 13, color: '#555', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 30, height: 30, borderRadius: '50%',
              background: '#6366f1', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600
            }}>
              {user.name?.[0]?.toUpperCase()}
            </span>
            <span style={{ fontWeight: 500, color: '#111' }}>Hi, {user.name}</span>
          </span>

          {/* Logout */}
          <button
            onClick={logout}
            style={{
              background: 'none', border: '1px solid #e5e7eb',
              borderRadius: 999, padding: '7px 16px',
              cursor: 'pointer', fontSize: 13, color: '#555',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fca5a5' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#e5e7eb' }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            onClick={() => navigate('/buy')}
            style={{ cursor: 'pointer', fontSize: 14, color: '#555', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}
          >
            Pricing
          </span>
          <button
            onClick={() => setshowLogin(true)}
            style={{
              background: '#111', color: '#fff',
              border: 'none', borderRadius: 999,
              padding: '9px 24px', fontSize: 14,
              fontWeight: 500, cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.background = '#111'}
          >
            Login
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar

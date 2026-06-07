import React, { useState, useEffect } from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from '../components/SettingsModal'

type ColorPreset = {
  name: string
  color: string
  containerColor: string
}

const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Forest Green', color: '#006c49', containerColor: '#10b981' },
  { name: 'Ocean Blue', color: '#1d4ed8', containerColor: '#3b82f6' },
  { name: 'Sunset Orange', color: '#c2410c', containerColor: '#f97316' },
  { name: 'Royal Purple', color: '#6d28d9', containerColor: '#8b5cf6' },
  { name: 'Rose Red', color: '#be123c', containerColor: '#f43f5e' },
  { name: 'Sleek Indigo', color: '#4338ca', containerColor: '#6366f1' }
]

const SettingsPage: React.FC = () => {
  const [uiLanguage, setUiLanguage] = useState<UiLanguage>('ko')
  const [selectedColor, setSelectedColor] = useState<string>('#006c49')

  // Load config on mount
  useEffect(() => {
    window.api.loadConfig().then((config) => {
      if (config.uiLanguage) setUiLanguage(config.uiLanguage)
      if (config.themeColor) {
        setSelectedColor(config.themeColor)
        applyTheme(config.themeColor, config.themeColorContainer)
      }
    })

    // Listen for updates from other windows
    const removeListener = window.api.onConfigUpdated((newConfig) => {
      if (newConfig.uiLanguage) setUiLanguage(newConfig.uiLanguage)
      if (newConfig.themeColor) {
        setSelectedColor(newConfig.themeColor)
        applyTheme(newConfig.themeColor, newConfig.themeColorContainer)
      }
    })

    return () => removeListener()
  }, [])

  const applyTheme = (color: string, containerColor: string) => {
    document.documentElement.style.setProperty('--primary', color)
    document.documentElement.style.setProperty('--primary-container', containerColor)
  }

  const handleLanguageChange = async (lang: UiLanguage) => {
    setUiLanguage(lang)
    const config = await window.api.loadConfig()
    config.uiLanguage = lang
    await window.api.saveConfig(config)
  }

  const handleColorChange = async (preset: ColorPreset) => {
    setSelectedColor(preset.color)
    applyTheme(preset.color, preset.containerColor)
    const config = await window.api.loadConfig()
    config.themeColor = preset.color
    config.themeColorContainer = preset.containerColor
    await window.api.saveConfig(config)
  }

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflowY: 'auto',
        fontFamily: 'var(--font-body)',
        padding: '32px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '440px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '8px' }}>
          <h1 className="headline-lg" style={{ fontSize: '26px', margin: 0 }}>
            {t('settings', uiLanguage)}
          </h1>
          <button
            className="btn-icon"
            onClick={() => window.close()}
            style={{ width: '32px', height: '32px' }}
          >
            ✕
          </button>
        </div>

        {/* Language Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: 'var(--radius-lg)' }}>
          <p className="label-lg" style={{ fontSize: '12px', color: 'var(--primary)', letterSpacing: '0.05em' }}>
            {t('languageSettings', uiLanguage)}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { id: 'ko', label: '한국어 (Korean)' },
              { id: 'en', label: 'English (영어)' },
              { id: 'ja', label: '日本語 (일본어)' }
            ].map((lang) => (
              <label
                key={lang.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '4px 0'
                }}
              >
                <input
                  type="radio"
                  name="language"
                  value={lang.id}
                  checked={uiLanguage === lang.id}
                  onChange={() => handleLanguageChange(lang.id as UiLanguage)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '15px', fontWeight: 600 }}>{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Theme Settings Section */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: 'var(--radius-lg)' }}>
          <p className="label-lg" style={{ fontSize: '12px', color: 'var(--primary)', letterSpacing: '0.05em' }}>
            {t('themeSettings', uiLanguage)}
          </p>
          <p style={{ fontSize: '13px', color: 'var(--neutral)', opacity: 0.6, marginTop: '-8px', marginBottom: '4px' }}>
            {t('themeColorLabel', uiLanguage)}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {COLOR_PRESETS.map((preset) => {
              const isActive = selectedColor === preset.color
              return (
                <button
                  key={preset.name}
                  onClick={() => handleColorChange(preset)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 8px',
                    background: isActive ? '#ffffff' : 'transparent',
                    border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: preset.color,
                      border: '1.5px solid rgba(255,255,255,0.8)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <span style={{ fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', opacity: isActive ? 1 : 0.65 }}>
                    {preset.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <button
          className="btn-secondary"
          onClick={() => window.close()}
          style={{
            height: '48px',
            fontSize: '15px',
            fontWeight: 700,
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            width: '100%',
            cursor: 'pointer',
            marginTop: '8px',
            transition: 'all 0.2s'
          }}
        >
          {t('close', uiLanguage)}
        </button>
      </div>
    </div>
  )
}

export default SettingsPage

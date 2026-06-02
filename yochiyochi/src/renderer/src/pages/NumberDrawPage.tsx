import React, { useState, useCallback, useEffect } from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from '../components/SettingsModal'

type Preset = {
  name: string
  min: string
  max: string
  excluded: string // comma-separated
}

const DEFAULT_PRESETS: Preset[] = [
  { name: '1반', min: '1', max: '30', excluded: '' },
  { name: '2반', min: '1', max: '28', excluded: '' },
  { name: '3반', min: '1', max: '32', excluded: '' }
]

const NumberDrawPage: React.FC<{ uiLanguage: UiLanguage }> = ({ uiLanguage }) => {
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS)
  const [activePresetIndex, setActivePresetIndex] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isEditingPresets, setIsEditingPresets] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)

  useEffect(() => {
    window.api.loadConfig().then((config) => {
      if (config.presets && config.presets.length > 0) {
        setPresets(config.presets)
      }
    })
  }, [])

  useEffect(() => {
    window.api.loadConfig().then((config) => {
      config.presets = presets
      window.api.saveConfig(config)
    })
  }, [presets])

  const activePreset = presets[activePresetIndex] || presets[0]

  const updateActivePreset = (field: keyof Preset, value: string) => {
    setPresets((prev) =>
      prev.map((p, i) => (i === activePresetIndex ? { ...p, [field]: value } : p))
    )
  }

  const addPreset = () => {
    const newPreset: Preset = {
      name: `${presets.length + 1}반`,
      min: '1',
      max: '30',
      excluded: ''
    }
    setPresets((prev) => [...prev, newPreset])
    setActivePresetIndex(presets.length)
  }

  const deletePreset = (index: number) => {
    if (presets.length <= 1) return
    setPresets((prev) => prev.filter((_, i) => i !== index))
    if (activePresetIndex >= index && activePresetIndex > 0) {
      setActivePresetIndex(activePresetIndex - 1)
    }
  }

  const handleDraw = useCallback(() => {
    const minNum = parseInt(activePreset.min, 10) || 1
    const maxNum = parseInt(activePreset.max, 10) || 100
    const excludedArray = activePreset.excluded
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n))

    if (minNum > maxNum) return

    // Build valid pool
    const pool: number[] = []
    for (let i = minNum; i <= maxNum; i++) {
      if (!excludedArray.includes(i)) pool.push(i)
    }
    if (pool.length === 0) return

    setIsAnimating(true)
    setIsGlowing(false)

    // ~2s animation: 20 frames, starts fast and eases out
    let count = 0
    const totalFrames = 20
    const runFrame = () => {
      setResult(pool[Math.floor(Math.random() * pool.length)])
      count++
      if (count >= totalFrames) {
        const final = pool[Math.floor(Math.random() * pool.length)]
        setResult(final)
        setIsAnimating(false)
        setIsGlowing(true)
        // Glow lasts 2 seconds
        setTimeout(() => setIsGlowing(false), 2000)
        return
      }
      // Ease-out: 30ms base + 5ms per frame ≈ total ~2s
      const delay = 30 + count * 5
      setTimeout(runFrame, delay)
    }
    runFrame()
  }, [activePreset])

  const renderButtonText = () => {
    if (uiLanguage === 'ko') {
      return (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800 }}>뽑기</span>
          <span style={{ fontSize: '13px', fontWeight: 500, opacity: 0.5, letterSpacing: '0.05em', transform: 'translateY(1px)' }}>DRAW</span>
        </span>
      )
    }
    return <span style={{ fontSize: '24px', fontWeight: 800 }}>{t('drawBtn', uiLanguage)}</span>
  }

  const displayVal = result !== null ? String(result) : '?'
  const fontSz = displayVal.length >= 3 ? '160px' : displayVal.length >= 2 ? '220px' : '340px'
  const lineHt = displayVal.length >= 3 ? '310px' : displayVal.length >= 2 ? '310px' : '310px'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Main Area */}
        <div className="canvas-area" style={{ flex: 1 }}>
          <div
            key={result !== null ? result : 'empty'}
            className="animate-float-up delay-100"
            style={{
              width: '460px',
              height: '460px',
              borderRadius: '32px',
              backgroundColor: '#ECEEF2',
              boxShadow: '-10px -10px 20px rgba(255, 255, 255, 0.8), 10px 10px 20px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {/* 타이틀 레이블 (카드 내부 상단 배치 - 32px 울트라 볼드) */}
            <p
              className="label-lg"
              style={{
                position: 'absolute',
                top: '56px',
                color: 'var(--primary)',
                fontWeight: 900,
                fontSize: '26px',
                letterSpacing: '0.05em',
                marginBottom: 0
              }}
            >
              {t('randomNumber', uiLanguage)}
            </p>
            
            {/* 보조 프리셋 정보 텍스트 (타이틀 아래 배치) */}
            <p
              style={{
                position: 'absolute',
                top: '96px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--neutral)',
                opacity: 0.45,
                letterSpacing: '-0.02em',
                marginBottom: 0
              }}
            >
              {activePreset.name} · {activePreset.min}~{activePreset.max}{t('numberUnit', uiLanguage)}
              {activePreset.excluded ? ` (${t('excluded', uiLanguage)}: ${activePreset.excluded})` : ''}
            </p>

            <div
              className="display-xl"
              style={{
                transition: isGlowing ? 'all 0.3s ease-out' : 'transform 0.1s',
                transform: isAnimating 
                  ? 'translateY(36px) scale(1.05)' 
                  : isGlowing 
                    ? 'translateY(36px) scale(1.1)' 
                    : 'translateY(36px) scale(1)',
                color: isGlowing ? 'var(--primary)' : 'var(--neutral)',
                textShadow: isGlowing
                  ? '0 0 20px rgba(59,130,246,0.5), 0 0 50px rgba(59,130,246,0.25)'
                  : 'none',
                fontSize: fontSz,
                lineHeight: lineHt
              }}
            >
              {displayVal}
            </div>
          </div>
        </div>

        {/* Sidebar: Presets */}
        <aside className="sidebar-area">
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <h2
              className="headline-lg animate-float-up delay-150"
              style={{ fontSize: '28px', lineHeight: 1, marginBottom: '8px' }}
            >
              {t('presets', uiLanguage)}
            </h2>
            <p
              className="label-lg animate-float-up delay-150"
              style={{ opacity: 0.5, marginBottom: '24px' }}
            >
              {t('classSettings', uiLanguage)}
            </p>

            {/* Preset Tabs */}
            <div
              className="animate-float-up delay-250"
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '24px'
              }}
            >
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActivePresetIndex(i)}
                  style={{
                    padding: '8px 16px',
                    fontFamily: 'var(--font-family)',
                    fontWeight: 700,
                    fontSize: '14px',
                    background: i === activePresetIndex ? 'var(--primary)' : 'transparent',
                    color: i === activePresetIndex ? '#fff' : 'var(--neutral)',
                    border: i === activePresetIndex ? 'none' : '1px solid var(--border-light)',
                    borderRadius: 0,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {p.name}
                </button>
              ))}
              <button
                onClick={addPreset}
                style={{
                  padding: '8px 12px',
                  fontFamily: 'var(--font-family)',
                  fontWeight: 700,
                  fontSize: '16px',
                  background: 'transparent',
                  color: 'var(--primary)',
                  border: '1px dashed var(--primary)',
                  borderRadius: 0,
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>

            {/* Active Preset Settings */}
            <div className="card animate-float-up delay-350" style={{ padding: '16px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label className="label-lg" style={{ fontSize: '11px', marginBottom: '6px', display: 'block' }}>
                  {t('presetName', uiLanguage)}
                </label>
                <input
                  type="text"
                  value={activePreset.name}
                  onChange={(e) => updateActivePreset('name', e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label className="label-lg" style={{ fontSize: '11px', marginBottom: '6px', display: 'block' }}>
                    MIN
                  </label>
                  <input
                    type="number"
                    value={activePreset.min}
                    onChange={(e) => updateActivePreset('min', e.target.value)}
                    style={{ height: '40px' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label-lg" style={{ fontSize: '11px', marginBottom: '6px', display: 'block' }}>
                    MAX
                  </label>
                  <input
                    type="number"
                    value={activePreset.max}
                    onChange={(e) => updateActivePreset('max', e.target.value)}
                    style={{ height: '40px' }}
                  />
                </div>
              </div>

              <div>
                <label className="label-lg" style={{ fontSize: '11px', marginBottom: '6px', display: 'block' }}>
                  {t('excludedNumbers', uiLanguage)}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3, 7, 15"
                  value={activePreset.excluded}
                  onChange={(e) => updateActivePreset('excluded', e.target.value)}
                  style={{ height: '40px' }}
                />
              </div>
            </div>

            {presets.length > 1 && (
              <button
                className="animate-float-up delay-350"
                onClick={() => deletePreset(activePresetIndex)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontFamily: 'var(--font-family)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px 0',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg
                  style={{ width: '14px', height: '14px', fill: 'currentColor' }}
                  viewBox="0 0 24 24"
                >
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
                {t('deletePreset', uiLanguage)}
              </button>
            )}

            <div className="animate-float-up delay-500" style={{ marginTop: 'auto' }}>
              <p style={{ fontSize: '13px', opacity: 0.5, fontStyle: 'italic', lineHeight: 1.6 }}>
                {t('presetTip', uiLanguage)}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Draw Button */}
      <footer className="bottom-bar">
        <button
          className="btn-primary animate-float-up delay-300"
          style={{ flex: 1, height: '80px' }}
          onClick={handleDraw}
          disabled={isAnimating}
        >
          {renderButtonText()}
        </button>
      </footer>
    </div>
  )
}

export default NumberDrawPage

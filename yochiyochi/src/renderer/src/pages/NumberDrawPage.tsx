import React, { useState, useCallback, useEffect, useRef } from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from '../components/SettingsModal'

type Preset = {
  name: string
  min: string
  max: string
  excluded: string // comma-separated
}

const DEFAULT_PRESETS: Preset[] = [
  { name: 'A반', min: '1', max: '30', excluded: '' },
  { name: 'B반', min: '1', max: '28', excluded: '' },
  { name: 'C반', min: '1', max: '32', excluded: '' }
]

const NumberDrawPage: React.FC<{
  uiLanguage: UiLanguage
  drawHistory: Record<string, Record<number, number>>
  setDrawHistory: React.Dispatch<React.SetStateAction<Record<string, Record<number, number>>>>
}> = ({ uiLanguage, drawHistory, setDrawHistory }) => {
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS)
  const [activePresetIndex, setActivePresetIndex] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)
  const [reel, setReel] = useState<(number | string)[]>(['?'])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const finalizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const glowTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
      if (finalizeTimeoutRef.current) clearTimeout(finalizeTimeoutRef.current)
      if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current)
    }
  }, [])

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
      name: `${String.fromCharCode(65 + (presets.length % 26))}반`,
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

    const final = pool[Math.floor(Math.random() * pool.length)]

    // Generate reel: start with current display value, add 18 random numbers, end with final
    const currentVal = reel[activeIndex] !== undefined ? reel[activeIndex] : '?'
    const randomCount = 18
    const newReel: (number | string)[] = [currentVal]
    for (let i = 0; i < randomCount; i++) {
      newReel.push(pool[Math.floor(Math.random() * pool.length)])
    }
    newReel.push(final)

    // Clear any previous timeouts
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    if (finalizeTimeoutRef.current) clearTimeout(finalizeTimeoutRef.current)
    if (glowTimeoutRef.current) clearTimeout(glowTimeoutRef.current)

    setIsAnimating(true)
    setIsGlowing(false)
    setReel(newReel)
    setActiveIndex(0)
    setIsTransitioning(false)

    // Trigger transition in the next tick
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(true)
      setActiveIndex(newReel.length - 1)
    }, 50)

    // Finalize the draw after 2.5s transition + 50ms buffer
    finalizeTimeoutRef.current = setTimeout(() => {
      setResult(final)

      // Reset reel to single item
      setReel([final])
      setActiveIndex(0)
      setIsTransitioning(false)

      // Increment specific number count under active preset
      setDrawHistory((prev) => {
        const presetCounts = prev[activePreset.name] || {}
        return {
          ...prev,
          [activePreset.name]: {
            ...presetCounts,
            [final]: (presetCounts[final] || 0) + 1
          }
        }
      })

      setIsAnimating(false)
      setIsGlowing(true)

      glowTimeoutRef.current = setTimeout(() => {
        setIsGlowing(false)
      }, 2000)
    }, 2550)
  }, [activePreset, reel, activeIndex, setDrawHistory])

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

  const currentNumCount = result !== null ? (drawHistory[activePreset.name]?.[result] || 0) : 0

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Main Area */}
        <div className="canvas-area" style={{ flex: 1 }}>
          <div
            key="number-draw-card"
            className="animate-float-up delay-100"
            style={{
              width: '460px',
              height: '460px',
              borderRadius: '32px',
              backgroundColor: '#ECEEF2',
              boxShadow: isGlowing 
                ? '0 0 40px rgba(59, 130, 246, 0.35), -10px -10px 20px rgba(255, 255, 255, 0.8), 10px 10px 20px rgba(0, 0, 0, 0.12)'
                : '-10px -10px 20px rgba(255, 255, 255, 0.8), 10px 10px 20px rgba(0, 0, 0, 0.12)',
              border: isGlowing 
                ? '1px solid rgba(59, 130, 246, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: isAnimating 
                ? 'scale(0.97)' 
                : isGlowing 
                  ? 'scale(1.03)' 
                  : 'scale(1)'
            }}
          >

            {/* 누적 뽑기 횟수 표시 배지 */}
            {!isAnimating && currentNumCount > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  padding: '4px 10px',
                  borderRadius: '99px',
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  color: 'var(--primary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                {t('numberDrawCountLabel', uiLanguage, { count: currentNumCount })}
              </div>
            )}

            {/* 보조 프리셋 정보 텍스트 (타이틀 아래 배치) */}
            <p
              style={{
                position: 'absolute',
                top: '56px',
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

            {/* 슬롯머신 회전식 숫자 뷰포트 */}
            <div
              className="display-xl"
              style={{
                width: '100%',
                height: '320px',
                overflow: 'hidden',
                position: 'relative',
                transform: 'translateY(36px)'
              }}
            >
              <div
                style={{
                  width: '100%',
                  transform: `translateY(-${activeIndex * 320}px)`,
                  transitionProperty: 'transform, color, text-shadow',
                  transitionDuration: isTransitioning ? '2.5s, 0.3s, 0.3s' : '0s, 0.3s, 0.3s',
                  transitionTimingFunction: 'cubic-bezier(0.1, 0.9, 0.15, 1), ease-out, ease-out',
                  color: isGlowing ? 'var(--primary)' : 'var(--neutral)',
                  textShadow: isGlowing
                    ? '0 0 20px rgba(59, 130, 246, 0.4), 0 0 50px rgba(59, 130, 246, 0.2)'
                    : 'none'
                }}
              >
                {reel.map((num, idx) => {
                  const str = String(num)
                  const fSz = str.length >= 3 ? '160px' : str.length >= 2 ? '220px' : '340px'
                  return (
                    <div
                      key={idx}
                      style={{
                        width: '100%',
                        height: '320px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: fSz,
                        lineHeight: '320px',
                        fontWeight: 900
                      }}
                    >
                      {str}
                    </div>
                  )
                })}
              </div>
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

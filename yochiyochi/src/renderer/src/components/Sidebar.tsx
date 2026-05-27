import React from 'react'
import { t } from '../utils/i18n'

type SidebarProps = {
  uiLanguage: 'ko' | 'en' | 'ja'
  scriptType: 'hiragana' | 'katakana' | 'mixed'
  setScriptType: (v: 'hiragana' | 'katakana' | 'mixed') => void
  useSeion: boolean
  setUseSeion: (v: boolean) => void
  useDakuon: boolean
  setUseDakuon: (v: boolean) => void
  useHandakuon: boolean
  setUseHandakuon: (v: boolean) => void
  useYoon: boolean
  setUseYoon: (v: boolean) => void
  preventDuplicates: boolean
  setPreventDuplicates: (v: boolean) => void
  showRomaji: boolean
  setShowRomaji: (v: boolean) => void
  showExample: boolean
  setShowExample: (v: boolean) => void
}

const ToggleRow: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({
  label,
  checked,
  onChange
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0'
    }}
  >
    <span style={{ fontWeight: 600, fontSize: '16px' }}>{label}</span>
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="slider"></span>
    </label>
  </div>
)

const Sidebar: React.FC<SidebarProps> = ({
  uiLanguage,
  scriptType,
  setScriptType,
  useSeion,
  setUseSeion,
  useDakuon,
  setUseDakuon,
  useHandakuon,
  setUseHandakuon,
  useYoon,
  setUseYoon,
  preventDuplicates,
  setPreventDuplicates,
  showRomaji,
  setShowRomaji,
  showExample,
  setShowExample
}) => {
  return (
    <aside className="sidebar-area">
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h2
          className="headline-lg"
          style={{ fontSize: '28px', lineHeight: 1, marginBottom: '8px' }}
        >
          yochiyochi
        </h2>
        <p
          className="label-lg"
          style={{ color: 'var(--neutral)', opacity: 0.7, marginBottom: '24px' }}
        >
          {t('learningPanel', uiLanguage)}
        </p>

        {/* ── 문자 종류 (SCRIPT) ── */}
        <p className="label-lg" style={{ marginBottom: '8px' }}>
          {t('scriptType', uiLanguage)}
        </p>
        <div
          style={{
            display: 'flex',
            background: 'var(--surface)',
            border: '1px solid var(--border-light)',
            padding: '4px',
            marginBottom: '24px'
          }}
        >
          {[
            { id: 'hiragana', label: t('hiragana', uiLanguage) },
            { id: 'katakana', label: t('katakana', uiLanguage) },
            { id: 'mixed', label: t('mixed', uiLanguage) }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setScriptType(opt.id as 'hiragana' | 'katakana' | 'mixed')}
              style={{
                flex: 1,
                border: 'none',
                background: scriptType === opt.id ? 'var(--primary)' : 'transparent',
                color: scriptType === opt.id ? '#fff' : 'var(--neutral)',
                fontWeight: 600,
                fontSize: '14px',
                height: '40px',
                borderRadius: '0',
                transition: 'all 0.15s'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── 학습 범위 (RANGE) ── */}
        <p className="label-lg" style={{ marginBottom: '8px' }}>
          {t('range', uiLanguage)}
        </p>
        <div
          className="card"
          style={{ padding: '4px 16px', marginBottom: '24px' }}
        >
          <ToggleRow label={t('seion', uiLanguage)} checked={useSeion} onChange={setUseSeion} />
          <ToggleRow label={t('dakuon', uiLanguage)} checked={useDakuon} onChange={setUseDakuon} />
          <ToggleRow label={t('handakuon', uiLanguage)} checked={useHandakuon} onChange={setUseHandakuon} />
          <ToggleRow label={t('yoon', uiLanguage)} checked={useYoon} onChange={setUseYoon} />
          <ToggleRow label={t('preventDuplicates', uiLanguage)} checked={preventDuplicates} onChange={setPreventDuplicates} />
        </div>

        {/* ── 표시 옵션 (DISPLAY) ── */}
        <p className="label-lg" style={{ marginBottom: '8px' }}>
          {t('displayOptions', uiLanguage)}
        </p>
        <div
          className="card"
          style={{ padding: '4px 16px', marginBottom: '24px' }}
        >
          <ToggleRow label={t('showRomaji', uiLanguage)} checked={showRomaji} onChange={setShowRomaji} />
          <ToggleRow label={t('showExample', uiLanguage)} checked={showExample} onChange={setShowExample} />
        </div>

        {/* TIP */}
        <div style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '13px', opacity: 0.5, fontStyle: 'italic', lineHeight: 1.6 }}>
            {t('sidebarTip', uiLanguage)}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

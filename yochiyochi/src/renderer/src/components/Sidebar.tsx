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
      padding: '14px 0'
    }}
  >
    <span style={{ fontWeight: 600, fontSize: '15px', letterSpacing: '-0.03em' }}>{label}</span>
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
  setShowRomaji
}) => {
  return (
    <aside className="sidebar-area">
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <h2
          className="headline-lg animate-float-up delay-100"
          style={{ fontSize: '28px', lineHeight: 1, marginBottom: '8px' }}
        >
          yochiyochi
        </h2>
        <p
          className="label-lg animate-float-up delay-100"
          style={{ color: 'var(--neutral)', opacity: 0.7, marginBottom: '24px', paddingLeft: '24px' }}
        >
          {t('learningPanel', uiLanguage)}
        </p>

        {/* ── 문자 종류 (SCRIPT) ── */}
        <p className="label-lg animate-float-up delay-200" style={{ marginBottom: '8px', paddingLeft: '24px' }}>
          {t('scriptType', uiLanguage)}
        </p>
        <div className="segmented-control animate-float-up delay-200">
          {[
            { id: 'hiragana', label: t('hiragana', uiLanguage) },
            { id: 'katakana', label: t('katakana', uiLanguage) },
            { id: 'mixed', label: t('mixed', uiLanguage) }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setScriptType(opt.id as 'hiragana' | 'katakana' | 'mixed')}
              className={scriptType === opt.id ? 'active' : ''}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── 학습 범위 (RANGE) ── */}
        <p className="label-lg animate-float-up delay-300" style={{ marginBottom: '8px', paddingLeft: '24px' }}>
          {t('range', uiLanguage)}
        </p>
        <div
          className="card animate-float-up delay-300"
          style={{ padding: '8px 24px', marginBottom: '24px' }}
        >
          <ToggleRow label={t('seion', uiLanguage)} checked={useSeion} onChange={setUseSeion} />
          <ToggleRow label={t('dakuon', uiLanguage)} checked={useDakuon} onChange={setUseDakuon} />
          <ToggleRow label={t('handakuon', uiLanguage)} checked={useHandakuon} onChange={setUseHandakuon} />
          <ToggleRow label={t('yoon', uiLanguage)} checked={useYoon} onChange={setUseYoon} />
        </div>

        {/* ── 표시 옵션 (DISPLAY) ── */}
        <p className="label-lg animate-float-up delay-400" style={{ marginBottom: '8px', paddingLeft: '24px' }}>
          {t('displayOptions', uiLanguage)}
        </p>
        <div
          className="card animate-float-up delay-400"
          style={{ padding: '8px 24px', marginBottom: '24px' }}
        >
          <ToggleRow label={t('showRomaji', uiLanguage)} checked={showRomaji} onChange={setShowRomaji} />
          <ToggleRow label={t('preventDuplicates', uiLanguage)} checked={preventDuplicates} onChange={setPreventDuplicates} />
        </div>

        {/* TIP */}
        <div className="animate-float-up delay-500" style={{ marginTop: 'auto' }}>
          <p style={{ fontSize: '13px', opacity: 0.5, fontStyle: 'italic', lineHeight: 1.6 }}>
            {t('sidebarTip', uiLanguage)}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar

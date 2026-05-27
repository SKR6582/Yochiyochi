import React from 'react'
import { t } from '../utils/i18n'

export type UiLanguage = 'ko' | 'en' | 'ja'

type SettingsModalProps = {
  isOpen: boolean
  onClose: () => void
  uiLanguage: UiLanguage
  setUiLanguage: (lang: UiLanguage) => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  uiLanguage,
  setUiLanguage
}) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '400px',
          maxWidth: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="headline-lg" style={{ fontSize: '24px', lineHeight: 1 }}>
            {t('settings', uiLanguage)}
          </h2>
          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            ✕
          </button>
        </div>

        <div>
          <p className="label-lg" style={{ marginBottom: '12px' }}>
            {t('languageSettings', uiLanguage)}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  padding: '8px 0'
                }}
              >
                <input
                  type="radio"
                  name="language"
                  value={lang.id}
                  checked={uiLanguage === lang.id}
                  onChange={() => setUiLanguage(lang.id as UiLanguage)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontSize: '16px', fontWeight: 500 }}>{lang.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal

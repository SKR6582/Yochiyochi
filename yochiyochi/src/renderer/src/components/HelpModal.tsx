import React from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from './SettingsModal'

type HelpModalProps = {
  isOpen: boolean
  onClose: () => void
  uiLanguage: UiLanguage
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, uiLanguage }) => {
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
          width: '500px',
          maxWidth: '90%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--neutral)'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="headline-lg" style={{ fontSize: '24px', lineHeight: 1 }}>
            {t('helpTitle', uiLanguage)}
          </h2>
          <button className="btn-icon" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 className="label-lg" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
              Lessons
            </h3>
            <p className="body-lg" style={{ opacity: 0.8, lineHeight: 1.5 }}>
              {t('helpLessons', uiLanguage)}
            </p>
          </div>
          <div>
            <h3 className="label-lg" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
              {t('whiteboard', uiLanguage)}
            </h3>
            <p className="body-lg" style={{ opacity: 0.8, lineHeight: 1.5 }}>
              {t('helpWhiteboard', uiLanguage)}
            </p>
          </div>
          <div>
            <h3 className="label-lg" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
              {t('history', uiLanguage)}
            </h3>
            <p className="body-lg" style={{ opacity: 0.8, lineHeight: 1.5 }}>
              {t('helpHistory', uiLanguage)}
            </p>
          </div>
          <div>
            <h3 className="label-lg" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
              {t('number', uiLanguage)}
            </h3>
            <p className="body-lg" style={{ opacity: 0.8, lineHeight: 1.5 }}>
              {t('helpNumber', uiLanguage)}
            </p>
          </div>
          <div>
            <h3 className="label-lg" style={{ color: 'var(--primary)', marginBottom: '4px' }}>
              {t('cards', uiLanguage)}
            </h3>
            <p className="body-lg" style={{ opacity: 0.8, lineHeight: 1.5 }}>
              {t('helpCards', uiLanguage)}
            </p>
          </div>

          <hr style={{ border: 0, borderTop: '1px dashed var(--border-light)', margin: '8px 0' }} />

          <div
            style={{
              backgroundColor: 'var(--surface-container-low)',
              padding: '12px 16px',
              borderRadius: '12px'
            }}
          >
            <h4
              className="label-lg"
              style={{
                color: 'var(--neutral)',
                marginBottom: '6px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ⌨️ {t('helpHotkeysTitle', uiLanguage)}
            </h4>
            <p
              className="body-sm"
              style={{ opacity: 0.7, lineHeight: 1.6, fontSize: '12px', whiteSpace: 'pre-line' }}
            >
              {t('helpHotkeys', uiLanguage)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpModal

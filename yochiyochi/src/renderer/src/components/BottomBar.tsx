import React from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from './SettingsModal'

type BottomBarProps = {
  onDraw: () => void
  uiLanguage: UiLanguage
}

const BottomBar: React.FC<BottomBarProps> = ({ onDraw, uiLanguage }) => {
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

  return (
    <footer className="bottom-bar">
      <button className="btn-primary" style={{ flex: 1, height: '80px' }} onClick={onDraw}>
        {renderButtonText()}
      </button>
    </footer>
  )
}

export default BottomBar

import React from 'react'
import { t } from '../utils/i18n'

type TopNavProps = {
  currentPage: string
  setCurrentPage: (page: string) => void
  onOpenSettings: () => void
  onOpenHelp: () => void
  uiLanguage: 'ko' | 'en' | 'ja'
}

const TopNav: React.FC<TopNavProps> = ({ currentPage, setCurrentPage, onOpenSettings, onOpenHelp, uiLanguage }) => {
  const tabs = [
    { id: 'lessons', label: t('lessons', uiLanguage) },
    { id: 'history', label: t('history', uiLanguage) },
    { id: 'number', label: t('number', uiLanguage) },
    { id: 'cards', label: t('cards', uiLanguage) }
  ]

  return (
    <header className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <h1 className="headline-lg" style={{ fontSize: '32px', margin: 0, lineHeight: 1 }}>
          yochiyochi
        </h1>
        <nav style={{ display: 'flex', gap: '24px' }}>
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(tab.id)
              }}
              style={{
                color: currentPage === tab.id ? 'var(--primary)' : 'var(--neutral)',
                fontWeight: currentPage === tab.id ? 700 : 600,
                textDecoration: 'none',
                borderBottom: currentPage === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="pill-group">
        <button className="pill-icon-btn" onClick={onOpenHelp} title={t('help', uiLanguage)}>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </button>
        <button className="pill-icon-btn" onClick={onOpenSettings} title={t('settings', uiLanguage)}>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default TopNav

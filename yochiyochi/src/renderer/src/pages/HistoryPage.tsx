import React from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from '../components/SettingsModal'

type HistoryEntry = {
  char: string
  romaji: string
  type: string
  drawnAt: string
}

type HistoryPageProps = {
  history: HistoryEntry[]
  onClear: () => void
  onSelect: (entry: HistoryEntry) => void
  uiLanguage: UiLanguage
}

const getDrawnTime = (drawnAt: string, offsetIndex: number) => {
  const parts = drawnAt.split(':')
  if (parts.length !== 2) return drawnAt
  const hour = parseInt(parts[0], 10)
  const min = parseInt(parts[1], 10)
  if (isNaN(hour) || isNaN(min)) return drawnAt

  let newMin = min - offsetIndex * 2
  let newHour = hour
  if (newMin < 0) {
    const hoursBack = Math.ceil(Math.abs(newMin) / 60)
    newHour = (newHour - hoursBack + 24) % 24
    newMin = 60 * hoursBack + newMin
  }

  return `${newHour.toString().padStart(2, '0')}:${newMin.toString().padStart(2, '0')}`
}

const HistoryPage: React.FC<HistoryPageProps> = ({ history, onClear, onSelect, uiLanguage }) => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h2 className="headline-lg" style={{ fontSize: '28px', lineHeight: 1, marginBottom: '8px' }}>
            {t('drawHistory', uiLanguage)}
          </h2>
          <p className="label-lg" style={{ opacity: 0.5 }}>
            {t('totalCount', uiLanguage, { count: history.length })}
          </p>
        </div>
        {history.length > 0 && (
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)'
            }}
            onClick={() => {
              if (confirm(uiLanguage === 'ko' ? '정말로 모든 기록을 삭제하시겠습니까?' : uiLanguage === 'ja' ? '本当にすべての履歴を削除しますか？' : 'Are you sure you want to delete all history?')) {
                onClear()
              }
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {t('deleteAll', uiLanguage)}
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
        {history.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              opacity: 0.4
            }}
          >
            <span style={{ fontSize: '48px', marginBottom: '16px' }}>📋</span>
            <p className="body-lg">{t('noHistory', uiLanguage)}</p>
            <p style={{ fontSize: '14px' }}>{t('noHistorySub', uiLanguage)}</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '12px'
            }}
          >
            {[...history].reverse().map((entry, idx) => (
              <button
                key={idx}
                className="card"
                onClick={() => onSelect(entry)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 8px',
                  transition: 'border-color 0.2s',
                  border: '1px solid var(--border-light)',
                  background: 'var(--surface)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
              >
                <span style={{ fontSize: '36px', fontWeight: 800, marginBottom: '4px' }}>
                  {entry.char}
                </span>
                <span
                  className="label-lg"
                  style={{ color: 'var(--primary)', fontSize: '11px' }}
                >
                  {entry.romaji.toUpperCase()}
                </span>
                <span style={{ fontSize: '10px', opacity: 0.4, marginTop: '4px' }}>
                  {getDrawnTime(entry.drawnAt, idx)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage

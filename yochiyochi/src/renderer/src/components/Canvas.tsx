import React, { useState, useEffect } from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from './SettingsModal'

type CanvasProps = {
  character: { char: string; romaji: string; type: string } | null
  errorMessage: string | null
  showRomaji: boolean
  uiLanguage: UiLanguage
  historyCount: number
}

const Canvas: React.FC<CanvasProps> = ({ character, errorMessage, showRomaji, uiLanguage, historyCount }) => {
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey((prev) => prev + 1)
  }, [character])

  return (
    <main className="canvas-area">
      <div
        key={animKey}
        className="animate-float-up"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {errorMessage ? (
          <>
            <div
              className="display-xl"
              style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.3 }}
            >
              ⚠
            </div>
            <p className="body-lg" style={{ opacity: 0.6 }}>
              {t(errorMessage, uiLanguage)}
            </p>
          </>
        ) : (
          <>
            {/* 발음 표시 (Absolute 포지션 적용으로 문자가 항상 수직 정중앙에 완벽히 오도록 조절) */}
            {showRomaji && (
              <span
                style={{
                  position: 'absolute',
                  top: '-48px',
                  color: 'var(--primary)',
                  fontWeight: 800,
                  fontSize: '24px',
                  letterSpacing: '0.05em'
                }}
              >
                {character ? character.romaji.toUpperCase() : ''}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-end', transform: 'translateY(-12px)' }}>
              {character && character.char.length >= 2 ? (
                <>
                  <span className="display-xl" style={{ fontSize: '320px', lineHeight: '300px' }}>{character.char[0]}</span>
                  <span className="display-xl" style={{ fontSize: '180px', lineHeight: '300px' }}>
                    {character.char[1]}
                  </span>
                </>
              ) : (
                <span className="display-xl" style={{ fontSize: '320px', lineHeight: '300px' }}>
                  {character ? character.char : '?'}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Canvas

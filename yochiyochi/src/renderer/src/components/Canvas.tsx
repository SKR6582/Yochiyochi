import React, { useState, useEffect } from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from './SettingsModal'

type CanvasProps = {
  character: { char: string; romaji: string; type: string } | null
  errorMessage: string | null
  showRomaji: boolean
  uiLanguage: UiLanguage
  recentHistory: { char: string; romaji: string; type: string }[]
}

const Canvas: React.FC<CanvasProps> = ({ character, errorMessage, showRomaji, uiLanguage, recentHistory }) => {
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey((prev) => prev + 1)
  }, [character])

  return (
    <main className="canvas-area">
      <div
        key={animKey}
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
            {/* 발음 표시 (카드 내부 상단에 둥실 안착 - 4K 스마트보드용 32px 울트라 볼드) */}
            {showRomaji && (
              <span
                style={{
                  position: 'absolute',
                  top: '60px',
                  color: 'var(--primary)',
                  fontWeight: 900,
                  fontSize: '32px',
                  letterSpacing: '0.05em'
                }}
              >
                {character ? character.romaji.toUpperCase() : ''}
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-end', transform: 'translateY(22px)' }}>
              {character && character.char.length >= 2 ? (
                <>
                  <span className="display-xl" style={{ fontSize: '340px', lineHeight: '310px' }}>{character.char[0]}</span>
                  <span className="display-xl" style={{ fontSize: '200px', lineHeight: '310px' }}>
                    {character.char[1]}
                  </span>
                </>
              ) : (
                <span className="display-xl" style={{ fontSize: '340px', lineHeight: '310px' }}>
                  {character ? character.char : '?'}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* 최근 문자 히스토리 트레이 (최근 5개 배지) */}
      {recentHistory && recentHistory.length > 0 && (
        <div
          className="animate-float-up delay-300"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--neutral)', opacity: 0.35, marginRight: '4px', letterSpacing: '-0.02em' }}>
            RECENT
          </span>
          {recentHistory.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--surface)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '3px 3px 8px rgba(11, 28, 48, 0.02), -3px -3px 8px rgba(255, 255, 255, 0.8)',
                padding: 0,
                cursor: 'default'
              }}
              title={item.romaji.toUpperCase()}
            >
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--neutral)', lineHeight: 1 }}>
                {item.char}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 스마트 단축키 힌트 (교사용 무선 제어 가이드) */}
      <div
        className="animate-float-up delay-400"
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '32px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--neutral)',
          opacity: 0.3,
          letterSpacing: '-0.02em',
          display: 'flex',
          gap: '16px'
        }}
      >
        <span>⎵ 스페이스바 : 뽑기</span>
        <span>R : 다시 뽑기</span>
      </div>
    </main>
  )
}

export default Canvas

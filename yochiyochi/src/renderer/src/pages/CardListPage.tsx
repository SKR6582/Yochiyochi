import React, { useState } from 'react'
import { t } from '../utils/i18n'
import { UiLanguage } from '../components/SettingsModal'

type CharacterEntry = {
  char: string
  romaji: string
  type: string
}

type CardListPageProps = {
  onSelect: (entry: CharacterEntry) => void
  uiLanguage: UiLanguage
}

// Character data (duplicated from backend for frontend display)
const seion = [
  { char: 'あ', romaji: 'a' },
  { char: 'い', romaji: 'i' },
  { char: 'う', romaji: 'u' },
  { char: 'え', romaji: 'e' },
  { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' },
  { char: 'き', romaji: 'ki' },
  { char: 'く', romaji: 'ku' },
  { char: 'け', romaji: 'ke' },
  { char: 'こ', romaji: 'ko' },
  { char: 'さ', romaji: 'sa' },
  { char: 'し', romaji: 'shi' },
  { char: 'す', romaji: 'su' },
  { char: 'せ', romaji: 'se' },
  { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' },
  { char: 'ち', romaji: 'chi' },
  { char: 'つ', romaji: 'tsu' },
  { char: 'て', romaji: 'te' },
  { char: 'と', romaji: 'to' },
  { char: 'な', romaji: 'na' },
  { char: 'に', romaji: 'ni' },
  { char: 'ぬ', romaji: 'nu' },
  { char: 'ね', romaji: 'ne' },
  { char: 'の', romaji: 'no' },
  { char: 'は', romaji: 'ha' },
  { char: 'ひ', romaji: 'hi' },
  { char: 'ふ', romaji: 'fu' },
  { char: 'へ', romaji: 'he' },
  { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' },
  { char: 'み', romaji: 'mi' },
  { char: 'む', romaji: 'mu' },
  { char: 'め', romaji: 'me' },
  { char: 'も', romaji: 'mo' },
  { char: 'や', romaji: 'ya' },
  { char: 'ゆ', romaji: 'yu' },
  { char: 'よ', romaji: 'yo' },
  { char: 'ら', romaji: 'ra' },
  { char: 'り', romaji: 'ri' },
  { char: 'る', romaji: 'ru' },
  { char: 'れ', romaji: 're' },
  { char: 'ろ', romaji: 'ro' },
  { char: 'わ', romaji: 'wa' },
  { char: 'を', romaji: 'wo' },
  { char: 'ん', romaji: 'n' }
]

const dakuon = [
  { char: 'が', romaji: 'ga' },
  { char: 'ぎ', romaji: 'gi' },
  { char: 'ぐ', romaji: 'gu' },
  { char: 'げ', romaji: 'ge' },
  { char: 'ご', romaji: 'go' },
  { char: 'ざ', romaji: 'za' },
  { char: 'じ', romaji: 'ji' },
  { char: 'ず', romaji: 'zu' },
  { char: 'ぜ', romaji: 'ze' },
  { char: 'ぞ', romaji: 'zo' },
  { char: 'だ', romaji: 'da' },
  { char: 'ぢ', romaji: 'di' },
  { char: 'づ', romaji: 'du' },
  { char: 'で', romaji: 'de' },
  { char: 'ど', romaji: 'do' },
  { char: 'ば', romaji: 'ba' },
  { char: 'び', romaji: 'bi' },
  { char: 'ぶ', romaji: 'bu' },
  { char: 'べ', romaji: 'be' },
  { char: 'ぼ', romaji: 'bo' }
]

const handakuon = [
  { char: 'ぱ', romaji: 'pa' },
  { char: 'ぴ', romaji: 'pi' },
  { char: 'ぷ', romaji: 'pu' },
  { char: 'ぺ', romaji: 'pe' },
  { char: 'ぽ', romaji: 'po' }
]

const yoon = [
  { char: 'きゃ', romaji: 'kya' },
  { char: 'きゅ', romaji: 'kyu' },
  { char: 'きょ', romaji: 'kyo' },
  { char: 'しゃ', romaji: 'sha' },
  { char: 'しゅ', romaji: 'shu' },
  { char: 'しょ', romaji: 'sho' },
  { char: 'ちゃ', romaji: 'cha' },
  { char: 'ちゅ', romaji: 'chu' },
  { char: 'ちょ', romaji: 'cho' },
  { char: 'にゃ', romaji: 'nya' },
  { char: 'にゅ', romaji: 'nyu' },
  { char: 'にょ', romaji: 'nyo' },
  { char: 'ひゃ', romaji: 'hya' },
  { char: 'ひゅ', romaji: 'hyu' },
  { char: 'ひょ', romaji: 'hyo' },
  { char: 'みゃ', romaji: 'mya' },
  { char: 'みゅ', romaji: 'myu' },
  { char: 'みょ', romaji: 'myo' },
  { char: 'りゃ', romaji: 'rya' },
  { char: 'りゅ', romaji: 'ryu' },
  { char: 'りょ', romaji: 'ryo' },
  { char: 'ぎゃ', romaji: 'gya' },
  { char: 'ぎゅ', romaji: 'gyu' },
  { char: 'ぎょ', romaji: 'gyo' },
  { char: 'じゃ', romaji: 'ja' },
  { char: 'じゅ', romaji: 'ju' },
  { char: 'じょ', romaji: 'jo' },
  { char: 'びゃ', romaji: 'bya' },
  { char: 'びゅ', romaji: 'byu' },
  { char: 'びょ', romaji: 'byo' },
  { char: 'ぴゃ', romaji: 'pya' },
  { char: 'ぴゅ', romaji: 'pyu' },
  { char: 'ぴょ', romaji: 'pyo' }
]

const getSections = (uiLanguage: UiLanguage) => [
  { title: t('seion', uiLanguage), data: seion, type: 'seion' },
  { title: t('dakuon', uiLanguage), data: dakuon, type: 'dakuon' },
  { title: t('handakuon', uiLanguage), data: handakuon, type: 'handakuon' },
  { title: t('yoon', uiLanguage), data: yoon, type: 'yoon' }
]

function toKatakana(hira: string): string {
  return Array.from(hira)
    .map((c) => {
      const code = c.charCodeAt(0)
      if (code >= 0x3041 && code <= 0x3096) {
        return String.fromCharCode(code + 0x60)
      }
      return c
    })
    .join('')
}

const CardListPage: React.FC<CardListPageProps> = ({ onSelect, uiLanguage }) => {
  const [selected, setSelected] = useState<CharacterEntry | null>(null)
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana'>('hiragana')
  const sections = getSections(uiLanguage)

  const handleCardClick = (entry: { char: string; romaji: string; type: string }) => {
    setSelected(entry) // Store the original Hiragana entry
    const displayChar = scriptType === 'katakana' ? toKatakana(entry.char) : entry.char
    onSelect({ ...entry, char: displayChar })
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      {/* Card Grid */}
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
        {/* Kana Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '16px'
          }}
        >
          <button
            onClick={() => setScriptType('hiragana')}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background:
                scriptType === 'hiragana'
                  ? 'var(--primary)'
                  : 'var(--surface-container-high, #ecedf7)',
              color: scriptType === 'hiragana' ? '#fff' : 'var(--neutral)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {t('hiragana', uiLanguage)}
          </button>
          <button
            onClick={() => setScriptType('katakana')}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background:
                scriptType === 'katakana'
                  ? 'var(--primary)'
                  : 'var(--surface-container-high, #ecedf7)',
              color: scriptType === 'katakana' ? '#fff' : 'var(--neutral)',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {t('katakana', uiLanguage)}
          </button>
        </div>

        {sections.map((section, sIdx) => (
          <div
            key={section.type}
            className="animate-float-up"
            style={{
              marginBottom: '32px',
              animationDelay: `${sIdx * 50 + 50}ms`
            }}
          >
            <h3 className="label-lg" style={{ marginBottom: '12px' }}>
              {section.title}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                gap: '8px'
              }}
            >
              {section.data.map((entry, idx) => {
                const isSelected = selected?.char === entry.char
                const displayChar = scriptType === 'katakana' ? toKatakana(entry.char) : entry.char
                return (
                  <button
                    key={idx}
                    onClick={() => handleCardClick({ ...entry, type: section.type })}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 4px',
                      background: isSelected ? 'var(--primary)' : 'var(--surface)',
                      color: isSelected ? '#fff' : 'var(--neutral)',
                      border: isSelected
                        ? '2px solid var(--primary)'
                        : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'var(--font-family)',
                      borderRadius: 0
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = 'var(--primary)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-light)'
                    }}
                  >
                    <span
                      style={{
                        fontSize: displayChar.length >= 2 ? '18px' : '24px',
                        fontWeight: 800,
                        marginBottom: '2px'
                      }}
                    >
                      {displayChar}
                    </span>
                    <span style={{ fontSize: '10px', opacity: isSelected ? 0.8 : 0.5 }}>
                      {entry.romaji}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Panel */}
      {selected && (
        <div
          className="animate-float-up delay-200"
          style={{
            width: '320px',
            borderLeft: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--background)',
            padding: '40px'
          }}
        >
          <span
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '18px',
              marginBottom: '16px'
            }}
          >
            {selected.romaji.toUpperCase()}
          </span>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '24px' }}>
            {selected.char.length >= 2 ? (
              <>
                <span style={{ fontSize: '540px', fontWeight: 800, lineHeight: 1 }}>
                  {scriptType === 'katakana' ? toKatakana(selected.char[0]) : selected.char[0]}
                </span>
                <span style={{ fontSize: '460px', fontWeight: 800, lineHeight: '240px' }}>
                  {scriptType === 'katakana' ? toKatakana(selected.char[1]) : selected.char[1]}
                </span>
              </>
            ) : (
              <span style={{ fontSize: '540px', fontWeight: 800, lineHeight: 1 }}>
                {scriptType === 'katakana' ? toKatakana(selected.char) : selected.char}
              </span>
            )}
          </div>
          <span className="label-lg" style={{ opacity: 0.4 }}>
            {selected.type.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}

export default CardListPage

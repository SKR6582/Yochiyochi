import React, { useState, useCallback, useEffect } from 'react'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import BottomBar from './components/BottomBar'
import HistoryPage from './pages/HistoryPage'
import NumberDrawPage from './pages/NumberDrawPage'
import CardListPage from './pages/CardListPage'
import { UiLanguage } from './components/SettingsModal'
import SettingsPage from './pages/SettingsPage'
import WhiteboardPage from './pages/WhiteboardPage'
import HelpModal from './components/HelpModal'

type CharacterEntry = {
  char: string
  romaji: string
  type: string
}

type HistoryEntry = CharacterEntry & {
  drawnAt: string
}

function App(): React.JSX.Element {
  const isSettingsWindow =
    window.location.hash.includes('settings') || window.location.search.includes('settings')

  if (isSettingsWindow) {
    return <SettingsPage />
  }

  const [currentPage, setCurrentPage] = useState('lessons')
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [uiLanguage, setUiLanguage] = useState<UiLanguage>('ko')
  const [numberDrawHistory, setNumberDrawHistory] = useState<
    Record<string, Record<number, number>>
  >({})
  const [themeColor, setThemeColor] = useState<string>('#006c49')
  const [isConfigLoaded, setIsConfigLoaded] = useState(false)

  // ── 문자 종류 ──
  const [scriptType, setScriptType] = useState<'hiragana' | 'katakana' | 'mixed'>('hiragana')

  // ── 학습 범위 ──
  const [useSeion, setUseSeion] = useState(true)
  const [useDakuon, setUseDakuon] = useState(false)
  const [useHandakuon, setUseHandakuon] = useState(false)
  const [useYoon, setUseYoon] = useState(false)
  const [preventDuplicates, setPreventDuplicates] = useState(false)

  // ── 표시 옵션 ──
  const [showRomaji, setShowRomaji] = useState(true)

  // Load config on mount
  useEffect(() => {
    window.api.loadConfig().then((config) => {
      if (config.uiLanguage) setUiLanguage(config.uiLanguage)
      if (config.scriptType) setScriptType(config.scriptType)
      if (typeof config.useSeion === 'boolean') setUseSeion(config.useSeion)
      if (typeof config.useDakuon === 'boolean') setUseDakuon(config.useDakuon)
      if (typeof config.useHandakuon === 'boolean') setUseHandakuon(config.useHandakuon)
      if (typeof config.useYoon === 'boolean') setUseYoon(config.useYoon)
      if (typeof config.preventDuplicates === 'boolean')
        setPreventDuplicates(config.preventDuplicates)
      if (typeof config.showRomaji === 'boolean') setShowRomaji(config.showRomaji)
      if (config.themeColor) {
        setThemeColor(config.themeColor)
        document.documentElement.style.setProperty('--primary', config.themeColor)
        document.documentElement.style.setProperty(
          '--primary-container',
          config.themeColorContainer || config.themeColor
        )
      }
      setIsConfigLoaded(true)
    })
  }, [])

  // Listen for config updates from other windows
  useEffect(() => {
    const removeListener = window.api.onConfigUpdated((newConfig) => {
      if (newConfig.uiLanguage) setUiLanguage(newConfig.uiLanguage)
      if (newConfig.themeColor) {
        setThemeColor(newConfig.themeColor)
        document.documentElement.style.setProperty('--primary', newConfig.themeColor)
        document.documentElement.style.setProperty(
          '--primary-container',
          newConfig.themeColorContainer || newConfig.themeColor
        )
      }
    })
    return () => removeListener()
  }, [])

  // Save config on change
  useEffect(() => {
    if (!isConfigLoaded) return
    window.api.saveConfig({
      uiLanguage,
      scriptType,
      useSeion,
      useDakuon,
      useHandakuon,
      useYoon,
      preventDuplicates,
      showRomaji
    })
  }, [
    isConfigLoaded,
    uiLanguage,
    scriptType,
    useSeion,
    useDakuon,
    useHandakuon,
    useYoon,
    preventDuplicates,
    showRomaji
  ])

  // ── 현재 글자 ──
  const [character, setCharacter] = useState<CharacterEntry | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ── 기록 ──
  const [history, setHistory] = useState<HistoryEntry[]>([])

  const handleDraw = useCallback(async () => {
    const options = {
      useSeion,
      useDakuon,
      useHandakuon,
      useYoon,
      preventDuplicates,
      scriptType
    }

    const result = await window.api.drawCharacter(options)

    if (result.error) {
      setErrorMessage(result.error)
      setCharacter(null)
    } else {
      setErrorMessage(null)
      setCharacter(result)

      // 기록에 추가
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      setHistory((prev) => [
        ...prev,
        {
          char: result.char,
          romaji: result.romaji,
          type: result.type,
          drawnAt: timeStr
        }
      ])
    }
  }, [useSeion, useDakuon, useHandakuon, useYoon, preventDuplicates, scriptType])

  // 토글 변경 시 자동으로 새 글자 뽑기
  useEffect(() => {
    if (!isConfigLoaded) return
    handleDraw()
  }, [isConfigLoaded, handleDraw])

  // ── 스마트 단축키 리스너 (교사용 무선 핫키) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        handleDraw()
      }
      if (e.key === 'r' || e.key === 'R') {
        handleDraw()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleDraw])

  // 기록에서 글자 선택 → Lessons 탭으로 이동하여 표시
  const handleSelectFromHistory = (entry: { char: string; romaji: string; type: string }) => {
    setCharacter(entry)
    setErrorMessage(null)
    setCurrentPage('lessons')
  }

  // 카드에서 글자 선택 → Lessons 탭으로 이동하여 표시
  const handleSelectFromCard = (entry: CharacterEntry) => {
    setCharacter(entry)
    setErrorMessage(null)
    setCurrentPage('lessons')
  }

  return (
    <>
      <TopNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenSettings={() => window.api.openSettingsWindow()}
        onOpenHelp={() => setIsHelpOpen(true)}
        uiLanguage={uiLanguage}
      />

      {currentPage === 'lessons' && (
        <>
          <div className="app-container">
            <Canvas
              character={character}
              errorMessage={errorMessage}
              showRomaji={showRomaji}
              uiLanguage={uiLanguage}
              recentHistory={history.slice(-5).reverse()}
            />
            <Sidebar
              uiLanguage={uiLanguage}
              scriptType={scriptType}
              setScriptType={setScriptType}
              useSeion={useSeion}
              setUseSeion={setUseSeion}
              useDakuon={useDakuon}
              setUseDakuon={setUseDakuon}
              useHandakuon={useHandakuon}
              setUseHandakuon={setUseHandakuon}
              useYoon={useYoon}
              setUseYoon={setUseYoon}
              preventDuplicates={preventDuplicates}
              setPreventDuplicates={setPreventDuplicates}
              showRomaji={showRomaji}
              setShowRomaji={setShowRomaji}
            />
          </div>
          <BottomBar onDraw={handleDraw} uiLanguage={uiLanguage} />
        </>
      )}

      {currentPage === 'history' && (
        <HistoryPage
          history={history}
          onClear={() => setHistory([])}
          onSelect={handleSelectFromHistory}
          uiLanguage={uiLanguage}
        />
      )}

      {currentPage === 'number' && (
        <NumberDrawPage
          uiLanguage={uiLanguage}
          drawHistory={numberDrawHistory}
          setDrawHistory={setNumberDrawHistory}
        />
      )}

      {currentPage === 'cards' && (
        <CardListPage onSelect={handleSelectFromCard} uiLanguage={uiLanguage} />
      )}

      <div
        style={{
          display: currentPage === 'whiteboard' ? 'flex' : 'none',
          flex: 1,
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <WhiteboardPage
          uiLanguage={uiLanguage}
          themeColor={themeColor}
          isActive={currentPage === 'whiteboard'}
        />
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} uiLanguage={uiLanguage} />
    </>
  )
}

export default App

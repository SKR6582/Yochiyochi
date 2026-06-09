import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { seion, dakuon, handakuon, yoon } from './characters'
import { loadConfig, saveConfig } from './store'

// ── 중복 방지 히스토리 ──
let drawHistory: string[] = []
let settingsWindow: BrowserWindow | null = null

function toKatakana(hira: string): string {
  return Array.from(hira)
    .map((c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
    .join('')
}

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1100,
    height: 750,
    show: false,
    autoHideMenuBar: true,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.yochiyochi')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ── IPC API: draw-character ──
  ipcMain.handle('draw-character', (_event, options) => {
    const { useSeion, useDakuon, useHandakuon, useYoon, preventDuplicates, scriptType } = options

    // Helper to add variants based on scriptType
    const addChars = (source: { char: string; romaji: string }[], typeName: string) => {
      source.forEach((c) => {
        if (scriptType === 'hiragana' || scriptType === 'mixed') {
          pool.push({ ...c, type: typeName })
        }
        if (scriptType === 'katakana' || scriptType === 'mixed') {
          pool.push({ char: toKatakana(c.char), romaji: c.romaji, type: typeName })
        }
      })
    }

    // Build pool from enabled categories
    let pool: { char: string; romaji: string; type: string }[] = []

    if (useSeion) addChars(seion, 'seion')
    if (useDakuon) addChars(dakuon, 'dakuon')
    if (useHandakuon) addChars(handakuon, 'handakuon')
    if (useYoon) addChars(yoon, 'yoon')

    if (pool.length === 0) {
      return { error: 'NO_SELECTION', message: '학습 범위를 하나 이상 켜주세요.' }
    }

    // 중복 방지: filter out already-drawn characters
    if (preventDuplicates) {
      const filtered = pool.filter((c) => !drawHistory.includes(c.char))
      if (filtered.length === 0) {
        // All characters have been drawn — reset history
        drawHistory = []
        // Use full pool after reset
      } else {
        pool = filtered
      }
    }

    // Random pick
    const randomItem = pool[Math.floor(Math.random() * pool.length)]

    // Track history for duplicate prevention
    if (preventDuplicates) {
      drawHistory.push(randomItem.char)
    }

    return { ...randomItem, error: null }
  })

  // ── IPC API: reset-history ──
  ipcMain.handle('reset-history', () => {
    drawHistory = []
    return { success: true }
  })

  // ── IPC API: config ──
  ipcMain.handle('load-config', () => {
    return loadConfig()
  })

  ipcMain.handle('save-config', (_event, config) => {
    saveConfig(config)
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('config-updated', config)
    })
    return { success: true }
  })

  ipcMain.on('open-settings-window', () => {
    if (settingsWindow) {
      if (settingsWindow.isMinimized()) settingsWindow.restore()
      settingsWindow.focus()
      return
    }

    settingsWindow = new BrowserWindow({
      width: 480,
      height: 520,
      resizable: false,
      show: false,
      autoHideMenuBar: true,
      icon,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    settingsWindow.on('ready-to-show', () => {
      settingsWindow?.show()
    })

    settingsWindow.on('closed', () => {
      settingsWindow = null
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      settingsWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#/settings')
    } else {
      settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), { hash: 'settings' })
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

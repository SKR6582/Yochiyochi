import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

const getConfigPath = () => path.join(app.getPath('userData'), 'config.json')

const DEFAULT_CONFIG = {
  uiLanguage: 'ko',
  scriptType: 'hiragana',
  useSeion: true,
  useDakuon: false,
  useHandakuon: false,
  useYoon: false,
  preventDuplicates: false,
  showRomaji: true,
  showExample: true,
  presets: [
    { name: '1반', min: '1', max: '30', excluded: '' },
    { name: '2반', min: '1', max: '28', excluded: '' },
    { name: '3반', min: '1', max: '32', excluded: '' }
  ]
}

export function loadConfig() {
  try {
    const configPath = getConfigPath()
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8')
      const parsed = JSON.parse(data)
      return { ...DEFAULT_CONFIG, ...parsed }
    }
  } catch (err) {
    console.error('Failed to load config:', err)
  }
  return DEFAULT_CONFIG
}

export function saveConfig(newConfig: any) {
  try {
    const configPath = getConfigPath()
    let currentConfig = DEFAULT_CONFIG
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8')
      currentConfig = JSON.parse(data)
    }
    const merged = { ...currentConfig, ...newConfig }
    fs.writeFileSync(configPath, JSON.stringify(merged, null, 2), 'utf8')
  } catch (err) {
    console.error('Failed to save config:', err)
  }
}

import { ElectronAPI } from '@electron-toolkit/preload'

export type CharacterEntry = {
  char: string
  romaji: string
  type: string
}

export type DrawResult =
  | (CharacterEntry & { error: null })
  | { error: 'NO_SELECTION' | 'EMPTY_POOL'; message: string }

export type DrawOptions = {
  useSeion: boolean
  useDakuon: boolean
  useHandakuon: boolean
  useYoon: boolean
  preventDuplicates: boolean
  scriptType: 'hiragana' | 'katakana' | 'mixed'
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      drawCharacter: (
        options: DrawOptions
      ) => Promise<{ char: string; romaji: string; type: string; error: string | null; message?: string }>
      resetHistory: () => Promise<{ success: boolean }>
      loadConfig: () => Promise<any>
      saveConfig: (config: any) => Promise<{ success: boolean }>
      openSettingsWindow: () => void
      onConfigUpdated: (callback: (config: any) => void) => () => void
    }
  }
}

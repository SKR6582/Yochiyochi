import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  drawCharacter: (options): Promise<unknown> => ipcRenderer.invoke('draw-character', options),
  resetHistory: (): Promise<unknown> => ipcRenderer.invoke('reset-history'),
  loadConfig: (): Promise<unknown> => ipcRenderer.invoke('load-config'),
  saveConfig: (config): Promise<unknown> => ipcRenderer.invoke('save-config', config),
  openSettingsWindow: (): void => ipcRenderer.send('open-settings-window'),
  onConfigUpdated: (callback: (config: any) => void): (() => void) => {
    const listener = (_event: any, config: any) => callback(config)
    ipcRenderer.on('config-updated', listener)
    return () => {
      ipcRenderer.off('config-updated', listener)
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

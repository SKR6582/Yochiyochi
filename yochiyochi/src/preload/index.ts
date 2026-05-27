import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  drawCharacter: (options): Promise<unknown> => ipcRenderer.invoke('draw-character', options),
  resetHistory: (): Promise<unknown> => ipcRenderer.invoke('reset-history'),
  loadConfig: (): Promise<unknown> => ipcRenderer.invoke('load-config'),
  saveConfig: (config): Promise<unknown> => ipcRenderer.invoke('save-config', config)
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

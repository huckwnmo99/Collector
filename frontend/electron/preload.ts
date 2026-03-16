import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
  openUrls: (urls: string[]) => ipcRenderer.invoke('open-urls', urls),
});

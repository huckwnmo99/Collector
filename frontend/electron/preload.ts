import { contextBridge, ipcRenderer } from 'electron';

const onChannel = (channel: string, callback: (...args: any[]) => void) => {
  ipcRenderer.on(channel, callback);
};

const removeChannelListeners = (channel: string) => {
  ipcRenderer.removeAllListeners(channel);
};

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
  openUrls: (urls: string[]) => ipcRenderer.invoke('open-urls', urls),
  openPath: (targetPath: string) => ipcRenderer.send('open-path', targetPath),
  openWidget: (category: { categoryId: string; categoryName: string; categoryColor: string }) =>
    ipcRenderer.invoke('open-widget', category),
  sendToggleWidget: () => ipcRenderer.send('widget:toggle'),
  closeWidgetSelf: () => ipcRenderer.send('widget:close-self'),
  removeCategory: (categoryId: string) => ipcRenderer.send('widget:remove-category', categoryId),
  detachCategory: (data: { categoryId: string; categoryName: string; categoryColor: string }) =>
    ipcRenderer.send('widget:detach-category', data),
  onSetCategory: (callback: (...args: any[]) => void) => onChannel('widget:set-category', callback),
  onAddCategories: (callback: (...args: any[]) => void) => onChannel('widget:add-categories', callback),
  onSwitchCategory: (callback: (...args: any[]) => void) => onChannel('widget:switch-category', callback),
  onMergePreview: (callback: (...args: any[]) => void) => onChannel('widget:merge-preview', callback),
  onMergeAnimate: (callback: (...args: any[]) => void) => onChannel('widget:merge-animate', callback),
  removeSetCategoryListener: () => removeChannelListeners('widget:set-category'),
  removeAddCategoriesListener: () => removeChannelListeners('widget:add-categories'),
  removeSwitchCategoryListener: () => removeChannelListeners('widget:switch-category'),
  removeMergePreviewListener: () => removeChannelListeners('widget:merge-preview'),
  removeMergeAnimateListener: () => removeChannelListeners('widget:merge-animate'),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ElectronAPI {
  platform: string;
  version: string;
  openUrls?: (urls: string[]) => Promise<void>;
  openPath?: (path: string) => void;
  sendToggleWidget?: () => void;
  closeWidgetSelf?: () => void;
  removeCategory?: (categoryId: string) => void;
  detachCategory?: (data: { categoryId: string; categoryName: string; categoryColor: string }) => void;
  onSetCategory: (callback: (...args: any[]) => void) => void;
  onAddCategories: (callback: (...args: any[]) => void) => void;
  onSwitchCategory: (callback: (...args: any[]) => void) => void;
  onMergePreview: (callback: (...args: any[]) => void) => void;
  onMergeAnimate: (callback: (...args: any[]) => void) => void;
  removeSetCategoryListener: () => void;
  removeAddCategoriesListener: () => void;
  removeSwitchCategoryListener: () => void;
  removeMergePreviewListener: () => void;
  removeMergeAnimateListener: () => void;
}

interface Window {
  electronAPI?: ElectronAPI;
}

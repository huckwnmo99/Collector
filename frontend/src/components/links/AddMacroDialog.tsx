'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Category, Link, MacroItemInput } from '@/types';

interface MacroItemEntry {
  tempId: string;
  type: 'link' | 'custom';
  link_id?: string;
  link_title?: string;
  link_favicon?: string;
  custom_url?: string;
  custom_title?: string;
}

interface AddMacroDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    categoryId: string | undefined,
    macroItems: MacroItemInput[]
  ) => Promise<void>;
  categories: Category[];
  selectedCategoryId: string | null;
  allLinks: Link[];
  editingMacro?: Link | null;
}

export function AddMacroDialog({
  isOpen,
  onClose,
  onSubmit,
  categories,
  selectedCategoryId,
  allLinks,
  editingMacro,
}: AddMacroDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(selectedCategoryId || '');
  const [items, setItems] = useState<MacroItemEntry[]>([]);
  const [showLinkPicker, setShowLinkPicker] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [linkSearchQuery, setLinkSearchQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  // Only show normal links (not macros) in picker
  const availableLinks = useMemo(
    () => allLinks.filter((l) => l.type !== 'macro'),
    [allLinks]
  );

  const filteredAvailableLinks = useMemo(() => {
    if (!linkSearchQuery) return availableLinks;
    const q = linkSearchQuery.toLowerCase();
    return availableLinks.filter(
      (l) =>
        l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q)
    );
  }, [availableLinks, linkSearchQuery]);

  useEffect(() => {
    if (editingMacro) {
      setTitle(editingMacro.title);
      setCategoryId(editingMacro.category_id || '');
      // Convert existing macro_items to entries
      const entries: MacroItemEntry[] = (editingMacro.macro_items || []).map(
        (item, idx) => {
          if (item.link_id) {
            return {
              tempId: `existing-${idx}`,
              type: 'link' as const,
              link_id: item.link_id,
              link_title: item.resolved_title || 'Unknown link',
              link_favicon: item.resolved_favicon || undefined,
            };
          }
          return {
            tempId: `existing-${idx}`,
            type: 'custom' as const,
            custom_url: item.custom_url || item.resolved_url || '',
            custom_title: item.custom_title || item.resolved_title || '',
          };
        }
      );
      setItems(entries);
    } else {
      setTitle('');
      setCategoryId(selectedCategoryId || '');
      setItems([]);
    }
    setShowLinkPicker(false);
    setShowUrlInput(false);
    setLinkSearchQuery('');
    setCustomUrl('');
    setCustomTitle('');
  }, [editingMacro, selectedCategoryId, isOpen]);

  const handleAddLink = (link: Link) => {
    setItems((prev) => [
      ...prev,
      {
        tempId: `link-${Date.now()}`,
        type: 'link',
        link_id: link.id,
        link_title: link.title,
        link_favicon: link.favicon || undefined,
      },
    ]);
    setShowLinkPicker(false);
    setLinkSearchQuery('');
  };

  const handleAddCustomUrl = () => {
    if (!customUrl.trim()) return;
    let finalTitle = customTitle.trim();
    if (!finalTitle) {
      try {
        finalTitle = new URL(customUrl).hostname.replace('www.', '');
      } catch {
        finalTitle = customUrl;
      }
    }
    setItems((prev) => [
      ...prev,
      {
        tempId: `custom-${Date.now()}`,
        type: 'custom',
        custom_url: customUrl.trim(),
        custom_title: finalTitle,
      },
    ]);
    setCustomUrl('');
    setCustomTitle('');
    setShowUrlInput(false);
  };

  const handleRemoveItem = (tempId: string) => {
    setItems((prev) => prev.filter((item) => item.tempId !== tempId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || items.length === 0) return;

    setIsLoading(true);
    try {
      const macroItems: MacroItemInput[] = items.map((item, index) => {
        if (item.type === 'link') {
          return { link_id: item.link_id, order_index: index };
        }
        return {
          custom_url: item.custom_url,
          custom_title: item.custom_title,
          order_index: index,
        };
      });

      await onSubmit(title.trim(), categoryId || undefined, macroItems);
      onClose();
    } catch (error) {
      console.error('Failed to save macro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">
            {editingMacro ? 'Edit Macro' : 'Add New Macro'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Morning Routine"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-11"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-11 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Items list */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Sites <span className="text-destructive">*</span>
              <span className="text-muted-foreground text-xs ml-1">
                ({items.length} added)
              </span>
            </Label>

            {items.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.tempId}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/30"
                  >
                    {/* Favicon or globe */}
                    <div className="w-6 h-6 rounded bg-background flex items-center justify-center overflow-hidden shrink-0">
                      {item.type === 'link' && item.link_favicon ? (
                        <img
                          src={item.link_favicon}
                          alt=""
                          className="w-4 h-4 object-contain"
                        />
                      ) : item.type === 'custom' && item.custom_url ? (
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(item.custom_url).hostname; } catch { return ''; } })()}&sz=32`}
                          alt=""
                          className="w-4 h-4 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <svg
                          className="w-3.5 h-3.5 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">
                        {item.type === 'link'
                          ? item.link_title
                          : item.custom_title || item.custom_url}
                      </p>
                      {item.type === 'link' && (
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          saved link
                        </span>
                      )}
                    </div>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.tempId)}
                      className="shrink-0 w-6 h-6 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                Add sites to open with one click
              </p>
            )}

            {/* Add buttons */}
            {!showLinkPicker && !showUrlInput && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLinkPicker(true)}
                  className="flex-1 gap-1.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                    />
                  </svg>
                  From saved links
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUrlInput(true)}
                  className="flex-1 gap-1.5"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Enter URL
                </Button>
              </div>
            )}

            {/* Link picker */}
            {showLinkPicker && (
              <div className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Select a link</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkPicker(false);
                      setLinkSearchQuery('');
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <Input
                  type="search"
                  placeholder="Search links..."
                  value={linkSearchQuery}
                  onChange={(e) => setLinkSearchQuery(e.target.value)}
                  className="h-9"
                  autoFocus
                />
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredAvailableLinks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No links found
                    </p>
                  ) : (
                    filteredAvailableLinks.map((link) => (
                      <button
                        key={link.id}
                        type="button"
                        onClick={() => handleAddLink(link)}
                        className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors text-left"
                      >
                        {link.favicon ? (
                          <img
                            src={link.favicon}
                            alt=""
                            className="w-4 h-4 object-contain shrink-0"
                          />
                        ) : (
                          <svg
                            className="w-4 h-4 text-muted-foreground shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3"
                            />
                          </svg>
                        )}
                        <span className="text-sm truncate">{link.title}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Custom URL input */}
            {showUrlInput && (
              <div className="border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enter URL</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlInput(false);
                      setCustomUrl('');
                      setCustomTitle('');
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="h-9"
                  autoFocus
                />
                <Input
                  placeholder="Title (optional)"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="h-9"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddCustomUrl}
                  disabled={!customUrl.trim()}
                  className="w-full"
                >
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || items.length === 0 || !title.trim()}
              className="flex-1 h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : editingMacro ? (
                'Save Changes'
              ) : (
                'Create Macro'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

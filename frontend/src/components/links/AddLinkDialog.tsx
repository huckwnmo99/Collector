'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Category, Link } from '@/types';

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, url: string, categoryId?: string, memo?: string) => Promise<void>;
  categories: Category[];
  selectedCategoryId: string | null;
  editingLink?: Link | null;
}

export function AddLinkDialog({
  isOpen,
  onClose,
  onSubmit,
  categories,
  selectedCategoryId,
  editingLink,
}: AddLinkDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    categoryId: selectedCategoryId || '',
    memo: '',
  });

  useEffect(() => {
    if (editingLink) {
      setFormData({
        title: editingLink.title,
        url: editingLink.url,
        categoryId: editingLink.category_id || '',
        memo: editingLink.memo || '',
      });
    } else {
      setFormData({
        title: '',
        url: '',
        categoryId: selectedCategoryId || '',
        memo: '',
      });
    }
  }, [editingLink, selectedCategoryId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.url.trim()) return;

    setIsLoading(true);
    try {
      // Auto-generate title from URL if not provided
      let title = formData.title.trim();
      if (!title) {
        try {
          title = new URL(formData.url).hostname.replace('www.', '');
        } catch {
          title = formData.url;
        }
      }

      await onSubmit(title, formData.url, formData.categoryId || undefined, formData.memo);
      setFormData({ title: '', url: '', categoryId: selectedCategoryId || '', memo: '' });
      onClose();
    } catch (error) {
      console.error('Failed to add link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">
            {editingLink ? 'Edit Link' : 'Add New Link'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Title <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              placeholder="Auto-generated from URL if empty"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Category
            </Label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Memo <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <textarea
              placeholder="Add a note about this link..."
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
            />
          </div>

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
              disabled={isLoading}
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
              ) : editingLink ? (
                'Save Changes'
              ) : (
                'Add Link'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

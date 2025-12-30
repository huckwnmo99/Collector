'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { OptionsDialog } from './OptionsDialog';
import { Category } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface SidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onCreateCategory: (name: string, color: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onReorderCategories?: (categoryIds: string[]) => Promise<void>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const colorOptions = [
  '#007AFF', // blue (macOS primary)
  '#34c759', // green
  '#ff3b30', // red
  '#af52de', // purple
  '#ff9500', // orange
  '#ff2d55', // pink
  '#5ac8fa', // cyan
  '#8e8e93', // gray
];

// Sortable Category Item Component
interface SortableCategoryProps {
  category: Category;
  isSelected: boolean;
  isCollapsed: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function SortableCategory({ category, isSelected, isCollapsed, onSelect, onDelete }: SortableCategoryProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <Button
        variant={isSelected ? 'secondary' : 'ghost'}
        onClick={onSelect}
        className={`
          w-full justify-start gap-3 h-10 pr-8
          ${isSelected
            ? 'bg-sidebar-accent text-sidebar-foreground'
            : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
          }
          ${isCollapsed ? 'justify-center px-2' : ''}
        `}
      >
        {/* Drag handle */}
        {!isCollapsed && (
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-sidebar-foreground/30 hover:text-sidebar-foreground/60"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            </svg>
          </span>
        )}
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
        {!isCollapsed && (
          <span className="text-sm truncate">{category.name}</span>
        )}
      </Button>
      {!isCollapsed && (
        <button
          onClick={onDelete}
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-destructive"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export function Sidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onCreateCategory,
  onDeleteCategory,
  onReorderCategories,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: colorOptions[0] });
  const [isCreating, setIsCreating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(categories, oldIndex, newIndex);

      if (onReorderCategories) {
        try {
          await onReorderCategories(newOrder.map((c) => c.id));
        } catch (error) {
          toast.error('Failed to reorder categories');
        }
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    setIsCreating(true);
    try {
      await onCreateCategory(newCategory.name, newCategory.color);
      setNewCategory({ name: '', color: colorOptions[0] });
      setIsOpen(false);
      toast.success('Category created!');
    } catch (error) {
      toast.error('Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border
        transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <span className="text-sidebar-foreground text-base font-semibold">
                Web Collector
              </span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="text-sidebar-foreground hover:bg-sidebar-accent w-8 h-8"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Button>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* All Links Button */}
        <div className="p-3">
          <Button
            variant={selectedCategoryId === null ? 'secondary' : 'ghost'}
            onClick={() => onSelectCategory(null)}
            className={`
              w-full justify-start gap-3 h-10
              ${selectedCategoryId === null
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }
              ${isCollapsed ? 'justify-center px-2' : ''}
            `}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            {!isCollapsed && <span className="text-sm">All Links</span>}
          </Button>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-hidden">
          {!isCollapsed && (
            <div className="px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-sidebar-foreground/50 uppercase tracking-wider">
                Categories
              </span>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-sidebar-foreground/50 hover:text-primary hover:bg-transparent"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-semibold text-lg">New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Name
                      </Label>
                      <Input
                        placeholder="e.g., Design Inspiration"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Color
                      </Label>
                      <div className="flex gap-2 flex-wrap">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewCategory({ ...newCategory, color })}
                            className={`
                              w-8 h-8 rounded-full transition-all duration-200
                              ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' : 'hover:scale-105'}
                            `}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={handleCreateCategory}
                      disabled={isCreating}
                      className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isCreating ? 'Creating...' : 'Create Category'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          <ScrollArea className="h-full px-3 pb-4 custom-scrollbar">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={categories.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {categories.map((category) => (
                    <SortableCategory
                      key={category.id}
                      category={category}
                      isSelected={selectedCategoryId === category.id}
                      isCollapsed={isCollapsed}
                      onSelect={() => onSelectCategory(category.id)}
                      onDelete={() => onDeleteCategory(category.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-sidebar-border">
          <div className={`flex items-center ${isCollapsed ? 'flex-col gap-2' : 'justify-between'}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-primary text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sidebar-foreground text-sm truncate">
                  {user?.username || 'User'}
                </span>
              </div>
            )}
            <div className={`flex items-center gap-1 ${isCollapsed ? 'flex-col' : ''}`}>
              <OptionsDialog />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="w-9 h-9 text-sidebar-foreground/70 hover:text-destructive hover:bg-sidebar-accent"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

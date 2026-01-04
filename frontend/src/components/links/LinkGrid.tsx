'use client';

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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LinkCard } from './LinkCard';
import { Link, Category } from '@/types';

interface LinkGridProps {
  links: Link[];
  categories?: Category[];
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
  onReorder?: (linkIds: string[]) => Promise<void>;
  isLoading?: boolean;
  groupByCategory?: boolean;
  viewMode?: 'grid' | 'list';
}

// Sortable Link Card Wrapper
function SortableLinkCard({
  link,
  onEdit,
  onDelete,
}: {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LinkCard
        link={link}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}

export function LinkGrid({
  links,
  categories = [],
  onEdit,
  onDelete,
  onReorder,
  isLoading,
  groupByCategory = false,
  viewMode = 'grid'
}: LinkGridProps) {
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

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      const newOrder = arrayMove(links, oldIndex, newIndex);
      await onReorder(newOrder.map((l) => l.id));
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-4 animate-pulse"
          >
            <div className="w-12 h-12 rounded-lg bg-muted mb-4" />
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No links yet</h3>
        <p className="text-muted-foreground text-sm max-w-xs">
          Start your collection by adding your first link
        </p>
      </div>
    );
  }

  // Group by category view
  if (groupByCategory) {
    // Group links by category
    const groupedLinks: { [key: string]: Link[] } = {};
    const uncategorizedLinks: Link[] = [];

    links.forEach(link => {
      if (link.category_id) {
        if (!groupedLinks[link.category_id]) {
          groupedLinks[link.category_id] = [];
        }
        groupedLinks[link.category_id].push(link);
      } else {
        uncategorizedLinks.push(link);
      }
    });

    // Sort categories by order_index
    const sortedCategories = [...categories].sort((a, b) => a.order_index - b.order_index);

    // List view (Kanban style - soft shadow columns)
    if (viewMode === 'list') {
      // Filter categories with links
      const categoriesWithLinks = sortedCategories.filter(
        category => (groupedLinks[category.id] || []).length > 0
      );

      return (
        <div className="flex gap-5 overflow-x-auto pb-4">
          {/* Categorized links */}
          {categoriesWithLinks.map((category) => {
            const categoryLinks = groupedLinks[category.id] || [];

            return (
              <div
                key={category.id}
                className="flex-shrink-0 w-72 bg-card/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <h2 className="text-sm font-medium text-foreground truncate flex-1">
                    {category.name}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {categoryLinks.length}
                  </span>
                </div>

                {/* Links List */}
                <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={categoryLinks.map((l) => l.id)}
                      strategy={rectSortingStrategy}
                    >
                      {categoryLinks.map((link) => (
                        <SortableLinkCard
                          key={link.id}
                          link={link}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            );
          })}

          {/* Uncategorized links */}
          {uncategorizedLinks.length > 0 && (
            <div className="flex-shrink-0 w-72 bg-card/50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              {/* Uncategorized Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full shrink-0 bg-muted-foreground/40" />
                <h2 className="text-sm font-medium text-foreground truncate flex-1">
                  Uncategorized
                </h2>
                <span className="text-xs text-muted-foreground">
                  {uncategorizedLinks.length}
                </span>
              </div>

              {/* Links List */}
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={uncategorizedLinks.map((l) => l.id)}
                    strategy={rectSortingStrategy}
                  >
                    {uncategorizedLinks.map((link) => (
                      <SortableLinkCard
                        key={link.id}
                        link={link}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Grid view (default)
    return (
      <div className="space-y-8">
        {/* Categorized links */}
        {sortedCategories.map(category => {
          const categoryLinks = groupedLinks[category.id] || [];
          if (categoryLinks.length === 0) return null;

          return (
            <div key={category.id} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <h2 className="text-lg font-semibold text-foreground">
                  {category.name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {categoryLinks.length} {categoryLinks.length === 1 ? 'link' : 'links'}
                </span>
              </div>

              {/* Links Grid with DnD */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={categoryLinks.map((l) => l.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {categoryLinks.map((link) => (
                      <SortableLinkCard
                        key={link.id}
                        link={link}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          );
        })}

        {/* Uncategorized links */}
        {uncategorizedLinks.length > 0 && (
          <div className="space-y-4">
            {/* Uncategorized Header */}
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <div className="w-3 h-3 rounded-full shrink-0 bg-muted-foreground/30" />
              <h2 className="text-lg font-semibold text-foreground">
                Uncategorized
              </h2>
              <span className="text-sm text-muted-foreground">
                {uncategorizedLinks.length} {uncategorizedLinks.length === 1 ? 'link' : 'links'}
              </span>
            </div>

            {/* Links Grid with DnD */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={uncategorizedLinks.map((l) => l.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {uncategorizedLinks.map((link) => (
                    <SortableLinkCard
                      key={link.id}
                      link={link}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    );
  }

  // Default flat grid view with DnD
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={links.map((l) => l.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {links.map((link) => (
            <SortableLinkCard
              key={link.id}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

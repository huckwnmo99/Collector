'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link as LinkType } from '@/types';

interface MacroCardProps {
  link: LinkType;
  onEdit: (link: LinkType) => void;
  onDelete: (id: string) => void;
}

export function MacroCard({ link, onEdit, onDelete }: MacroCardProps) {
  const [imageError, setImageError] = useState(false);
  const items = link.macro_items || [];

  // Find the first item with a favicon for the main display
  const primaryFavicon = items.find(
    (item) => item.resolved_favicon || item.custom_favicon
  );
  const faviconUrl = primaryFavicon?.resolved_favicon || primaryFavicon?.custom_favicon || null;

  const handleClick = () => {
    if (items.length === 0) return;

    const urls = items
      .map((item) => item.resolved_url || item.custom_url)
      .filter(Boolean) as string[];

    if (urls.length === 0) return;

    // Open first tab immediately (user-initiated, won't be blocked)
    window.open(urls[0], '_blank', 'noopener,noreferrer');

    // Open remaining tabs with staggered delays to avoid popup blocker
    urls.slice(1).forEach((url, index) => {
      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
      }, (index + 1) * 300);
    });
  };

  return (
    <div
      className="group relative bg-card border border-border rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Menu Button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(link);
              }}
              className="cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(link.id);
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stacked card icon with favicon + count badge */}
      <div className="relative w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4">
        {/* Back card */}
        <div className="absolute top-2.5 left-2 w-full h-full rounded-lg bg-muted/50 border border-border/40 rotate-[6deg]" />
        {/* Middle card */}
        <div className="absolute top-1 left-1 w-full h-full rounded-lg bg-muted/70 border border-border/60 rotate-[3deg]" />
        {/* Front card with favicon */}
        <div className="relative w-full h-full rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden">
          {faviconUrl && !imageError ? (
            <img
              src={faviconUrl}
              alt=""
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L12 12.75 6.429 9.75m11.142 0l4.179 2.25L12 17.25 2.25 12l4.179-2.25m11.142 0l4.179 2.25L12 22.5l-9.75-5.25 4.179-2.25" />
            </svg>
          )}
        </div>

        {/* Count badge */}
        <div className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center px-1 shadow-sm">
          {items.length}
        </div>
      </div>

      {/* Content */}
      <h3 className="font-medium text-sm md:text-sm truncate mb-1 group-hover:text-primary transition-colors">
        {link.title}
      </h3>
      <p className="text-[11px] md:text-xs text-muted-foreground truncate">
        {items.length} {items.length === 1 ? 'site' : 'sites'}
      </p>

      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-b-xl" />
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar } from '@/components/layout/Sidebar';
import { LinkGrid } from '@/components/links/LinkGrid';
import { AddLinkDialog } from '@/components/links/AddLinkDialog';
import { useAuthStore } from '@/store/authStore';
import { Category, Link } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('linkViewMode') as 'grid' | 'list';
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode to localStorage
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('linkViewMode', mode);
  };

  // Check authentication
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch data
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchLinks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = selectedCategoryId ? { categoryId: selectedCategoryId } : {};
      const response = await api.get('/links', { params });
      setLinks(response.data.links || []);
    } catch (error) {
      console.error('Failed to fetch links:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchLinks();
    }
  }, [isAuthenticated, fetchCategories, fetchLinks]);

  // Category actions
  const handleCreateCategory = async (name: string, color: string) => {
    const response = await api.post('/categories', { name, color });
    setCategories([...categories, response.data.category]);
  };

  const handleUpdateCategory = async (id: string, name: string, color: string) => {
    const response = await api.put(`/categories/${id}`, { name, color });
    setCategories(categories.map((c) => (c.id === id ? response.data.category : c)));
  };

  const handleDeleteCategory = async (id: string) => {
    await api.delete(`/categories/${id}`);
    setCategories(categories.filter((c) => c.id !== id));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
    }
    toast.success('Category deleted');
  };

  const handleReorderCategories = async (categoryIds: string[]) => {
    // Optimistic update
    const reorderedCategories = categoryIds.map((id, index) => {
      const category = categories.find((c) => c.id === id)!;
      return { ...category, order_index: index };
    });
    setCategories(reorderedCategories);

    // API call
    await api.put('/categories/reorder', { categoryIds });
  };

  // Link actions
  const handleAddLink = async (title: string, url: string, categoryId?: string, memo?: string) => {
    if (editingLink) {
      const response = await api.put(`/links/${editingLink.id}`, { title, url, categoryId, memo });
      setLinks(links.map((l) => (l.id === editingLink.id ? response.data.link : l)));
      setEditingLink(null);
      toast.success('Link updated!');
    } else {
      const response = await api.post('/links', { title, url, categoryId, memo });
      setLinks([response.data.link, ...links]);
      toast.success('Link added!');
    }
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsAddLinkOpen(true);
  };

  const handleDeleteLink = async (id: string) => {
    await api.delete(`/links/${id}`);
    setLinks(links.filter((l) => l.id !== id));
    toast.success('Link deleted');
  };

  const handleReorderLinks = async (linkIds: string[]) => {
    // Optimistic update
    const reorderedLinks = linkIds.map((id) => {
      return links.find((l) => l.id === id)!;
    });
    setLinks(reorderedLinks);

    // API call
    await api.put('/links/reorder', { linkIds });
  };

  // Filter links by search
  const filteredLinks = links.filter((link) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query)
    );
  });

  // Get category name for header
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center fade-in">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onReorderCategories={handleReorderCategories}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={`
          min-h-screen transition-all duration-300
          ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}
        `}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold truncate">
                {selectedCategory ? (
                  <span className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                    {selectedCategory.name}
                  </span>
                ) : (
                  'All Links'
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle - Only show on All Links */}
              {selectedCategoryId === null && !searchQuery && (
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="Grid view"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title="List view"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Search */}
              <div className="relative w-64 hidden sm:block">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <Input
                  type="search"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 bg-transparent"
                />
              </div>

              {/* Add Link Button */}
              <Button
                onClick={() => {
                  setEditingLink(null);
                  setIsAddLinkOpen(true);
                }}
                className="h-10 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 btn-press"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="hidden sm:inline">Add Link</span>
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="px-6 pb-4 sm:hidden">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <Input
                type="search"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-transparent"
              />
            </div>
          </div>
        </header>

        {/* Links Grid */}
        <div className="p-6">
          <LinkGrid
            links={filteredLinks}
            categories={categories}
            onEdit={handleEditLink}
            onDelete={handleDeleteLink}
            onReorder={handleReorderLinks}
            isLoading={isLoading}
            groupByCategory={selectedCategoryId === null && !searchQuery}
            viewMode={selectedCategoryId === null && !searchQuery ? viewMode : 'grid'}
          />
        </div>
      </main>

      {/* Add/Edit Link Dialog */}
      <AddLinkDialog
        isOpen={isAddLinkOpen}
        onClose={() => {
          setIsAddLinkOpen(false);
          setEditingLink(null);
        }}
        onSubmit={handleAddLink}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        editingLink={editingLink}
      />
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber/5 rounded-full blur-3xl" />

        {/* Decorative circles */}
        <div className="absolute top-20 right-1/4 w-64 h-64 border border-border/30 rounded-full" />
        <div className="absolute bottom-32 left-1/4 w-48 h-48 border border-amber/20 rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12">
        <h1 className="text-xl font-serif font-semibold tracking-tight">
          Web<span className="text-amber">Collector</span>
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-foreground text-background hover:bg-amber hover:text-foreground">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto pt-16 lg:pt-24">
          {/* Badge */}
          <div className="fade-in inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span className="text-sm text-muted-foreground">Your digital curator awaits</span>
          </div>

          {/* Main Headline */}
          <h2 className="fade-in text-4xl sm:text-5xl lg:text-7xl font-serif font-semibold leading-tight tracking-tight" style={{ animationDelay: '0.1s' }}>
            Curate your<br />
            <span className="text-amber italic">digital universe</span><br />
            with elegance
          </h2>

          {/* Subtitle */}
          <p className="fade-in mt-6 text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed" style={{ animationDelay: '0.2s' }}>
            A sophisticated bookmark manager for the modern web curator.
            Organize, discover, and access your favorite corners of the internet.
          </p>

          {/* CTA Buttons */}
          <div className="fade-in flex flex-wrap gap-4 mt-10" style={{ animationDelay: '0.3s' }}>
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 bg-foreground text-background hover:bg-amber hover:text-foreground text-base">
                Start Curating
                <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                I have an account
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="fade-in grid sm:grid-cols-3 gap-8 mt-24 lg:mt-32" style={{ animationDelay: '0.4s' }}>
            <div className="group">
              <div className="w-12 h-12 rounded-lg bg-amber/10 flex items-center justify-center mb-4 group-hover:bg-amber/20 transition-colors">
                <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">Smart Categories</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Organize your links into custom categories with colors that match your style.
              </p>
            </div>

            <div className="group">
              <div className="w-12 h-12 rounded-lg bg-amber/10 flex items-center justify-center mb-4 group-hover:bg-amber/20 transition-colors">
                <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">Instant Search</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Find any link instantly with powerful search across all your collections.
              </p>
            </div>

            <div className="group">
              <div className="w-12 h-12 rounded-lg bg-amber/10 flex items-center justify-center mb-4 group-hover:bg-amber/20 transition-colors">
                <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">Dark Mode</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Easy on the eyes with beautiful light and dark themes.
              </p>
            </div>
          </div>

          {/* Preview Image Placeholder */}
          <div className="fade-in mt-24 lg:mt-32 mb-20" style={{ animationDelay: '0.5s' }}>
            <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-background rounded-md text-xs text-muted-foreground">
                    webcollector.app/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard preview */}
              <div className="flex h-64 lg:h-96">
                {/* Sidebar preview */}
                <div className="w-48 bg-sidebar border-r border-sidebar-border p-4 hidden sm:block">
                  <div className="text-sidebar-foreground text-sm font-serif mb-6">
                    Web<span className="text-amber">Collector</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 bg-sidebar-accent rounded flex items-center px-3 gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber" />
                      <span className="text-xs text-sidebar-foreground">All Links</span>
                    </div>
                    <div className="h-8 bg-transparent rounded flex items-center px-3 gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs text-sidebar-foreground/70">Design</span>
                    </div>
                    <div className="h-8 bg-transparent rounded flex items-center px-3 gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs text-sidebar-foreground/70">Development</span>
                    </div>
                  </div>
                </div>

                {/* Main content preview */}
                <div className="flex-1 p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="bg-muted/30 rounded-lg p-3 border border-border/50">
                        <div className="w-8 h-8 rounded bg-muted mb-2" />
                        <div className="h-3 bg-muted rounded w-3/4 mb-1" />
                        <div className="h-2 bg-muted/50 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 WebCollector. Crafted with care.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors editorial-link">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors editorial-link">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

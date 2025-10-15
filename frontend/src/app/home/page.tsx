'use client';

import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME, ROUTES } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut, Sparkles, Rocket, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const getAvatarUrl = (avatar?: string | { url: string }) => {
  if (!avatar) return undefined;
  if (typeof avatar === 'string') return avatar;
  return avatar.url;
};

const getInitials = (name: string) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

export default function HomePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    try {
      logout();
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.',
      });
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: 'There was an error signing you out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="flex flex-col items-center space-y-4">
          <div className="size-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
          <div className="text-xl text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Animated background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-96 w-96 animate-float rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 h-96 w-96 animate-float-delayed rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-pink-500/5 blur-3xl"></div>
      </div>

      {/* Simple Navbar */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href={ROUTES.HOME} className="flex items-center space-x-2 transition-transform hover:scale-105">
              <Rocket className="size-7 text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </Link>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-4">
              <Link href={ROUTES.SETTINGS}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="size-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative size-10 rounded-full p-0">
                    <Avatar className="size-10 border-2 border-primary/20 transition-all hover:border-primary/40">
                      <AvatarImage src={getAvatarUrl(user.avatar)} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 font-semibold text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={ROUTES.SETTINGS} className="cursor-pointer">
                      <Settings className="mr-2 size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="text-center space-y-8 max-w-5xl mx-auto">
          {/* Welcome badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Welcome back!</span>
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="inline-block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Welcome to
              </span>
              <br />
              <span className="text-4xl inline-block bg-gradient-to-r from-cyan-500 via-blue-500 to-primary bg-clip-text text-transparent">
                Django-NextJS Starter
              </span>
            </h1>
          </div>

          {/* Greeting */}
          <div className="space-y-2">
            <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground">
              Hello,{' '}
              <span className="font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {user.name}
              </span>
              <span className="inline-block animate-wave ml-2">👋</span>
            </p>
            <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto">
              Jump start your project with the most used technologies in web development today.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href={ROUTES.SETTINGS}>
              <Button size="lg" variant="default" className="gap-2 text-base px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
                Get Started
                <ArrowRight className="size-5" />
              </Button>
            </Link>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Django 5.2+
              </div>
              <div className="text-sm text-muted-foreground mt-2">Powerful Backend</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Next.js 14+
              </div>
              <div className="text-sm text-muted-foreground mt-2">Modern Frontend</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                TypeScript
              </div>
              <div className="text-sm text-muted-foreground mt-2">Type Safety</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add wave animation keyframes */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}


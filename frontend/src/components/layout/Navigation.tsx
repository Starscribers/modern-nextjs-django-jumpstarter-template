'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { APP_NAME, ROUTES } from '@/lib/constants';
import {
  Home,
  LogOut,
  Menu,
  Settings,
  User as UserIcon,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavigationUser {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  avatar?: string | { url: string };
}

const getAvatarUrl = (avatar?: string | { url: string }) => {
  if (!avatar) return undefined;
  if (typeof avatar === 'string') return avatar;
  return avatar.url;
};

const getDisplayName = (user: NavigationUser) => {
  if (user.fullName) {
    return user.fullName;
  }
  return user.name || 'User';
};

const getInitials = (user: NavigationUser) => {
  const displayName = getDisplayName(user);
  if (displayName && displayName !== 'User') {
    return displayName.charAt(0).toUpperCase();
  }
  return 'U'; // Default fallback
};

interface NavigationProps {
  user?: NavigationUser;
}

const navigationItems = [
  {
    name: 'Home',
    href: ROUTES.HOME,
    icon: Home,
  },
  {
    name: 'Settings',
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

export function Navigation({ user }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // Debug user data in development
  if (process.env.NODE_ENV === 'development' && user) {
    console.log('Navigation user data:', {
      id: user.id,
      name: user.name,
      fullName: user.fullName,
      avatar: user.avatar,
      displayName: getDisplayName(user),
      initials: getInitials(user),
      avatarUrl: getAvatarUrl(user.avatar)
    });
  }



  const handleSignOut = async () => {
    try {
      // Call logout from AuthContext which clears localStorage and user state
      logout();

      // Show success toast
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.',
      });

      // Redirect to login page
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

  const confirmSignOut = () => {
    // For now, we'll proceed directly. You can add a confirmation dialog later if needed
    handleSignOut();
  };

  return (
    <nav className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href={ROUTES.LANDING}
              className="flex items-center space-x-2"
            >
              <Zap className="size-8 text-primary-foreground" />
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>

            {/* Navigation Links */}
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className="justify-start"
                      >
                        <Icon className="mr-2 size-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Mobile Menu */}
            {user && (
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    {navigationItems.map(item => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;

                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link
                            href={item.href}
                            className={isActive ? 'bg-secondary' : ''}
                          >
                            <Icon className="mr-2 size-4" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {user ? (
              <>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative size-8 rounded-full"
                    >
                      <Avatar className="size-8 border-2 border-border">
                        <AvatarImage src={getAvatarUrl(user.avatar)} alt={getDisplayName(user)} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Debug info - remove in production */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="absolute -top-8 left-0 text-xs bg-black text-white p-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                          Avatar: {getAvatarUrl(user.avatar) ? 'Has URL' : 'No URL'} | Initial: {getInitials(user)}
                        </div>
                      )}
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
                      <Link href={ROUTES.SETTINGS}>
                        <Settings className="mr-2 size-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={confirmSignOut}>
                      <LogOut className="mr-2 size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost">Sign in</Button>
                </Link>

                <Link href={ROUTES.REGISTER}>
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

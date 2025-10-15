'use client';

import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import type { AuthResponse } from '@/types/api';
import { BookOpen, LogIn, LogOut, Menu, User, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = authService.isLoggedIn();
    if (isLoggedIn) {
      const storedUser = authService.getStoredUser();
      setUser(storedUser);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-blue-600"
          >
            <BookOpen className="size-8" />
            example_project
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1 text-gray-600 transition-colors hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-600 transition-colors hover:text-blue-600"
                >
                  <User className="size-4" />
                  {user.firstName || user.username || user.email}
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login" className="flex items-center gap-2">
                    <LogIn className="size-4" />
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="p-2 text-gray-600 hover:text-blue-600 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 border-t border-gray-200 pt-3">
                {user ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="size-4" />
                      {user.firstName || user.username || user.email}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="size-4" />
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

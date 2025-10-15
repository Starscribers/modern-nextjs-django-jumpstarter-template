'use client';

import { Suspense } from 'react';
import { AnimatedPage } from '@/components/ui/animated-components';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function LoginPageContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Email or username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await login(formData.username, formData.password);

      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });

      // Redirect to dashboard
      router.push('/home');
    } catch (error: any) {
      console.error('Login failed:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response?.status === 401) {
        errorMessage = 'Invalid email/username or password.';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });

      // Set form-level error for invalid credentials
      if (error.response?.status === 401) {
        setErrors({
          username: ' ', // Space to trigger error styling
          password: 'Invalid credentials',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userType: 'learner' | 'provider') => {
    setIsLoading(true);
    try {
      const credentials =
        userType === 'provider'
          ? { username: 'provider@example.com', password: 'testpass123' }
          : { username: 'learner@example.com', password: 'testpass123' };

      const response = await login(credentials.username, credentials.password);

      toast({
        title: `Logged in as ${userType}`,
        description: 'You are now using the demo account.',
      });

      // Redirect to dashboard
      router.push('/home');
    } catch (error) {
      toast({
        title: 'Demo login failed',
        description:
          'Demo account is not available. Please use your own credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <LogIn className="size-6 text-blue-600" />
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username/Email Field */}
              <div>
                <Label htmlFor="username">Email or Username</Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="size-5 text-gray-400" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={e =>
                      handleInputChange('username', e.target.value)
                    }
                    disabled={isLoading}
                    placeholder="Enter your email or username"
                    className={`pl-10 ${
                      errors.username
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    autoComplete="username"
                  />
                </div>
                {errors.username && errors.username !== ' ' && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="size-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e =>
                      handleInputChange('password', e.target.value)
                    }
                    disabled={isLoading}
                    placeholder="Enter your password"
                    className={`px-10 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="size-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="size-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="size-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>


            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

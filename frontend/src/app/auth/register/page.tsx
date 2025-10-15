'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { authService } from '@/services/authService';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'learner' as 'learner' | 'provider',
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await authService.register({
        nickname: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast({
        title: 'Account created successfully!',
        description: 'Please sign in with your new account.',
      });

      router.push('/auth/login');
    } catch (error: any) {
      console.error('Registration failed:', error);

      let errorMessage = 'Registration failed. Please try again.';

      // Handle different error response formats
      if (error.response?.data?.errors?.email) {
        // New format: { message: "...", errors: { email: ["..."] } }
        errorMessage = Array.isArray(error.response.data.errors.email)
          ? error.response.data.errors.email[0]
          : error.response.data.errors.email;
        setErrors({ email: errorMessage });
      } else if (error.response?.data?.errors?.nickname) {
        // Handle nickname validation errors
        errorMessage = Array.isArray(error.response.data.errors.nickname)
          ? error.response.data.errors.nickname[0]
          : error.response.data.errors.nickname;
        setErrors({ name: errorMessage });
      } else if (error.response?.data?.email) {
        // Old format: { email: "..." }
        errorMessage = Array.isArray(error.response.data.email)
          ? error.response.data.email[0]
          : error.response.data.email;
        setErrors({ email: errorMessage });
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle general validation errors
        const errors = error.response.data.errors;
        if (typeof errors === 'object') {
          const firstError = Object.values(errors)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          } else if (typeof firstError === 'string') {
            errorMessage = firstError;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Registration failed',
        description: errorMessage,
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
            Join example_project
          </h1>
          <p className="text-gray-600">Create your account to start learning</p>
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <UserPlus className="size-6 text-blue-600" />
              Sign Up
            </CardTitle>
            <CardDescription>
              Create a new account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="size-5 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter your full name"
                    className={`pl-10 ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    autoComplete="name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="size-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter your email address"
                    className={`pl-10 ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    {errors.email}
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
                    placeholder="Create a password"
                    className={`px-10 ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    autoComplete="new-password"
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

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="size-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e =>
                      handleInputChange('confirmPassword', e.target.value)
                    }
                    disabled={isLoading}
                    placeholder="Confirm your password"
                    className={`pl-10 ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="size-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="size-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}

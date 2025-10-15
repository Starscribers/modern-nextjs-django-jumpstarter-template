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
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: 'Reset link sent',
        description: 'Check your email for password reset instructions.',
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <AnimatedPage className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 size-16 text-green-500" />
                <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                  Check Your Email
                </h2>
                <p className="mb-6 text-gray-600">
                  We&apos;ve sent password reset instructions to {email}
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/auth/login">
                      <ArrowLeft className="mr-2 size-4" />
                      Back to Sign In
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full"
                  >
                    Resend Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            Enter your email to reset your password
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold">
              <Mail className="size-6 text-blue-600" />
              Reset Password
            </CardTitle>
            <CardDescription>
              We&apos;ll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="size-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter your email address"
                    className="pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="size-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-500"
              >
                <ArrowLeft className="size-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AnimatedPage>
  );
}

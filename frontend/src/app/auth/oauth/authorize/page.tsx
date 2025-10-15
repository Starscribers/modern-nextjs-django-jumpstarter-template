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
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import StorageService from '@/services/storageService';
import { CheckCircle, Shield, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function OAuthAuthorizePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OAuth parameters from URL
  const clientId = searchParams.get('client_id');
  const redirectUri = searchParams.get('redirect_uri');
  const responseType = searchParams.get('response_type');
  const scope = searchParams.get('scope') || 'read';
  const state = searchParams.get('state');
  const codeChallenge = searchParams.get('code_challenge');
  const codeChallengeMethod = searchParams.get('code_challenge_method') || 'S256';

  useEffect(() => {
    // If user is not logged in, redirect to login with return URL
    if (!user) {
      const currentUrl = window.location.href;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // Validate OAuth parameters
    if (!clientId || !redirectUri || !responseType) {
      toast({
        title: 'Invalid OAuth Request',
        description: 'Missing required OAuth parameters.',
        variant: 'destructive',
      });
      router.push('/auth/login');
      return;
    }

    if (responseType !== 'code') {
      toast({
        title: 'Unsupported Response Type',
        description: 'Only authorization code flow is supported.',
        variant: 'destructive',
      });
      router.push('/auth/login');
      return;
    }
  }, [user, clientId, redirectUri, responseType, router]);

  const handleAuthorize = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get access token from storage
      const accessToken = StorageService.getAuthToken();
      if (!accessToken) {
        setError('Not authenticated. Please log in again.');
        return;
      }

      // Build URL with OAuth parameters as query params
      const params = new URLSearchParams({
        client_id: clientId || '',
        redirect_uri: redirectUri || '',
        response_type: responseType || '',
        scope: scope,
        state: state || '',
        code_challenge: codeChallenge || '',
        code_challenge_method: codeChallengeMethod,
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/authorize/?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('OAuth authorize response:', data);

      // Use snake_case key as returned by backend
      if (data.redirectUrl) {
        console.log('Redirecting to:', data.redirectUrl);
        window.location.href = data.redirectUrl;
      } else {
        console.error('No redirect URL received:', data);
        setError('Failed to get authorization redirect URL');
      }
    } catch (error) {
      console.error('Authorization error:', error);
      setError('Failed to authorize. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = () => {
    // Redirect back to client with access_denied error
    if (redirectUri && state) {
      const denyUrl = `${redirectUri}?error=access_denied&error_description=User%20denied%20authorization&state=${state}`;
      window.location.href = denyUrl;
    } else {
      router.push('/auth/login');
    }
  };

  // Get client name based on client_id
  const getClientName = (clientId: string | null) => {
    switch (clientId) {
      case 'vscode-extension':
        return 'example_project VSCode Extension';
      case 'web-app':
        return 'example_project Web Application';
      default:
        return 'Third-party Application';
    }
  };

  // Get scope description
  const getScopeDescription = (scope: string) => {
    const scopes = scope.split(' ');
    const descriptions: string[] = [];

    if (scopes.includes('read')) {
      descriptions.push('Read your profile information');
    }
    if (scopes.includes('write')) {
      descriptions.push('Update your profile and progress');
    }

    return descriptions.length > 0 ? descriptions : ['Access your account'];
  };

  if (!user) {
    return (
      <AnimatedPage className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-spin rounded-full border-b-2 border-blue-600 size-8 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Shield className="size-8 text-blue-600" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Authorize Application
          </h1>
          <p className="text-gray-600">
            {getClientName(clientId)} wants to access your example_project account
          </p>
        </div>

        {/* Authorization Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Shield className="size-5 text-blue-600" />
              Permission Request
            </CardTitle>
            <CardDescription>
              This application is requesting the following permissions:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                <span className="text-sm font-medium text-blue-600">
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Requested Permissions:</h3>
              <div className="space-y-2">
                {getScopeDescription(scope).map((permission, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="size-4 text-green-500" />
                    {permission}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3">
                <div className="flex gap-2">
                  <X className="size-4 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">Error</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDeny}
                disabled={isLoading}
                className="flex-1"
              >
                <X className="mr-2 size-4" />
                Deny
              </Button>
              <Button
                onClick={handleAuthorize}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                    Authorizing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 size-4" />
                    Authorize
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By authorizing this application, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default function OAuthAuthorizePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OAuthAuthorizePageContent />
    </Suspense>
  );
}

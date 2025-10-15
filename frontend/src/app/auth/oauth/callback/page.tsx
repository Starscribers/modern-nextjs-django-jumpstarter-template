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
import { toast } from '@/hooks/use-toast';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function OAuthCallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authorization...');

  // OAuth callback parameters
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  useEffect(() => {
    const handleCallback = async () => {
      // Handle OAuth errors
      if (error) {
        setStatus('error');
        setMessage(errorDescription || 'Authorization failed');
        toast({
          title: 'Authorization Failed',
          description: errorDescription || 'The authorization request was denied.',
          variant: 'destructive',
        });
        return;
      }

      // Handle successful authorization
      if (code) {
        try {
          // For VSCode extension, we don't need to exchange the code here
          // The extension will handle the token exchange
          setStatus('success');
          setMessage('Authorization successful! You can now close this window.');

          toast({
            title: 'Authorization Successful',
            description: 'The application has been authorized successfully.',
          });

          // Auto-close after 3 seconds for better UX
          setTimeout(() => {
            window.close();
          }, 3000);

        } catch (err) {
          console.error('Callback processing failed:', err);
          setStatus('error');
          setMessage('Failed to process authorization callback.');
          toast({
            title: 'Processing Failed',
            description: 'Failed to process the authorization callback.',
            variant: 'destructive',
          });
        }
      } else {
        setStatus('error');
        setMessage('No authorization code received.');
        toast({
          title: 'Invalid Callback',
          description: 'No authorization code was received.',
          variant: 'destructive',
        });
      }
    };

    handleCallback();
  }, [code, state, error, errorDescription]);

  const handleClose = () => {
    window.close();
  };

  const handleRetry = () => {
    router.push('/auth/login');
  };

  return (
    <AnimatedPage className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            {status === 'loading' && (
              <div className="rounded-full bg-blue-100 p-3">
                <div className="size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            )}
            {status === 'success' && (
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="size-8 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="size-8 text-red-600" />
              </div>
            )}
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {status === 'loading' && 'Processing...'}
            {status === 'success' && 'Authorization Successful'}
            {status === 'error' && 'Authorization Failed'}
          </h1>
          <p className="text-gray-600">{message}</p>
        </div>

        {/* Status Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-xl font-semibold">
              {status === 'loading' && 'Please wait...'}
              {status === 'success' && 'All Set!'}
              {status === 'error' && 'Something went wrong'}
            </CardTitle>
            <CardDescription className="text-center">
              {status === 'loading' && 'We\'re processing your authorization request.'}
              {status === 'success' && 'The application has been successfully authorized.'}
              {status === 'error' && 'The authorization process encountered an error.'}
            </CardDescription>
          </CardHeader>
          {status !== 'loading' && (
            <CardContent>
              <div className="flex gap-3">
                {status === 'success' ? (
                  <Button onClick={handleClose} className="flex-1">
                    <CheckCircle className="mr-2 size-4" />
                    Close Window
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleRetry} className="flex-1">
                      Try Again
                    </Button>
                    <Button onClick={handleClose} className="flex-1">
                      Close
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Additional Info */}
        {status === 'success' && (
          <div className="mt-6 rounded-lg bg-green-50 p-4">
            <div className="flex gap-2">
              <CheckCircle className="size-5 text-green-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-800">What happens next?</p>
                <p className="text-green-700">
                  The application now has access to your example_project account. You can manage permissions
                  from your account settings at any time.
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 rounded-lg bg-red-50 p-4">
            <div className="flex gap-2">
              <XCircle className="size-5 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Need help?</p>
                <p className="text-red-700">
                  If you continue to experience issues, please contact our support team
                  or try logging in again.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OAuthCallbackPageContent />
    </Suspense>
  );
}

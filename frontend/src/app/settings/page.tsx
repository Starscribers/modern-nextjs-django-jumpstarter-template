'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application</CardTitle>
            <CardDescription>Application information</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium text-muted-foreground">App Name</label>
              <p className="text-lg">{APP_NAME}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>Customize your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings features can be added here based on your application needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

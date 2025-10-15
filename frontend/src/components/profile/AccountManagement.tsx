'use client';

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
import { userService } from '@/services/userService';
import type { UserDetail } from '@/types/api';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  Download,
  Mail,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface AccountManagementProps {
  profile: UserDetail;
  onAccountDeleted?: () => void;
}

export function AccountManagement({
  profile,
  onAccountDeleted,
}: AccountManagementProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = await userService.exportUserData();

      // Create and download the JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `example_project-user-data-${
        new Date().toISOString().split('T')[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      // document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Data exported',
        description: 'Your user data has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Failed to export data:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast({
        title: 'Password required',
        description: 'Please enter your password to confirm account deletion.',
        variant: 'destructive',
      });
      return;
    }

    setIsDeletingAccount(true);
    try {
      await userService.deleteAccount(deletePassword);
      toast({
        title: 'Account deleted',
        description: 'Your account has been permanently deleted.',
      });
      onAccountDeleted?.();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      toast({
        title: 'Deletion failed',
        description:
          error.response?.data?.message ||
          'Failed to delete account. Please check your password and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            Account Overview
          </CardTitle>
          <CardDescription>
            Overview of your account information and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground dark:text-gray-200">
                  Username
                </Label>
                <p className="text-lg text-foreground dark:text-gray-100">
                  {profile.username}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground dark:text-gray-200">
                  Email
                </Label>
                <p className="flex items-center gap-2 text-lg text-foreground dark:text-gray-100">
                  <Mail className="size-4" />
                  {profile.email}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-foreground dark:text-gray-200">
                  Member Since
                </Label>
                <p className="flex items-center gap-2 text-lg text-foreground dark:text-gray-100">
                  <Calendar className="size-4" />
                  {new Date(profile.dateJoined).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground dark:text-gray-200">
                  Total Learning Time
                </Label>
                <p className="text-lg text-foreground dark:text-gray-100">
                  {profile.profile?.totalLearningTime || 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-foreground dark:text-gray-200">
                  Skill Level
                </Label>
                <p className="text-lg capitalize text-foreground dark:text-gray-100">
                  {profile.profile?.skillLevel || 'N/A'}
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="size-5" />
              Export Your Data
            </CardTitle>
            <CardDescription>
              Download a copy of all your data stored in our system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                You can export your personal data including your profile
                information, learning progress, achievements, and account
                settings. This will be provided as a JSON file that you can
                download.
              </p>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h4 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
                  What&apos;s included in your export:
                </h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
                  <li>• Profile information and settings</li>
                  <li>• Learning progress and completed courses</li>
                  <li>• Skill tree enrollments and achievements</li>
                  <li>• Account preferences and customizations</li>
                </ul>
              </div>

              <div className="flex justify-start">
                <Button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  <Download className="size-4" />
                  {isExporting ? 'Exporting...' : 'Export My Data'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-red-200 bg-red-50/30 dark:border-red-800/50 dark:bg-red-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="size-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-5 text-red-600 dark:text-red-400" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-300">
                      Warning: This action cannot be undone
                    </h4>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                      Deleting your account will permanently remove all of your
                      data, including:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-400">
                      <li>• Your profile and personal information</li>
                      <li>• All learning progress and achievements</li>
                      <li>• Skill tree enrollments and completions</li>
                      <li>• Account settings and preferences</li>
                      <li>
                        • Any content you&apos;ve created (if you&apos;re a
                        provider)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {!showDeleteConfirmation ? (
                <div className="flex justify-start">
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="size-4" />
                    Delete My Account
                  </Button>
                </div>
              ) : (
                <div
                  className="space-y-4 rounded-lg border border-red-200 bg-red-50 p-4
                dark:border-red-800 dark:bg-red-900/20"
                >
                  <h4 className="font-medium text-red-800 dark:text-red-300">
                    Confirm Account Deletion
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    To confirm that you want to delete your account, please
                    enter your password below:
                  </p>

                  <div>
                    <Label htmlFor="delete-password">Your Password</Label>
                    <Input
                      id="delete-password"
                      type="password"
                      value={deletePassword}
                      onChange={e => setDeletePassword(e.target.value)}
                      disabled={isDeletingAccount}
                      placeholder="Enter your password"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount || !deletePassword.trim()}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="size-4" />
                      {isDeletingAccount
                        ? 'Deleting...'
                        : 'Permanently Delete Account'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDeleteConfirmation(false);
                        setDeletePassword('');
                      }}
                      disabled={isDeletingAccount}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

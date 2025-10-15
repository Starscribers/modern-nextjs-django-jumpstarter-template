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
import { motion } from 'framer-motion';
import { AlertTriangle, Key, Lock, Shield } from 'lucide-react';
import { useState } from 'react';

interface SecuritySettingsProps {
  onUpdate?: () => void;
}

export function SecuritySettings({ onUpdate }: SecuritySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: 'Password mismatch',
        description: 'New password and confirmation password do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await userService.changePassword(passwordData);
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      onUpdate?.();
    } catch (error: any) {
      console.error('Failed to change password:', error);
      toast({
        title: 'Password change failed',
        description:
          error.response?.data?.message ||
          'Failed to change password. Please check your current password and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (
    password: string
  ): { strength: number; label: string; color: string } => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z\d]/.test(password)) score += 1;

    if (score <= 2)
      return { strength: score * 20, label: 'Weak', color: 'bg-red-500' };
    if (score === 3)
      return { strength: 60, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 4)
      return { strength: 80, label: 'Good', color: 'bg-blue-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(passwordData.new_password);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="size-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label htmlFor="old_password">Current Password</Label>
              <Input
                id="old_password"
                type="password"
                value={passwordData.old_password}
                onChange={e =>
                  handlePasswordChange('old_password', e.target.value)
                }
                disabled={isLoading}
                required
                className="mt-1"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={passwordData.new_password}
                onChange={e =>
                  handlePasswordChange('new_password', e.target.value)
                }
                disabled={isLoading}
                required
                className="mt-1"
              />

              {/* Password Strength Indicator */}
              {passwordData.new_password && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground dark:text-gray-200">
                      Password strength:
                    </span>
                    <span
                      className={`font-medium ${
                        passwordStrength.label === 'Weak'
                          ? 'text-red-600 dark:text-red-400'
                          : passwordStrength.label === 'Fair'
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : passwordStrength.label === 'Good'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={passwordData.confirm_password}
                onChange={e =>
                  handlePasswordChange('confirm_password', e.target.value)
                }
                disabled={isLoading}
                required
                className="mt-1"
              />
              {passwordData.confirm_password &&
                passwordData.new_password !== passwordData.confirm_password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Passwords do not match
                  </p>
                )}
            </motion.div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !passwordData.old_password ||
                  !passwordData.new_password ||
                  !passwordData.confirm_password ||
                  passwordData.new_password !== passwordData.confirm_password
                }
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5" />
              Security Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div
                className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <Key className="mt-0.5 size-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">
                    Use a Strong Password
                  </h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    Include uppercase and lowercase letters, numbers, and
                    special characters. Avoid using personal information or
                    common words.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Shield className="mt-0.5 size-5 text-green-600 dark:text-green-400" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">
                    Keep Your Password Secure
                  </h4>
                  <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                    Never share your password with others. Use a different
                    password for each online account you have.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <AlertTriangle className="mt-0.5 size-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-300">
                    Regular Updates
                  </h4>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                    Consider changing your password regularly, especially if you
                    suspect it may have been compromised.
                  </p>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Account Security Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Account Security Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <motion.div
                className="flex items-center justify-between rounded-lg border border-border border-green-200 bg-green-50
                  p-3 dark:border-gray-700 dark:border-green-800 dark:bg-green-900/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                  <div>
                    <p className="font-medium text-foreground dark:text-gray-100">
                      Password Protection
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Your account is protected with a password
                    </p>
                  </div>
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Active
                </span>
              </motion.div>

              <motion.div
                className="flex items-center justify-between rounded-lg border border-border border-green-200 bg-green-50
                  p-3 dark:border-gray-700 dark:border-green-800 dark:bg-green-900/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full bg-green-500 dark:bg-green-400"></div>
                  <div>
                    <p className="font-medium text-foreground dark:text-gray-100">
                      Email Verification
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Your email address is verified
                    </p>
                  </div>
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Verified
                </span>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

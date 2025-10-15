'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import type { UserSettings } from '@/types/api';
import { motion } from 'framer-motion';
import { Eye, EyeOff, MessageCircle, Shield, Users } from 'lucide-react';
import { useState } from 'react';

interface PrivacySettingsProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

// Simple Switch component with dark mode support
const Switch = ({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={() => onCheckedChange(!checked)}
    disabled={disabled}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200
      hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary
      focus:ring-offset-2 active:scale-95
      disabled:cursor-not-allowed disabled:opacity-50
      ${
        checked
          ? 'bg-primary shadow-md dark:bg-primary'
          : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
      }
    `}
  >
    <span
      className={`
        inline-block size-4 rounded-full bg-white shadow-sm transition-all duration-200
        dark:bg-gray-100
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
);

export function PrivacySettings({ settings, onUpdate }: PrivacySettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    publicProfile: settings.publicProfile,
    showProgressPublicly: settings.showProgressPublicly,
    allowMessages: settings.allowMessages,
  });

  const handleToggle = (field: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedSettings = await userService.updateSettings(formData);
      onUpdate(updatedSettings);
      toast({
        title: 'Privacy settings updated',
        description: 'Your privacy preferences have been saved successfully.',
      });
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update privacy settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const privacyOptions = [
    {
      key: 'publicProfile' as const,
      icon: formData.publicProfile ? Eye : EyeOff,
      title: 'Public Profile',
      description:
        'Allow other users to view your profile information, learning goals, and achievements.',
      warning: !formData.publicProfile
        ? 'Your profile will be hidden from other users.'
        : undefined,
    },
    {
      key: 'showProgressPublicly' as const,
      icon: Users,
      title: 'Show Learning Progress',
      description:
        'Display your learning progress, completed courses, and skill trees on your public profile.',
      warning: !formData.showProgressPublicly
        ? 'Your learning progress will remain private.'
        : undefined,
      dependsOn: 'public_profile',
    },
    {
      key: 'allowMessages' as const,
      icon: MessageCircle,
      title: 'Allow Messages',
      description:
        'Let other users send you direct messages about learning opportunities and collaboration.',
      warning: !formData.allowMessages
        ? "Other users won't be able to contact you directly."
        : undefined,
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control who can see your profile and learning activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {privacyOptions.map(
                (
                  { key, icon: Icon, title, description, warning, dependsOn },
                  index
                ) => {
                  const isDisabled =
                    dependsOn && !formData[dependsOn as keyof typeof formData];

                  return (
                    <motion.div
                      key={key}
                      className={`rounded-lg border border-border p-4 transition-all
                      duration-200 hover:shadow-md dark:border-gray-700
                      ${
                        isDisabled
                          ? 'bg-gray-50 opacity-50 dark:bg-gray-800/30'
                          : 'hover:border-primary/20 hover:bg-gray-50 dark:hover:border-primary/30 dark:hover:bg-gray-800/50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={!isDisabled ? { scale: 1.02 } : {}}
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <Icon className="size-5 text-muted-foreground dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-base font-medium text-foreground dark:text-gray-100">
                                {title}
                              </Label>
                              <p className="mt-1 text-sm text-muted-foreground dark:text-gray-400">
                                {description}
                              </p>
                              {warning && (
                                <p className="mt-2 flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                                  <Shield className="size-4" />
                                  {warning}
                                </p>
                              )}
                              {isDisabled && (
                                <p className="mt-2 text-sm text-muted-foreground dark:text-gray-500">
                                  This setting requires a public profile to be
                                  enabled.
                                </p>
                              )}
                            </div>
                            <Switch
                              checked={formData[key] && !isDisabled}
                              onCheckedChange={() =>
                                !isDisabled && handleToggle(key)
                              }
                              disabled={isLoading || Boolean(isDisabled)}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>

            <div className="flex justify-end border-t pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Privacy Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Privacy Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Privacy Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-sm font-medium text-foreground dark:text-gray-200">
                  What others can see when your profile is public:
                </h4>
                <ul className="ml-4 space-y-1 text-sm text-muted-foreground dark:text-gray-400">
                  <li>• Your name, bio, and profile picture</li>
                  <li>• Your learning goals and skill level</li>
                  <li>• Areas of expertise and certifications</li>
                  <li>• Learning progress (if enabled)</li>
                  <li>• Completed skill trees and achievements (if enabled)</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-foreground dark:text-gray-200">
                  What&apos;s always private:
                </h4>
                <ul className="ml-4 space-y-1 text-sm text-muted-foreground dark:text-gray-400">
                  <li>• Your email address and contact information</li>
                  <li>• Your account settings and preferences</li>
                  <li>• Private messages and communications</li>
                  <li>• Detailed learning analytics and time spent</li>
                </ul>
              </div>{' '}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <h4 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
                  Tip
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Having a public profile can help you connect with other
                  learners and providers, potentially leading to collaboration
                  opportunities and mentorship.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

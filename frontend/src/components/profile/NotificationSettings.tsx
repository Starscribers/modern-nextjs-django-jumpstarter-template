'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { userService } from '@/services/userService';
import type { UserSettings } from '@/types/api';

interface NotificationSettingsProps {
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

export function NotificationSettings({
  settings,
  onUpdate,
}: NotificationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailNotifications: settings.emailNotifications,
    pushNotifications: settings.pushNotifications,
    courseReminders: settings.courseReminders,
    achievementNotifications: settings.achievementNotifications,
    weeklyProgressEmails: settings.weeklyProgressEmails,
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
        title: 'Notification settings updated',
        description:
          'Your notification preferences have been saved successfully.',
      });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      toast({
        title: 'Update failed',
        description:
          'Failed to update notification settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const notificationOptions = [
    {
      key: 'emailNotifications' as const,
      icon: Mail,
      title: 'Email Notifications',
      description:
        'Receive notifications via email for important updates and activities.',
    },
    {
      key: 'pushNotifications' as const,
      icon: Smartphone,
      title: 'Push Notifications',
      description:
        'Get instant notifications on your device for real-time updates.',
    },
    {
      key: 'courseReminders' as const,
      icon: Calendar,
      title: 'Course Reminders',
      description:
        'Receive reminders about upcoming courses and learning goals.',
    },
    {
      key: 'achievementNotifications' as const,
      icon: Trophy,
      title: 'Achievement Notifications',
      description:
        'Get notified when you unlock achievements or reach milestones.',
    },
    {
      key: 'weeklyProgressEmails' as const,
      icon: Bell,
      title: 'Weekly Progress Reports',
      description:
        'Receive weekly summaries of your learning progress and achievements.',
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
            <Bell className="size-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified about your learning progress and
            platform updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {notificationOptions.map(
                ({ key, icon: Icon, title, description }, index) => (
                  <motion.div
                    key={key}
                    className="flex items-start gap-4 rounded-lg border border-border p-4 transition-all
                    duration-200 hover:border-primary/20 hover:bg-gray-50 hover:shadow-md
                    dark:border-gray-700 dark:hover:border-primary/30 dark:hover:bg-gray-800/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
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
                        </div>
                        <Switch
                          checked={formData[key]}
                          onCheckedChange={() => handleToggle(key)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>

            <div className="flex justify-end border-t pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Notification Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground dark:text-gray-400">
              <div className="flex items-start gap-2">
                <div className="mt-2 size-2 shrink-0 rounded-full bg-primary"></div>
                <p>
                  Email notifications are sent to your registered email address.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-2 size-2 shrink-0 rounded-full bg-primary"></div>
                <p>
                  Push notifications require browser permission and work best
                  when you keep the site open.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-2 size-2 shrink-0 rounded-full bg-primary"></div>
                <p>
                  You can change these settings at any time from your profile
                  page.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-2 size-2 shrink-0 rounded-full bg-primary"></div>
                <p>
                  Critical account notifications (like password changes) will
                  always be sent regardless of these settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

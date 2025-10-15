'use client';

import { Badge } from '@/components/ui/badge';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import type { UserDetail } from '@/types/api';
import { Calendar, Globe, Link as LinkIcon, MapPin, User } from 'lucide-react';
import { useState } from 'react';

interface ProfileSettingsProps {
  profile: UserDetail; // Using UserDetail instead of UserProfile
  onUpdate: (profile: UserDetail) => void;
}

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  const [profileData, setProfileData] = useState({
    displayName: profile.firstName + ' ' + profile.lastName,
    bio: profile.bio || '',
    location: '', // UserDetail doesn't have location, so default empty
    website: '', // UserDetail doesn't have website, so default empty
    timezone: 'UTC', // Default timezone
    language: profile.preferredLanguage || 'en',
    birthDate: profile.dateOfBirth || '',
    publicProfile: profile.publicProfile !== false,
    showProgress: true, // Default value since not in UserDetail
    showAchievements: true, // Default value since not in UserDetail
    allowConnections: true, // Default value since not in UserDetail
  });

  const [isSaving, setIsSaving] = useState(false);

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'zh', label: 'Chinese (Simplified)' },
    { value: 'zh-TW', label: 'Chinese (Traditional)' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        firstName: profileData.displayName.split(' ')[0] || profile.firstName,
        lastName:
          profileData.displayName.split(' ').slice(1).join(' ') ||
          profile.lastName,
        bio: profileData.bio,
        preferredLanguage: profileData.language,
        dateOfBirth: profileData.birthDate,
        publicProfile: profileData.publicProfile,
      };

      onUpdate(updatedProfile);

      toast({
        title: 'Profile settings saved',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Failed to save profile',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="border-0 bg-gradient-to-br from-white to-purple-50/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 dark:from-gray-900 dark:to-purple-950/30 dark:hover:shadow-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-purple-600 dark:text-purple-400" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update your basic profile information and display preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profileData.displayName}
                onChange={e => handleInputChange('displayName', e.target.value)}
                placeholder="How your name appears to others"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="mt-1 pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={e => handleInputChange('bio', e.target.value)}
              placeholder="Tell others about yourself, your interests, and learning goals..."
              rows={3}
              className="mt-1"
            />
            <div className="mt-1 text-xs text-muted-foreground">
              {profileData.bio.length}/500 characters
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                value={profileData.website}
                onChange={e => handleInputChange('website', e.target.value)}
                placeholder="https://your-website.com"
                className="mt-1 pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            Localization
          </CardTitle>
          <CardDescription>
            Set your preferred language and timezone for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={profileData.language}
                onValueChange={value => handleInputChange('language', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={profileData.timezone}
                onValueChange={value => handleInputChange('timezone', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            Personal Information
          </CardTitle>
          <CardDescription>
            Optional personal details (only visible to you unless you choose to
            share)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="birthDate">Birth Date (Optional)</Label>
            <Input
              id="birthDate"
              type="date"
              value={profileData.birthDate}
              onChange={e => handleInputChange('birthDate', e.target.value)}
              className="mt-1"
            />
            <div className="mt-1 text-xs text-muted-foreground">
              Used for age-appropriate content recommendations
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            Profile Visibility
          </CardTitle>
          <CardDescription>
            Control what information is visible to other users and instructors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Public Profile</Label>
              <div className="text-sm text-muted-foreground">
                Make your profile visible to other learners and instructors
              </div>
            </div>
            <Switch
              checked={profileData.publicProfile}
              onCheckedChange={checked =>
                handleInputChange('publicProfile', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Learning Progress</Label>
              <div className="text-sm text-muted-foreground">
                Display your completed courses and skill trees
              </div>
            </div>
            <Switch
              checked={profileData.showProgress}
              onCheckedChange={checked =>
                handleInputChange('showProgress', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Show Achievements</Label>
              <div className="text-sm text-muted-foreground">
                Display your badges and achievements publicly
              </div>
            </div>
            <Switch
              checked={profileData.showAchievements}
              onCheckedChange={checked =>
                handleInputChange('showAchievements', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Allow Connections</Label>
              <div className="text-sm text-muted-foreground">
                Let other users connect with you and send messages
              </div>
            </div>
            <Switch
              checked={profileData.allowConnections}
              onCheckedChange={checked =>
                handleInputChange('allowConnections', checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Current status and tier information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="default">
                  {profile.userType === 'provider' ? 'Provider' : 'Learner'}
                </Badge>
                <Badge variant="secondary">Free Tier</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(profile.dateJoined).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline">Upgrade Account</Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}

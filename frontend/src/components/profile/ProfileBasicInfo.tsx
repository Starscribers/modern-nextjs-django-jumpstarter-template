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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDebouncedButton } from '@/hooks/use-debounced-button';
import { toast } from '@/hooks/use-toast';
import { backendImageLoader } from '@/lib/imageLoader';
import { getBestImageUrl } from '@/lib/imageUtils';
import { userService } from '@/services/userService';
import type { UserDetail } from '@/types/api';
import { Camera, Lock, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ProfileBasicInfoProps {
  profile: UserDetail;
  onUpdate: (profile: UserDetail) => void;
}

export function ProfileBasicInfo({ profile, onUpdate }: ProfileBasicInfoProps) {
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    getBestImageUrl(profile.avatar)
  );
  const [formData, setFormData] = useState({
    username: profile.username || '',
    email: profile.email || '',
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    bio: profile.bio || '',
    dateOfBirth: profile.dateOfBirth || null,
    preferredLanguage: profile.preferredLanguage || 'en',
  });

  const saveButton = useDebouncedButton({
    defaultLabel: 'Save Changes',
    loadingLabel: 'Saving...',
    successLabel: 'Saved Successfully',
    errorLabel: 'Save Failed',
    debounceMs: 150,
    resetAfterMs: 2500,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic form validation (username is immutable, so we don't validate it)
    if (!formData.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Email is required.',
        variant: 'destructive',
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    saveButton.setLoading();

    // Exclude username from the update data since it's immutable
    const updateData = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      bio: formData.bio,
      dateOfBirth: formData.dateOfBirth || undefined,
      preferredLanguage: formData.preferredLanguage,
    };

    try {
      // First update basic profile info (without username)
      const updatedProfile = await userService.updateBasicInfo(updateData);

      // Then upload avatar if a new one was selected
      if (selectedAvatarFile) {
        try {
          const avatarResult =
            await userService.uploadAvatar(selectedAvatarFile);
          // Update the profile with the new avatar data
          updatedProfile.avatar = avatarResult.avatar;
          setSelectedAvatarFile(null);
          setAvatarPreview(getBestImageUrl(avatarResult.avatar));

          toast({
            title: 'Profile Updated Successfully',
            description: 'Your profile information and avatar have been saved.',
          });
          saveButton.setSuccess();
        } catch (avatarError) {
          console.error('Failed to upload avatar:', avatarError);
          toast({
            title: 'Profile Updated (Avatar Failed)',
            description:
              'Profile info saved, but avatar upload failed. Please try uploading the avatar again.',
            variant: 'destructive',
          });
          saveButton.setError();
        }
      } else {
        toast({
          title: 'Profile Updated Successfully',
          description: 'Your profile information has been saved.',
        });
        saveButton.setSuccess();
      }

      onUpdate(updatedProfile);
    } catch (error) {
      console.error('Failed to update profile:', error);

      // More specific error messages based on error type
      let errorMessage = 'Failed to update profile. Please try again.';

      if (error instanceof Error) {
        if (
          error.message.includes('network') ||
          error.message.includes('fetch')
        ) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        } else if (error.message.includes('validation')) {
          errorMessage = 'Please check your input and try again.';
        } else if (error.message.includes('unauthorized')) {
          errorMessage = 'You are not authorized to perform this action.';
        }
      }

      toast({
        title: 'Update Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      saveButton.setError();
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: '📁 File Too Large',
        description:
          'Avatar image must be less than 5MB. Please choose a smaller image.',
        variant: 'destructive',
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file (JPG, PNG, GIF, etc.).',
        variant: 'destructive',
      });
      return;
    }

    // Success message for valid file selection
    toast({
      title: 'Avatar Selected',
      description: 'Avatar image selected. Click "Save Changes" to upload.',
    });

    // Store the file for later upload
    setSelectedAvatarFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = e => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 duration-500 animate-in fade-in-0">
      {/* Avatar Section */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 dark:from-gray-900 dark:to-gray-800/30 dark:hover:shadow-blue-500/20">
        <CardHeader className="transition-all duration-200">
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-semibold text-transparent dark:from-blue-400 dark:to-purple-400">
            <Camera className="size-5 text-blue-500 transition-transform duration-200 group-hover:scale-110 dark:text-blue-400" />
            Profile Picture
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Upload a picture to personalize your profile
          </CardDescription>
        </CardHeader>

        <CardContent className="transition-all duration-200">
          <div className="flex items-center gap-6">
            <div className="group relative">
              <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:group-hover:border-blue-500">
                {avatarPreview ? (
                  <Image
                    loader={backendImageLoader}
                    src={avatarPreview}
                    alt="Profile picture preview"
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                ) : profile.avatar ? (
                  <Image
                    loader={backendImageLoader}
                    src={
                      getBestImageUrl(profile.avatar) || '/default-avatar.png'
                    }
                    alt={
                      profile.avatar.altText ||
                      // Fallback for any legacy data during transition
                      (profile.avatar as any).alt_text ||
                      'Profile picture'
                    }
                    width={96}
                    height={96}
                    className="size-full object-cover"
                  />
                ) : (
                  <User className="size-12 text-gray-400 transition-all duration-200 group-hover:scale-110 group-hover:text-blue-400 dark:text-gray-500 dark:group-hover:text-blue-400" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 dark:bg-black/70"
              >
                <Camera className="size-6 scale-75 text-foreground transition-all duration-200 group-hover:scale-100" />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="sr-only"
                disabled={saveButton.disabled}
              />
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Upload a JPG, PNG, or GIF image. Max file size: 5MB.
              </p>
              <label htmlFor="avatar-upload">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={saveButton.disabled}
                  className="transition-all duration-200 hover:scale-105 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md active:scale-95 dark:hover:border-blue-600 dark:hover:bg-blue-950"
                  asChild
                >
                  <span className="flex cursor-pointer items-center gap-2">
                    <Camera className="size-4 transition-transform duration-200 group-hover:rotate-12" />
                    Change Picture
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="border-0 bg-gradient-to-br from-white to-purple-50/30 transition-all delay-200 duration-300 animate-in slide-in-from-bottom-4 hover:shadow-lg hover:shadow-purple-500/10 dark:from-gray-900 dark:to-purple-950/30 dark:hover:shadow-purple-500/20">
        <CardHeader className="transition-all duration-200">
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg font-semibold text-transparent dark:from-purple-400 dark:to-pink-400">
            <User className="size-5 text-purple-500 transition-transform duration-200 group-hover:scale-110 dark:text-purple-400" />
            Basic Information
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="transition-all duration-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="group transition-all duration-200 hover:scale-[1.02]">
                <Label
                  htmlFor="username"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-purple-600 dark:text-gray-300 dark:group-hover:text-purple-400"
                >
                  Username
                  <Lock className="size-3 text-muted-foreground transition-all duration-200 group-hover:text-purple-500 dark:group-hover:text-purple-400" />
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  disabled={true}
                  readOnly
                  className="cursor-not-allowed bg-muted text-muted-foreground transition-all duration-200 focus:ring-2 focus:ring-purple-500/20 dark:bg-gray-800 dark:text-gray-400"
                  title="Username cannot be changed after account creation"
                />
                <p className="mt-1 text-xs text-muted-foreground transition-colors duration-200 group-hover:text-purple-500 dark:text-gray-500 dark:group-hover:text-purple-400">
                  Username cannot be changed after account creation
                </p>
              </div>
              <div className="group transition-all duration-200 hover:scale-[1.02]">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  disabled={saveButton.disabled}
                  className="transition-all duration-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 dark:hover:border-blue-500 dark:focus:border-blue-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="group transition-all duration-200 hover:scale-[1.02]">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-green-600 dark:text-gray-300 dark:group-hover:text-green-400"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={e => handleInputChange('firstName', e.target.value)}
                  disabled={saveButton.disabled}
                  className="transition-all duration-200 hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 dark:hover:border-green-500 dark:focus:border-green-400"
                />
              </div>
              <div className="group transition-all duration-200 hover:scale-[1.02]">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-green-600 dark:text-gray-300 dark:group-hover:text-green-400"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={e => handleInputChange('lastName', e.target.value)}
                  disabled={saveButton.disabled}
                  className="transition-all duration-200 hover:border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/50 dark:hover:border-green-500 dark:focus:border-green-400"
                />
              </div>
            </div>

            <div className="group transition-all duration-200 hover:scale-[1.01]">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-indigo-600 dark:text-gray-300 dark:group-hover:text-indigo-400"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('bio', e.target.value)
                }
                disabled={saveButton.disabled}
                placeholder="Tell us about yourself..."
                className="min-h-[100px] resize-none transition-all duration-200 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 dark:hover:border-indigo-500 dark:focus:border-indigo-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="group transition-all duration-200 hover:scale-[1.02]">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-orange-600 dark:text-gray-300 dark:group-hover:text-orange-400"
                >
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={e =>
                    handleInputChange('dateOfBirth', e.target.value || null)
                  }
                  disabled={saveButton.disabled}
                  className="transition-all duration-200 hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50 dark:hover:border-orange-500 dark:focus:border-orange-400"
                />
              </div>
              <div className="group transition-all duration-200 hover:scale-[1.02]">
                <Label
                  htmlFor="preferredLanguage"
                  className="text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-teal-600 dark:text-gray-300 dark:group-hover:text-teal-400"
                >
                  Preferred Language
                </Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={value =>
                    handleInputChange('preferredLanguage', value)
                  }
                  disabled={saveButton.disabled}
                >
                  <SelectTrigger className="transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/50 dark:hover:border-teal-500 dark:focus:border-teal-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="duration-200 animate-in fade-in-0 zoom-in-95">
                    <SelectItem
                      value="en"
                      className="transition-colors duration-150 hover:bg-teal-50 dark:hover:bg-teal-950"
                    >
                      English
                    </SelectItem>
                    <SelectItem
                      value="es"
                      className="transition-colors duration-150 hover:bg-teal-50 dark:hover:bg-teal-950"
                    >
                      Spanish
                    </SelectItem>
                    <SelectItem
                      value="fr"
                      className="transition-colors duration-150 hover:bg-teal-50 dark:hover:bg-teal-950"
                    >
                      French
                    </SelectItem>
                    <SelectItem
                      value="de"
                      className="transition-colors duration-150 hover:bg-teal-50 dark:hover:bg-teal-950"
                    >
                      German
                    </SelectItem>
                    <SelectItem
                      value="ja"
                      className="transition-colors duration-150 hover:bg-teal-50 dark:hover:bg-teal-950"
                    >
                      Japanese
                    </SelectItem>
                    <SelectItem
                      value="zh"
                      className="transition-colors duration-150 hover:bg-teal-50 dark:hover:bg-teal-950"
                    >
                      Chinese
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={saveButton.disabled}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-2.5 font-medium text-foreground transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 disabled:hover:scale-100 disabled:hover:shadow-none dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 dark:hover:shadow-blue-500/30"
              >
                <span className="flex items-center gap-2">
                  {saveButton.disabled && (
                    <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  <span className="transition-all duration-200">
                    {saveButton.label}
                  </span>
                </span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

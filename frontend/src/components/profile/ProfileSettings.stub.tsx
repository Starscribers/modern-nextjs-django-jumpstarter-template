'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { UserProfile } from '@/types/api';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-muted-foreground">Profile settings coming soon...</p>
      </CardContent>
    </Card>
  );
}

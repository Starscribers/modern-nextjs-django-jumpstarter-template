'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { UserSettings } from '@/types/api';

interface LearningPreferencesProps {
  settings: UserSettings;
  onUpdate: (settings: UserSettings) => void;
}

export function LearningPreferences({
  settings,
  onUpdate,
}: LearningPreferencesProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-muted-foreground">
          Learning preferences coming soon...
        </p>
      </CardContent>
    </Card>
  );
}

'use client';

import { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  UserIcon,
  AcademicCapIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface UserProfileProps {
  user: User;
  className?: string;
}

export default function UserProfile({
  user,
  className = '',
}: UserProfileProps) {
  const getRoleColor = (role: string) => {
    return role === 'provider'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  const getRoleIcon = (role: string) => {
    return role === 'provider' ? AcademicCapIcon : UserIcon;
  };


  return (
    <div className={`rounded-lg bg-white p-6 shadow ${className}`}>

      {user.joinedAt && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            Member since{' '}
            {new Date(user.joinedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useRef } from 'react';
import { Camera, User, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AvatarUploaderProps {
  previewUrl?: string | null;
  onSelect: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  accept?: string;
  className?: string;
  showButtons?: boolean; // show Upload/Remove buttons next to the avatar
}

export function AvatarUploader({
  previewUrl,
  onSelect,
  onRemove,
  disabled = false,
  size = 'md',
  accept = 'image/*',
  className = '',
  showButtons = true,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-14 w-14',
    md: 'h-24 w-24',
    lg: 'h-28 w-28',
  }[size];

  const openPicker = () => inputRef.current?.click();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSelect(file);
    // reset so selecting the same file again still triggers change
    e.currentTarget.value = '';
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="group relative">
        <div
          className={`${sizeClasses} flex select-none items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:group-hover:border-blue-500`}
        >
          { }
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar preview" className="size-full object-cover" />
          ) : (
            <User className="size-8 text-gray-400 transition-all duration-200 group-hover:scale-110 group-hover:text-blue-400 dark:text-gray-500 dark:group-hover:text-blue-400" />
          )}
        </div>
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled}
          className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 dark:bg-black/70"
          aria-label="Change avatar"
        >
          <Camera className="size-6 scale-75 text-foreground transition-all duration-200 group-hover:scale-100" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onChange}
          className="sr-only"
          disabled={disabled}
        />
      </div>

      {showButtons && (
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={openPicker} disabled={disabled}>
            <Upload className="mr-2 size-4" /> Upload
          </Button>
          {onRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove} disabled={disabled}>
              <Trash2 className="mr-2 size-4" /> Remove
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default AvatarUploader;

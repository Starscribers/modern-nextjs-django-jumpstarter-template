'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { ImageService, ImageUploadResponse } from '@/services/imageService';

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (url: string) => void;
  onImageUploaded?: (image: ImageUploadResponse) => void;
  title?: string;
  placeholder?: string;
  imageType?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export function ImageUpload({
  value,
  onChange,
  onImageUploaded,
  title = 'Upload Image',
  placeholder = 'Enter image URL or upload file',
  imageType = 'general',
  className = '',
  accept = 'image/*',
  maxSize = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use local uploaded URL if available, otherwise use prop value
  const displayValue = uploadedUrl || value || '';

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = ImageService.validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: 'Invalid File',
        description: validation.error,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadedImage = await ImageService.uploadImage(
        file,
        file.name,
        `${title} - ${file.name}`,
        imageType
      );

      const imageUrl = uploadedImage.originalImage || '';

      if (!imageUrl) {
        console.error('No valid image URL found in response:', uploadedImage);
        toast({
          title: 'Upload Error',
          description: 'Image uploaded but no URL returned. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      // Update local state immediately for preview
      setUploadedUrl(imageUrl);

      // Notify parent component
      onChange(imageUrl);
      onImageUploaded?.(uploadedImage);

      toast({
        title: 'Upload Successful',
        description: 'Your image has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setUploadedUrl('');
    onChange('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview */}
      {displayValue && (
        <div className="relative">
          <div className="overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={displayValue}
              alt="Preview"
              className="h-32 w-full object-cover"
              onLoad={() => console.log('Image loaded successfully:', displayValue)}
              onError={(e) => {
                console.error('Image failed to load:', displayValue);
                // Handle broken image
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden p-4 text-center text-gray-500">
              <ImageIcon className="mx-auto mb-2 size-8" />
              <p className="text-sm">Failed to load image</p>
              <p className="text-xs text-gray-400">{displayValue}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute right-2 top-2"
            onClick={clearImage}
          >
            <X className="size-3" />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            openFileDialog();
          }
        }}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="mb-2 size-8 animate-spin text-primary" />
            <p className="text-sm text-gray-600">Uploading image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="mb-2 size-8 text-gray-400" />
            <p className="mb-1 text-sm text-gray-600">
              Drop an image here or click to browse
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* URL Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Or enter image URL:
        </label>
        <Input
          type="url"
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setUploadedUrl(''); // Clear local state when manually entering URL
            onChange(newValue);
          }}
        />
      </div>
    </div>
  );
}

export default ImageUpload;

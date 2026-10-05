'use client';

import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
} from '@/components/ui/shadcn-io/image-crop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XIcon, UserCircle2, Upload } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';

interface AvatarCropImageProps {
  onImageCropped?: (imageFile: File | null) => void;
}

const dataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

const AvatarCropImage = ({ onImageCropped }: AvatarCropImageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCroppedImage(null);
    }
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
    onImageCropped?.(null);
  };

  const handleCropComplete = (imageDataUrl: string) => {
    setCroppedImage(imageDataUrl);
    const croppedFile = dataURLtoFile(imageDataUrl, 'avatar-cropped.png');
    onImageCropped?.(croppedFile);
  };

  if (!selectedFile) {
    return (
      <div className="inline-flex flex-col items-center">
        <button
          type="button"
          onClick={handleOpenFileDialog}
          className="relative w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors flex items-center justify-center bg-muted/20 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Upload a profile picture"
        >
          <div className="flex flex-col items-center gap-1">
            <UserCircle2
              className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors"
              aria-hidden="true"
              focusable="false"
            />
            <Upload
              className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors"
              aria-hidden="true"
              focusable="false"
            />
          </div>
        </button>

        <Input
          ref={fileInputRef}
          id="avatar-upload"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          type="file"
          tabIndex={-1} 
        />
      </div>
    );
  }

  if (croppedImage) {
    return (
      <div className="relative inline-block">
        <img
          alt="Preview of your profile picture"
          className="overflow-hidden rounded-full w-24 h-24"
          src={croppedImage}
        />
        <Button
          onClick={handleReset}
          size="icon"
          type="button"
          variant="ghost"
          className="absolute -right-10 top-1/2 -translate-y-1/2"
          aria-label="Remove profile picture and choose another image"
        >
          <XIcon className="size-6" aria-hidden="true" focusable="false" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={1}
        circularCrop
        file={selectedFile}
        maxImageSize={1024 * 1024 * 5} 
        onChange={console.log}
        onComplete={console.log}
        onCrop={handleCropComplete}
        cropSize={{ width: 512, height: 512 }}
        aria-label="Image cropper for your profile picture"
        aria-describedby="avatar-crop-instructions"
      >
        <ImageCropContent className="max-w-md" />
        <p
          id="avatar-crop-instructions"
          className="text-xs teFxt-muted-foreground mt-2"
        >
          Adjust the image to fit inside the circle. When you&apos;re happy with
          the preview, choose &quot;Apply crop&quot;.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <ImageCropApply aria-label="Apply crop to profile picture" />
          <Button
            onClick={handleReset}
            size="icon"
            type="button"
            variant="ghost"
            aria-label="Cancel avatar selection"
          >
            <XIcon className="size-4" aria-hidden="true" focusable="false" />
          </Button>
        </div>
      </ImageCrop>
    </div>
  );
};

export default AvatarCropImage;

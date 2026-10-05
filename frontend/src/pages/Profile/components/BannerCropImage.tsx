'use client';
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from '@/components/ui/shadcn-io/image-crop';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XIcon } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';

interface BannerCropImageProps {
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

const BannerCropImage = ({ onImageCropped }: BannerCropImageProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setCroppedImage(null);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
    onImageCropped?.(null);
  };

  const handleCropComplete = (imageDataUrl: string) => {
    setCroppedImage(imageDataUrl);
    const croppedFile = dataURLtoFile(imageDataUrl, 'banner-cropped.png');
    onImageCropped?.(croppedFile);
  };

  if (!selectedFile) {
    return (
      <div className="space-y-1">
        <Input
          accept="image/*"
          className="w-fit"
          onChange={handleFileChange}
          type="file"
          aria-label="Upload a banner image"
          aria-describedby="banner-upload-hint"
        />
        <p
          id="banner-upload-hint"
          className="text-xs text-muted-foreground"
        >
          Choose an image to use as your banner.
        </p>
      </div>
    );
  }

  if (croppedImage) {
    return (
      <div className="space-y-4">
        <img
          alt="Preview of your banner image"
          src={croppedImage}
          className="w-full h-auto"
        />
        <Button
          onClick={handleReset}
          size="icon"
          type="button"
          variant="ghost"
          aria-label="Remove banner image and choose another"
        >
          <XIcon className="size-4" aria-hidden="true" focusable="false" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={4 / 1}
        file={selectedFile}
        maxImageSize={1024 * 1024 * 5}
        minWidth={600}
        minHeight={50}
        onChange={console.log}
        onComplete={console.log}
        cropSize={{ width: 1200, height: 300 }}
        onCrop={handleCropComplete}
        aria-label="Image cropper for your banner image"
        aria-describedby="banner-crop-instructions"
      >
        <ImageCropContent className="max-w-full" />
        <p
          id="banner-crop-instructions"
          className="text-xs text-muted-foreground mt-2"
        >
          Adjust the image to fit the banner frame. When you&apos;re happy with
          the preview, select &quot;Apply crop&quot;.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <ImageCropApply aria-label="Apply crop to banner image" />
          <ImageCropReset aria-label="Reset banner crop" />
          <Button
            onClick={handleReset}
            size="icon"
            type="button"
            variant="ghost"
            aria-label="Cancel banner selection"
          >
            <XIcon className="size-4" aria-hidden="true" focusable="false" />
          </Button>
        </div>
      </ImageCrop>
    </div>
  );
};

export default BannerCropImage;

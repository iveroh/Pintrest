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

interface PostCropImageProps {
  onImageCropped?: (imageFile: File | null) => void;
}

const PostCropImage = ({ onImageCropped }: PostCropImageProps) => {
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

  const handleCropComplete = async (imageDataUrl: string) => {
    setCroppedImage(imageDataUrl);

    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const file = new File([blob], selectedFile?.name || 'cropped-image.jpg', {
    type: blob.type || 'image/jpeg',
  });

  onImageCropped?.(file);

  };
  if (!selectedFile) {
    return (
      <Input
        accept="image/*"
        className="w-fit hover:bg-gray-100"
        onChange={handleFileChange}
        type="file"
      />
    );
  }

  if (croppedImage) {
    return (
      <div className="space-y-4">
        <img
          alt="Cropped"
          src={croppedImage}
          className="w-full h-auto"
        />
        <Button onClick={handleReset} size="icon" type="button" variant="ghost">
          <XIcon className="size-4" />
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={4/5}
        file={selectedFile}
        maxImageSize={1024 * 1024 * 5} // 5MB
        minWidth={400}
        minHeight={500}
        onChange={console.log}
        onComplete={console.log}
        cropSize={{ width: 560, height: 700 }}
        
        onCrop={handleCropComplete}
      >
        <ImageCropContent className="max-w-full" />
        <div className="flex items-center gap-2">
          <ImageCropApply />
          <ImageCropReset />
          <Button
            onClick={handleReset}
            size="icon"
            type="button"
            variant="ghost"
          >
            <XIcon className="size-4" />
          </Button>
        </div>
      </ImageCrop>
    </div>
  );
};
export default PostCropImage;
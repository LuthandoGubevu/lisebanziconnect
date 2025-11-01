
'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type ImageGalleryProps = {
  images: ImagePlaceholder[];
};

export function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImagePlaceholder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageClick = (image: ImagePlaceholder) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  return (
    <div>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex flex-wrap gap-4 justify-center">
          {images.map((image) => (
              <div
                key={image.id}
                className="w-[400px] h-[300px] relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={400}
                  height={300}
                  className="object-cover w-full h-full"
                  data-ai-hint={image.imageHint}
                />
              </div>
          ))}
        </div>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
          {selectedImage && (
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.description}
              width={1200}
              height={900}
              className="rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

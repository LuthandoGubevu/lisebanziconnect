"use client";

import Image from "next/image";
import { type ImagePlaceholder } from "@/lib/placeholder-images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ImageGalleryProps = {
  images: ImagePlaceholder[];
};

export function ImageGallery({ images }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  // Desktop view using Carousel
  return (
    <>
      <div className="hidden md:block">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                <div className="aspect-square relative group overflow-hidden rounded-lg">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white text-sm font-semibold">{image.description}</p>
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>

      {/* Mobile view using ScrollArea */}
      <div className="md:hidden">
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-max space-x-4 p-4">
                 {images.map((image) => (
                    <div key={image.id} className="w-[80vw] sm:w-[60vw] flex-shrink-0">
                         <div className="aspect-square relative group overflow-hidden rounded-lg">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                sizes="80vw"
                                className="object-cover"
                                data-ai-hint={image.imageHint}
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-0 left-0 p-4">
                                <p className="text-white text-sm font-semibold">{image.description}</p>
                            </div>
                        </div>
                    </div>
                 ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}

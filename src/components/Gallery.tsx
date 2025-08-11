
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';
import { StorageManager } from '@/utils/storageManager';
import { isValidGalleryImage } from '@/utils/galleryUtils';
import { listGalleryImages } from '@/utils/supabaseGallery';

const Gallery = () => {
  const isMobile = useIsMobile();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadFromSupabase = async (): Promise<string[]> => {
    try {
      const files = await listGalleryImages(200);
      const urls = files.map((f) => f.publicUrl).filter((u) => !!u);
      return urls;
    } catch (e) {
      console.warn('Failed to load from Supabase Storage. Falling back to local gallery.', e);
      return [];
    }
  };

  const loadGalleryImages = async () => {
    setIsLoading(true);
    let urls: string[] = await loadFromSupabase();

    if (urls.length === 0) {
      const images = StorageManager.getGalleryImages();
      const validImages = images.filter(img => isValidGalleryImage(img.url));
      urls = validImages.map(img => img.url);
    }

    if (urls.length > 0) {
      const randomized = shuffleArray(urls);
      setGalleryImages(randomized);
    } else {
      setGalleryImages([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadGalleryImages();
    const handleGalleryUpdate = () => {
      loadGalleryImages();
    };
    window.addEventListener('galleryImagesUpdated', handleGalleryUpdate);
    return () => {
      window.removeEventListener('galleryImagesUpdated', handleGalleryUpdate);
    };
  }, []);

  useEffect(() => {
    galleryImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [galleryImages]);

  return (
    <section id="gallery" className="section-padding gradient-bg">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-8 md:mb-12 text-fellers-white">OUR CUSTOMERS</h2>
        {isLoading ? (
          <div className="text-center text-fellers-white">
            <p>Loading gallery...</p>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="text-center text-fellers-white">
            <p className="text-lg mb-4">No images available yet.</p>
            <p className="text-sm opacity-75">Images will appear here once uploaded by the admin.</p>
          </div>
        ) : (
          <div className="relative px-2 md:px-12">
            <Carousel 
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
                containScroll: "trimSnaps",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-1 sm:-ml-2">
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index} className="basis-1/2 sm:basis-1/2 lg:basis-1/3 pl-1 sm:pl-2">
                    <div className="p-1 sm:p-2">
                      <div className="overflow-hidden rounded-lg border-2 border-fellers-green/50 hover:border-fellers-green transition-all duration-300">
                        <AspectRatio ratio={16 / 9} className="bg-black">
                          <img
                            src={image}
                            alt={`Fellers Resources heavy towing equipment ${index + 1}`}
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        </AspectRatio>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="flex -left-4 md:-left-6 h-8 w-8 md:h-10 md:w-10" />
              <CarouselNext className="flex -right-4 md:-right-6 h-8 w-8 md:h-10 md:w-10" />
            </Carousel>
            <div className="md:hidden text-center mt-4">
              <p className="text-sm text-fellers-white/70">← Swipe to see more →</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

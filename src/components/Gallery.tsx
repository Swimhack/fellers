
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

const Gallery = () => {
  const isMobile = useIsMobile();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadGalleryImages = () => {
    console.log('Loading gallery images...');
    const images = StorageManager.getGalleryImages();
    console.log('Loaded images:', images.length);
    
    if (images.length > 0) {
      const validImages = images.filter(img => isValidGalleryImage(img.url));
      const sortedImages = validImages.sort((a, b) => a.order - b.order);
      const imageUrls = sortedImages.map(img => img.url);
      setGalleryImages(imageUrls);
      console.log('Gallery images set:', imageUrls.length);
    } else {
      setGalleryImages([]);
      console.log('No valid images found');
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadGalleryImages();

    // Listen for storage changes
    const handleGalleryUpdate = () => {
      console.log('Gallery images updated via event');
      loadGalleryImages();
    };

    window.addEventListener('galleryImagesUpdated', handleGalleryUpdate);

    return () => {
      window.removeEventListener('galleryImagesUpdated', handleGalleryUpdate);
    };
  }, []);

  useEffect(() => {
    // Preload gallery images
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
              }}
              className="w-full"
            >
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
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
              <CarouselPrevious className="hidden md:flex -left-6" />
              <CarouselNext className="hidden md:flex -right-6" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

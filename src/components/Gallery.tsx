
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
import { filterGalleryImages } from '@/utils/galleryUtils';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  order: number;
}

const Gallery = () => {
  const isMobile = useIsMobile();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const loadGalleryImages = () => {
    const savedImages = localStorage.getItem('galleryImages');
    if (savedImages) {
      try {
        const parsedImages: GalleryImage[] = JSON.parse(savedImages);
        const filteredImages = filterGalleryImages(parsedImages);
        
        if (filteredImages.length > 0) {
          const sortedImages = [...filteredImages].sort((a, b) => a.order - b.order);
          setGalleryImages(sortedImages.map(img => img.url));
        } else {
          setGalleryImages([]);
        }
        
        // Update localStorage with filtered images if any were removed
        if (filteredImages.length !== parsedImages.length) {
          localStorage.setItem('galleryImages', JSON.stringify(filteredImages));
        }
      } catch (error) {
        console.error("Error parsing gallery images from localStorage:", error);
        setGalleryImages([]);
      }
    } else {
      setGalleryImages([]);
    }
  };

  useEffect(() => {
    // Initial load
    loadGalleryImages();

    // Listen for storage changes (when admin makes changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'galleryImages') {
        console.log('Gallery images updated from admin dashboard');
        loadGalleryImages();
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleGalleryUpdate = () => {
      console.log('Gallery images updated via custom event');
      loadGalleryImages();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('galleryImagesUpdated', handleGalleryUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
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

  // Don't render the gallery section if no images are available
  if (galleryImages.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="section-padding gradient-bg">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-8 md:mb-12 text-fellers-white">OUR CUSTOMERS</h2>
        
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
      </div>
    </section>
  );
};

export default Gallery;

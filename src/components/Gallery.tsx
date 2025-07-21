
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
  const [isLoading, setIsLoading] = useState(true);

  const loadGalleryImages = () => {
    console.log('Loading gallery images...');
    const savedImages = localStorage.getItem('galleryImages');
    console.log('Raw saved images:', savedImages);
    
    if (savedImages) {
      try {
        const parsedImages: GalleryImage[] = JSON.parse(savedImages);
        console.log('Parsed images:', parsedImages);
        const filteredImages = filterGalleryImages(parsedImages);
        console.log('Filtered images:', filteredImages);
        
        if (filteredImages.length > 0) {
          const sortedImages = [...filteredImages].sort((a, b) => a.order - b.order);
          const imageUrls = sortedImages.map(img => img.url);
          setGalleryImages(imageUrls);
          console.log('Gallery images set:', imageUrls);
        } else {
          setGalleryImages([]);
          console.log('No valid images found');
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
      console.log('No saved images found in localStorage');
      setGalleryImages([]);
    }
    
    setIsLoading(false);
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

  // Always render the gallery section (even when empty) so navigation works
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

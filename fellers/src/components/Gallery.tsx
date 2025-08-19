
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
    console.log('Loading gallery images from admin uploads...');
    setIsLoading(true);
    
    try {
      // Get images from the same source as admin bulk upload
      const images = StorageManager.getGalleryImages();
      console.log('Found admin uploaded images:', images.length);
      
      if (images.length > 0) {
        // Filter valid images and exclude logos
        const validImages = images.filter(img => {
          const isValid = isValidGalleryImage(img.url);
          const isNotLogo = !img.alt?.toLowerCase().includes('logo');
          return isValid && isNotLogo;
        });
        
        console.log('Valid non-logo images:', validImages.length);
        
        if (validImages.length > 0) {
          // Randomize and take only 3 images
          const shuffled = [...validImages].sort(() => Math.random() - 0.5);
          const selectedImages = shuffled.slice(0, 3);
          const imageUrls = selectedImages.map(img => img.url);
          
          setGalleryImages(imageUrls);
          console.log(`Gallery images loaded: ${imageUrls.length} random customer images`);
        } else {
          setGalleryImages([]);
          console.log('No valid customer images found (may all be logos)');
        }
      } else {
        setGalleryImages([]);
        console.log('No admin uploaded images found');
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
      setGalleryImages([]);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    loadGalleryImages();

    // Listen for gallery updates from admin
    const handleGalleryUpdate = () => {
      console.log('Gallery images updated via admin');
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
            <p className="text-lg opacity-30">Coming soon...</p>
          </div>
        ) : (
          <div className="relative px-2 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {galleryImages.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg border-2 border-fellers-green/50 hover:border-fellers-green transition-all duration-300">
                  <AspectRatio ratio={16 / 9} className="bg-black">
                    <img
                      src={image}
                      alt={`Customer project ${index + 1}`}
                      className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </AspectRatio>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

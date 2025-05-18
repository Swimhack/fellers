
import React, { useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

// Updated gallery images with heavy towing service related images
const galleryImages = [
  "/lovable-uploads/87ba276a-1d9f-4e50-b096-524af87702c9.png", // Keeping the user's uploaded tow truck image
  "https://images.unsplash.com/photo-1626964737076-ecb6b6a72d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Heavy tow truck
  "https://images.unsplash.com/photo-1598488035139-bd3eecb95fca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Tow truck in action
  "https://images.unsplash.com/photo-1607461042421-b47f193fe8e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Heavy vehicle recovery
  "https://images.unsplash.com/photo-1599256872237-5feccd4a1980?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"  // Heavy duty towing
];

const Gallery = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Preload gallery images
    galleryImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <section id="gallery" className="section-padding gradient-bg">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-8 md:mb-12 text-fellers-white">OUR EQUIPMENT</h2>
        
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

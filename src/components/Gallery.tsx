
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

// Added the uploaded tow truck image as the first item in the gallery
const galleryImages = [
  "/lovable-uploads/87ba276a-1d9f-4e50-b096-524af87702c9.png",
  "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1581222666174-a767898328fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1580820726687-30e7ba70d976?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
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
                          alt={`Fellers Resources truck ${index + 1}`}
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

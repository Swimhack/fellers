
import React, { useEffect, useRef } from 'react';
import { Phone } from 'lucide-react';
import FellersLogo from './FellersLogo';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';

// Updated with actual image
const backgroundImages = [
  "/lovable-uploads/eec8e3aa-b1ac-4cfb-9933-01465e9373e9.png",
  "https://images.unsplash.com/photo-1591768793355-74d04bb6608f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  "https://images.unsplash.com/photo-1581222666174-a767898328fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
];

const Hero = () => {
  const carouselRef = useRef(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Preload hero images
    backgroundImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden" id="hero">
      <div className="absolute inset-0 z-0">
        <Carousel ref={carouselRef} className="w-full h-full" opts={{
          loop: true,
          align: 'start',
          watchDrag: false
        }}>
          <CarouselContent className="h-full">
            {backgroundImages.map((src, index) => (
              <CarouselItem key={index} className="h-full">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `url(${src})`, 
                    filter: 'brightness(0.4)'
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="container mx-auto relative z-10 text-center px-4 py-10 md:py-16 lg:py-24">
        <div className="animate-fade-in-up">
          <FellersLogo className="mx-auto mb-4 md:mb-6" size={isMobile ? "default" : "large"} />
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-fellers-white mb-2 md:mb-4 drop-shadow-lg leading-tight">
            24/7 HEAVY-DUTY TOWING & RECOVERY
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-fellers-white mb-5 md:mb-8 max-w-3xl mx-auto">
            Insured • Bonded • Fast Response within 100 mi of Houston
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6 md:mt-8">
            <Button 
              className="bg-fellers-green hover:bg-fellers-green/90 text-fellers-charcoal text-base md:text-lg font-bold py-4 md:py-6 px-6 md:px-8 rounded-lg animate-pulse-light shadow-[0_0_15px_rgba(57,255,20,0.5)]"
            >
              <Phone className="w-5 h-5 md:w-6 md:h-6 mr-2" />
              <a href="tel:9366629930" className="w-full h-full flex items-center justify-center">CALL DISPATCH NOW</a>
            </Button>
            
            <Button 
              variant="outline" 
              className="border-2 border-fellers-white bg-fellers-purpleFrom hover:bg-fellers-purpleTo text-fellers-white font-bold py-4 md:py-6 px-6 md:px-8 rounded-lg transition-colors"
            >
              <a href="#contact" className="w-full h-full flex items-center justify-center">Request Service</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

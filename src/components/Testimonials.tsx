
import React from 'react';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    name: "John M.",
    role: "Fleet Manager",
    quote: "When our semi was stuck on I-10 with a full load, Fellers had us back on the road in record time. Their team was professional and efficient.",
    stars: 5
  },
  {
    name: "Sarah L.",
    role: "Transportation Director",
    quote: "We've used Fellers Resources for years for our heavy-duty recovery needs. They're always reliable, even in the middle of the night.",
    stars: 5
  },
  {
    name: "Michael T.",
    role: "Owner-Operator",
    quote: "After my rollover incident, Fellers handled everything with care. Their rotator service saved my equipment from serious damage.",
    stars: 5
  }
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-black/50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-fellers-white">WHAT OUR CLIENTS SAY</h2>
        
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-4/5 lg:basis-3/4">
                <div className="p-4 h-full">
                  <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-fellers-green/30 h-full flex flex-col">
                    <div className="flex mb-4">
                      {[...Array(testimonial.stars)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-fellers-green fill-fellers-green" />
                      ))}
                    </div>
                    
                    <blockquote className="text-lg md:text-xl italic text-fellers-white mb-6 flex-grow">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div>
                      <p className="font-semibold text-fellers-white">{testimonial.name}</p>
                      <p className="text-sm text-fellers-white/70">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;

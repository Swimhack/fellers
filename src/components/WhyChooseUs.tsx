
import React from 'react';
import { Check } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    'Certified operators with years of experience',
    'Modern fleet of well-maintained equipment',
    'Fully insured for your peace of mind',
    'Family-owned with personal service',
    'Fast response times, 24/7/365',
    'Specialized in heavy-duty recovery situations'
  ];

  return (
    <section id="why-choose-us" className="section-padding bg-black/30">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-8 md:mb-12 text-fellers-white gradient-bg text-transparent bg-clip-text">WHY CHOOSE US</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fade-in-up order-2 lg:order-1">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581222666174-a767898328fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Fellers Resources team" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h3 className="text-xl sm:text-2xl md:text-3xl mb-4 md:mb-6 text-fellers-white">THE HEAVY-DUTY RECOVERY EXPERTS</h3>
            <p className="mb-6 text-base sm:text-lg text-fellers-white/80">
              At Fellers Resources, we understand the critical nature of heavy-duty towing and recovery. 
              When you're dealing with valuable equipment and tight timelines, you need a partner you can trust.
            </p>
            
            <ul className="space-y-3 md:space-y-4">
              {reasons.map((reason, index) => (
                <li 
                  key={index} 
                  className="flex items-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-fellers-green rounded-full p-1 mr-3 flex-shrink-0">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-fellers-charcoal" />
                  </div>
                  <span className="text-sm sm:text-base text-fellers-white">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

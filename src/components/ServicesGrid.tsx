
import React from 'react';
import { Truck, ArrowUpDown, Car, RefreshCw, Forklift, Wrench, Map, AlertTriangle, Compass, Construction, Anchor, Layers } from 'lucide-react';

const services = [
  { icon: <Truck />, name: 'Heavy-Duty Towing & Recovery' },
  { icon: <ArrowUpDown />, name: 'Load Transfers' },
  { icon: <Car />, name: 'Light / Medium Towing & Recovery' },
  { icon: <RefreshCw />, name: 'Swap Outs' },
  { icon: <Forklift />, name: 'Landoll Service' },
  { icon: <Construction />, name: 'Rotator / Mobile Crane' },
  { icon: <Anchor />, name: 'Winch Outs' },
  { icon: <Layers />, name: 'Decking / Undecking' },
  { icon: <Wrench />, name: 'Minor Roadside Assistance' },
  { icon: <Map />, name: 'Local & Long Distance' },
  { icon: <AlertTriangle />, name: 'Hazmat Cleanup' },
  { icon: <Compass />, name: 'Load Shifts' }
];

const ServicesGrid = () => {
  return (
    <section id="services" className="section-padding bg-fellers-charcoal">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-8 md:mb-12 text-white font-bold">OUR SERVICES</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="border-2 border-fellers-green/50 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col items-center hover:border-fellers-green hover:bg-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(57,255,20,0.15)] active:bg-black/30"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-fellers-green mb-2 md:mb-4">
                {React.cloneElement(service.icon, { size: 32 })}
              </div>
              <h3 className="text-center text-white text-sm sm:text-base font-semibold">{service.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;

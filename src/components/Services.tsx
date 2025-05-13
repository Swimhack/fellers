
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Car, Wrench, Clock, Globe, CarFront } from 'lucide-react';

const serviceItems = [
  {
    title: "Heavy Duty Towing & Recovery",
    description: "Specialized equipment for large trucks and commercial vehicles",
    icon: <Truck className="h-8 w-8 text-fellers-green" />,
  },
  {
    title: "Light/Medium Duty Towing & Recovery",
    description: "Fast, reliable towing for cars, SUVs, and light trucks",
    icon: <Car className="h-8 w-8 text-fellers-green" />,
  },
  {
    title: "Load Transfers",
    description: "Safe and efficient cargo transfer services",
    icon: <Truck className="h-8 w-8 text-fellers-green" />,
  },
  {
    title: "Swap Outs",
    description: "Quick and professional vehicle exchanges",
    icon: <CarFront className="h-8 w-8 text-fellers-green" />,
  },
  {
    title: "Minor Roadside Assistance",
    description: "Battery jumps, flat tire changes, and lockout services",
    icon: <Wrench className="h-8 w-8 text-fellers-green" />,
  },
  {
    title: "Local & Long Distance",
    description: "Serving both local areas and long-distance towing needs",
    icon: <Globe className="h-8 w-8 text-fellers-green" />,
  },
  {
    title: "Landoll Service",
    description: "Specialized transport for construction equipment",
    icon: <Truck className="h-8 w-8 text-fellers-green" />,
  },
  {
    title: "24/7 Emergency Assistance",
    description: "Available around the clock for all your towing needs",
    icon: <Clock className="h-8 w-8 text-fellers-green" />,
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-fellers-lightGray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-fellers-darkNavy">Our Services</h2>
          <div className="w-20 h-1 bg-fellers-green mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide a comprehensive range of towing and recovery services to meet all your vehicle assistance needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceItems.map((service, index) => (
            <Card key={index} className="border-fellers-green/20 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  {service.icon}
                  <CardTitle className="text-fellers-purple">{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg font-medium text-fellers-darkNavy mb-6">
            Additional services: Rotator/Mobile Crane, Winch Outs, Decking/Undecking, Hazmat Cleanup, and Load Shifts
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;

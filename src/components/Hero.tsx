
import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import FellersLogo from './FellersLogo';

const Hero = () => {
  return (
    <section className="relative bg-fellers-darkNavy text-white pt-32 pb-20">
      <div className="absolute inset-0 bg-gradient-to-r from-fellers-darkNavy to-fellers-purple/90 opacity-90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <FellersLogo className="mb-6 mx-auto md:mx-0" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center md:text-left">
              Towing & Recovery Services
            </h1>
            <p className="text-xl mb-8 text-center md:text-left">
              24/7 Emergency Assistance - Insured and Bonded
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button className="bg-fellers-green hover:bg-fellers-green/90 text-fellers-darkNavy text-lg px-8 py-6">
                <Phone className="w-5 h-5 mr-2" />
                <a href="tel:+19366629930">Call Now: 936-662-9930</a>
              </Button>
              <Button variant="outline" className="border-fellers-green text-fellers-green hover:bg-fellers-green/10 text-lg px-8 py-6">
                <a href="#contact">Contact Us</a>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md p-1 bg-gradient-to-r from-fellers-green to-fellers-purple rounded-lg shadow-xl">
              <div className="bg-fellers-darkNavy p-6 rounded-lg">
                <h3 className="text-fellers-green text-xl font-bold mb-4">Fast Response Times</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-fellers-green rounded-full mr-2"></div>
                    <span>Available 24 hours a day, 7 days a week</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-fellers-green rounded-full mr-2"></div>
                    <span>Serving Katy/Houston, Texas</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-fellers-green rounded-full mr-2"></div>
                    <span>Professional & reliable service</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-fellers-green rounded-full mr-2"></div>
                    <span>Light, medium & heavy duty towing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

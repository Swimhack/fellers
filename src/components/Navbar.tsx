
import React from 'react';
import { Phone } from 'lucide-react';
import FellersLogo from './FellersLogo';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="bg-fellers-darkNavy py-4 px-6 shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <FellersLogo className="mr-6" />
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#services" className="text-white hover:text-fellers-green transition-colors">Services</a>
          <a href="#about" className="text-white hover:text-fellers-green transition-colors">About</a>
          <a href="#contact" className="text-white hover:text-fellers-green transition-colors">Contact</a>
        </div>
        
        <Button className="bg-fellers-green hover:bg-fellers-green/90 text-fellers-darkNavy font-semibold">
          <Phone className="w-4 h-4 mr-2" />
          <a href="tel:+19366629930">936-662-9930</a>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

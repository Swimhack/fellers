
import React from 'react';
import FellersLogo from './FellersLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-fellers-charcoal py-16 border-t border-fellers-green/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-8 md:mb-0">
            <FellersLogo size="default" />
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-end gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-fellers-green font-bold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-fellers-white hover:text-fellers-green transition-colors">Home</a></li>
                <li><a href="#services" className="text-fellers-white hover:text-fellers-green transition-colors">Services</a></li>
                <li><a href="#gallery" className="text-fellers-white hover:text-fellers-green transition-colors">Gallery</a></li>
                <li><a href="#contact" className="text-fellers-white hover:text-fellers-green transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="text-fellers-green font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li><a href="tel:9366629930" className="text-fellers-white hover:text-fellers-green transition-colors">936-662-9930 (Dispatch)</a></li>
                <li><a href="tel:2815745555" className="text-fellers-white hover:text-fellers-green transition-colors">281-574-5555 (Office)</a></li>
                <li><a href="mailto:dispatch@fellersresources.com" className="text-fellers-white hover:text-fellers-green transition-colors">dispatch@fellersresources.com</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-fellers-green/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-fellers-white/60 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Fellers Resources, LLC. All rights reserved.
            </p>
            
            <div>
              <p className="text-fellers-white/60 text-sm">
                <span className="text-fellers-green">24/7</span> Heavy-Duty Towing & Recovery | Katy / Houston, TX
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

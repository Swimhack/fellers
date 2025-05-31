
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
                <li><a href="#" className="text-white hover:text-fellers-green transition-colors font-medium">Home</a></li>
                <li><a href="#services" className="text-white hover:text-fellers-green transition-colors font-medium">Services</a></li>
                <li><a href="#gallery" className="text-white hover:text-fellers-green transition-colors font-medium">Gallery</a></li>
                <li><a href="#contact" className="text-white hover:text-fellers-green transition-colors font-medium">Contact</a></li>
              </ul>
            </div>
            
            <div className="text-center md:text-left">
              <h4 className="text-fellers-green font-bold mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li><a href="tel:9366629930" className="text-white hover:text-fellers-green transition-colors font-medium">936-662-9930 (Dispatch)</a></li>
                <li><a href="tel:2815745555" className="text-white hover:text-fellers-green transition-colors font-medium">281-574-5555 (Office)</a></li>
                <li><a href="mailto:dispatch@fellersresources.com" className="text-white hover:text-fellers-green transition-colors font-medium">dispatch@fellersresources.com</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-fellers-green/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-white/90 text-sm mb-2">
                &copy; {currentYear} Fellers Resources, LLC. All rights reserved.
              </p>
              <p className="text-white/90 text-sm">
                Powered by <a href="http://www.Stricklandtechnology.net" target="_blank" title="ai web design" className="text-fellers-green hover:text-white transition-colors">Strickland Technology</a>
              </p>
            </div>
            
            <div>
              <p className="text-white/90 text-sm">
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


import React, { useState, useEffect } from 'react';
import { Phone, Mail, Menu, X } from 'lucide-react';
import FellersLogo from './FellersLogo';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sticky top bar */}
      <div className="bg-fellers-purpleFrom py-2 px-4 sticky top-0 z-50 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <div className="hidden md:flex items-center space-x-6">
            <a href="tel:9366629930" className="flex items-center text-fellers-white hover:text-fellers-green transition-colors hover-lift">
              <Phone size={14} className="mr-1" /> 
              <span>Dispatch: 936-662-9930</span>
            </a>
            <a href="tel:2815745555" className="flex items-center text-fellers-white hover:text-fellers-green transition-colors hover-lift">
              <Phone size={14} className="mr-1" /> 
              <span>Office: 281-574-5555</span>
            </a>
          </div>
          
          <a href="tel:9366629930" className="md:hidden flex items-center text-fellers-white hover:text-fellers-green transition-colors hover-lift">
            <Phone size={14} className="mr-1" /> 
            <span>936-662-9930</span>
          </a>
          
          <a href="mailto:dispatch@fellersresources.com" className="flex items-center text-fellers-white hover:text-fellers-green transition-colors ml-auto hover-lift">
            <Mail size={14} className="mr-1" /> 
            <span className="hidden sm:inline">dispatch@fellersresources.com</span>
            <span className="sm:hidden">Email</span>
          </a>
        </div>
      </div>
      
      {/* Mobile menu overlay */}
      <div className={`fixed inset-0 bg-black/95 z-[60] flex flex-col items-center justify-center transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <button 
          onClick={closeMenu}
          className="absolute top-4 right-4 text-fellers-white hover:text-fellers-green"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center space-y-6 text-xl">
          <FellersLogo className="mb-6" size="default" />
          <a href="#services" onClick={closeMenu} className="text-fellers-white hover:text-fellers-green transition-colors">Services</a>
          <a href="#why-choose-us" onClick={closeMenu} className="text-fellers-white hover:text-fellers-green transition-colors">Why Choose Us</a>
          <a href="#gallery" onClick={closeMenu} className="text-fellers-white hover:text-fellers-green transition-colors">Gallery</a>
          <a href="#contact" onClick={closeMenu} className="text-fellers-white hover:text-fellers-green transition-colors">Contact</a>
          
          <div className="pt-6 mt-6 border-t border-fellers-green/30 w-48 text-center">
            <a 
              href="tel:9366629930" 
              className="bg-fellers-green text-fellers-charcoal font-bold py-3 px-6 rounded-lg inline-flex items-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              CALL NOW
            </a>
          </div>
        </div>
      </div>
      
      {/* Main navbar - appears on scroll */}
      <nav className={`${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'} fixed top-9 left-0 right-0 z-40 bg-black/80 backdrop-blur-md transition-all duration-300 py-3`}>
        <div className="container mx-auto flex items-center justify-between px-4">
          <a href="#" className="flex items-center">
            <FellersLogo size="small" />
          </a>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#services" className="text-fellers-white hover:text-fellers-green transition-colors hover-lift">Services</a>
            <a href="#why-choose-us" className="text-fellers-white hover:text-fellers-green transition-colors hover-lift">Why Choose Us</a>
            <a href="#gallery" className="text-fellers-white hover:text-fellers-green transition-colors hover-lift">Gallery</a>
            <a href="#contact" className="text-fellers-white hover:text-fellers-green transition-colors hover-lift">Contact</a>
          </div>
          
          <div className="flex items-center">
            <a href="tel:9366629930" className="bg-fellers-green text-fellers-charcoal font-bold py-2 px-4 rounded-lg hover-lift shadow-lg hidden md:inline-flex items-center">
              <Phone className="inline-block w-4 h-4 mr-2" strokeWidth={2.5} />
              <span>CALL NOW</span>
            </a>
            
            <button 
              onClick={toggleMobileMenu} 
              className="md:hidden text-fellers-white hover:text-fellers-green ml-4"
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;

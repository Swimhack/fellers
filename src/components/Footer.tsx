
import React from 'react';
import FellersLogo from './FellersLogo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-fellers-darkNavy text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <FellersLogo className="mb-4" />
            <p className="text-sm text-gray-300">
              Insured and Bonded | 24/7 Emergency Assistance
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-6 mb-4">
              <a href="#services" className="text-gray-300 hover:text-fellers-green transition-colors">Services</a>
              <a href="#contact" className="text-gray-300 hover:text-fellers-green transition-colors">Contact</a>
            </div>
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Fellers Resources, LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

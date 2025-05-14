
import React from 'react';
import { Phone, Mail, ClipboardList } from 'lucide-react';

const MobileBottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-fellers-charcoal border-t border-fellers-green z-50 md:hidden">
      <div className="flex justify-around items-center">
        <a 
          href="tel:9366629930" 
          className="flex flex-col items-center justify-center py-3 px-4 text-fellers-white hover:text-fellers-green transition-colors flex-1"
        >
          <Phone className="h-6 w-6 mb-1" />
          <span className="text-xs">Call</span>
        </a>
        
        <a 
          href="mailto:dispatch@fellersresources.com" 
          className="flex flex-col items-center justify-center py-3 px-4 text-fellers-white hover:text-fellers-green transition-colors flex-1"
        >
          <Mail className="h-6 w-6 mb-1" />
          <span className="text-xs">Email</span>
        </a>
        
        <a 
          href="#contact" 
          className="flex flex-col items-center justify-center py-3 px-4 text-fellers-white hover:text-fellers-green transition-colors flex-1"
        >
          <ClipboardList className="h-6 w-6 mb-1" />
          <span className="text-xs">Request</span>
        </a>
      </div>
    </div>
  );
};

export default MobileBottomBar;

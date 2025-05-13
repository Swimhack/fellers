
import React from 'react';

const FellersLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`${className} relative`}>
      <div className="text-fellers-purple font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight" style={{ 
        textShadow: '0 0 5px #6bf243, 0 0 10px #6bf243',
        fontFamily: "'Arial Black', Gadget, sans-serif" 
      }}>
        <span className="inline-block">Fellers</span>
      </div>
      <div className="text-fellers-green font-medium text-lg md:text-xl lg:text-2xl -mt-2" style={{ 
        textShadow: '0 0 3px #5a2799',
        fontFamily: "'Arial', sans-serif" 
      }}>
        Resources, LLC
      </div>
    </div>
  );
};

export default FellersLogo;

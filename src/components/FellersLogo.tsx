
import React from 'react';

const FellersLogo = ({ className = "", size = "default" }: { className?: string, size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "h-8 md:h-10",
    default: "h-12 md:h-16",
    large: "h-16 md:h-20 lg:h-24"
  };
  
  return (
    <div className={`${className} flex flex-col items-center`}>
      <img 
        src="/lovable-uploads/b8978edb-3048-406e-b2b2-63ff95dbc3a7.png" 
        alt="Fellers Resources, LLC" 
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};

export default FellersLogo;

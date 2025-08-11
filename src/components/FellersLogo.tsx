
import React from 'react';

const FellersLogo = ({ className = "", size = "default" }: { className?: string, size?: "small" | "default" | "large" }) => {
  // Increase all sizes by approximately 3x
  const sizeClasses = {
    small: "h-24 md:h-28", // Was h-8 md:h-10
    default: "h-36 md:h-40", // Was h-12 md:h-16
    large: "h-48 md:h-52 lg:h-64" // Was h-16 md:h-20 lg:h-24
  };
  
  return (
    <div className={`${className} flex flex-col items-center`}>
      <img 
        src="/images/e54e7c62-7a2b-4780-8e6a-c9159febe2f5.png" 
        alt="Fellers Resources, LLC" 
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};

export default FellersLogo;

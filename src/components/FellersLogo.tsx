
import React from 'react';

const FellersLogo = ({ className = "", size = "default" }: { className?: string, size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "text-2xl md:text-3xl",
    default: "text-4xl md:text-5xl",
    large: "text-5xl md:text-6xl lg:text-7xl"
  };
  
  return (
    <div className={`${className} flex flex-col items-center`}>
      <div className={`${sizeClasses[size]} font-montserrat font-extrabold uppercase gradient-bg text-transparent bg-clip-text`} 
        style={{ textShadow: `0 0 8px #39FF14, 0 0 12px #39FF14` }}>
        Fellers
      </div>
      <div className={`${size === "small" ? "text-sm" : "text-lg"} font-montserrat text-fellers-green -mt-1`}>
        Resources, LLC
      </div>
    </div>
  );
};

export default FellersLogo;

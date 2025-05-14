
import React from 'react';

const SEOSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Fellers Resources, LLC",
    "description": "24/7 Heavy-Duty Towing & Recovery services within 100 miles of Houston.",
    "url": "https://fellersresources.com/",
    "telephone": "+19366629930",
    "openingHours": "Mo-Su 00:00-24:00",
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 29.7858,
        "longitude": -95.8244
      },
      "geoRadius": "100 miles"
    },
    "serviceType": [
      "Heavy-Duty Towing & Recovery",
      "Load Transfers",
      "Light / Medium Towing & Recovery",
      "Swap Outs",
      "Landoll Service",
      "Rotator / Mobile Crane",
      "Winch Outs",
      "Decking / Undecking",
      "Minor Roadside Assistance",
      "Local & Long Distance",
      "Hazmat Cleanup",
      "Load Shifts"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Katy",
      "addressRegion": "TX",
      "addressCountry": "US"
    }
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default SEOSchema;

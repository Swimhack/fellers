
import React from 'react';

const ServiceMap = () => {
  return (
    <section className="section-padding bg-fellers-charcoal">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 md:mb-12 text-fellers-white">SERVICE AREA</h2>
        
        <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-fellers-green/50 mb-4 md:mb-6">
          <div className="aspect-ratio-16/9 h-[250px] sm:h-[350px] md:h-[450px] w-full">
            {/* Updated iframe to center on Houston, TX */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d886261.0548555356!2d-95.96760996473055!3d29.816882865936082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1716051352067!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Service Area Map"
            />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-base sm:text-lg text-fellers-white/80 max-w-3xl mx-auto px-2">
            Serving a 100-mile radius around Houston, including Katy, Sugar Land, The Woodlands, Conroe, Baytown, Galveston, and beyond.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServiceMap;

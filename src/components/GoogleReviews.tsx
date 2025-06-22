
import React from 'react';

const GoogleReviews = () => {
  const handleWriteReview = () => {
    window.open('https://www.givemeathumbsup.net/fellers/', '_blank');
  };

  return (
    <section className="section-padding bg-fellers-lightGray">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-fellers-charcoal mb-4">
            What Our Customers Say
          </h2>
          <div className="w-20 h-1 bg-fellers-green mx-auto mb-6"></div>
          <p className="text-xl text-fellers-charcoal/80 max-w-2xl mx-auto">
            Read reviews from satisfied customers and share your experience
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div 
            className="reviewmgr-embed mb-8" 
            data-url="https://www.givemeathumbsup.net/fellers/"
          ></div>
          
          <div className="text-center">
            <button 
              onClick={handleWriteReview}
              className="px-6 py-3 bg-fellers-green text-fellers-charcoal font-bold rounded-lg hover:bg-fellers-green/90 transition-colors shadow-lg"
            >
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;

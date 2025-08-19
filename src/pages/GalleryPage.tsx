import React from 'react';
import Header from '@/components/Header';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';
import MobileBottomBar from '@/components/MobileBottomBar';
import SEOSchema from '@/components/SEOSchema';

const GalleryPage = () => {
  return (
    <>
      <SEOSchema />
      <div className="min-h-screen flex flex-col bg-fellers-charcoal pb-16 md:pb-0">
        <Header />
        <main className="flex-1">
          <div className="pt-20">
            <Gallery />
          </div>
        </main>
        <MobileBottomBar />
        <Footer />
      </div>
    </>
  );
};

export default GalleryPage;
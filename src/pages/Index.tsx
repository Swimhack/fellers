
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import QuickStats from '@/components/QuickStats';
import ServicesGrid from '@/components/ServicesGrid';
import WhyChooseUs from '@/components/WhyChooseUs';
import Gallery from '@/components/Gallery';
import ServiceMap from '@/components/ServiceMap';
import Testimonials from '@/components/Testimonials';
import GoogleReviews from '@/components/GoogleReviews';
import ContactForm from '@/components/ContactForm';
import MobileBottomBar from '@/components/MobileBottomBar';
import Footer from '@/components/Footer';
import SEOSchema from '@/components/SEOSchema';

const Index = () => {
  useEffect(() => {
    // Preload critical images
    const preloadImages = () => {
      const heroImage = new Image();
      heroImage.src = "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";
    };
    
    preloadImages();
  }, []);

  return (
    <>
      <SEOSchema />
      <div className="min-h-screen flex flex-col bg-fellers-charcoal pb-16 md:pb-0">
        <Header />
        <main>
          <Hero />
          <QuickStats />
          <ServicesGrid />
          <WhyChooseUs />
          <Gallery />
          <ServiceMap />
          <Testimonials />
          <GoogleReviews />
          <ContactForm />
        </main>
        <MobileBottomBar />
        <Footer />
      </div>
    </>
  );
};

export default Index;

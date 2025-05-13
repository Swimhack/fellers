
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-fellers-darkNavy text-white relative">
      <div className="absolute inset-0 bg-gradient-to-b from-fellers-darkNavy to-fellers-purple/90 opacity-90"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Contact Information</h2>
          <div className="w-20 h-1 bg-fellers-green mx-auto mt-4 mb-6"></div>
          <p className="text-xl max-w-2xl mx-auto">
            We're available 24/7 for emergency towing and recovery services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white/10 backdrop-blur border-fellers-green/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-fellers-green p-3 rounded-full mb-4">
                  <Phone className="h-6 w-6 text-fellers-darkNavy" />
                </div>
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-lg mb-1">936-662-9930</p>
                <p className="text-lg">281-574-5555</p>
                <Button className="mt-4 bg-fellers-green hover:bg-fellers-green/90 text-fellers-darkNavy">
                  <a href="tel:+19366629930">Call Now</a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur border-fellers-green/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-fellers-green p-3 rounded-full mb-4">
                  <Mail className="h-6 w-6 text-fellers-darkNavy" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-lg mb-2 uppercase">DISPATCH@FELLERSRESOURCES.COM</p>
                <Button className="mt-4 bg-fellers-green hover:bg-fellers-green/90 text-fellers-darkNavy">
                  <a href="mailto:DISPATCH@FELLERSRESOURCES.COM">Send Email</a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur border-fellers-green/30 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="bg-fellers-green p-3 rounded-full mb-4">
                  <MapPin className="h-6 w-6 text-fellers-darkNavy" />
                </div>
                <h3 className="text-xl font-bold mb-2">Our Location</h3>
                <p className="text-lg mb-1 text-center">Katy/Houston, Texas</p>
                <p className="text-lg text-center">Serving the greater Houston area</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;

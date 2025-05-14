
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("We're rolling—expect a call in minutes.", {
        description: "Thank you for your service request!",
        duration: 5000
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        location: '',
        details: ''
      });
      
      // Reset success state after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="section-padding gradient-bg">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-8 text-fellers-white">REQUEST SERVICE</h2>
          <p className="text-center text-lg mb-12 text-fellers-white/90">
            Need assistance? Fill out the form below and we'll dispatch a team right away.
          </p>
          
          <Card className="bg-black/40 backdrop-blur-sm border-fellers-green/30">
            <CardHeader>
              <CardTitle className="text-fellers-white text-center">Contact Dispatch</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-fellers-white">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="bg-white/10 border-fellers-green/30 focus:border-fellers-green text-fellers-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-fellers-white">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      required
                      className="bg-white/10 border-fellers-green/30 focus:border-fellers-green text-fellers-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-fellers-white">Email (Optional)</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    className="bg-white/10 border-fellers-green/30 focus:border-fellers-green text-fellers-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-fellers-white">Current Location</Label>
                  <Input 
                    id="location" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where are you located?"
                    required
                    className="bg-white/10 border-fellers-green/30 focus:border-fellers-green text-fellers-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="details" className="text-fellers-white">Vehicle/Load Details</Label>
                  <textarea 
                    id="details"
                    name="details" 
                    value={formData.details}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your vehicle or load situation"
                    className="w-full rounded-md border border-fellers-green/30 bg-white/10 py-2 px-3 text-fellers-white resize-none focus:outline-none focus:ring-2 focus:ring-fellers-green focus:border-transparent"
                    required
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-fellers-green hover:bg-fellers-green/90 text-fellers-charcoal font-bold py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : submitted ? (
                    <span className="flex items-center">
                      <Check className="mr-2 h-5 w-5" />
                      Request Sent
                    </span>
                  ) : 'SEND REQUEST'}
                </Button>
                
                <p className="text-center text-xs text-fellers-white/60 pt-4">
                  For immediate assistance, call our dispatch at <a href="tel:9366629930" className="text-fellers-green">936-662-9930</a>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

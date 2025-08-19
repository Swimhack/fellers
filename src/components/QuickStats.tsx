
import React from 'react';
import { Clock, Wrench, Truck } from 'lucide-react';

const QuickStats = () => {
  const stats = [
    {
      icon: <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-fellers-green" />,
      title: '24/7/365',
      description: 'Emergency response any time, any day'
    },
    {
      icon: <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-fellers-green" />,
      title: 'Rotator & Landoll Specialists',
      description: 'Expert equipment for every situation'
    },
    {
      icon: <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-fellers-green" />,
      title: 'Local & Long-Distance',
      description: 'Serving Houston area and beyond'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-fellers-purpleFrom to-fellers-purpleTo py-8 sm:py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 px-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-4 sm:p-6 rounded-lg bg-black/20 backdrop-blur-sm animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-3 sm:mb-4">
                {stat.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{stat.title}</h3>
              <p className="text-sm sm:text-base text-white">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickStats;

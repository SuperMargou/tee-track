
import React from 'react';
import { Button } from '@/components/ui/button';
import { type Location } from '@/pages/Index';

interface LocationFilterProps {
  selectedLocation: Location | 'All';
  onLocationChange: (location: Location | 'All') => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ selectedLocation, onLocationChange }) => {
  const locations: (Location | 'All')[] = ['All', "Dad's", "Mom's", "School", "In Transit"];

  const getLocationColor = (location: Location | 'All') => {
    if (location === 'All') return 'bg-gray-100 text-gray-800';
    switch (location) {
      case "Dad's": return 'bg-blue-100 text-blue-800';
      case "Mom's": return 'bg-orange-100 text-orange-800';
      case "School": return 'bg-green-100 text-green-800';
      case "In Transit": return 'bg-gray-100 text-gray-800';
    }
  };

  const getDotColor = (location: Location | 'All') => {
    if (location === 'All') return 'bg-gray-500';
    switch (location) {
      case "Dad's": return 'bg-blue-500';
      case "Mom's": return 'bg-orange-500';
      case "School": return 'bg-green-500';
      case "In Transit": return 'bg-gray-500';
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {locations.map(location => (
        <Button
          key={location}
          variant={selectedLocation === location ? "default" : "outline"}
          size="sm"
          onClick={() => onLocationChange(location)}
          className={`flex-shrink-0 h-10 ${
            selectedLocation === location 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'hover:bg-gray-50'
          }`}
        >
          {location !== 'All' && (
            <div className={`w-2 h-2 rounded-full mr-2 ${
              selectedLocation === location ? 'bg-white' : getDotColor(location)
            }`} />
          )}
          {location}
        </Button>
      ))}
    </div>
  );
};

export default LocationFilter;

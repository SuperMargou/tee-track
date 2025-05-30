import React from 'react';
import { Button } from '@/components/ui/button';
import { type Location } from '@/types';

interface LocationFilterProps {
  selectedLocation: Location | 'All';
  onLocationChange: (location: Location | 'All') => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ selectedLocation, onLocationChange }) => {
  const locations: (Location | 'All')[] = ['All', "Dad's", "Mom's", "School", "In Transit"];

  const getLocationColor = (location: Location | 'All') => {
    if (location === 'All') return 'bg-white';
    switch (location) {
      case "Dad's": return 'bg-blue-100 text-blue-800';
      case "Mom's": return 'bg-orange-100 text-orange-800';
      case "School": return 'bg-green-100 text-green-800';
      case "In Transit": return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {locations.map(location => (
        <Button
          key={location}
          variant="outline"
          onClick={() => onLocationChange(location)}
          className={`flex-shrink-0 h-10 ${
            selectedLocation === location 
              ? 'border-2 border-blue-600 font-medium' 
              : 'border'
          } ${location !== 'All' ? getLocationColor(location) : ''}`}
        >
          {location}
        </Button>
      ))}
    </div>
  );
};

export default LocationFilter;

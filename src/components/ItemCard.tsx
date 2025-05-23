
import React, { useState } from 'react';
import { MapPin, MoreVertical, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { type Item, type Location } from '@/pages/Index';

interface ItemCardProps {
  item: Item;
  onLocationChange: (itemId: string, newLocation: Location) => void;
  onDelete: (itemId: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onLocationChange, onDelete }) => {
  const [showLocationButtons, setShowLocationButtons] = useState(false);

  const getLocationColor = (location: Location) => {
    switch (location) {
      case "Dad's": return 'bg-blue-100 text-blue-800 border-blue-200';
      case "Mom's": return 'bg-orange-100 text-orange-800 border-orange-200';
      case "School": return 'bg-green-100 text-green-800 border-green-200';
      case "In Transit": return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLocationDotColor = (location: Location) => {
    switch (location) {
      case "Dad's": return 'bg-blue-500';
      case "Mom's": return 'bg-orange-500';
      case "School": return 'bg-green-500';
      case "In Transit": return 'bg-gray-500';
    }
  };

  const otherLocations = (['Dad\'s', 'Mom\'s', 'School', 'In Transit'] as Location[])
    .filter(loc => loc !== item.location);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Photo */}
          {item.photo && (
            <div className="flex-shrink-0">
              <img 
                src={item.photo} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
              
              {/* More Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => setShowLocationButtons(!showLocationButtons)}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Move Item
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(item.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Current Location */}
            <div className="flex items-center gap-2 mt-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getLocationColor(item.location)}`}>
                <div className={`w-2 h-2 rounded-full ${getLocationDotColor(item.location)}`} />
                {item.location}
              </div>
            </div>

            {/* Quick Location Change Buttons */}
            {showLocationButtons && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-2">Move to:</p>
                <div className="flex flex-wrap gap-2">
                  {otherLocations.map(location => (
                    <Button
                      key={location}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onLocationChange(item.id, location);
                        setShowLocationButtons(false);
                      }}
                      className="h-8 text-xs"
                    >
                      <div className={`w-2 h-2 rounded-full mr-2 ${getLocationDotColor(location)}`} />
                      {location}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;

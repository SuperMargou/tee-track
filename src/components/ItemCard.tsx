import React from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type Item, type Location } from '@/pages/Index';
interface ItemCardProps {
  item: Item;
  onLocationChange: (itemId: string, newLocation: Location) => void;
  onDelete: (itemId: string) => void;
}
const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onLocationChange,
  onDelete
}) => {
  const getLocationColor = (location: Location) => {
    switch (location) {
      case "Dad's":
        return 'bg-blue-100';
      case "Mom's":
        return 'bg-orange-100';
      case "School":
        return 'bg-green-100';
      case "In Transit":
        return 'bg-gray-100';
    }
  };
  const getLocationTextColor = (location: Location) => {
    switch (location) {
      case "Dad's":
        return 'text-blue-800';
      case "Mom's":
        return 'text-orange-800';
      case "School":
        return 'text-green-800';
      case "In Transit":
        return 'text-gray-800';
    }
  };
  const getNextLocation = (currentLocation: Location): Location => {
    const locations: Location[] = ["Dad's", "Mom's", "School", "In Transit"];
    const currentIndex = locations.indexOf(currentLocation);
    const nextIndex = (currentIndex + 1) % locations.length;
    return locations[nextIndex];
  };
  const handleCardClick = () => {
    const nextLocation = getNextLocation(item.location);
    onLocationChange(item.id, nextLocation);
  };
  return <Card className={`hover:shadow-md transition-shadow ${getLocationColor(item.location)} border-none cursor-pointer`} onClick={handleCardClick}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Photo */}
          {item.photo && <div className="flex-shrink-0">
              <img src={item.photo} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
            </div>}
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold ${getLocationTextColor(item.location)} truncate`}>{item.name}</h3>
                {item.description && <p className={`text-sm ${getLocationTextColor(item.location)} mt-1 line-clamp-2`}>{item.description}</p>}
              </div>
              
              {/* Delete Option - Removed dropdown, direct delete now */}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={e => {
              e.stopPropagation();
              onDelete(item.id);
            }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Location indicator at the bottom */}
            <div className="absolute bottom-2 left-4 mt-3">
              
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ItemCard;
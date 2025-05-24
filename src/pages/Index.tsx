
import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useItems } from '@/hooks/useItems';
import AddItemModal from '@/components/AddItemModal';
import ItemCard from '@/components/ItemCard';
import LocationFilter from '@/components/LocationFilter';
import Header from '@/components/Header';
import { useNavigate } from 'react-router-dom';

export type Location = "Dad's" | "Mom's" | "School" | "In Transit";

export interface Item {
  id: string;
  name: string;
  description: string;
  location: Location;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
  forToday?: boolean;
  reminder?: boolean;
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { 
    items, 
    loading: itemsLoading, 
    addItem, 
    updateItemLocation, 
    deleteItem, 
    toggleItemForToday, 
    toggleItemReminder 
  } = useItems();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [todaySearchQuery, setTodaySearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isFullInventoryMode, setIsFullInventoryMode] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | 'All'>('All');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Auto-set items at school as reminders
  useEffect(() => {
    items.forEach(item => {
      if (item.location === "School" && !item.reminder) {
        toggleItemReminder(item.id);
      }
    });
  }, [items]);

  // Auto-set "In Transit" items as forToday
  useEffect(() => {
    items.forEach(item => {
      if (item.location === "In Transit" && !item.forToday) {
        toggleItemForToday(item.id);
      }
    });
  }, [items]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Filter items based on search, location, and mode
  const getFilteredItems = () => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
      
      if (isFullInventoryMode) {
        return matchesSearch && matchesLocation;
      } else {
        // In Today mode, show only items marked for today
        return matchesSearch && item.forToday;
      }
    });
  };

  // Get items that are at school (for reminders)
  const getReminderItems = () => {
    return items.filter(item => item.location === "School");
  };

  // Filter items for the Today tab based on search
  const getFilteredTodayItems = (itemsList: Item[]) => {
    return itemsList.filter(item => 
      item.name.toLowerCase().includes(todaySearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(todaySearchQuery.toLowerCase())
    );
  };

  // Group items by location for display
  const getItemsByLocation = (filteredItems: Item[]) => {
    return filteredItems.reduce((acc, item) => {
      if (!acc[item.location]) {
        acc[item.location] = [];
      }
      acc[item.location].push(item);
      return acc;
    }, {} as Record<Location, Item[]>);
  };

  const getLocationColor = (location: Location) => {
    switch (location) {
      case "Dad's": return 'bg-blue-100 text-blue-800';
      case "Mom's": return 'bg-orange-100 text-orange-800';
      case "School": return 'bg-green-100 text-green-800';
      case "In Transit": return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationStats = () => {
    const stats = items.reduce((acc, item) => {
      acc[item.location] = (acc[item.location] || 0) + 1;
      return acc;
    }, {} as Record<Location, number>);
    return stats;
  };

  const locationStats = getLocationStats();
  const filteredItems = getFilteredItems();
  const itemsByLocation = getItemsByLocation(filteredItems);
  const reminderItems = getReminderItems();

  const contentToDisplay = () => {
    if (isFullInventoryMode) {
      return (
        <div className="px-4 pb-24">
          {/* Location Filter */}
          <div className="mb-5 mt-2">
            <LocationFilter 
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
          
          {/* Quick Stats */}
          <div className="py-2">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(['Dad\'s', 'Mom\'s', 'School', 'In Transit'] as Location[]).map(location => (
                <Card key={location} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className={`p-4 ${getLocationColor(location)}`}>
                    <p className="text-2xl font-bold">{locationStats[location] || 0}</p>
                    <p className="font-medium">{location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Items List */}
          {itemsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading items...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(itemsByLocation).map(([location, locationItems]) => (
                <div key={location} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {location} ({locationItems.length})
                  </h3>
                  <div className="space-y-3">
                    {locationItems.map(item => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onLocationChange={updateItemLocation}
                        onDelete={deleteItem}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && !itemsLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchQuery ? 'No items found' : 'No items yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? 'Try a different search term'
                    : 'Add your first item to start tracking your belongings'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowAddModal(true)} className="mt-2">
                    Add First Item
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      );
    } else {
      // Today mode content
      return (
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Items For Today
            </h2>
          </div>

          {/* Today's Items List */}
          <div className="mb-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Taking With Me</h3>
            {items.filter(item => item.forToday).length === 0 ? (
              <p className="text-gray-500">No items selected for today</p>
            ) : (
              items.filter(item => item.forToday).map(item => (
                <Card 
                  key={item.id} 
                  className={`hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => toggleItemForToday(item.id)}
                >
                  <CardContent className={`p-4 ${getLocationColor(item.location)}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="text-sm">{item.location}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Reminders Section */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reminders (Items at School)</h3>
            {reminderItems.length === 0 ? (
              <p className="text-gray-500">No items at school</p>
            ) : (
              <div className="space-y-3">
                {reminderItems.map(item => (
                  <Card 
                    key={item.id} 
                    className="hover:shadow-md transition-shadow bg-green-50 cursor-pointer"
                    onClick={() => toggleItemReminder(item.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-green-800">{item.name}</h3>
                        <div className="text-sm text-green-800">{item.location}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add Items to Today Section */}
          <div className="mt-8 pb-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Select items for today</h3>
            
            {/* Search Bar for Today Items */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search items to add for today..."
                value={todaySearchQuery}
                onChange={(e) => setTodaySearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            
            <div className="space-y-3">
              {getFilteredTodayItems(items.filter(item => !item.forToday)).map(item => (
                <Card 
                  key={item.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer opacity-60 hover:opacity-100"
                  onClick={() => toggleItemForToday(item.id)}
                >
                  <CardContent className={`p-4 ${getLocationColor(item.location)}`}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="text-sm">{item.location}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        isFullInventoryMode={isFullInventoryMode}
        setIsFullInventoryMode={setIsFullInventoryMode}
      />

      {/* Main Content */}
      <div className="max-w-md mx-auto">
        {contentToDisplay()}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => setShowAddModal(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-green-100 text-green-800 hover:bg-green-200"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addItem}
      />
    </div>
  );
};

export default Index;

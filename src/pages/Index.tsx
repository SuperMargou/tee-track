
import React, { useState, useEffect } from 'react';
import { Search, Plus, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import AddItemModal from '@/components/AddItemModal';
import ItemCard from '@/components/ItemCard';
import LocationFilter from '@/components/LocationFilter';

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
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isFullInventoryMode, setIsFullInventoryMode] = useState(true);

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('belongings-tracker-items');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems).map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }));
      setItems(parsedItems);
    }
  }, []);

  // Save items to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('belongings-tracker-items', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    const item: Item = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      forToday: false,
      reminder: false
    };
    setItems(prev => [item, ...prev]);
  };

  const updateItemLocation = (itemId: string, newLocation: Location) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, location: newLocation, updatedAt: new Date() }
        : item
    ));
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const toggleItemForToday = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, forToday: !item.forToday, updatedAt: new Date() }
        : item
    ));
  };

  const toggleItemReminder = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, reminder: !item.reminder, updatedAt: new Date() }
        : item
    ));
  };

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
        return matchesSearch && matchesLocation && item.forToday;
      }
    });
  };

  // Get items that are marked as reminders
  const getReminderItems = () => {
    return items.filter(item => item.reminder);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">My Belongings</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{isFullInventoryMode ? 'All Items' : 'Today'}</span>
              <Switch 
                checked={!isFullInventoryMode}
                onCheckedChange={() => setIsFullInventoryMode(!isFullInventoryMode)}
              />
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="max-w-md mx-auto">
        <TabsList className="w-full mt-4 bg-white">
          <TabsTrigger value="inventory" className="flex-1">Inventory</TabsTrigger>
          <TabsTrigger value="today" className="flex-1">Today</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory">
          {/* Quick Stats */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(['Dad\'s', 'Mom\'s', 'School', 'In Transit'] as Location[]).map(location => (
                <Card key={location} className={`cursor-pointer hover:shadow-md transition-shadow ${location === selectedLocation ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedLocation(location === selectedLocation ? 'All' : location)}>
                  <CardContent className={`p-4 ${getLocationColor(location)}`}>
                    <p className="text-2xl font-bold">{locationStats[location] || 0}</p>
                    <p className="font-medium">{location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="px-4 mb-4">
            <LocationFilter 
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
            />
          </div>

          {/* Items List */}
          <div className="px-4 pb-24">
            {selectedLocation === 'All' ? (
              // Group by location when showing all
              Object.entries(itemsByLocation).map(([location, locationItems]) => (
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
              ))
            ) : (
              // Simple list when filtering by location
              <div className="space-y-3">
                {filteredItems.map(item => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onLocationChange={updateItemLocation}
                    onDelete={deleteItem}
                  />
                ))}
              </div>
            )}

            {filteredItems.length === 0 && (
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
        </TabsContent>

        <TabsContent value="today">
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
                    className={`hover:shadow-md transition-shadow`}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Reminders</h3>
              {reminderItems.length === 0 ? (
                <p className="text-gray-500">No reminders set</p>
              ) : (
                <div className="space-y-3">
                  {reminderItems.map(item => (
                    <Card 
                      key={item.id} 
                      className="hover:shadow-md transition-shadow bg-yellow-50"
                      onClick={() => toggleItemReminder(item.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-yellow-800">{item.name}</h3>
                          <div className="text-sm text-yellow-800">{item.location}</div>
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
              <div className="space-y-3">
                {items.filter(item => !item.forToday).map(item => (
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
        </TabsContent>
      </Tabs>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => setShowAddModal(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-blue-600 hover:bg-blue-700"
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

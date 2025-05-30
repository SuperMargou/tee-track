import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { type Item, type Location, type Category } from '@/types';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch items from Supabase
  const fetchItems = async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems: Item[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        location: item.location as Location,
        category: item.category as Category || 'other',
        photo: item.photo || undefined,
        forToday: item.for_today || false,
        reminder: item.reminder || false,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));

      setItems(formattedItems);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      });
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{
          user_id: user.id,
          name: newItem.name,
          description: newItem.description,
          location: newItem.location,
          category: newItem.category,
          photo: newItem.photo,
          for_today: newItem.forToday,
          reminder: newItem.reminder,
        }])
        .select()
        .single();

      if (error) throw error;

      const formattedItem: Item = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        location: data.location as Location,
        category: data.category as Category || 'other',
        photo: data.photo || undefined,
        forToday: data.for_today || false,
        reminder: data.reminder || false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setItems(prev => [formattedItem, ...prev]);
      
      toast({
        title: "Success",
        description: "Item added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
      console.error('Error adding item:', error);
    }
  };

  // Update item location
  const updateItemLocation = async (itemId: string, newLocation: Location) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('items')
        .update({ location: newLocation })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, location: newLocation, updatedAt: new Date() }
          : item
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update item location",
        variant: "destructive",
      });
      console.error('Error updating item location:', error);
    }
  };

  // Delete item
  const deleteItem = async (itemId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      console.error('Error deleting item:', error);
    }
  };

  // Toggle item for today
  const toggleItemForToday = async (itemId: string) => {
    if (!user) return;

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const { error } = await supabase
        .from('items')
        .update({ for_today: !item.forToday })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, forToday: !item.forToday, updatedAt: new Date() }
          : item
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      console.error('Error toggling item for today:', error);
    }
  };

  // Toggle item reminder
  const toggleItemReminder = async (itemId: string) => {
    if (!user) return;

    const item = items.find(i => i.id === itemId);
    if (!item) return;

    try {
      const { error } = await supabase
        .from('items')
        .update({ reminder: !item.reminder })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, reminder: !item.reminder, updatedAt: new Date() }
          : item
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update reminder",
        variant: "destructive",
      });
      console.error('Error toggling item reminder:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  return {
    items,
    loading,
    addItem,
    updateItemLocation,
    deleteItem,
    toggleItemForToday,
    toggleItemReminder,
    refetch: fetchItems,
  };
};

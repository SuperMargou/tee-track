
import React, { useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Item, type Location } from '@/pages/Index';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Location>("Dad's");
  const [photo, setPhoto] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      description: description.trim(),
      location,
      photo
    });

    // Reset form
    setName('');
    setDescription('');
    setLocation("Dad's");
    setPhoto(undefined);
    onClose();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(undefined);
  };

  const getLocationColor = (loc: Location) => {
    switch (loc) {
      case "Dad's": return 'bg-blue-50 border-blue-200 text-blue-800';
      case "Mom's": return 'bg-orange-50 border-orange-200 text-orange-800';
      case "School": return 'bg-green-50 border-green-200 text-green-800';
      case "In Transit": return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo (Optional)</Label>
            {photo ? (
              <div className="relative">
                <img 
                  src={photo} 
                  alt="Item preview" 
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Upload a photo
                  </span>
                  <span className="text-gray-600"> or take one with your camera</span>
                </Label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Item Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Blue hoodie, Math textbook..."
              className="h-12 text-lg"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details..."
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Current Location</Label>
            <Select value={location} onValueChange={(value: Location) => setLocation(value)}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(['Dad\'s', 'Mom\'s', 'School', 'In Transit'] as Location[]).map(loc => (
                  <SelectItem key={loc} value={loc}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        loc === "Dad's" ? 'bg-blue-500' :
                        loc === "Mom's" ? 'bg-orange-500' :
                        loc === "School" ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                      {loc}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
            >
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;

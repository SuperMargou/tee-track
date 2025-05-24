
import React from 'react';
import { Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  isFullInventoryMode: boolean;
  setIsFullInventoryMode: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isFullInventoryMode, setIsFullInventoryMode }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  // Get user's display name from Google metadata, fallback to email if not available
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    return user?.email || 'User';
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TeeTrack</h1>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <span className="text-sm text-gray-600">Inventory</span>
            <Switch 
              checked={!isFullInventoryMode}
              onCheckedChange={() => setIsFullInventoryMode(!isFullInventoryMode)}
            />
            <span className="text-sm text-gray-600">Today</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="h-8 w-8 p-0"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {user && (
          <div className="text-sm text-gray-600">
            Welcome back, {getUserDisplayName()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

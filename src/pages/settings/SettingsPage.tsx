import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Settings } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Account settings and preferences will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;

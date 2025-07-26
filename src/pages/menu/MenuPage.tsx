import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Utensils } from 'lucide-react';

const MenuPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Utensils className="h-6 w-6" />
                <h2 className="text-2xl font-bold tracking-tight">Menu Management</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Menu items and categories will be managed here.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default MenuPage;

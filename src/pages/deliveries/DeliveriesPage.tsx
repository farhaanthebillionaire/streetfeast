import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Truck } from 'lucide-react';

const DeliveriesPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Truck className="h-6 w-6" />
                <h2 className="text-2xl font-bold tracking-tight">Deliveries</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Delivery Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Delivery schedules and tracking will be managed here.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DeliveriesPage;

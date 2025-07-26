import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ShoppingBag } from 'lucide-react';

const OrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ShoppingBag className="h-6 w-6" />
        <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Order history and details will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;

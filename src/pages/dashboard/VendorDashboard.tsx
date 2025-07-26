import React from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock, DollarSign, Package, Star, TrendingUp, Users } from 'lucide-react';
import type { User } from '../../contexts/auth/AuthContext';

// Type guard to check if user is a vendor
const isVendor = (user: User): user is User & { businessName: string } => {
    return user.role === 'vendor';
};

const VendorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Ensure currentUser is a vendor before accessing vendor-specific properties
  const vendorName = currentUser && isVendor(currentUser) 
      ? currentUser.businessName 
      : 'Vendor';

  // Mock data for vendor dashboard
  const vendorStats = [
    { name: 'Today\'s Orders', value: '24', change: '+12%', changeType: 'increase', icon: Package },
    { name: 'Revenue', value: '$1,245', change: '+8%', changeType: 'increase', icon: DollarSign },
    { name: 'Active Customers', value: '156', change: '+5%', changeType: 'increase', icon: Users },
    { name: 'Average Rating', value: '4.7', change: '+0.2', changeType: 'increase', icon: Star },
  ];

  const recentOrders = [
    { id: 1, customer: 'John D.', items: '2x Veg Biryani, 1x Naan', total: '$24.50', status: 'Preparing', time: '15 min ago' },
    { id: 2, customer: 'Sarah M.', items: '1x Butter Chicken, 2x Garlic Naan', total: '$28.75', status: 'Ready for Pickup', time: '25 min ago' },
    { id: 3, customer: 'Alex P.', items: '3x Paneer Tikka Masala, 2x Rice', total: '$35.25', status: 'On the way', time: '40 min ago' },
  ];

  const popularItems = [
    { name: 'Butter Chicken', orders: 124, revenue: '$1,240' },
    { name: 'Veg Biryani', orders: 98, revenue: '$980' },
    { name: 'Garlic Naan', orders: 156, revenue: '$468' },
    { name: 'Paneer Tikka Masala', orders: 87, revenue: '$1,044' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back, {vendorName}!</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your business today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {vendorStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>{' '}
                from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer} • {order.items}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <p className={`text-sm ${
                      order.status === 'Delivered' ? 'text-green-500' : 
                      order.status === 'On the way' ? 'text-blue-500' : 'text-yellow-500'
                    }`}>
                      {order.status} • {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.revenue}</p>
                    <div className="flex items-center justify-end text-green-500 text-sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Performance charts would be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;

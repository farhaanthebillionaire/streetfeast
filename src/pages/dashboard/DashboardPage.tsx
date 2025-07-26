import React from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Activity, Utensils, Package, Users, Clock, DollarSign } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  // Mock data - in a real app, this would come from an API
  const stats = [
    { name: 'Total Orders', value: '1,234', change: '+12%', changeType: 'increase', icon: Activity },
    { name: 'Active Menu Items', value: '42', change: '+5%', changeType: 'increase', icon: Utensils },
    { name: 'Total Products', value: '156', change: '+3%', changeType: 'increase', icon: Package },
    { name: 'Active Customers', value: '2,345', change: '+8%', changeType: 'increase', icon: Users },
  ];

  const recentOrders = [
    { id: 1, customer: 'John Doe', items: 3, total: '$45.99', status: 'Preparing' },
    { id: 2, customer: 'Jane Smith', items: 2, total: '$28.50', status: 'Out for Delivery' },
    { id: 3, customer: 'Robert Johnson', items: 5, total: '$72.30', status: 'Delivered' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser?.displayName || 'User'}!</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your {currentUser?.role || 'account'} today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {currentUser?.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'User'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
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
                from last month
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
            <div className="space-y-8">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    <div className="flex items-center">
                      <span className="mr-2">{order.status}</span>
                      <span className="text-muted-foreground text-sm">• {order.items} items</span>
                    </div>
                    <div className="text-right">{order.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-accent">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <span>View Today's Schedule</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-accent">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <span>View Earnings</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-accent">
              <div className="flex items-center space-x-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <span>Manage Customers</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

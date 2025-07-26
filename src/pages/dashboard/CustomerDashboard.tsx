import React from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock, Heart, History, Star, Utensils } from 'lucide-react';

const CustomerDashboard: React.FC = () => {
    const { currentUser } = useAuth();

    // Mock data for customer dashboard
    const customerStats = [
        { name: 'Active Orders', value: '2', icon: Clock },
        { name: 'Favorites', value: '12', icon: Heart },
        { name: 'Order History', value: '24', icon: History },
        { name: 'Loyalty Points', value: '1,250', icon: Star },
    ];

    const recentOrders = [
        { id: 1, items: 'Veg Biryani, Butter Naan', total: '$15.99', status: 'On the way', time: '30 min' },
        { id: 2, items: 'Paneer Tikka, Garlic Naan', total: '$24.50', status: 'Delivered', time: '2 days ago' },
    ];

    const recommendedVendors = [
        { id: 1, name: 'Spice Garden', cuisine: 'Indian', rating: 4.8 },
        { id: 2, name: 'Pizza Palace', cuisine: 'Italian', rating: 4.6 },
        { id: 3, name: 'Sushi Express', cuisine: 'Japanese', rating: 4.7 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser?.firstName || 'Customer'}!</h2>
                <p className="text-muted-foreground">
                    What would you like to order today?
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {customerStats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
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
                        {recentOrders.length > 0 ? (
                            <div className="space-y-6">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Order #{order.id}</p>
                                            <p className="text-sm text-muted-foreground">{order.items}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{order.total}</p>
                                            <p className={`text-sm ${order.status === 'Delivered' ? 'text-green-500' : 'text-yellow-500'
                                                }`}>
                                                {order.status} • {order.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No recent orders</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recommended for You</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recommendedVendors.map((vendor) => (
                                <div key={vendor.id} className="flex items-center space-x-4 p-2 hover:bg-accent/50 rounded-lg cursor-pointer">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Utensils className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{vendor.name}</p>
                                        <p className="text-sm text-muted-foreground">{vendor.cuisine}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                        <span className="text-sm font-medium">{vendor.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CustomerDashboard;

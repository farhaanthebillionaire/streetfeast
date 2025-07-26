import React from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package, Truck, DollarSign, Clock, TrendingUp, CheckCircle } from 'lucide-react';
import type { User } from '../../contexts/auth/AuthContext';

// Type guard to check if user is a supplier
const isSupplier = (user: User): user is User & { companyName: string } => {
    return user.role === 'supplier';
};

const SupplierDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    
    // Ensure currentUser is a supplier before accessing supplier-specific properties
    const supplierName = currentUser && isSupplier(currentUser) 
        ? currentUser.companyName 
        : 'Supplier';

    // Mock data for supplier dashboard
    const supplierStats = [
        { name: 'Active Orders', value: '8', change: '+2', changeType: 'increase', icon: Package },
        { name: 'Total Revenue', value: '$8,750', change: '+12%', changeType: 'increase', icon: DollarSign },
        { name: 'On-time Deliveries', value: '98%', change: '+2%', changeType: 'increase', icon: CheckCircle },
        { name: 'Avg. Delivery Time', value: '2.4h', change: '-0.3h', changeType: 'decrease', icon: Clock },
    ];

    const activeOrders = [
        { id: 1, vendor: 'Spice Garden', items: '20kg Chicken, 10kg Paneer', deliveryBy: 'Today, 3:00 PM', status: 'In Transit' },
        { id: 2, vendor: 'Pizza Palace', items: '50kg Cheese, 30kg Dough', deliveryBy: 'Tomorrow, 10:00 AM', status: 'Scheduled' },
        { id: 3, vendor: 'Sushi Express', items: '15kg Salmon, 10kg Rice', deliveryBy: 'Today, 1:30 PM', status: 'Preparing' },
    ];

    const inventory = [
        { name: 'Chicken', quantity: '150kg', lowStock: false, reorder: '50kg' },
        { name: 'Paneer', quantity: '30kg', lowStock: true, reorder: '30kg' },
        { name: 'Cheese', quantity: '80kg', lowStock: false, reorder: '20kg' },
        { name: 'Rice', quantity: '200kg', lowStock: false, reorder: '100kg' },
        { name: 'Salmon', quantity: '25kg', lowStock: true, reorder: '25kg' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Welcome back, {supplierName}!</h2>
                <p className="text-muted-foreground">
                    Here's your supply chain overview.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {supplierStats.map((stat, index) => (
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
                                from last week
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Active Orders</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Truck className="mr-1 h-4 w-4" />
                                <span>3 in progress</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {activeOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Order #{order.id}</p>
                                        <p className="text-sm text-muted-foreground">{order.vendor}</p>
                                        <p className="text-sm">{order.items}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Deliver by: {order.deliveryBy}</p>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-purple-100 text-purple-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Inventory Status</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></span>
                                <span>2 items low in stock</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {inventory.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Reorder at: {item.reorder}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${item.lowStock ? 'text-yellow-500' : 'text-green-500'}`}>
                                            {item.quantity}
                                        </p>
                                        <div className="flex items-center justify-end text-green-500 text-sm">
                                            {!item.lowStock && (
                                                <>
                                                    <TrendingUp className="h-3 w-3 mr-1" />
                                                    <span>In Stock</span>
                                                </>
                                            )}
                                            {item.lowStock && (
                                                <span className="text-yellow-500">Low Stock</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center">
                            <p className="text-muted-foreground">Delivery performance metrics and charts would be displayed here</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Vendors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center">
                            <p className="text-muted-foreground">Top vendors by order volume would be displayed here</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SupplierDashboard;

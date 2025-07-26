import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package } from 'lucide-react';

const ProductsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                <Package className="h-6 w-6" />
                <h2 className="text-2xl font-bold tracking-tight">Products</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Product inventory and management will be displayed here.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProductsPage;

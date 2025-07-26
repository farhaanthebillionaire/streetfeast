import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock as ClockIcon,
  CheckCircle2 as CheckCircleIcon,
  XCircle as XCircleIcon,
  Truck as TruckIcon,
  Check as CheckIcon,
  Receipt as ReceiptRefundIcon,
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon,
  RefreshCw as ArrowPathIcon,
  Eye as EyeIcon,
  Star as StarIconSolid
} from 'lucide-react';

// Mock data for orders
const orders = [
  {
    id: 'ORD-2023-001',
    status: 'preparing', // 'preparing', 'on-the-way', 'delivered', 'cancelled'
    date: '2023-07-25T18:30:00',
    vendor: {
      id: 1,
      name: 'Burger House',
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    },
    items: [
      { id: 1, name: 'Classic Burger', quantity: 2, price: 8.99 },
      { id: 2, name: 'French Fries', quantity: 1, price: 3.99 },
    ],
    deliveryFee: 2.99,
    tax: 1.75,
    total: 26.71,
    deliveryAddress: '123 Main St, Apartment 4B, City, 12345',
    paymentMethod: 'VISA •••• 4242',
    estimatedDelivery: '2023-07-25T19:30:00',
    trackingSteps: [
      { id: 1, name: 'Order Placed', status: 'complete', time: '2023-07-25T18:30:00' },
      { id: 2, name: 'Preparing', status: 'current', time: '2023-07-25T18:35:00' },
      { id: 3, name: 'On the way', status: 'upcoming', time: null },
      { id: 4, name: 'Delivered', status: 'upcoming', time: null },
    ],
  },
  {
    id: 'ORD-2023-002',
    status: 'on-the-way',
    date: '2023-07-25T17:15:00',
    vendor: {
      id: 2,
      name: 'Pizza Palace',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    },
    items: [
      { id: 3, name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
      { id: 4, name: 'Garlic Bread', quantity: 1, price: 4.99 },
    ],
    deliveryFee: 1.99,
    tax: 1.65,
    total: 23.62,
    deliveryAddress: '123 Main St, Apartment 4B, City, 12345',
    paymentMethod: 'VISA •••• 4242',
    estimatedDelivery: '2023-07-25T18:15:00',
    deliveryPerson: {
      name: 'John D.',
      phone: '(555) 123-4567',
      rating: 4.8,
      vehicle: 'Scooter • ABC-123',
    },
    trackingSteps: [
      { id: 1, name: 'Order Placed', status: 'complete', time: '2023-07-25T17:15:00' },
      { id: 2, name: 'Preparing', status: 'complete', time: '2023-07-25T17:20:00' },
      { id: 3, name: 'On the way', status: 'current', time: '2023-07-25T17:50:00' },
      { id: 4, name: 'Delivered', status: 'upcoming', time: null },
    ],
  },
  {
    id: 'ORD-2023-003',
    status: 'delivered',
    date: '2023-07-24T19:45:00',
    vendor: {
      id: 3,
      name: 'Sushi Express',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    },
    items: [
      { id: 5, name: 'California Roll', quantity: 2, price: 12.99 },
      { id: 6, name: 'Salmon Nigiri', quantity: 1, price: 8.99 },
      { id: 7, name: 'Miso Soup', quantity: 1, price: 2.99 },
    ],
    deliveryFee: 3.49,
    tax: 2.48,
    total: 43.43,
    deliveryAddress: '123 Main St, Apartment 4B, City, 12345',
    paymentMethod: 'VISA •••• 4242',
    deliveredAt: '2023-07-24T20:30:00',
    trackingSteps: [
      { id: 1, name: 'Order Placed', status: 'complete', time: '2023-07-24T19:45:00' },
      { id: 2, name: 'Preparing', status: 'complete', time: '2023-07-24T19:50:00' },
      { id: 3, name: 'On the way', status: 'complete', time: '2023-07-24T20:15:00' },
      { id: 4, name: 'Delivered', status: 'complete', time: '2023-07-24T20:30:00' },
    ],
  },
  {
    id: 'ORD-2023-004',
    status: 'cancelled',
    date: '2023-07-23T12:30:00',
    vendor: {
      id: 4,
      name: 'Taco Fiesta',
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    },
    items: [
      { id: 8, name: 'Chicken Tacos', quantity: 3, price: 10.99 },
      { id: 9, name: 'Guacamole & Chips', quantity: 1, price: 5.99 },
    ],
    deliveryFee: 1.99,
    tax: 1.46,
    total: 31.41,
    deliveryAddress: '123 Main St, Apartment 4B, City, 12345',
    paymentMethod: 'VISA •••• 4242',
    cancelledAt: '2023-07-23T12:45:00',
    cancellationReason: 'Restaurant was closed',
    refundStatus: 'refunded',
    trackingSteps: [
      { id: 1, name: 'Order Placed', status: 'complete', time: '2023-07-23T12:30:00' },
      { id: 2, name: 'Cancelled', status: 'cancelled', time: '2023-07-23T12:45:00' },
    ],
  },
];

const statusConfig = {
  preparing: {
    title: 'Preparing your order',
    description: 'The restaurant is preparing your food',
    icon: ClockIcon,
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
  },
  'on-the-way': {
    title: 'On the way',
    description: 'Your order is being delivered',
    icon: TruckIcon,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  delivered: {
    title: 'Delivered',
    description: 'Your order has been delivered',
    icon: CheckCircleIcon,
    iconColor: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  cancelled: {
    title: 'Cancelled',
    description: 'Your order was cancelled',
    icon: XCircleIcon,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
  },
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      return order.status === 'preparing' || order.status === 'on-the-way';
    } else {
      return order.status === 'delivered' || order.status === 'cancelled';
    }
  });

  // Group orders by date
  const groupedOrders = filteredOrders.reduce((groups: {[key: string]: any[]}, order) => {
    const date = new Date(order.date);
    const dateStr = activeTab === 'active' 
      ? 'Today' 
      : date.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric',
          year: 'numeric' 
        });
    
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(order);
    return groups;
  }, {});

  // Handle order selection
  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };



  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // Calculate order subtotal
  const calculateSubtotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Render order status badge

  // Render tracking steps
  const renderTrackingSteps = (order: any) => {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Order Status</h3>
        <div className="space-y-4">
          {order.trackingSteps.map((step: any) => (
            <div key={step.id} className="flex items-start">
              <div className="flex-shrink-0">
                {step.status === 'complete' ? (
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                  </div>
                ) : step.status === 'current' ? (
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-ping"></div>
                  </div>
                ) : step.status === 'cancelled' ? (
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircleIcon className="h-5 w-5 text-red-600" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  step.status === 'complete' ? 'text-gray-900' : 
                  step.status === 'current' ? 'text-blue-700' :
                  step.status === 'cancelled' ? 'text-red-700' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
                {step.time && (
                  <p className="text-xs text-gray-500">
                    {formatDate(step.time)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render order card
  const renderOrderCard = (orderItem: any) => {
    const status = statusConfig[orderItem.status as keyof typeof statusConfig];
    const StatusIcon = status.icon;

    return (
      <div 
        key={orderItem.id}
        className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={() => handleOrderClick(orderItem)}
      >
        <div className="p-6">
          <div className="flex justify-between">
            <div className="flex items-center">
              <img
                src={orderItem.vendor.image}
                alt={orderItem.vendor.name}
                className="h-8 w-8 rounded-full"
              />
              <div className="ml-3">
                <h3 className="text-base font-medium text-gray-900">
                  {orderItem.vendor.name}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  {formatDate(orderItem.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`text-sm font-medium ${status.iconColor}`}>
                <StatusIcon className={`h-5 w-5 mr-1`} />
                {status.title}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Order Summary</h4>
            <div className="mt-2">
              {orderItem.items.slice(0, 3).map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex">
                    <span className="text-sm font-medium text-gray-900">{item.quantity}x</span>
                    <span className="ml-2 text-sm text-gray-900">{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              {orderItem.items.length > 3 && (
                <span className="text-gray-500"> +{orderItem.items.length - 3} more</span>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <span className="text-sm font-medium text-gray-900">Total:</span>
            <span className="text-sm font-medium text-gray-900">${orderItem.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  // Render order detail modal
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;

    const status = statusConfig[selectedOrder.status as keyof typeof statusConfig];
    const StatusIcon = status.icon;
    const subtotal = calculateSubtotal(selectedOrder.items);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Order #{selectedOrder.id}</h2>
            <button 
              onClick={() => setIsOrderDetailOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Order status */}
          <div className="p-6">
            <div className={`p-4 rounded-lg ${status.bgColor} mb-6`}>
              <div className="flex items-center">
                <StatusIcon className={`h-8 w-8 ${status.iconColor}`} />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">{status.title}</h3>
                  <p className="text-sm text-gray-600">{status.description}</p>
                  {selectedOrder.estimatedDelivery && selectedOrder.status !== 'cancelled' && (
                    <p className="text-sm text-gray-600 mt-1">
                      Estimated delivery: {formatDate(selectedOrder.estimatedDelivery)}
                    </p>
                  )}
                  {selectedOrder.deliveredAt && (
                    <p className="text-sm text-gray-600 mt-1">
                      Delivered on: {formatDate(selectedOrder.deliveredAt)}
                    </p>
                  )}
                  {selectedOrder.cancellationReason && (
                    <p className="text-sm text-red-600 mt-1">
                      Reason: {selectedOrder.cancellationReason}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tracking steps */}
            {renderTrackingSteps(selectedOrder)}

            {/* Delivery person info */}
            {selectedOrder.deliveryPerson && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Your delivery person</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {selectedOrder.deliveryPerson.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{selectedOrder.deliveryPerson.name}</p>
                    <div className="flex items-center mt-1">
                      <StarIconSolid className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm text-gray-600">
                        {selectedOrder.deliveryPerson.rating.toFixed(1)}
                      </span>
                      <span className="mx-1 text-gray-300">•</span>
                      <a href={`tel:${selectedOrder.deliveryPerson.phone.replace(/[^0-9+]/g, '')}`} className="text-sm text-indigo-600 hover:text-indigo-800">
                        Call
                      </a>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{selectedOrder.deliveryPerson.vehicle}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order items */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Order details</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex">
                      <span className="text-sm font-medium text-gray-900">{item.quantity}x</span>
                      <span className="ml-2 text-sm text-gray-900">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Order summary */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-600 py-1">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 py-1">
                  <span>Delivery Fee</span>
                  <span>${selectedOrder.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 py-1">
                  <span>Tax</span>
                  <span>${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900 pt-2 mt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery and payment info */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Address</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.deliveryAddress}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col space-y-3">
                {selectedOrder.status === 'delivered' && (
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <ReceiptRefundIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Request a refund
                  </button>
                )}
                {selectedOrder.status === 'cancelled' && selectedOrder.refundStatus === 'refunded' && (
                  <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    Your refund of ${selectedOrder.total.toFixed(2)} has been processed.
                  </div>
                )}
                <button
                  onClick={() => setIsOrderDetailOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mt-4 flex space-x-3">
            {activeTab === 'past' && selectedOrder.status === 'delivered' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle reorder
                  console.log('Reorder:', selectedOrder.id);
                }}
                className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
                Reorder
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedOrder(selectedOrder);
                setIsOrderDetailOpen(true);
              }}
              className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <EyeIcon className="-ml-1 mr-2 h-4 w-4" />
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 text-gray-300">
        <ShoppingBagIcon className="h-full w-full" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No {activeTab === 'active' ? 'active' : 'past'} orders
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {activeTab === 'active' 
          ? 'You don\'t have any active orders right now.' 
          : 'Your order history will appear here.'}
      </p>
      <div className="mt-6">
        <Link
          to="/customer/home"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5" />
          Start Ordering
        </Link>
      </div>
    </div>
  );

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'active' | 'past')}
            >
              <option value="active">Active Orders</option>
              <option value="past">Order History</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'active'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Active Orders
                  {activeTab === 'active' && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {filteredOrders.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'past'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Order History
                  {activeTab === 'past' && (
                    <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {filteredOrders.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Orders list */}
        {Object.keys(groupedOrders).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedOrders).map(([date, dateOrders]) => (
              <div key={date} className="space-y-4">
                <h2 className="text-sm font-medium text-gray-500">{date}</h2>
                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                  {(dateOrders as any[]).map((order) => renderOrderCard(order))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </main>

      {/* Order detail modal */}
      {isOrderDetailOpen && selectedOrder && renderOrderDetail()}

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button className="flex flex-col items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs mt-1">Search</span>
            </button>
            <button className="flex flex-col items-center justify-center px-4 py-2 text-indigo-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs mt-1">Orders</span>
            </button>
            <button className="flex flex-col items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-900">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">Account</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Orders;

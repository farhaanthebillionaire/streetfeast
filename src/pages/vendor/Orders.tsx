import { Search } from 'lucide-react';

// Alias for backward compatibility
const SearchIcon = Search;
import { 
  format, 
  parseISO, 
  isWithinInterval, 
  formatDistanceToNow
} from 'date-fns';
import { tr } from 'date-fns/locale';
import { useState, useEffect, useCallback, useMemo } from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  items: OrderItem[];
  status: 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderTime: string;
  estimatedReady?: string;
  completedTime?: string;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  phone?: string;
  specialInstructions?: string;
  preparationTime?: number; // in minutes
  isPreparing?: boolean;
  timeElapsed?: number; // in seconds
  notes?: string;
  isUrgent?: boolean;
  startedPreparingAt?: string;
}

// Order status and type constants for type safety
type OrderStatus = 'preparing' | 'ready' | 'completed' | 'cancelled';
type DeliveryType = 'delivery' | 'pickup';

// Status styles for order status badges
const statusStyles = {
  preparing: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳' },
  ready: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '✅' },
  completed: { bg: 'bg-green-100', text: 'text-green-800', icon: '✓' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: '✕' },
} as const;



const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    items: [
      { id: '1', name: 'Chicken Burger', quantity: 2, price: 12.99 },
      { id: '2', name: 'Fries', quantity: 1, price: 4.99 }
    ],
    orderTime: new Date().toISOString(),
    status: 'preparing',
    deliveryType: 'delivery',
    address: '123 Main St, Anytown',
    phone: '555-123-4567',
    specialInstructions: 'No onions please'
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    items: [
      { id: '3', name: 'Veggie Pizza', quantity: 1, price: 14.99 },
      { id: '4', name: 'Garlic Bread', quantity: 2, price: 5.99 },
      { id: '5', name: 'Soda', quantity: 2, price: 2.99 }
    ],
    orderTime: new Date().toISOString(),
    status: 'ready',
    deliveryType: 'pickup',
    phone: '555-987-6543'
  },
  {
    id: 'ORD-003',
    customer: 'Bob Johnson',
    items: [
      { id: '6', name: 'Steak Dinner', quantity: 1, price: 24.99 },
      { id: '7', name: 'Mashed Potatoes', quantity: 1, price: 4.99 },
      { id: '8', name: 'Chocolate Cake', quantity: 1, price: 7.99 }
    ],
    orderTime: new Date().toISOString(),
    status: 'completed',
    deliveryType: 'delivery',
    address: '789 Oak Ave, Somewhere',
    phone: '555-456-7890',
    completedTime: new Date().toISOString()
  }
];

const calculateTotalItems = (items: OrderItem[]) => {
  return items.reduce((total: number, item: OrderItem) => total + item.quantity, 0);
};

const calculateOrderTotal = (items: OrderItem[]) => {
  return items.reduce((total: number, item: OrderItem) => total + (item.price * item.quantity), 0);
};

const renderStatusBadge = (status: OrderStatus, order?: Order) => {
  const statusInfo = statusStyles[status];
  const isPreparing = order?.isPreparing && status === 'preparing';
  
  return (
    <div className="flex flex-col">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
        {statusInfo.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {isPreparing && order?.preparationTime && order.timeElapsed !== undefined && (
        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full" 
            style={{ 
              width: `${Math.min(100, ((order.timeElapsed || 0) / ((order.preparationTime || 15) * 60)) * 100)}%`
            }}
          />
        </div>
      )}
    </div>
  );
};

const renderOrderItems = (items: OrderItem[]) => {
  return items.map((item: OrderItem, index: number) => (
    <div key={`${item.id}-${index}`} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700">{item.name}</span>
        <span className="ml-2 text-sm text-gray-500">x{item.quantity}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  ));
};

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // State for filters, search, and view
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<DeliveryType | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Toggle preparation status for an order
  const togglePreparationStatus = useCallback((orderId: string) => {
    updateOrdersArray((currentOrders: Order[]) => 
      currentOrders.map((order: Order): Order => {
        if (order.id !== orderId) return order;
        
        const isStarting = !order.isPreparing;
        const now = new Date();
        
        const updatedOrder: Order = {
          ...order,
          isPreparing: isStarting,
          status: isStarting ? 'preparing' : 'ready',
          timeElapsed: isStarting ? 0 : undefined,
          startedPreparingAt: isStarting ? now.toISOString() : undefined,
        };
        
        if (isStarting) {
          updatedOrder.estimatedReady = new Date(
            now.getTime() + (order.preparationTime || 15) * 60000
          ).toISOString();
        } else {
          updatedOrder.estimatedReady = undefined;
        }
        
        return updatedOrder;
      })
    );
  }, []);

  // Helper function to ensure status is valid
  const getValidStatus = (status: any): OrderStatus => {
    const validStatuses: OrderStatus[] = ['preparing', 'ready', 'completed', 'cancelled'];
    return validStatuses.includes(status) ? status as OrderStatus : 'preparing';
  };
  
  // Helper to safely update orders array with type safety
  const updateOrdersArray = (updater: (orders: Order[]) => Order[]) => {
    setAllOrders((currentOrders: Order[]) => 
      updater(currentOrders).map(order => ({
        ...order,
        status: getValidStatus(order.status)
      }))
    );
  };

  // Update preparation timers every second
  useEffect(() => {
    const timer = setInterval(() => {
      updateOrdersArray(currentOrders => 
        currentOrders.map(order => {
          if (!order.isPreparing || !order.startedPreparingAt) return order;
          
          const now = new Date();
          const startTime = new Date(order.startedPreparingAt);
          const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
          
          // Auto-update to 'ready' if preparation time has passed
          if (order.estimatedReady && new Date(order.estimatedReady) <= now) {
            return {
              ...order,
              status: 'ready',
              isPreparing: false,
              timeElapsed: order.preparationTime ? order.preparationTime * 60 : 0
            };
          }
          
          return {
            ...order,
            timeElapsed: elapsedSeconds
          };
        })
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    // In a real app, this would be a WebSocket connection
    const ws = new WebSocket('ws://localhost:3000/ws/orders');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Ensure status is one of the allowed values
        const status: OrderStatus = ['preparing', 'ready', 'completed', 'cancelled'].includes(data.status)
          ? data.status as OrderStatus
          : 'preparing';
          
        const newOrder: Order = {
          id: data.id || `order-${Date.now()}`,
          customer: data.customer || 'New Customer',
          items: (data.items || []).map((item: any) => ({
            id: String(item.id || Math.random().toString(36).substr(2, 9)),
            name: String(item.name || 'Unknown Item'),
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0
          })),
          status,
          orderTime: data.orderTime || new Date().toISOString(),
          deliveryType: data.deliveryType === 'pickup' ? 'pickup' : 'delivery',
          address: data.address,
          phone: data.phone,
          specialInstructions: data.specialInstructions,
          preparationTime: data.preparationTime || 15,
          isPreparing: status === 'preparing',
          timeElapsed: 0,
          startedPreparingAt: status === 'preparing' ? new Date().toISOString() : undefined,
          estimatedReady: status === 'preparing' 
            ? new Date(Date.now() + (data.preparationTime || 15) * 60000).toISOString()
            : undefined
        };
        
        setAllOrders((prevOrders: Order[]) => [newOrder, ...prevOrders]);
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    // Cleanup function
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAllOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update order status with proper type safety
  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    updateOrdersArray((currentOrders: Order[]) => 
      currentOrders.map((order: Order): Order => {
        if (order.id !== orderId) return order;
        
        // Ensure the status is valid
        const validStatus = getValidStatus(newStatus);
        
        const updatedOrder: Order = {
          ...order,
          status: validStatus,
          isPreparing: validStatus === 'preparing'
        };
        
        if (validStatus === 'completed') {
          updatedOrder.completedTime = new Date().toISOString();
          updatedOrder.isPreparing = false;
        }
        
        if (validStatus === 'ready') {
          updatedOrder.estimatedReady = new Date().toISOString();
          updatedOrder.isPreparing = false;
        }
        
        return updatedOrder;
      })
    );
  }, []);

  // Filter orders based on active/completed status, search, and filters
  const { activeOrders, completedOrders } = useMemo(() => {
    
    // Separate active and completed orders
    const active: Order[] = [];
    const completed: Order[] = [];
    
    allOrders.forEach(order => {
      const isCompleted = order.status === 'completed' || order.status === 'cancelled';
      if (isCompleted) {
        completed.push(order);
      } else {
        active.push(order);
      }
    });
    
    return { activeOrders: active, completedOrders: completed };
  }, [allOrders]);

  // Filter orders based on search and filters with type safety
  const filteredOrders = useMemo<Order[]>(() => {
    const sourceOrders = activeTab === 'active' ? activeOrders : completedOrders;
    let result = [...sourceOrders];

    // Apply status filter (only if not already filtered by active/completed)
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(order => order.deliveryType === typeFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      result = result.filter(order => {
        const orderDate = parseISO(order.orderTime);
        return isWithinInterval(orderDate, { 
          start: dateRange.start as Date, 
          end: dateRange.end as Date 
        });
      });
    }

    return result;
  }, [allOrders, statusFilter, typeFilter, searchQuery, dateRange]);

  // Calculate order statistics
  const stats = useMemo(() => {
    return {
      total: filteredOrders.length,
      preparing: filteredOrders.filter((o) => o.status === 'preparing').length,
      ready: filteredOrders.filter((o) => o.status === 'ready').length,
      completed: filteredOrders.filter((o) => o.status === 'completed').length,
      cancelled: filteredOrders.filter((o) => o.status === 'cancelled').length,
    };
  }, [filteredOrders]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      
      {/* Filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter - Only show relevant statuses for active/completed tabs */}
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
        >
          <option value="all">All {activeTab === 'active' ? 'Active' : 'Completed'}</option>
          {activeTab === 'active' ? (
            <>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready for Pickup</option>
            </>
          ) : (
            <>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </>
          )}
        </select>

        {/* Type Filter */}
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as DeliveryType | 'all')}
        >
          <option value="all">All Types</option>
          <option value="delivery">Delivery</option>
          <option value="pickup">Pickup</option>
        </select>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Preparing</dt>
            <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.preparing}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Ready</dt>
            <dd className="mt-1 text-3xl font-semibold text-blue-600">{stats.ready}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.completed}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Cancelled</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">{stats.cancelled}</dd>
          </div>
        </div>
      </div>
      
      {/* Tabs for Active/Completed orders */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`${activeTab === 'active' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Active Orders
            <span className="ml-2 bg-indigo-100 text-indigo-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeOrders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`${activeTab === 'completed' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Order History
            <span className="ml-2 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {completedOrders.length}
            </span>
          </button>
        </nav>
      </div>
      
      {/* Orders List */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {activeTab === 'active' ? 'No active orders' : 'No order history'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {activeTab === 'active' 
                      ? 'New orders will appear here.' 
                      : 'Completed and cancelled orders will appear here.'}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Order
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Items
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {activeTab === 'active' ? 'Time Elapsed' : 'Completed'}
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                      >
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 ${activeTab === 'completed' ? 'opacity-75 hover:opacity-100' : ''}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {order.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {order.customer}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {calculateTotalItems(order.items)} items
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.deliveryType === 'delivery'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {renderStatusBadge(order.status, order)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {activeTab === 'active' ? (
                            order.status === 'preparing' && order.timeElapsed !== undefined ? (
                              <div className="flex items-center">
                                <span className="mr-2">
                                  {Math.floor(order.timeElapsed / 60)}:{(order.timeElapsed % 60).toString().padStart(2, '0')}
                                </span>
                                {order.estimatedReady && (
                                  <span className="text-xs text-gray-400">
                                    (est. {formatDistanceToNow(parseISO(order.estimatedReady))} left)
                                  </span>
                                )}
                              </div>
                            ) : order.status === 'ready' ? (
                              <span className="text-yellow-600">Ready for pickup</span>
                            ) : (
                              formatDistanceToNow(parseISO(order.orderTime), { addSuffix: true })
                            )
                          ) : (
                            format(parseISO(order.completedTime || order.orderTime), 'MMM d, yyyy h:mm a')
                          )}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            type="button"
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                          >
                            View<span className="sr-only">, {order.id}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Order #{selectedOrder.id}
                      </h3>
                      <div className="flex items-center">
                        {renderStatusBadge(selectedOrder.status)}
                        <button
                          type="button"
                          className="ml-4 bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={() => setSelectedOrder(null)}
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{selectedOrder.customer}</h4>
                            <p className="text-sm text-gray-500">
                              {selectedOrder.deliveryType === 'delivery' 
                                ? `Delivery to ${selectedOrder.address}` 
                                : 'Pickup'}
                            </p>
                            {selectedOrder.phone && (
                              <p className="text-sm text-gray-500 mt-1">
                                Phone: {selectedOrder.phone}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              Ordered at {format(parseISO(selectedOrder.orderTime), 'hh:mm a', { locale: tr })}
                            </p>
                            {selectedOrder.estimatedReady && (
                              <p className="text-sm text-gray-500">
                                Ready by {format(parseISO(selectedOrder.estimatedReady), 'hh:mm a', { locale: tr })}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {selectedOrder.specialInstructions && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700">Special Instructions:</p>
                            <p className="text-sm text-gray-500">{selectedOrder.specialInstructions}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                        {renderOrderItems(selectedOrder.items)}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Total</p>
                            <p>${calculateOrderTotal(selectedOrder.items).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedOrder.status === 'preparing' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      togglePreparationStatus(selectedOrder.id);
                    }}
                  >
                    Mark as Ready
                  </button>
                )}
                {selectedOrder.status === 'ready' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'completed');
                      setSelectedOrder(null);
                    }}
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

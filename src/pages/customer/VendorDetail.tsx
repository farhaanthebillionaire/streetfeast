import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  ShoppingCart, 
  Gift, 
  CheckCircle2 as CheckCircleIcon,
  ShieldCheck as ShieldCheckIconSolid 
} from 'lucide-react';

// Aliases for backward compatibility
const StarIcon = Star;
const StarIconSolid = Star;
const ClockIcon = Clock;
const ShoppingCartIcon = ShoppingCart;
const GiftIcon = Gift;

// Mock data - in a real app, this would come from an API
const mockVendor = {
  id: 1,
  name: 'Burger House',
  cuisine: 'American, Fast Food',
  rating: 4.5,
  reviewCount: 128,
  deliveryTime: '20-30 min',
  minOrder: '$10',
  isOpen: true,
  image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
  hygieneBadge: true,
  hygieneScore: 4.8,
  loyaltyPerks: [
    'Earn 5 points per $1 spent',
    'Free item after 10 orders',
    'Exclusive weekly deals'
  ],
  menu: [
    {
      category: 'Burgers',
      items: [
        { id: 1, name: 'Classic Burger', description: 'Beef patty with lettuce, tomato, and special sauce', price: 8.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60' },
        { id: 2, name: 'Cheeseburger', description: 'Classic burger with American cheese', price: 9.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60' },
      ]
    },
    {
      category: 'Sides',
      items: [
        { id: 3, name: 'French Fries', description: 'Crispy golden fries with sea salt', price: 3.99, image: 'https://images.unsplash.com/photo-1576562150891-2973999a64ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60' },
        { id: 4, name: 'Onion Rings', description: 'Crispy battered onion rings', price: 4.99, image: 'https://images.unsplash.com/photo-1604329760661-dcf5b96cc944?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60' },
      ]
    }
  ],
  reviews: [
    { id: 1, user: 'John D.', rating: 5, comment: 'Amazing burgers! The best in town.', date: '2023-07-20' },
    { id: 2, user: 'Sarah M.', rating: 4, comment: 'Great food, fast delivery.', date: '2023-07-18' },
  ]
};

const VendorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [quantity, setQuantity] = useState<{[key: number]: number}>({});

  interface MenuCategory {
    category: string;
    items: Array<{
      id: number;
      name: string;
      description: string;
      price: number;
      image: string;
    }>;
  }

  useEffect(() => {
    // In a real app, fetch vendor data by ID from an API
    setVendor(mockVendor);
    
    // Initialize quantities
    const initialQuantities: {[key: number]: number} = {};
    mockVendor.menu.forEach((category: MenuCategory) => {
      category.items.forEach(item => {
        initialQuantities[item.id] = 1;
      });
    });
    setQuantity(initialQuantities);
  }, [id]);

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + (quantity[itemId] || 1)
    }));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  if (!vendor) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  const cartTotal = Object.entries(cart).reduce((total, [itemId, qty]) => {
    // Find the item in the menu
    let itemPrice = 0;
    vendor.menu.forEach((category: MenuCategory) => {
      const item = category.items.find((i) => i.id === parseInt(itemId));
      if (item) itemPrice = item.price;
    });
    return total + (itemPrice * qty);
  }, 0);

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with vendor info */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 lg:w-1/4">
              <img 
                src={vendor.image} 
                alt={vendor.name}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                {vendor.hygieneBadge && (
                  <div className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    <ShieldCheckIconSolid className="h-5 w-5 mr-1" />
                    <span>Hygiene Certified</span>
                  </div>
                )}
              </div>
              
              <div className="mt-2 flex items-center text-gray-600">
                <div className="flex items-center">
                  <StarIconSolid className="h-5 w-5 text-yellow-400" />
                  <span className="ml-1 font-medium">{vendor.rating}</span>
                  <span className="mx-2">•</span>
                  <span>{vendor.reviewCount} reviews</span>
                  <span className="mx-2">•</span>
                  <span>{vendor.cuisine}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-1" />
                <span>Delivery: {vendor.deliveryTime}</span>
                <span className="mx-2">•</span>
                <span>Min. order: {vendor.minOrder}</span>
              </div>
              
              {vendor.loyaltyPerks && (
                <div className="mt-4">
                  <div className="flex items-center text-sm font-medium text-indigo-700">
                    <GiftIcon className="h-5 w-5 mr-1" />
                    <span>Loyalty Perks</span>
                  </div>
                  <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                    {vendor.loyaltyPerks.map((perk: string, index: number) => (
                      <li key={index}>{perk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('menu')}
                className={`${activeTab === 'menu' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`${activeTab === 'reviews' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Reviews ({vendor.reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`${activeTab === 'info' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Info
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Menu/Content Area */}
          <div className="lg:w-2/3">
            {activeTab === 'menu' && (
              <div className="space-y-8">
                {vendor.menu.map((category: any) => (
                  <div key={category.category} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {category.items.map((item: any) => (
                        <div key={item.id} className="p-6 flex">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-gray-600">{item.description}</p>
                            <p className="mt-2 font-medium text-gray-900">${item.price.toFixed(2)}</p>
                            <div className="mt-3 flex items-center">
                              <button 
                                onClick={() => updateQuantity(item.id, (quantity[item.id] || 1) - 1)}
                                className="w-8 h-8 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              >
                                -
                              </button>
                              <div className="w-12 h-8 border-t border-b border-gray-300 flex items-center justify-center">
                                {quantity[item.id] || 1}
                              </div>
                              <button 
                                onClick={() => updateQuantity(item.id, (quantity[item.id] || 1) + 1)}
                                className="w-8 h-8 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              >
                                +
                              </button>
                              <button
                                onClick={() => addToCart(item.id)}
                                className="ml-3 px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          {item.image && (
                            <div className="ml-6 flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-24 h-24 rounded-md object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {vendor.reviews.map((review: any) => (
                    <div key={review.id} className="p-6">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            i < review.rating ? 
                            <StarIconSolid key={i} className="h-5 w-5 text-yellow-400" /> : 
                            <StarIcon key={i} className="h-5 w-5 text-gray-300" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                      </div>
                      <h4 className="mt-2 font-medium text-gray-900">{review.user}</h4>
                      <p className="mt-1 text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'info' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">About {vendor.name}</h2>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>10:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday - Sunday</span>
                      <span>11:00 AM - 11:00 PM</span>
                    </div>
                  </div>
                  
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Hygiene Information</h3>
                  <div className="mt-2 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-start">
                      <ShieldCheckIconSolid className="h-6 w-6 text-green-600 mt-0.5" />
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-green-800">Hygiene Certified</h4>
                        <div className="mt-1 flex items-center">
                          <div className="flex items-center">
                            <StarIconSolid className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium text-green-700">{vendor.hygieneScore} Hygiene Score</span>
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-green-700">This vendor has passed all food safety and hygiene inspections.</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="mt-6 text-lg font-medium text-gray-900">Contact Information</h3>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>123 Food Street, Cuisine District</p>
                    <p>New York, NY 10001</p>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Cart Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Order</h2>
              </div>
              
              {cartItemCount === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2">Your cart is empty</p>
                  <p className="text-sm">Add items to get started</p>
                </div>
              ) : (
                <>
                  <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                    {Object.entries(cart).map(([itemId, qty]) => {
                      // Find the item in the menu
                      let item: any = null;
                      vendor.menu.forEach((category: any) => {
                        const found = category.items.find((i: any) => i.id === parseInt(itemId));
                        if (found) item = found;
                      });
                      
                      if (!item) return null;
                      
                      return (
                        <div key={itemId} className="p-4 flex items-center">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)} × {qty}</p>
                          </div>
                          <p className="font-medium">${(item.price * qty).toFixed(2)}</p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">${(cartTotal > 0 ? 2.99 : 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span>Total</span>
                      <span>${(cartTotal > 0 ? cartTotal + 2.99 : 0).toFixed(2)}</span>
                    </div>
                    <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md font-medium">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Loyalty Card */}
            <div className="mt-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow overflow-hidden">
              <div className="p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">Loyalty Rewards</h3>
                    <p className="text-sm opacity-90 mt-1">Earn points with every order</p>
                  </div>
                  <div className="bg-yellow-600 rounded-full w-12 h-12 flex items-center justify-center">
                    <GiftIcon className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Gold Tier</span>
                    <span>1,250/2,500 pts</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <p className="mt-2 text-xs opacity-90">1,250 more points to Platinum Tier</p>
                </div>
                
                <div className="mt-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-white mr-1" />
                    <span>5% off all orders</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <CheckCircleIcon className="h-4 w-4 text-white mr-1" />
                    <span>Free delivery over $15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;

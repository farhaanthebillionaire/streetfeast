import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search as MagnifyingGlassIcon, Star as StarIcon, Clock as ClockIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const vendors = [
  {
    id: 1,
    name: 'Burger House',
    cuisine: 'American, Fast Food',
    rating: 4.5,
    reviewCount: 128,
    deliveryTime: '20-30 min',
    deliveryFee: '$2.99',
    minOrder: '$10',
    isOpen: true,
    coordinates: [51.505, -0.09],
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    tags: ['Burgers', 'Fries', 'Shakes']
  },
  {
    id: 2,
    name: 'Pizza Palace',
    cuisine: 'Italian, Pizza',
    rating: 4.2,
    reviewCount: 89,
    deliveryTime: '25-35 min',
    deliveryFee: 'Free',
    minOrder: '$15',
    isOpen: true,
    coordinates: [51.51, -0.1],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    tags: ['Pizza', 'Pasta', 'Salads']
  },
  {
    id: 3,
    name: 'Taco Fiesta',
    cuisine: 'Mexican, Street Food',
    rating: 4.7,
    reviewCount: 156,
    deliveryTime: '15-25 min',
    deliveryFee: '$1.99',
    minOrder: '$8',
    isOpen: true,
    coordinates: [51.52, -0.08],
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    tags: ['Tacos', 'Burritos', 'Quesadillas']
  },
  {
    id: 4,
    name: 'Sushi Express',
    cuisine: 'Japanese, Sushi',
    rating: 4.4,
    reviewCount: 112,
    deliveryTime: '30-45 min',
    deliveryFee: '$3.99',
    minOrder: '$20',
    isOpen: false,
    coordinates: [51.515, -0.07],
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    tags: ['Sushi', 'Sashimi', 'Ramen']
  },
  {
    id: 5,
    name: 'Curry House',
    cuisine: 'Indian, Asian',
    rating: 4.6,
    reviewCount: 201,
    deliveryTime: '25-40 min',
    deliveryFee: 'Free',
    minOrder: '$15',
    isOpen: true,
    coordinates: [51.5, -0.07],
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=60',
    tags: ['Curry', 'Biryani', 'Naan']
  },
];

const cuisines = [
  'All', 'American', 'Italian', 'Mexican', 'Japanese', 'Chinese', 'Indian', 'Thai', 'Mediterranean', 'Vegetarian', 'Vegan'
];

const filters = [
  { name: 'Rating 4.0+', value: 'rating_4' },
  { name: 'Free Delivery', value: 'free_delivery' },
  { name: 'Open Now', value: 'open_now' },
  { name: 'Under $10', value: 'under_10' },
  { name: 'Under 30 min', value: 'fast_delivery' },
];

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const CustomerHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [mapView, setMapView] = useState(false);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to London if location access is denied
          setCurrentLocation([51.505, -0.09]);
        }
      );
    } else {
      // Default to London if geolocation is not supported
      setCurrentLocation([51.505, -0.09]);
    }
  }, []);

  const toggleFilter = (filterValue: string) => {
    setActiveFilters(prev =>
      prev.includes(filterValue)
        ? prev.filter(f => f !== filterValue)
        : [...prev, filterValue]
    );
  };

  const filteredVendors = vendors.filter(vendor => {
    // Filter by search query
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by cuisine
    const matchesCuisine = selectedCuisine === 'All' || 
      vendor.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
    
    // Apply active filters
    const matchesFilters = activeFilters.every(filter => {
      switch (filter) {
        case 'rating_4':
          return vendor.rating >= 4.0;
        case 'free_delivery':
          return vendor.deliveryFee === 'Free';
        case 'open_now':
          return vendor.isOpen;
        case 'under_10':
          return parseFloat(vendor.minOrder.replace(/[^0-9.]/g, '')) <= 10;
        case 'fast_delivery':
          return parseInt(vendor.deliveryTime) <= 30;
        default:
          return true;
      }
    });
    
    return matchesSearch && matchesCuisine && matchesFilters;
  });

  const handleVendorClick = (vendorId: number) => {
    setSelectedVendor(vendorId);
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setCurrentLocation([vendor.coordinates[0], vendor.coordinates[1]]);
    }
  };

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding vendors near you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with search */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">StreetFeast</h1>
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search for food or cuisine"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setMapView(!mapView)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mapView ? 'List View' : 'Map View'}
            </button>
          </div>
          
          {/* Cuisine filter */}
          <div className="mt-4 flex overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setSelectedCuisine(cuisine)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCuisine === cuisine
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quick filters */}
          <div className="mt-3 flex overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => toggleFilter(filter.value)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                    activeFilters.includes(filter.value)
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {mapView ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="h-[600px] relative">
              <MapContainer 
                center={currentLocation} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <RecenterMap lat={currentLocation[0]} lng={currentLocation[1]} />
                {vendors.map((vendor) => (
                  <Marker 
                    key={vendor.id} 
                    position={[vendor.coordinates[0], vendor.coordinates[1]]}
                    eventHandlers={{
                      click: () => handleVendorClick(vendor.id),
                    }}
                  >
                    <Popup>
                      <div className="w-48">
                        <h3 className="font-medium text-gray-900">{vendor.name}</h3>
                        <div className="flex items-center mt-1">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">
                            {vendor.rating} ({vendor.reviewCount})
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{vendor.cuisine}</p>
                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                          <span>{vendor.deliveryTime}</span>
                          <span>•</span>
                          <span>{vendor.deliveryFee} delivery</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              
              {/* Vendor list overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {filteredVendors.length} {filteredVendors.length === 1 ? 'Vendor' : 'Vendors'} Nearby
                  </h3>
                </div>
                <div className="overflow-y-auto max-h-48">
                  {filteredVendors.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredVendors.map((vendor) => (
                        <li 
                          key={vendor.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${selectedVendor === vendor.id ? 'bg-indigo-50' : ''}`}
                          onClick={() => handleVendorClick(vendor.id)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-200">
                              <img 
                                src={vendor.image} 
                                alt={vendor.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <h4 className="text-sm font-medium text-gray-900">{vendor.name}</h4>
                              <div className="flex items-center mt-1">
                                <StarIcon className="h-3 w-3 text-yellow-400" />
                                <span className="ml-1 text-xs text-gray-600">
                                  {vendor.rating} ({vendor.reviewCount})
                                </span>
                                <span className="mx-1 text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{vendor.cuisine}</span>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                <span>{vendor.deliveryTime}</span>
                                <span className="mx-1">•</span>
                                <span>{vendor.deliveryFee} delivery</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-gray-500">No vendors match your search criteria.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCuisine('All');
                          setActiveFilters([]);
                        }}
                        className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => (
                <div 
                  key={vendor.id} 
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleVendorClick(vendor.id)}
                >
                  <div className="h-40 bg-gray-200 overflow-hidden">
                    <img 
                      src={vendor.image} 
                      alt={vendor.name} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                    {!vendor.isOpen && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                        Closed
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">
                              {vendor.rating} ({vendor.reviewCount})
                            </span>
                          </div>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{vendor.cuisine}</span>
                        </div>
                      </div>
                      {vendor.isOpen && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Open
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{vendor.deliveryTime}</span>
                      </div>
                      <div>
                        {vendor.deliveryFee === 'Free' ? (
                          <span className="text-green-600">Free delivery</span>
                        ) : (
                          <span>Delivery: {vendor.deliveryFee}</span>
                        )}
                        <span className="mx-1">•</span>
                        <span>Min: {vendor.minOrder}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {vendor.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {vendor.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                          +{vendor.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="mx-auto w-16 h-16 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No vendors found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCuisine('All');
                      setActiveFilters([]);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button className="flex flex-col items-center justify-center px-4 py-2 text-indigo-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">Home</span>
            </button>
            <button className="flex flex-col items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs mt-1">Search</span>
            </button>
            <button className="flex flex-col items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs mt-1">Orders</span>
            </button>
            <button className="flex flex-col items-center justify-center px-4 py-2 text-gray-500 hover:text-gray-700">
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

export default CustomerHome;

import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { ChangeEvent } from 'react';
import { Pencil, Trash2, Eye, X, Check } from 'lucide-react';

// Aliases for backward compatibility
const PencilIcon = Pencil;
const TrashIcon = Trash2;
const EyeIcon = Eye;
const XMarkIcon = X;
const CheckIcon = Check;

type MenuItemStatus = 'Available' | 'Out of Stock' | 'Limited' | 'Seasonal' | 'New';

interface MenuItem {
  id: number;
  name: string;
  price: string;
  category: string;
  status: MenuItemStatus;
  description?: string;
  imageUrl?: string;
  lastUpdated?: string;
}

const statusColors = {
  'Available': 'bg-green-100 text-green-800',
  'Out of Stock': 'bg-red-100 text-red-800',
  'Limited': 'bg-yellow-100 text-yellow-800',
  'Seasonal': 'bg-blue-100 text-blue-800',
  'New': 'bg-purple-100 text-purple-800'
};

const initialMenuItems: MenuItem[] = [
  { 
    id: 1, 
    name: 'Classic Burger', 
    price: '8.99', 
    category: 'Burgers', 
    status: 'Available',
    description: 'Juicy beef patty with fresh vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 2, 
    name: 'Veggie Pizza', 
    price: '12.99', 
    category: 'Pizza', 
    status: 'Seasonal',
    description: 'Fresh vegetables on a crispy crust',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 3, 
    name: 'Chicken Tacos', 
    price: '10.50', 
    category: 'Mexican', 
    status: 'Out of Stock',
    description: 'Spicy chicken in soft corn tortillas',
    imageUrl: 'https://images.unsplash.com/photo-1565299582913-604e82ae72f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 4, 
    name: 'Summer Salad', 
    price: '9.99', 
    category: 'Salads', 
    status: 'New',
    description: 'Seasonal fruits and mixed greens with vinaigrette',
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    lastUpdated: new Date().toISOString()
  },
  { 
    id: 5, 
    name: 'Chocolate Lava Cake', 
    price: '6.99', 
    category: 'Desserts', 
    status: 'Limited',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    imageUrl: 'https://images.unsplash.com/photo-1571115173804-bf273b97e8f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    lastUpdated: new Date().toISOString()
  },
];

const categories = [
  'Appetizers', 'Burgers', 'Pizza', 'Pasta', 'Salads', 'Main Course', 
  'Desserts', 'Beverages', 'Sides', 'Breakfast', 'Mexican', 'Asian'
].sort();

const statusOptions: MenuItemStatus[] = ['Available', 'Out of Stock', 'Limited', 'Seasonal', 'New'];

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({ 
    name: '',
    price: '',
    category: '',
    status: 'Available',
    description: '',
    imageUrl: ''
  });
  // Image file state (commented out until needed for actual file upload)
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // In a real app, you would upload the file to a server here
      // and get back a URL to store in your database
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!newItem.name || !newItem.price || !newItem.category) {
      alert('Please fill in all required fields');
      return;
    }

    // In a real app, you would upload the image file to a server here
    // and get back a URL to store in your database
    const imageUrl = previewUrl || newItem.imageUrl;

    if (editingItem) {
      // Update existing item
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id 
          ? { ...newItem, id: editingItem.id, imageUrl } as MenuItem 
          : item
      ));
    } else {
      // Add new item
      const newId = Math.max(0, ...menuItems.map(item => item.id)) + 1;
      setMenuItems([...menuItems, { ...newItem, id: newId, imageUrl } as MenuItem]);
    }

    // Reset form
    setNewItem({ 
      name: '', 
      price: '', 
      category: '', 
      status: 'Available',
      description: '', 
      imageUrl: '' 
    });
    // setImageFile(null);
    setPreviewUrl('');
    setEditingItem(null);
    setIsAddModalOpen(false);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price,
      category: item.category,
      status: item.status,
      description: item.description || '',
      imageUrl: item.imageUrl || ''
    });
    if (item.imageUrl) {
      setPreviewUrl(item.imageUrl);
    }
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const updateStatus = (id: number, newStatus: MenuItemStatus) => {
    setMenuItems(menuItems.map(item => 
      item.id === id 
        ? { 
            ...item, 
            status: newStatus,
            lastUpdated: new Date().toISOString() 
          } 
        : item
    ));
  };

  const getStatusBadge = (status: MenuItemStatus) => (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );

  const resetForm = () => {
    setNewItem({ 
      name: '', 
      price: '', 
      category: '', 
      status: 'Available',
      description: '', 
      imageUrl: '' 
    });
    // setImageFile(null);
    setPreviewUrl('');
    setEditingItem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add New Item
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search menu items..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <select 
            className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue=""
          >
            <option value="">All Categories</option>
            <option>Burgers</option>
            <option>Pizza</option>
            <option>Mexican</option>
            <option>Asian</option>
            <option>Salads</option>
            <option>Desserts</option>
            <option>Beverages</option>
          </select>
          <select 
            className="block w-full sm:w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            defaultValue=""
          >
            <option value="">All Status</option>
            <option>Available</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Menu Items Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                          <div className="mt-1 flex-shrink-0 relative">
                            <img
                              className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                              src={item.imageUrl || 'https://via.placeholder.com/40'}
                              alt={item.name}
                            />
                            <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${statusColors[item.status]?.split(' ')[0] || 'bg-gray-300'}`}></span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          {item.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatPrice(item.price)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                      {item.lastUpdated && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <div className="mt-1 flex items-center space-x-2">
                        <div className="relative group">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                            title="Edit item"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 left-0 -bottom-8 w-16 text-xs bg-gray-800 text-white text-center rounded py-1">
                            Edit
                          </span>
                        </div>
                        
                        <div className="relative group">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Delete item"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 left-0 -bottom-8 w-16 text-xs bg-gray-800 text-white text-center rounded py-1">
                            Delete
                          </span>
                        </div>

                        <div className="relative group">
                          <div className="relative">
                            <select
                              value={item.status}
                              onChange={(e) => updateStatus(item.id, e.target.value as MenuItemStatus)}
                              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-1 px-2 pr-8 rounded leading-tight focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            >
                              {statusOptions.map(option => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                            </div>
                          </div>
                          <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-10 left-0 -bottom-8 w-24 text-xs bg-gray-800 text-white text-center rounded py-1">
                            Change Status
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No menu items found. Add your first item to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={newItem.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            value={newItem.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            {statusOptions.map(option => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="text"
                              name="price"
                              id="price"
                              required
                              value={newItem.price}
                              onChange={handleInputChange}
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          required
                          value={newItem.category}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select a category</option>
                          <option>Burgers</option>
                          <option>Pizza</option>
                          <option>Mexican</option>
                          <option>Asian</option>
                          <option>Salads</option>
                          <option>Desserts</option>
                          <option>Beverages</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={newItem.description}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          {previewUrl ? (
                            <div className="text-center">
                              <div className="mx-auto h-32 w-32 mb-4 relative">
                                <img 
                                  src={previewUrl} 
                                  alt="Preview" 
                                  className="h-full w-full object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPreviewUrl('');
                                    // setImageFile(null);
                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = '';
                                    }
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Click to change image</p>
                            </div>
                          ) : (
                            <div className="space-y-1 text-center">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Upload a file</span>
                                  <input 
                                    id="file-upload" 
                                    name="file-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                    accept="image/*"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  onClick={handleSubmit}
                >
                  <CheckIcon className="h-5 w-5 mr-2" />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    resetForm();
                    setIsAddModalOpen(false);
                  }}
                >
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;

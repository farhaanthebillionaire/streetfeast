import { useState } from 'react';
import { 
  Search, 
  Filter, 
  XCircle,
  ChevronDown,
  ChevronUp,
  UserPlus,
  CheckCircle2,
  MessageSquare as ChatAlt,
  FileText as DocumentText,
  MoreVertical as DotsVertical,
} from 'lucide-react';
import { MessageModal, QuoteModal } from './components/ClientModals';

// Types
export type Client = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive' | 'Pending';
  orders: number;
  totalSpent: number;
  lastOrder: string;
  rating: number;
  tags: string[];
};

export type Message = {
  id: string;
  clientId: string;
  content: string;
  timestamp: string;
  sender: 'supplier' | 'client';
  read: boolean;
};

export type QuoteItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};

// Mock data
const clients: Client[] = [
  {
    id: 'V-001',
    name: 'Tasty Bites',
    contact: 'John Doe',
    email: 'john@tastybites.com',
    phone: '+1 (555) 123-4567',
    location: 'Downtown',
    status: 'Active',
    orders: 24,
    totalSpent: 12500.75,
    lastOrder: '2023-07-20',
    rating: 4.5,
    tags: ['Restaurant', 'Regular'],
  },
  {
    id: 'V-002',
    name: 'Spice Route',
    contact: 'Sarah Johnson',
    email: 'sarah@spiceroute.com',
    phone: '+1 (555) 234-5678',
    location: 'Uptown',
    status: 'Active',
    orders: 18,
    totalSpent: 9875.50,
    lastOrder: '2023-07-22',
    rating: 4.2,
    tags: ['Food Truck', 'Indian'],
  },
  {
    id: 'V-003',
    name: 'Burger Joint',
    contact: 'Mike Wilson',
    email: 'mike@burgerjoint.com',
    phone: '+1 (555) 345-6789',
    location: 'Westside',
    status: 'Inactive',
    orders: 5,
    totalSpent: 2450.25,
    lastOrder: '2023-06-15',
    rating: 3.8,
    tags: ['Fast Food'],
  },
  {
    id: 'V-004',
    name: 'Sushi Masters',
    contact: 'Lisa Chen',
    email: 'lisa@sushimasters.com',
    phone: '+1 (555) 456-7890',
    location: 'Riverside',
    status: 'Active',
    orders: 32,
    totalSpent: 18750.90,
    lastOrder: '2023-07-24',
    rating: 4.7,
    tags: ['Restaurant', 'Japanese', 'High Value'],
  },
  {
    id: 'V-005',
    name: 'Pizza Palace',
    contact: 'David Brown',
    email: 'david@pizzapalace.com',
    phone: '+1 (555) 567-8901',
    location: 'East End',
    status: 'Active',
    orders: 15,
    totalSpent: 7560.30,
    lastOrder: '2023-07-18',
    rating: 4.0,
    tags: ['Pizzeria'],
  },
];

const statuses = ['All', 'Active', 'Inactive', 'Pending'];
const locations = [...new Set(clients.map(client => client.location))];

const Clients = () => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'All',
    location: 'All',
    tag: 'All',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [quoteDetails, setQuoteDetails] = useState({
    subject: '',
    items: [{ name: '', quantity: 1, price: 0, total: 0 }] as QuoteItem[],
    notes: '',
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Filter clients based on search and filters
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
    
    const matchesFilters = 
      (filters.status === 'All' || client.status === filters.status) &&
      (filters.location === 'All' || client.location === filters.location) &&
      (filters.tag === 'All' || client.tags.includes(filters.tag));
    
    return matchesSearch && matchesFilters;
  });

  // Event handlers
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: 'All',
      location: 'All',
      tag: 'All',
    });
  };

  const openMessageModal = (client: Client) => {
    setSelectedClient(client);
    // Mock messages for demo
    setMessages([
      {
        id: '1',
        clientId: client.id,
        content: `Hello ${client.contact}, I'm following up on our last conversation about the new menu items.`,
        timestamp: '2023-07-25T10:30:00',
        sender: 'supplier',
        read: true,
      },
      {
        id: '2',
        clientId: client.id,
        content: 'Hi! Yes, we were discussing the seasonal ingredients for next month.',
        timestamp: '2023-07-25T11:15:00',
        sender: 'client',
        read: true,
      },
    ]);
    setIsMessageModalOpen(true);
  };

  const openQuoteModal = (client: Client) => {
    setSelectedClient(client);
    setQuoteDetails({
      subject: `Quote for ${client.name} - ${new Date().toLocaleDateString()}`,
      items: [{ name: '', quantity: 1, price: 0, total: 0 }],
      notes: '',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsQuoteModalOpen(true);
  };

  // Message and Quote handlers
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedClient) return;
    
    const message: Message = {
      id: Date.now().toString(),
      clientId: selectedClient.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'supplier',
      read: false,
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // In a real app, send the message to the server
    console.log('Message sent to', selectedClient.name, ':', message);
  };

  const sendQuote = () => {
    if (!selectedClient) return;
    
    // In a real app, send the quote to the server
    console.log('Quote sent to', selectedClient.name, ':', {
      ...quoteDetails,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      date: new Date().toISOString(),
    });
    
    setIsQuoteModalOpen(false);
    alert(`Quote sent to ${selectedClient.contact} at ${selectedClient.name}`);
  };

  const addQuoteItem = () => {
    setQuoteDetails({
      ...quoteDetails,
      items: [...quoteDetails.items, { name: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const removeQuoteItem = (index: number) => {
    const updatedItems = [...quoteDetails.items];
    updatedItems.splice(index, 1);
    setQuoteDetails({
      ...quoteDetails,
      items: updatedItems.length > 0 ? updatedItems : [{ name: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const updateQuoteItem = (index: number, field: string, value: any) => {
    const updatedItems = [...quoteDetails.items];
    
    if (field === 'quantity' || field === 'price') {
      const numValue = parseFloat(value) || 0;
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: numValue,
        total: field === 'price' 
          ? numValue * (updatedItems[index].quantity || 0)
          : numValue * (updatedItems[index].price || 0)
      };
    } else {
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      };
    }
    
    setQuoteDetails({
      ...quoteDetails,
      items: updatedItems
    });
  };

  const handleQuoteChange = (field: string, value: any) => {
    setQuoteDetails({
      ...quoteDetails,
      [field]: value
    });
  };

  // UI Components
  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'Active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status === 'Active' ? (
        <CheckCircle2 className="-ml-0.5 mr-1.5 h-3.5 w-3.5 text-green-500" />
      ) : (
        <XCircle className="-ml-0.5 mr-1.5 h-3.5 w-3.5 text-red-500" />
      )}
      {status}
    </span>
  );

  const Tags = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-wrap gap-1 mt-1">
      {tags.map((tag, idx) => (
        <span 
          key={idx} 
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
        >
          {tag}
        </span>
      ))}
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Clients
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your vendor clients and communications
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
            >
              <Filter className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Filters
              {showFilters ? (
                <ChevronUp className="ml-2 -mr-1 h-5 w-5" />
              ) : (
                <ChevronDown className="ml-2 -mr-1 h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UserPlus className="-ml-1 mr-2 h-5 w-5" />
              Add Client
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10"
                  placeholder="Search clients by name, email, or phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <XCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status-filter"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    id="location-filter"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="All">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="tag-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Tag
                  </label>
                  <select
                    id="tag-filter"
                    name="tag"
                    value={filters.tag}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="All">All Tags</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Food Truck">Food Truck</option>
                    <option value="High Value">High Value</option>
                    <option value="Regular">Regular</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Reset filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clients List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Order
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.location}</div>
                            <Tags tags={client.tags} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.contact}</div>
                        <div className="text-sm text-gray-500">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={client.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {client.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${client.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(client.lastOrder).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openMessageModal(client)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Message"
                          >
                            <ChatAlt className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => openQuoteModal(client)}
                            className="text-green-600 hover:text-green-900"
                            title="Send Quote"
                          >
                            <DocumentText className="h-5 w-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <DotsVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No clients found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-b-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredClients.length}</span> of{' '}
                <span className="font-medium">{filteredClients.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronUp className="h-5 w-5" aria-hidden="true" />
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        client={selectedClient}
        messages={messages}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onSendMessage={sendMessage}
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        client={selectedClient}
        quoteDetails={quoteDetails}
        onQuoteChange={handleQuoteChange}
        onQuoteItemChange={updateQuoteItem}
        onAddQuoteItem={addQuoteItem}
        onRemoveQuoteItem={removeQuoteItem}
        onSendQuote={sendQuote}
      />
    </div>
  );
};

export default Clients;

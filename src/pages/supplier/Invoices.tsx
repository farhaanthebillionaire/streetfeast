import { useState } from 'react';
import { SearchIcon, TrashIcon, PlusIcon } from 'lucide-react';

// Type definitions
interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  vendor: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceItem[];
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
  {
    id: 'INV-2023-001',
    vendor: 'Tasty Bites',
    date: '2023-07-25',
    dueDate: '2023-08-24',
    amount: 2450.75,
    status: 'Paid',
    items: [
      { name: 'Chicken Breast (10kg)', quantity: 5, price: 25.99, total: 129.95 },
      { name: 'Beef Mince (5kg)', quantity: 10, price: 35.50, total: 355.00 },
      { name: 'Vegetable Oil (5L)', quantity: 8, price: 12.75, total: 102.00 }
    ]
  },
  // Add more mock invoices as needed
];

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<Omit<Invoice, 'id'>>({
    vendor: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Pending',
    amount: 0,
    items: [{ name: '', quantity: 1, price: 0, total: 0 }]
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0, total: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (newInvoice.items.length <= 1) return;
    
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...newInvoice.items];
    const parsedValue = typeof value === 'string' && field !== 'name' ? parseFloat(value) || 0 : value;
    
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: parsedValue
    };

    if (field === 'quantity' || field === 'price') {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
    }

    setNewInvoice(prev => ({
      ...prev,
      items: updatedItems,
      amount: updatedItems.reduce((sum, item) => sum + (item.total || 0), 0)
    }));
  };

  const handleCreateInvoice = () => {
    const newId = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`;
    const invoiceToAdd = {
      ...newInvoice,
      id: newId,
      status: 'Pending' as const,
      amount: newInvoice.items.reduce((sum, item) => sum + (item.total || 0), 0)
    };

    setInvoices([...invoices, invoiceToAdd]);
    setIsCreateModalOpen(false);
    
    // Reset form
    setNewInvoice({
      vendor: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending',
      amount: 0,
      items: [{ name: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {status}
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            {status}
          </span>
        );
      case 'Overdue':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            {status}
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Invoices</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all invoices sent to your vendors.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Create invoice
          </button>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="relative rounded-md shadow-sm flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoices table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Invoice
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Vendor
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Due Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-indigo-600 sm:pl-6">
                          {invoice.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {invoice.vendor}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                            View
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            Download
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Create New Invoice
                  </h3>
                  <div className="mt-5">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
                          Vendor
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="vendor"
                            id="vendor"
                            value={newInvoice.vendor}
                            onChange={(e) => setNewInvoice({...newInvoice, vendor: e.target.value})}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                          Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="date"
                            id="date"
                            value={newInvoice.date}
                            onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                          Due Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="dueDate"
                            id="dueDate"
                            value={newInvoice.dueDate}
                            onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900">Items</h4>
                      <div className="mt-2 overflow-hidden border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item
                              </th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Qty
                              </th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                              <th scope="col" className="relative px-3 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {newInvoice.items.map((item, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Item name"
                                    required
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    className="block w-20 ml-auto text-right border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    required
                                  />
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap">
                                  <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={item.price}
                                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                                      placeholder="0.00"
                                      required
                                    />
                                  </div>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                  ${(item.quantity * item.price).toFixed(2)}
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                  {newInvoice.items.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveItem(index)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={5} className="px-3 py-2 text-right">
                                <button
                                  type="button"
                                  onClick={handleAddItem}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" />
                                  Add Item
                                </button>
                              </td>
                            </tr>
                            <tr className="border-t border-gray-200">
                              <td colSpan={3} className="px-3 py-2 text-right font-medium">
                                Subtotal:
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-right font-medium">
                                ${newInvoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCreateInvoice}
                  disabled={!newInvoice.vendor || newInvoice.items.some(item => !item.name || item.quantity <= 0 || item.price < 0)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    // Reset form
                    setNewInvoice({
                      vendor: '',
                      date: new Date().toISOString().split('T')[0],
                      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      status: 'Pending',
                      amount: 0,
                      items: [
                        { name: '', quantity: 1, price: 0, total: 0 }
                      ]
                    });
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
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

export default Invoices;

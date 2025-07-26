import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus } from 'lucide-react';
import type { Client, Message, QuoteItem } from '../Clients';

// Types for the modals' props
type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  messages: Message[];
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
};

type QuoteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  quoteDetails: {
    subject: string;
    items: QuoteItem[];
    notes: string;
    validUntil: string;
  };
  onQuoteChange: (field: string, value: any) => void;
  onQuoteItemChange: (index: number, field: string, value: any) => void;
  onAddQuoteItem: () => void;
  onRemoveQuoteItem: (index: number) => void;
  onSendQuote: () => void;
};

// Message Modal Component
export const MessageModal = ({
  isOpen,
  onClose,
  client,
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
}: MessageModalProps) => {
  if (!client) return null;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                          Message {client.name}
                        </Dialog.Title >
                        <p className="text-sm text-gray-500">
                          {client.contact} • {client.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <div className="space-y-4 h-96 overflow-y-auto pr-2">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'supplier' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === 'supplier'
                                  ? 'bg-indigo-100 text-gray-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(message.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => onMessageChange(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                          className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Type your message..."
                        />
                        <button
                          type="button"
                          onClick={onSendMessage}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

// Quote Modal Component
export const QuoteModal = ({
  isOpen,
  onClose,
  client,
  quoteDetails,
  onQuoteChange,
  onQuoteItemChange,
  onAddQuoteItem,
  onRemoveQuoteItem,
  onSendQuote,
}: QuoteModalProps) => {
  if (!client) return null;

  const calculateSubtotal = () => {
    return quoteDetails.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const calculateTax = () => {
    // Assuming 10% tax rate for example
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                          Send Quote to {client.name}
                        </Dialog.Title>
                        <p className="text-sm text-gray-500">
                          {client.contact} • {client.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={onClose}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="mt-6">
                      <div className="mb-4">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          value={quoteDetails.subject}
                          onChange={(e) => onQuoteChange('subject', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700">Items</h4>
                          <button
                            type="button"
                            onClick={onAddQuoteItem}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <Plus className="-ml-1 mr-1 h-4 w-4" />
                            Add Item
                          </button>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Item
                                </th>
                                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Qty
                                </th>
                                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Total
                                </th>
                                <th scope="col" className="relative px-3 py-2">
                                  <span className="sr-only">Actions</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {quoteDetails.items.map((item, index) => (
                                <tr key={index}>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <input
                                      type="text"
                                      value={item.name}
                                      onChange={(e) => onQuoteItemChange(index, 'name', e.target.value)}
                                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                      placeholder="Item name"
                                      required
                                    />
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <input
                                      type="number"
                                      min="1"
                                      value={item.quantity || ''}
                                      onChange={(e) => onQuoteItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-right"
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
                                        value={item.price || ''}
                                        onChange={(e) => onQuoteItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md text-right"
                                        placeholder="0.00"
                                        required
                                      />
                                    </div>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                    ${(item.quantity * item.price).toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                    {quoteDetails.items.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => onRemoveQuoteItem(index)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                          <span>Subtotal</span>
                          <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mb-2">
                          <span>Tax (10%)</span>
                          <span>${calculateTax().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                          <span>Total</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          rows={3}
                          value={quoteDetails.notes}
                          onChange={(e) => onQuoteChange('notes', e.target.value)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Additional notes for the client..."
                        />
                      </div>

                      <div className="mt-4">
                        <label htmlFor="valid-until" className="block text-sm font-medium text-gray-700 mb-1">
                          Valid Until
                        </label>
                        <input
                          type="date"
                          id="valid-until"
                          value={quoteDetails.validUntil}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => onQuoteChange('validUntil', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={onSendQuote}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Send Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

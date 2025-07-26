import { useState, useEffect } from 'react';
import { Star, Reply } from 'lucide-react';

// Aliases for backward compatibility
const StarIconSolid = Star;
const ReplyIcon = Reply;

// Types
type Review = {
  id: number;
  customer: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  orderItems: string[];
  hasReply: boolean;
  reply?: string;
  replyDate?: string;
};

type ReviewTab = 'all' | 'withReply' | 'withoutReply';
type SortOrder = 'newest' | 'oldest';

// Mock data
const mockReviews: Review[] = [
  {
    id: 1,
    customer: 'John Doe',
    rating: 5,
    date: '2023-07-25T14:30:00',
    title: 'Excellent Food!',
    comment: 'Amazing food! The burger was cooked to perfection and the fries were crispy. Will definitely order again!',
    orderItems: ['Classic Burger', 'French Fries'],
    hasReply: true,
    reply: 'Thank you for your kind words, John! We\'re so glad you enjoyed your meal. We look forward to serving you again soon!',
    replyDate: '2023-07-25T15:45:00'
  },
  {
    id: 2,
    customer: 'Jane Smith',
    rating: 4,
    date: '2023-07-24T19:15:00',
    title: 'Great but late delivery',
    comment: 'Great food but the delivery took longer than expected. The pizza was still hot and delicious though!',
    orderItems: ['Veggie Pizza', 'Garlic Bread'],
    hasReply: false
  },
  {
    id: 3,
    customer: 'Mike Johnson',
    rating: 3,
    date: '2023-07-22T12:45:00',
    title: 'Good but small portions',
    comment: 'The tacos were good but the portion size was a bit small for the price. The guacamole was excellent though!',
    orderItems: ['Chicken Tacos', 'Guacamole'],
    hasReply: true,
    reply: 'Thank you for your feedback, Mike. We appreciate your comments and will take them into consideration.',
    replyDate: '2023-07-22T13:30:00'
  },
  {
    id: 4,
    customer: 'Sarah Williams',
    rating: 5,
    date: '2023-07-20T18:30:00',
    title: 'Perfect Salad',
    comment: 'Absolutely loved the Caesar salad! Fresh ingredients and the dressing was perfect. Will be a regular customer for sure!',
    orderItems: ['Caesar Salad', 'Iced Tea'],
    hasReply: true,
    reply: 'Thank you, Sarah! We take pride in using only the freshest ingredients. Looking forward to your next visit!',
    replyDate: '2023-07-20T20:15:00'
  },
  {
    id: 5,
    customer: 'David Kim',
    rating: 2,
    date: '2023-07-18T20:15:00',
    title: 'Disappointed',
    comment: 'The food was cold when it arrived and the order was missing items. Not happy with the service.',
    orderItems: ['Fish & Chips', 'Coleslaw'],
    hasReply: true,
    reply: 'We sincerely apologize for the inconvenience, David. This is not the level of service we aim to provide. Please contact our customer service for a full refund.',
    replyDate: '2023-07-18T21:30:00'
  },
];

const Reviews = () => {
  // State management
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReviewTab>('all');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load reviews (simulating API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      setReviews(mockReviews);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      // Filter by tab
      if (activeTab === 'withReply' && !review.hasReply) return false;
      if (activeTab === 'withoutReply' && review.hasReply) return false;
      
      // Filter by rating
      if (ratingFilter && review.rating !== ratingFilter) return false;
      
      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          review.customer.toLowerCase().includes(searchLower) ||
          review.comment.toLowerCase().includes(searchLower) ||
          (review.title?.toLowerCase().includes(searchLower) ?? false) ||
          review.orderItems.some(item => item.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setRatingFilter(null);
    setActiveTab('all');
  };
  

  // Format date helper with time ago
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Just now';
      
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      
      // For older dates, return formatted date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Just now';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        {/* ... */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Reviews List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || ratingFilter || activeTab !== 'all' 
                ? 'Try changing your filters or search query.'
                : 'You have no customer reviews yet.'}
            </p>
            {(searchQuery || ratingFilter || activeTab !== 'all') && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          filteredReviews.map((review: Review) => (
            <div key={review.id} className="p-6 border-b border-gray-200 last:border-b-0">
              <div className="w-full">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{review.customer}</h3>
                      <span className="ml-2 text-sm text-gray-500">
                        {formatDate(review.date)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <StarIconSolid
                          key={rating}
                          className={`h-5 w-5 ${
                            rating <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    {review.title && (
                      <h4 className="mt-2 text-md font-medium text-gray-900">{review.title}</h4>
                    )}
                    <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                    {review.orderItems && review.orderItems.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Ordered items:</p>
                        <ul className="mt-1 text-xs text-gray-700">
                          {review.orderItems.map((item, index) => (
                            <li key={index} className="inline">
                              {item}
                              {index < review.orderItems.length - 1 ? ', ' : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {!review.hasReply && (
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      <ReplyIcon className="h-4 w-4 mr-1" />
                      {isSubmitting && replyingTo === review.id ? 'Replying...' : 'Reply'}
                    </button>
                  )}
                </div>
              </div>

              {review.hasReply && (
                <div className="mt-4 ml-8 pl-4 border-l-4 border-indigo-200 bg-indigo-50 p-4 rounded-r-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-indigo-800">Your Reply</h4>
                      <p className="mt-1 text-sm text-indigo-700">{review.reply}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setReplyingTo(review.id);
                          setReplyText(review.reply || '');
                        }}
                        className="text-indigo-600 hover:text-indigo-900 text-xs font-medium"
                        disabled={isSubmitting}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-indigo-600">
                    Replied on {formatDate(review.replyDate!)}
                  </p>
                </div>
              )}

              {replyingTo === review.id && (
                <div className="mt-4 ml-8 pl-4 border-l-4 border-gray-200">
                  <label htmlFor={`reply-${review.id}`} className="block text-sm font-medium text-gray-700">
                    {review.hasReply ? 'Edit your reply' : 'Your Reply'}
                  </label>
                  <div className="mt-1">
                    <textarea
                      id={`reply-${review.id}`}
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText('');
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!replyText.trim() || isSubmitting) return;
                        
                        try {
                          setIsSubmitting(true);
                          // Simulate API call
                          await new Promise(resolve => setTimeout(resolve, 800));
                          
                          // Update local state
                          setReviews(prevReviews => 
                            prevReviews.map(rev => 
                              rev.id === review.id
                                ? { 
                                    ...rev, 
                                    hasReply: true, 
                                    reply: replyText, 
                                    replyDate: new Date().toISOString() 
                                  }
                                : rev
                            )
                          );
                          
                          // Reset form
                          setReplyingTo(null);
                          setReplyText('');
                        } catch (error) {
                          console.error('Failed to submit reply:', error);
                          // In a real app, show error toast/notification
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      disabled={!replyText.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Submit'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Summary */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Review Summary</h3>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">4.2</dd>
              <dd className="mt-1 flex items-center justify-center">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <StarIconSolid
                      key={rating}
                      className={`h-6 w-6 ${
                        rating <= 4 ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </dd>
            </div>

            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Reviews</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {reviews.length}
              </dd>
            </div>

            <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">Response Rate</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {Math.round((reviews.filter(r => r.hasReply).length / reviews.length) * 100) || 0}%
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Review Response Rate */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Response Rate</h3>
            <span className="text-sm text-gray-500">Last 30 days</span>
          </div>
        </div>
        <div className="px-6 py-5">
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Response rate chart would be displayed here</p>
          </div>
        </div>
      </div>

      {/* Review Guidelines */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Review Guidelines</h3>
        </div>
        <div className="px-6 py-5">
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Here are some guidelines for responding to customer reviews:
            </p>
            <ul className="mt-2 text-gray-600 list-disc pl-5 space-y-1">
              <li>Respond promptly to all reviews, especially negative ones</li>
              <li>Thank customers for positive reviews</li>
              <li>Address concerns raised in negative reviews professionally</li>
              <li>Take conversations offline when appropriate</li>
              <li>Be genuine and personable in your responses</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;

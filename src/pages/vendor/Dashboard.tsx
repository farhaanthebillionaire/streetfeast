import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp as ArrowUpIcon,
  ArrowDown as ArrowDownIcon,
  Clock as ClockIcon,
  CheckCircle2 as CheckCircleIcon,
  DollarSign as CurrencyDollarIcon,
  ShoppingBag as ShoppingBagIcon,
  Users as UsersIcon,
  Star as StarIcon,
  Sun as SunIcon,
  Zap as BoltIcon,
  Trophy as TrophyIcon,
  Gift as GiftIcon,
  Clock as ClockIconSolid
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Recent orders data
const recentOrders = [
  { id: '#1234', customer: 'John Doe', items: 3, total: 45.99, status: 'Preparing', time: '10 min ago' },
  { id: '#1235', customer: 'Jane Smith', items: 2, total: 32.50, status: 'Ready', time: '5 min ago' },
  { id: '#1236', customer: 'Robert Johnson', items: 5, total: 78.25, status: 'Preparing', time: '15 min ago' },
  { id: '#1237', customer: 'Emily Davis', items: 1, total: 12.99, status: 'Ready', time: '2 min ago' },
  { id: '#1238', customer: 'Michael Wilson', items: 4, total: 56.75, status: 'Preparing', time: '8 min ago' },
];

// Sales data for the chart
const salesData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales ($)',
      data: [1200, 1900, 1500, 2200, 2500, 2800],
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.3,
      fill: true,
    },
  ],
};

// Chart options
const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `$${context.parsed.y}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      border: {
        display: false,
      },
      grid: {
        display: true,
      },
      ticks: {
        callback: function(value) {
          return `$${value}`;
        }
      }
    },
    x: {
      grid: {
        display: false,
      }
    }
  }
};

// Top selling items
const topSellingItems = [
  { name: 'Classic Burger', sales: 124, revenue: '$1,116' },
  { name: 'Veggie Pizza', sales: 98, revenue: '$1,273' },
  { name: 'Chicken Tacos', sales: 85, revenue: '$892.50' },
  { name: 'Caesar Salad', sales: 72, revenue: '$575.28' },
  { name: 'French Fries', sales: 156, revenue: '$622.44' },
];

// Loyalty program summary
const loyaltySummary = {
  totalPoints: 12450,
  activeMembers: 143,
  pointsRedeemed: 3250,
  nextTier: {
    name: 'Gold',
    pointsNeeded: 5550,
    benefits: ['10% off all orders', 'Free delivery', 'Priority support']
  }
};

// Forecast data
const forecastData = {
  today: {
    expectedOrders: 42,
    expectedRevenue: 1250,
    peakHours: ['12:00 PM - 2:00 PM', '7:00 PM - 9:00 PM'],
    recommendedPrep: ['Double burger buns', 'Extra chicken patties']
  },
  weekTrend: [
    { day: 'Mon', orders: 35 },
    { day: 'Tue', orders: 42 },
    { day: 'Wed', orders: 38 },
    { day: 'Thu', orders: 40 },
    { day: 'Fri', orders: 52 },
    { day: 'Sat', orders: 65 },
    { day: 'Sun', orders: 58 },
  ]
};

const VendorDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState({
    open: '10:00',
    close: '22:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  });

  const toggleBusinessStatus = async () => {
    setIsLoading(true);
    try {
      // Here you would typically make an API call to update the business status
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setIsOpen(!isOpen);
    } catch (error) {
      console.error('Error updating business status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const [hours, minutes] = businessHours.close.split(':').map(Number);
    const closingTime = new Date(now);
    closingTime.setHours(hours, minutes, 0, 0);
    
    if (now > closingTime) return 'Closed for today';
    
    const diff = closingTime.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff / (1000 * 60)) % 60);
    
    return `Closes in ${hoursLeft}h ${minutesLeft}m`;
  };
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [businessHours]);

  return (
    <div className="space-y-6">
      {/* Header with status toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-700">
                {isOpen ? 'Open Now' : 'Closed'}
              </span>
              {isOpen && (
                <span className="text-xs text-green-600">
                  {timeLeft}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={toggleBusinessStatus}
              disabled={isLoading}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isOpen ? 'bg-green-600' : 'bg-gray-300'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              role="switch"
              aria-checked={isOpen}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOpen ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <ClockIconSolid className="h-4 w-4 mr-1" />
            {businessHours.open} - {businessHours.close}
          </div>
        </div>
      </div>

      {/* Today's Forecast Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Today's Forecast</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <BoltIcon className="h-3 w-3 mr-1" />
              Live Updates
            </span>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Expected Orders */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md">
                  <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expected Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{forecastData.today.expectedOrders}</p>
                  <p className="text-xs text-gray-500 mt-1">Based on historical data</p>
                </div>
              </div>
            </div>

            {/* Expected Revenue */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-md">
                  <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expected Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">${forecastData.today.expectedRevenue}</p>
                  <p className="text-xs text-gray-500 mt-1">Projected today's earnings</p>
                </div>
              </div>
            </div>

            {/* Peak Hours */}
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-amber-100 p-2 rounded-md mt-1">
                  <ClockIcon className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Peak Hours</p>
                  <div className="mt-1">
                    {forecastData.today.peakHours.map((time, index) => (
                      <p key={index} className="text-sm font-medium text-gray-900">{time}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Prep */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-md mt-1">
                  <TrophyIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Recommended Prep</p>
                  <ul className="mt-1 space-y-1">
                    {forecastData.today.recommendedPrep.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Weekly Order Trend</h3>
            <div className="h-48">
              <Line data={{
                labels: forecastData.weekTrend.map(day => day.day),
                datasets: [{
                  label: 'Orders',
                  data: forecastData.weekTrend.map(day => day.orders),
                  borderColor: 'rgb(99, 102, 241)',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  tension: 0.3,
                  fill: true,
                }]
              }} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { display: true } },
                  x: { grid: { display: false } }
                }
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Program Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Loyalty Program</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <GiftIcon className="h-3 w-3 mr-1" />
              Active
            </span>
          </div>

          <div className="mt-6">
            {/* Points Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Loyalty Points</p>
                  <p className="text-3xl font-bold text-gray-900">{loyaltySummary.totalPoints.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900">{loyaltySummary.activeMembers}</p>
                </div>
              </div>

              {/* Progress to next tier */}
              <div className="mt-6">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                  <span>Next: {loyaltySummary.nextTier.name} Tier</span>
                  <span>{loyaltySummary.nextTier.pointsNeeded - loyaltySummary.totalPoints} points to go</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (loyaltySummary.totalPoints / loyaltySummary.nextTier.pointsNeeded) * 100)}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {((loyaltySummary.totalPoints / loyaltySummary.nextTier.pointsNeeded) * 100).toFixed(1)}% of the way to {loyaltySummary.nextTier.name}
                </div>
              </div>

              {/* Next Tier Benefits */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Unlock {loyaltySummary.nextTier.name} benefits:</h4>
                <ul className="space-y-2">
                  {loyaltySummary.nextTier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Points Redeemed</p>
                    <p className="text-xl font-bold text-purple-600">{loyaltySummary.pointsRedeemed.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">Avg. Points/Customer</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {Math.round(loyaltySummary.totalPoints / loyaltySummary.activeMembers)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View Member List
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Promo
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Program Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Business Status */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                {isOpen ? (
                  <BoltIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                ) : (
                  <SunIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                )}
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Business Status</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isOpen ? 'Open' : 'Closed'}
                    </div>
                  </dd>
                  <dt className="text-xs text-gray-500 mt-1">
                    {isOpen ? 'Accepting orders' : 'Not accepting orders'}
                  </dt>
                </dl>
              </div>
            </div>
          </div>
        </div>
        {/* Today's Orders */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <ShoppingBagIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Orders</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">24</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                      <span className="sr-only">Increased by</span>
                      12%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">$1,234.56</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                      <span className="sr-only">Increased by</span>
                      8.2%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Customers</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">143</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center text-green-500" aria-hidden="true" />
                      <span className="sr-only">Increased by</span>
                      5.1%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <StarIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">4.8</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center text-red-500" aria-hidden="true" />
                      <span className="sr-only">Decreased by</span>
                      0.2
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Sales Overview</h2>
            <div className="flex space-x-2">
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 rounded-md"
              >
                Week
              </button>
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 rounded-md"
              >
                Month
              </button>
              <button
                type="button"
                className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 rounded-md"
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-64">
            <Line 
              data={salesData}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Loyalty Program */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Loyalty Program</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span>Your Points</span>
                <span>{loyaltySummary.totalPoints.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full" 
                  style={{ width: `${(loyaltySummary.pointsRedeemed / (loyaltySummary.totalPoints + loyaltySummary.pointsRedeemed)) * 100}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {loyaltySummary.nextTier.pointsNeeded.toLocaleString()} points to reach {loyaltySummary.nextTier.name} tier
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Next Tier Benefits</h3>
              <ul className="space-y-2">
                {loyaltySummary.nextTier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            <Link
              to="/vendor/menu"
              className="px-4 py-5 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-medium text-gray-900">Add Menu Item</h3>
              <p className="mt-1 text-sm text-gray-500">Add a new item to your menu</p>
            </Link>

            <Link
              to="/vendor/orders"
              className="px-4 py-5 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-medium text-gray-900">View Orders</h3>
              <p className="mt-1 text-sm text-gray-500">Check and manage orders</p>
            </Link>

            <Link
              to="/vendor/inventory"
              className="px-4 py-5 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-medium text-gray-900">Inventory</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your stock levels</p>
            </Link>

            <Link
              to="/vendor/promotions"
              className="px-4 py-5 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-medium text-gray-900">Promotions</h3>
              <p className="mt-1 text-sm text-gray-500">Create special offers</p>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Top Selling Items</h2>
            <Link to="/vendor/menu" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {topSellingItems.map((item, index) => (
                <li key={index} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.sales} sold</p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900">
                      {item.revenue}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
            <Link to="/vendor/reviews" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {[1, 2, 3].map((review) => (
                <li key={review} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={`https://i.pravatar.cc/150?img=${review + 10}`}
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {review === 1 ? 'John D.' : review === 2 ? 'Sarah M.' : 'Alex J.'}
                      </p>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-4 w-4 ${star <= (review === 1 ? 5 : review === 2 ? 4 : 3) ? 'text-yellow-400' : 'text-gray-300'}`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {review === 1
                          ? 'Amazing food and great service! Will definitely order again.'
                          : review === 2
                          ? 'Good food, but delivery was a bit late.'
                          : 'Decent meal, but the portion was smaller than expected.'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {review === 1 ? '2h ago' : review === 2 ? '1d ago' : '3d ago'}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest customer orders that need your attention</p>
          </div>
          <Link to="/vendor/orders" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.items} {order.items === 1 ? 'item' : 'items'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'Ready' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-4">
                      {order.status === 'Preparing' && (
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Mark as Ready
                        </button>
                      )}
                      {order.status === 'Ready' && (
                        <button className="text-green-600 hover:text-green-900">
                          Mark as Completed
                        </button>
                      )}
                      <Link to={`/vendor/orders/${order.id}`} className="text-gray-600 hover:text-gray-900">
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Link to="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </Link>
            <Link to="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;

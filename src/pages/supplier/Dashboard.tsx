import { useState } from 'react';
import { 
  BarChart3,
  DollarSign,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  ChartBarIcon
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for charts
const weeklyOrdersData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Orders',
      data: [12, 19, 8, 15, 22, 18, 25],
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      tension: 0.3,
      fill: true
    }
  ]
};

const monthlyPaymentsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Payments ($)',
      data: [12500, 19000, 15000, 20000, 18000, 22000, 25000, 23000, 20000, 24000, 26000, 30000],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
    }
  ]
};

// Mock data for alerts
const alerts = [
  { 
    id: 1, 
    type: 'invoice', 
    message: '3 invoices pending payment', 
    date: '2023-07-25',
    priority: 'high',
    vendor: 'Tasty Bites',
    amount: 1250.00
  },
  { 
    id: 2, 
    type: 'inventory', 
    message: 'Low stock: Chicken Breast (20kg remaining)', 
    date: '2023-07-24',
    priority: 'medium',
    product: 'Chicken Breast',
    quantity: 20
  },
  { 
    id: 3, 
    type: 'payment', 
    message: 'Payment received from Spice Route', 
    date: '2023-07-23',
    priority: 'low',
    amount: 850.00,
    status: 'completed'
  }
];

// Stats cards data
const stats = [
  { 
    name: 'Total Orders', 
    value: '1,248', 
    change: '+12%', 
    changeType: 'increase',
    icon: BarChart3
  },
  { 
    name: 'Revenue', 
    value: '$28,450', 
    change: '+8.2%', 
    changeType: 'increase',
    icon: DollarSign
  },
  { 
    name: 'Active Clients', 
    value: '42', 
    change: '+3', 
    changeType: 'increase',
    icon: 'users'
  },
  { 
    name: 'Pending Invoices', 
    value: '7', 
    change: '2 overdue', 
    changeType: 'alert',
    icon: AlertTriangle
  }
];

const SupplierDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Weekly Orders',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Monthly Revenue ($)',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  const handleViewAlert = (alert: any) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening with your business.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, statIdx) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {typeof stat.icon === 'string' ? (
                      <div className="h-6 w-6 text-gray-400" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    ) : (
                      <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-2">
                  {stat.changeType === 'increase' && (
                    <p className="flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                      <span className="sr-only">Increased by</span>
                      {stat.change}
                    </p>
                  )}
                  {stat.changeType === 'decrease' && (
                    <p className="flex items-baseline text-sm font-semibold text-red-600">
                      <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                      <span className="sr-only">Decreased by</span>
                      {stat.change}
                    </p>
                  )}
                  {stat.changeType === 'alert' && (
                    <p className="text-sm font-medium text-yellow-600">{stat.change}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <Line options={lineOptions} data={weeklyOrdersData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <Bar options={barOptions} data={monthlyPaymentsData} />
          </div>
        </div>

        {/* Alerts Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Alerts & Notifications</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Recent activities and important notices</p>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-b-lg">
            <ul className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <li key={alert.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-1 rounded-full ${getPriorityColor(alert.priority)}`}>
                        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(alert.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        onClick={() => handleViewAlert(alert)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View all alerts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {isAlertModalOpen && selectedAlert && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedAlert.type === 'invoice' ? 'Pending Invoice' : 
                     selectedAlert.type === 'inventory' ? 'Low Stock Alert' : 'Payment Received'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedAlert.message}
                    </p>
                    {selectedAlert.vendor && (
                      <p className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Vendor:</span> {selectedAlert.vendor}
                      </p>
                    )}
                    {selectedAlert.amount && (
                      <p className="mt-1 text-sm text-gray-700">
                        <span className="font-medium">Amount:</span> ${selectedAlert.amount.toFixed(2)}
                      </p>
                    )}
                    {selectedAlert.product && (
                      <p className="mt-1 text-sm text-gray-700">
                        <span className="font-medium">Product:</span> {selectedAlert.product}
                      </p>
                    )}
                    {selectedAlert.quantity && (
                      <p className="mt-1 text-sm text-gray-700">
                        <span className="font-medium">Remaining:</span> {selectedAlert.quantity}kg
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(selectedAlert.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                {selectedAlert.type === 'invoice' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                    onClick={() => setIsAlertModalOpen(false)}
                  >
                    View Invoice
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setIsAlertModalOpen(false)}
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

export default SupplierDashboard;

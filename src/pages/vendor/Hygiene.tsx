import { useState, useEffect } from 'react';
import { 
  CheckCircle2 as CheckCircleIcon,
  XCircle as XCircleIcon,
  Camera as CameraIcon,
  FileText as DocumentIcon,
  Clock as ClockIcon,
  AlertTriangle as ExclamationTriangleIcon,
  RefreshCw as ArrowPathIcon,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';

const hygieneChecklist = [
  {
    id: 1,
    title: 'Food Handling Certification',
    description: 'Current food handler certification for all staff',
    status: 'valid',
    expiryDate: '2024-12-31',
    required: true
  },
  {
    id: 2,
    title: 'Temperature Logs',
    description: 'Daily temperature logs for all refrigeration units',
    status: 'warning',
    expiryDate: '2023-06-15',
    required: true,
    notes: 'Missing logs for June 10-12'
  },
  {
    id: 3,
    title: 'Pest Control Report',
    description: 'Monthly pest control inspection report',
    status: 'expired',
    expiryDate: '2023-04-30',
    required: true
  },
  {
    id: 4,
    title: 'Allergen Training',
    description: 'Staff training on allergen handling',
    status: 'valid',
    expiryDate: '2024-03-01',
    required: false
  },
  {
    id: 5,
    title: 'Health Inspection Certificate',
    description: 'Most recent health inspection certificate',
    status: 'valid',
    expiryDate: '2024-01-15',
    required: true
  },
  {
    id: 6,
    title: 'Fire Safety Certificate',
    description: 'Annual fire safety inspection',
    status: 'warning',
    expiryDate: '2023-07-01',
    required: true,
    notes: 'Scheduled for June 25'
  }
];

const inspectionHistory = [
  {
    id: 1,
    date: '2023-05-10',
    type: 'Routine',
    status: 'Passed',
    score: '98/100',
    inspector: 'John Smith',
    notes: 'Excellent food handling practices observed.'
  },
  {
    id: 2,
    date: '2023-02-15',
    type: 'Follow-up',
    status: 'Passed',
    score: '92/100',
    inspector: 'Sarah Johnson',
    notes: 'Previous violations corrected. Minor improvement needed in storage organization.'
  },
  {
    id: 3,
    date: '2022-12-05',
    type: 'Complaint',
    status: 'Passed with Conditions',
    score: '85/100',
    inspector: 'Michael Brown',
    notes: 'Addressed customer complaint about food temperature. Additional thermometers installed.'
  }
];

// Types
type BadgeStatus = 'not_applied' | 'pending' | 'approved' | 'rejected' | 'expired';

interface BadgeApplication {
  id: string;
  status: BadgeStatus;
  appliedDate: string;
  expiryDate?: string;
  inspectorNotes?: string;
  documents: string[];
  score?: number;
  inspectionDate?: string;
}

const Hygiene = () => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [badgeStatus, setBadgeStatus] = useState<BadgeStatus>('not_applied');
  // Store badge application in state and local storage
  const [, setBadgeApplicationState] = useState<BadgeApplication | null>(() => {
    const saved = localStorage.getItem('badgeApplication');
    return saved ? JSON.parse(saved) : null;
  });
  
  const setBadgeApplication = (app: BadgeApplication | null) => {
    setBadgeApplicationState(app);
    if (app) {
      localStorage.setItem('badgeApplication', JSON.stringify(app));
    } else {
      localStorage.removeItem('badgeApplication');
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  
  // Load badge application status from localStorage on component mount
  useEffect(() => {
    const savedBadgeStatus = localStorage.getItem('badgeStatus') as BadgeStatus || 'not_applied';
    const savedApplication = localStorage.getItem('badgeApplication');
    
    setBadgeStatus(savedBadgeStatus);
    if (savedApplication) {
      setBadgeApplication(JSON.parse(savedApplication));
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'valid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Valid
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            Expiring Soon
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file && selectedItem) {
      // TODO: Upload file to server and update document status
      console.log('Uploading file:', {
        documentId: selectedItem.id,
        file,
        expiryDate,
        notes
      });
      
      // Reset form
      setFile(null);
      setNotes('');
      setExpiryDate('');
      setIsUploadModalOpen(false);
      setSelectedItem(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStartApplication = () => {
    setApplicationStep(1);
    setIsApplicationModalOpen(true);
  };

  const handleNextStep = () => {
    setApplicationStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setApplicationStep(prev => prev - 1);
  };

  const handleSubmitApplication = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newApplication: BadgeApplication = {
        id: `APP-${Date.now()}`,
        status: 'pending',
        appliedDate: new Date().toISOString(),
        documents: ['food_handling_cert.pdf', 'inspection_report.pdf'],
        score: 0,
      };
      
      setBadgeStatus('pending');
      setBadgeApplication(newApplication);
      localStorage.setItem('badgeStatus', 'pending');
      localStorage.setItem('badgeApplication', JSON.stringify(newApplication));
      setIsLoading(false);
      setIsApplicationModalOpen(false);
    }, 1500);
  };

  const renderBadgeStatus = () => {
    const statusConfig = {
      not_applied: {
        color: 'bg-gray-100 text-gray-800',
        icon: null,
        text: 'No Badge',
        action: (
          <button
            onClick={handleStartApplication}
            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Apply Now
          </button>
        )
      } as const,
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <ClockIcon className="h-4 w-4 mr-1" />,
        text: 'Application Pending',
        action: null
      } as const,
      approved: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircleIcon className="h-4 w-4 mr-1" />,
        text: 'Badge Active',
        action: null
      } as const,
      rejected: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircleIcon className="h-4 w-4 mr-1" />,
        text: 'Application Rejected',
        action: (
          <button
            onClick={handleStartApplication}
            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Re-apply
          </button>
        )
      } as const,
      expired: {
        color: 'bg-orange-100 text-orange-800',
        icon: <ExclamationTriangleIcon className="h-4 w-4 mr-1" />,
        text: 'Badge Expired',
        action: (
          <button
            onClick={handleStartApplication}
            className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Renew Now
          </button>
        )
      } as const
    };

    const config = statusConfig[badgeStatus] || statusConfig.not_applied;

    return (
      <div className="flex items-center">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
          {config.icon}
          {config.text}
        </span>
        {config.action}
      </div>
    );
  };

  const renderApplicationModal = () => {
    if (!isApplicationModalOpen) return null;

    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                <ShieldCheckIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {applicationStep === 1 && 'Eligibility Check'}
                  {applicationStep === 2 && 'Required Documents'}
                  {applicationStep === 3 && 'Review & Submit'}
                </h3>
                <div className="mt-4">
                  <div className="flex justify-between mb-6">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <div 
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            applicationStep >= step ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {step}
                        </div>
                        <span className="text-xs mt-1">
                          {step === 1 ? 'Eligibility' : step === 2 ? 'Documents' : 'Review'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {applicationStep === 1 && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        To qualify for the Hygiene Excellence Badge, your establishment must meet the following requirements:
                      </p>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                        <li>All required food safety certifications must be current</li>
                        <li>No critical violations in the last 6 months</li>
                        <li>Minimum 90% compliance score on last inspection</li>
                        <li>All staff must have food handler certifications</li>
                      </ul>
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                          Based on our records, your establishment meets the basic requirements to apply for the Hygiene Excellence Badge.
                        </p>
                      </div>
                    </div>
                  )}

                  {applicationStep === 2 && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Please upload the following required documents. All documents must be in PDF or image format.
                      </p>
                      <div className="space-y-3">
                        {[
                          'Food Safety Management Plan',
                          'Most Recent Inspection Report',
                          'Pest Control Certificates',
                          'Employee Training Records'
                        ].map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                            <div className="flex items-center">
                              <DocumentIcon className="h-5 w-5 text-gray-400 mr-2" />
                              <span className="text-sm font-medium">{doc}</span>
                            </div>
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Upload
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {applicationStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        Please review your application before submitting. You'll be notified via email once your application is processed.
                      </p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Application Summary</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex justify-between">
                            <span>Application Type:</span>
                            <span className="font-medium">New Application</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Documents Uploaded:</span>
                            <span className="font-medium">4/4</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Estimated Processing Time:</span>
                            <span className="font-medium">3-5 business days</span>
                          </li>
                        </ul>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="terms" className="font-medium text-gray-700">
                            I certify that all information provided is accurate and complete.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              {applicationStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-1 sm:text-sm"
                >
                  Back
                </button>
              )}
              {applicationStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-2 sm:text-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  disabled={isLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-2 sm:text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setIsApplicationModalOpen(false)}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the application modal
  const ApplicationModal = renderApplicationModal;
  
  return (
    <div className="space-y-6">
      <ApplicationModal />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hygiene & Compliance</h1>
          <div className="mt-2">
            {renderBadgeStatus()}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleStartApplication}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {badgeStatus === 'not_applied' ? 'Apply for Badge' : badgeStatus === 'pending' ? 'View Application' : 'Manage Badge'}
          </button>
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'checklist' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Compliance Checklist
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'history' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Inspection History
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'checklist' ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Compliance Documents</h3>
            <p className="mt-1 text-sm text-gray-500">
              Manage your food safety and compliance documents. Ensure all required documents are up to date.
            </p>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-b-lg">
            <ul className="divide-y divide-gray-200">
              {hygieneChecklist.map((item) => (
                <li key={item.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <DocumentIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                          <span className="ml-2">{getStatusBadge(item.status)}</span>
                        </div>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        {item.notes && (
                          <p className="text-xs text-yellow-600 mt-1">
                            <ExclamationTriangleIcon className="h-3 w-3 inline mr-1" />
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm text-gray-500">
                        {item.status === 'expired' ? 'Expired' : 'Expires'} {formatDate(item.expiryDate)}
                      </div>
                      {item.status === 'expired' ? (
                        <span className="text-xs text-red-600 mt-1">
                          {Math.abs(getDaysUntilExpiry(item.expiryDate))} days overdue
                        </span>
                      ) : item.status === 'warning' ? (
                        <span className="text-xs text-yellow-600 mt-1">
                          {getDaysUntilExpiry(item.expiryDate)} days remaining
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 mt-1">
                          Valid for {getDaysUntilExpiry(item.expiryDate)} more days
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsUploadModalOpen(true);
                        }}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <CameraIcon className="h-3 w-3 mr-1" />
                        {item.status === 'expired' ? 'Update' : 'Renew/Update'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Inspection History</h3>
            <p className="mt-1 text-sm text-gray-500">
              A record of all health and safety inspections conducted at your location.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inspector
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspectionHistory.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(inspection.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inspection.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        inspection.status === 'Passed' 
                          ? 'bg-green-100 text-green-800' 
                          : inspection.status === 'Passed with Conditions' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {inspection.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {inspection.inspector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedItem(inspection);
                          // Open inspection details modal
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && selectedItem && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <DocumentIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {selectedItem.status === 'expired' ? 'Update' : 'Renew'} {selectedItem.title}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Upload the latest document for {selectedItem.title}. Make sure all information is clearly visible.
                    </p>
                    {selectedItem.status === 'expired' && (
                      <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <XCircleIcon className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              This document expired on {formatDate(selectedItem.expiryDate)}. Please upload an updated version.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="mt-4">
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <div className="flex text-sm text-gray-600">
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
                                onChange={handleFileChange}
                                accept="application/pdf,image/*"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, JPG, PNG up to 10MB
                          </p>
                          {file && (
                            <p className="text-sm text-gray-900 mt-2">
                              Selected: {file.name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiry-date"
                        id="expiry-date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                        Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Any additional information about this document..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                  onClick={handleUpload}
                  disabled={!file || !expiryDate}
                >
                  Upload Document
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedItem(null);
                    setFile(null);
                    setExpiryDate('');
                    setNotes('');
                  }}
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

export default Hygiene;

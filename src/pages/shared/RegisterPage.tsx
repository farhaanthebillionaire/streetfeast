import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import type { UserRole } from '../../contexts/auth/AuthContext';

// Role-specific form data types
interface BaseFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  termsAccepted: boolean;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface CustomerFormData extends BaseFormData {
  role: 'customer';
  preferences?: string[];
}

interface VendorFormData extends BaseFormData {
  role: 'vendor';
  businessName: string;
  businessType: string;
  cuisineTypes: string[];
}

interface SupplierFormData extends BaseFormData {
  role: 'supplier';
  companyName: string;
  businessType: string;
  productsOffered: string[];
}

type FormData = CustomerFormData | VendorFormData | SupplierFormData;

// Available cuisine types for vendors
const CUISINE_TYPES = [
  'Italian', 'Mexican', 'Chinese', 'Indian', 'Japanese',
  'American', 'Mediterranean', 'Thai', 'Vietnamese', 'Other'
];

// Available product types for suppliers
const PRODUCT_TYPES = [
  'Produce', 'Meat & Poultry', 'Seafood', 'Dairy', 'Bakery',
  'Beverages', 'Snacks', 'Frozen Foods', 'Organic', 'Other'
];

// Business types for vendors and suppliers
const BUSINESS_TYPES = [
  'Restaurant', 'Food Truck', 'Catering', 'Cafe', 'Bakery',
  'Grocery', 'Butcher', 'Seafood Market', 'Farm', 'Other'
];

// US states for address
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const RegisterPage = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    termsAccepted: false,
    // Vendor/Supplier specific
    businessName: '',
    businessType: '',
    cuisineTypes: [],
    productsOffered: [],
    address: '',
    city: '',
    state: '',
    zipCode: '',
  } as FormData);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox' && 'checked' in e.target) {
      const checked = (e.target as HTMLInputElement).checked;
      
      if (name === 'termsAccepted') {
        setFormData(prev => ({
          ...prev,
          termsAccepted: checked
        } as FormData));
      } else if (name === 'cuisineTypes' || name === 'productsOffered') {
        const currentValues = [...((formData as any)[name] || [])] as string[];
        const updatedValues = checked
          ? [...currentValues, value]
          : currentValues.filter(item => item !== value);
          
        setFormData(prev => ({
          ...prev,
          [name]: updatedValues
        } as FormData));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      } as FormData));
    }
  };

  const validateStep = (step: number): boolean => {
    // Basic validation for step 1 (account info)
    if (step === 1) {
      if (!formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError('All fields are required');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
      
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }
      
      return true;
    }
    
    // Role-specific validation for step 2
    if (step === 2) {
      if (!formData.firstName || !formData.lastName) {
        setError('First name and last name are required');
        return false;
      }
      
      if (formData.role === 'vendor') {
        const vendorData = formData as VendorFormData;
        if (!vendorData.businessName || !vendorData.businessType || vendorData.cuisineTypes.length === 0) {
          setError('Please fill in all required business information');
          return false;
        }
      } else if (formData.role === 'supplier') {
        const supplierData = formData as SupplierFormData;
        if (!supplierData.companyName || !supplierData.businessType || supplierData.productsOffered.length === 0) {
          setError('Please fill in all required business information');
          return false;
        }
      }
      
      return true;
    }
    
    // Address validation for step 3
    if (step === 3) {
      const addressFields = ['address', 'city', 'state', 'zipCode'] as const;
      for (const field of addressFields) {
        if (!formData[field]) {
          setError('Please fill in all address fields');
          return false;
        }
      }
      return true;
    }
    
    return true;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError('');
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.termsAccepted) {
      setError('You must accept the terms and conditions');
      return;
    }
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    if (currentStep < 3) {
      nextStep();
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare additional data based on role
      const additionalData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        ...(formData.address && { address: formData.address }),
        ...(formData.city && { city: formData.city }),
        ...(formData.state && { state: formData.state }),
        ...(formData.zipCode && { zipCode: formData.zipCode }),
      };
      
      if (formData.role === 'vendor') {
        const vendorData = formData as VendorFormData;
        additionalData.businessName = vendorData.businessName;
        additionalData.businessType = vendorData.businessType;
        additionalData.cuisineTypes = vendorData.cuisineTypes;
      } else if (formData.role === 'supplier') {
        const supplierData = formData as SupplierFormData;
        additionalData.companyName = supplierData.companyName;
        additionalData.businessType = supplierData.businessType;
        additionalData.productsOffered = supplierData.productsOffered;
      }
      
      // Register the user with email, password, phone number, role, and additional data
      await signUp(
        formData.email, 
        formData.password, 
        formData.phone, 
        formData.role,
        additionalData,
      );
      
      // Redirect to dashboard after successful registration
      navigate(`/${formData.role}/dashboard`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Render step indicators
  const renderStepIndicators = () => (
    <div className="flex justify-between mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= step
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step}
          </div>
          <span className="mt-2 text-xs font-medium text-gray-600">
            {step === 1 ? 'Account' : step === 2 ? 'Profile' : 'Address'}
          </span>
        </div>
      ))}
    </div>
  );

  // Render step 1 - Account Information
  const renderStep1 = () => (
    <>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <div className="mt-1">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={formData.password}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Must be at least 6 characters
        </p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </>
  );

  // Render step 2 - Profile Information
  const renderStep2 = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <div className="mt-1">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <div className="mt-1">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {formData.role === 'vendor' && (
        <>
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <div className="mt-1">
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={(formData as VendorFormData).businessName}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <div className="mt-1">
              <select
                id="businessType"
                name="businessType"
                required
                value={(formData as VendorFormData).businessType}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select business type</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CUISINE_TYPES.map((cuisine) => (
                <div key={cuisine} className="flex items-center">
                  <input
                    id={`cuisine-${cuisine}`}
                    name="cuisineTypes"
                    type="checkbox"
                    value={cuisine}
                    checked={(formData as VendorFormData).cuisineTypes?.includes(cuisine) || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`cuisine-${cuisine}`} className="ml-2 block text-sm text-gray-700">
                    {cuisine}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {formData.role === 'supplier' && (
        <>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <div className="mt-1">
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={(formData as SupplierFormData).companyName}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <div className="mt-1">
              <select
                id="businessType"
                name="businessType"
                required
                value={(formData as SupplierFormData).businessType}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select business type</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Products Offered
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRODUCT_TYPES.map((product) => (
                <div key={product} className="flex items-center">
                  <input
                    id={`product-${product}`}
                    name="productsOffered"
                    type="checkbox"
                    value={product}
                    checked={(formData as SupplierFormData).productsOffered?.includes(product) || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`product-${product}`} className="ml-2 block text-sm text-gray-700">
                    {product}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );

  // Render step 3 - Address Information
  const renderStep3 = () => (
    <>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <div className="mt-1">
          <input
            id="address"
            name="address"
            type="text"
            required
            value={formData.address}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <div className="mt-1">
            <input
              id="city"
              name="city"
              type="text"
              required
              value={formData.city}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <div className="mt-1">
            <select
              id="state"
              name="state"
              required
              value={formData.state}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
          ZIP Code
        </label>
        <div className="mt-1">
          <input
            id="zipCode"
            name="zipCode"
            type="text"
            required
            value={formData.zipCode}
            onChange={handleChange}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="terms"
          name="termsAccepted"
          type="checkbox"
          required
          checked={formData.termsAccepted}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </a>
        </label>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {currentStep === 1 ? 'Create your account' : currentStep === 2 ? 'Profile Information' : 'Address Information'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {currentStep === 1 && 'Or '}
          {currentStep === 1 && (
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          )}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderStepIndicators()}
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
              ) : (
                <div className="w-1/3"></div>
              )}
              
              <div className={`${currentStep > 1 ? 'w-1/3 ml-auto' : 'w-full'}`}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? 'Processing...'
                    : currentStep < 3
                    ? 'Continue'
                    : 'Create Account'}
                </button>
              </div>
            </div>
          </form>

          {currentStep === 1 && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

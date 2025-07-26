import React, { useState } from 'react';
import { useAuth } from '../../contexts/auth/AuthContext';

const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const { signInWithPhoneNumber, verifyOtp, loading } = useAuth();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithPhoneNumber(phoneNumber);
      setCodeSent(true);
    } catch (error) {
      console.error('Error sending code:', error);
      alert('Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(verificationCode);
      // Successfully verified - the onAuthStateChanged in AuthProvider will handle the redirect
    } catch (error) {
      console.error('Error verifying code:', error);
      alert('Invalid verification code. Please try again.');
    }
  };

  if (codeSent) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Verify Phone Number</h2>
        <p className="mb-4">Enter the verification code sent to {phoneNumber}</p>
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification code"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sign In with Phone</h2>
      <form onSubmit={handleSendCode} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 234 567 8900"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>
    </div>
  );
};

export default PhoneAuth;

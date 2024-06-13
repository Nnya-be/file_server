import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

const VerifyAccountPage = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const code = location.pathname.split('/').at(-1);

  const handleVerifyAccount = async () => {
    try {
      const token = Cookies.get('jwt');
      const response = await axios.post(
        `https://file-server-oj1g.onrender.com/api/v1/users/verify/${code}`
      );

      setSuccessMessage('Account verified successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/');
      }, 5000); // Clear success message after 5 seconds
    } catch (err) {
      console.error('Verification Unsuccessful!', err);
      setErrorMessage('Failed to verify account. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      {successMessage && (
        <div className="bg-green-200 text-green-800 p-4 rounded mb-4">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-200 text-red-800 p-4 rounded mb-4">
          {errorMessage}
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Verify Your Account
        </h2>
        <button
          onClick={handleVerifyAccount}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Verify Account
        </button>
      </div>
    </div>
  );
};

export default VerifyAccountPage;

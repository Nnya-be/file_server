import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Info() {
  const [fileDetails, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fileId, setFileId] = useState('');
  const navigate = useNavigate();
  const file = JSON.parse(localStorage.getItem('file_'));
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleDelete = async () => {
    try {
      const token = Cookies.get('jwt');
      const response = await axios.delete(
        `https://file-server-oj1g.onrender.com/api/v1/files/${fileDetails.driveId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFile(null);
      setSuccessMessage('File deleted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/');
      }, 5000); // Clear success message after 5 seconds
    } catch (err) {
      console.error('Deletion Unsuccessful!', err);
      setErrorMessage('Failed to delete file. Please try again.');
      setTimeout(() => setErrorMessage(''), 5000); // Clear error message after 5 seconds
    }
  };

  useEffect(() => {
    const fetchFileDetails = async () => {
      if (Cookies.get('user') !== 'admin') {
        navigate('/file');
      }
      setFileId(file.driveId);
      //   console.log(file.driveId);
      const token = Cookies.get('jwt');
      try {
        const response = await axios.get(
          `https://file-server-oj1g.onrender.com/api/v1/files/getStats/${file.driveId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response.data.data.file);
        setFile(response.data.data.file);
        setFileId(response.data.data.file.driveId);
      } catch (error) {
        console.error('Error fetching rfile details:', error);
      }
    };

    fetchFileDetails();
  }, []);
  const handleSubmit = async (values, { setSubmitting }) => {
    // console.log(values.search);

    try {
      const token = Cookies.get('jwt');
      const response = await axios.get(
        `https://file-server-oj1g.onrender.com/api/v1/files/getStats/${values.search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubmitting(false);
      //   console.log(response);
      setFile(response.data.data.file);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <header>
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="hidden w-full text-gray-600 md:flex md:items-center">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.2721 10.2721C16.2721 12.4813 14.4813 14.2721 12.2721 14.2721C10.063 14.2721 8.27214 12.4813 8.27214 10.2721C8.27214 8.06298 10.063 6.27212 12.2721 6.27212C14.4813 6.27212 16.2721 8.06298 16.2721 10.2721ZM14.2721 10.2721C14.2721 11.3767 13.3767 12.2721 12.2721 12.2721C11.1676 12.2721 10.2721 11.3767 10.2721 10.2721C10.2721 9.16755 11.1676 8.27212 12.2721 8.27212C13.3767 8.27212 14.2721 9.16755 14.2721 10.2721Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.79417 16.5183C2.19424 13.0909 2.05438 7.39409 5.48178 3.79417C8.90918 0.194243 14.6059 0.054383 18.2059 3.48178C21.8058 6.90918 21.9457 12.6059 18.5183 16.2059L12.3124 22.7241L5.79417 16.5183ZM17.0698 14.8268L12.243 19.8965L7.17324 15.0698C4.3733 12.404 4.26452 7.97318 6.93028 5.17324C9.59603 2.3733 14.0268 2.26452 16.8268 4.93028C19.6267 7.59603 19.7355 12.0268 17.0698 14.8268Z"
                  fill="currentColor"
                />
              </svg>
              <span className="mx-1 text-sm">Ksi</span>
            </div>
            <div className="w-full text-gray-700 md:text-center text-2xl font-semibold">
              Lizzy's Enterprise
            </div>
            <div className="flex items-center justify-end w-full">

              <div className="flex sm:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="text-gray-600 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                  aria-label="toggle menu"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                    <path
                      fillRule="evenodd"
                      d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <nav
            className={`sm:flex sm:justify-center sm:items-center mt-4 ${
              isOpen ? '' : 'hidden'
            }`}
          >
            <div className="flex flex-col sm:flex-row">
              <a
                className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
                href="/"
              >
                Home
              </a>
              <a
                className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
                href="file"
              >
                files
              </a>
              <a
                className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
                href="upload"
              >
                upload
              </a>
              <a
                className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
                href="info"
              >
                info
              </a>
              <a
                className="mt-3 text-gray-600 hover:underline sm:mx-3 sm:mt-0"
                href="logout"
              >
                signout
              </a>
            </div>
          </nav>
          {/* <div className="relative mt-6 max-w-lg mx-auto">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div> */}
        </div>
      </header>
      <div className="py-10 lg:px-80 md:px-20 px-10 xl:px-80 ">
        <Formik
          initialValues={{ search: '' }}
          validationSchema={Yup.object({
            search: Yup.string().required('Required'),
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex">
              <Field
                name="search"
                className="w-full border rounded-md pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Enter Drive Id"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                disabled={isSubmitting}
              >
                Search
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative">
          <div className="text-center px-6 py-4">
            <div className="py-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {fileDetails ? fileDetails.title : 'No file Found'}
              </h3>
              <p id="description" className="text-sm font-medium text-gray-600">
                {fileDetails ? fileDetails.description : 'No file Found'}
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <div>
                <p className="text-sm text-gray-600">Mails</p>
                <p id="stars" className="text-lg font-semibold text-gray-800">
                  {fileDetails ? fileDetails.mailSent : ''}
                </p>
              </div>
              <div className="ml-6">
                <p className="text-sm text-gray-600">Downloads</p>
                <p id="forks" className="text-lg font-semibold text-gray-800">
                  {fileDetails ? fileDetails.numberDownloads : ''}
                </p>
              </div>
              <div className="ml-6">
                <p className="text-sm text-gray-600"></p>
                <p
                  id="language"
                  className="text-lg font-semibold text-gray-800"
                >
                  {fileDetails ? fileDetails.filename || 'N/A' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center pt-10 flex-col">
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
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
        >
          Delete file
        </button>
      </div>
    </div>
  );
}

export default Info;

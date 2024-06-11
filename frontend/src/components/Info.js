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
  useEffect(() => {
    const fetchFileDetails = async () => {
      if (Cookies.get('user') !== 'admin') {
        navigate('/file');
      }
      setFileId(file.driveId);
      try {
        const response = await axios.get(
          `https://file-server-oj1g.onrender.com/api/v1/files/getStats${fileId}`
        );
        setFile(response.data.data);
      } catch (error) {
        console.error('Error fetching repository details:', error);
      }
    };

    fetchFileDetails();
  }, [fileDetails]);
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values.search);

    try {
      const response = await axios.get(
        `https://file-server-oj1g.onrender.com/api/v1/files/getStats/${values.search}`
      );
      setSubmitting(false);
      console.log(response);
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
              {/* <button
                onClick={() => setCartOpen(!cartOpen)}
                className="text-gray-600 focus:outline-none mx-4 sm:mx-0"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </button> */}

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
          {/* <svg
              width="80"
              height="80"
              viewBox="0 0 250 250"
              style={{
                fill: '#151513',
                color: '#fff',
                position: 'absolute',
                top: 0,
                border: 0,
                right: 0,
              }}
              aria-hidden="true"
            >
              <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
              <path
                d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                fill="currentColor"
                style={{ transformOrigin: '130px 106px' }}
                className="octo-arm"
              ></path>
              <path
                d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                fill="currentColor"
                className="octo-body"
              ></path>
            </svg>
         */}
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
    </div>
  );
}

export default Info;

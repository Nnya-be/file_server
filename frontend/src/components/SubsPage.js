import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'tailwindcss/tailwind.css';
import Cookies from 'js-cookie';
import { useFile } from './FileProvider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const SendEmail = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const { setFile, file } = useFile();
  const navigate = useNavigate();
  console.log(file);
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const token = Cookies.get('jwt');
    try {
      const response = await axios.get(
        `https://file-server-oj1g.onrender.com/api/v1/files/send/${file._id}`,
        {
          body: {
            email: values.email,
          },
          Headers: {
            Authorization: `Bearer token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);

      setSubmitting(false);
      setShowModal(false);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDownload = async () => {
    try {
      const token = Cookies.get('jwt');
      const response = await axios.get(
        `https://file-server-oj1g.onrender.com/api/v1/files/download/${file._id}`,
        {
          Headers: { Authorization: `Bearer token ${token}` },
        }
      );
      navigate('/');
      console.log(response);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">{file.title}</h2>
        <p className="pb-8">{file.Description}</p>
        <div className="flex justify-between">
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500"
          >
            Download
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          >
            Send to Mail
          </button>
        </div>

        {showModal && (
          <>
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowModal(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="w-full inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="modal-headline"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg
                          width="64px"
                          height="64px"
                          viewBox="0 0 24 24"
                          className="h-6 w-6 text-blue-600"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          stroke="#2563eb"
                          strokeWidth="0.36"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            <g id="style=doutone">
                              <g id="email">
                                <path
                                  id="vector (Stroke)"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M3.88534 5.2371C3.20538 5.86848 2.75 6.89295 2.75 8.5V15.5C2.75 17.107 3.20538 18.1315 3.88534 18.7629C4.57535 19.4036 5.61497 19.75 7 19.75H17C18.385 19.75 19.4246 19.4036 20.1147 18.7629C20.7946 18.1315 21.25 17.107 21.25 15.5V8.5C21.25 6.89295 20.7946 5.86848 20.1147 5.2371C19.4246 4.59637 18.385 4.25 17 4.25H7C5.61497 4.25 4.57535 4.59637 3.88534 5.2371ZM2.86466 4.1379C3.92465 3.15363 5.38503 2.75 7 2.75H17C18.615 2.75 20.0754 3.15363 21.1353 4.1379C22.2054 5.13152 22.75 6.60705 22.75 8.5V15.5C22.75 17.393 22.2054 18.8685 21.1353 19.8621C20.0754 20.8464 18.615 21.25 17 21.25H7C5.38503 21.25 3.92465 20.8464 2.86466 19.8621C1.79462 18.8685 1.25 17.393 1.25 15.5V8.5C1.25 6.60705 1.79462 5.13152 2.86466 4.1379Z"
                                  fill="#2563eb"
                                ></path>
                                <path
                                  id="vector (Stroke)_2"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M19.3633 7.31026C19.6166 7.63802 19.5562 8.10904 19.2285 8.3623L13.6814 12.6486C12.691 13.4138 11.3089 13.4138 10.3185 12.6486L4.77144 8.3623C4.44367 8.10904 4.38328 7.63802 4.63655 7.31026C4.88982 6.98249 5.36083 6.9221 5.6886 7.17537L11.2356 11.4616C11.6858 11.8095 12.3141 11.8095 12.7642 11.4616L18.3113 7.17537C18.6391 6.9221 19.1101 6.98249 19.3633 7.31026Z"
                                  fill="#2563eb"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3
                          className="text-lg leading-6 font-medium text-gray-900"
                          id="modal-headline"
                        >
                          Send file to mail
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Enter your email to send the file to.
                          </p>
                          <Formik
                            initialValues={{ email: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                          >
                            {({ isSubmitting }) => (
                              <Form>
                                <Field
                                  type="email"
                                  name="email"
                                  className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-500"
                                  placeholder="name@example.com"
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                  <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    disabled={isSubmitting}
                                  >
                                    send
                                  </button>
                                  <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => setShowModal(false)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SendEmail;
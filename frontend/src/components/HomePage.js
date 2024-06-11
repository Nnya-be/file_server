import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
// import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useFile } from './FileProvider';
const HomePage = () => {
  const { user, token } = useAuth();
  // console.log(document.cookie);
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  let [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { setFile, setFileId, file } = useFile();
  const navigate = useNavigate();

  // if (!Cookies.get('jwt')) {
  //   navigate('/login');
  // }
  const link =
    'data:image/png;base64,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';

  const handleSubmit = async (values, { setSubmitting }) => {
    // console.log(values.search);
    setQuery(values.search);

    try {
      const token = Cookies.get('jwt');
      const response = await axios.get(
        `https://file-server-oj1g.onrender.com/api/v1/files/search/?title=${values.search}`,
        {
          Headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubmitting(false);
      console.log(response);
      // console.log(JSON.stringify(response.data.files));
      const all = response.data.files;

      setFile(all[0]);
      // Cookies.set('file', response.data.files);
      navigate('/file');
    } catch (err) {
      navigate('/not-found');

      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch data from the server when the component mounts
  useEffect(() => {
    if (!Cookies.get('user')) {
      navigate('/login');
    }
    fetch(
      `https://file-server-oj1g.onrender.com/api/v1/files/?page=${page}&limit=10`
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.data.files) {
          // console.log(feeds);
          setLoading(false);
        }
        setFeeds([...data.data.files]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="bg-white">
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
          <div className="relative mt-6 max-w-lg mx-auto">
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
                    placeholder="Search"
                  />
                  <button
                    type="submit"
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    disabled={isSubmitting || loading}
                  >
                    Search
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </header>

      <main className="my-8">
        <div className="container mx-auto px-6">
          <h3 className="text-gray-700 text-5xl font-medium">Files</h3>
          {loading ? (
            <p>Loading...</p>
          ) : !feeds ? (
            <p>No files Available for downloads</p>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mt-6">
              {feeds.map((feed) => (
                <div
                  key={feed.driveId}
                  className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
                >
                  <div
                    className="flex items-end justify-end h-48 w-full bg-cover"
                    style={{ backgroundImage: `url(${link})` }}
                  >
                    <button
                      className="p-2 rounded-full bg-blue-600 text-white mx-5 -mb-4 hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                      onClick={async () => {
                        console.log(feed.driveId)
                        try {
                          const response = await axios.get(
                            `https://file-server-oj1g.onrender.com/api/v1/files/${feed.driveId}`
                          );
                          // console.log(response);

                          localStorage.setItem(
                            'file_',
                            JSON.stringify(response.data.data.file)
                          );

                          // Cookies.set('file', response.data.file);
                          setFile(response.data.data.file);
                          // console.log(file);
                          navigate('/file');
                        } catch (err) {
                          console.error('Error:', err);
                        }
                      }}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12"
                          stroke="#000000"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="px-5 py-3">
                    <h3 className="text-gray-700 uppercase">{feed.title}</h3>
                    <span className="text-gray-500 mt-2">
                      {feed.description}
                    </span>
                  </div>
                  {Cookies.get('user') == 'admin' ? (
                    <div className="flex justify-between items-center p-8">
                      <div className="flex justify-between items-center">
                        <span className="pr-2">{feed.feed.driveId}</span>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center items-center">
          <button
            onClick={() => {
              setPage(page++);
            }}
            className="px-4 py-2 mt-8 text-sm font-medium text-white bg-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
          >
            View More
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

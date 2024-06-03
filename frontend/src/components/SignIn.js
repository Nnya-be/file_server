import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// import { useNavigate } from 'react-router-dom';// Assuming you have some global styles

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid Email!')
    .required('First name is required!'),
  password: Yup.string().required('Password is required!'),
});

const SignIn = () => {
  //   const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
      // Make an API call to submit the form data
      const response = await fetch(
        'https://file-server-oj1g.onrender.com/api/v1/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();
      console.log(data);
      // Check for successful response
      if (response.ok) {
        // Navigate to the next page
        // navigate('/next-page');
      } else {
        // Handle error response
        console.error('Error:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <div className="px-8 py-24 mx-auto md:px-12 lg:px-32 max-w-7xl">
        <div className="max-w-md mx-auto md:max-w-sm md:w-96">
          <div className="flex flex-col text-center">
            <h1 className="text-3xl font-semibold tracking-tighter text-gray-900">
              Lizzy's Enterprise
            </h1>
            <p className="mt-4 text-base font-medium text-gray-500">
              A rapid approach to collaborate in staging and provisional
              settings.
            </p>
          </div>
          <div className="mt-8">
            {/* <button
              className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium duration-200 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
              aria-label="Sign in with Google"
            >
              <ion-icon
                name="logo-google"
                role="img"
                className="md hydrated"
                aria-label="logo google"
              ></ion-icon>
              <span>Sign in with Google</span>
            </button> */}
            <div className="relative py-3">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 text-lg text-black bg-white">Log In</span>
              </div>
            </div>
          </div>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-3 text-sm font-medium text-black text-left"
                    >
                      Email Address
                    </label>
                    <Field
                      type="text"
                      id="email"
                      name="email"
                      placeholder="example@email.com"
                      className={`block w-full h-12 px-4 py-2 text-blue-500 mb-8 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 ${
                        touched.email && errors.email
                          ? 'border-red-500 '
                          : 'focus:border-zinc-300'
                      } focus:outline-none focus:ring-zinc-300 sm:text-sm`}
                    />
                    {touched.email && errors.email && (
                      <div className="text-red-500 text-sm -mt-8">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="password"
                      className="block mb-3 text-sm font-medium text-black text-left"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Type password here..."
                      className={`block w-full h-12 px-4 py-2 mb-8 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 ${
                        touched.password && errors.password
                          ? 'border-red-500'
                          : 'focus:border-zinc-300'
                      } focus:outline-none focus:ring-zinc-300 sm:text-sm`}
                    />
                    {touched.password && errors.password && (
                      <div className="text-red-500 text-sm -mt-8">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="col-span-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium text-white duration-200 bg-gray-900 rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Sign in
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="flex mx-auto text-sm font-medium leading-tight text-center text-black">
                    Not have a password?
                    <a
                      className="ml-auto text-blue-500 hover:text-black"
                      href="/forms/signup"
                    >
                      Sign up now
                    </a>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default SignIn;

import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email!').required('Email is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const SignUp = () => {
  const navigate = useNavigate();
  let { user, login } = useAuth();
  const handleSubmit = async (
    values,
    { setSubmitting, setFieldError, resetForm }
  ) => {
    try {
      const response = await axios.post(
        'https://file-server-oj1g.onrender.com/api/v1/users/signup',
        values
      );

      if (response.status === 201) {
        user = response.data;
        login(user);
        navigate('/');
        // Navigate to the next page or show success message
      } else {
        console.error('Error:', response.data);
      }
    } catch (error) {
      if (error.response.status === 400) {
        setSubmitting(false);
      }
    } finally {
      setSubmitting(false);
      resetForm();
      setFieldError('authentication', 'Provide all fields!');
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
              Your go-to platform for easy file sharing register with us and hassle no more.
            </p>
          </div>
          <div className="mt-8">
            <div className="relative py-3">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 text-lg text-black bg-white">
                  Sign Up
                </span>
              </div>
            </div>
          </div>
          <Formik
            initialValues={{
              email: '',
              username: '',
              password: '',
              passwordConfirm: '',
            }}
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
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-3 text-sm font-medium text-black text-left"
                    >
                      Username
                    </label>
                    <Field
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Enter username"
                      className={`block w-full h-12 px-4 py-2 text-blue-500 mb-8 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 ${
                        touched.username && errors.username
                          ? 'border-red-500 '
                          : 'focus:border-zinc-300'
                      } focus:outline-none focus:ring-zinc-300 sm:text-sm`}
                    />
                    {touched.username && errors.username && (
                      <div className="text-red-500 text-sm -mt-8">
                        {errors.username}
                      </div>
                    )}
                  </div>
                  <div>
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
                  <div>
                    <label
                      htmlFor="passwordConfirm"
                      className="block mb-3 text-sm font-medium text-black text-left"
                    >
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      id="passwordConfirm"
                      name="passwordConfirm"
                      placeholder="Confirm password..."
                      className={`block w-full h-12 px-4 py-2 mb-8 text-blue-500 duration-200 border rounded-lg appearance-none bg-chalk border-zinc-300 placeholder-zinc-300 ${
                        touched.passwordConfirm && errors.passwordConfirm
                          ? 'border-red-500'
                          : 'focus:border-zinc-300'
                      } focus:outline-none focus:ring-zinc-300 sm:text-sm`}
                    />
                    {touched.passwordConfirm && errors.passwordConfirm && (
                      <div className="text-red-500 text-sm -mt-8">
                        {errors.passwordConfirm}
                      </div>
                    )}
                  </div>
                  <div className="-mb-8">
                    {errors.authentication && (
                      <div className="bg-slate-200 p-2 rounded-lg text-center ">
                        {errors.authentication}
                      </div>
                    )}
                  </div>
                  <div className="col-span-full">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center w-full h-12 gap-3 px-5 py-3 font-medium text-white duration-200 bg-gray-900 rounded-xl hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      {isSubmitting ? ' Loading...' : 'Sign up'}
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="flex mx-auto text-sm font-medium leading-tight text-center text-black">
                    Already have an account?{' '}
                    <a
                      className="ml-auto text-blue-500 hover:text-black"
                      href="/login"
                    >
                      Sign in
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

export default SignUp;

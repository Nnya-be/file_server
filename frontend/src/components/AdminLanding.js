import React, { Children, useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import Cookies from 'js-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faBell,
  faUser,
  faHome,
  faFileAlt,
  faUsers,
  faStore,
  faExchangeAlt,
  faSignOutAlt,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = ({ children }) => {
  //
  const toggleSideNav = () => {
    document.getElementById('sideNav').classList.toggle('hidden');
  };

  const [files, setFiles] = useState([]);
  const formik = useFormik({
    initialValues: {
      searchQuery: '',
    },
    validationSchema: Yup.object({
      searchQuery: Yup.string().required('Search query is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `https://file-server-oj1g.onrender.com/api/v1/files/search/?title=${values.searchQuery}`,
          {
            Headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
          }
        );
        setFiles(response.data.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Barra de navegación superior */}
      <div className="bg-white shadow w-full p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center">
            {/* <img src="https://www.emprenderconactitud.com/img/POC%20WCS%20(1).png" alt="Logo" className="w-28 h-18 mr-2" /> */}
            <h2 className="font-bold text-xl">Admin Panel</h2>
          </div>
          <div className="md:hidden flex items-center">
            <button id="menuBtn" onClick={toggleSideNav}>
              <FontAwesomeIcon
                icon={faBars}
                className="text-gray-500 text-lg"
              />
            </button>
          </div>
        </div>
        {/* Ícono de Notificación y Perfil */}
        <div className="space-x-5">
          <button>
            <FontAwesomeIcon icon={faBell} className="text-gray-500 text-lg" />
          </button>
          <button>
            <FontAwesomeIcon icon={faUser} className="text-gray-500 text-lg" />
          </button>
        </div>
      </div>
      {/* Contenido principal */}
      <div className="flex-1 flex flex-wrap">
        {/* Barra lateral de navegación */}
        <div
          className="p-2 bg-white w-full md:w-60 flex flex-col hidden md:flex"
          id="sideNav"
        >
          <nav>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="/admin"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </a>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="/admin/upload"
            >
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
              files
            </a>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="/admin/users"
            >
              <FontAwesomeIcon icon={faUsers} className="mr-2" />
              Users
            </a>
            <a
              className="block text-gray-500 py-2.5 px-4 my-4 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white"
              href="/admin/stats"
            >
              <FontAwesomeIcon icon={faStore} className="mr-2" />
              Stats
            </a>
          </nav>
          {/* Ítem de Cerrar Sesión */}
          <a
            className="block text-gray-500 py-2.5 px-4 my-2 rounded transition duration-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-cyan-500 hover:text-white mt-auto"
            href="#"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Log out
          </a>
          {/* Señalador de ubicación */}
          <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mt-2"></div>
          {/* Copyright al final de la navegación lateral */}
          <p className="mb-1 px-5 py-3 text-left text-xs text-cyan-500">
            Copyright Lizzy Ent
          </p>
        </div>
        {/* Área de contenido principal */}
        <div className="flex-1 p-4 w-full md:w-1/2">
          {/* Campo de búsqueda */}
          <div className="relative max-w-md w-full">
            <div className="absolute top-1 left-2 inline-flex items-center p-2">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="relative max-w-md w-full"
            >
              <div className="absolute top-1 left-2 inline-flex items-center p-2">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                className={`w-full h-10 pl-10 pr-4 py-1 text-base placeholder-gray-500 border rounded-full focus:shadow-outline ${
                  formik.touched.searchQuery && formik.errors.searchQuery
                    ? 'border-red-500'
                    : ''
                }`}
                type="search"
                name="searchQuery"
                placeholder="Search Files..."
                value={formik.values.searchQuery}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.searchQuery && formik.errors.searchQuery ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.searchQuery}
                </div>
              ) : null}
            </form>
          </div>
          {/* Contenedor de Gráficas */}
          <div className="mt-8 flex flex-wrap space-x-0 space-y-2 md:space-x-4 md:space-y-0">
            {/* Primer contenedor */}
            {/* <div className="flex-1 bg-white p-4 shadow rounded-lg md:w-1/2">
              <h2 className="text-gray-500 text-lg font-semibold pb-1">
                files
              </h2>
              <div className="my-1"></div>
              <div className="bg-gradient-to-r from-cyan-300 to-cyan-500 h-px mb-6"></div>
              <div
                className="chart-container"
                style={{ position: 'relative', height: '150px', width: '100%' }}
              >
                <canvas id="usersChart"></canvas>
              </div>
            </div> */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

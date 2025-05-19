import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MainLayout from './layouts/MainLayout';
import RRHHPage from './pages/RRHHPage.jsx';
import ReportesPage from './pages/ReportesPage.jsx';
import PrestacionesPage from './pages/PrestacionesPage.jsx';
import AgregarColaboradorPage from './pages/AgregarColaboradorPage.jsx'
import GenerarPagosPage from './pages/GenerarPagosPage.jsx'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <h2>Bienvenido al sistema</h2> },
      { path: 'rrhh', element: <RRHHPage /> },
      { path: 'reportes', element: <ReportesPage /> },
      { path: 'prestaciones', element: <PrestacionesPage /> },
      { path: 'agregar-colaborador', element: <AgregarColaboradorPage /> },
      { path: 'generar-pagos', element: <GenerarPagosPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

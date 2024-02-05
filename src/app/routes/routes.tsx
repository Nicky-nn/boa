import { Navigate } from 'react-router-dom'

import AuthGuard from '../../auth/AuthGuard'
import MatxLayout from '../base/components/Template/MatxLayout/MatxLayout'
import dashboardRoutes from '../base/view/dashboard/DashboardRoutes'
import NotFound from '../base/view/sessions/NotFound'
import sessionRoutes from '../base/view/sessions/SessionRoutes'
import clientesRoutes from '../modules/clientes/ClientesRoutes'
import cuentaRoutes from '../modules/cuenta/CuentaRoutes'
import ventasRoutes from '../modules/ventas/VentasRoutes'
import clasificadorRoutes from '../modules/Clasificador/IataAerRoutes'

export const appRoutes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...dashboardRoutes,
      ...ventasRoutes,
      ...clientesRoutes,
      ...cuentaRoutes,
      ...clasificadorRoutes,
    ],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard/default" /> },
  { path: '*', element: <NotFound /> },
]


import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'

const AppAlicuota = Loadable(lazy(() => import('./view/IataAerolinea')))
const AppAgenciaDeViaje = Loadable(lazy(() => import('./view/AgenciaDeViaje')))
const AppOrigen = Loadable(lazy(() => import('./view/Origen')))
const AppTipoTransaccion = Loadable(lazy(() => import('./view/TipoTransaccion')))

const clasificadorRoutes = [
  {
    path: `clasificadores/iata-aerolineas`,
    element: <AppAlicuota />,
    auth: authRoles.admin,
  },
  {
    path: `clasificadores/agencia-de-viaje`,
    element: <AppAgenciaDeViaje />,
    auth: authRoles.admin,
  },
  {
    path: `clasificadores/origen-servicios`,
    element: <AppOrigen />,
    auth: authRoles.admin,
  },
  {
    path: `clasificadores/tipo-transaccion`,
    element: <AppTipoTransaccion />,
    auth: authRoles.admin,
  },
]

export default clasificadorRoutes


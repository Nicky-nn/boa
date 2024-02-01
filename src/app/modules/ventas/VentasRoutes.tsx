import { lazy } from 'react'

import { authRoles } from '../../../auth/authRoles'
import Loadable from '../../base/components/Template/Loadable/Loadable'
import { ventasRoutesMap } from './VentasRoutesMap'
import EmisionMasiva from './view/emisionMasiva/EmisionMasiva'

const AppVentaGestion = Loadable(lazy(() => import('./view/VentaGestion')))
const AppPaquetes = Loadable(lazy(() => import('./view/emisionPaquetes/EmisionPaquetes')))

const ventasRoutes = [
  {
    path: ventasRoutesMap.emisionMasiva.path,
    element: <EmisionMasiva />,
    auth: authRoles.admin,
  },
  {
    path: ventasRoutesMap.emisionPaquetes.path,
    element: <AppPaquetes />,
    auth: authRoles.admin,
  },
  {
    path: '/ventas/gestion',
    element: <AppVentaGestion />,
    auth: authRoles.admin,
  },
]

export default ventasRoutes

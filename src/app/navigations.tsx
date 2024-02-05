import { ventasRoutesMap } from './modules/ventas/VentasRoutesMap'

export interface NavigationProps {
  name: string
  path?: string
  icon?: any
  iconText?: string
  label?: string
  type?: string
  badge?: { value: string; color: string }
  children?: Array<{
    name: string
    iconText: string
    path: string
  }>
}

export const navigations: NavigationProps[] = [
  {
    name: 'Página Principal',
    path: '/dashboard/default',
    icon: 'home',
  },
  {
    name: 'MENUS',
    label: 'MENUS',
    type: 'label',
  },
  {
    name: 'Emisión',
    icon: 'shopping_cart',
    children: [
      {
        name: ventasRoutesMap.emision.name,
        iconText: 'EMI',
        path: ventasRoutesMap.emision.path,
      },
      {
        name: ventasRoutesMap.emisionMasiva.name,
        iconText: 'EMMA',
        path: ventasRoutesMap.emisionMasiva.path,
      },
      {
        name: ventasRoutesMap.emisionPaquetes.name,
        iconText: 'EMPA',
        path: ventasRoutesMap.emisionPaquetes.path,
      },
      {
        name: ventasRoutesMap.gestion.name,
        iconText: 'GEST',
        path: ventasRoutesMap.gestion.path,
      },
    ],
  },
{
  name: 'Clasificadores',
  icon: 'category',
  badge: { value: '', color: 'secondary' },
  children: [
    {
      name: 'Iata Aerolineas',
      path: '/clasificadores/iata-aerolineas',
      iconText: 'IE',
    },
    {
      name: 'Agencia de Viajes',
      path: '/clasificadores/agencia-de-viaje',
      iconText: 'AV',
    },
    {
      name: 'Origen Servicios',
      path: '/clasificadores/origen-servicios',
      iconText: 'PA',
    },
    {
      name: 'Tipo Transacción',
      path: '/clasificadores/tipo-transaccion',
      iconText: 'RE',
    },
  ],

},
  {
    name: 'Clientes',
    icon: 'person_sharp',
    badge: { value: '', color: 'secondary' },
    children: [
      {
        name: 'Gestión de clientes',
        path: '/clientes/gestion',
        iconText: 'GC',
      },
    ],
  },
]

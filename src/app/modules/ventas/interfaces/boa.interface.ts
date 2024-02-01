import {
  DateListAnioProps,
  DateListDiaProps,
  DateListMesProps,
} from '../../../services/fechas'
import { MetodoPagoProp } from '../../base/metodoPago/interfaces/metodoPago'
import { MonedaProps } from '../../base/moneda/interfaces/moneda'
import { PuntoVentaProps } from '../../base/puntoVenta/interfaces/puntoVenta'
import { SucursalProps } from '../../base/sucursal/interfaces/sucursal'
import { ClienteProps } from '../../clientes/interfaces/cliente'
import {
  SinActividadesProps,
  SinCufdProps,
  SinCuisProps,
  SinMotivoAnulacionProps,
  SinTipoEmisionProps,
  SinTipoFacturaProps,
} from '../../sin/interfaces/sin.interface'
import { RepresentacionGraficaProps } from './factura'

export interface BoaPeriodoProps {
  gestion: DateListAnioProps
  mes: DateListMesProps
  dia?: DateListDiaProps
}

export interface FacturaBoaProps {
  _id: string
  tipoFactura: SinTipoFacturaProps
  tipoEmision: SinTipoEmisionProps
  nitEmisor: string
  numeroFactura: string
  cuis: SinCuisProps
  cufd: SinCufdProps
  cuf: string
  sucursal: SucursalProps
  puntoVenta: PuntoVentaProps
  fechaEmision: string
  razonSocialEmisor: string
  cliente: ClienteProps
  actividadEconomica: SinActividadesProps
  nombrePasajero: string
  numeroDocumentoPasajero: string
  codigoIataLineaAerea: number
  codigoIataAgenteViajes: string
  nitAgenteViajes: string
  codigoOrigenServicio: string
  moneda: MonedaProps
  tipoCambio: number
  montoTarifa: number
  montoTotal: number
  montoTotalMoneda: number
  montoTotalSujetoIva: number
  codigoTipoTransaccion: string
  metodoPago: MetodoPagoProp
  numeroTarjeta: string
  montoTotalLiteral: string
  cafc: string
  leyenda: string
  subLeyenda: string
  usuario: string
  motivoAnulacion: SinMotivoAnulacionProps
  codigoRecepcion: string
  representacionGrafica: RepresentacionGraficaProps
  usucre: string
  usumod: string
  createdAt: string
  updatedAt: string
  state: string
}

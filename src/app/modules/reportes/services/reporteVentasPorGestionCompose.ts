import { apiEstado } from '../../../interfaces'
import { genReplaceEmpty } from '../../../utils/helper'
import { ReporteVentasPorGestionProps } from '../api/reporteVentasPorGestion.api'
import { MESES } from '../interfaces/reportes'

export interface ReporteVentasUsuarioDetalleComposeProps {
  mes: number
  mesTexto: string
  nroPendientes: number
  nroValidadas: number
  nroAnuladas: number
  nroParcialFacturas: number // SUM PENDIENTES+VALIDADAS+ANULADAS
  montoValidadas: number
  montoAnuladas: number
  montoPendientes: number
  montoParcialFacturas: number // sum pendientes + validadas + anulada
}

export interface ReporteVentasPorGestionComposeProps {
  nroTotalFacturas: number
  montoTotalFacturas: number
  detalle: ReporteVentasUsuarioDetalleComposeProps[]
}

/**
 * @description Composicion de datos para los reportes
 * @param data
 */
export const reporteVentasPorGestionCompose = (
  data: ReporteVentasPorGestionProps[],
): ReporteVentasPorGestionComposeProps | null => {
  try {
    const newData: ReporteVentasUsuarioDetalleComposeProps[] = []

    let nroTotalFacturas = 0
    let montoTotalFacturas = 0

    for (const mes of MESES) {
      const pendientes = data.find(
        (d) => d.mes === mes.mes && d.state === apiEstado.pendiente,
      )
      const anuladas = data.find(
        (d) => d.mes === mes.mes && d.state === apiEstado.anulado,
      )
      const validas = data.find(
        (d) => d.mes === mes.mes && d.state === apiEstado.validada,
      )
      const nroParcial =
        genReplaceEmpty(pendientes?.numeroFacturas, 0) +
        genReplaceEmpty(validas?.numeroFacturas, 0) +
        genReplaceEmpty(anuladas?.numeroFacturas, 0)
      const montoParcial =
        genReplaceEmpty(pendientes?.montoTotal, 0) +
        genReplaceEmpty(validas?.montoTotal, 0) -
        genReplaceEmpty(anuladas?.montoTotal, 0)

      newData.push({
        mes: mes.mes,
        mesTexto: mes.text,
        nroPendientes: pendientes?.numeroFacturas || 0,
        nroValidadas: validas?.numeroFacturas || 0,
        nroAnuladas: anuladas?.numeroFacturas || 0,
        nroParcialFacturas: nroParcial,
        montoValidadas: validas?.montoTotal || 0,
        montoAnuladas: anuladas?.montoTotal || 0,
        montoPendientes: pendientes?.montoTotal || 0,
        montoParcialFacturas: montoParcial, // sum pendientes + validadas + anulada
      })
      nroTotalFacturas += nroParcial
      montoTotalFacturas += montoParcial
    }

    return {
      nroTotalFacturas,
      montoTotalFacturas,
      detalle: newData,
    }
  } catch (e) {
    throw new Error('Error en generacion del reporte')
  }
}

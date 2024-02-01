// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { EntidadInputProps } from '../../../interfaces'

export interface ReporteVentasPorGestionProps {
  gestion: number
  mes: number
  numeroFacturas: number
  montoTotal: number
  montoTarifa: number
  montoTotalSujetoIva: number
  state: string
}

const query = gql`
  query VENTAS_X_GESTION($gestion: Int!, $entidad: [EntidadParamsInput]) {
    boaReporteVentasPorGestion(gestion: $gestion, entidad: $entidad) {
      gestion
      mes
      numeroFacturas
      montoTotal
      montoTarifa
      montoTotalSujetoIva
      state
    }
  }
`

/**
 * @description Generamos el reporte de ventas por gestion
 * @param gestion
 * @param entidad
 */
export const apiReporteVentasPorGestion = async (
  gestion: number,
  entidad: EntidadInputProps[] | null,
): Promise<ReporteVentasPorGestionProps[]> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { gestion, entidad })
    return data.boaReporteVentasPorGestion || []
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

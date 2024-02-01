// noinspection GraphQLUnresolvedReference

import { endOfMonth, startOfMonth } from 'date-fns'
import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { apiEstado, PageInfoProps } from '../../../interfaces'
import { BoaPeriodoProps } from '../interfaces/boa.interface'

/**
 * Respuesta de productos
 */
export interface ApiNroFacturasPorEstadoProps {
  elaborados: { pageInfo: PageInfoProps; docs: any[] }
  pendientes: { pageInfo: PageInfoProps; docs: any[] }
}

const query = gql`
  query LISTADO($query1: String, $query2: String) {
    elaborados: facturasBoletosAereos(limit: 1, query: $query1) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        state
      }
    }
    pendientes: facturasBoletosAereos(limit: 1, query: $query2) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        state
      }
    }
  }
`

/**
 * @description Listamos los documentos por estado PENDIENTES/ELABORADOS
 * @param periodo
 */
export const apiNroFacturasPorEstado = async (
  periodo: BoaPeriodoProps,
): Promise<ApiNroFacturasPorEstadoProps> => {
  try {
    const fecha = new Date(periodo.gestion.key, periodo.mes.key, 0)
    const fechaInicial = startOfMonth(fecha)
    const fechaFinal = endOfMonth(fecha)

    const pageInfo = {
      query1: `fechaEmision>=${fechaInicial}&fechaEmision<=${fechaFinal}&state=${apiEstado.elaborado}`,
      query2: `fechaEmision>=${fechaInicial}&fechaEmision<=${fechaFinal}&state=${apiEstado.pendiente}`,
    }
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { ...pageInfo })
    return data
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

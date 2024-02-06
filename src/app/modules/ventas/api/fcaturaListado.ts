// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageProps } from '../../../interfaces'
import { FacturaBoaProps } from '../interfaces/boa.interface'

/**
 * Respuesta de productos
 */
export interface ApiFacturaResponse {
  docs: Array<FacturaBoaProps>
  pageInfo: PageInfoProps
}

const query2 = gql`
  query LISTADO($query: String) {
    facturasBoletosAereos(query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        
        representacionGrafica {
          xml
          sin
        }
        usucre
        usumod
        createdAt
        updatedAt
        state
      }
    }
  }
`

export const apiFacturaListado2 = async (
  query: string,
): Promise<ApiFacturaResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query2, { query })
  return data.facturasBoletosAereos
}

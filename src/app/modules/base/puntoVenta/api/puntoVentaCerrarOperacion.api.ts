// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../../base/services/GraphqlError'

const gqlQuery = gql`
  mutation PV_CERRAR_OPERACION($id: ID!) {
    puntoVentaCerrarOperacion(id: $id)
  }
`

/**
 * @description Cierra operaciones
 * @param id
 */
export const apiPuntoVentaCerrarOperacion = async (id: string): Promise<boolean> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, { id })
    return data.puntoVentaCerrarOperacion
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

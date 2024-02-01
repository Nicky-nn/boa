// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../../base/services/GraphqlError'
import { SucursalInputApiProps, SucursalProps } from '../interfaces/sucursal'

const gqlQuery = gql`
  mutation SUCURSAL_ACTUALIZAR($codigo: Int!, $input: OrgSucursalActualizarInput!) {
    sucursalActualizar(codigo: $codigo, input: $input) {
      _id
      codigo
    }
  }
`

/**
 * Actualizamos datos de la sucursal
 * @param codigo
 * @param input
 */
export const apiSucursalActualizar = async (
  codigo: number,
  input: SucursalInputApiProps,
): Promise<SucursalProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, { codigo, input })
    return data.sucursalActualizar
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

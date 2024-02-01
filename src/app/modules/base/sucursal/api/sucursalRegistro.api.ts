// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../../base/services/GraphqlError'
import { SucursalInputApiProps, SucursalProps } from '../interfaces/sucursal'

const gqlQuery = gql`
  mutation SUCURSAL_REGISTRO($input: OrgSucursalInput!) {
    sucursalRegistro(input: $input) {
      _id
      codigo
    }
  }
`

export const apiSucursalRegistro = async (
  input: SucursalInputApiProps,
): Promise<SucursalProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, { input })
    return data.sucursalRegistro
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

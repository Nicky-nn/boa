// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../../base/services/GraphqlError'
import { PuntoVentaInputApiProps, PuntoVentaProps } from '../interfaces/puntoVenta'

const gqlQuery = gql`
  mutation PUNTO_VENTA_REGISTRO($input: OrgPuntoVentaInput) {
    orgPuntoVentaCreate(input: $input) {
      _id
    }
  }
`

export const apiPuntoVentaRegistro = async (
  input: PuntoVentaInputApiProps,
): Promise<PuntoVentaProps> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)
    const data: any = await client.request(gqlQuery, { input })
    return data.orgPuntoVentaCreate
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { AgenciaDeViajesProps } from '../interfaces/alicuota.interface'

const gqlQuery = gql`
  mutation REGISTRO(
    $codigoTipoTransaccion: String!
    $descripcion: String!
  ) {
    boaTipoTransaccionRegistro(
      codigoTipoTransaccion: $codigoTipoTransaccion
      descripcion: $descripcion
    ) {
      codigoTipoTransaccion
      descripcion
    }
  }
`

export const apiTipoTransaccion = async (
  codigoTipoTransaccion: string,
  descripcion: string,
): Promise<AgenciaDeViajesProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, {
    codigoTipoTransaccion,
    descripcion,
  })
  return data.apiTipoTransaccion
}


// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { AgenciaDeViajesProps } from '../interfaces/alicuota.interface'

const gqlQuery = gql`
  mutation REGISTRO(
    $codigoOrigenServicio: String!
    $descripcion: String!
  ) {
    boaOrigenServicioRegistro(
      codigoOrigenServicio: $codigoOrigenServicio
      descripcion: $descripcion
    ) {
      codigoOrigenServicio
      descripcion
    }
  }
`

export const apiOrigen = async (
  codigoOrigenServicio: string,
  descripcion: string,
): Promise<AgenciaDeViajesProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, {
    codigoOrigenServicio,
    descripcion,
  })
  return data.boaOrigenServicioRegistro
}


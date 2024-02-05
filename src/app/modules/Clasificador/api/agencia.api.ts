// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { AgenciaDeViajesProps } from '../interfaces/alicuota.interface'

const gqlQuery = gql`
  mutation REGISTRO(
    $codigoIataAgenteViajes: String!
    $nitAgenteViajes: String
    $descripcion: String!
  ) {
    boaAgenciaViajesRegistro(
      codigoIataAgenteViajes: $codigoIataAgenteViajes
      nitAgenteViajes: $nitAgenteViajes
      descripcion: $descripcion
    ) {
      codigoIataAgenteViajes
      nitAgenteViajes
      descripcion
    }
  }
`

export const apiAgenciaRegistro = async (
  codigoIataAgenteViajes: string,
  nitAgenteViajes: string,
  descripcion: string,
): Promise<AgenciaDeViajesProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, {
    codigoIataAgenteViajes,
    nitAgenteViajes,
    descripcion,
  })
  return data.boaAgenciaViajesRegistro
}


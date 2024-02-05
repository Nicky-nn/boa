// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import {
  BoletoIataAereoInputProp,
  BoletoIataAereoProps,
} from '../interfaces/alicuota.interface'

const gqlQuery = gql`
  mutation REGISTRO(
    $codigoIataLineaAerea: Int!
    $codigoIata: String
    $descripcion: String!
  ) {
    boaIataAerolineaRegistro(
      codigoIataLineaAerea: $codigoIataLineaAerea
      codigoIata: $codigoIata
      descripcion: $descripcion
    ) {
      codigoIataLineaAerea
      codigoIata
      descripcion
    }
  }
`

export const apiIataAerRegistro = async (
  codigoIataLineaAerea: number,
  codigoIata: string,
  descripcion: string,
): Promise<BoletoIataAereoProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, {
    codigoIataLineaAerea,
    codigoIata,
    descripcion,
  })
  return data.boaIataAerolineaRegistro
}


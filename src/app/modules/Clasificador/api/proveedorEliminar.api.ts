// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'

const gqlQuery = gql`
  mutation ALICUOTAS_ELIMINAR($subPartidaArancelaria: String!) {
    alicuotaIceEliminar(subPartidaArancelaria: $subPartidaArancelaria)
  }
`

export const apiProveedorEliminar = async (
  subPartidaArancelaria: string,
): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, { subPartidaArancelaria })
  return data.alicuotaIceEliminar
}

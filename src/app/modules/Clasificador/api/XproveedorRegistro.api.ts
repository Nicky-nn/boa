// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { AlicuotaInputProp, AlicuotaProps } from '../interfaces/alicuota.interface'

const gqlQuery = gql`
  mutation ALICUOTA_REGISTRO($subPartidaArancelaria: String!, $input: AlicuotaIceInput!) {
    alicuotaIceRegistro(subPartidaArancelaria: $subPartidaArancelaria, input: $input) {
      subPartidaArancelaria
      descripcion
      alicuotaEspecifica
      alicuotaPorcentual
      state
      createdAt
      updatedAt
      usucre
      usumod
    }
  }
`

export const apiProveedorRegistro = async (
  subPartidaArancelaria: string,
  input: AlicuotaInputProp,
): Promise<AlicuotaProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, { subPartidaArancelaria, input })
  return data.alicuotaIceRegistro
}

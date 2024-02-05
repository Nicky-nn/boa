// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import { AlicuotaProps } from '../interfaces/alicuota.interface'

const gqlQuery = gql`
  query ALICUOTA($subPartidaArancelaria: String!) {
    alicuotaIce(subPartidaArancelaria: $subPartidaArancelaria) {
      subPartidaArancelaria
      descripcion
      alicuotaEspecifica
      alicuotaPorcentual
    }
  }
`

export const apiAlicuota = async (
  subPartidaArancelaria: string,
): Promise<AlicuotaProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery, { subPartidaArancelaria })
  // console.log(data)
  return data.alicuotaIce
}

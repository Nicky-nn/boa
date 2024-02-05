// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageInputProps } from '../../../interfaces'
import { AlicuotaProps } from '../interfaces/alicuota.interface'

const gqlQuery = gql`
  query ALICUOTAS {
    alicuotaIceListado {
      subPartidaArancelaria
      descripcion
      alicuotaPorcentual
      alicuotaEspecifica
      createdAt
      state
      updatedAt
      usucre
      usumod
    }
  }
`

interface ProveedorResponse {
  [x: string]: any
  pageInfo: PageInfoProps
  docs: AlicuotaProps[]
}

export const apiAlicuotas = async (
  pageInfo: PageInputProps,
): Promise<ProveedorResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery)
  return data.alicuotaIceListado
}

export const apiAlicuotas2 = async (): Promise<ProveedorResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(gqlQuery)
  return data.alicuotaIceListado
}

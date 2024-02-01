// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'

export const gqlQuery = gql`
  mutation BOA_ANULACION_LOT($codigoMotivo: Int!, $cufs: [String]!) {
    facturaBoletoAereoAnulacionLote(codigoMotivo: $codigoMotivo, cufs: $cufs)
  }
`

export const apiFacturaAnular = async (
  cufs: string[],
  codigoMotivo: number,
): Promise<boolean> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(gqlQuery, { codigoMotivo, cufs })
    return data.facturaBoletoAereoAnulacionLote
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

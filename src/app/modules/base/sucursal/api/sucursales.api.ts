// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../../base/services/GraphqlError'
import { SucursalProps } from '../interfaces/sucursal'

const query = gql`
  query SUCURSALES {
    orgSucursales {
      _id
      codigo
      direccion
      telefono
      departamento {
        codigo
        codigoPais
        departamento
        sigla
      }
      municipio
      state
      usucre
      createdAt
      usumod
      updatedAt
    }
  }
`

export const apiSucursales = async (): Promise<SucursalProps[]> => {
  try {
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query)
    return data.orgSucursales
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

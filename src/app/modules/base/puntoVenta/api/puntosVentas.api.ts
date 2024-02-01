// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../../base/models/paramsModel'
import { PuntoVentaProps } from '../interfaces/puntoVenta'

const query = gql`
  query PUNTOS_VENTA_LISTADO {
    orgPuntoVentaAll {
      _id
      codigo
      tipoPuntoVenta {
        codigoClasificador
        descripcion
      }
      nombre
      descripcion
      cuis {
        codigo
        fechaVigencia
      }
      cufd {
        codigo
        codigoControl
        direccion
        fechaVigencia
        fechaInicial
      }
      oldCufd {
        codigo
        codigoControl
        direccion
        fechaVigencia
        fechaInicial
      }
      sucursal {
        codigo
        direccion
        telefono
        departamento {
          codigo
          codigoPais
          sigla
          departamento
        }
        municipio
      }
      timeOut
      usucre
      usumod
      createdAt
      updatedAt
      state
    }
  }
`

export const apiPuntosVenta = async (): Promise<PuntoVentaProps[]> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query)
  return data.orgPuntoVentaAll
}

// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { BoaPeriodoProps } from '../interfaces/boa.interface'
import { EmisionPaquetesProps } from '../interfaces/emisionPaquetes.interface'

const query = gql`
  query BOA_PAQUETES($periodo: BoaPeriodoInput) {
    facturaBoletoAereoPaquetes(periodo: $periodo) {
      grupo
      codigoSucursal
      codigoPuntoVenta
      numeroPaquetes
      paquetes {
        nroPaquete
        nroFacturas
        codigoEstado
        archivos {
          codigo
          descripcion
          numero
          factura
        }
        codigoRecepcion
        errores
        state
      }
      createdAt
      updatedAt
      state
      usucre
      usumod
    }
  }
`

export const apiBoaPaquetes = async (
  periodo: BoaPeriodoProps,
): Promise<EmisionPaquetesProps[]> => {
  try {
    const gPeriodo = {
      gestion: periodo.gestion.key,
      mes: periodo.mes.key,
      dia: periodo.dia?.key || null,
    }
    const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)
    // Set a single header
    client.setHeader('authorization', `Bearer ${token}`)

    const data: any = await client.request(query, { periodo: gPeriodo })
    return data.facturaBoletoAereoPaquetes
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

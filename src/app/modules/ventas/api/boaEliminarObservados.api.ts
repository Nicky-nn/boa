// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { BoaPeriodoProps } from '../interfaces/boa.interface'
import { EmisionPaquetesProps } from '../interfaces/emisionPaquetes.interface'

const query = gql`
  mutation BOA_ELIMINAR_OBSERVADOS($periodo: BoaPeriodoInput) {
    facturaBoletoAereoEliminarObservados(periodo: $periodo) {
      codigoPuntoVenta
      codigoSucursal
      createdAt
      estado
      grupo
      numeroPaquetes
      paquetes {
        nroPaquete
        nroFacturas
        archivos {
          codigo
          numero
          factura
          descripcion
        }
        codigoRecepcion
        codigoEstado
        state
      }
      state
      updatedAt
      usucre
      usumod
    }
  }
`

export const apiBoaEliminarObservados = async (
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
    return data.facturaBoletoAereoEliminarObservados
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import { BoaPeriodoProps } from '../interfaces/boa.interface'
import { EmisionPaquetesProps } from '../interfaces/emisionPaquetes.interface'

const query = gql`
  query BOA_PAQUETES($periodo: BoaPeriodoInput) {
    facturaBoletoAereoResumenPaquetes(periodo: $periodo) {
      grupo
      codigoSucursal
      codigoPuntoVenta
      numeroPaquetes
      paquetes {
        nroPaquete
        nroFacturas
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

/**
 * @description Obtenemos el resumen de los paquetes de boleto aereo
 * @param periodo
 */
export const apiBoaPaquetesResumen = async (
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
    return data.facturaBoletoAereoResumenPaquetes
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

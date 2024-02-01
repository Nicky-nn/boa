// noinspection GraphQLUnresolvedReference

import axios from 'axios'
import { gql } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { MyGraphQlError } from '../../../base/services/GraphqlError'
import {
  EmisionMasivaApiInputProps,
  EmisionMasivaProps,
} from '../interfaces/emisionMasiva.interface'

export const gqlQuery = gql`
  mutation BOA_MASIVO_ARCHIVO($input: BoaPeriodoInput, $archivo: Upload!) {
    facturaBoletoAereoRecepcionArchivoMasivo(input: $input, archivo: $archivo) {
      estado
      archivos {
        fila
        cuf
        numeroFactura
        errores
      }
    }
  }
`

/**
 * @description REcepcion masiva del archivo de boletos aereos, se usa axios
 * @param input
 * @param archivo
 */
export const apiRecepcionArchivoMasivo = async (
  input: EmisionMasivaApiInputProps,
  archivo: File,
): Promise<EmisionMasivaProps> => {
  try {
    // const client = new GraphQLClient(import.meta.env.ISI_API_URL)
    const token = localStorage.getItem(AccessToken)

    const variables = {
      input,
      archivo: null,
    }
    const formData = new FormData()
    const operations = JSON.stringify({ query: gqlQuery, variables })
    formData.append('operations', operations)
    const map = {
      '0': ['variables.archivo'],
    }
    formData.append('map', JSON.stringify(map))
    formData.append('0', archivo)

    const resp = await axios({
      url: import.meta.env.ISI_API_URL,
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      method: 'post',
      data: formData,
    }).then((data) => data.data)
    return resp.data.facturaBoletoAereoRecepcionArchivoMasivo
  } catch (e: any) {
    throw new MyGraphQlError(e)
  }
}

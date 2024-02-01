import { number, object } from 'yup'

import { isEmptyValue } from '../../../utils/helper'
import { EmisionMasivaInputProps } from '../interfaces/emisionMasiva.interface'

export const EmisionMasivaValidatorSchema = object({
  gestion: object({
    key: number().integer().required(),
  }),
  mes: object({
    key: number().integer().required(),
  }),
})

/**
 * Validamos los datos de formulario, se usa en caso q cuenta con logica de negocio
 * @param input
 */
export const emisionMasivaValidator = async (
  input: EmisionMasivaInputProps,
): Promise<Array<string>> => {
  try {
    const resp = []
    if (isEmptyValue(input.archivo)) resp.push('Debe adjuntar su archivo *.csv')
    return resp
  } catch (e: any) {
    return [e.message]
  }
}

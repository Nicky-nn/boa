import {
  EmisionMasivaApiInputProps,
  EmisionMasivaInputProps,
} from '../interfaces/emisionMasiva.interface'

/**
 * Componemos el input a valores que acepta el servicio
 * @param input
 */
export const EmisionMasivaRegistroComposeService = (
  input: EmisionMasivaInputProps,
): { input: EmisionMasivaApiInputProps; archivo: File } => {
  return {
    input: {
      gestion: input.gestion.key,
      mes: input.mes.key,
    },
    archivo: input.archivo,
  }
}

import { genReplaceEmpty } from '../../../utils/helper'
import {
  AlicuotaApiInputProps,
  AlicuotaInputProp,
} from '../interfaces/alicuota.interface'

export const proveedorActualizarComposeService = (
  input: AlicuotaInputProp,
): AlicuotaApiInputProps => {
  return <any>{
    subPartidaArancelaria: genReplaceEmpty(input.subPartidaArancelaria, ''),
    descripcion: genReplaceEmpty(input.descripcion, ''),
    alicuotaEspecifica: genReplaceEmpty(input.alicuotaEspecifica, ''),
    alicuotaPorcentual: genReplaceEmpty(input.alicuotaPorcentual, ''),
  }
}

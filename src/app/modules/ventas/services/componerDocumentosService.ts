import { apiEstado } from '../../../interfaces'
import { EmisionPaquetesProps } from '../interfaces/emisionPaquetes.interface'

/**
 * @description Componemos la respuesta api, para exponer los datos
 * @param data
 */
export const componerDocumentosService = (
  data: EmisionPaquetesProps[],
): EmisionPaquetesProps[] => {
  const composeData = []
  for (const item of data) {
    const paquetes = {
      numeroPaquetes: item.numeroPaquetes,
      eliminados: item.paquetes.filter((p) => p.state === apiEstado.eliminado).length,
      pendientes: item.paquetes.filter((p) => p.state === apiEstado.pendiente).length,
      rechazados: item.paquetes.filter((p) =>
        [apiEstado.rechazado, apiEstado.observado].includes(p.state),
      ).length,
      validados: item.paquetes.filter((p) => p.state === apiEstado.validada).length,
    }
    composeData.push({
      ...item,
      estados: paquetes,
    })
  }
  return composeData
}

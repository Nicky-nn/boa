export interface EmisionPaquetesProps {
  codigoPuntoVenta: number
  codigoSucursal: number
  createdAt: string
  estado: string
  grupo: string
  numeroPaquetes: number
  paquetes: {
    archivos: {
      codigo: number
      descripcion: string
      factura: string
      numero: number
    }[]
    codigoEstado: number
    codigoRecepcion: string
    errores: string[]
    nroFacturas: number
    nroPaquete: number
    state: string
  }[]
  estados?: {
    numeroPaquetes: number
    eliminados: number
    pendientes: number
    rechazados: number
    validados: number
  }
  state: string
  updatedAt: string
  usucre: string
  usumod: string
}

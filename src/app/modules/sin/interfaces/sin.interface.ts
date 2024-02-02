export interface SinUnidadMedidaProps {
  codigoClasificador: number
  descripcion: string
}

export interface subPartidaArancelariaProps {
  subPartidaArancelaria: string
  descripcion: string
  alicuotaPorcentual: number
  alicuotaEspecifica: number
}

export interface SinTipoDocumentoSectorProps {
  codigoClasificador: number
  descripcion: string
}

export interface SinTipoDocumentoIdentidadProps {
  codigoClasificador: number
  descripcion: string
}

export interface SinTipoMetodoPagoProps {
  codigoClasificador: number
  descripcion: string
}

export interface SinMotivoAnulacionProps {
  codigoClasificador: number
  descripcion: string
}

export interface SinTipoMonedaProps {
  codigoClasificador: number
  descripcion: string
}

export interface SinTipoPuntoVentaProps {
  codigoClasificador: number
  descripcion: string
}

export interface SinTipoEmisionProps {
  codigoClasificador: number
  descripcion: string
}

export interface SinTipoFacturaProps {
  codigoClasificador: number
  descripcion: string
}

export interface SinActividadesEconomicasProps {
  codigoActividad: string
  codigoCaeb: string
  descripcion: string
  tipoActividad: string
}

export interface SinActividadesProps {
  codigoCaeb: string
  codigoActividad: string
  descripcion: string
  tipoActividad: string
  codigoDocumentoSector: number
  tipoDocumentoSector: string
  actividadEconomica: string
}
export interface codigoProductoSinProps {
  codigoProducto: string
  descripcionProducto: string
}

export interface SinActividadesPorDocumentoSector {
  codigoActividad: string
  codigoCaeb: string
  codigoDocumentoSector: number
  tipoDocumentoSector: string
  actividadEconomica: string
  tipoActividad: string
}
export interface SinActividadesDocumentoSectorProps {
  codigoActividad: string
  codigoDocumentoSector: number
  tipoDocumentoSector: string
  actividadEconomica: string
  tipoActividad: string
  codigoCaeb: string
  descripcion: string
}

export interface SinProductoServicioProps {
  codigoActividad: string
  codigoProducto: string
  descripcionProducto: string
}

export interface SinProductoServicioPorDocumentoSectorProps {
  codigoActividad: string
  codigoProducto: string
  descripcionProducto: string
}

export interface SinProductoServicioPorActividadProps {
  codigoActividad: string
  codigoProducto: string
  descripcionProducto: string
  codigoClasificador: string
  descripcion: string
}

export interface MontoProps {
  monto: number
  moneda: SinTipoMonedaProps
  tipoCambio: number
}

export interface SinCufdProps {
  codigo: string
  codigoControl: string
  direccion: string
  fechaInicial: string
  fechaVigencia: string
}

export interface SinCuisProps {
  codigo: string
  fechaVigencia: string
}


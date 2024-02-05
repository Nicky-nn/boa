import { number, object, setLocale, string } from 'yup'
import { es } from 'yup-locales'

setLocale(es)

export const proveedorRegistroValidationSchema = object({
  subPartidaArancelaria: string().required('Subpartida arancelaria requerida'),
  descripcion: string().required('Descripción requerida'),
  alicuotaPorcentual: string().required('Alicuota porcentual requerida'),
  alicuotaEspecifica: string().required('Alicuota especifica requerida'),
})
export const iataAirRegistroValidationSchema = object({
  codigoIataLineaAerea: number().required('Código IATA Linea Aerea requerido'),
  codigoIata: string().required('Código IATA requerido'),
  descripcion: string().required('Descripción requerida'),
})
export const agenciaRegistroValidationSchema = object({
  codigoIataAgenteViajes: number().required('Código IATA Agente Viajes requerido'),
  nitAgenteViajes: number().min(13, 'NIT debe maximo 13 caracteres'),
  descripcion: string().required('Descripción requerida'),
})
export const origenRegistroValidationSchema = object({
  codigoOrigenServicio: string().required('Código Origen Servicio requerido'),
  descripcion: string().required('Descripción requerida'),
})
export const tipoRegistroValidationSchema = object({
  codigoTipoTransaccion: string().required('Código Tipo Transacción requerido'),
  descripcion: string().required('Descripción requerida'),
})


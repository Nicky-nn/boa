import { array, number, object, string } from 'yup'

export const VentaRegistroValidator = object({
  actividadEconomica: object({
    codigoActividad: string().required(),
  }),
  tipoCliente: string().required(),
  cliente: object({
    codigoCliente: string().required( 'El código de cliente es requerido'),
  })
    .nullable()
    .required(),
  emailCliente: string().email().nullable().required(),
  codigoIataAgenteViajes: string().nullable(),
  codigoIataLineaAerea: string()
    .required('El código IATA debe tener 3 caracteres')
    .min(3)
    .max(3),
  codigoMoneda: string().required('El código de moneda es requerido'),
  codigoOrigenServicio: string().required('El código de origen de servicio es requerido'),
  codigoTipoTransaccion: string().required(
    'El código de tipo de transacción es requerido',
  ),
  fechaEmision: string().required('La fecha de emisión es requerida'),
  montoSujetoIva: number().required('El monto sujeto a IVA es requerido'),
  montoTarifa: number().required('El monto de la tarifa es requerido'),
  montoTotal: number().required('El monto total es requerido'),
  nitAgenteViajes: string().nullable(),
  nombrePasajero: string().required('El nombre del pasajero es requerido'),
  numeroDocumentoPasajero: string().nullable(),
  numeroFactura: string().required('El número de factura es requerido'),
  tipoCambio: number().required('El tipo de cambio es requerido'),
})


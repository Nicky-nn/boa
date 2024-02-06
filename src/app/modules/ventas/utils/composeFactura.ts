import { array, number, object, setLocale, string } from 'yup'
import { es } from 'yup-locales'

import { genReplaceEmpty } from '../../../utils/helper'
import { genRound } from '../../../utils/utils'
import { FacturaInputProps } from '../interfaces/factura'

const calculoMonedaBs = (monto: number, tipoCambioBs: number): number => {
  try {
    return genRound(monto * tipoCambioBs)
  } catch (e) {
    return monto
  }
}

export const composeFactura = (fcv: FacturaInputProps): any => {
  const input = {
    numeroFactura: fcv.numeroFactura,
    fechaEmision: fcv.fechaEmision,
    cliente: {
      codigoCliente: fcv.cliente!.codigoCliente,
      razonSocial: fcv.cliente!.razonSocial,
      numeroDocumento: fcv.cliente!.numeroDocumento,
      complemento: fcv.cliente!.complemento,
      codigoTipoDocumentoIdentidad: Number(
        fcv.cliente!.tipoDocumentoIdentidad.codigoClasificador,
      ),
      email: fcv.cliente!.email,
    },
    actividadEconomica: fcv.actividadEconomica.codigoActividad,
    codigoMetodoPago: fcv.codigoMetodoPago.codigoClasificador,
    codigoMoneda: fcv.moneda!.codigo,
    tipoCambio: fcv.moneda!.tipoCambio,
    nombrePasajero: fcv.nombrePasajero,
    numeroDocumentoPasajero: fcv.numeroDocumentoPasajero,
    codigoIataLineaAerea: Number(fcv.codigoIataLineaAerea),
    codigoIataAgenteViajes: fcv.codigoIataAgenteViajes || null,
    nitAgenteViajes: fcv.nitAgenteViajes || null,
    codigoOrigenServicio: fcv.codigoOrigenServicio,
    montoTarifa: fcv.montoTarifa,
    montoSujetoIva: fcv.montoSujetoIva,
    montoTotal: fcv.montoTotal,
    codigoTipoTransaccion: fcv.codigoTipoTransaccion,
    usuario: fcv.usuario,
  }
  if (fcv.codigoMetodoPago.codigoClasificador === 2) {
    return { ...input, numeroTarjeta: fcv.numeroTarjeta }
  }
  // return { input, notificacion }
  return [input]
}
export const composeFacturaValidator = async (fcv: any): Promise<boolean> => {
  setLocale(es)
  const schema = object({
    numeroFactura: string().required(),
    fechaEmision: string().required(),
    cliente: object({
      codigoCliente: string().required(),
      razonSocial: string().required(),
      numeroDocumento: string().required(),
      complemento: string().required(),
      codigoTipoDocumentoIdentidad: number().required(),
      email: string().email().required(),
    }).required(),
    actividadEconomica: object({
      codigoActividad: string().required(),
    }).required(),
    codigoMetodoPago: object({
      codigoClasificador: string().required(),
    }).required(),
    moneda: object({
      codigo: string().required(),
      tipoCambio: number().required(),
    }).required(),
    nombrePasajero: string().required(),
    numeroDocumentoPasajero: string().required(),
    codigoIataLineaAerea: string().required(),
    codigoIataAgenteViajes: string().required(),
    nitAgenteViajes: string().required(),
    codigoOrigenServicio: string().required(),
    montoTarifa: number().required(),
    montoSujetoIva: number().required(),
    montoTotal: number().required(),
    codigoTipoTransaccion: string().required(),
  })

  try {
    await schema.validate(fcv, { abortEarly: false })
    return true
  } catch (error: any) {
    console.error('Errores de validación:', error.errors)
    return true
  }
}


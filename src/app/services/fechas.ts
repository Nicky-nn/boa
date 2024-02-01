import { parse } from 'date-fns'

import { BoaPeriodoProps } from '../modules/ventas/interfaces/boa.interface'

export interface DateListAnioProps {
  key: number
  value: string
}

/**
 * Obtenemos los años según la fecha actual
 */
export const getDateListAnios = (): DateListAnioProps[] => {
  const gestion = new Date().getFullYear()
  return [
    {
      key: gestion - 1,
      value: (gestion - 1).toString(),
    },
    {
      key: gestion,
      value: gestion.toString(),
    },
  ]
}

/**
 * @description gestion Actual
 * @param date
 */
export const getDateListAnio = (date: Date): DateListAnioProps => {
  const gestion = date.getFullYear()
  const mes = date.getMonth() + 1
  if (mes === 1) return getDateListAnios().find((a) => a.key === gestion - 1)!
  return getDateListAnios().find((a) => a.key === gestion)!
}

export interface DateListMesProps {
  key: number
  value: string
}

/**
 * @description Obtiene lista de meses
 */
export const getDateListMeses = (): DateListMesProps[] => [
  { key: 1, value: '01 - Enero' },
  {
    key: 2,
    value: '02 - Febrero',
  },
  { key: 3, value: '03 - Marzo' },
  { key: 4, value: '04 - Abril' },
  { key: 5, value: '05 - Mayo' },
  {
    key: 6,
    value: '06 - Junio',
  },
  { key: 7, value: '07 - Julio' },
  { key: 8, value: '08 - Agosto' },
  { key: 9, value: '09 - Septiembre' },
  {
    key: 10,
    value: '10 - Octubre',
  },
  { key: 11, value: '11 - Noviembre' },
  { key: 12, value: '12 - Diciembre' },
]

/**
 * @description Obtenemos objeto mes
 * @param date
 */
export const getDateListMes = (date: Date): DateListMesProps => {
  const mes = date.getMonth() + 1
  return getDateListMeses().find((d) => d.key === mes)!
}

export interface DateListDiaProps {
  key: number
  value: string
}

/**
 *
 * @param year
 * @param month
 */
export const getDateListDias = (year: number, month: number): DateListDiaProps[] => {
  const weekday = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo',
  ]
  const days = new Date(year, month, 0).getDate()
  const response = []
  for (let i = 0; i < days; i++) {
    response.push({
      key: i + 1,
      value: `${i + 1} - ${weekday[new Date(year, month, i).getDay()]}`,
    })
  }

  return response
}
/**
 * @description Obtenemos objeto mes
 * @param date
 */
export const getDateListDia = (date: Date): DateListDiaProps => {
  const dia = date.getDate()
  const mes = date.getMonth() + 1
  const gestion = date.getFullYear()
  return getDateListDias(gestion, mes).find((d) => d.key === dia)!
}

/**
 * @description Obtenemos el periodo en formato BoaPeriodoProps
 * @param periodo
 */
export const getPeriodoToBoaPeriodo = (periodo: string): BoaPeriodoProps => {
  try {
    const fechaPeriodo = parse(periodo, 'yyyyMMdd', new Date())
    return {
      gestion: getDateListAnio(fechaPeriodo),
      mes: getDateListMes(fechaPeriodo),
      dia: getDateListDia(fechaPeriodo),
    }
  } catch (e: any) {
    throw new Error(`No se ha podido decodificar el periodo en fecha: ${e.message} `)
  }
}

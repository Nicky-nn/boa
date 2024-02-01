import {
  DateListAnioProps,
  DateListDiaProps,
  DateListMesProps,
} from '../../../services/fechas'

export interface EmisionMasivaProps {
  archivos: {
    fila: number
    cuf: string
    errores: string[]
    numeroFactura: string
  }[]
  estado: string
}

export interface EmisionMasivaInputProps {
  gestion: DateListAnioProps
  mes: DateListMesProps
  dia?: DateListDiaProps | null
  archivo: any
  action: 'REGISTER' | 'UPDATE'
}

export interface EmisionMasivaApiInputProps {
  dia?: number
  gestion: number
  mes: number
}

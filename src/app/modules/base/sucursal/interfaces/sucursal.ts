import { ActionFormProps } from '../../../../interfaces'

export interface DepartamentoProps {
  codigo: number
  codigoPais: number
  departamento: string
  sigla: string
}

export interface SucursalProps {
  _id: string
  codigo: number
  departamento: DepartamentoProps
  direccion: string
  municipio: string
  telefono: string
  state: string
  usucre: string
  usumod: string
  createdAt: string
  updatedAt: string
}

export interface SucursalInputProps {
  codigo: number
  direccion: string
  telefono: string
  departamento: DepartamentoProps | null
  municipio: string
  action: ActionFormProps
}

export interface SucursalInputApiProps {
  codigo: number
  direccion: string
  telefono: string
  departamento: number
  municipio: string
}

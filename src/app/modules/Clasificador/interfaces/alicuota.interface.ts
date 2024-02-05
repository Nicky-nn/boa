export interface AlicuotaProps {
  subPartidaArancelaria: string
  descripcion: string
  alicuotaPorcentual: number
  alicuotaEspecifica: number
  state: string
  createdAt: string
  updatedAt?: string
  usucre: string
  usumod?: string
}

export interface BoletoIataAereoProps {
  codigoIataLineaAerea: number
  descripcion: string
  codigoIata: string
}
export interface AgenciaDeViajesProps {
  codigoIataAgenteViajes: string
  descripcion: string
  nitAgenteViajes: string
}
export interface OrigenProps {
  codigoOrigenServicio: string
  descripcion: string
}
export interface TipoProps {
  codigoTipoTransaccion: string
  descripcion: string
}

export interface AlicuotaInputProp {
  subPartidaArancelaria: string
  descripcion: string
  alicuotaPorcentual: number
  alicuotaEspecifica: number
}
export interface BoletoIataAereoInputProp {
  codigoIataLineaAerea: number
  descripcion: string
  codigoIata: string
}
export interface AgenciaDeViajesInputProp {
  codigoIataAgenteViajes: string
  descripcion: string
  nitAgenteViajes: string
}
export interface OrigenInputProp {
  codigoOrigenServicio: string
  descripcion: string
}
export interface TipoInputProp {
  codigoTipoTransaccion: string
  descripcion: string
}

export interface AlicuotaActualizarInputProp {
  descripcion: string
  alicuotaPorcentual: number
  alicuotaEspecifica: number
}

export const ALICUOTA_INITIAL_VALUES: AlicuotaInputProp = {
  subPartidaArancelaria: '',
  descripcion: '',
  alicuotaPorcentual: 0,
  alicuotaEspecifica: 0,
}
export const IATA_AER_INITIAL_VALUES: BoletoIataAereoInputProp = {
  codigoIata: '',
  descripcion: '',
  codigoIataLineaAerea: 0,
}
export const AGENCIA_INITIAL_VALUES: AgenciaDeViajesInputProp = {
  codigoIataAgenteViajes: '',
  descripcion: '',
  nitAgenteViajes: '',
}
export const ORIGEN_INITIAL_VALUES: OrigenInputProp = {
  codigoOrigenServicio: '',
  descripcion: '',
}
export const TIPO_INITIAL_VALUES: TipoInputProp = {
  codigoTipoTransaccion: '',
  descripcion: '',
}
export interface AlicuotaApiInputProps {
  subPartidaArancelaria: string
  descripcion: string
  alicuotaPorcentual: number
  alicuotaEspecifica: number
}


// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'

const boaIataAerolineaEliminar = gql`
  mutation ELIMINAR($codigoIataLineaAerea: Int!) {
    boaIataAerolineaEliminar(codigoIataLineaAerea: $codigoIataLineaAerea)
  }
`
const boaAgenciaViajesEliminar = gql`
  mutation ELIMINAR($codigoIataAgenteViajes: String!) {
    boaAgenciaViajesEliminar(codigoIataAgenteViajes: $codigoIataAgenteViajes)
  }
`

const boaOrigenServicioEliminar = gql`
  mutation ELIMINAR($codigoOrigenServicio: String!) {
    boaOrigenServicioEliminar(codigoOrigenServicio: $codigoOrigenServicio)
  }
`


const boaTipoTransaccionEliminar = gql`
  mutation ELIMINAR($codigoTipoTransaccion: String!) {
    boaTipoTransaccionEliminar(codigoTipoTransaccion: $codigoTipoTransaccion)
  }
`



export const iataAerolineaEliminar = async (
  codigoIataLineaAerea: number,
): Promise<boolean> => {
  // convertir a number
  codigoIataLineaAerea = Number(codigoIataLineaAerea)
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(boaIataAerolineaEliminar, { codigoIataLineaAerea })
  return data.boaIataAerolineaEliminar
}




export const AgenciaViajesEliminar = async (
  codigoIataAgenteViajes: string,
): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(boaAgenciaViajesEliminar, { codigoIataAgenteViajes })
  return data.boaAgenciaViajesEliminar
}


export const OrigenServicioEliminar = async (
  codigoOrigenServicio: string,
): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(boaOrigenServicioEliminar, { codigoOrigenServicio })
  return data.boaOrigenServicioEliminar
}


export const TipoTransaccionEliminar = async (
  codigoTipoTransaccion: string,
): Promise<boolean> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)
  const data: any = await client.request(boaTipoTransaccionEliminar, { codigoTipoTransaccion })
  return data.boaTipoTransaccionEliminar
}

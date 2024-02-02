// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { PageInfoProps, PageProps } from '../../../interfaces'
import { FacturaBoaProps } from '../interfaces/boa.interface'

/**
 * Respuesta de productos
 */
export interface ApiFacturaResponse {
  docs: Array<FacturaBoaProps>
  pageInfo: PageInfoProps
}

const query = gql`
  query boaIataAerolineaListado {
    boaIataAerolineaListado {
      codigoIataLineaAerea
      codigoIata
      descripcion
    }
  }
`

const listadoAgente = gql`
  query boaAgenciaViajesListado {
    boaAgenciaViajesListado {
      codigoIataAgenteViajes
      nitAgenteViajes
      descripcion
    }
  }
`
const boaOrigenServicio = gql`
  query LISTADO {
    boaOrigenServicioListado {
      codigoOrigenServicio
      descripcion
    }
  }
`

const boaTipoTransaccion = gql`
  query LISTADO {
    boaTipoTransaccionListado {
      codigoTipoTransaccion
      descripcion
    }
  }
`

export const boaIataAerolineaListado = async (): Promise<any> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query)
  return data.boaIataAerolineaListado
}

export const boaAgenciaViajesListado = async (): Promise<any> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(listadoAgente)
  return data.boaAgenciaViajesListado
}

export const boaOrigenServicioListado = async (): Promise<any> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(boaOrigenServicio)
  return data.boaOrigenServicioListado
}

export const boaTipoTransaccionListado = async (): Promise<any> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(boaTipoTransaccion)
  return data.boaTipoTransaccionListado
}


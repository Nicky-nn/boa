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
  query LISTADO($limit: Int!, $reverse: Boolean, $page: Int!, $query: String) {
    facturasBoletosAereos(limit: $limit, reverse: $reverse, page: $page, query: $query) {
      pageInfo {
        hasNextPage
        hasPrevPage
        limit
        page
        totalDocs
      }
      docs {
        _id
        tipoFactura {
          codigoClasificador
          descripcion
        }
        actividadEconomica {
          codigoCaeb
          descripcion
          tipoActividad
        }
        tipoEmision {
          codigoClasificador
          descripcion
        }
        nitEmisor
        numeroFactura
        cuis {
          codigo
          fechaVigencia
        }
        cufd {
          codigo
          codigoControl
          direccion
          fechaVigencia
          fechaInicial
        }
        cuf
        sucursal {
          codigo
          direccion
          municipio
          departamento {
            codigo
            codigoPais
            sigla
            departamento
          }
        }
        puntoVenta {
          codigo
          tipoPuntoVenta {
            codigoClasificador
            descripcion
          }
          nombre
          descripcion
        }
        fechaEmision
        razonSocialEmisor
        cliente {
          razonSocial
          codigoCliente
          tipoDocumentoIdentidad {
            codigoClasificador
            descripcion
          }
          numeroDocumento
          complemento
          nombres
          apellidos
          email
        }
        codigoIataAgenteViajes
        nombrePasajero
        numeroDocumentoPasajero
        codigoIataLineaAerea
        nitAgenteViajes
        codigoOrigenServicio
        moneda {
          codigoClasificador
          descripcion
        }
        tipoCambio
        montoTarifa
        otrosMontos {
          campo
          valor
        }
        montoTotal
        montoTotalMoneda
        montoTotalSujetoIva
        codigoTipoTransaccion
        metodoPago {
          codigoClasificador
          descripcion
        }
        montoTotalLiteral
        leyenda
        subLeyenda
        usuario
        motivoAnulacion {
          codigoClasificador
          descripcion
        }
        codigoRecepcion
        representacionGrafica {
          xml
          sin
        }
        usucre
        usumod
        createdAt
        updatedAt
        state
      }
    }
  }
`

export const apiFacturaListado = async (
  pageInfo: PageProps,
): Promise<ApiFacturaResponse> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(query, { ...pageInfo })
  return data.facturasBoletosAereos
}

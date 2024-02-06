// noinspection GraphQLUnresolvedReference

import { gql, GraphQLClient } from 'graphql-request'

import { AccessToken } from '../../../base/models/paramsModel'
import { ClasificadorProps } from '../../../interfaces'
import { SinActividadesProps } from '../../sin/interfaces/sin.interface'

export interface FacturaProps {
  facturaBoletoAereoRegistro: FacturaProps
  sinTipoMetodoPago: ClasificadorProps[]
  sinUnidadMedida: ClasificadorProps[]
  sinActividades: SinActividadesProps[]
}

const genDetalle = () => {}

export const FCV_ONLINE = gql`
  mutation FCV_ONLINE($input: [FacturaBoletoAereoInput]!) {
    facturaBoletoAereoRegistro(input: $input) {
      estado
      archivos{
        id
        fila
        cuf
        numeroFactura
        errores
      }
    }
  }
`

export const fetchFacturaCreate = async (input: any): Promise<FacturaProps> => {
  const client = new GraphQLClient(import.meta.env.ISI_API_URL)
  const token = localStorage.getItem(AccessToken)
  // Set a single header
  client.setHeader('authorization', `Bearer ${token}`)

  const data: any = await client.request(FCV_ONLINE, { input })

  if(data.facturaBoletoAereoRegistro.estado === 'OBSERVADO') {
    console.error(data.facturaBoletoAereoRegistro.archivos[0].errores)
    throw new Error(data.facturaBoletoAereoRegistro.archivos[0].errores)
  }

  return data.facturaBoletoAereoRegistro
}


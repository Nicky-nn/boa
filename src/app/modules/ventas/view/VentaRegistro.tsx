import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Grid } from '@mui/material'
import { Box, padding } from '@mui/system'
import { UseFormReturn, useForm } from 'react-hook-form'

import AlertLoading from '../../../base/components/Alert/AlertLoading'
import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import SimpleCard from '../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../base/hooks/useAuth'
// import usePlantillaDetalleExtra from '../../base/detalleExtra/hook/usePlantillaDetalleExtra'
import { FacturaInitialValues, FacturaInputProps } from '../interfaces/factura'
import { VentaRegistroValidator } from '../validator/ventaRegistroValidator'
import DatosActividadEconomica from './emision/DatosActividadEconomica'
import { DatosTransaccionComercial } from './emision/DatosTransaccionComercial'
import { DetalleTransaccionComercial } from './emision/DetalleTransaccionComercial'
import FacturaDetalleExtra from './emision/FacturaDetalleExtra'
import MetodosPago from './emision/MetodosPago'
import VentaTotales from './emision/VentaTotales'
import DatosCliente from './emision/DatosCliente'

const VentaRegistro = () => {
  const { user } = useAuth()

  const form = useForm<FacturaInputProps>({
    defaultValues: {
      ...FacturaInitialValues,
    },
    // @ts-ignore
    resolver: yupResolver(VentaRegistroValidator),
  })

  // const { pdeLoading, plantillaDetalleExtra } = usePlantillaDetalleExtra()

  return (
    <SimpleContainer>
      <div className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: 'Emisión', path: '/ventas/emision' },
            { name: 'Registrar Emisión' },
          ]}
        />
      </div>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <DatosActividadEconomica
              form={form as unknown as UseFormReturn<FacturaInputProps>}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12}>
            {/* <DetalleTransaccionComercial form={form} periodoDate={''} /> */}
          </Grid>
          {/* <Grid item lg={12} md={12} xs={12}>
            {pdeLoading ? (
              <AlertLoading mensaje={'Cargando...'} />
            ) : (
              <FacturaDetalleExtra form={form} detalleExtra={plantillaDetalleExtra} />
            )}
          </Grid> */}
          <Grid item lg={7} md={12} xs={12}>
            <div style={{ padding: '20px 0' }}>
              <SimpleCard title={'Cliente / Alumno / Método de pago'}>
                <DatosTransaccionComercial
                  form={form as unknown as UseFormReturn<FacturaInputProps>}
                  user={user}
                />
                <Divider />
                <MetodosPago form={form as unknown as UseFormReturn<FacturaInputProps>} />
              </SimpleCard>
            </div>
          </Grid>

          <Grid item lg={5} md={12} xs={12}>
            <div style={{ padding: '20px 0' }}>{/* <VentaTotales form={form} /> */}</div>
          </Grid>
        </Grid>
      </form>
      <Box py="12px" />
    </SimpleContainer>
  )
}

export default VentaRegistro


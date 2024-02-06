import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Grid } from '@mui/material'
import { Box, Container, padding } from '@mui/system'
import { UseFormReturn, useForm } from 'react-hook-form'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import useAuth from '../../../base/hooks/useAuth'
// import usePlantillaDetalleExtra from '../../base/detalleExtra/hook/usePlantillaDetalleExtra'
import { FacturaInitialValues, FacturaInputProps } from '../interfaces/factura'
import { VentaRegistroValidator } from '../validator/ventaRegistroValidator'
import DatosActividadEconomica from './emision/DatosActividadEconomica'
import VentaTotales from './emision/VentaTotales'

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
    <Container maxWidth="xl">
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
              <div style={{ padding: '20px 0' }}>
                <VentaTotales
                  form={form as unknown as UseFormReturn<FacturaInputProps>}
                />
              </div>
            </Grid>
          </Grid>
        </form>
        <Box py="12px" />
      </SimpleContainer>
    </Container>
  )
}

export default VentaRegistro


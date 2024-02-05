import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext } from 'react'

import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import AuthContext from '../../../base/contexts/JWTAuthContext'
import OrigenListado from '../components/OrigenListado'

const Origen = () => {
  const { user } = useContext(AuthContext)
  // in this case *props are stored in the state of parent component

  return (
    <>
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb
            routeSegments={[
              { name: 'Clasificador', path: productosRouteMap.gestion },
              { name: 'Origen de Servicios' },
            ]}
          />
        </div>
        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <OrigenListado />
          </Grid>
        </Grid>
        <Box py="12px" />
      </SimpleContainer>
    </>
  )
}

export default Origen

export const productosRouteMap = {
  gestion: '/clasificador',
  nuevo: '/productos/nuevo',
  modificar: `/productos/modificar`,
}


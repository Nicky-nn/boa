import { Grid, InputAdornment, TextField } from '@mui/material'
import { FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import { AgenciaDeViajesInputProp } from '../interfaces/alicuota.interface'

interface OwnProps {
  formik: FormikProps<AgenciaDeViajesInputProp>
}

type Props = OwnProps

const AgenciaDeViajesForm: FunctionComponent<Props> = (props) => {
  const { formik } = props
  return (
    <>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <TextField
              name="codigoIataAgenteViajes"
              label="Código IATA Agente de Viajes"
              size="small"
              fullWidth
              value={formik.values.codigoIataAgenteViajes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.codigoIataAgenteViajes &&
                Boolean(formik.errors.codigoIataAgenteViajes)
              }
              helperText={
                formik.touched.codigoIataAgenteViajes &&
                formik.errors.codigoIataAgenteViajes
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <TextField
              name="nitAgenteViajes"
              label="NIT Agente de Viajes"
              size="small"
              fullWidth
              value={formik.values.nitAgenteViajes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.nitAgenteViajes && Boolean(formik.errors.nitAgenteViajes)
              }
              helperText={formik.touched.nitAgenteViajes && formik.errors.nitAgenteViajes}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={8}>
            <TextField
              name="descripcion"
              label="Descripción"
              size="small"
              fullWidth
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
              helperText={formik.touched.descripcion && formik.errors.descripcion}
            />
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default AgenciaDeViajesForm


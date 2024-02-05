import { Grid, InputAdornment, TextField } from '@mui/material'
import { FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import { OrigenInputProp } from '../interfaces/alicuota.interface'

interface OwnProps {
  formik: FormikProps<OrigenInputProp>
}

type Props = OwnProps

const OrigenForm: FunctionComponent<Props> = (props) => {
  const { formik } = props
  return (
    <>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={12}>
            <TextField
              name="codigoOrigenServicio"
              label="Código Origen de Servicio"
              size="small"
              fullWidth
              value={formik.values.codigoOrigenServicio}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.codigoOrigenServicio &&
                Boolean(formik.errors.codigoOrigenServicio)
              }
              helperText={
                formik.touched.codigoOrigenServicio &&
                formik.errors.codigoOrigenServicio
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={12}>
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

export default OrigenForm


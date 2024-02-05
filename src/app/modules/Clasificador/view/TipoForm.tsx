import { Grid, InputAdornment, TextField } from '@mui/material'
import { FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'
import { TipoInputProp } from '../interfaces/alicuota.interface'

interface OwnProps {
  formik: FormikProps<TipoInputProp>
}

type Props = OwnProps

const TipoForm: FunctionComponent<Props> = (props) => {
  const { formik } = props
  return (
    <>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={12}>
            <TextField
              name="codigoTipoTransaccion"
              label="Código Tipo Transacción"
              size="small"
              fullWidth
              value={formik.values.codigoTipoTransaccion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.codigoTipoTransaccion &&
                Boolean(formik.errors.codigoTipoTransaccion)
              }
              helperText={
                formik.touched.codigoTipoTransaccion &&
                formik.errors.codigoTipoTransaccion
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

export default TipoForm


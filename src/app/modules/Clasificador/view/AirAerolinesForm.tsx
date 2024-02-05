import { Grid, InputAdornment, TextField } from '@mui/material'
import { FormikProps } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'

import { AlicuotaInputProp, BoletoIataAereoInputProp } from '../interfaces/alicuota.interface'

interface OwnProps {
  formik: FormikProps<BoletoIataAereoInputProp>
}

type Props = OwnProps

const ProveedorForm: FunctionComponent<Props> = (props) => {
  const { formik } = props
  useEffect(() => {
    if (!formik.values.codigoIataLineaAerea) {
      const randomNumber = Math.floor(Math.random() * 1000); // Puedes ajustar el rango según tus necesidades
      let aux = randomNumber;
      formik.setFieldValue('codigoIataLineaAerea', aux);

    }
  }, [formik.values.codigoIataLineaAerea]);
  return (
    <>
      <form noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <TextField
              name="codigoIataLineaAerea"
              label="Código IATA Línea Aérea"
              size="small"
              fullWidth
              value={formik.values.codigoIataLineaAerea}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.codigoIataLineaAerea &&
                Boolean(formik.errors.codigoIataLineaAerea)
              }
              helperText={
                formik.touched.codigoIataLineaAerea &&
                formik.errors.codigoIataLineaAerea
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <TextField
              name="codigoIata"
              label="Código IATA"
              size="small"
              fullWidth
              value={formik.values.codigoIata}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.codigoIata && Boolean(formik.errors.codigoIata)}
              helperText={formik.touched.codigoIata && formik.errors.codigoIata}
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

export default ProveedorForm

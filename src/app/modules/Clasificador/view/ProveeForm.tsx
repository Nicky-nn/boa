import { Grid, TextField } from '@mui/material'
import React, { FunctionComponent } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import { AlicuotaInputProp } from '../interfaces/alicuota.interface'

interface OwnProps {
  form: UseFormReturn<AlicuotaInputProp>
  onSubmit: (data: AlicuotaInputProp) => void
}

type Props = OwnProps

const ProveedorForm: FunctionComponent<Props> = ({ form, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8} lg={8}>
          <TextField
            {...register('subPartidaArancelaria')}
            name="subPartidaArancelaria"
            label="Sub Partida Arancelaria"
            size="small"
            fullWidth
            error={!!errors.subPartidaArancelaria}
            helperText={
              errors.subPartidaArancelaria ? errors.subPartidaArancelaria.message : ''
            }
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            {...register('alicuotaEspecifica')}
            name="alicuotaEspecifica"
            label="Alicuota Específica"
            size="small"
            fullWidth
            error={!!errors.alicuotaEspecifica}
            helperText={
              errors.alicuotaEspecifica ? errors.alicuotaEspecifica.message : ''
            }
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            {...register('alicuotaPorcentual')}
            name="alicuotaPorcentual"
            label="Alicuota Porcentual"
            size="small"
            fullWidth
            error={!!errors.alicuotaPorcentual}
            helperText={
              errors.alicuotaPorcentual ? errors.alicuotaPorcentual.message : ''
            }
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <TextField
            {...register('descripcion')}
            name="descripcion"
            label="Descripción"
            size="small"
            fullWidth
            error={!!errors.descripcion}
            helperText={errors.descripcion ? errors.descripcion.message : ''}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default ProveedorForm

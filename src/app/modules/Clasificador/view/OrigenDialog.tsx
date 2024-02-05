import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'

import { genRandomString } from '../../../utils/helper'
import { notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiProveedorRegistro } from '../api/XproveedorRegistro.api'
import {
  AGENCIA_INITIAL_VALUES,
  ALICUOTA_INITIAL_VALUES,
  AgenciaDeViajesInputProp,
  AgenciaDeViajesProps,
  AlicuotaInputProp,
  AlicuotaProps,
  BoletoIataAereoInputProp,
  IATA_AER_INITIAL_VALUES,
  ORIGEN_INITIAL_VALUES,
  OrigenInputProp,
  OrigenProps,
} from '../interfaces/alicuota.interface'
import {
  agenciaRegistroValidationSchema,
  iataAirRegistroValidationSchema,
  origenRegistroValidationSchema,
  proveedorRegistroValidationSchema,
} from '../validator/proveedorRegistro.validator'
import ProveedorForm from './AirAerolinesForm'
import AgenciaDeViajesForm from './AgenciaDeViajesForm'
import { apiAgenciaRegistro } from '../api/agencia.api'
import { apiOrigen } from '../api/origen.api.'
import OrigenForm from './OrigenForm'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: OrigenProps) => void
}

type Props = OwnProps

const OrigenDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  const formik: FormikProps<OrigenInputProp> = useFormik<OrigenProps>({
    initialValues: ORIGEN_INITIAL_VALUES,
    validationSchema: origenRegistroValidationSchema,
    onSubmit: async (values) => {
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiOrigen(values.codigoOrigenServicio, values.descripcion).catch(
            (err) => {
              swalException(err)
              return false
            },
          )
        },
        text: 'Confirma que desea Registrar el Origen de Servicio?',
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
          // lIMPIAR FORMULARIO
          formik.resetForm()
        }
      })
    },
  })

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 500 } }}
      maxWidth="sm"
      open={open}
      {...other}
    >
      <DialogTitle>Registrar Nuevo Origen Servicios</DialogTitle>
      <DialogContent dividers>
        <OrigenForm formik={formik} />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          color={'error'}
          size={'small'}
          variant={'contained'}
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          onClick={formik.submitForm}
          size={'small'}
          style={{ marginRight: 25 }}
          variant={'contained'}
          disabled={!formik.isValid}
        >
          Registrar Alicuota
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrigenDialog


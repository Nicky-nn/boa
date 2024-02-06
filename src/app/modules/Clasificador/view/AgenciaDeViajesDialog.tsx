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
} from '../interfaces/alicuota.interface'
import {
  agenciaRegistroValidationSchema,
  iataAirRegistroValidationSchema,
  proveedorRegistroValidationSchema,
} from '../validator/proveedorRegistro.validator'
import ProveedorForm from './AirAerolinesForm'
import AgenciaDeViajesForm from './AgenciaDeViajesForm'
import { apiAgenciaRegistro } from '../api/agencia.api'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: AgenciaDeViajesProps) => void
}

type Props = OwnProps

const AgenciaDeViajesDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  const formik: FormikProps<AgenciaDeViajesInputProp> = useFormik<AgenciaDeViajesProps>({
    initialValues: AGENCIA_INITIAL_VALUES,
    validationSchema: agenciaRegistroValidationSchema,
    onSubmit: async (values) => {
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiAgenciaRegistro(
            values.codigoIataAgenteViajes,
            values.nitAgenteViajes,
            values.descripcion,
          ).catch((err) => {
            swalException(err)
            return false
          })
        },
        text: 'Confirma que desea Registrar la Agencia de Viajes?',
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
      <DialogTitle>Registrar Nueva Agencia de Viajes</DialogTitle>
      <DialogContent dividers>
        <AgenciaDeViajesForm formik={formik} />
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

export default AgenciaDeViajesDialog


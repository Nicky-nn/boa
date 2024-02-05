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
  TIPO_INITIAL_VALUES,
  TipoInputProp,
  TipoProps,
} from '../interfaces/alicuota.interface'
import {
  agenciaRegistroValidationSchema,
  iataAirRegistroValidationSchema,
  origenRegistroValidationSchema,
  proveedorRegistroValidationSchema,
  tipoRegistroValidationSchema,
} from '../validator/proveedorRegistro.validator'
import ProveedorForm from './AirAerolinesForm'
import AgenciaDeViajesForm from './AgenciaDeViajesForm'
import { apiAgenciaRegistro } from '../api/agencia.api'
import { apiOrigen } from '../api/origen.api.'
import OrigenForm from './OrigenForm'
import TipoForm from './TipoForm'
import { apiTipoTransaccion } from '../api/tipoTransaccion.api'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: TipoProps) => void
}

type Props = OwnProps

const TipoDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  const formik: FormikProps<TipoInputProp> = useFormik<TipoProps>({
    initialValues: TIPO_INITIAL_VALUES,
    validationSchema: tipoRegistroValidationSchema,
    onSubmit: async (values) => {
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiTipoTransaccion(values.codigoTipoTransaccion, values.descripcion).catch(
            (err) => {
              swalException(err)
              return false
            },
          )
        },
        text: 'Confirma que desea Registrar el Tipo de Transacción?',
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
      <DialogTitle>Registrar Nuevo Tipo de Transacción</DialogTitle>
      <DialogContent dividers>
        <TipoForm formik={formik} />
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

export default TipoDialog


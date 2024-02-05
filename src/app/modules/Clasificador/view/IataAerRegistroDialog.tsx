import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'

import { genRandomString } from '../../../utils/helper'
import { notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiProveedorRegistro } from '../api/XproveedorRegistro.api'
import {
  ALICUOTA_INITIAL_VALUES,
  AlicuotaInputProp,
  AlicuotaProps,
  BoletoIataAereoInputProp,
  IATA_AER_INITIAL_VALUES,
} from '../interfaces/alicuota.interface'
import {
  iataAirRegistroValidationSchema,
  proveedorRegistroValidationSchema,
} from '../validator/proveedorRegistro.validator'
import ProveedorForm from './AirAerolinesForm'
import { apiIataAerRegistro } from '../api/iataAer.api'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: AlicuotaProps) => void
}

type Props = OwnProps

const ProveedorRegistro: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  const formik: FormikProps<BoletoIataAereoInputProp> =
    useFormik<BoletoIataAereoInputProp>({
      initialValues: IATA_AER_INITIAL_VALUES,
      validationSchema: iataAirRegistroValidationSchema,
      onSubmit: async (values) => {
        console.log('values', values)
        await swalAsyncConfirmDialog({
          preConfirm: () => {
            return apiIataAerRegistro(
              values.codigoIataLineaAerea,
              values.codigoIata,
              values.descripcion,
            ).catch((err) => {
              swalException(err)
              return false
            })
          },
          text: 'Confirma que desea Registrar IAATA Aerolinea?',
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
      <DialogTitle>Registrar Nuevo IATA Aerolinea</DialogTitle>
      <DialogContent dividers>
        <ProveedorForm formik={formik} />
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

export default ProveedorRegistro


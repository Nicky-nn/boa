import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { FormikProps, useFormik } from 'formik'
import React, { FunctionComponent, useEffect } from 'react'

import { genRandomString } from '../../../utils/helper'
import { notSuccess } from '../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../utils/swal'
import { apiAlicuota } from '../api/alicuota.api'
import { apiProveedorActualizar } from '../api/proveedorActualizar.api'
import { apiProveedorRegistro } from '../api/XproveedorRegistro.api'
import {
  ALICUOTA_INITIAL_VALUES,
  AlicuotaInputProp,
  AlicuotaProps,
} from '../interfaces/alicuota.interface'
import { proveedorRegistroValidationSchema } from '../validator/proveedorRegistro.validator'
import ProveedorForm from './AirAerolinesForm'

interface OwnProps {
  keepMounted: boolean
  open: boolean
  codigo: string
  onClose: (value?: AlicuotaProps) => void
}

type Props = OwnProps

const ProveedorActualizar: FunctionComponent<Props> = (props) => {
  const { onClose, open, ...other } = props

  const formik: FormikProps<AlicuotaInputProp> = useFormik<AlicuotaInputProp>({
    initialValues: ALICUOTA_INITIAL_VALUES,
    validationSchema: proveedorRegistroValidationSchema,
    onSubmit: async (values) => {
      const { subPartidaArancelaria, ...valuesWithoutCodigo } = values // Excluir la propiedad 'codigo'
      valuesWithoutCodigo.alicuotaEspecifica = parseFloat(
        // @ts-ignore
        valuesWithoutCodigo.alicuotaEspecifica,
      )
      await swalAsyncConfirmDialog({
        preConfirm: () => {
          return apiProveedorActualizar(
            subPartidaArancelaria || '',
            valuesWithoutCodigo,
          ).catch((err) => {
            swalException(err)
            return false
          })
        },
        text: 'Confirma que desea actualizar Alicuota?',
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        }
      })
    },
  })

  const handleCancel = () => {
    onClose()
  }

  useEffect(() => {
    if (open) {
      const obtenerDatosProveedor = async () => {
        try {
          const datosProveedor = await apiAlicuota(props.codigo) // Reemplaza apiProveedor por la función adecuada
          formik.setValues(datosProveedor)
        } catch (error) {
          console.log(error)
        }
      }

      obtenerDatosProveedor()
    }
  }, [open])

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 500 } }}
      maxWidth="sm"
      open={open}
      {...other}
    >
      <DialogTitle>Editar Alicuota {props.codigo}</DialogTitle>
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
          Actualizar Proveedor
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProveedorActualizar

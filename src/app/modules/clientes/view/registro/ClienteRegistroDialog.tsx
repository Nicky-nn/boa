import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import {
  CLIENTE_DEFAULT_INPUT,
  ClienteInputProps,
  ClienteProps,
} from '../../interfaces/cliente'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { clienteInputValidator } from '../../validator/clienteInputValidator'
import { clienteRegistroValidator } from '../../validator/clienteRegistroValidator'
import { notError, notSuccess } from '../../../../utils/notification'
import { clienteRegistroComposeService } from '../../services/clienteRegistroComposerService'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiClienteRegistro } from '../../api/clienteRegistro.api'
import ClienteForm from '../../components/abm/ClienteForm'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: ClienteProps) => void
}

type Props = OwnProps

const ClienteRegistroDialog: FunctionComponent<Props> = (props) => {
  const { onClose, keepMounted, open, ...other } = props

  const form = useForm<ClienteInputProps>({
    defaultValues: {
      ...CLIENTE_DEFAULT_INPUT,
    },
    //@ts-ignore
    resolver: yupResolver(clienteInputValidator),
  })

  const onSubmit: SubmitHandler<ClienteInputProps> = async (values) => {
    const val = await clienteRegistroValidator(values)
    if (val.length > 0) {
      notError(val.join('<br>'))
    } else {
      const apiInput = clienteRegistroComposeService(values)
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp: any = await apiClienteRegistro(apiInput).catch((e) => ({
            error: e,
          }))
          if (resp.error) {
            swalException(resp.error)
            return false
          }
          return resp
        },
      }).then((resp) => {
        if (resp.isConfirmed) {
          notSuccess()
          onClose(resp.value)
        }
        if (resp.isDenied) {
          swalException(resp.value)
        }
        return
      })
    }
  }
  const onError = (errors: any, e: any) => console.log(errors, e)
  useEffect(() => {
    form.reset()
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="sm"
        keepMounted={keepMounted}
        open={open}
        {...other}
      >
        <DialogTitle>Registro Nuevo Cliente</DialogTitle>
        <DialogContent dividers>
          <ClienteForm
            // @ts-ignore
            form={form}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            variant={'contained'}
            size={'small'}
            onClick={() => {
              onClose()
            }}
          >
            Cancelar
          </Button>
          <Button
            //@ts-ignore
            onClick={form.handleSubmit(onSubmit, onError)}
            style={{ marginRight: 15 }}
            size={'small'}
            variant={'contained'}
            disabled={!form.formState.isValid}
          >
            Registrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ClienteRegistroDialog


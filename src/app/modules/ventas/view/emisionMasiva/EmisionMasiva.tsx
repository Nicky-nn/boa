import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { Publish } from '@mui/icons-material'
import { Button, Paper, Stack } from '@mui/material'
import { subMonths } from 'date-fns'
import React, { FunctionComponent } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import SimpleContainer from '../../../../base/components/Container/SimpleContainer'
import Breadcrumb from '../../../../base/components/Template/Breadcrumb/Breadcrumb'
import { getDateListAnio, getDateListMes } from '../../../../services/fechas'
import { notError } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { apiRecepcionArchivoMasivo } from '../../api/recepcionArchivoMasivo.api'
import EmisionMasivaForm from '../../components/abm/EmisionMasivaForm'
import { EmisionMasivaInputProps } from '../../interfaces/emisionMasiva.interface'
import { EmisionMasivaRegistroComposeService } from '../../services/emisionMasivaRegistroComposeService'
import { swalEnvioMasivo } from '../../services/swalEnvioMasivo'
import {
  emisionMasivaValidator,
  EmisionMasivaValidatorSchema,
} from '../../validator/emisionMasivaValidator'
import { ventasRoutesMap } from '../../VentasRoutesMap'

interface OwnProps {}

type Props = OwnProps

const EmisionMasiva: FunctionComponent<Props> = (props) => {
  const form = useForm<EmisionMasivaInputProps>({
    defaultValues: {
      gestion: getDateListAnio(new Date()),
      mes: getDateListMes(subMonths(new Date(), 1)),
    },
    resolver: yupResolver(EmisionMasivaValidatorSchema),
  })

  const onSubmit: SubmitHandler<EmisionMasivaInputProps> = async (values) => {
    const val = await emisionMasivaValidator(values)
    if (val.length > 0) {
      notError(val.join('<br>'))
    } else {
      const apiInput = EmisionMasivaRegistroComposeService(values)
      await swalAsyncConfirmDialog({
        preConfirm: async () => {
          const resp: any = await apiRecepcionArchivoMasivo(
            apiInput.input,
            apiInput.archivo,
          ).catch((e) => ({
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
          swalEnvioMasivo(resp.value)
        }
        if (resp.isDenied) {
          swalException(resp.value)
        }
        return
      })
    }
  }

  const onError = (errors: any, e: any) => console.log(errors, e)
  return (
    <>
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb routeSegments={[ventasRoutesMap.emisionMasiva]} />
        </div>
        <Paper
          elevation={0}
          variant="elevation"
          square
          sx={{ mb: 2, p: 0.5 }}
          className={'asideSidebarFixed'}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            style={{ marginTop: 2 }}
            spacing={{ xs: 1, sm: 1, md: 1, xl: 1 }}
            justifyContent="flex-end"
          >
            <Button
              color={'success'}
              startIcon={<Publish />}
              variant={'contained'}
              onClick={form.handleSubmit(onSubmit, onError)}
            >
              Importar archivo
            </Button>
          </Stack>
        </Paper>
        <EmisionMasivaForm form={form} />
      </SimpleContainer>
    </>
  )
}

export default EmisionMasiva

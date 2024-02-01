import { ImportExport } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
} from '@mui/material'
import React, { FunctionComponent, useEffect, useState } from 'react'

import { notSuccess } from '../../../../utils/notification'
import { swalException } from '../../../../utils/swal'
import { apiBoaEnvioMasivoPaquetes } from '../../api/boaEnvioMasivoPaquetes.api'
import { BoaPeriodoProps } from '../../interfaces/boa.interface'
import { EmisionPaquetesProps } from '../../interfaces/emisionPaquetes.interface'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: EmisionPaquetesProps) => void
  periodo: BoaPeriodoProps
}

type Props = OwnProps

const BoaEnvioMasivoPaquetesDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, periodo, ...other } = props

  const [loading, setLoading] = useState(false)

  const handleCancel = () => {
    onClose()
  }

  const enviarPaquetes = async () => {
    setLoading(true)
    try {
      const resp: any = await apiBoaEnvioMasivoPaquetes(periodo)
      if (resp) {
        notSuccess()
        onClose(resp)
      }
    } catch (e: any) {
      swalException(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 600 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Generar / Regenerar Paquetes</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item lg={4} style={{ textAlign: 'center' }}>
              <strong>Gestion: </strong> {periodo.gestion.value}
            </Grid>
            <Grid item lg={4} style={{ textAlign: 'center' }}>
              <strong>Mes: </strong> {periodo.mes.value}
            </Grid>
            <Grid item lg={4} style={{ textAlign: 'center' }}>
              <strong>Día: </strong> {periodo.dia?.value || 'TODOS'}
            </Grid>
          </Grid>
          <Alert severity="warning">
            Antes de realizar la <strong>Generación y envío de paquetes</strong> tenga en
            cuenta lo siguiente:
          </Alert>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              Verifique el Periodo <strong>Gestión</strong> Y <strong>Mes</strong>{' '}
              correctamente.
            </li>
            <li>
              La generación y envío de paquetes puede tardar{' '}
              <strong>varios minutos</strong>, esto dependiendo al volumen de facturas
              contenida en cada paquete.
            </li>
            <li>
              Una vez finalizado la generación de paquetes, el sistema mostrará el estado
              de sus paquetes. <br />{' '}
              <strong style={{ color: 'green' }}>PENDIENTE</strong>; El paquete esta listo
              para su posterior validación. <br />
              <strong style={{ color: 'red' }}>OBSERVADO</strong>, se debera subsanar
              aquellas que estén observadas, una vez subsanado se deberá volver a generar
              el paquete.
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={handleCancel}
            disabled={loading}
          >
            Cerrar
          </Button>

          <LoadingButton
            loading={loading}
            onClick={() => enviarPaquetes()}
            startIcon={<ImportExport />}
            loadingPosition="start"
            size={'small'}
            variant={'contained'}
            style={{ marginRight: 15 }}
          >
            Iniciar Generación / Envío paquetes
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BoaEnvioMasivoPaquetesDialog

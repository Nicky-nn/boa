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
import dayjs from 'dayjs'
import React, { FunctionComponent, useEffect, useState } from 'react'

import {
  getDateListAnio,
  getDateListDia,
  getDateListMes,
  getPeriodoToBoaPeriodo,
} from '../../../../services/fechas'
import { notSuccess } from '../../../../utils/notification'
import { swalException } from '../../../../utils/swal'
import { apiBoaEliminarObservados } from '../../api/boaEliminarObservados.api'
import { BoaPeriodoProps } from '../../interfaces/boa.interface'
import { EmisionPaquetesProps } from '../../interfaces/emisionPaquetes.interface'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  row: EmisionPaquetesProps
  onClose: (value?: EmisionPaquetesProps) => void
}

type Props = OwnProps

const BoaEliminarObservadosDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, row, ...other } = props

  const [loading, setLoading] = useState(false)

  const [periodo, setPeriodo] = useState<BoaPeriodoProps>({
    gestion: getDateListAnio(new Date()),
    mes: getDateListMes(new Date()),
  })

  const handleCancel = () => {
    onClose()
  }

  const eliminarPaquetes = async () => {
    setLoading(true)
    try {
      const periodo = getPeriodoToBoaPeriodo(row.grupo)
      const resp: any = await apiBoaEliminarObservados(periodo)
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
    if (open) {
      const p = dayjs(row.grupo, 'YYYYMMDD').toDate()
      setPeriodo({
        gestion: getDateListAnio(p),
        mes: getDateListMes(p),
        dia: getDateListDia(p),
      })
    }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 600 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Eliminar Paquetes Observados</DialogTitle>
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
            Antes de realizar la <strong>Eliminación de paquetes observados</strong> tenga
            en cuenta lo siguiente:
          </Alert>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              Se debe guardar el reporte de facturas observadas / rechazadas con el fin
              realizar la corrección y volver a emitir.
            </li>
            <li>
              La Eliminación de las facturas observadas / rechazadas es física, por lo
              tanto no podrá recuperar la información eliminada.
            </li>
            <li>
              Una vez realizada la acción se sumará la cantidad de paquetes eliminados a
              la columna "Nro.Paquetes Eliminados"
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
            onClick={() => eliminarPaquetes()}
            startIcon={<ImportExport />}
            loadingPosition="start"
            size={'small'}
            variant={'contained'}
            style={{ marginRight: 15 }}
          >
            Iniciar Eliminación de Observados
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default BoaEliminarObservadosDialog

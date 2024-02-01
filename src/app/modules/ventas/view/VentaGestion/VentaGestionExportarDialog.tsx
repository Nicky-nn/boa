import { ImportExport } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import es from 'date-fns/locale/es'
import dayjs from 'dayjs'
import exportFromJSON from 'export-from-json'
import React, { FunctionComponent, useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'

import { SimpleItem } from '../../../../base/components/Container/SimpleItem'
import useAuth from '../../../../base/hooks/useAuth'
import { PAGE_DEFAULT, PageProps } from '../../../../interfaces'
import { notDanger } from '../../../../utils/notification'
import { apiFacturaListado } from '../../api/factura.listado.api'

registerLocale('es', es)

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: any) => void
}

type Props = OwnProps

/**
 * @description Exportación de facturas Boa
 * @param props
 * @constructor
 */
const VentaGestionExportarDialog: FunctionComponent<Props> = (props) => {
  const auth = useAuth()
  const { onClose, open, ...other } = props
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(null)
  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const exportarDatos = async () => {
    setLoading(true)
    const sd = dayjs(startDate).format('YYYY-MM-DD')
    const ed = dayjs(endDate).format('YYYY-MM-DD')
    const nombre = `rep_${auth.user?.miEmpresa.tienda || ''}_boa_${dayjs(
      startDate,
    ).format('YYYYMMDD')}_${dayjs(endDate).format('YYYYMMDD')}`

    const query = `fechaEmision<=${ed} 24:00:00&fechaEmision>=${sd} 00:00:00`
    const fetchPagination: PageProps = {
      ...PAGE_DEFAULT,
      limit: 10000,
      reverse: false,
      query,
    }
    const { docs } = await apiFacturaListado(fetchPagination)
    setLoading(false)
    if (docs.length > 0) {
      const dataExport: any = docs.map((item) => ({
        numeroFactura: item.numeroFactura,
        fechaEmision: item.fechaEmision,
        codigoSucursal: item.sucursal.codigo,
        codigoPuntoVenta: item.puntoVenta.codigo,
        razonSocial: item.cliente.razonSocial,
        codigoTipoDocumentoIdentidad:
          item.cliente.tipoDocumentoIdentidad.codigoClasificador,
        numeroDocumento: item.cliente.numeroDocumento,
        email: item.cliente.email || '',
        actividadEconomica: item.actividadEconomica.codigoCaeb,
        nombrePasajero: item.nombrePasajero || '',
        numeroDocumentoPasajero: item.numeroDocumentoPasajero || '',
        codigoIataLineaAerea: item.codigoIataLineaAerea,
        codigoIataAgenteViajes: item.codigoIataAgenteViajes || '',
        nitAgenteViajes: item.nitAgenteViajes || '',
        codigoOrigenServicio: item.codigoOrigenServicio,
        codigoMetodoPago: item.metodoPago.codigoClasificador,
        codigoMoneda: item.moneda.codigoClasificador!,
        tipoCambio: item.tipoCambio,
        montoTarifa: item.montoTarifa,
        montoTotal: item.montoTotal,
        montoSujetoIva: item.montoTotalSujetoIva,
        codigoTipoTransaccion: item.codigoTipoTransaccion,
        usuario: item.usuario,
        estado: item.state,
        cuf: item.cuf,
        codigoCliente: item.cliente.codigoCliente,
        complemento: item.cliente.complemento || '',
        metodoPago: item.metodoPago.descripcion,
        montoTotalMoneda: item.montoTotalMoneda,
        moneda: item.moneda.descripcion,
        codigoRecepcion: item.codigoRecepcion,
        usuarioCreacion: item.usucre,
        fechaCreacion: item.createdAt,
      }))
      exportFromJSON({
        data: dataExport,
        fileName: nombre,
        exportType: exportFromJSON.types.csv,
        withBOM: true,
        delimiter: ';',
      })
    } else {
      notDanger('No se han encontrado registros para el periodo seleccionado')
    }
  }
  useEffect(() => {
    if (open) {
      setStartDate(new Date())
      setEndDate(new Date())
    }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, height: 500 } }}
        maxWidth="sm"
        open={open}
        {...other}
      >
        <DialogTitle>Exportar Ventas</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item sm={5}>
              <TextField
                sx={{ mt: 1 }}
                fullWidth
                label="Fecha Inicial"
                value={dayjs(startDate).format('DD/MM/YYYY') || ''}
                size="small"
              />
              <TextField
                sx={{ mt: 3 }}
                fullWidth
                label="Fecha Final"
                value={dayjs(endDate).format('DD/MM/YYYY') || ''}
                size="small"
              />
            </Grid>
            <Grid item sm={7}>
              <SimpleItem>
                <DatePicker
                  selected={startDate}
                  onChange={onChange}
                  locale={'es'}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  inline
                  isClearable={true}
                />
              </SimpleItem>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            disabled={loading}
            color={'error'}
            variant={'contained'}
            size={'small'}
            onClick={() => {
              onClose()
            }}
          >
            Cancelar
          </Button>
          <LoadingButton
            loading={loading}
            disabled={!dayjs(startDate).isValid() || !dayjs(endDate).isValid()}
            onClick={() => exportarDatos()}
            startIcon={<ImportExport />}
            loadingPosition="start"
            size={'small'}
            variant={'contained'}
            style={{ marginRight: 15 }}
          >
            Exportar Ventas
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default VentaGestionExportarDialog

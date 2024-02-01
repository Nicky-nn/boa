import { FileDownload } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import dayjs from 'dayjs'
import exportFromJSON from 'export-from-json'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import React, { FunctionComponent, useEffect, useMemo, useState } from 'react'

import { apiEstado } from '../../../../interfaces'
import { EmisionPaquetesProps } from '../../interfaces/emisionPaquetes.interface'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: any) => void
  row: EmisionPaquetesProps
}

type Props = OwnProps

const EmisionPaquetesPendientesDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, row, ...other } = props
  const [data, setData] = useState([])

  const handleCancel = () => {
    onClose()
  }

  const tableColumns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'puntoVenta',
      header: 'Suc. Pv.',
      id: 'puntoVenta',
    },
    {
      accessorKey: 'paquete',
      header: 'Nro. Paquete',
      id: 'paquete',
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      id: 'fecha',
    },
    {
      accessorKey: 'numero',
      header: 'Nro. Archivo',
      id: 'numero',
    },
    {
      accessorKey: 'factura',
      header: 'Nro. Factura',
      id: 'factura',
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      id: 'state',
    },
  ]
  const columns = useMemo(() => tableColumns, [])

  const handleExportData = () => {
    const fileName = `detallePaqueteGrupo_${row.grupo}`
    const exportType = exportFromJSON.types.csv
    exportFromJSON({ data, fileName, exportType })
  }

  useEffect(() => {
    if (open) {
      const newData: any = []
      const paquetesObservados = row.paquetes.filter(
        (p) => p.state === apiEstado.pendiente,
      )
      paquetesObservados.forEach((pa, index) => {
        if (pa.archivos) {
          newData.push(
            ...pa.archivos.map((a) => ({
              paquete: pa.nroPaquete,
              puntoVenta: `${row.codigoSucursal} - ${row.codigoPuntoVenta}`,
              numero: a.numero,
              factura: a.factura,
              estado: pa.state,
              fecha: dayjs(row.grupo, 'YYYYMMDD').format('DD/MM/YYYY'),
            })),
          )
        }
      })
      setData(newData)
    }
  }, [open])

  return (
    <>
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 600 } }}
        maxWidth="lg"
        open={open}
        onClose={() => handleCancel()}
        {...other}
      >
        <DialogTitle>
          Detalle Paquetes <Chip label={'PENDIENTES'} color={'info'} size={'small'} /> -{' '}
          {dayjs(row.grupo, 'YYYYMMDD').format('DD/MM/YYYY')}
        </DialogTitle>
        <DialogContent dividers>
          <MaterialReactTable
            columns={columns}
            data={data ?? []}
            enableColumnResizing
            enableDensityToggle={false}
            enableGlobalFilter={false}
            initialState={{
              density: 'compact',
              pagination: { pageIndex: 0, pageSize: 20 },
            }}
            muiToolbarAlertBannerChipProps={{ color: 'primary' }}
            muiTableContainerProps={{ sx: { maxHeight: 300 } }}
            localization={MRT_Localization_ES}
            renderTopToolbarCustomActions={({ table }) => (
              <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  color="primary"
                  onClick={handleExportData}
                  startIcon={<FileDownload />}
                  variant="contained"
                  size={'small'}
                >
                  Exportar Reporte
                </Button>
              </Box>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            color={'error'}
            size={'small'}
            variant={'contained'}
            onClick={handleCancel}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EmisionPaquetesPendientesDialog

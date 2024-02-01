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

const EmisionPaquetesValidadosDialog: FunctionComponent<Props> = (props) => {
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
      size: 80,
    },
    {
      accessorKey: 'paquete',
      header: 'Nro. Paquete',
      id: 'paquete',
      size: 90,
    },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      id: 'fecha',
      size: 110,
    },
    {
      accessorKey: 'nroFacturas',
      header: 'Nro. Facturas',
      id: 'nroFacturas',
      size: 100,
    },
    {
      accessorKey: 'codigoEstado',
      header: 'Código Estado',
      id: 'codigoEstado',
      size: 100,
    },
    {
      accessorKey: 'codigoRecepcion',
      header: 'Código Recepción',
      id: 'codigoRecepcion',
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      id: 'state',
      size: 120,
    },
  ]
  const columns = useMemo(() => tableColumns, [])

  const handleExportData = () => {
    const fileName = `detallePaquetesValidadas_${row.grupo}`
    const exportType = exportFromJSON.types.csv
    exportFromJSON({ data, fileName, exportType })
  }

  useEffect(() => {
    if (open) {
      const newData: any = []
      const paquetesValidados = row.paquetes.filter((p) => p.state === apiEstado.validada)
      paquetesValidados.forEach((pa, index) => {
        newData.push({
          paquete: pa.nroPaquete,
          puntoVenta: `${row.codigoSucursal} - ${row.codigoPuntoVenta}`,
          nroFacturas: pa.nroFacturas,
          codigoEstado: pa.codigoEstado,
          codigoRecepcion: pa.codigoRecepcion,
          fecha: dayjs(row.grupo, 'YYYYMMDD').format('DD/MM/YYYY'),
          estado: pa.state,
        })
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
          Detalle Paquetes <Chip label={'VALIDADOS'} color={'success'} size={'small'} /> -{' '}
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

export default EmisionPaquetesValidadosDialog

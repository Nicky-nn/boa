import { DeleteForever, FileDownload } from '@mui/icons-material'
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
import BoaEliminarObservadosDialog from './BoaEliminarObservadosDialog'

interface OwnProps {
  id: string
  keepMounted: boolean
  open: boolean
  onClose: (value?: boolean) => void
  row: EmisionPaquetesProps
}

type Props = OwnProps

const EmisionPaquetesErroresDialog: FunctionComponent<Props> = (props) => {
  const { onClose, open, row, ...other } = props
  const [data, setData] = useState([])
  const [openEliminarObservados, setOpenEliminarObservados] = useState(false)

  const handleCancel = (value?: boolean) => {
    onClose(value)
  }

  const tableColumns: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'puntoVenta',
      header: 'Suc. Pv.',
      id: 'puntoVenta',
      size: 90,
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
      size: 100,
    },
    {
      accessorKey: 'numero',
      header: 'Nro. Archivo',
      id: 'numero',
      size: 90,
    },
    {
      accessorKey: 'factura',
      header: 'Nro. Factura',
      id: 'factura',
      size: 100,
    },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      id: 'descripcion',
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      id: 'state',
      size: 120,
    },
  ]
  const columns = useMemo(() => tableColumns, [])

  /**
   * @description Exportamos los datos
   */
  const handleExportData = () => {
    const fileName = `observadosGrupo_${row.grupo}`
    const exportType = exportFromJSON.types.csv
    exportFromJSON({ data, fileName, exportType })
  }

  useEffect(() => {
    const newData: any = []
    row.paquetes.forEach((pa, index) => {
      if (pa.archivos) {
        newData.push(...pa.archivos.map((a) => ({ ...a, paquete: index + 1 })))
      }
    })
    setData(newData)
  }, [])

  useEffect(() => {
    if (open) {
      const newData: any = []
      const paquetesObservados = row.paquetes.filter((p) =>
        [apiEstado.observado, apiEstado.rechazado].includes(p.state),
      )
      paquetesObservados.forEach((pa, index) => {
        if (pa.archivos) {
          newData.push(
            ...pa.archivos.map((a) => ({
              fecha: dayjs(row.grupo, 'YYYYMMDD').format('DD/MM/YYYY'),
              puntoVenta: `${row.codigoSucursal} - ${row.codigoPuntoVenta}`,
              paquete: pa.nroPaquete,
              numero: a.numero,
              factura: a.factura,
              estado: pa.state,
              descripcion: a.descripcion,
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
          {' '}
          Detalle Paquetes{' '}
          <Chip label={'OBS. / RECHA.'} color={'warning'} size={'small'} /> -{' '}
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
                <Button
                  color="error"
                  onClick={() => setOpenEliminarObservados(true)}
                  startIcon={<DeleteForever />}
                  variant="contained"
                  size={'small'}
                >
                  Eliminar paquetes
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
            onClick={() => handleCancel()}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <BoaEliminarObservadosDialog
        id={'eliminacionObservados'}
        keepMounted={true}
        open={openEliminarObservados}
        onClose={(value) => {
          if (value) {
            handleCancel(true)
          }
          setOpenEliminarObservados(false)
        }}
        row={row}
      />
    </>
  )
}

export default EmisionPaquetesErroresDialog

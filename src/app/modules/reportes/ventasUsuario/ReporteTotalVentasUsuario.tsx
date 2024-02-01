import { Box } from '@mui/system'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import React, { FC, useMemo } from 'react'

import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import { genReplaceEmpty } from '../../../utils/helper'
import {
  DisplayColumnDefOptions,
  MuiTableProps,
} from '../../../utils/materialReactTableUtils'
import {
  ReporteVentasPorGestionComposeProps,
  ReporteVentasUsuarioDetalleComposeProps,
} from '../services/reporteVentasPorGestionCompose'

interface OwnProps {
  data: ReporteVentasPorGestionComposeProps
}

type Props = OwnProps

const ReporteTotalVentasUsuario: FC<Props> = (props) => {
  const { data } = props
  const columns = useMemo<MRT_ColumnDef<ReporteVentasUsuarioDetalleComposeProps>[]>(
    () => [
      {
        accessorKey: 'mesTexto',
        header: 'Mes',
        size: 110,
      },
      {
        accessorKey: 'montoPendientes',
        header: 'Total Pendientes',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 120,
      },
      {
        accessorKey: 'montoValidadas',
        header: 'Total Validadas',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 140,
      },
      {
        accessorKey: 'montoAnuladas',
        header: 'Total Anulados',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 140,
      },
      {
        accessorKey: 'montoParcialFacturas',
        header: 'SUB-TOTAL',
        muiTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) => numberWithCommas(genReplaceEmpty(cell.getValue(), 0), {}),
        size: 150,
      },
    ],
    [],
  )
  return (
    <>
      <Box>
        <MaterialReactTable
          columns={columns}
          data={data.detalle || []}
          initialState={{
            density: 'compact',
          }}
          localization={MRT_Localization_ES}
          displayColumnDefOptions={DisplayColumnDefOptions}
          muiTableProps={MuiTableProps}
          enableColumnActions={false}
          enableColumnFilters={false}
          enablePagination={false}
          enableSorting={false}
          enableBottomToolbar={false}
          enableTopToolbar={false}
          muiTableBodyRowProps={{ hover: false }}
        />
      </Box>
    </>
  )
}

export default ReporteTotalVentasUsuario

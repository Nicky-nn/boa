import { FileOpen, ImportExport, LayersClear, MenuOpen } from '@mui/icons-material'
import { Button, Chip, Grid, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import React, { FC, useMemo, useState } from 'react'

import AuditIconButton from '../../../base/components/Auditoria/AuditIconButton'
import SimpleContainer from '../../../base/components/Container/SimpleContainer'
import { SimpleItem } from '../../../base/components/Container/SimpleItem'
import SimpleRowMenu from '../../../base/components/Container/SimpleRow'
import { numberWithCommas } from '../../../base/components/MyInputs/NumberInput'
import SimpleMenu, { StyledMenuItem } from '../../../base/components/MyMenu/SimpleMenu'
import StackMenuActionTable from '../../../base/components/MyMenu/StackMenuActionTable'
import Breadcrumb from '../../../base/components/Template/Breadcrumb/Breadcrumb'
import { apiEstado, PAGE_DEFAULT, PageProps } from '../../../interfaces'
import { genApiQuery, openInNewTab } from '../../../utils/helper'
import { localization } from '../../../utils/localization'
import {
  muiTableApiEstado,
  muiTableHeadCellFilterTextFieldProps,
} from '../../../utils/materialReactTableUtils'
import { apiFacturaListado } from '../api/factura.listado.api'
import { FacturaBoaProps } from '../interfaces/boa.interface'
import { ventasRoutesMap } from '../VentasRoutesMap'
import AnularDocumentoDialog from './VentaGestion/AnularDocumentoDialog'
import ReenviarEmailsDialog from './VentaGestion/ReenviarEmailsDialog'
import VentaGestionExportarDialog from './VentaGestion/VentaGestionExportarDialog'

const tableColumns: MRT_ColumnDef<FacturaBoaProps>[] = [
  {
    header: 'Nro. Factura',
    accessorKey: 'numeroFactura',
    size: 130,
  },
  {
    accessorKey: 'fechaEmision',
    header: 'Fecha Emisión',
    id: 'fechaEmision',
    enableColumnFilter: false,
    size: 160,
  },
  {
    header: 'Razon Social',
    id: 'cliente.razonSocial',
    accessorKey: 'cliente.razonSocial',
    maxSize: 250,
    minSize: 200,
  },
  {
    id: 'cliente.numeroDocumento',
    header: 'Nro. Documento',
    accessorFn: (row) => (
      <span>
        {row.cliente && row.cliente.numeroDocumento ? row.cliente.numeroDocumento : 'N/A'}{' '}
        {row.cliente && row.cliente.complemento ? `-${row.cliente.complemento}` : ''}
      </span>
    ),
    filterFn: (row, id, filterValue) =>
      (row.original.cliente.numeroDocumento || '').startsWith(filterValue),
    maxSize: 150,
  },
  {
    header: 'Importe',
    accessorKey: 'montoTotal',
    muiTableBodyCellProps: {
      align: 'right',
    },
    Cell: ({ cell }) => <span>{numberWithCommas(cell.getValue() as number, {})}</span>,
    size: 150,
    enableColumnFilter: false,
  },
  {
    header: 'Monto Moneda',
    accessorKey: 'montoTotalMoneda',
    muiTableBodyCellProps: {
      align: 'right',
    },
    accessorFn: (row) => <span> {numberWithCommas(row.montoTotalMoneda, {})}</span>,
    size: 150,
    enableColumnFilter: false,
  },
  {
    header: 'Moneda',
    accessorKey: 'moneda.descripcion',
    accessorFn: (row) => (
      <strong>
        {row.moneda && row.moneda.descripcion ? row.moneda.descripcion : 'N/A'}
      </strong>
    ),
    size: 110,
    enableColumnFilter: false,
  },
  {
    header: 'Tipo Cambio',
    accessorKey: 'tipoCambio',
    size: 130,
    muiTableBodyCellProps: {
      align: 'right',
    },
    accessorFn: (row) => <span> {numberWithCommas(row.tipoCambio, {})}</span>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'cuf',
    id: 'cuf',
    header: 'C.U.F.',
  },
  {
    accessorKey: 'codigoRecepcion',
    id: 'codigoRecepcion',
    header: 'Código Recepcion',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'usuario',
    id: 'usuario',
    header: 'Usuario',
  },
  {
    accessorKey: 'state',
    header: 'Estado',
    accessorFn: (row) => (
      <Chip
        color={
          row.state === apiEstado.validada
            ? 'success'
            : row.state === apiEstado.pendiente
            ? 'warning'
            : row.state === apiEstado.elaborado
            ? 'default'
            : 'error'
        }
        label={row.state}
        size={'small'}
      />
    ),
    filterVariant: 'select',
    filterSelectOptions: muiTableApiEstado,
    filterFn: (row, id, filterValue) =>
      row.original.state.toLowerCase().startsWith(filterValue.toLowerCase()),
  },
]

/**
 * @description Componente para gestionar las facturas
 * @constructor
 */
const VentaGestion: FC<any> = () => {
  const [openAnularDocumento, setOpenAnularDocumento] = useState(false)
  const [factura, setFactura] = useState<FacturaBoaProps | null>(null)
  const [openExport, setOpenExport] = useState(false)
  const [openReenviarEmails, setOpenReenviarEmails] = useState(false)
  // DATA TABLE
  const [rowCount, setRowCount] = useState(0)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: PAGE_DEFAULT.limit,
  })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  // FIN DATA TABLE

  const {
    data: gestionProductos,
    isError,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery<FacturaBoaProps[]>(
    [
      'gestionFacturas',
      columnFilters,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    async () => {
      const query = genApiQuery(columnFilters)
      const fetchPagination: PageProps = {
        ...PAGE_DEFAULT,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        reverse: sorting.length <= 0,
        query,
      }
      const { pageInfo, docs } = await apiFacturaListado(fetchPagination)
      setRowCount(pageInfo.totalDocs)
      return docs
    },
    {
      refetchOnWindowFocus: false,
    },
  )
  const columns = useMemo(() => tableColumns, [])
  return (
    <>
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb routeSegments={[ventasRoutesMap.gestion]} />
        </div>

        <SimpleRowMenu>
          <SimpleItem>
            <Button
              size={'small'}
              startIcon={<ImportExport />}
              onClick={() => setOpenExport(true)}
              variant={'outlined'}
            >
              EXPORTAR
            </Button>
          </SimpleItem>
        </SimpleRowMenu>

        <Grid container spacing={2}>
          <Grid item lg={12} md={12} xs={12}>
            <MaterialReactTable
              columns={columns} //must be memoized
              data={gestionProductos ?? []} //must be memoized
              initialState={{
                showColumnFilters: true,
                columnVisibility: {
                  cuf: false,
                  montoTotal: false,
                  tipoCambio: false,
                  codigoRecepcion: false,
                },
              }}
              manualFiltering
              manualPagination
              manualSorting
              muiToolbarAlertBannerProps={
                isError
                  ? {
                      color: 'error',
                      children: 'Error Cargando Datos',
                    }
                  : undefined
              }
              onColumnFiltersChange={setColumnFilters}
              onPaginationChange={setPagination}
              onSortingChange={setSorting}
              enableDensityToggle={false}
              enableGlobalFilter={false}
              rowCount={rowCount}
              localization={localization}
              state={{
                isLoading,
                columnFilters,
                pagination,
                showAlertBanner: isError,
                showProgressBars: isRefetching,
                sorting,
                density: 'compact',
                columnPinning: { right: ['actions'] },
                rowSelection,
              }}
              enableRowActions
              positionActionsColumn="first"
              displayColumnDefOptions={{
                'mrt-row-actions': {
                  header: 'Acciones', //change header text
                  size: 100, //make actions column wider
                },
              }}
              renderRowActions={({ row }) => (
                <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
                  <SimpleMenu
                    menuButton={
                      <>
                        <IconButton aria-label="delete">
                          <MenuOpen />
                        </IconButton>
                      </>
                    }
                  >
                    <StyledMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        setFactura(row.original)
                        setOpenAnularDocumento(true)
                      }}
                    >
                      <LayersClear /> Anular Documento
                    </StyledMenuItem>

                    <StyledMenuItem
                      onClick={() => {
                        openInNewTab(row.original.representacionGrafica.xml)
                      }}
                    >
                      <FileOpen /> Xml
                    </StyledMenuItem>
                  </SimpleMenu>
                  <AuditIconButton row={row.original} />
                </div>
              )}
              muiTableHeadCellFilterTextFieldProps={{
                ...muiTableHeadCellFilterTextFieldProps,
              }}
              renderTopToolbarCustomActions={() => (
                <StackMenuActionTable refetch={refetch} />
              )}
            />
          </Grid>
        </Grid>
        <Box py="12px" />
        <AnularDocumentoDialog
          id={'anularDocumentoDialog'}
          open={openAnularDocumento}
          keepMounted
          factura={factura}
          onClose={async (val) => {
            if (val) {
              await refetch()
            }
            setFactura(null)
            setOpenAnularDocumento(false)
          }}
        />
      </SimpleContainer>

      <VentaGestionExportarDialog
        id={'ventaGestionExportar'}
        keepMounted={true}
        open={openExport}
        onClose={() => {
          setOpenExport(false)
        }}
      />

      <ReenviarEmailsDialog
        id={'reenviarEmails'}
        keepMounted={true}
        open={openReenviarEmails}
        onClose={() => {
          setFactura(null)
          setOpenReenviarEmails(false)
        }}
        factura={factura}
      />
    </>
  )
}

export default VentaGestion


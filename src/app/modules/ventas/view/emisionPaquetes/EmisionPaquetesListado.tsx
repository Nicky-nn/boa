import { Refresh, Visibility } from '@mui/icons-material'
import { Chip, Grid, IconButton, Tooltip } from '@mui/material'
import type { ColumnFiltersState, PaginationState } from '@tanstack/react-table'
import { SortingState } from '@tanstack/react-table'
import dayjs from 'dayjs'
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table'
import { MRT_Localization_ES } from 'material-react-table/locales/es'
import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'

import StackMenuActionTable from '../../../../base/components/MyMenu/StackMenuActionTable'
import { PAGE_DEFAULT } from '../../../../interfaces'
import {
  DateListAnioProps,
  DateListDiaProps,
  DateListMesProps,
} from '../../../../services/fechas'
import {
  DisplayColumnDefOptions,
  MuiSearchTextFieldProps,
  MuiTableHeadCellFilterTextFieldProps,
  MuiTableProps,
  MuiToolbarAlertBannerProps,
} from '../../../../utils/materialReactTableUtils'
import { apiBoaPaquetes } from '../../api/boaPaquetes.api'
import EmisionPaquetesErroresDialog from '../../components/list/EmisionPaquetesErroresDialog'
import EmisionPaquetesPendientesDialog from '../../components/list/EmisionPaquetesPendientesDialog'
import EmisionPaquetesValidadosDialog from '../../components/list/EmisionPaquetesValidadosDialog'
import { BoaPeriodoProps } from '../../interfaces/boa.interface'
import { EmisionPaquetesProps } from '../../interfaces/emisionPaquetes.interface'
import { componerDocumentosService } from '../../services/componerDocumentosService'
import EmisionPaquetesMenu from './EmisionPaquetesMenu'

interface OwnProps {
  periodo: { gestion: DateListAnioProps; mes: DateListMesProps; dia?: DateListDiaProps }
  refetchTable: boolean
  setRefetchTable: Dispatch<SetStateAction<boolean>>
}

type Props = OwnProps

/**
 * @description Listado de emisión de paquetes por periodo (anio/mes)
 * @param props
 * @constructor
 */
const EmisionPaquetesListado: FunctionComponent<Props> = (props) => {
  const { periodo, refetchTable, setRefetchTable } = props
  // DATOS Y ESTADO DE OBTENCION
  const [data, setData] = useState<EmisionPaquetesProps[]>([])
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const [rowCount, setRowCount] = useState(0)

  // ESTADOS DE LA TABLA
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: PAGE_DEFAULT.page,
    pageSize: 31,
  })
  // const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // ESTADOS PARA ARCHIVOS OBSERVADOS
  const [openObservados, setOpenObservados] = useState(false)
  const [archivosObservados, setArchivosObservados] =
    useState<EmisionPaquetesProps | null>(null)

  // ESTADOS PARA ARCHIVOS VALIDADOS
  const [openValidados, setOpenValidados] = useState(false)
  const [archivosValidados, setArchivosValidados] = useState<EmisionPaquetesProps | null>(
    null,
  )
  // ESTADOS PARA ARCHIVOS PENDIENTES
  const [openPendientes, setOpenPendientes] = useState(false)
  const [archivosPendientes, setarchivosPendientes] =
    useState<EmisionPaquetesProps | null>(null)

  /**
   * @description Obtencion de datos
   * @param periodo
   */
  const fetchData = async (periodo: BoaPeriodoProps) => {
    if (!data.length) {
      setIsLoading(true)
    } else {
      setIsRefetching(true)
    }
    try {
      const docs = await apiBoaPaquetes(periodo)
      const composeBoaDocs = componerDocumentosService(docs)
      setData(composeBoaDocs)
      setRowCount(docs.length)
    } catch (error) {
      setIsError(true)
      return
    }
    setIsError(false)
    setIsLoading(false)
    setIsRefetching(false)
  }

  const refetch = () => fetchData(periodo)

  const tableColumns: MRT_ColumnDef<EmisionPaquetesProps>[] = [
    {
      accessorKey: 'grupo',
      header: 'Grupo',
      id: 'grupo',
      enableColumnFilter: true,
      accessorFn: (row) => dayjs(row.grupo, 'YYYYMMDD').format('DD/MM/YYYY'),
      size: 100,
      filterFn: (row, id, filterValue) =>
        dayjs(row.original.grupo, 'YYYYMMDD')
          .format('DD/MM/YYYY')
          .startsWith(filterValue.toLowerCase()),
    },
    {
      accessorKey: 'codigoSucursal',
      header: 'Suc. - P.V.',
      id: 'codigoSucursal',
      accessorFn: (row) => `${row.codigoSucursal} - ${row.codigoPuntoVenta}`,
      size: 90,
      enableColumnFilter: false,
    },
    {
      header: 'Nro. Paquetes',
      id: 'paquetes',
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <Chip
          label={`${row.original.numeroPaquetes} Paquete(s)`}
          variant="filled"
          color={'default'}
          size="small"
        />
      ),
    },
    {
      header: 'Paq. Eliminados',
      id: 'eliminados',
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const nro = row.original.estados?.eliminados || 0
        return (
          <Chip
            label={`${nro} Eliminados`}
            variant="filled"
            color={nro === 0 ? 'default' : 'error'}
            size="small"
          />
        )
      },
    },
    {
      header: 'Paq. Pendientes',
      id: 'pendientes',
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const paquetes = row.original.estados?.pendientes || 0
        return (
          <Tooltip title={'Ver detalle'} placement="right" arrow>
            <Chip
              icon={<Visibility />}
              label={`${paquetes} Pendientes`}
              variant="filled"
              onClick={() => {
                setarchivosPendientes(row.original)
                setOpenPendientes(true)
              }}
              color={paquetes === 0 ? 'default' : 'info'}
              size="small"
            />
          </Tooltip>
        )
      },
    },
    {
      header: 'Paq. Obs. / Rechazados',
      id: 'errores',
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const paquetes = row.original.estados?.rechazados || 0
        return (
          <Tooltip title={'Ver detalle'} placement="right" arrow>
            <Chip
              icon={<Visibility />}
              label={`${paquetes} Obs. / Recha.`}
              variant="filled"
              onClick={() => {
                setArchivosObservados(row.original)
                setOpenObservados(true)
              }}
              color={paquetes === 0 ? 'default' : 'warning'}
              size="small"
            />
          </Tooltip>
        )
      },
    },
    {
      header: 'Paq. Validados',
      id: 'validados',
      enableColumnFilter: false,
      Cell: ({ row }) => {
        const paquetes = row.original.estados?.validados || 0
        return (
          <Tooltip title={'Ver detalle'} placement="right" arrow>
            <Chip
              icon={<Visibility />}
              label={`${paquetes} Validados`}
              variant="filled"
              onClick={() => {
                setArchivosValidados(row.original)
                setOpenValidados(true)
              }}
              color={paquetes === 0 ? 'default' : 'success'}
              size="small"
            />
          </Tooltip>
        )
      },
    },
  ]
  const columns = useMemo(() => tableColumns, [])
  useEffect(() => {
    const getData = async () => {
      await fetchData(periodo)
    }
    getData().then() // run it, run it
  }, [])

  useEffect(() => {
    refetch().then()
  }, [periodo])

  useEffect(() => {
    if (refetchTable) {
      refetch().then()
      setRefetchTable(false)
    }
  }, [refetchTable])

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} xs={12}>
          <MaterialReactTable
            columns={columns}
            data={data ?? []}
            initialState={{ showColumnFilters: true }}
            muiToolbarAlertBannerProps={MuiToolbarAlertBannerProps(isError)}
            onColumnFiltersChange={setColumnFilters}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
            renderTopToolbarCustomActions={() => (
              <StackMenuActionTable refetch={refetch} />
            )}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            rowCount={rowCount}
            localization={MRT_Localization_ES}
            state={{
              isLoading,
              columnFilters,
              pagination,
              showAlertBanner: isError,
              showProgressBars: isRefetching,
              density: 'compact',
              sorting,
              // rowSelection,
            }}
            muiSearchTextFieldProps={MuiSearchTextFieldProps}
            enableRowActions
            positionActionsColumn={'first'}
            renderRowActions={({ row }) => (
              <EmisionPaquetesMenu row={row.original} refetch={refetch} />
            )}
            muiTableHeadCellFilterTextFieldProps={MuiTableHeadCellFilterTextFieldProps}
            muiTableProps={MuiTableProps}
            displayColumnDefOptions={DisplayColumnDefOptions}
          />
        </Grid>
      </Grid>
      {archivosObservados && (
        <EmisionPaquetesErroresDialog
          row={archivosObservados}
          id={`${archivosObservados.grupo || ''}_observados_dialog`}
          open={openObservados}
          keepMounted={true}
          onClose={(value?: boolean) => {
            if (value) {
              refetch().then()
            }
            setOpenObservados(false)
          }}
        />
      )}

      {archivosValidados && (
        <EmisionPaquetesValidadosDialog
          row={archivosValidados}
          id={`${archivosValidados.grupo}_validados_dialog`}
          open={openValidados}
          keepMounted={true}
          onClose={() => {
            setOpenValidados(false)
          }}
        />
      )}

      {archivosPendientes && (
        <EmisionPaquetesPendientesDialog
          id={`${archivosPendientes.grupo}_pendientes_dialog`}
          keepMounted={true}
          open={openPendientes}
          onClose={() => {
            setOpenPendientes(false)
          }}
          row={archivosPendientes}
        />
      )}
    </>
  )
}

export default EmisionPaquetesListado

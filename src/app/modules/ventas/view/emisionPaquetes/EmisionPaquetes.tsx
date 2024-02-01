import { Newspaper } from '@mui/icons-material'
import { Button, Chip, List, ListItem } from '@mui/material'
import { subMonths } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'

import SimpleContainer from '../../../../base/components/Container/SimpleContainer'
import StackMenu from '../../../../base/components/MyMenu/StackMenu'
import { StackMenuItem } from '../../../../base/components/MyMenu/StackMenuActionTable'
import Breadcrumb from '../../../../base/components/Template/Breadcrumb/Breadcrumb'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import { getDateListAnio, getDateListMes } from '../../../../services/fechas'
import { genReplaceEmpty } from '../../../../utils/helper'
import { apiNroFacturasPorEstado } from '../../api/nroFacturasPorEstado.api'
import BoaEnvioMasivoPaquetesDialog from '../../components/list/BoaEnvioMasivoPaquetesDialog'
import BoaEnvioMasivoValidacionPaquetesDialog from '../../components/list/BoaEnvioMasivoValidacionPaquetesDialog'
import BoaPeriodo from '../../components/list/BoaPeriodo'
import { BoaPeriodoProps } from '../../interfaces/boa.interface'
import { ventasRoutesMap } from '../../VentasRoutesMap'
import EmisionPaquetesListado from './EmisionPaquetesListado'

/**
 * @description Formulario para la generación y emisión de paquetes
 * @constructor
 */
const EmisionPaquetes = () => {
  // in this case *props are stored in the state of parent component
  // FILTRO PERIODO
  const [periodo, setPeriodo] = useState<BoaPeriodoProps>({
    gestion: getDateListAnio(new Date()),
    mes: getDateListMes(subMonths(new Date(), 1)),
  })
  const [refreshTable, setRefetchTable] = useState<boolean>(false)
  const [openGenerarPaquete, setOpenGenerarPaquete] = useState(false)
  const [openValidarPaquete, setOpenValidarPaquete] = useState(false)

  const [nroEstados, setNroEstados] = useState<{
    pendientes: number | null
    elaborados: number | null
  }>({ pendientes: null, elaborados: null })

  const fetchVerificarCantidades = useCallback(async (periodo: BoaPeriodoProps) => {
    const resp = await apiNroFacturasPorEstado(periodo)
    if (resp) {
      setNroEstados({
        elaborados: resp.elaborados.pageInfo.totalDocs,
        pendientes: resp.pendientes.pageInfo.totalDocs,
      })
    } else {
      setNroEstados({
        elaborados: null,
        pendientes: null,
      })
    }
  }, [])

  useEffect(() => {
    if (refreshTable) {
      fetchVerificarCantidades(periodo).then()
    }
  }, [refreshTable])

  useEffect(() => {
    fetchVerificarCantidades(periodo).then()
  }, [periodo])

  return (
    <>
      <SimpleContainer>
        <div className="breadcrumb">
          <Breadcrumb routeSegments={[ventasRoutesMap.emisionPaquetes]} />
        </div>

        <StackMenu asideSidebarFixed>
          <StackMenuItem>
            <Button
              variant="contained"
              startIcon={<Newspaper />}
              color={'info'}
              size={'small'}
              onClick={() => setOpenGenerarPaquete(true)}
            >
              Generar / Regenerar Paquetes
            </Button>
          </StackMenuItem>
          <StackMenuItem>
            <Button
              variant="contained"
              startIcon={<Newspaper />}
              color={'success'}
              size={'small'}
              onClick={() => setOpenValidarPaquete(true)}
            >
              Validación de paquetes
            </Button>
          </StackMenuItem>
        </StackMenu>

        <SimpleCard title={'Seleccione el periodo'}>
          <BoaPeriodo periodo={periodo} setPeriodo={setPeriodo} /> <br />
          <List dense>
            <ListItem sx={{ pl: 0 }}>
              <Chip
                size={'small'}
                label="¿Documentos para Generar / Regenerar Paquetes?"
                variant="outlined"
                color={'primary'}
                sx={{ mr: 2 }}
              />
              <strong>{genReplaceEmpty(nroEstados.elaborados, 'Sin respuesta')}</strong>
            </ListItem>
            <ListItem sx={{ pl: 0 }}>
              <Chip
                size={'small'}
                label="¿Documentos para Validación de paquetes?"
                variant="outlined"
                color={'success'}
                sx={{ mr: 2 }}
              />
              <strong>{genReplaceEmpty(nroEstados.pendientes, 'Sin respuesta')}</strong>
            </ListItem>
          </List>
          <br />
          <EmisionPaquetesListado
            periodo={periodo}
            refetchTable={refreshTable}
            setRefetchTable={setRefetchTable}
          />
        </SimpleCard>
      </SimpleContainer>
      <BoaEnvioMasivoPaquetesDialog
        id={'boaEnvioMasivoPaquetes'}
        periodo={periodo}
        open={openGenerarPaquete}
        keepMounted={true}
        onClose={(value) => {
          if (value) setRefetchTable(true)
          setOpenGenerarPaquete(false)
        }}
      />
      <BoaEnvioMasivoValidacionPaquetesDialog
        id={'boaEnvioMasivoPaquetesValidar'}
        periodo={periodo}
        open={openValidarPaquete}
        keepMounted={true}
        onClose={(value) => {
          if (value) setRefetchTable(true)
          setOpenValidarPaquete(false)
        }}
      />
    </>
  )
}

export default EmisionPaquetes

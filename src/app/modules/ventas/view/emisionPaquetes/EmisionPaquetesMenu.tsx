import React, { FunctionComponent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuditIconButton from '../../../../base/components/Auditoria/AuditIconButton'
import BoaEliminarObservadosDialog from '../../components/list/BoaEliminarObservadosDialog'
import { EmisionPaquetesProps } from '../../interfaces/emisionPaquetes.interface'

interface OwnProps {
  row: EmisionPaquetesProps
  refetch: () => any
}

type Props = OwnProps

/**
 * @description Menu de acciones para la tabla de emision de paquetes
 * @param props
 * @constructor
 */
const EmisionPaquetesMenu: FunctionComponent<Props> = (props) => {
  const { row, refetch } = props
  const [openEliminarObservados, setOpenEliminarObservados] = useState<boolean>(false)
  const navigate = useNavigate()

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem', width: 100 }}>
        <AuditIconButton row={row} />
      </div>

      <BoaEliminarObservadosDialog
        id={'eliminacionObservados'}
        keepMounted={true}
        open={openEliminarObservados}
        onClose={(value) => {
          if (value) {
            refetch()
          }
          setOpenEliminarObservados(false)
        }}
        row={row}
      />
    </>
  )
}

export default EmisionPaquetesMenu

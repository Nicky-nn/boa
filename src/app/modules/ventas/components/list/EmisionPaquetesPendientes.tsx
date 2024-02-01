import { Visibility } from '@mui/icons-material'
import { Chip, Tooltip } from '@mui/material'
import React, { FunctionComponent, useState } from 'react'

import { EmisionPaquetesProps } from '../../interfaces/emisionPaquetes.interface'

interface OwnProps {
  row: EmisionPaquetesProps
}

type Props = OwnProps

const EmisionPaquetesPendientes: FunctionComponent<Props> = (props) => {
  const { row } = props
  const [open, setOpen] = useState(false)

  // Buscamos facturas pendientes
  const paquetes = row.estados?.pendientes || 0

  return (
    <>
      <Tooltip title={'Ver detalle'} placement="right" arrow>
        <Chip
          icon={<Visibility />}
          label={`${paquetes} Pendientes`}
          variant="filled"
          onClick={() => setOpen(true)}
          color={paquetes === 0 ? 'default' : 'info'}
          size="small"
        />
      </Tooltip>

      {/*
              <EmisionPaquetesPendientesDialog
        id={`detallePaquete_${row.grupo}`}
        keepMounted={true}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        row={row}
      />
       */}
    </>
  )
}

export default EmisionPaquetesPendientes

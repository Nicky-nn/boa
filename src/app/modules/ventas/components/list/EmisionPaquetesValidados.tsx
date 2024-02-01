import { Visibility } from '@mui/icons-material'
import { Chip, Tooltip } from '@mui/material'
import React, { FunctionComponent, useState } from 'react'

import { EmisionPaquetesProps } from '../../interfaces/emisionPaquetes.interface'

interface OwnProps {
  row: EmisionPaquetesProps
}

type Props = OwnProps

const EmisionPaquetesValidados: FunctionComponent<Props> = (props) => {
  const { row } = props

  const [open, setOpen] = useState(false)
  const paquetes = row.estados?.validados || 0

  return (
    <>
      <Tooltip title={'Ver detalle'} placement="right" arrow>
        <Chip
          icon={<Visibility />}
          label={`${paquetes} Validados`}
          variant="filled"
          onClick={() => setOpen(true)}
          color={paquetes === 0 ? 'default' : 'success'}
          size="small"
        />
      </Tooltip>

      {/*
              <EmisionPaquetesValidadosDialog
        row={row}
        id={`${row.grupo}_dialog`}
        open={open}
        keepMounted={true}
        onClose={() => setOpen(false)}
      />
         */}
    </>
  )
}

export default EmisionPaquetesValidados

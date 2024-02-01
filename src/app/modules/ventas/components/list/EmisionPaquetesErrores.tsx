import { Visibility } from '@mui/icons-material'
import { Chip, Tooltip } from '@mui/material'
import React, { Dispatch, FunctionComponent, SetStateAction, useState } from 'react'

import { EmisionPaquetesProps } from '../../interfaces/emisionPaquetes.interface'
import EmisionPaquetesErroresDialog from './EmisionPaquetesErroresDialog'

interface OwnProps {
  row: EmisionPaquetesProps
  refetch: Dispatch<SetStateAction<boolean>>
}

type Props = OwnProps

const EmisionPaquetesErrores: FunctionComponent<Props> = (props) => {
  const { row, refetch } = props

  const [open, setOpen] = useState(false)
  const paquetes = row.estados?.rechazados || 0

  return (
    <>
      <Tooltip title={'Ver detalle'} placement="right" arrow>
        <Chip
          icon={<Visibility />}
          label={`${paquetes} Obs. / Recha.`}
          variant="filled"
          onClick={() => setOpen(true)}
          color={paquetes === 0 ? 'default' : 'warning'}
          size="small"
        />
      </Tooltip>

      {/*
        <EmisionPaquetesErroresDialog
        row={row}
        id={`${row.grupo}_dialog`}
        open={open}
        keepMounted={true}
        onClose={(value?: boolean) => {
          if (value) {
            refetch(true)
          }
          setOpen(false)
        }}
      />
         */}
    </>
  )
}

export default EmisionPaquetesErrores

import { FormControl, Grid } from '@mui/material'
import React, { Dispatch, FunctionComponent, SetStateAction } from 'react'
import Select from 'react-select'

import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import {
  DateListAnioProps,
  DateListMesProps,
  getDateListAnios,
  getDateListMeses,
} from '../../../../services/fechas'
import { BoaPeriodoProps } from '../../interfaces/boa.interface'

interface OwnProps {
  periodo: BoaPeriodoProps
  setPeriodo: Dispatch<SetStateAction<BoaPeriodoProps>>
}

type Props = OwnProps

const BoaPeriodo: FunctionComponent<Props> = (props) => {
  const { periodo, setPeriodo } = props

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={2} md={3} xs={12}>
          <FormControl fullWidth>
            <MyInputLabel shrink>Gestión</MyInputLabel>
            <Select<DateListAnioProps>
              styles={reactSelectStyles}
              name={'gestion'}
              placeholder={'Gestión'}
              menuPosition={'fixed'}
              value={periodo.gestion}
              onChange={(oc) =>
                setPeriodo({ ...periodo, gestion: oc as DateListAnioProps })
              }
              isSearchable={false}
              options={getDateListAnios()}
              getOptionValue={(item) => item.key.toString()}
              getOptionLabel={(item) => `${item.value}`}
            />
          </FormControl>
        </Grid>
        <Grid item lg={2} md={3} xs={12}>
          <FormControl fullWidth>
            <MyInputLabel shrink>Mes</MyInputLabel>
            <Select<DateListMesProps>
              styles={reactSelectStyles}
              name={'mes'}
              placeholder={'Mes'}
              menuPosition={'fixed'}
              value={periodo.mes}
              onChange={(oc) => setPeriodo({ ...periodo, mes: oc as DateListMesProps })}
              isSearchable={false}
              options={getDateListMeses()}
              getOptionValue={(item) => item.key.toString()}
              getOptionLabel={(item) => `${item.value}`}
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  )
}

export default BoaPeriodo

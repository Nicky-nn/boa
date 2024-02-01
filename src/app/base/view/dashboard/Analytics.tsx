import { Box, Card, FormControl, Grid, Icon } from '@mui/material'
import { styled } from '@mui/system'
import { format, subYears } from 'date-fns'
import React, { FC, Fragment, useEffect, useState } from 'react'
import Select from 'react-select'
import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { EntidadInputProps } from '../../../interfaces'
import { apiReporteVentasPorGestion } from '../../../modules/reportes/api/reporteVentasPorGestion.api'
import {
  reporteVentasPorGestionCompose,
  ReporteVentasPorGestionComposeProps,
} from '../../../modules/reportes/services/reporteVentasPorGestionCompose'
import ReporteNroVentasUsuario from '../../../modules/reportes/ventasUsuario/ReporteNroVentasUsuario'
import ReporteTotalVentasUsuario from '../../../modules/reportes/ventasUsuario/ReporteTotalVentasUsuario'
import { genReplaceEmpty } from '../../../utils/helper'
import { swalException } from '../../../utils/swal'
import AlertLoading from '../../components/Alert/AlertLoading'
import SimpleContainer from '../../components/Container/SimpleContainer'
import { numberWithCommas } from '../../components/MyInputs/NumberInput'
import { reactSelectStyle } from '../../components/MySelect/ReactSelect'
import SimpleCard from '../../components/Template/Cards/SimpleCard'
import { H3 } from '../../components/Template/Typography'
import useAuth from '../../hooks/useAuth'

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '24px !important',
  background: theme.palette.background.paper,
  [theme.breakpoints.down('sm')]: {
    padding: '16px !important',
  },
}))

const ContentBox = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  '& small': {
    color: theme.palette.text.secondary,
  },
  '& .icon': {
    opacity: 0.6,
    fontSize: '44px',
    color: theme.palette.primary.main,
  },
}))

const Heading = styled('h6')(({ theme }) => ({
  margin: 0,
  marginTop: '4px',
  fontWeight: '500',
  fontSize: '20px',
  color: theme.palette.primary.main,
}))

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
}))

const SubTitle = styled('span')(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
}))

const H4 = styled('h4')(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: '500',
  marginBottom: '16px',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
}))

/**
 * @description Dashboard inicial
 * @constructor
 */
const Analytics = () => {
  // const { palette } = useTheme()
  const periodos = [
    {
      gestion: format(new Date(), 'yyyy'),
      value: format(new Date(), 'yyyy'),
    },
    {
      gestion: format(subYears(new Date(), 1), 'yyyy'),
      value: format(subYears(new Date(), 1), 'yyyy'),
    },
  ]
  const { user } = useAuth()
  const [periodo, setPeriodo] = useState(periodos[0])

  const entidad: EntidadInputProps[] = [
    { codigoSucursal: user.sucursal.codigo, codigoPuntoVenta: user.puntoVenta.codigo },
  ]

  const INIT_VALUES = {
    montoTotalFacturas: 0,
    nroTotalFacturas: 0,
    detalle: [],
  }

  const [resp, setResp] = useState<ReporteVentasPorGestionComposeProps>(INIT_VALUES)
  const [loading, setLoading] = useState(false)

  /**
   * @description Fecth de datos para generar el reporte
   * @param gestion
   * @param entidad
   */
  const fetchReporteVentas = async (gestion: number, entidad: EntidadInputProps[]) => {
    setLoading(true)
    try {
      const resp = await apiReporteVentasPorGestion(gestion, entidad)
      console.log(resp)
      if (resp.length > 0) {
        const newData = reporteVentasPorGestionCompose(resp)
        console.log(newData)
        if (newData) setResp(newData)
      } else {
        setResp(INIT_VALUES)
      }
      setLoading(false)
    } catch (e) {
      setLoading(false)
      swalException(e)
    }
  }

  useEffect(() => {
    const periodo = periodos[0]
    fetchReporteVentas(parseInt(periodo.value), entidad).then()
  }, [])

  /**
   * @description Customizamos el texto
   * @param props
   * @constructor
   */
  const CustomLabel: FC<any> = (props: any) => {
    const { x, y, stroke, value } = props

    return (
      <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">
        {value} --
      </text>
    )
  }

  /**
   * @description Customizamos la rotación del eje x
   * @param props
   * @constructor
   */
  const CustomTick: FC<any> = (props: any) => {
    const { x, y, payload } = props

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {payload.value}
        </text>
      </g>
    )
  }

  return (
    <Fragment>
      <SimpleContainer className="analytics">
        <Grid container spacing={3}>
          <Grid item lg={12}>
            <SimpleCard title={'Seleccione el periodo'}>
              <Box className={'asideSidebarFixed'}>
                <FormControl fullWidth>
                  <Select<any>
                    styles={reactSelectStyle(false)}
                    name="periodo"
                    placeholder={'Seleccione el periodo de busqueda'}
                    menuPosition={'fixed'}
                    defaultValue={periodo}
                    onChange={async (item) => {
                      await fetchReporteVentas(parseInt(item.value), entidad)
                      setPeriodo(item)
                    }}
                    isSearchable={false}
                    options={periodos}
                    getOptionValue={(item) => item.value}
                    getOptionLabel={(item) => `${item.value}`}
                  />
                </FormControl>
              </Box>
            </SimpleCard>
          </Grid>
          <Grid item lg={9} md={10} xs={12}>
            <SimpleCard
              title={`Nro. Facturas Gestión ${periodo.value}`}
              subtitle={`Sucursal ${user.sucursal.codigo}, Punto Venta: ${user.puntoVenta.codigo}`}
            >
              <Box sx={{ width: '100%' }}>
                {!loading ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart width={500} height={280} data={resp.detalle}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="mesTexto"
                        padding={{ left: 50, right: 50 }}
                        height={75}
                        tick={<CustomTick />}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        strokeWidth={1}
                        dataKey="nroAnuladas"
                        label={'Nro. Anuladas'}
                        stroke={'red'}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        label={'Nro. Pendientes'}
                        type="monotone"
                        strokeWidth={1}
                        dataKey="nroPendientes"
                        stroke="blue"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        label={'Nro. Validadas'}
                        type="monotone"
                        strokeWidth={3}
                        dataKey="nroValidadas"
                        stroke="green"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <AlertLoading />
                )}
              </Box>
            </SimpleCard>
          </Grid>
          <Grid item lg={3} md={2} xs={12}>
            <SimpleCard
              title={`RESUMEN gestión ${periodo.value}`}
              subtitle={`Sucursal ${user.sucursal.codigo}, Punto Venta: ${user.puntoVenta.codigo}`}
            >
              <Grid container spacing={3}>
                <Grid item lg={12} md={12} xs={12}>
                  <StyledCard elevation={6}>
                    <ContentBox>
                      <Icon className="icon">numbers</Icon>
                      <Box ml="12px">
                        <H3>Nro. Facturas Periodo</H3>
                        <Heading>
                          {' '}
                          {numberWithCommas(
                            genReplaceEmpty(resp.nroTotalFacturas, 0),
                            {},
                          )}
                        </Heading>
                      </Box>
                    </ContentBox>
                  </StyledCard>
                </Grid>
                <Grid item lg={12} md={12} xs={12}>
                  <StyledCard elevation={6}>
                    <ContentBox>
                      <Icon className="icon">attach_money</Icon>
                      <Box ml="12px">
                        <H3>Monto Total Periodo</H3>
                        <Heading>
                          {numberWithCommas(
                            genReplaceEmpty(resp.montoTotalFacturas, 0),
                            {},
                          )}{' '}
                          BOB
                        </Heading>
                      </Box>
                    </ContentBox>
                  </StyledCard>
                </Grid>
              </Grid>
            </SimpleCard>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <SimpleCard
              title={`Nro de facturas gestión ${periodo.value}`}
              subtitle={`Sucursal ${user.sucursal.codigo}, Punto Venta: ${user.puntoVenta.codigo}`}
            >
              {loading ? <AlertLoading /> : <ReporteNroVentasUsuario data={resp} />}
            </SimpleCard>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <SimpleCard
              title={`Total de ventas gestión ${periodo.value}`}
              subtitle={`Sucursal ${user.sucursal.codigo}, Punto Venta: ${user.puntoVenta.codigo}`}
            >
              {loading ? <AlertLoading /> : <ReporteTotalVentasUsuario data={resp} />}
            </SimpleCard>
          </Grid>
        </Grid>
      </SimpleContainer>
    </Fragment>
  )
}

export default Analytics

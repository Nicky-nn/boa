// noinspection GraphQLUnresolvedReference

import {
  MonetizationOn,
  Paid,
  PersonAddAlt1Outlined,
  TableChart,
} from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import InputNumber from 'rc-input-number'
import { FunctionComponent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'
import Select, { PropsValue, SingleValue } from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import {
  reactSelectStyle,
  reactSelectStyles,
} from '../../../../base/components/MySelect/ReactSelect'
import RepresentacionGraficaUrls from '../../../../base/components/RepresentacionGrafica/RepresentacionGraficaUrls'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { genReplaceEmpty, handleSelect, openInNewTab } from '../../../../utils/helper'
import { notError } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { genRound } from '../../../../utils/utils'
import { apiMonedas } from '../../../base/moneda/api/monedaListado.api'
import { MonedaProps } from '../../../base/moneda/interfaces/moneda'
import { fetchFacturaCreate } from '../../api/facturaCreate.api'
import { FacturaInitialValues, FacturaInputProps } from '../../interfaces/factura'
import { genCalculoTotalesService } from '../../services/operacionesService'
import { composeFactura, composeFacturaValidator } from '../../utils/composeFactura'
import { DescuentoAdicionalDialog } from './ventaTotales/DescuentoAdicionalDialog'
import { MetodoPagoProp } from '../../../base/metodoPago/interfaces/metodoPago'
import useQueryMetodosPago from '../../../base/metodoPago/hooks/useQueryMetodosPago'
import { TarjetaMask } from '../../../../base/components/Mask/TarjetaMask'
import { replace, set } from 'lodash'
import { FormTextField } from '../../../../base/components/Form'
import AsyncSelect from 'react-select/async'
import { ClienteProps } from '../../../clientes/interfaces/cliente'
import { apiClienteBusqueda } from '../../../clientes/api/clienteBusqueda.api'
import ClienteRegistroDialog from '../../../clientes/view/registro/ClienteRegistroDialog'
import ClienteExplorarDialog from '../../../clientes/components/ClienteExplorarDialog'
import Cliente99001RegistroDialog from '../../../clientes/view/registro/Cliente99001RegistroDialog'

import {
  boaAgenciaViajesListado,
  boaIataAerolineaListado,
  boaOrigenServicioListado,
  boaTipoTransaccionListado,
} from '../../api/boaIataAerolineaListado.api'
import React from 'react'
import ProveedorRegistro from '../../../Clasificador/view/IataAerRegistroDialog'
import {
  AgenciaDeViajesProps,
  AlicuotaProps,
  OrigenProps,
  TipoProps,
} from '../../../Clasificador/interfaces/alicuota.interface'
import AgenciaDeViajesDialog from '../../../Clasificador/view/AgenciaDeViajesDialog'
import OrigenDialog from '../../../Clasificador/view/OrigenDialog'
import TipoDialog from '../../../Clasificador/view/TipoDialog'
import { NumeroMask } from '../../../../base/components/MyInputs/NumeroMask'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { esES } from '@mui/x-date-pickers/locales'
import dayjs from 'dayjs'
import { apiFacturaListado } from '../../api/factura.listado.api'
import { apiFacturaListado2 } from '../../api/fcaturaListado'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps

const VentaTotales: FunctionComponent<Props> = (props) => {
  const {
    user: { moneda, monedaTienda, usuario },
  } = useAuth()
  const {
    form: {
      control,
      reset,
      watch,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props

  const mySwal = withReactContent(Swal)
  const inputMoneda = getValues('moneda')
  const tipoCambio = getValues('tipoCambio')

  const handleFocus = (event: any) => event.target.select()

  const onSubmit: SubmitHandler<FacturaInputProps> = async (data) => {
    const inputFactura = composeFactura(data)

    const validator = await composeFacturaValidator(inputFactura).catch((err: Error) => {
      notError(err.message)
    })
    if (validator) {
      await swalAsyncConfirmDialog({
        text: '¿Confirma que desea emitir el documento fiscal?',
        preConfirm: () => {
          return fetchFacturaCreate(inputFactura).catch((err) => {
            swalException(err)
            return false
          })
        },
      }).then(async (resp) => {
        if (resp.isConfirmed) {
          const { value }: any = resp
          reset({ ...FacturaInitialValues, actividadEconomica: data.actividadEconomica })
          if (value.representacionGrafica && value.representacionGrafica.pdf) {
            openInNewTab(value.representacionGrafica.pdf)
            // Resto del código...
          } else {
            console.error(
              'No se puede acceder a value.representacionGrafica.pdf porque es null o undefined',
            )
          }

          const query = 'numeroFactura=' + value.archivos[0].numeroFactura
          const x = await apiFacturaListado2(query)
          mySwal.fire({
            title: `Documento generado en Estado: ${value.estado}`,
            html: (
              <RepresentacionGraficaUrls
                representacionGrafica={x.docs[0].representacionGrafica}
              />
            ),
          })
        }
      })
    }
  }

  const {
    data: monedas,
    isLoading: monedaLoading,
    isError: monedasIsError,
    error: monedasError,
  } = useQuery<MonedaProps[], Error>(['apiMonedas'], async () => {
    const resp = await apiMonedas()
    if (resp.length > 0) {
      // monedaUsuario
      const sessionMoneda = resp.find(
        (i) => i.codigo === genReplaceEmpty(inputMoneda?.codigo, moneda.codigo),
      )
      // montoTienda
      const mt = resp.find((i) => i.codigo === monedaTienda.codigo)
      if (sessionMoneda && mt) {
        setValue('moneda', sessionMoneda)
        setValue('tipoCambio', mt.tipoCambio)
      }
      return resp
    }
    return []
  })

  const { metodosPago, mpIsError, mpError, mpLoading } = useQueryMetodosPago()
  const { form } = props

  /* OBTENIENDO DATOS DE LA API PATA IATA AEROLINA AEREA*/

  interface BoaIataAerolinea {
    // Ajusta la interfaz según la estructura de los datos que devuelve tu función
    // Aquí, se supone que los datos tienen una propiedad 'title'
    codigoIataLineaAerea: number
    codigoIata: string
    descripcion: string
  }

  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState([])

  const [optionsTransaccion, setOptionsTransaccion] = useState([])
  const [selectedOptionTransaccion, setSelectedOptionTransaccion] = useState([])

  const [optionsAgente, setoptionsAgente] = useState([])
  const [selectedOptionAgente, setSelectedOptionAgente] = useState([])

  const [optionsOrigen, setOptionsOrigen] = useState([])
  const [selectedOptionOrigen, setSelectedOptionOrigen] = useState([])

  const obtenerDatos = async () => {
    try {
      const resp = await boaIataAerolineaListado()
      const respAgente = await boaAgenciaViajesListado()
      const respOrigen = await boaOrigenServicioListado()
      const respTransaccion = await boaTipoTransaccionListado()
      setoptionsAgente(respAgente)
      setOptions(resp)
      setOptionsOrigen(respOrigen)
      setOptionsTransaccion(respTransaccion)
    } catch (error) {
      // Manejar errores, mostrar mensaje, etc.
      console.error('Error al obtener datos:', error)
    }
  }

  // Llama a obtenerDatos dentro del useEffect
  useEffect(() => {
    obtenerDatos()
  }, [])
  /* FIN OBTENIENDO DATOS DE LA API PATA IATA AEROLINA AEREA*/

  const fetchClientes = async (inputValue: string): Promise<any[]> => {
    try {
      if (inputValue.length > 2) {
        const clientes = await apiClienteBusqueda(inputValue)
        if (clientes) return clientes
      }
      return []
    } catch (e: any) {
      swalException(e)
      return []
    }
  }
  const [isChecked, setIsChecked] = useState(false)
  const [openExplorarCliente, setExplorarCliente] = useState(false)
  const [openNuevoProveedor, setOpenNuevoProveedor] = useState<boolean>(false)
  const [openNuevoAgenciaDeViajes, setOpenNuevoAgenciaDeViajes] = useState<boolean>(false)
  const [openNuevoOrigen, setOpenNuevoOrigen] = useState<boolean>(false)
  const [openNuevoTipo, setOpenTipo] = useState<boolean>(false)

  const [isCheckedExecpcion, setIsCheckedExecpcion] = useState(false)
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  const [openNuevoCliente, setNuevoCliente] = useState(false)
  const [openCliente99001, setCliente99001] = useState(false)
  const watchAllFields = watch()
  const [isDisabled, setIsDisabled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const calculoMoneda = (monto: number): number => {
    try {
      return genRound(monto / tipoCambio)
    } catch (e) {
      return monto
    }
  }

  useEffect(() => {
    const totales = genCalculoTotalesService(getValues())
    setValue('montoSubTotal', totales.subTotal)
    setValue('montoPagar', totales.montoPagar)
    setValue('inputVuelto', totales.vuelto)
    setValue('total', totales.total)
  }, [getValues('descuentoAdicional'), getValues('inputMontoPagar')])

  useEffect(() => {
    const tipoCambioValue = inputMoneda?.tipoCambio ?? 0
    setValue('tipoCambio', tipoCambioValue)
  }, [props.form, getValues('moneda')])

  const buttonStyles = {
    background: 'linear-gradient(to right, #348F50 0%, #56B4D3 51%, #348F50 100%)',
    margin: '10px',
    padding: '15px 45px',
    textAlign: 'center',
    textTransform: 'uppercase',
    transition: '0.5s',
    backgroundSize: '200% auto',
    color: 'white',
    boxShadow: '0 0 20px #eee',
    borderRadius: '10px',
    // display: 'block',
    '&:hover': {
      backgroundPosition: 'right center',
      color: '#fff',
      textDecoration: 'none',
    },
  }

  const [primerPeriodoFacturado, setPrimerPeriodoFacturado] = useState<string | null>(
    null,
  )
  useEffect(() => {
    setIsChecked(false)
    setSelectedOptionAgente([])
    setSelectedOptionOrigen([])
    setSelectedOptionTransaccion([])
    setSelectedOption([])

    // Obtén el valor actual del periodo facturado
    const periodoFacturadoActual = form.getValues('fechaEmision')
    // Cambiar el check a false
    // Si el periodo facturado actual es nulo o está vacío, establece un valor predeterminado
    if (!periodoFacturadoActual) {
      const valorPredeterminado = dayjs().format('DD/MM/YYYY HH:mm:ss')
      // Establece el valor predeterminado utilizando setValue
      form.setValue('fechaEmision', valorPredeterminado)
      setIsChecked(false)
      // Actualiza el estado con el valor predeterminado
      setPrimerPeriodoFacturado(valorPredeterminado)

      setIsCheckedExecpcion(false)
      form.setValue('codigoExcepcion', 0)

    } else {
      // Si ya hay un valor, simplemente actualiza el estado con ese valor
      setPrimerPeriodoFacturado(periodoFacturadoActual)
    }
  }, [form, form.getValues('fechaEmision')])

  return (
    <>
      <SimpleCard title="Transacción Comercial" childIcon={<MonetizationOn />}>
        {monedaLoading ? (
          <AlertLoading />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="moneda"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.moneda)}>
                    <MyInputLabel shrink>Moneda de venta</MyInputLabel>
                    <Select<MonedaProps>
                      {...field}
                      styles={{
                        ...reactSelectStyles,
                        // @ts-ignore
                        control: (styles) => ({
                          ...styles,
                          fontSize: '1.2em',
                        }),
                      }}
                      name="moneda"
                      placeholder={'Seleccione la moneda de venta'}
                      value={field.value}
                      onChange={async (val: any) => {
                        field.onChange(val)
                        setValue('tipoCambio', val.tipoCambio)
                      }}
                      onBlur={async (val) => {
                        field.onBlur()
                      }}
                      menuPosition="fixed"
                      isSearchable={false}
                      options={monedas}
                      getOptionValue={(item) => item.codigo.toString()}
                      getOptionLabel={(item) =>
                        `${item.descripcion} (${item.sigla}) - ${numberWithCommas(
                          item.tipoCambio,
                          {},
                        )}`
                      }
                    />
                    {errors.moneda && (
                      <FormHelperText>{errors.moneda?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name={'codigoMetodoPago'}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.codigoMetodoPago)}>
                    <MyInputLabel shrink>Método de Pago</MyInputLabel>
                    <Select<MetodoPagoProp>
                      {...field}
                      styles={{
                        ...reactSelectStyles,
                        // @ts-ignore
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          fontSize: '15px',
                        }),
                      }}
                      name="codigoMetodoPago"
                      placeholder={'Seleccione el método de pago'}
                      value={field.value}
                      onChange={async (val: any) => {
                        field.onChange(val)
                      }}
                      onBlur={async (val) => {
                        field.onBlur()
                      }}
                      menuPosition="fixed"
                      isSearchable={false}
                      options={metodosPago}
                      getOptionValue={(item) => item.codigoClasificador.toString()}
                      getOptionLabel={(item) =>
                        `${item.codigoClasificador} - ${item.descripcion}`
                      }
                    />
                    {errors.codigoMetodoPago && (
                      <FormHelperText>{errors.codigoMetodoPago?.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />

              {getValues('codigoMetodoPago').codigoClasificador === 2 && (
                <>
                  <Box>
                    <Controller
                      name={'numeroTarjeta'}
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          size={'small'}
                          focused
                          style={{ zIndex: 0, marginTop: 10 }}
                        >
                          <InputLabel htmlFor="formatted-text-mask-input">
                            Ingrese el Número de tarjeta
                          </InputLabel>
                          <OutlinedInput
                            label="Ingrese el Número de tarjeta"
                            {...field}
                            value={field.value || ''}
                            onChange={(event) => {
                              const numeroTarjeta = replace(
                                event.target.value,
                                new RegExp('-', 'g'),
                                '',
                              )
                                .replace(/_/g, '')
                                .trim()
                              field.onChange(numeroTarjeta)
                            }}
                            name="numeroTarjeta"
                            inputComponent={TarjetaMask as any}
                          />
                          <small>Ingrese los primeros 4 y últimos 4 dígitos</small>
                        </FormControl>
                      )}
                    />
                  </Box>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Controller
                control={control}
                name={'numeroFactura'}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={Boolean(errors.numeroFactura)}
                    fullWidth
                    name={'numeroFactura'}
                    size={'small'}
                    label="Número de Factura"
                    value={field.value || ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    helperText={errors.numeroFactura?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Controller
                name="fechaEmision"
                control={form.control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(form.formState.errors.fechaEmision)}
                  >
                    <LocalizationProvider
                      dateAdapter={AdapterDayjs}
                      localeText={
                        esES.components.MuiLocalizationProvider.defaultProps.localeText
                      }
                      adapterLocale={'es'}
                    >
                      <MobileDateTimePicker
                        defaultValue={dayjs()}
                        loading={false}
                        label="Fecha y hora de emisión"
                        sx={{ width: '100%' }}
                        views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                        onChange={(date) => {
                          form.setValue(
                            'fechaEmision',
                            date?.format('DD/MM/YYYY HH:mm:ss'),
                          )
                        }}
                      />
                    </LocalizationProvider>
                    <FormHelperText>
                      {form.formState.errors.fechaEmision?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item lg={6} md={12} xs={12}>
              <Box p={2} style={{ border: '1px dashed black', borderRadius: '8px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={9} sm={12} md={9}>
                    <Controller
                      name="cliente"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.cliente)}>
                          <MyInputLabel shrink>Búsqueda de clientes</MyInputLabel>
                          <AsyncSelect<ClienteProps>
                            {...field}
                            cacheOptions={false}
                            defaultOptions={true}
                            styles={reactSelectStyle(Boolean(errors.cliente))}
                            menuPosition={'fixed'}
                            name="clientes"
                            placeholder={'Seleccione Cliente'}
                            loadOptions={fetchClientes}
                            isClearable={true}
                            value={field.value || null}
                            getOptionValue={(item) => item.codigoCliente}
                            getOptionLabel={(item) =>
                              `${item.numeroDocumento}${item.complemento || ''} - ${
                                item.razonSocial
                              } - ${item.tipoDocumentoIdentidad.descripcion}`
                            }
                            onChange={(cliente: SingleValue<ClienteProps>) => {
                              field.onChange(cliente)
                              setValue(
                                'emailCliente',
                                genReplaceEmpty(cliente?.email, ''),
                              )
                              setIsChecked(false)
                              setValue('nombrePasajero', '')
                            }}
                            onBlur={field.onBlur}
                            noOptionsMessage={() =>
                              'Ingrese referencia -> Razón Social, Código Cliente, Número documento'
                            }
                            loadingMessage={() => 'Buscando...'}
                          />
                          <FormHelperText>{errors.cliente?.message}</FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12} md={3}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setExplorarCliente(true)}
                      startIcon={<TableChart />}
                    >
                      Explorar Clientes
                    </Button>
                  </Grid>

                  <Grid item lg={12} xs={12} md={6} sm={12} xl={4}>
                    <Controller
                      control={control}
                      name={'emailCliente'}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          error={Boolean(errors.emailCliente)}
                          fullWidth
                          name={'emailCliente'}
                          size={'small'}
                          label="Correo Electrónico Alternativo"
                          value={field.value || ''}
                          disabled={!getValues('cliente')}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          helperText={errors.emailCliente?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item lg={12} xs={12} md={3} xl={4}>
                    <Tooltip title="Nuevo Cliente">
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setNuevoCliente(true)}
                        startIcon={<PersonAddAlt1Outlined />}
                      >
                        N. Cliente
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid item lg={12} xs={12} md={3} xl={4}>
                    <Tooltip title="Nuevo Cliente 99001">
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => setCliente99001(true)}
                        // startIcon={<PersonAddAlt1Outlined />}
                      >
                        N. Cliente 99001
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Grid item lg={12}>
                    <List style={{ marginTop: -10, marginLeft: 10, padding: 0 }}>
                      <ListItem style={{ padding: 0 }}>
                        <ListItemText>
                          <strong>Nombre/Razón Social:</strong>&nbsp;&nbsp;{' '}
                          {watchAllFields.cliente?.razonSocial || ''}
                        </ListItemText>
                      </ListItem>
                      <ListItem style={{ padding: 0 }}>
                        <ListItemText>
                          <strong>Pasajero:</strong>&nbsp;&nbsp;{' '}
                          {watchAllFields.nombrePasajero || ''}
                        </ListItemText>
                      </ListItem>
                      <ListItem style={{ padding: 0 }}>
                        <ListItemText>
                          <strong>NIT/CI/CEX:</strong>&nbsp;&nbsp;{' '}
                          {watchAllFields.cliente?.numeroDocumento || ''}{' '}
                          {watchAllFields.cliente?.complemento || ''}
                        </ListItemText>
                      </ListItem>
                      <ListItem style={{ padding: 0 }}>
                        <ListItemText>
                          <strong>Correo:</strong>&nbsp;&nbsp;{' '}
                          {watchAllFields.emailCliente || ''}
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item lg={8} md={9} xs={12}>
                    <Controller
                      control={control}
                      name={'nombrePasajero'}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          error={Boolean(errors.nombrePasajero)}
                          fullWidth
                          name={'nombrePasajero'}
                          size={'small'}
                          label="Nombre Pasajero"
                          value={field.value || ''}
                          // onChange={field.onChange} // Fix: Assign a valid change event handler function here
                          onChange={(e) => {
                            field.onChange(e) // Asegúrate de llamar a field.onChange para actualizar el valor en el controlador
                            setValue('nombrePasajero', e.target.value) // Usa setValue para actualizar el valor
                          }}
                          onBlur={field.onBlur}
                          helperText={errors.nombrePasajero?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item lg={4} xs={12} md={3}>
                    <div
                      className={`checkbox-container ${isDisabled ? 'disabled' : ''}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: 'auto',
                        backgroundColor: isFocused || isHovered ? '#EDF2F7' : 'white',
                        borderRadius: '4px',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease',
                        userSelect: 'none',
                        width: '100%',
                      }}
                      onClick={() => {
                        // Si no hay nadie seleccionado en el selector de clientes, restablece el estado isChecked
                        if (!watchAllFields.cliente) {
                          setIsChecked(false)
                          setIsDisabled(true)
                        } else {
                          setIsChecked((prev) => !prev)
                          setIsDisabled(false)
                        }
                        setValue(
                          'nombrePasajero',
                          !isChecked ? watchAllFields.cliente?.razonSocial || '' : '',
                        )
                        setValue(
                          'numeroDocumentoPasajero',
                          !isChecked ? watchAllFields.cliente?.numeroDocumento || '' : '',
                        )
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    >
                      <Checkbox
                        {...label}
                        checked={isChecked}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        style={{ marginRight: '0px' }}
                      />
                      <span
                        style={{
                          marginLeft: '8px',
                          marginRight: '8px', // Agrega este estilo para establecer el margen a ambos lados
                        }}
                      >
                        Mismo Cliente
                      </span>
                    </div>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item lg={6} md={12} xs={12}>
              <Box p={2} style={{ border: '1px dashed black', borderRadius: '8px' }}>
                <Grid container spacing={2}>
                  <Grid item lg={6} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'numeroDocumentoPasajero'}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          error={Boolean(errors.numeroDocumentoPasajero)}
                          fullWidth
                          name={'numeroDocumentoPasajero'}
                          size={'small'}
                          label="Número Documento Pasajero"
                          value={field.value || ''}
                          onChange={(e) => {
                            field.onChange(e)
                            setValue('numeroDocumentoPasajero', e.target.value)
                          }}
                          onBlur={field.onBlur}
                          helperText={errors.numeroDocumentoPasajero?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={6} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'codigoIataLineaAerea'}
                      render={({ field }) => (
                        <FormControl fullWidth component={'div'}>
                          <MyInputLabel shrink>Código IATA Línea Aérea</MyInputLabel>
                          <Select
                            styles={{
                              ...reactSelectStyles,
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused
                                  ? 'grey'
                                  : errors.codigoIataLineaAerea
                                  ? 'red'
                                  : 'grey',
                                borderWidth: errors.codigoIataLineaAerea ? '2px' : '1px', // Grosor del borde
                                ':hover': {
                                  ...baseStyles[':hover'],
                                  borderColor: state.isFocused
                                    ? 'grey'
                                    : errors.codigoIataLineaAerea
                                    ? 'red'
                                    : 'grey',
                                },
                              }),
                            }}
                            menuPosition={'fixed'}
                            name="codigoIataLineaAerea"
                            placeholder={'Seleccione...'}
                            value={selectedOption}
                            onChange={(selected) => {
                              setSelectedOption(selected)
                              setValue(
                                'codigoIataLineaAerea',
                                selected?.codigoIataLineaAerea,
                              )
                            }}
                            options={options}
                            getOptionLabel={(ps) =>
                              `${ps.codigoIata}  ${ps.descripcion}  ${ps.codigoIataLineaAerea}`
                            }
                            getOptionValue={(ps) => ps.codigoIataLineaAerea.toString()}
                            isClearable={true}
                            onMenuOpen={() => obtenerDatos()}
                          />
                          {errors.codigoIataLineaAerea && (
                            <FormHelperText style={{ color: 'red' }}>
                              {errors.codigoIataLineaAerea?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />

                    <Box display="flex" justifyContent="flex-end">
                      <Link
                        component="button"
                        variant="body2"
                        sx={{ fontSize: '0.8rem' }}
                        onClick={(event) => {
                          event.preventDefault()
                          setOpenNuevoProveedor(true)
                          obtenerDatos()
                        }}
                      >
                        ¿Nuevo Código?
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item lg={6} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'codigoIataAgenteViajes'}
                      render={({ field }) => (
                        <FormControl fullWidth component={'div'}>
                          <MyInputLabel shrink>Código IATA Agente de Viajes</MyInputLabel>
                          <Select
                            styles={{
                              ...reactSelectStyles,
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused
                                  ? 'grey'
                                  : errors.codigoIataAgenteViajes
                                  ? 'red'
                                  : 'grey',
                                borderWidth: errors.codigoIataAgenteViajes
                                  ? '2px'
                                  : '1px', // Grosor del borde
                                ':hover': {
                                  ...baseStyles[':hover'],
                                  borderColor: state.isFocused
                                    ? 'grey'
                                    : errors.codigoIataAgenteViajes
                                    ? 'red'
                                    : 'grey',
                                },
                              }),
                            }}
                            // styles={reactSelectStyles}
                            menuPosition={'fixed'}
                            name="codigoIataAgenteViajes"
                            placeholder={'Seleccione...'}
                            value={selectedOptionAgente || ''}
                            onChange={(selected) => {
                              setSelectedOptionAgente(selected)
                              setValue('nitAgenteViajes', selected?.nitAgenteViajes)
                              setValue(
                                'codigoIataAgenteViajes',
                                selected?.codigoIataAgenteViajes,
                              )
                            }}
                            options={optionsAgente}
                            getOptionLabel={(ps) =>
                              `${ps.nitAgenteViajes}  ${ps.descripcion}  ${ps.codigoIataAgenteViajes}`
                            }
                            getOptionValue={(ps) => ps.codigoIataAgenteViajes}
                            isClearable={true}
                            onMenuClose={() => obtenerDatos()}
                          />

                          <FormHelperText style={{ color: 'red' }}>
                            {errors.codigoIataAgenteViajes?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                    <Box display="flex" justifyContent="flex-end">
                      <Link
                        component="button"
                        variant="body2"
                        sx={{ fontSize: '0.8rem' }} // Ajusta el tamaño de fuente según tus preferencias
                        onClick={(event) => {
                          event.preventDefault()
                          setOpenNuevoAgenciaDeViajes(true)
                          obtenerDatos()
                        }}
                      >
                        ¿Nuevo Código Agente?
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item lg={6} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'nitAgenteViajes'}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          error={Boolean(errors.nitAgenteViajes)}
                          fullWidth
                          name={'nitAgenteViajes'}
                          size={'small'}
                          label="NIT Agente de Viajes"
                          value={field.value || ''}
                          // onChange={field.onChange}
                          onChange={(e) => {
                            field.onChange(e)
                            setValue('nitAgenteViajes', e.target.value)
                          }}
                          onBlur={field.onBlur}
                          helperText={errors.nitAgenteViajes?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item lg={6} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'codigoOrigenServicio'}
                      render={({ field }) => (
                        <FormControl fullWidth component={'div'}>
                          <MyInputLabel shrink>Código Origen Servicio</MyInputLabel>
                          <Select
                            styles={{
                              ...reactSelectStyles,
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused
                                  ? 'grey'
                                  : errors.codigoOrigenServicio
                                  ? 'red'
                                  : 'grey',
                                borderWidth: errors.codigoOrigenServicio ? '2px' : '1px', // Grosor del borde
                                ':hover': {
                                  ...baseStyles[':hover'],
                                  borderColor: state.isFocused
                                    ? 'grey'
                                    : errors.codigoOrigenServicio
                                    ? 'red'
                                    : 'grey',
                                },
                              }),
                            }}
                            menuPosition={'fixed'}
                            name="codigoOrigenServicio"
                            placeholder={'Seleccione...'}
                            value={selectedOptionOrigen}
                            // onChange={(selected) => setSelectedOptionOrigen(selected)}
                            onChange={(selected) => {
                              setSelectedOptionOrigen(selected)
                              setValue(
                                'codigoOrigenServicio',
                                selected?.codigoOrigenServicio,
                              )
                            }}
                            options={optionsOrigen}
                            getOptionLabel={(ps) =>
                              `${ps.codigoOrigenServicio}  ${ps.descripcion}`
                            }
                            getOptionValue={(ps) => ps.codigoOrigenServicio}
                            isClearable={true}
                            onMenuClose={() => obtenerDatos()}
                          />
                          {errors.codigoOrigenServicio && (
                            <FormHelperText style={{ color: 'red' }}>
                              {errors.codigoOrigenServicio?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                    <Box display="flex" justifyContent="flex-end">
                      <Link
                        component="button"
                        variant="body2"
                        sx={{ fontSize: '0.8rem' }} // Ajusta el tamaño de fuente según tus preferencias
                        onClick={(event) => {
                          event.preventDefault()
                          setOpenNuevoOrigen(true)
                          obtenerDatos()
                        }}
                      >
                        ¿Nuevo Código Origen?
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item lg={6} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'codigoTipoTransaccion'}
                      render={({ field }) => (
                        <FormControl fullWidth component={'div'}>
                          <MyInputLabel shrink>Código Tipo Transacción</MyInputLabel>
                          <Select
                            // styles={reactSelectStyles}
                            styles={{
                              ...reactSelectStyles,
                              control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: state.isFocused
                                  ? 'grey'
                                  : errors.codigoOrigenServicio
                                  ? 'red'
                                  : 'grey',
                                borderWidth: errors.codigoOrigenServicio ? '2px' : '1px', // Grosor del borde
                                ':hover': {
                                  ...baseStyles[':hover'],
                                  borderColor: state.isFocused
                                    ? 'grey'
                                    : errors.codigoOrigenServicio
                                    ? 'red'
                                    : 'grey',
                                },
                              }),
                            }}
                            menuPosition={'fixed'}
                            name="codigoTipoTransaccion"
                            placeholder={'Seleccione'}
                            value={selectedOptionTransaccion}
                            // onChange={(selected) =>
                            //   setSelectedOptionTransaccion(selected)
                            // }
                            onChange={(selected) => {
                              setSelectedOptionTransaccion(selected)
                              setValue(
                                'codigoTipoTransaccion',
                                selected?.codigoTipoTransaccion,
                              )
                            }}
                            options={optionsTransaccion}
                            getOptionLabel={(ps) =>
                              `${ps.codigoTipoTransaccion}  ${ps.descripcion}`
                            }
                            getOptionValue={(ps) => ps.codigoTipoTransaccion}
                            isClearable={true}
                            onMenuClose={() => obtenerDatos()}
                          />
                          <Box display="flex" justifyContent="flex-end">
                            <Link
                              component="button"
                              variant="body2"
                              sx={{ fontSize: '0.8rem' }} // Ajusta el tamaño de fuente según tus preferencias
                              onClick={(event) => {
                                event.preventDefault()
                                setOpenTipo(true)
                                obtenerDatos()
                              }}
                            >
                              ¿Nuevo Código Transacción?
                            </Link>
                          </Box>
                          {errors.codigoTipoTransaccion && (
                            <FormHelperText style={{ color: 'red' }}>
                              {errors.codigoTipoTransaccion?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Totales Inicio */}
                  <Grid item lg={4} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'montoTarifa'}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.montoTarifa)}>
                          <InputLabel>Monto Tarifa</InputLabel>
                          <OutlinedInput
                            {...field}
                            label={'Monto Tarifa'}
                            size={'small'}
                            value={field.value?.toString()}
                            onFocus={handleSelect}
                            // onChange={field.onChange}
                            onChange={(e) => {
                              field.onChange(e)
                              setValue('montoTarifa', parseInt(e.target.value))
                            }}
                            onBlur={field.onBlur}
                            inputComponent={NumeroMask as any}
                            inputProps={{}}
                            error={Boolean(errors.montoTarifa)}
                            // endAdornment={
                            //   <InputAdornment
                            //     position="end"
                            //     style={{ fontStyle: 'italic', color: '#888' }}
                            //   >
                            //     {item.moneda.sigla + ' '}
                            //   </InputAdornment>
                            // }
                          />
                          <FormHelperText>
                            {errors.montoTarifa?.message || ''}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item lg={4} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'montoTotal'}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.montoTotal)}>
                          <InputLabel>Monto Total</InputLabel>
                          <OutlinedInput
                            {...field}
                            label={'Monto Total'}
                            size={'small'}
                            value={field.value?.toString()}
                            onFocus={handleSelect}
                            // onChange={field.onChange}
                            onChange={(e) => {
                              field.onChange(e)
                              setValue('montoTotal', parseInt(e.target.value))
                            }}
                            onBlur={field.onBlur}
                            inputComponent={NumeroMask as any}
                            inputProps={{}}
                            error={Boolean(errors.montoTotal)}
                          />
                          <FormHelperText>
                            {errors.montoTotal?.message || ''}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item lg={4} md={12} xs={12}>
                    <Controller
                      control={control}
                      name={'montoSujetoIva'}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.montoSujetoIva)}>
                          <InputLabel>Monto Sujeto al IVA</InputLabel>
                          <OutlinedInput
                            {...field}
                            label={'Monto Sujeto al IVA'}
                            size={'small'}
                            value={field.value?.toString()}
                            onFocus={handleSelect}
                            // onChange={field.onChange}
                            onChange={(e) => {
                              field.onChange(e)
                              setValue('montoSujetoIva', parseInt(e.target.value))
                              setValue('usuario', usuario)
                            }}
                            onBlur={field.onBlur}
                            inputComponent={NumeroMask as any}
                            inputProps={{}}
                            error={Boolean(errors.montoSujetoIva)}
                          />
                          <FormHelperText>
                            {errors.montoSujetoIva?.message || ''}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  {/* Totales Fin */}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                fullWidth={true}
                sx={buttonStyles}
                startIcon={<Paid />}
              >
                REALIZAR Emisión
              </Button>
            </Grid>
          </Grid>
        )}
      </SimpleCard>
      <>
        <ClienteRegistroDialog
          id={'nuevoClienteDialog'}
          keepMounted={false}
          open={openNuevoCliente}
          onClose={async (value?: ClienteProps) => {
            if (value) {
              setValue('cliente', value)
              setValue('emailCliente', value.email)
              await fetchClientes(value.codigoCliente)
              setNuevoCliente(false)
            } else {
              setNuevoCliente(false)
            }
          }}
        />
      </>
      <>
        <ClienteExplorarDialog
          id={'explorarClienteDialog'}
          keepMounted={false}
          open={openExplorarCliente}
          onClose={async (value?: ClienteProps) => {
            if (value) {
              setValue('cliente', value)
              setValue('emailCliente', value.email)
              await fetchClientes(value.codigoCliente)
              setExplorarCliente(false)
            } else {
              setExplorarCliente(false)
            }
          }}
        />
      </>
      <>
        <Cliente99001RegistroDialog
          id={'explorarClienteDialog99001'}
          keepMounted={false}
          open={openCliente99001}
          onClose={async (value?: ClienteProps) => {
            if (value) {
              setValue('cliente', value)
              setValue('emailCliente', value.email)
              await fetchClientes(value.codigoCliente)
              setCliente99001(false)
            } else {
              setCliente99001(false)
            }
          }}
        />
      </>
      <>
        <ProveedorRegistro
          id={'proveedorRegistroDialog'}
          keepMounted={false}
          open={openNuevoProveedor}
          onClose={(value?: AlicuotaProps) => {
            setOpenNuevoProveedor(false)
          }}
        />
      </>
      <>
        <AgenciaDeViajesDialog
          id="agenciaDeViajesDialog"
          keepMounted={false}
          open={openNuevoAgenciaDeViajes}
          onClose={(value?: AgenciaDeViajesProps) => {
            setOpenNuevoAgenciaDeViajes(false)
          }}
        />
      </>
      <>
        <OrigenDialog
          id="origenDialog"
          keepMounted={false}
          open={openNuevoOrigen}
          onClose={(value?: OrigenProps) => {
            setOpenNuevoOrigen(false)
          }}
        />
      </>
      <>
        <TipoDialog
          id="tipoDialog"
          keepMounted={false}
          open={openNuevoTipo}
          onClose={(value?: TipoProps) => {
            setOpenTipo(false)
          }}
        />
      </>
    </>
  )
}
export default VentaTotales


import { Delete, TextIncrease } from '@mui/icons-material'
import {
  Avatar,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material'
import InputNumber from 'rc-input-number'
import { FC, Fragment, useEffect, useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { NumeroMask } from '../../../../base/components/MyInputs/NumeroMask'
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { pFloat } from '../../../../utils/pFloat'
import { swalException } from '../../../../utils/swal'
import { apiProductosVariantesBusqueda } from '../../../productos/api/productosVariantesBusqueda.api'
import ProductoExplorarDialog from '../../../productos/components/ProductoExplorarDialog'
import { ProductoVarianteProps } from '../../../productos/interfaces/producto.interface'
import { FacturaAlquilerDetalleInput, FacturaInputProps } from '../../interfaces/factura'
import { genCalculoTotalesService } from '../../services/operacionesService'
import AgregarArticuloDialog from './AgregarArticuloDialog'
import { apiMonedas } from '../../../base/moneda/api/monedaListado.api'
import { MonedaProps } from '../../../base/moneda/interfaces/moneda'
import { genRound } from '../../../../utils/utils'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
  periodoDate: string
}

type Props = OwnProps
export const DetalleTransaccionComercial: FC<Props> = (props) => {
  const [periodoDate, setPeriodoDate] = useState('')
  const [conversion, setConversion] = useState(0)

  const {
    form: {
      control,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props
  const { user } = useAuth()
  const monedaTienda = user.monedaTienda

  const { fields, append, prepend, remove, insert, update } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'detalle', // unique name for your Field Array
  })

  const [openAgregarArticulo, setOpenAgregarArticulo] = useState(false)
  const [openExplorarProducto, setOpenExplorarProducto] = useState(false)
  const handleFocus = (event: any) => event.target.select()

  const handleChange = async (newInput: ProductoVarianteProps) => {
    if (newInput) {
      // Verificamos si ya existe el producto (no se verifica)
      const cantidadInicial = 1
      prepend({
        ...(newInput as FacturaAlquilerDetalleInput),
        codigoProductoSin: newInput.sinProductoServicio.codigoProducto,
        cantidad: 1,
        cantidadIce: 1,
        precioUnitario: newInput.precio,
        montoDescuento: 0,
        subtotal: 0,
        conversionMoneda: convertirMonedaABOB(
          newInput.precio * cantidadInicial,
          newInput.moneda.sigla,
        ),
        conversionMontoDescuento: 0,
        // descripcion: newInput.sinProductoServicio.descripcion,
      } as FacturaAlquilerDetalleInput)
      /*
      if (!producto) {

      } else {
        notDanger('El producto ya se adicionó');
      }*/
    }
  }

  // AÑADIMOS O SETEAMOS A CERO EL DETALLE EXTRA
  const handleAddDetalleExtra = (
    index: number,
    newInput: FacturaAlquilerDetalleInput,
  ) => {
    update(index, newInput)
  }

  const cargarVariantesProductos = async (inputValue: string): Promise<any[]> => {
    try {
      const productos = await apiProductosVariantesBusqueda(inputValue)
      if (productos) {
        const productosFiltrados = productos.filter(
          (producto: any) =>
            producto.sinProductoServicio.codigoActividad ===
            getValues('actividadEconomica.codigoActividad'),
        )
        return productosFiltrados
      }
      return []
    } catch (e: any) {
      swalException(e)
      return []
    }
  }
  useEffect(() => {
    const totales = genCalculoTotalesService(getValues())
    setValue('montoSubTotal', totales.subTotal)
    setValue('montoPagar', totales.montoPagar)
    setValue('inputVuelto', totales.vuelto)
    setValue('total', totales.total)
  }, [fields])

  useEffect(() => {
    if (getValues('actividadEconomica')) cargarVariantesProductos('').then()
  }, [getValues('actividadEconomica')])

  const inputMoneda = getValues('moneda')

  const [monedas, setMonedas] = useState<MonedaProps[]>([])

  useEffect(() => {
    const obtenerMoneda = async () => {
      try {
        const moneda = await apiMonedas()
        setMonedas(moneda)
      } catch (error) {
        console.log(error)
        throw error
      }
    }
    obtenerMoneda()
  }, [])

  // Función para convertir mobeda a inpitMoneda
  const convertirMoneda = (monto: number, monedaSigla: string) => {
    let monedaVenta = 0
    let monedaCompra = 0

    console.log(inputMoneda?.sigla)

    // inputMoneda?.sigla === 'BOB'

    // Si la Moneda es diferente a BOB
    // Preguntamos si moneda = moenda de la tienda
    if (monedaSigla === inputMoneda?.sigla) {
      // Mismas monedas
      // console.log(monto, monedaSigla)
      return monto
    } else {
      if (monedaSigla !== 'BOB') {
        // Convertimoos  a BOB con moneda de compra
        // antes encontramos el tipoCambio copra de monedaSigla

        monedas.forEach((moneda: any) => {
          if (moneda.sigla === monedaSigla) {
            monedaCompra = moneda.tipoCambioCompra
            monedaVenta = moneda.tipoCambio
          }
        })
        monto = monto / monedaCompra
        monedaSigla = 'BOB'

        // Preguntamos si la moneda es igual a la moneda de la tienda
        if (monedaSigla === inputMoneda?.sigla) {
          // Convertimos a la moneda de la tienda
          return monto
          // console.log(monto, monedaSigla)
        } else {
          monedas.forEach((moneda: any) => {
            if (moneda.sigla === inputMoneda?.sigla) {
              monedaVenta = moneda.tipoCambio
            }
          })

          monto = monto * monedaVenta
          return monto
          // console.log(monto, monedaSigla)
        }
      } else {
        if (inputMoneda?.sigla === 'BOB') {
          // console.log(monto, monedaSigla)
          return monto
        } else {
          // buscamos monedaventa de la tienda
          monedas.forEach((moneda: any) => {
            if (moneda.sigla === inputMoneda?.sigla) {
              monedaVenta = moneda.tipoCambio
            }
          })
          monto = monto * monedaVenta
          // console.log(monto, monedaSigla)
          return monto
        }
      }
    }
  }

  const convertirMonedaABOB3 = (monto: number, monedaSigla: string) => {
    let monedaVenta = 0
    let monedaCompra = 0
    // Si la Moneda es Boliviana
    if (monedaSigla === 'BOB') {
      return monto
    } else {
      // Convertimoos  a BOB con moneda de compra
      // antes encontramos el tipoCambio copra de monedaSigla

      monedas.forEach((moneda: any) => {
        if (moneda.sigla === monedaSigla) {
          monedaCompra = moneda.tipoCambioCompra
          monedaVenta = moneda.tipoCambio
        }
      })
      monto = monto / monedaCompra
      monedaSigla = 'BOB'
      return monto
    }
  }

  const convertirMonedaABOB = (monto: number, monedaSigla: string) => {
    try {
      let monedaVenta = 0

      // Suponiendo que 'monedas' es un array definido en algún lugar del código
      monedas.forEach((moneda: any) => {
        if (moneda.sigla === monedaSigla) {
          monedaVenta = moneda.tipoCambio
        }
      })

      if (monedaVenta !== 0) {
        return genRound(monto * 1 * genRound(monedaVenta))
      } else {
        // Manejar la situación en la que monedaVenta es cero para evitar división por cero
        console.error('Error: Tipo de cambio no disponible para la moneda especificada')
        return monto
      }
    } catch (e) {
      console.error('Error al convertir moneda:', e)
      return monto
    }
  }

  if (getValues('actividadEconomica.codigoActividad')) {
    return (
      <>
        <SimpleCard title="Servicios">
          <Grid container spacing={1}>
            <Grid item xs={12} lg={7} md={7} sm={12}>
              <FormControl fullWidth>
                <MyInputLabel shrink>Búsqueda de Servicios</MyInputLabel>
                <AsyncSelect<ProductoVarianteProps>
                  cacheOptions={false}
                  defaultOptions={false}
                  styles={reactSelectStyles}
                  menuPosition={'fixed'}
                  name="productosServicios"
                  placeholder={'Seleccione Servicio'}
                  loadOptions={cargarVariantesProductos}
                  isClearable={true}
                  value={null}
                  getOptionValue={(item) => item.codigoProducto}
                  getOptionLabel={(item) => `${item.codigoProducto} - ${item.nombre}`}
                  onChange={(val: any) => handleChange(val)}
                  noOptionsMessage={() =>
                    'Ingrese referencia al Producto/Servicio deseado'
                  }
                  loadingMessage={() => 'Buscando...'}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={5} lg={5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                <Button variant="outlined" onClick={() => setOpenExplorarProducto(true)}>
                  Explorar Servicios
                </Button>
                <Button onClick={() => setOpenAgregarArticulo(true)} variant="outlined">
                  Servicio Personalizado
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} lg={5}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{ marginRight: '8px', fontWeight: 'bold', fontSize: '15px' }}
                ></span>
              </div>
              {periodoDate && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                    Período Seleccionado:
                  </span>{' '}
                  {periodoDate}
                </div>
              )}
            </Grid>

            <Grid item xs={12}>
              <div className="responsive-table" style={{ marginTop: 20 }}>
                <table>
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: 400 }}>
                        Producto
                      </th>
                      <th scope="col" style={{ width: 160 }}>
                        Cantidad
                      </th>
                      <th scope="col" style={{ width: 160 }}>
                        Precio
                      </th>
                      <th scope="col" style={{ width: 160 }}>
                        Descuento
                      </th>
                      <th scope="col" style={{ width: 150 }}>
                        SUB Total
                      </th>
                      <th scope="col" style={{ width: 100 }}>
                        Opciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.length > 0 &&
                      fields.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td data-label="Producto">
                              <List
                                dense={true}
                                sx={{
                                  width: '400%',
                                  maxWidth: 360,
                                  bgcolor: 'background.paper',
                                  padding: 0,
                                }}
                              >
                                <ListItem alignItems="flex-start">
                                  <ListItemAvatar>
                                    <Avatar
                                      alt="Remy Sharp"
                                      // src="..//../../../../../public//assets//images//"
                                      // src="./static/images/avatar/1.jpg"
                                    />
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={
                                      <>
                                        <Typography
                                          variant="subtitle2"
                                          gutterBottom={true}
                                        >
                                          {item.nombre}{' '}
                                          <span style={{ fontWeight: 'normal' }}>
                                            {item.detalleExtra || ''}
                                          </span>
                                        </Typography>
                                      </>
                                    }
                                    secondary={
                                      <Fragment>
                                        <Typography
                                          sx={{ display: 'inline' }}
                                          component="span"
                                          variant="body2"
                                          color="text.primary"
                                        >
                                          {`Código: ${item.codigoProducto}`}
                                        </Typography>{' '}
                                        <br />
                                        {`${item.unidadMedida.descripcion || ''}`}
                                      </Fragment>
                                    }
                                  />
                                </ListItem>
                              </List>
                            </td>
                            <td data-label="CANTIDAD">
                              <OutlinedInput
                                size={'small'}
                                value={item.cantidad.toString()}
                                onFocus={handleFocus}
                                onChange={(e) => {
                                  const cantidad = pFloat(e.target.value.toString())
                                  if (cantidad >= 0) {
                                    update(index, {
                                      ...item,
                                      cantidad,
                                    })
                                  }
                                }}
                                inputComponent={NumeroMask as any}
                                inputProps={{}}
                              />
                            </td>
                            <td data-label={`PRECIO (${monedaTienda.sigla})`}>
                              <OutlinedInput
                                size={'small'}
                                value={item.precioUnitario.toString()}
                                onFocus={handleFocus}
                                endAdornment={
                                  <InputAdornment
                                    position="end"
                                    style={{ fontStyle: 'italic', color: '#888' }}
                                  >
                                    {item.moneda.sigla + ' '}
                                  </InputAdornment>
                                }
                                onChange={(e) => {
                                  const precio = pFloat(e.target.value.toString())
                                  const sigla = item.moneda.sigla
                                  if (precio >= 0 && precio >= item.montoDescuento) {
                                    update(index, {
                                      ...item,
                                      precioUnitario: precio,
                                      conversionMoneda: convertirMonedaABOB(
                                        precio,
                                        sigla,
                                      ),
                                    })
                                  } else {
                                    toast.warn(
                                      'El precio no puede ser menor al descuento',
                                    )
                                  }
                                }}
                                inputComponent={NumeroMask as any}
                                inputProps={{}}
                              />
                              {/* Etiqueta de información de conversión */}
                              <div
                                style={{
                                  fontSize: '12px',
                                  marginTop: '4px',
                                  color: '#555',
                                }}
                              >
                                {/* Conversión: {item.conversionMoneda} {inputMoneda?.sigla} */}
                                Conversión: {numberWithCommas(item.conversionMoneda, 5)}{' '}
                                {'BOB'}
                              </div>
                            </td>

                            <td data-label={`DESCUENTO (${monedaTienda.sigla})`}>
                              <OutlinedInput
                                size={'small'}
                                value={item.montoDescuento.toString()}
                                onFocus={handleFocus}
                                endAdornment={
                                  <InputAdornment
                                    position="end"
                                    style={{ fontStyle: 'italic', color: '#888' }}
                                  >
                                    {item.moneda.sigla + ' '}
                                  </InputAdornment>
                                }
                                onChange={(e) => {
                                  const montoDescuento = pFloat(e.target.value.toString())
                                  if (montoDescuento! <= item.precioUnitario) {
                                    update(index, {
                                      ...item,
                                      montoDescuento: montoDescuento!,
                                      conversionMontoDescuento: convertirMonedaABOB(
                                        montoDescuento!,
                                        item.moneda.sigla,
                                      ),
                                    })
                                  } else {
                                    toast.warn(
                                      'El descuento no puede ser mayor al precio',
                                    )
                                  }
                                }}
                                inputComponent={NumeroMask as any}
                                inputProps={{}}
                              />
                              {/* Etiqueta de información de conversión */}
                              <div
                                style={{
                                  fontSize: '12px',
                                  marginTop: '4px',
                                  color: '#555',
                                }}
                              >
                                {/* Conversión: {item.conversionMoneda} {inputMoneda?.sigla} */}
                                Conversión:{' '}
                                {numberWithCommas(item.conversionMontoDescuento, 5)}{' '}
                                {'BOB'}
                              </div>
                            </td>
                            <td
                              data-label={`SUB-TOTAL (${monedaTienda.sigla || ''})`}
                              style={{ textAlign: 'right', backgroundColor: '#fafafa' }}
                            >
                              <Typography
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                              >
                                <strong>
                                  {numberWithCommas(
                                    item.cantidad * item.precioUnitario -
                                      item.montoDescuento,
                                    {},
                                  )}
                                </strong>{' '}
                                {item.moneda.sigla}
                              </Typography>
                              <div
                                style={{
                                  fontSize: '12px',
                                  marginTop: '4px',
                                  color: '#555',
                                }}
                              >
                                {/* Conversión: {item.conversionMoneda} {inputMoneda?.sigla} */}
                                Conversión:{' '}
                                {numberWithCommas(
                                  item.cantidad * item.conversionMoneda -
                                    item.conversionMontoDescuento,
                                  5,
                                )}{' '}
                                {'BOB'}
                              </div>
                            </td>
                            <td data-label="OPCIONES" style={{ textAlign: 'right' }}>
                              <IconButton onClick={() => remove(index)}>
                                <Delete color="warning" />
                              </IconButton>
                              <IconButton
                                onClick={async () => {
                                  const { value: text } = await Swal.fire({
                                    input: 'textarea',
                                    inputLabel: 'Añadir descripción extra',
                                    inputPlaceholder: 'Ingrese su descripcion extra...',
                                    inputValue: item.detalleExtra || '',
                                    inputAttributes: {
                                      'aria-label': 'Type your message here',
                                    },
                                    showCancelButton: true,
                                    cancelButtonText: 'Cancelar',
                                    confirmButtonText: 'Agregar Descripción',
                                  })
                                  handleAddDetalleExtra(index, {
                                    ...item,
                                    detalleExtra: text || '',
                                  })
                                }}
                              >
                                <TextIncrease color="primary" />
                              </IconButton>
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </Grid>
          </Grid>
        </SimpleCard>
        <>
          <AgregarArticuloDialog
            // OPCIONES A ELEGIR PARA AGREGAR PRODUCTOS
            id={'agregarArticulo'}
            keepMounted={false}
            open={openAgregarArticulo}
            codigoActividad={getValues('actividadEconomica.codigoActividad')}
            onClose={(newProduct: any) => {
              handleChange(newProduct).then()
              setOpenAgregarArticulo(false)
            }}
          />
        </>
        <>
          <ProductoExplorarDialog
            id={'explorarProductos'}
            keepMounted={false}
            open={openExplorarProducto}
            codigoActividad={getValues('actividadEconomica.codigoActividad')}
            onClose={(newProduct?: ProductoVarianteProps[]) => {
              if (newProduct) {
                for (const pvp of newProduct) {
                  handleChange(pvp).then()
                }
              }
              setOpenExplorarProducto(false)
            }}
          />
        </>
      </>
    )
  }
  return (
    <>
      <AlertLoading />
    </>
  )
}


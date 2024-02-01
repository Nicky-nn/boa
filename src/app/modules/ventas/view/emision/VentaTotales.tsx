// noinspection GraphQLUnresolvedReference

import { MonetizationOn, Paid } from '@mui/icons-material'
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import InputNumber from 'rc-input-number'
import { FunctionComponent, useEffect, useState } from 'react'
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import AlertLoading from '../../../../base/components/Alert/AlertLoading'
import { MyInputLabel } from '../../../../base/components/MyInputs/MyInputLabel'
import { numberWithCommas } from '../../../../base/components/MyInputs/NumberInput'
import { reactSelectStyles } from '../../../../base/components/MySelect/ReactSelect'
import RepresentacionGraficaUrls from '../../../../base/components/RepresentacionGrafica/RepresentacionGraficaUrls'
import SimpleCard from '../../../../base/components/Template/Cards/SimpleCard'
import useAuth from '../../../../base/hooks/useAuth'
import { genReplaceEmpty, openInNewTab } from '../../../../utils/helper'
import { notError } from '../../../../utils/notification'
import { swalAsyncConfirmDialog, swalException } from '../../../../utils/swal'
import { genRound } from '../../../../utils/utils'
import { apiMonedas } from '../../../base/moneda/api/monedaListado.api'
import { MonedaProps } from '../../../base/moneda/interfaces/moneda'
import { fetchFacturaCreate } from '../../api/facturaCreate.api'
import { FacturaInitialValues, FacturaInputProps } from '../../interfaces/factura'
import { genCalculoTotalesService } from '../../services/operacionesService'
import { composeFactura, composeFacturaValidator } from '../../utils/composeFactura'
import { ArrendaminetoDialog } from './ventaTotales/ArrendaminetoDialog'
import { DescuentoAdicionalDialog } from './ventaTotales/DescuentoAdicionalDialog'

interface OwnProps {
  form: UseFormReturn<FacturaInputProps>
}

type Props = OwnProps

const VentaTotales: FunctionComponent<Props> = (props) => {
  const {
    user: { moneda, monedaTienda },
  } = useAuth()
  const {
    form: {
      control,
      reset,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
    },
  } = props
  const [openDescuentoAdicional, setOpenDescuentoAdicional] = useState(false)
  const [openArrendamientoFinanciero, setOpenArrendamientoFinanciero] = useState(false)

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
      }).then((resp) => {
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

          mySwal.fire({
            title: `Documento generado correctamente`,
            html: (
              <RepresentacionGraficaUrls
                representacionGrafica={value.representacionGrafica}
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
  }, [
    getValues('descuentoAdicional'),
    getValues('inputMontoPagar'),
    getValues('montoTotalArrendamientoFinanciero'),
  ])

  
  useEffect(() => {
    const tipoCambioValue = inputMoneda?.tipoCambio ?? 0
    setValue('tipoCambio', tipoCambioValue)
  }, [props.form, getValues('moneda')])

  return (
    <>
      <SimpleCard title="Cálculo de los totales" childIcon={<MonetizationOn />}>
        {monedaLoading ? (
          <AlertLoading />
        ) : (
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
                      fontWeight: 'bold',
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
        )}

        <List dense sx={{ mt: 2 }}>
          <Divider />
          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="subtitle1" gutterBottom>
                {numberWithCommas(getValues('montoSubTotal') || 0, {})}
                <span style={{ fontSize: '0.8em' }}> {'BOB'}</span>
              </Typography>
            }
          >
            <ListItemText primary={<strong>SUB-TOTAL</strong>} />
          </ListItem>

          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <>
                <Link
                  href="#"
                  onClick={() => setOpenDescuentoAdicional(true)}
                  variant="subtitle1"
                  underline="hover"
                >
                  {numberWithCommas(getValues('descuentoAdicional') || 0, {})}
                  <span style={{ fontSize: '0.8em' }}> {'BOB' || ''}</span>
                </Link>
                <DescuentoAdicionalDialog
                  id="ringtone-menu"
                  keepMounted={false}
                  open={openDescuentoAdicional}
                  onClose={(newValue) => {
                    setOpenDescuentoAdicional(false)
                    if (newValue || newValue === 0) {
                      setValue('descuentoAdicional', newValue)
                    }
                  }}
                  value={getValues('descuentoAdicional') || 0}
                />
              </>
            }
          >
            <ListItemText primary={<strong>DESCUENTO ADICIONAL</strong>} />
          </ListItem>

          {inputMoneda?.sigla === 'BOB' ? null : (
            <ListItem
              style={{ padding: 0 }}
              secondaryAction={
                <Typography gutterBottom>
                  {' '}
                  {numberWithCommas(calculoMoneda(getValues('total') || 0), {})}
                  <span style={{ fontSize: '0.8em' }}>
                    {' '}
                    {inputMoneda?.sigla || ''}
                  </span>{' '}
                </Typography>
              }
            >
              {' '}
              <ListItemText
                primary={
                  <span style={{ fontWeight: 'normal' }}>
                    {' '}
                    MONTO A PAGAR ({inputMoneda?.descripcion || ''}){' '}
                  </span>
                }
              />{' '}
            </ListItem>
          )}

          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="subtitle1" gutterBottom>
                {numberWithCommas(getValues('total') || 0, {})}
                <span style={{ fontSize: '0.8em' }}> {'BOB'}</span>
              </Typography>
            }
          >
            <ListItemText primary={<strong>TOTAL</strong>} />
          </ListItem>
          <Divider
            variant="inset"
            component="li"
            style={{ marginTop: 10, marginBottom: 20 }}
          />
          <ListItem
            style={{ padding: 0 }}
            secondaryAction={
              <Typography variant="h6" gutterBottom>
                {numberWithCommas(getValues('montoPagar') || 0, {})}
                <span style={{ fontSize: '0.8em' }}> {'BOB'}</span>
              </Typography>
            }
          >
            <ListItemText primary={<strong>MONTO A PAGAR</strong>} />
          </ListItem>
        </List>

        <Divider style={{ marginTop: 10, marginBottom: 20 }} color={'red'} />
        <Grid sx={{ flexGrow: 1 }} container spacing={3}>
          <Grid item xs={12} md={7} lg={7}>
            <Controller
              control={control}
              name={'inputMontoPagar'}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.inputMontoPagar?.message)}>
                  <MyInputLabel shrink>Ingrese Monto</MyInputLabel>
                  <InputNumber
                    {...field}
                    min={0}
                    id={'montoPagar'}
                    className="inputMontoPagar"
                    value={field.value}
                    onFocus={handleFocus}
                    onChange={(value: number | null) => {
                      field.onChange(value)
                    }}
                    formatter={numberWithCommas}
                  />
                  <FormHelperText>{errors.inputMontoPagar?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} md={5} lg={5}>
            <small>Vuelto / Saldo</small>
            <Typography variant="h6" gutterBottom mr={2} align={'right'} color={'red'}>
              {numberWithCommas(getValues('inputVuelto') || 0, {})}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              fullWidth={true}
              color="success"
              startIcon={<Paid />}
            >
              REALIZAR PAGO
            </Button>
          </Grid>
        </Grid>
      </SimpleCard>
    </>
  )
}
export default VentaTotales


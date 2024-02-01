import { Alert, Divider, FormControl, Grid, Link, Typography } from '@mui/material'
import React, { FunctionComponent, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Controller, UseFormReturn } from 'react-hook-form'
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
import { EmisionMasivaInputProps } from '../../interfaces/emisionMasiva.interface'

interface OwnProps {
  form: UseFormReturn<EmisionMasivaInputProps>
}

type Props = OwnProps

/**
 * @description Formulario de Emision Masiva
 * @param props
 * @constructor
 */
const EmisionMasivaForm: FunctionComponent<Props> = (props) => {
  const { form } = props
  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      'text/csv': ['.csv'],
    },
  })

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ))

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setValue('archivo', acceptedFiles[0])
    } else {
      setValue('archivo', null)
    }
  }, [acceptedFiles])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={1} md={12} xs={12}></Grid>
        <Grid item lg={4} md={12} xs={12}>
          <SimpleCard title={''}>
            <Alert severity="warning">
              Antes de realizar la importación de sus documentos fiscales tenga en cuenta
              lo siguiente:
            </Alert>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <ul style={{ paddingLeft: '20px' }}>
              <li>
                Debe seleccionar el Periodo <strong>Gestión</strong> Y{' '}
                <strong>Mes</strong> correctamente.
              </li>
              <li>
                Puede descargar la plantilla de importación haciendo click en el siguiente{' '}
                <Link
                  href="https://cloud.isiinvoice.net/boa/template_boa_V3.xlsx"
                  variant="body2"
                  target={'_blank'}
                >
                  enlace
                </Link>
              </li>
              <li>
                Una vez registrado sus datos, debe guardarlo como archivo{' '}
                <strong>*.csv</strong> separado por comas <strong>(;)</strong>
              </li>
              <li>
                El proceso de <strong>importación de archivo</strong> puede tardar varios
                minutos, esto en función a la cantidad de registros que contenga el
                archivo.
              </li>
              <li>
                Una vez finalizado la carga, el sistema mostrará el estado de su
                importación. <br /> <strong style={{ color: 'green' }}>ELABORADO</strong>;
                la importación no contiene ninguna observación. <br />
                <strong style={{ color: 'red' }}>OBSERVADO</strong>, se debera subsanar
                aquellas que estén observadas, una vez subsanado se deberá volver a
                realizar la importación.
              </li>
            </ul>

            <Typography variant="body1" gutterBottom>
              <strong>NOTA.</strong> El hecho de realizar una importación satisfactoria{' '}
              <strong>no significa que estas ya se encuentren validadas en el SIN</strong>
              . Para Realizar el proceso de validación deberá generar los paquetes y
              enviarlas al SIN.
            </Typography>
          </SimpleCard>
        </Grid>
        <Grid item lg={5} md={12} xs={12}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} xs={12}>
              <SimpleCard title={'PERIODO'}>
                <Grid container spacing={3}>
                  <Grid item lg={12} md={12} xs={12}>
                    <Controller
                      name={'gestion'}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <MyInputLabel shrink>Gestión</MyInputLabel>
                          <Select<DateListAnioProps>
                            {...field}
                            styles={reactSelectStyles}
                            name={'gestion'}
                            placeholder={'Gestión'}
                            menuPosition={'fixed'}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={async (val) => {
                              field.onBlur()
                            }}
                            isSearchable={false}
                            options={getDateListAnios()}
                            getOptionValue={(item) => item.key.toString()}
                            getOptionLabel={(item) => `${item.value}`}
                          />
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item lg={12} md={12} xs={12}>
                    <Controller
                      name={'mes'}
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <MyInputLabel shrink>Mes</MyInputLabel>
                          <Select<DateListMesProps>
                            {...field}
                            styles={reactSelectStyles}
                            name={'mes'}
                            placeholder={'Mes'}
                            menuPosition={'fixed'}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={async (val) => {
                              field.onBlur()
                            }}
                            isSearchable={false}
                            options={getDateListMeses()}
                            getOptionValue={(item) => item.key.toString()}
                            getOptionLabel={(item) => `${item.value}`}
                          />
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </SimpleCard>
            </Grid>

            <Grid item lg={12} md={12} xs={12}>
              <SimpleCard title={'ARCHIVO'}>
                <section className="dropZone">
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Seleccione o Arrastre su archivo *.csv</p>
                  </div>
                  <aside>
                    <h4>Archivo Seleccionado</h4>
                    <ul>{files}</ul>
                  </aside>
                </section>
              </SimpleCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default EmisionMasivaForm

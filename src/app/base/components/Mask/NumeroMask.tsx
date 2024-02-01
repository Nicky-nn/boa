import { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'
interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  scale?: number
}

/**
 * @description Parsea un Input normal en un input de tipo numerico segun las especificaciones
 * scale es la cantidad de decimales que debe aceptar, por default es 2
 */
export const NumeroMask = forwardRef<HTMLElement, CustomProps>(function TextMaskCustom(
  props,
  ref: any,
) {
  const { onChange, scale, ...other } = props
  return (
    <IMaskInput
      {...other}
      scale={scale || 2}
      thousandsSeparator={','}
      padFractionalZeros={true}
      normalizeZeros={true}
      radix={'.'}
      inputRef={ref}
      mapToRadix={['.']}
      mask={Number}
      unmask={true}
      onAccept={(value: any) => {
        onChange({ target: { name: props.name, value } })
      }}
      overwrite
    />
  )
})

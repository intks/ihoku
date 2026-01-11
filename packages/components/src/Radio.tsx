import type { ChangeEvent, ReactNode } from 'react'
import { forwardRef } from 'react'

import type { RadioProps as MuiRadioProps } from '@mui/material'
import { Radio as MuiRadio, FormControlLabel, FormHelperText, FormControl, RadioGroup } from '@mui/material'

type RadioBaseProps = Pick<
  MuiRadioProps,
  'checked' | 'defaultChecked' | 'disabled' | 'size' | 'color' | 'sx' | 'value' | 'onChange'
>

export interface RadioProps extends RadioBaseProps {
  /**
   * Radio label
   */
  label?: ReactNode
  /**
   * Helper text displayed below the radio
   */
  helperText?: string
  /**
   * Label position
   */
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom'
  /**
   * Whether to show error state
   */
  error?: boolean
}

export interface RadioGroupProps {
  /**
   * Radio group value
   */
  value?: string | number
  /**
   * Default value
   */
  defaultValue?: string | number
  /**
   * Change handler
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  /**
   * Radio options
   */
  options?: { value: string | number; label: ReactNode; disabled?: boolean }[]
  /**
   * Custom children
   */
  children?: ReactNode
  /**
   * Helper text
   */
  helperText?: string
  /**
   * Error state
   */
  error?: boolean
  /**
   * Label
   */
  label?: ReactNode
  /**
   * Row layout
   */
  row?: boolean
  /**
   * Sx prop
   */
  sx?: MuiRadioProps['sx']
}

const Radio = forwardRef<HTMLButtonElement, RadioProps>(
  ({ label, helperText, labelPlacement = 'end', error, sx, ...others }, ref) => {
    const radio = <MuiRadio ref={ref} sx={sx} {...others} />

    if (label || helperText) {
      return (
        <FormControl error={error}>
          <FormControlLabel control={radio} label={label} labelPlacement={labelPlacement} />
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      )
    }

    return radio
  }
)

Radio.displayName = 'Radio'

export const RadioGroupComponent = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, defaultValue, onChange, options, children, helperText, error, label, row, sx }, ref) => {
    return (
      <FormControl error={error} sx={sx}>
        {label && <FormControlLabel label={label} control={<div />} />}
        <RadioGroup ref={ref} value={value} defaultValue={defaultValue} onChange={onChange} row={row}>
          {children ||
            options?.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
        </RadioGroup>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    )
  }
)

RadioGroupComponent.displayName = 'RadioGroup'

export default Radio

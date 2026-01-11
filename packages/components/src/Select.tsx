import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { SelectProps as MuiSelectProps } from '@mui/material'
import { Select as MuiSelect, FormControl, FormLabel, FormHelperText, MenuItem, InputLabel } from '@mui/material'

type SelectBaseProps = Pick<
  MuiSelectProps,
  | 'value'
  | 'onChange'
  | 'disabled'
  | 'error'
  | 'fullWidth'
  | 'size'
  | 'sx'
  | 'multiple'
  | 'renderValue'
  | 'displayEmpty'
  | 'defaultValue'
>

export interface SelectOption {
  value: string | number
  label: ReactNode
  disabled?: boolean
}

export interface SelectProps extends SelectBaseProps {
  /**
   * Select label
   */
  label?: string
  /**
   * Helper text displayed below the select
   */
  helperText?: string
  /**
   * Select options
   */
  options?: SelectOption[]
  /**
   * Placeholder text
   */
  placeholder?: string
  /**
   * Whether to show label as InputLabel (floating) or FormLabel (static)
   */
  floatingLabel?: boolean
  /**
   * Custom children (overrides options)
   */
  children?: ReactNode
}

const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    { label, helperText, options, placeholder, floatingLabel = true, children, error, fullWidth = true, sx, ...others },
    ref
  ) => {
    const selectId = `select-${Math.random().toString(36).substr(2, 9)}`
    const labelId = `${selectId}-label`

    return (
      <FormControl ref={ref} fullWidth={fullWidth} error={error} sx={sx}>
        {floatingLabel && label && <InputLabel id={labelId}>{label}</InputLabel>}
        {!floatingLabel && label && <FormLabel>{label}</FormLabel>}
        <MuiSelect
          labelId={floatingLabel ? labelId : undefined}
          label={floatingLabel ? label : undefined}
          displayEmpty={!!placeholder}
          renderValue={
            placeholder
              ? (selected: unknown): ReactNode => {
                  if (selected === undefined || selected === '' || (Array.isArray(selected) && selected.length === 0)) {
                    return <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>{placeholder}</span>
                  }
                  return selected as ReactNode
                }
              : undefined
          }
          {...others}
        >
          {placeholder && (
            <MenuItem value='' disabled>
              {placeholder}
            </MenuItem>
          )}
          {children ||
            options?.map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </MenuItem>
            ))}
        </MuiSelect>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    )
  }
)

Select.displayName = 'Select'

export default Select

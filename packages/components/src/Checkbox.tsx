import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { CheckboxProps as MuiCheckboxProps } from '@mui/material'
import { Checkbox as MuiCheckbox, FormControlLabel, FormHelperText, FormControl } from '@mui/material'

type CheckboxBaseProps = Pick<
  MuiCheckboxProps,
  'checked' | 'defaultChecked' | 'disabled' | 'indeterminate' | 'size' | 'color' | 'sx' | 'onChange'
>

export interface CheckboxProps extends CheckboxBaseProps {
  /**
   * Checkbox label
   */
  label?: ReactNode
  /**
   * Helper text displayed below the checkbox
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

const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, helperText, labelPlacement = 'end', error, sx, ...others }, ref) => {
    const checkbox = <MuiCheckbox ref={ref} sx={sx} {...others} />

    if (label || helperText) {
      return (
        <FormControl error={error}>
          <FormControlLabel control={checkbox} label={label} labelPlacement={labelPlacement} />
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      )
    }

    return checkbox
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox

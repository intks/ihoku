import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { SwitchProps as MuiSwitchProps } from '@mui/material'
import { Switch as MuiSwitch, FormControlLabel, FormHelperText, FormControl } from '@mui/material'

type SwitchBaseProps = Pick<
  MuiSwitchProps,
  'checked' | 'defaultChecked' | 'disabled' | 'size' | 'color' | 'sx' | 'onChange' | 'required'
>

export interface SwitchProps extends SwitchBaseProps {
  /**
   * Switch label
   */
  label?: ReactNode
  /**
   * Helper text displayed below the switch
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

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ label, helperText, labelPlacement = 'end', error, sx, ...others }, ref) => {
    const switchComponent = <MuiSwitch ref={ref} sx={sx} {...others} />

    if (label || helperText) {
      return (
        <FormControl error={error}>
          <FormControlLabel control={switchComponent} label={label} labelPlacement={labelPlacement} />
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      )
    }

    return switchComponent
  }
)

Switch.displayName = 'Switch'

export default Switch

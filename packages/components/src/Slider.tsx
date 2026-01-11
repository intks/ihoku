import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { SliderProps as MuiSliderProps } from '@mui/material'
import { Slider as MuiSlider, Typography, Box, FormHelperText } from '@mui/material'

type SliderBaseProps = Pick<
  MuiSliderProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onChangeCommitted'
  | 'disabled'
  | 'min'
  | 'max'
  | 'step'
  | 'marks'
  | 'valueLabelDisplay'
  | 'sx'
  | 'orientation'
  | 'size'
  | 'color'
>

export interface SliderProps extends SliderBaseProps {
  /**
   * Slider label
   */
  label?: ReactNode
  /**
   * Helper text displayed below the slider
   */
  helperText?: string
  /**
   * Whether to show error state
   */
  error?: boolean
  /**
   * Show value display
   */
  showValue?: boolean
  /**
   * Custom value formatter
   */
  formatValue?: (value: number | number[]) => string
}

const Slider = forwardRef<HTMLSpanElement, SliderProps>(
  ({ label, helperText, error, showValue = false, formatValue, sx, value, ...others }, ref) => {
    const formatDisplayValue = (val: number | number[]) => {
      if (formatValue) {
        return formatValue(val)
      }
      if (Array.isArray(val)) {
        return `${val[0]} - ${val[1]}`
      }
      return String(val)
    }

    return (
      <Box sx={sx}>
        {label && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant='body2' color={error ? 'error' : 'text.primary'}>
              {label}
            </Typography>
            {showValue && value !== undefined && (
              <Typography variant='body2' color='text.secondary'>
                {formatDisplayValue(value)}
              </Typography>
            )}
          </Box>
        )}
        <MuiSlider ref={ref} value={value} {...others} />
        {helperText && (
          <FormHelperText error={error} sx={{ mt: 0.5 }}>
            {helperText}
          </FormHelperText>
        )}
      </Box>
    )
  }
)

Slider.displayName = 'Slider'

export default Slider

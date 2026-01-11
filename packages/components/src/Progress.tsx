import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type {
  LinearProgressProps as MuiLinearProgressProps,
  CircularProgressProps as MuiCircularProgressProps,
} from '@mui/material'
import { LinearProgress, CircularProgress, Box, Typography } from '@mui/material'

export interface LinearProgressProps extends Omit<MuiLinearProgressProps, 'variant'> {
  /**
   * Progress value (0-100)
   */
  value?: number
  /**
   * Buffer value (0-100)
   */
  buffer?: number
  /**
   * Show value label
   */
  showValue?: boolean
  /**
   * Custom value formatter
   */
  formatValue?: (value: number) => string
  /**
   * Label text
   */
  label?: ReactNode
  /**
   * Variant
   */
  variant?: 'determinate' | 'indeterminate' | 'buffer' | 'query'
}

export interface CircularProgressProps extends Omit<MuiCircularProgressProps, 'variant'> {
  /**
   * Progress value (0-100)
   */
  value?: number
  /**
   * Show value label
   */
  showValue?: boolean
  /**
   * Custom value formatter
   */
  formatValue?: (value: number) => string
  /**
   * Label text
   */
  label?: ReactNode
  /**
   * Variant
   */
  variant?: 'determinate' | 'indeterminate'
  /**
   * Size
   */
  size?: number | string
}

const LinearProgressComponent = forwardRef<HTMLDivElement, LinearProgressProps>(
  ({ value, buffer, showValue = false, formatValue, label, variant, sx, ...others }, ref) => {
    const displayVariant = variant || (value !== undefined ? 'determinate' : 'indeterminate')
    const displayValue = value ?? 0
    const formattedValue = formatValue ? formatValue(displayValue) : `${Math.round(displayValue)}%`

    return (
      <Box ref={ref} sx={sx}>
        {label && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant='body2'>{label}</Typography>
            {showValue && <Typography variant='body2'>{formattedValue}</Typography>}
          </Box>
        )}
        <LinearProgress
          variant={displayVariant === 'buffer' ? 'buffer' : displayVariant}
          value={displayValue}
          valueBuffer={buffer}
          {...others}
        />
      </Box>
    )
  }
)

LinearProgressComponent.displayName = 'LinearProgress'

const CircularProgressComponent = forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ value, showValue = false, formatValue, label, variant, size = 40, sx, ...others }, ref) => {
    const displayVariant = variant || (value !== undefined ? 'determinate' : 'indeterminate')
    const displayValue = value ?? 0
    const formattedValue = formatValue ? formatValue(displayValue) : `${Math.round(displayValue)}%`

    return (
      <Box ref={ref} sx={{ position: 'relative', display: 'inline-flex', ...sx }}>
        <CircularProgress variant={displayVariant} value={displayValue} size={size} {...others} />
        {showValue && displayVariant === 'determinate' && (
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant='caption' component='div' color='text.secondary'>
              {formattedValue}
            </Typography>
          </Box>
        )}
        {label && (
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant='caption'>{label}</Typography>
          </Box>
        )}
      </Box>
    )
  }
)

CircularProgressComponent.displayName = 'CircularProgress'

export { LinearProgressComponent as LinearProgress, CircularProgressComponent as CircularProgress }

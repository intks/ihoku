import type { ReactNode, SyntheticEvent, ReactElement } from 'react'
import { forwardRef } from 'react'

import type { SnackbarProps as MuiSnackbarProps, SnackbarCloseReason } from '@mui/material'
import { Snackbar as MuiSnackbar, Alert } from '@mui/material'

type SnackbarBaseProps = Pick<
  MuiSnackbarProps,
  'open' | 'onClose' | 'autoHideDuration' | 'anchorOrigin' | 'sx' | 'message' | 'action' | 'TransitionComponent'
>

export interface SnackbarProps extends Omit<SnackbarBaseProps, 'onClose'> {
  /**
   * Snackbar content
   */
  children?: ReactNode
  /**
   * Alert severity (if provided, wraps content in Alert)
   */
  severity?: 'success' | 'error' | 'warning' | 'info'
  /**
   * Alert variant
   */
  variant?: 'filled' | 'outlined' | 'standard'
  /**
   * Whether to show close button
   */
  closable?: boolean
  /**
   * Close handler
   */
  onClose?: (event: Event | SyntheticEvent, reason?: SnackbarCloseReason) => void
}

const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  ({ children, severity, variant = 'filled', closable, onClose, message, sx, ...others }, ref) => {
    const handleAlertClose = (event: SyntheticEvent<Element, Event>) => {
      onClose?.(event)
    }

    const content = severity ? (
      <Alert
        onClose={closable ? handleAlertClose : undefined}
        severity={severity}
        variant={variant}
        sx={{ width: '100%' }}
      >
        {children || message}
      </Alert>
    ) : (
      children || message
    )

    if (severity) {
      return (
        <MuiSnackbar ref={ref} onClose={onClose} sx={sx} {...others}>
          {content as ReactElement}
        </MuiSnackbar>
      )
    }

    return (
      <MuiSnackbar ref={ref} onClose={onClose} message={message} sx={sx} {...others}>
        {children as ReactElement | undefined}
      </MuiSnackbar>
    )
  }
)

Snackbar.displayName = 'Snackbar'

export default Snackbar

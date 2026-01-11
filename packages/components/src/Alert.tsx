import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { AlertProps as MuiAlertProps } from '@mui/material'
import { Alert as MuiAlert, AlertTitle } from '@mui/material'

type AlertBaseProps = Pick<
  MuiAlertProps,
  'severity' | 'variant' | 'onClose' | 'icon' | 'action' | 'sx' | 'color' | 'iconMapping'
>

export interface AlertProps extends AlertBaseProps {
  /**
   * Alert title
   */
  title?: ReactNode
  /**
   * Alert content
   */
  children?: ReactNode
  /**
   * Whether to show close button
   */
  closable?: boolean
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(({ title, children, closable, onClose, sx, ...others }, ref) => {
  return (
    <MuiAlert ref={ref} onClose={closable ? onClose : undefined} sx={sx} {...others}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  )
})

Alert.displayName = 'Alert'

export default Alert

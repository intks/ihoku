import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { TooltipProps as MuiTooltipProps } from '@mui/material'
import { Tooltip as MuiTooltip } from '@mui/material'

type TooltipBaseProps = Pick<
  MuiTooltipProps,
  | 'title'
  | 'arrow'
  | 'placement'
  | 'open'
  | 'onOpen'
  | 'onClose'
  | 'disableHoverListener'
  | 'disableFocusListener'
  | 'disableTouchListener'
  | 'sx'
  | 'enterDelay'
  | 'leaveDelay'
>

export interface TooltipProps extends TooltipBaseProps {
  /**
   * Tooltip content
   */
  children: ReactNode
  /**
   * Whether tooltip is disabled
   */
  disabled?: boolean
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(({ disabled, title, ...others }, ref) => {
  if (disabled || !title) {
    return <>{others.children}</>
  }

  return <MuiTooltip ref={ref} title={title} {...(others as Omit<MuiTooltipProps, 'title'>)} />
})

Tooltip.displayName = 'Tooltip'

export default Tooltip

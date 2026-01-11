import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { PaperProps as MuiPaperProps } from '@mui/material'
import { Paper as MuiPaper } from '@mui/material'

type PaperBaseProps = Pick<
  MuiPaperProps,
  'sx' | 'children' | 'onClick' | 'variant' | 'elevation' | 'square' | 'className'
>

export interface PaperProps extends PaperBaseProps {
  /**
   * Paper content
   */
  children?: ReactNode
  /**
   * Padding size
   */
  padding?: number | string
  /**
   * Whether to show border
   */
  bordered?: boolean
}

const Paper = forwardRef<HTMLDivElement, PaperProps>(({ padding, bordered = false, sx, children, ...others }, ref) => {
  return (
    <MuiPaper
      ref={ref}
      sx={{
        ...(padding && { p: padding }),
        ...(bordered && {
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }),
        ...sx,
      }}
      {...others}
    >
      {children}
    </MuiPaper>
  )
})

Paper.displayName = 'Paper'

export default Paper

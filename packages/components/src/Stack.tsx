import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { StackProps as MuiStackProps } from '@mui/material'
import { Stack as MuiStack } from '@mui/material'

type StackBaseProps = Pick<
  MuiStackProps,
  'direction' | 'spacing' | 'justifyContent' | 'alignItems' | 'sx' | 'children' | 'flexWrap' | 'gap'
>

export interface StackProps extends StackBaseProps {
  /**
   * Stack content
   */
  children?: ReactNode
  /**
   * Whether to use flexbox gap instead of spacing
   */
  useGap?: boolean
}

const Stack = forwardRef<HTMLDivElement, StackProps>(({ useGap, spacing, gap, sx, ...others }, ref) => {
  return (
    <MuiStack
      ref={ref}
      spacing={useGap ? undefined : spacing}
      gap={useGap ? gap || spacing : undefined}
      sx={sx}
      {...others}
    />
  )
})

Stack.displayName = 'Stack'

export default Stack

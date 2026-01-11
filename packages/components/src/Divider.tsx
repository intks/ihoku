import { forwardRef } from 'react'

import type { DividerProps as MuiDividerProps } from '@mui/material'
import { Divider as MuiDivider } from '@mui/material'

type DividerBaseProps = Pick<MuiDividerProps, 'orientation' | 'variant' | 'flexItem' | 'sx' | 'textAlign'>

export interface DividerProps extends DividerBaseProps {
  /**
   * Divider text (for vertical divider with text)
   */
  text?: string
  /**
   * Spacing around divider
   */
  spacing?: number | string
}

const Divider = forwardRef<HTMLHRElement, DividerProps>(({ text, spacing, sx, ...others }, ref) => {
  return (
    <MuiDivider
      ref={ref}
      textAlign={text ? 'center' : others.textAlign}
      sx={{
        ...(spacing && {
          my: spacing,
        }),
        ...sx,
      }}
      {...others}
    >
      {text}
    </MuiDivider>
  )
})

Divider.displayName = 'Divider'

export default Divider

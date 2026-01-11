import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { BadgeProps as MuiBadgeProps } from '@mui/material'
import { Badge as MuiBadge } from '@mui/material'

type BadgeBaseProps = Pick<
  MuiBadgeProps,
  'badgeContent' | 'color' | 'invisible' | 'max' | 'showZero' | 'variant' | 'overlap' | 'anchorOrigin' | 'sx'
>

export interface BadgeProps extends BadgeBaseProps {
  /**
   * Badge children
   */
  children?: ReactNode
  /**
   * Badge dot (small dot indicator)
   */
  dot?: boolean
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(({ dot, badgeContent, variant, ...others }, ref) => {
  return (
    <MuiBadge
      ref={ref}
      badgeContent={dot ? '' : badgeContent}
      variant={dot ? 'dot' : variant || 'standard'}
      {...others}
    />
  )
})

Badge.displayName = 'Badge'

export default Badge

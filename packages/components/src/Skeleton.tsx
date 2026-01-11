import { forwardRef } from 'react'

import type { SkeletonProps as MuiSkeletonProps } from '@mui/material'
import { Skeleton as MuiSkeleton } from '@mui/material'

type SkeletonBaseProps = Pick<MuiSkeletonProps, 'variant' | 'width' | 'height' | 'animation' | 'sx' | 'children'>

export interface SkeletonProps extends SkeletonBaseProps {
  /**
   * Number of skeleton lines (for text variant)
   */
  lines?: number
  /**
   * Whether to show circular skeleton
   */
  circular?: boolean
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', lines = 1, circular, width, height, sx, ...others }, ref) => {
    if (lines > 1 && variant === 'text') {
      return (
        <>
          {Array.from({ length: lines }).map((_, index) => (
            <MuiSkeleton
              key={index}
              ref={index === 0 ? ref : undefined}
              variant={variant}
              width={index === lines - 1 ? '80%' : width || '100%'}
              height={height}
              sx={sx}
              {...others}
            />
          ))}
        </>
      )
    }

    return (
      <MuiSkeleton
        ref={ref}
        variant={circular ? 'circular' : variant}
        width={circular ? height || width : width}
        height={circular ? height || width : height}
        sx={sx}
        {...others}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton

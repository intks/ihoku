import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { AvatarProps as MuiAvatarProps } from '@mui/material'
import { Avatar as MuiAvatar, AvatarGroup } from '@mui/material'

type AvatarBaseProps = Pick<
  MuiAvatarProps,
  'src' | 'alt' | 'sx' | 'variant' | 'sizes' | 'srcSet' | 'imgProps' | 'children'
>

export interface AvatarProps extends AvatarBaseProps {
  /**
   * Avatar size
   */
  size?: 'small' | 'medium' | 'large' | number
  /**
   * Custom size in pixels
   */
  customSize?: number
}

export interface AvatarGroupProps {
  /**
   * Maximum number of avatars to show
   */
  max?: number
  /**
   * Avatar children
   */
  children?: ReactNode
  /**
   * Spacing between avatars
   */
  spacing?: 'small' | 'medium' | number
  /**
   * Total number of avatars
   */
  total?: number
  /**
   * Sx prop
   */
  sx?: MuiAvatarProps['sx']
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ size = 'medium', customSize, sx, ...others }, ref) => {
  const sizeMap = {
    small: 32,
    medium: 40,
    large: 56,
  }

  const avatarSize = customSize || (typeof size === 'number' ? size : sizeMap[size])

  return (
    <MuiAvatar
      ref={ref}
      sx={{
        width: avatarSize,
        height: avatarSize,
        ...sx,
      }}
      {...others}
    />
  )
})

Avatar.displayName = 'Avatar'

export const AvatarGroupComponent = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, children, spacing = 'medium', total, sx }, ref) => {
    const spacingMap = {
      small: -8,
      medium: -12,
    }

    const spacingValue = typeof spacing === 'number' ? spacing : spacingMap[spacing]

    return (
      <AvatarGroup ref={ref} max={max} spacing={spacingValue} total={total} sx={sx}>
        {children}
      </AvatarGroup>
    )
  }
)

AvatarGroupComponent.displayName = 'AvatarGroup'

export default Avatar

import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { CardProps as MuiCardProps } from '@mui/material'
import { Card as MuiCard, CardContent, CardActions, CardHeader, CardMedia, Typography } from '@mui/material'

type CardBaseProps = Pick<
  MuiCardProps,
  'sx' | 'children' | 'onClick' | 'variant' | 'elevation' | 'square' | 'className'
>

export interface CardProps extends CardBaseProps {
  /**
   * Card title
   */
  title?: ReactNode
  /**
   * Card subtitle
   */
  subtitle?: ReactNode
  /**
   * Card header action (e.g., icon button)
   */
  headerAction?: ReactNode
  /**
   * Card image URL
   */
  image?: string
  /**
   * Card image alt text
   */
  imageAlt?: string
  /**
   * Card actions (buttons at the bottom)
   */
  actions?: ReactNode
  /**
   * Whether to show padding in content area
   */
  contentPadding?: boolean
  /**
   * Custom content area
   */
  content?: ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      subtitle,
      headerAction,
      image,
      imageAlt,
      actions,
      contentPadding = true,
      content,
      children,
      sx,
      ...others
    },
    ref
  ) => {
    return (
      <MuiCard ref={ref} sx={sx} {...others}>
        {(title || subtitle || headerAction) && (
          <CardHeader
            title={typeof title === 'string' ? <Typography variant='h6'>{title}</Typography> : title}
            subheader={subtitle}
            action={headerAction}
          />
        )}

        {image && <CardMedia component='img' image={image} alt={imageAlt || ''} />}

        {(content || children) && (
          <CardContent sx={contentPadding ? undefined : { p: 0, '&:last-child': { pb: 0 } }}>
            {content || children}
          </CardContent>
        )}

        {actions && <CardActions>{actions}</CardActions>}
      </MuiCard>
    )
  }
)

Card.displayName = 'Card'

export default Card

import type { ElementType } from 'react'
import { forwardRef } from 'react'

import type { ChipProps as MuiChipProps } from '@mui/material'
import { Chip as MuiChip } from '@mui/material'
import type { MouseEvent } from 'react'

type ChipBaseProps = Pick<
  MuiChipProps,
  | 'label'
  | 'color'
  | 'variant'
  | 'size'
  | 'icon'
  | 'deleteIcon'
  | 'onDelete'
  | 'disabled'
  | 'clickable'
  | 'sx'
  | 'avatar'
>

export interface ChipProps extends ChipBaseProps {
  /**
   * Whether the chip is selected
   */
  selected?: boolean
  /**
   * Click handler
   */
  onClick?: (event: MouseEvent<HTMLDivElement>) => void
  /**
   * Component to render as
   */
  component?: ElementType
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ selected = false, onClick, component, clickable, sx, ...others }, ref) => {
    const chipProps = component ? { component } : {}

    return (
      <MuiChip
        ref={ref}
        {...chipProps}
        clickable={clickable || !!onClick}
        onClick={onClick}
        sx={{
          ...(selected && {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }),
          ...sx,
        }}
        {...others}
      />
    )
  }
)

Chip.displayName = 'Chip'

export default Chip

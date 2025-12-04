import type { PopoverProps as MuiPopoverProps } from '@mui/material'
import { Popover as MuiPopover } from '@mui/material'

import type { Placement } from './Popover.style'
import { StyledArrow } from './Popover.style'

type PopoverBaseProps = Pick<
  MuiPopoverProps,
  | 'id'
  | 'open'
  | 'anchorEl'
  | 'onClick'
  | 'onClose'
  | 'children'
  | 'sx'
  | 'PaperProps'
  | 'container'
  | 'anchorOrigin'
  | 'transformOrigin'
  | 'disableScrollLock'
>

export interface PopoverProps extends PopoverBaseProps {
  placement?: Placement
  disabledArrow?: boolean
}

const getPosition = (
  arrow: string
): {
  style?: object
  anchorOrigin: MuiPopoverProps['anchorOrigin']
  transformOrigin: MuiPopoverProps['transformOrigin']
} => {
  switch (arrow) {
    case 'top-left':
      return {
        style: { ml: -0.75 },
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'left' },
      }
    case 'top-center':
      return {
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        transformOrigin: { vertical: 'top', horizontal: 'center' },
      }
    case 'bottom-left':
      return {
        style: { ml: -0.75 },
        anchorOrigin: { vertical: 'top', horizontal: 'left' },
        transformOrigin: { vertical: 'bottom', horizontal: 'left' },
      }
    case 'bottom-center':
      return {
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        transformOrigin: { vertical: 'bottom', horizontal: 'center' },
      }
    case 'bottom-right':
      return {
        style: { ml: 0.75 },
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transformOrigin: { vertical: 'bottom', horizontal: 'right' },
      }
    case 'left-top':
      return {
        style: { mt: -0.75 },
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transformOrigin: { vertical: 'top', horizontal: 'left' },
      }
    case 'left-center':
      return {
        anchorOrigin: { vertical: 'center', horizontal: 'right' },
        transformOrigin: { vertical: 'center', horizontal: 'left' },
      }
    case 'left-bottom':
      return {
        style: { mt: 0.75 },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        transformOrigin: { vertical: 'bottom', horizontal: 'left' },
      }
    case 'right-top':
      return {
        style: { mt: -0.75 },
        anchorOrigin: { vertical: 'top', horizontal: 'left' },
        transformOrigin: { vertical: 'top', horizontal: 'right' },
      }
    case 'right-center':
      return {
        anchorOrigin: { vertical: 'center', horizontal: 'left' },
        transformOrigin: { vertical: 'center', horizontal: 'right' },
      }
    case 'right-bottom':
      return {
        style: { mt: 0.75 },
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        transformOrigin: { vertical: 'bottom', horizontal: 'right' },
      }

    case 'top-right':
    default:
      return {
        style: { ml: 0.75 },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        transformOrigin: { vertical: 'top', horizontal: 'right' },
      }
  }
}

const Popover = ({ children, placement = 'top-right', disabledArrow, sx, PaperProps, ...other }: PopoverProps) => {
  const { style, anchorOrigin, transformOrigin } = getPosition(placement)
  return (
    <MuiPopover
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={{
        sx: {
          py: 1.5,
          px: 1,
          width: 200,
          overflow: 'inherit',
          ...style,
          ...sx,
        },
        ...PaperProps,
      }}
      {...other}
    >
      {!disabledArrow && <StyledArrow placement={placement} />}
      {children}
    </MuiPopover>
  )
}

export default Popover

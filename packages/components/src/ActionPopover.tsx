import type { ElementType, ReactNode, MouseEvent, SyntheticEvent, FC, SVGProps } from 'react'
import { useState, forwardRef, useImperativeHandle } from 'react'

import type { IconButtonProps, MenuItemProps, SvgIconProps, SxProps, PopoverProps } from '@mui/material'
import {
  menuItemClasses,
  SvgIcon,
  IconButton,
  Stack,
  Typography,
  MenuItem,
  Divider,
  dividerClasses,
} from '@mui/material'

import { OutlineChevronRight, OutlineMore } from '@sphere/web-icons'

import { Popover } from '../popover'

interface ActionsProps extends MenuItemProps {
  label: ReactNode
  icon?: ElementType
  endComponent?: ReactNode
  subActions?: ActionsProps[]
}

export interface ActionPopoverItemProps extends MenuItemProps {
  label: ReactNode
  icon?: ElementType
  endComponent?: ReactNode
  subActions?: ActionsProps[]
}

export const ActionPopoverItem = ({
  label,
  icon,
  color,
  endComponent,
  onClick,
  subActions,
  divider,
  sx,
  ...others
}: ActionPopoverItemProps) => {
  const [subAnchorEl, setSubAnchorEl] = useState<HTMLElement | null>(null)
  const handleSubClose = () => setSubAnchorEl(null)

  return (
    <>
      <MenuItem
        onClick={(e) => {
          if (onClick) {
            onClick(e)
          }
          if (subActions) {
            setSubAnchorEl(e.currentTarget)
          }
        }}
        sx={{
          ...sx,
          [`& + .${dividerClasses.root}`]: {
            my: 0.5,
          },
        }}
        {...others}
      >
        {icon && <SvgIcon component={icon} inheritViewBox sx={{ color: color || 'action.active', mr: 2 }} />}
        {typeof label === 'string' ? (
          <Typography variant='body2' color={color}>
            {label}
          </Typography>
        ) : (
          label
        )}
        {subActions && (
          <SvgIcon
            component={OutlineChevronRight}
            inheritViewBox
            sx={{ color: color || 'action.active', ml: 'auto' }}
          />
        )}
        {endComponent && endComponent}
        {subActions && (
          <Popover
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            id='sub-action-popover'
            open={!!subAnchorEl}
            anchorEl={subAnchorEl}
            onClose={handleSubClose}
            onClick={(e: SyntheticEvent) => {
              e.stopPropagation()
            }}
            disabledArrow
            sx={{
              ml: 0,
              mt: 0.75,
              width: 'fit-content',
              minWidth: 141,
              borderRadius: 1.5,
              [`& .${menuItemClasses.root}`]: {
                borderRadius: 0.75,
                minHeight: 36,
              },
            }}
          >
            <Stack>
              {subActions.map(({ label, onClick, ...others }, index) => {
                const handleClick = (e: MouseEvent<HTMLLIElement>) => {
                  handleSubClose()
                  onClick && onClick(e)
                }

                return <ActionPopoverItem key={index} onClick={handleClick} label={label} {...others} />
              })}
            </Stack>
          </Popover>
        )}
      </MenuItem>
      {divider && <Divider />}
    </>
  )
}

interface ActionIconProps extends IconButtonProps {
  component: ElementType
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  svgIconProps?: SvgIconProps
}

export const ActionIconButton = forwardRef<HTMLButtonElement, ActionIconProps>((props, ref) => {
  const { component, onClick, svgIconProps, sx, ...rest } = props

  return (
    <IconButton
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation()
              onClick(e)
            }
          : undefined
      }
      sx={{
        '&.Mui-disabled': {
          color: 'action.disabled',
        },
        ...sx,
      }}
      ref={ref}
      {...rest}
    >
      <SvgIcon
        component={component}
        inheritViewBox
        fontSize={svgIconProps?.fontSize ? svgIconProps.fontSize : 'small'}
        {...svgIconProps}
      />
    </IconButton>
  )
})

ActionIconButton.displayName = 'ActionIconButton'

interface ActionPopoverProps extends Omit<PopoverProps, 'open'> {
  actions: ActionsProps[]
  icon?: FC<SVGProps<SVGElement>>
  actionIcon?: Partial<ActionIconProps>
  popoverSx?: SxProps
  svgIconProps?: SvgIconProps
}

const ActionPopover = forwardRef<{ isOpen: boolean }, ActionPopoverProps>((props, ref) => {
  const { icon = OutlineMore, actionIcon, actions, popoverSx = {}, svgIconProps } = props

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const handleClose = () => setAnchorEl(null)

  useImperativeHandle(
    ref,
    () => ({
      isOpen: !!anchorEl,
    }),
    [anchorEl]
  )

  return (
    <>
      <ActionIconButton
        component={icon}
        aria-label='more'
        onClick={
          actionIcon?.disabled
            ? undefined
            : (e) => {
                e.stopPropagation()
                setAnchorEl(e.currentTarget)
              }
        }
        {...actionIcon}
        svgIconProps={svgIconProps}
      />
      <Popover
        id='action-popover'
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        onClick={(e: SyntheticEvent) => {
          e.stopPropagation()
        }}
        disabledArrow
        sx={{
          ml: 0,
          mt: 0.75,
          width: 212,
          borderRadius: 1.5,
          [`& .${menuItemClasses.root}`]: {
            borderRadius: 0.75,
            minHeight: 36,
          },
          ...popoverSx,
        }}
      >
        <Stack>
          {actions.map(({ label, onClick, ...others }, index) => {
            const handleClick = (e: MouseEvent<HTMLLIElement>) => {
              if (!others.subActions) {
                handleClose()
              }
              onClick && onClick(e)
            }

            return <ActionPopoverItem key={index} onClick={handleClick} label={label} {...others} />
          })}
        </Stack>
      </Popover>
    </>
  )
})

ActionPopover.displayName = 'ActionPopover'

export default ActionPopover

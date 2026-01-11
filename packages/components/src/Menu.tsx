import type { ReactNode, MouseEvent } from 'react'
import { forwardRef } from 'react'

import type { MenuProps as MuiMenuProps } from '@mui/material'
import { Menu as MuiMenu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material'

type MenuBaseProps = Pick<
  MuiMenuProps,
  'open' | 'onClose' | 'anchorEl' | 'anchorOrigin' | 'transformOrigin' | 'sx' | 'PaperProps' | 'MenuListProps'
>

export interface MenuItemProps {
  /**
   * Menu item label
   */
  label?: ReactNode
  /**
   * Menu item icon
   */
  icon?: ReactNode
  /**
   * Click handler
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void
  /**
   * Whether item is disabled
   */
  disabled?: boolean
  /**
   * Whether to show divider after item
   */
  divider?: boolean
  /**
   * Custom children (overrides label and icon)
   */
  children?: ReactNode
}

export interface MenuProps extends MenuBaseProps {
  /**
   * Menu items
   */
  items?: MenuItemProps[]
  /**
   * Custom children (overrides items)
   */
  children?: ReactNode
}

const Menu = forwardRef<HTMLDivElement, MenuProps>(({ items, children, onClose, sx, ...others }, ref) => {
  const handleItemClick = (item: MenuItemProps) => (event: MouseEvent<HTMLElement>) => {
    item.onClick?.(event)
    if (onClose) {
      onClose(event, 'backdropClick')
    }
  }

  return (
    <MuiMenu ref={ref} onClose={onClose} sx={sx} {...others}>
      {children ||
        items?.map((item, index) => (
          <div key={index}>
            {item.divider && index > 0 && <Divider />}
            <MenuItem onClick={handleItemClick(item)} disabled={item.disabled}>
              {item.children || (
                <>
                  {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                  {item.label && <ListItemText>{item.label}</ListItemText>}
                </>
              )}
            </MenuItem>
          </div>
        ))}
    </MuiMenu>
  )
})

Menu.displayName = 'Menu'

export default Menu

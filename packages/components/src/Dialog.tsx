import type { ReactNode } from 'react'
import { forwardRef } from 'react'

import type { DialogProps as MuiDialogProps } from '@mui/material'
import {
  Box,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { dialogClasses } from '@mui/material/Dialog'
import Button from './Button'
import type { ButtonProps } from './Button'

export interface DialogActionProps extends ButtonProps {
  label: string
}

type DialogBaseProps = Pick<
  MuiDialogProps,
  'sx' | 'children' | 'fullScreen' | 'scroll' | 'onClose' | 'disableEnforceFocus' | 'onClick' | 'maxWidth' | 'container'
>

export interface DialogProps extends DialogBaseProps {
  /**
   * The "open" content is a parameter used to display the dialog.
   */
  open: boolean
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose: () => void
  /**
   * The "width" content is a parameter used to set the width of dialog.
   */
  width?: string | number
  /**
   * The "title" content is a parameter used to set the title of dialog.
   */
  title?: ReactNode
  /**
   * The "subtitle" content is a parameter used to set the subtitle of dialog.
   */
  subtitle?: ReactNode
  /**
   * The "description" content is a parameter used to set the description of dialog.
   */
  description?: string
  /**
   * The "actions" content is a parameter for buttons used to display the interactive area below the dialog.
   */
  actions?: DialogActionProps[] | ReactNode
  /**
   * The "enabledBackdropClick" content is a parameter used to make the dialog close when the backdrop is clicked.
   */
  enabledBackdropClick?: boolean
}

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    { open, onClose, width, title, subtitle, description, children, actions, sx, enabledBackdropClick, ...others },
    ref
  ) => {
    const handleClose = (e: MouseEvent, reason: string) => {
      if ((!enabledBackdropClick && reason === 'backdropClick') || reason === 'escapeKeyDown') {
        e.preventDefault()
      } else {
        onClose()
      }
    }

    return (
      <MuiDialog
        open={open}
        role='dialog'
        fullWidth
        sx={{
          [`& .${dialogClasses.paper}`]: {
            maxWidth: width ? width : '560px',
            width: 'calc(100% - 64px)',
          },
          ...sx,
        }}
        onClose={handleClose}
        disableScrollLock
        {...others}
      >
        {(title || subtitle) && (
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              {title && (
                <Typography variant='h6' component='div'>
                  {title}
                </Typography>
              )}
              {subtitle}
            </Box>
          </DialogTitle>
        )}

        <DialogContent dividers ref={ref}>
          {description && (
            <DialogContentText variant='body2' color='inherit' sx={{ mb: 3 }}>
              {description}
            </DialogContentText>
          )}
          {children}
        </DialogContent>

        {actions && (
          <DialogActions>
            {Array.isArray(actions)
              ? actions.map(({ label, ...actOthers }, idx) => (
                  <Button key={`dialog-button-${idx}`} {...actOthers}>
                    {label}
                  </Button>
                ))
              : actions}
          </DialogActions>
        )}
      </MuiDialog>
    )
  }
)

export default Dialog

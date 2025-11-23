import type { ElementType } from 'react'

import type { ButtonProps as MuiButtonProps } from '@mui/material'
import { CircularProgress, Button as MuiButton } from '@mui/material'

type ButtonBaseProps = Pick<
  MuiButtonProps,
  | 'variant'
  | 'size'
  | 'color'
  | 'disabled'
  | 'children'
  | 'startIcon'
  | 'endIcon'
  | 'onClick'
  | 'sx'
  | 'fullWidth'
  | 'type'
  | 'form'
  | 'disableRipple'
>

export interface ButtonProps extends ButtonBaseProps {
  loading?: boolean
  component?: ElementType
}

// Reference as: https://stackoverflow.com/a/69484275/11835355
// Google Translate issue: https://github.com/mui/material-ui/issues/27853
// Loading button reference: https://v6.mui.com/material-ui/api/button/#button-prop-loading
const Button = (props: ButtonProps) => {
  const { disabled, loading = false, children, startIcon, ...rest } = props

  return (
    <MuiButton disabled={disabled || loading} startIcon={!loading && startIcon} {...rest}>
      {loading ? (
        <>
          <span style={{ opacity: 0 }}>{children}</span>
          <CircularProgress sx={{ position: 'absolute' }} color='inherit' size='1rem' />
        </>
      ) : (
        <span>{children}</span>
      )}
    </MuiButton>
  )
}

export default Button

import type { ReactNode } from 'react'

import type { InputAdornmentProps as MuiInputAdornmentProps } from '@mui/material'
import { InputAdornment as MuiInputAdornment } from '@mui/material'
import { typographyClasses } from '@mui/material/Typography'

interface InputAdornmentProps extends MuiInputAdornmentProps {
  multiline?: boolean
  error?: boolean
  children: ReactNode
}

export const InputAdornment = ({
  position,
  multiline = false,
  error = false,
  children,
  sx,
  ...others
}: InputAdornmentProps) => {
  return (
    <MuiInputAdornment
      position={position}
      sx={{
        ...(position === 'end' && { mr: 0 }),
        ...(multiline && { alignSelf: 'end' }),
        [`.${typographyClasses.root}`]: {
          typography: position === 'end' ? 'caption' : 'body1',
          ...(error ? { color: 'error.main' } : {}),
        },
        ...sx,
      }}
      {...others}
    >
      {children}
    </MuiInputAdornment>
  )
}

export default InputAdornment

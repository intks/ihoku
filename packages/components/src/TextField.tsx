import type { ChangeEvent } from 'react'
import { forwardRef } from 'react'

import type {
  InputProps as MuiInputProps,
  BaseTextFieldProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
} from '@mui/material'
import { TextField as MuiTextField, SvgIcon } from '@mui/material'

import { FillEye, FillEyeOff } from '@sphere/web-icons'

import { useDisclosure } from '../../hooks'
import { IconButton } from '../icon-button'
import { InputAdornment } from '../input-adornment'

type InputProps = MuiInputProps | FilledTextFieldProps['InputProps'] | OutlinedTextFieldProps['InputProps']

export interface TextFieldProps extends BaseTextFieldProps {
  label?: string
  value?: any
  error?: boolean
  helperText?: string
  multiline?: boolean
  maxRows?: number
  minRows?: number
  /**
   * If a value is provided, an Adornment with length restriction will be displayed.
   * @default undefined
   */
  maxLength?: number
  /**
   * This onChange event receives the onchange event type from InputProps, OutlinedInputProps, and FilledInputProps.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  /**
   * Props applied to the Input element. It will be a FilledInput, OutlinedInput or Input component depending on the variant prop value.
   */
  InputProps?: InputProps
}

const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  ({ value, maxLength, multiline, label, error, helperText, InputProps, type, ...others }, ref) => {
    const { endAdornment, ...otherInputProps } = InputProps ?? {}

    const { isOpen: isShowPassword, onToggle: onToggleShowPassword } = useDisclosure()

    const isPassword = type === 'password'
    const inputType = isPassword && isShowPassword ? 'text' : type

    return (
      <MuiTextField
        ref={ref}
        fullWidth
        multiline={multiline}
        label={label}
        helperText={helperText}
        error={error}
        value={value}
        type={inputType}
        InputProps={{
          endAdornment: (
            <>
              {typeof maxLength === 'number' && (
                <InputAdornment position='end' multiline={multiline} error={!!error}>
                  {`${value?.length ?? 0}/${maxLength}`}
                </InputAdornment>
              )}

              {isPassword && (
                <InputAdornment position='end'>
                  <IconButton onClick={onToggleShowPassword} edge='end'>
                    <SvgIcon component={isShowPassword ? FillEye : FillEyeOff} />
                  </IconButton>
                </InputAdornment>
              )}

              {endAdornment}
            </>
          ),
          ...otherInputProps,
        }}
        {...others}
      />
    )
  }
)

TextField.displayName = 'TextField'

export default TextField

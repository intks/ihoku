import type { ChangeEvent } from 'react'
import type { Control } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import type { TextFieldProps } from './TextField'
import TextField from './TextField'

export interface RHFTextFieldProps extends TextFieldProps {
  control: Control<any>
  name: string
  helperTextEnabled?: boolean
  onFieldChange?: (value: ChangeEvent<HTMLInputElement>) => void
}

const RHFTextField = ({
  control,
  name,
  helperText,
  helperTextEnabled = true,
  onFieldChange,
  ...others
}: RHFTextFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ...restField }, fieldState: { error } }) => {
        return (
          <TextField
            error={!!error}
            helperText={(helperTextEnabled ? error?.message : '') || helperText}
            onChange={(value) => {
              onChange(value)
              onFieldChange?.(value)
            }}
            {...restField}
            {...others}
          />
        )
      }}
    />
  )
}

export default RHFTextField

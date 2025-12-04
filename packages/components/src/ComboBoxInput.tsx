import type { AutocompleteRenderInputParams, TextFieldProps } from '@mui/material'
import { CircularProgress, TextField } from '@mui/material'

export type ComboBoxRenderInputProps = {
  loading?: boolean
} & TextFieldProps &
  AutocompleteRenderInputParams

const ComboBoxInput = (props: ComboBoxRenderInputProps) => {
  const { loading, InputProps, ...rest } = props
  return (
    <TextField
      {...rest}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <>
            {loading && <CircularProgress size={20} sx={{ color: 'text.secondary' }} />}
            {InputProps.endAdornment}
          </>
        ),
      }}
    />
  )
}

export default ComboBoxInput

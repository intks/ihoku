import type { ReactNode } from 'react'
import type { Control } from 'react-hook-form'
import { useController } from 'react-hook-form'

import type { SxProps, Theme, AutocompleteRenderInputParams } from '@mui/material'

import type { ComboBoxProps } from './ComboBox'
import ComboBox from './ComboBox'
import ComboBoxInput from './ComboBoxInput'

export interface RHFComboBoxProps extends Omit<ComboBoxProps, 'id' | 'value'> {
  control: Control<any>
  name: string
  required?: boolean
  helperText?: ReactNode
  inputSx?: SxProps<Theme>
}

const RHFComboBox = ({
  control,
  name,
  label,
  options,
  required,
  multiple,
  helperText,
  hasSelectAll,
  placeholder,
  allDropdownOptionLabel,
  inputSx,
  groupLabelSx,
  groupItemSx,
  type,
  freeSolo,
  onChange,
  loading,
  renderOption,
  sx,
  inputPlaceholder,
  onAllOptionChange,
  clearIcon,
  ...others
}: RHFComboBoxProps) => {
  const {
    field: { onChange: onFieldChange, ...otherFields },
    fieldState: { error },
  } = useController({
    control,
    name,
    defaultValue: multiple || hasSelectAll ? [] : {},
  })

  const renderInput = (params: AutocompleteRenderInputParams) => (
    <ComboBoxInput
      {...params}
      placeholder={inputPlaceholder}
      sx={inputSx}
      label={label}
      required={required}
      error={!!error}
      helperText={error?.message || helperText}
      loading={loading}
    />
  )

  return (
    <ComboBox
      id={`combo-box-${name}`}
      multiple={multiple || hasSelectAll}
      options={options}
      renderInput={(params: AutocompleteRenderInputParams) => renderInput(params)}
      groupLabelSx={groupLabelSx}
      groupItemSx={groupItemSx}
      allDropdownOptionLabel={allDropdownOptionLabel}
      hasSelectAll={hasSelectAll}
      placeholder={placeholder}
      renderOption={renderOption}
      type={type}
      freeSolo={freeSolo}
      sx={sx}
      onChange={onChange}
      onFieldChange={onFieldChange}
      clearIcon={clearIcon}
      onAllOptionChange={onAllOptionChange}
      loading={loading}
      {...otherFields}
      {...others}
    />
  )
}

export default RHFComboBox

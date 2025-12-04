import type { SyntheticEvent, ReactNode, HTMLAttributes, MouseEvent } from 'react'
import { forwardRef, Fragment, useEffect } from 'react'

import type {
  SxProps,
  Theme,
  AutocompleteRenderInputParams,
  AutocompleteRenderGroupParams,
  AutocompleteRenderOptionState,
  AutocompleteRenderGetTagProps,
  FilterOptionsState,
} from '@mui/material'
import {
  Box,
  autocompleteClasses,
  Autocomplete,
  ListItem as MuiListItem,
  listItemClasses,
  Chip,
  Divider,
  Typography,
  alpha,
  Stack,
  SvgIcon,
} from '@mui/material'

import { OutlineAdd, OutlineChevronDown } from '@sphere/web-icons'

import ComboBoxGroup from './ComboBoxGroup'
import ComboBoxInput from './ComboBoxInput'
import ComboBoxListItem, {
  ComboBoxListItemCheckBox,
  ComboBoxListItemLabel,
  ComboBoxListItemStack,
} from './ComboBoxListItem'

export interface Option {
  label: string
  value: string | number
  groupLabel?: string
  latestUpdated?: string
  email?: string
}

interface TriggerProps {
  label: string
  onClick: () => void
}

type CustomListboxProps = HTMLAttributes<HTMLUListElement> & { trigger?: TriggerProps }

export interface ComboBoxProps {
  id: string
  value: Option | Option[] | null
  options: Option[]
  label?: string | ReactNode
  defaultValue?: Option | Option[] | null
  freeSolo?: boolean
  onFieldChange?: (value: Option | Option[]) => void
  onAllOptionChange?: (options: Option[]) => void
  onChange?: (event: SyntheticEvent, value: Option | Option[]) => void
  renderInput?: (params: AutocompleteRenderInputParams) => ReactNode
  renderOption?: (props: any, option: Option, state: AutocompleteRenderOptionState) => ReactNode
  hasSelectAll?: boolean
  placeholder?: string
  multiple?: boolean
  allDropdownOptionLabel?: string
  groupLabelSx?: SxProps<Theme>
  groupItemSx?: SxProps<Theme>
  type?: 'filter'
  sx?: SxProps<Theme>
  size?: 'medium' | 'small'
  limitTags?: number
  noOptionsText?: string
  ListboxProps?: CustomListboxProps
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  componentsProps?: { clearIndicator?: object; paper?: object; popper?: object; popupIndicator?: object }
  isOptionEqualToValue?: (option: Option, value: Option) => boolean
  disableClearable?: boolean
  inputPlaceholder?: string
  helperText?: ReactNode
  inputValue?: string
  clearIcon?: ReactNode | null
  filterOptions?: (options: Option[], state: FilterOptionsState<Option>) => Option[]
  onInputChange?: (event: SyntheticEvent, newInputValue: string, reason: string) => void
  renderTags?: (value: any[], getTagProps: AutocompleteRenderGetTagProps) => React.ReactNode
  onOpen?: ((event: SyntheticEvent<Element, Event>) => void) | undefined
  onClose?: ((event: SyntheticEvent<Element, Event>) => void) | undefined
}

const CustomListbox = forwardRef<HTMLUListElement, CustomListboxProps>((props, ref) => {
  const { children, trigger, ...other } = props

  return (
    <Box
      sx={{
        position: 'relative',
        maxHeight: 'inherit',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ul
        {...other}
        ref={ref}
        style={{
          overflow: 'auto',
          flexGrow: 1,
          margin: 0,
          padding: 0,
        }}
      >
        {children}
      </ul>
      {trigger && (
        <Box
          component='button'
          type='button'
          sx={{
            position: 'sticky',
            bottom: 0,
            width: '100%',
            backgroundColor: 'background.paper',
            p: (theme) => theme.spacing(1.5, 1),
            border: 'none',
            borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.48)}`,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onMouseDown={(e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
            trigger.onClick()
          }}
          aria-label={trigger.label}
          data-testid='trigger-button'
        >
          <Stack direction='row' alignItems='center' sx={{ py: 0.8 }}>
            <SvgIcon component={OutlineAdd} fontSize='xs' sx={{ color: 'grey.600', mr: 1 }} />
            <Typography variant='body2'>{trigger.label}</Typography>
          </Stack>
        </Box>
      )}
    </Box>
  )
})

const ComboBox = forwardRef<HTMLLIElement, ComboBoxProps>(
  (
    {
      id,
      options,
      label,
      renderInput,
      renderOption,
      hasSelectAll,
      placeholder = '',
      allDropdownOptionLabel = 'All',
      noOptionsText = 'No options',
      multiple,
      onFieldChange,
      onChange,
      groupLabelSx,
      groupItemSx,
      value,
      type,
      sx,
      freeSolo,
      inputPlaceholder,
      clearIcon,
      onAllOptionChange,
      size,
      ListboxProps,
      helperText,
      loading,
      ...others
    },
    ref
  ) => {
    const allOption = {
      label: allDropdownOptionLabel,
      value: 'all',
    }
    const placeholderOption = {
      label: placeholder,
      value: 'placeholder',
    }
    const isSelectAll = !!(Array.isArray(value) && hasSelectAll && value.length === options.length)

    const renderTags = (_: Option[], getTagProps: AutocompleteRenderGetTagProps) => {
      return [allOption].map((_: Option, index: number) => (
        <Chip {...getTagProps({ index })} key={index} label={allDropdownOptionLabel} size={size} onDelete={undefined} />
      ))
    }

    const renderOptions = (
      props: HTMLAttributes<HTMLLIElement>,
      option: Option,
      state: AutocompleteRenderOptionState
    ) => {
      if (placeholder && option.value === placeholderOption.value) {
        return (
          <MuiListItem
            {...props}
            key={option.value}
            aria-disabled
            sx={{
              [`&.${listItemClasses.root}`]: {
                p: 1,
                color: 'grey.500',
                '&[aria-disabled="true"]': {
                  opacity: 1,
                },
              },
            }}
          >
            {placeholderOption.label}
          </MuiListItem>
        )
      }
      if (hasSelectAll && option.value === allOption.value)
        return (
          <Fragment key={allOption.value}>
            <ComboBoxListItem
              {...props}
              aria-selected={isSelectAll}
              onClick={() => {
                onAllOptionChange?.(isSelectAll ? [] : options)
                onFieldChange?.(isSelectAll ? [] : options)
              }}
            >
              <ComboBoxListItemStack>
                <ComboBoxListItemCheckBox checked={isSelectAll} />
                <ComboBoxListItemLabel label={option.label} />
              </ComboBoxListItemStack>
            </ComboBoxListItem>
            <Divider />
          </Fragment>
        )

      if (renderOption) {
        return renderOption(props, option, state)
      }

      if (hasSelectAll || multiple) {
        return (
          <ComboBoxListItem {...props} key={props.id}>
            <ComboBoxListItemStack>
              <ComboBoxListItemCheckBox checked={state.selected} />
              <ComboBoxListItemLabel label={option.label} />
            </ComboBoxListItemStack>
          </ComboBoxListItem>
        )
      }

      return (
        <li {...props} key={props.id}>
          <ComboBoxListItemStack>
            <ComboBoxListItemLabel label={option.label} />
          </ComboBoxListItemStack>
        </li>
      )
    }

    const getOptions = () => {
      if (options.length === 0) return options

      return [...(placeholder ? [placeholderOption] : []), ...(hasSelectAll ? [allOption] : []), ...options]
    }

    // Note: If the value is a array, it is included the new added option at this time.
    const handleChange = (event: SyntheticEvent, value: Option | Option[]) => {
      if (Array.isArray(value)) {
        const inputValue = value.at(-1)
        if (inputValue && typeof inputValue === 'string') {
          const hasDuplicated = value
            .slice(0, -1)
            .some((option) => (typeof option === 'object' ? option.value === inputValue : option === inputValue))

          // if current value already has a same option as the lastTime, maintain original field value.
          if (hasDuplicated) {
            onFieldChange?.(value.slice(0, -1))
            return
          }

          // New added option(inputValue) from freeSolo input
          onFieldChange?.([...value.slice(0, -1), { label: inputValue, value: inputValue }])
          onChange?.(event, [...value.slice(0, -1), { label: inputValue, value: inputValue }])
          return
        }
      }

      onFieldChange?.(value)
      onChange?.(event, value)
    }

    useEffect(() => {
      if (
        options.length > 0 &&
        Array.isArray(value) &&
        options.length !== value.length &&
        hasSelectAll &&
        isSelectAll
      ) {
        onFieldChange?.(options)
      }
    }, [options, hasSelectAll, isSelectAll, onFieldChange, value])

    return (
      <Autocomplete
        ref={ref}
        id={id}
        value={value}
        freeSolo={freeSolo}
        selectOnFocus={freeSolo}
        clearOnBlur={freeSolo}
        multiple={multiple || hasSelectAll}
        disableCloseOnSelect={multiple && !freeSolo}
        options={getOptions()}
        loading={loading}
        noOptionsText={
          ListboxProps?.trigger ? (
            <CustomListbox trigger={ListboxProps.trigger}>
              {noOptionsText && (
                <Typography
                  variant='body2'
                  sx={{
                    p: 2,
                    color: 'text.secondary',
                  }}
                >
                  {noOptionsText}
                </Typography>
              )}
            </CustomListbox>
          ) : (
            noOptionsText
          )
        }
        // @ts-ignore
        onChange={handleChange}
        {...(hasSelectAll &&
          isSelectAll && {
            renderTags: (value: Option[], getTagProps: AutocompleteRenderGetTagProps) => renderTags(value, getTagProps),
          })}
        {...(options.find((option: Option) => !!option.groupLabel) && {
          groupBy: (option: Option) => option.groupLabel ?? '',
        })}
        getOptionLabel={(option: Option | string) => (typeof option === 'object' ? option.label : option) ?? ''}
        isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value}
        renderInput={(params) =>
          renderInput?.(params) || (
            <ComboBoxInput {...params} label={label} placeholder={inputPlaceholder} helperText={helperText} />
          )
        }
        popupIcon={<OutlineChevronDown />}
        renderGroup={(params: AutocompleteRenderGroupParams) => (
          <ComboBoxGroup {...params} headerSx={groupLabelSx} itemSx={groupItemSx} />
        )}
        ListboxComponent={CustomListbox}
        ListboxProps={ListboxProps}
        renderOption={(props: HTMLAttributes<HTMLLIElement>, option: Option, state: AutocompleteRenderOptionState) =>
          renderOptions(props, option, state)
        }
        clearIcon={clearIcon}
        sx={{
          ...sx,
          ...(type === 'filter' && {
            [`.${autocompleteClasses.inputRoot}`]: {
              [`.${autocompleteClasses.input}`]: {
                minWidth: 0,
              },
            },
            [`.${autocompleteClasses.tag}`]: {
              maxWidth: '125px',
            },
          }),
        }}
        size={size}
        {...others}
      />
    )
  }
)

ComboBox.displayName = 'ComboBox'

export default ComboBox

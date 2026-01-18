import {
  TextFieldProps,
  alpha,
  autocompleteClasses,
  filledInputClasses,
  inputBaseClasses,
  inputLabelClasses,
  outlinedInputClasses,
} from '@mui/material';
import { Theme } from '@mui/material/styles';

import { GREY } from '../color';

export default function Input(theme: Theme) {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          [`&.${inputBaseClasses.disabled}`]: {
            '& svg': {
              color: theme.palette.text.disabled,
            },
          },
        },
        input: {
          '&::placeholder': {
            opacity: 1,
            color: theme.palette.text.disabled,
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          '&:before': {
            borderBottomColor: alpha(theme.palette.grey[500], 0.56),
          },
          '&:after': {
            borderBottomColor: theme.palette.text.primary,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: TextFieldProps }) => ({
          [` .${inputLabelClasses.root}:not(.${inputLabelClasses.error}).${inputLabelClasses.focused}`]: {
            color: theme.palette.primary.main,
          },
          [` .${outlinedInputClasses.disabled}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: alpha(GREY[500], 0.24),
              backgroundColor: alpha(GREY[500], 0.08),
            },
          },
          [`.${inputBaseClasses.root}`]: {
            ...((ownerState.size === 'medium' || !ownerState.size) && {
              [`input:not(.${autocompleteClasses.input}).${outlinedInputClasses.input}`]: {
                paddingTop: theme.spacing(2),
                paddingBottom: theme.spacing(2),
              },
            }),
            [`&.${inputBaseClasses.multiline}`]: {
              paddingTop: theme.spacing(2),
              paddingBottom: theme.spacing(2),
            },
          },
        }),
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: theme.shape.borderRadius,
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[500], 0.16),
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: alpha(theme.palette.grey[500], 0.16),
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: theme.palette.action.disabledBackground,
          },
        },
        underline: {
          '&:before, :after': {
            display: 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: Number(theme.shape.borderRadius),
          [`& .${outlinedInputClasses.notchedOutline}`]: {
            borderColor: alpha(theme.palette.grey[500], 0.88),
          },
          [`&.${outlinedInputClasses.focused}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderWidth: 1,
            },
          },
          [`&.${outlinedInputClasses.disabled}`]: {
            [`& .${outlinedInputClasses.notchedOutline}`]: {
              borderColor: alpha(GREY[500], 0.24),
              backgroundColor: alpha(GREY[500], 0.08),
            },
          },
        },
      },
    },
  };
}

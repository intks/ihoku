import { formLabelClasses } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default function Card(theme: Theme) {
  return {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginTop: theme.spacing(1),
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          [`&:not(.${formLabelClasses.error}).${formLabelClasses.focused}`]: {
            color: theme.palette.primary.main,
          },
        },
        asterisk: {
          color: theme.palette.error.main,
        },
      },
    },
  };
}

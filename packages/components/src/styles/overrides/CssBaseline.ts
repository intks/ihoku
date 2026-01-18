import { Theme } from '@mui/material/styles';

export default function CssBaseline(theme: Theme) {
  const overrideAutoFillStyle = {
    '&:-webkit-autofill': {
      transition: 'background-color 5000s ease-in-out 0s',
      WebkitTextFillColor: theme.palette.text.primary,
      '&:hover, &:focus, &:active': {
        transition: 'background-color 5000s ease-in-out 0s',
        WebkitTextFillColor: theme.palette.text.primary,
      },
    },
  };
  return {
    MuiCssBaseline: {
      styleOverrides: {
        input: overrideAutoFillStyle,
        textarea: overrideAutoFillStyle,
        select: overrideAutoFillStyle,
      },
    },
  };
}

import { alpha, Theme } from '@mui/material/styles';

export default function Avatar(theme: Theme) {
  return {
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          color: theme.palette.text.secondary,
          backgroundColor: alpha(theme.palette.grey[500], 0.24),
        },
      },
    },
  };
}

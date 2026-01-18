import { Theme } from '@mui/material/styles';

export default function Tooltip(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[isLight ? 800 : 700],
          fontWeight: 400,
          borderRadius: theme.shape.borderRadius / 2,
        },
        arrow: {
          color: theme.palette.grey[isLight ? 800 : 700],

          '&::before': {
            borderRadius: theme.shape.borderRadius / 4,
          },
        },
      },
    },
  };
}

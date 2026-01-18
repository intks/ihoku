import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Slider(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiSlider: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            color: theme.palette.action.disabled,
          },
          height: 4,
        },
        rail: {
          opacity: 0.32,
        },
        thumb: {
          height: 20,
          width: 20,
        },
        markLabel: {
          fontSize: 12,
          color: theme.palette.text.secondary,
        },
        valueLabel: {
          borderRadius: 8,
          backgroundColor: theme.palette.grey[isLight ? 800 : 700],
        },
        mark: {
          height: 4,
          width: 4,
          borderRadius: 2,
          '&.MuiSlider-markActive': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  };
}

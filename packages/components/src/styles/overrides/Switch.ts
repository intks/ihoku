import { SwitchProps } from '@mui/material';
import { Theme, alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function Switch(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  const rootStyle = (ownerState: SwitchProps) => ({
    marginRight: 9,
    width: 33,
    height: 20,
    padding: 0,
    ...(ownerState.size === 'small' && {
      width: 25,
      height: 16,
    }),
    '& .MuiSwitch-thumb': {
      width: 14,
      height: 14,
      boxShadow: 'none',
      color: `${theme.palette.common.white} !important`,
      ...(ownerState.size === 'small' && {
        width: 10,
        height: 10,
      }),
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      borderRadius: 14,
      backgroundColor: alpha(theme.palette.grey[500], 0.48),
    },
    '& .MuiSwitch-switchBase': {
      left: 0,
      padding: 3,
      ...(ownerState.size === 'small' && {
        padding: 3,
      }),
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        '&+.MuiSwitch-track': { opacity: 1 },
        ...(ownerState.size === 'small' && {
          transform: 'translateX(8px)',
        }),
      },
      '&.Mui-disabled': {
        '& .MuiSwitch-thumb': { opacity: isLight ? 1 : 0.48 },
        '&+.MuiSwitch-track': { opacity: 0.48 },
      },
    },
  });

  return {
    MuiSwitch: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: SwitchProps }) => rootStyle(ownerState),
      },
    },
  };
}

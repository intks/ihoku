import { IconButtonProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

declare module '@mui/material/IconButton' {
  interface IconButtonPropsSizeOverrides {
    xs: true;
  }
  interface IconButtonPropsColorOverrides {
    aiInfo: true;
  }
}

export default function IconButton(theme: Theme) {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: IconButtonProps }) => {
          const size = {
            ...(ownerState.size === 'large' && {
              padding: theme.spacing(1),
            }),
            ...(ownerState.size === 'xs' && {
              padding: theme.spacing('5px'),
            }),
          };

          return [size];
        },
      },
    },
  };
}

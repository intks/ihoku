import { SvgIconProps } from '@mui/material';

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsSizeOverrides {
    xs: true;
  }
  interface SvgIconPropsColorOverrides {
    aiInfo: true;
  }
}

export default function SvgIcon() {
  return {
    MuiSvgIcon: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: SvgIconProps }) => {
          const fontSize = {
            ...(ownerState.fontSize === 'large' && {
              fontSize: '32px',
            }),
            ...(ownerState.fontSize === 'xs' && {
              fontSize: '18px',
            }),
          };
          return [fontSize];
        },
      },
    },
  };
}

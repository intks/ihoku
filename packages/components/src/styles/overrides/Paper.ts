import { PaperProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default function Paper(theme: Theme) {
  return {
    MuiPaper: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: PaperProps }) => {
          const { variant, elevation } = ownerState;

          return {
            ...(typeof elevation === 'number' &&
              elevation > 0 &&
              variant !== 'outlined' && { boxShadow: theme.customShadows.card }),
            borderRadius: Number(theme.shape.borderRadius) * 2,
          };
        },
      },
    },
  };
}

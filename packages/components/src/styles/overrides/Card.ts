import { CardProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default function Card(theme: Theme) {
  return {
    MuiCard: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: CardProps }) => {
          const isOutlined = ownerState.variant === 'outlined';
          return {
            position: 'relative',
            boxShadow: isOutlined ? 'none' : theme.customShadows.card,
            borderRadius: Number(theme.shape.borderRadius) * 2,
            zIndex: 0, // Fix Safari overflow: hidden with border radius
          };
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: {
          variant: 'body2',
          marginTop: theme.spacing(0.5),
        },
      },
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
        action: {
          display: 'flex',
          alignSelf: 'center',
          alignItems: 'center',
          margin: theme.spacing(0, 0, 0, 2),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(0, 3, 3),
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: theme.spacing(0, 3, 3),
        },
      },
    },
  };
}

import { ChipProps, chipClasses } from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error', 'aiInfo'] as const;

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    soft: true;
  }
  interface ChipPropsColorOverrides {
    aiInfo: true;
  }
}

export default function Chip(theme: Theme) {
  const isLight = theme.palette.mode === 'light';

  const rootStyle = (ownerState: ChipProps) => {
    const defaultColor = ownerState.color === 'default';

    const filledVariant = ownerState.variant === 'filled';

    const outlinedVariant = ownerState.variant === 'outlined';

    const softVariant = ownerState.variant === 'soft';

    const defaultStyle = {
      ...(defaultColor && {
        [`& .${chipClasses.avatar}`]: {
          color: theme.palette.text[isLight ? 'secondary' : 'primary'],
          backgroundColor: alpha(theme.palette.grey[500], 0.48),
        },
        // OUTLINED
        ...(outlinedVariant && {
          color: theme.palette.grey[600],
          border: `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette.text.secondary,
          backgroundColor: alpha(theme.palette.grey[500], 0.16),
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[500], 0.32),
          },
        }),
      }),
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        [`& .${chipClasses.avatar}`]: {
          color: theme.palette[color].lighter,
          backgroundColor: theme.palette[color].dark,
        },
        // FILLED
        ...(filledVariant && {
          [`& .${chipClasses.deleteIcon}`]: {
            color: alpha(theme.palette[color].contrastText, 0.56),
            '&:hover': {
              color: theme.palette[color].contrastText,
            },
          },
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette[color][isLight ? (color === 'aiInfo' ? 'main' : 'dark') : 'light'],
          backgroundColor: alpha(theme.palette[color].main, 0.16),
          '&:hover': {
            backgroundColor: alpha(theme.palette[color].main, 0.32),
          },
          [`& .${chipClasses.deleteIcon}`]: {
            color: alpha(theme.palette[color][isLight ? (color === 'aiInfo' ? 'main' : 'dark') : 'light'], 0.48),
            '&:hover': {
              color: theme.palette[color].dark,
            },
          },
        }),
      }),
    }));

    return [...colorStyle, defaultStyle];
  };

  return {
    MuiChip: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ChipProps }) => rootStyle(ownerState),
        icon: {
          marginRight: 1,
        },
        sizeSmall: {
          fontSize: 12,
          paddingTop: '2px',
          paddingBottom: '2px',
        },
      },
    },
  };
}

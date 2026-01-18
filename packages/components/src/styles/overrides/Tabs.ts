import { tabClasses, TabProps, TabsProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default function Tabs(theme: Theme) {
  return {
    MuiTabs: {
      defaultProps: {
        textColor: 'inherit',
        allowScrollButtonsMobile: true,
        variant: 'scrollable',
      },
      styleOverrides: {
        root: ({ ownerState }: { ownerState: TabsProps }) => ({
          padding: theme.spacing(0.5, 0, 0),
          ...((ownerState?.textColor === 'primary' || ownerState?.textColor === 'inherit') && {
            [`.${tabClasses.selected}`]: {
              color: theme.palette.primary.main,
            },
          }),
        }),
        scrollButtons: {
          width: 48,
          borderRadius: '50%',
        },
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
        iconPosition: 'start',
      },
      styleOverrides: {
        root: ({ ownerState }: { ownerState: TabProps }) => ({
          padding: theme.spacing(1.25, 0, 0),
          opacity: 1,
          minWidth: 48,
          fontWeight: 600,
          fontSize: 16,
          '&:not(:last-of-type)': {
            marginRight: theme.spacing(3),
            [theme.breakpoints.up('sm')]: {
              marginRight: theme.spacing(6),
            },
          },
          [`&:not(${tabClasses.selected})`]: {
            color: theme.palette.text.secondary,
          },
          ...((ownerState.iconPosition === 'start' || ownerState.iconPosition === 'end') && {
            minHeight: 50,
          }),
        }),
      },
    },
  };
}

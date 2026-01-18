import { dialogActionsClasses, dialogClasses, paperClasses } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default function Dialog(theme: Theme) {
  return {
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dialog,
          [`&.${paperClasses.rounded}`]: {
            borderRadius: Number(theme.shape.borderRadius) * 2,
          },
          [`&.${dialogClasses.paperFullScreen}`]: {
            borderRadius: 0,
          },
          [`&.${dialogClasses.paper} .${dialogActionsClasses.root}`]: {
            padding: theme.spacing(3),
          },
          '@media (max-width: 600px)': {
            margin: theme.spacing(2),
          },
          '@media (max-width: 663.95px)': {
            [`&.${dialogClasses.paperWidthSm}.${dialogClasses.paperScrollBody}`]: {
              maxWidth: '100%',
            },
          },
        },
        paperFullWidth: {
          width: '100%',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1, 3),
          minHeight: '80px',
        },
        dividers: {
          border: 0,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1.5),
          },
        },
      },
    },
  };
}

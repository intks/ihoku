import { autocompleteClasses } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default function Autocomplete(theme: Theme) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.dropdown,
        },
        listbox: ({ ownerState }: { ownerState: any }) => {
          return {
            padding: theme.spacing(0),
            [`& .${autocompleteClasses.option}`]: {
              padding: theme.spacing(2),
              '&[aria-selected="true"]': {
                backgroundColor: !!ownerState.multiple ? 'transparent' : theme.palette.action.selected,
                [`&.${autocompleteClasses.focused}`]: {
                  backgroundColor: !!ownerState.multiple ? 'transparent' : theme.palette.action.selected,
                  '&:hover': {
                    backgroundColor: theme.palette.action.selected,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              },
              '&[aria-selected="false"]:hover': {
                background: theme.palette.action.hover,
              },
            },
          };
        },
        option: {
          ...theme.typography.body2,
          padding: theme.spacing(1),
        },
        noOption: theme.typography.body2,
      },
    },
  };
}

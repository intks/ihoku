import { ReactNode, forwardRef } from 'react';

import {
  ListItem as MuiListItem,
  Checkbox,
  CheckboxProps,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
  ListItemProps,
  listItemClasses,
} from '@mui/material';

import { getTextEllipsis } from '../../utils/getTextEllipsis';

export const ComboBoxListItemStack = ({ children, ...others }: { children: ReactNode } & StackProps) => {
  return (
    <Stack direction="row" alignItems="center" mr={1} overflow="hidden" {...others}>
      {children}
    </Stack>
  );
};

export const ComboBoxListItemCheckBox = ({ checked, ...rest }: { checked: boolean } & CheckboxProps) => {
  return <Checkbox sx={{ mr: 1 }} checked={checked} {...rest} />;
};

export const ComboBoxListItemLabel = ({ label, ...others }: { label: string } & TypographyProps) => {
  return (
    <Typography variant="body2" {...getTextEllipsis()} {...others}>
      {label}
    </Typography>
  );
};

type ComboBoxListItemProps = {
  children: ReactNode;
} & ListItemProps;

const ComboBoxListItem = forwardRef<HTMLLIElement, ComboBoxListItemProps>((props, ref) => {
  const { children, sx } = props;
  return (
    <MuiListItem
      {...props}
      sx={{
        [`&.${listItemClasses.root}`]: {
          py: 1,
          pr: 2,
          pl: 1,
        },
        ...sx,
      }}
      ref={ref}
    >
      {children}
    </MuiListItem>
  );
});
ComboBoxListItem.displayName = 'ComboBoxListItem';

export default ComboBoxListItem;

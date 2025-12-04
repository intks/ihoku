import { AutocompleteRenderGroupParams, SxProps, Theme, styled } from '@mui/material';

import { theme } from '../../styles';

export type ComboBoxRenderGroupProps = {
  headerSx?: SxProps<Theme>;
  itemSx?: SxProps<Theme>;
} & AutocompleteRenderGroupParams;

const GroupHeader = styled('div')(() => {
  const { typography, palette, spacing } = theme();
  return {
    ...typography.subtitle2,
    top: 0,
    position: 'sticky',
    padding: spacing(1, 2),
    margin: 0,
    backgroundColor: palette.grey[300],
    zIndex: 2,
  };
});

const GroupItems = styled('ul')({
  padding: 0,
});

const ComboBoxGroup = (props: ComboBoxRenderGroupProps) => {
  return (
    <li>
      {props.group && <GroupHeader sx={props.headerSx}>{props.group}</GroupHeader>}
      <GroupItems>{props.children}</GroupItems>
    </li>
  );
};

export default ComboBoxGroup;

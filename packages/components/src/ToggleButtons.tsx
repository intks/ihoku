import { ElementType, MouseEvent } from 'react';

import {
  Paper,
  styled,
  SvgIcon,
  ToggleButton,
  toggleButtonClasses,
  ToggleButtonGroup,
  toggleButtonGroupClasses,
  ToggleButtonProps,
} from '@mui/material';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    [`&.${toggleButtonGroupClasses.disabled}`]: {
      border: 0,
    },
    [`&.${toggleButtonClasses.root}`]: {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

interface ActionProps extends ToggleButtonProps {
  label: string;
  value: string;
  icon: ElementType;
}

interface ToggleButtonsProps<T> {
  value: T;
  actions: ActionProps[];
  onChange: (value: T) => void;
}

const ToggleButtons = <T extends string = string>({ value, actions, onChange }: ToggleButtonsProps<T>) => {
  const handleChange = (_: MouseEvent, newValue: T) => {
    // prevent empty value  https://github.com/mui/material-ui/issues/29784
    if (!newValue) return;
    onChange(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        display: 'flex',
        border: `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
        borderRadius: 1,
        width: 'fit-content',
      })}
    >
      <StyledToggleButtonGroup exclusive value={value} onChange={handleChange}>
        {actions.map(({ icon, label, value: actionValue, size = 'small', sx, ...rest }) => (
          <ToggleButton key={label} value={actionValue} aria-label={label} sx={{ p: 1, ...sx }} size={size} {...rest}>
            <SvgIcon component={icon} fontSize={size} />
          </ToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Paper>
  );
};

export default ToggleButtons;

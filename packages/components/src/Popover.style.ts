import { alpha, styled } from '@mui/material/styles';

import { theme } from '../../styles';

export type Placement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'left-top'
  | 'left-center'
  | 'left-bottom'
  | 'right-top'
  | 'right-center'
  | 'right-bottom';

interface StyledArrowProps {
  placement: Placement;
}

export const StyledArrow = styled('span', {
  shouldForwardProp: (prop) => prop !== 'placement',
})<StyledArrowProps>(({ placement }) => {
  const SIZE = 12;

  const POSITION = -(SIZE / 2);

  const { palette, breakpoints } = theme();

  const borderStyle = `solid 1px ${alpha(palette.grey[500], 0.12)}`;

  const topStyle = {
    borderRadius: '0 0 3px 0',
    top: POSITION,
    borderBottom: borderStyle,
    borderRight: borderStyle,
  };
  const bottomStyle = {
    borderRadius: '3px 0 0 0',
    bottom: POSITION,
    borderTop: borderStyle,
    borderLeft: borderStyle,
  };
  const leftStyle = {
    borderRadius: '0 3px 0 0',
    left: POSITION,
    borderTop: borderStyle,
    borderRight: borderStyle,
  };
  const rightStyle = {
    borderRadius: '0 0 0 3px',
    right: POSITION,
    borderBottom: borderStyle,
    borderLeft: borderStyle,
  };

  return {
    display: 'none',
    [breakpoints.up('sm')]: {
      width: SIZE,
      height: SIZE,
      content: "''",
      display: 'block',
      position: 'absolute',
      transform: 'rotate(-135deg)',
      background: palette.background.paper,
    },
    // Top
    ...(placement === 'top-left' && { ...topStyle, left: 20 }),
    ...(placement === 'top-center' && { ...topStyle, left: 0, right: 0, margin: 'auto' }),
    ...(placement === 'top-right' && { ...topStyle, right: 20 }),
    // Bottom
    ...(placement === 'bottom-left' && { ...bottomStyle, left: 20 }),
    ...(placement === 'bottom-center' && { ...bottomStyle, left: 0, right: 0, margin: 'auto' }),
    ...(placement === 'bottom-right' && { ...bottomStyle, right: 20 }),
    // Left
    ...(placement === 'left-top' && { ...leftStyle, top: 20 }),
    ...(placement === 'left-center' && { ...leftStyle, top: 0, bottom: 0, margin: 'auto' }),
    ...(placement === 'left-bottom' && { ...leftStyle, bottom: 20 }),
    // Right
    ...(placement === 'right-top' && { ...rightStyle, top: 20 }),
    ...(placement === 'right-center' && { ...rightStyle, top: 0, bottom: 0, margin: 'auto' }),
    ...(placement === 'right-bottom' && { ...rightStyle, bottom: 20 }),
  };
});

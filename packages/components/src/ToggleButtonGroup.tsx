import { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import {
  ToggleButtonGroup as MuiToggleButtonGroup,
  toggleButtonClasses,
  ToggleButtonGroupProps as MuiToggleButtonGroupProps,
  ToggleButton,
  ToggleButtonProps as MuiToggleButtonProps,
  Typography,
  Box,
  styled,
  alpha,
  Stack,
  SvgIcon,
  SxProps,
  Theme,
} from '@mui/material';

import { OutlineChevronLeft, OutlineChevronRight } from '@sphere/web-icons';

import { theme } from '../../styles';
import { IconButton } from '../icon-button';

interface StyledToggleButtonGroupType extends MuiToggleButtonGroupProps {
  scrollable?: boolean;
  maxHeight?: CSSProperties['maxHeight'];
}

const StyledToggleButtonGroup = styled(MuiToggleButtonGroup, {
  shouldForwardProp: (prop) => prop !== 'scrollable' && prop !== 'maxHeight',
})<StyledToggleButtonGroupType>(({ orientation, scrollable, maxHeight }) => {
  const { palette, shape, spacing } = theme();

  const isVertical = orientation === 'vertical';
  return {
    gap: spacing(2),
    ...(isVertical ? { maxHeight } : { width: '100%' }),
    ...(scrollable && {
      overflow: 'auto',
      scrollBehavior: 'smooth',
      scrollbarWidth: 'none', // Firefox
      '&::-webkit-scrollbar': {
        display: 'none', // Safari + Chrome
      },
    }),

    [`& .${toggleButtonClasses.root}`]: {
      '&:not(:last-of-type)': {
        borderTopRightRadius: shape.borderRadius,
        borderBottomRightRadius: shape.borderRadius,
      },

      '&:not(:first-of-type)': {
        borderTopLeftRadius: shape.borderRadius,
        borderBottomLeftRadius: shape.borderRadius,
        borderTop: `1px solid ${alpha(palette.divider, 0.24)}`,
        borderLeft: `1px solid ${alpha(palette.divider, 0.24)}`,
      },

      '&.Mui-selected': {
        borderColor: palette.primary.main,
        borderWidth: spacing(0.25),
        padding: '23px',
        background: 'none',

        '&:hover': {
          background: 'none',
        },
      },

      '&:hover': {
        background: alpha(palette.primary.main, 0.08),
        borderColor: palette.primary.main,
        borderWidth: spacing(0.25),
        padding: '23px',
      },

      '&.Mui-disabled': {
        borderColor: alpha(palette.grey[500], 0.24),
        color: palette.grey[500],

        '&.Mui-selected': {
          borderColor: alpha(palette.grey[400], 0.8),
        },
      },
    },
  };
});

interface StyledToggleButtonType extends MuiToggleButtonProps {
  scrollable?: boolean;
}

const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'scrollable',
})<StyledToggleButtonType>(({ scrollable }) => {
  const { spacing } = theme();
  return {
    textTransform: 'none',
    boxSizing: 'border-box',
    padding: spacing(3),
    ...(scrollable && { minWidth: 'max(160px, 20%)' }),
  };
});

interface Option {
  label: string | ReactNode;
  value: string | number | boolean;
  helperText?: ReactNode;
  disabled?: boolean;
}

export interface ToggleButtonGroupProps extends Omit<StyledToggleButtonGroupType, 'children'> {
  options: Option[];
  buttonSx?: SxProps<Theme>;
  disabled?: boolean;
  children?: ReactNode | ((props: { option: Option; index: number }) => ReactNode);
}

const ToggleButtonGroup = ({
  options,
  disabled = false,
  children,
  buttonSx,
  scrollable = false,
  orientation,
  maxHeight,
  onChange,
  ...others
}: ToggleButtonGroupProps) => {
  const [showPrevIcon, setShowPrevIcon] = useState<boolean>(false);
  const [showNextIcon, setShowNextIcon] = useState<boolean>(false);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const firstObserverRef = useRef<IntersectionObserver>();
  const lastObserverRef = useRef<IntersectionObserver>();

  const isVertical = orientation === 'vertical';

  useEffect(() => {
    if (scrollable) {
      const groupChildren = Array.from(groupRef.current?.children || []);

      const firstTab = groupChildren[0];
      const lastTab = groupChildren[groupChildren.length - 1];

      const observerOptions = {
        root: groupRef.current,
        threshold: 0.9,
      };

      firstObserverRef.current = new IntersectionObserver((entries) => {
        setShowPrevIcon(!entries[0].isIntersecting);
      }, observerOptions);
      firstObserverRef.current.observe(firstTab);

      lastObserverRef.current = new IntersectionObserver((entries) => {
        setShowNextIcon(!entries[0].isIntersecting);
      }, observerOptions);
      lastObserverRef.current.observe(lastTab);
    }

    return () => {
      if (firstObserverRef.current) firstObserverRef.current.disconnect();
      if (lastObserverRef.current) lastObserverRef.current.disconnect();
    };
  }, [options, scrollable]);

  const getScrollSize = useCallback(() => {
    const property = isVertical ? 'clientHeight' : 'clientWidth';
    const value = groupRef.current?.[property] ?? 0;
    return value;
  }, [isVertical]);

  const scrollToPosition = useCallback(
    (size: number) => {
      if (groupRef.current) {
        const property = isVertical ? 'scrollTop' : 'scrollLeft';
        const currentPosition = groupRef.current[property];
        groupRef.current[property] = currentPosition + size;
      }
    },
    [isVertical]
  );

  const handleClickPrevIcon = () => {
    scrollToPosition(-getScrollSize());
  };

  const handleClickNextIcon = () => {
    scrollToPosition(getScrollSize());
  };

  return (
    <Stack spacing={2} direction={isVertical ? 'column' : 'row'} alignItems="center">
      {scrollable && (
        <IconButton
          aria-describedby="prev-toggle-button"
          size="small"
          onClick={handleClickPrevIcon}
          disabled={!showPrevIcon}
        >
          <SvgIcon
            component={OutlineChevronLeft}
            fontSize="small"
            sx={isVertical ? { transform: 'rotate(90deg)' } : {}}
          />
        </IconButton>
      )}
      <StyledToggleButtonGroup
        disabled={disabled}
        ref={groupRef}
        scrollable={scrollable}
        orientation={orientation}
        maxHeight={maxHeight}
        onChange={(e, value) => {
          if (scrollable) {
            const index = options.findIndex((option) => option.value === value);
            const widthProperty = isVertical ? 'offsetHeight' : 'offsetWidth';
            const startProperty = isVertical ? 'offsetTop' : 'offsetLeft';
            const prevElement = groupRef.current?.children[index - 1] as HTMLElement;
            const prevElementPosition = prevElement?.[startProperty] ?? 0 + prevElement?.[widthProperty] ?? 0;
            if (groupRef.current) {
              const scrollProperty = isVertical ? 'scrollTop' : 'scrollLeft';
              groupRef.current[scrollProperty] = prevElementPosition;
            }
          }
          onChange?.(e, value);
        }}
        {...others}
      >
        {options.map((option, idx) => (
          <StyledToggleButton
            key={idx.toString()}
            value={option.value}
            aria-label={`toggle-button-${option.value}`}
            disabled={option.disabled}
            scrollable={scrollable}
            sx={{
              ...(!scrollable && { width: isVertical ? '100%' : `${Math.round(100 / options.length)}%` }),
              ...buttonSx,
            }}
          >
            {typeof children === 'function'
              ? children({
                  option,
                  index: idx,
                })
              : children || (
                  <Box>
                    <Typography variant="subtitle1" color={!disabled && !option.disabled ? 'text.primary' : ''}>
                      {option.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="div"
                      color={!disabled && !option.disabled ? 'text.secondary' : ''}
                    >
                      {option.helperText}
                    </Typography>
                  </Box>
                )}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
      {scrollable && (
        <IconButton
          aria-describedby="next-toggle-button"
          size="small"
          onClick={handleClickNextIcon}
          disabled={!showNextIcon}
        >
          <SvgIcon
            component={OutlineChevronRight}
            fontSize="small"
            sx={isVertical ? { transform: 'rotate(90deg)' } : {}}
          />
        </IconButton>
      )}
    </Stack>
  );
};

export default ToggleButtonGroup;

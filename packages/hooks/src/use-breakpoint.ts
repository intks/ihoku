import { useMemo } from 'react';
import useMediaQuery from './use-media-query';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BreakpointConfig {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}

const defaultBreakpoints: BreakpointConfig = {
  xs: '(max-width: 639px)',
  sm: '(min-width: 640px) and (max-width: 767px)',
  md: '(min-width: 768px) and (max-width: 1023px)',
  lg: '(min-width: 1024px) and (max-width: 1279px)',
  xl: '(min-width: 1280px) and (max-width: 1535px)',
  '2xl': '(min-width: 1536px)',
};

const useBreakpoint = (breakpoints: BreakpointConfig = defaultBreakpoints): Breakpoint | null => {
  const xs = useMediaQuery(breakpoints.xs || defaultBreakpoints.xs || '');
  const sm = useMediaQuery(breakpoints.sm || defaultBreakpoints.sm || '');
  const md = useMediaQuery(breakpoints.md || defaultBreakpoints.md || '');
  const lg = useMediaQuery(breakpoints.lg || defaultBreakpoints.lg || '');
  const xl = useMediaQuery(breakpoints.xl || defaultBreakpoints.xl || '');
  const xl2 = useMediaQuery(breakpoints['2xl'] || defaultBreakpoints['2xl'] || '');

  return useMemo(() => {
    if (xl2) return '2xl';
    if (xl) return 'xl';
    if (lg) return 'lg';
    if (md) return 'md';
    if (sm) return 'sm';
    if (xs) return 'xs';
    return null;
  }, [xs, sm, md, lg, xl, xl2]);
};

export default useBreakpoint;


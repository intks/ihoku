import { alpha } from '@mui/material/styles';

import { AI_INFO, ERROR, INFO, PRIMARY, SECONDARY, SUCCESS, WARNING } from './color';
import palette from './palette';

const themeColor = palette();

const LIGHT_MODE = themeColor.grey[500];

const DARK_MODE = themeColor.common.black;

function createShadow(color: string) {
  const transparent = alpha(color, 0.16);
  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z4: `0 4px 8px 0 ${transparent}`,
    z12: `0 12px 24px -4px ${transparent}`,
    z16: `0 16px 32px -4px ${transparent}`,
    z20: `0 20px 40px -4px ${transparent}`,
    z24: `0 24px 48px 0 ${transparent}`,
    //
    primary: `0 8px 16px 0 ${alpha(PRIMARY.main, 0.24)}`,
    info: `0 8px 16px 0 ${alpha(INFO.main, 0.24)}`,
    secondary: `0 8px 16px 0 ${alpha(SECONDARY.main, 0.48)}`,
    success: `0 8px 16px 0 ${alpha(SUCCESS.main, 0.24)}`,
    warning: `0 8px 16px 0 ${alpha(WARNING.main, 0.24)}`,
    error: `0 8px 16px 0 ${alpha(ERROR.main, 0.24)}`,
    aiInfo: `0 8px 16px 0 ${alpha(AI_INFO.main, 0.25)}`,
    //
    card: `0 0 2px 0 ${alpha(color, 0.2)}, 0 12px 24px -4px ${alpha(color, 0.12)}`,
    dialog: `-40px 40px 80px -8px ${alpha(color, 0.24)}`,
    dropdown: `0 0 2px 0 ${alpha(color, 0.24)}, -20px 20px 40px -4px ${alpha(color, 0.24)}`,
    button: `0 8px 16px 0 ${alpha(color, 0.16)}`, //z8
  };
}

export default function customShadows(themeMode: 'light' | 'dark' = 'light') {
  return themeMode === 'light' ? createShadow(LIGHT_MODE) : createShadow(DARK_MODE);
}

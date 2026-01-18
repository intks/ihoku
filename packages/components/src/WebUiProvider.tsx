import type { ReactNode} from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Palette } from '@mui/material';
import { ThemeProvider as UiProvider, CssBaseline } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { theme } from '../../styles';
import { ToastProvider } from '../toast-provider';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh';

const DialogContext = createContext<{
  openedDialogCount: number;
  increaseDialogCount: () => void;
  decreaseDialogCount: () => void;
}>({
  openedDialogCount: 0,
  increaseDialogCount: () => {},
  decreaseDialogCount: () => {},
});

const WebUiProvider = ({
  children,
  themeMode = 'light',
  locale = 'en',
  customPalette,
}: {
  children: ReactNode;
  themeMode?: 'light' | 'dark';
  locale?: string;
  customPalette?: Partial<Pick<Palette, 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'>>;
}) => {
  const [openedDialogCount, setOpenedDialogCount] = useState(0);

  const increaseDialogCount = useCallback(() => setOpenedDialogCount((prev) => prev + 1), []);
  const decreaseDialogCount = useCallback(() => setOpenedDialogCount((prev) => Math.max(0, prev - 1)), []);

  const value = useMemo(
    () => ({ openedDialogCount, increaseDialogCount, decreaseDialogCount }),
    [decreaseDialogCount, increaseDialogCount, openedDialogCount]
  );

  useEffect(() => {
    document.body.style.overflow = openedDialogCount > 0 ? 'hidden' : 'initial';
  }, [openedDialogCount]);

  return (
    <DialogContext.Provider value={value}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <UiProvider theme={theme(themeMode, customPalette)}>
          <CssBaseline />
          <ToastProvider>{children}</ToastProvider>
        </UiProvider>
      </LocalizationProvider>
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a WebUiProvider');
  }
  return context;
};

export default WebUiProvider;

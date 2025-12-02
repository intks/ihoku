import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

import type { AlertProps } from '@mui/material'
import { Alert, Box, Grow, Snackbar, useTheme } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'

interface ToastMessage {
  key: string
  message: string | ReactNode
  type: AlertProps['severity']
  duration?: number
}

interface AddToastProp {
  message: string | ReactNode
  type?: AlertProps['severity']
  key?: string
}

interface ToastContextType {
  addToast: ({ message, type, key }: AddToastProp) => void
  toastState: ToastMessage[]
}

const AUTO_HIDE_DURATION = 5000

const ToastContext = createContext<ToastContextType>({
  // addToast method intentionally left empty for now
  addToast: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  toastState: [],
})

const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

const Toast = ({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) => {
  useEffect(() => {
    if (toast?.duration) {
      setTimeout(() => {
        onClose()
      }, toast?.duration)
    }
  }, [onClose, toast?.duration])

  return (
    <Grow in={true} timeout={300}>
      <Alert
        severity={toast.type}
        sx={{
          overflowWrap: 'anywhere',
        }}
        onClose={onClose}
      >
        {toast.message}
      </Alert>
    </Grow>
  )
}

const ToastProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme()
  const [toastState, setToastState] = useState<ToastMessage[]>([])

  const addToast = useCallback(
    ({ message, type = 'success', key }: AddToastProp) => {
      const toastKey = key ? `${uuidv4()}-${key}` : uuidv4()

      // Prevent duplicated toasts
      if (toastState.find((toast) => toast.key === toastKey)) {
        return
      }

      setToastState((prev) => {
        const rest = prev.length < 10 ? prev : prev.slice(0, -1)

        return [{ message, type, duration: AUTO_HIDE_DURATION, key: toastKey }, ...rest]
      })
    },
    [toastState]
  )

  const handleClose = useCallback((key: string) => {
    setToastState((prevState) => prevState.filter((toast) => toast.key !== key))
  }, [])

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open
        autoHideDuration={null}
        transitionDuration={0}
        sx={{
          top: 64,
          minWidth: 240,
          maxWidth: 'calc(100% - 480px)',
          [theme.breakpoints.down('sm')]: {
            maxWidth: 320,
            right: 0,
            left: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
          },
        }}
      >
        <Box display='flex' flexDirection='column' gap={1}>
          {toastState.map((toast) => (
            <Toast key={toast.key} toast={toast} onClose={() => handleClose(toast.key)} />
          ))}
        </Box>
      </Snackbar>

      <ToastContext.Provider value={{ addToast, toastState }}>{children}</ToastContext.Provider>
    </>
  )
}

export { ToastProvider, useToast }

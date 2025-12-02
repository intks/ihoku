import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Dialog,
  DialogContent,
  LinearProgress,
  List,
  ListItem,
  IconButton as MuiIconButton,
  Stack,
  SvgIcon,
  Tooltip,
  Typography,
  dialogClasses,
  paperClasses,
} from '@mui/material'

import type { CompleteUploadFileResponse } from '@sphere/core'
import { fileSizeToString } from '@sphere/core'
import { FillCloudUpload, OutlineCheckmark, OutlineChevronDown, OutlineClose } from '@sphere/web-icons'
import type { CustomFile, Theme } from '@sphere/web-ui'
import { IconButton, getTextEllipsis, useDisclosure } from '@sphere/web-ui'

import { useAuth } from 'contexts/auth'

import type { FileSourceType, FileType } from 'features/library/types'
import { StorageType } from 'features/library/types'
import type { PermissionData } from 'features/permission/types'
import BlobUploader from 'features/upload/components/BlobUploader'
import MultiPartUploader from 'features/upload/components/MultiPartUploader'
import { UploadStatus } from 'features/vod/types'

import { useBlockOnBeforeUnload } from 'hooks/useNavigationBlocker'

import { has } from 'utils/arrayInclusion'
import { errorMsgFormat, isErrorData } from 'utils/messageFormat'

import { useModal } from './modal'

export interface UploadItem {
  file: CustomFile
  type: FileType
  source: FileSourceType
  status: UploadStatus
  progress: number
  permission?: PermissionData
  message?: string
  configs?: Record<string, any>
  callback?: (result: any) => Promise<void> | void
  uploader?: MultiPartUploader | BlobUploader
}

interface Setter {
  status?: UploadStatus
  progress?: number
  configs?: Record<string, any>
  message?: string
}

interface TerminationDialogProps {
  onConfirm: () => void
}

interface AddUploadListConfigs {
  defaultOpen: boolean
}

interface ContextProps {
  addUploadList: (items: UploadItem[], storageType?: StorageType, configs?: AddUploadListConfigs) => void
  hasUploadingFiles: boolean
  popupTerminationDialog: (object: TerminationDialogProps) => void
  updateUploadList: (id: string, { status, progress, message, configs }: Setter) => void
}

interface ProviderProps {
  children: ReactNode
}

const UploadContext = createContext<ContextProps>({} as ContextProps)

const genStatusColor = (status: UploadStatus) => {
  if (status === UploadStatus.Failed) {
    return 'error'
  }

  if (status === UploadStatus.Cancelled) {
    return 'inherit'
  }

  return 'primary'
}

const genTextColor = (status: UploadStatus) => {
  if (status === UploadStatus.Failed) {
    return 'error'
  }

  if (status === UploadStatus.Cancelled) {
    return 'grey.500'
  }

  return 'primary'
}

const useUpload = (): ContextProps => useContext(UploadContext)

const ProgressStatus = ({
  id,
  status,
  progress,
  uploader,
}: {
  id: string
  status: UploadStatus
  progress: number
  uploader?: MultiPartUploader | BlobUploader
}) => {
  const { t } = useTranslation()
  const { updateUploadList } = useUpload()

  if (status === UploadStatus.Completed)
    return (
      <Stack alignItems='center'>
        <SvgIcon
          component={OutlineCheckmark}
          color='success'
          inheritViewBox
          sx={{ fontSize: '24px', textAlign: 'center' }}
        />
      </Stack>
    )

  if (has([UploadStatus.Failed, UploadStatus.Cancelled], status)) {
    return (
      <Stack alignItems='center'>
        <Typography variant='caption' color='grey.600' className='progress'>
          {progress}%
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack
      alignItems='center'
      sx={{
        '.close-button': { display: 'none' },
        '&:hover': { '.close-button': { display: 'inline' }, '.progress': { display: 'none' } },
      }}
    >
      <Typography variant='caption' color='grey.600' className='progress'>
        {progress}%
      </Typography>
      <Tooltip title={t('common.uploader.tooltip.cancel')} placement='top' arrow>
        <IconButton
          className='close-button'
          aria-label='close'
          sx={{
            height: 40,
            width: 40,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => {
            updateUploadList(id, { status: UploadStatus.Cancelled })
            uploader?.abort()
          }}
        >
          <SvgIcon component={OutlineClose} inheritViewBox />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}

const UploadProvider = ({ children }: ProviderProps) => {
  const { t } = useTranslation()
  const [uploadList, setUploadList] = useState<UploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showModal, hideModal] = useModal()
  const { isOpen, onOpen, onToggle } = useDisclosure({
    isOpen: false,
  })
  const { isAuthenticated } = useAuth()

  const readyOrUploadingList = useMemo(() => {
    const isReadyOrUploading = (item: UploadItem) => has([UploadStatus.Ready, UploadStatus.Uploading], item.status)
    return uploadList.filter(isReadyOrUploading)
  }, [uploadList])

  useBlockOnBeforeUnload(() => {
    return ''
  }, !!readyOrUploadingList.length)

  const updateUploadList = useCallback((id: string, { status, progress, message, configs }: Setter) => {
    setUploadList((prevUploadList: UploadItem[]) => {
      const copiedList = [...prevUploadList]
      const matchedIndex = copiedList.findIndex((item) => item.file.id === id)
      if (matchedIndex > -1) {
        const matchedItem = { ...copiedList[matchedIndex] }
        if (typeof status !== 'undefined') matchedItem.status = status
        if (typeof progress !== 'undefined') matchedItem.progress = progress
        if (typeof message !== 'undefined') matchedItem.message = message
        if (typeof configs !== 'undefined') {
          const prevConfigs = matchedItem.configs
          matchedItem.configs = {
            ...prevConfigs,
            ...configs,
          }
        }
        copiedList[matchedIndex] = matchedItem
      }
      return copiedList
    })
  }, [])

  const createUploader = useCallback(
    (item: UploadItem, storageType: StorageType) => {
      const { file, type, source, permission, callback } = item
      const { id } = file

      const uploadInstance = storageType === StorageType.Azure ? BlobUploader : MultiPartUploader
      const uploader = new uploadInstance({
        file,
        type,
        source,
        ...(permission && { permission }),
        onProgress: (progress: number) => {
          updateUploadList(id, { progress })
        },
        onComplete: async (result: CompleteUploadFileResponse) => {
          updateUploadList(id, { status: UploadStatus.Success })

          try {
            await callback?.(result)
            updateUploadList(id, { status: UploadStatus.Completed })
          } catch (error: unknown) {
            updateUploadList(id, { status: UploadStatus.Failed, message: errorMsgFormat(t, error) })
          }
        },
        onError: (error: any) => {
          if (isErrorData(error)) {
            updateUploadList(id, {
              status: UploadStatus.Failed,
              message: errorMsgFormat(t, error),
            })
            return
          }

          const isCancelled = error.code === 'ERR_CANCELED' || error.name === 'AbortError'
          updateUploadList(id, {
            status: isCancelled ? UploadStatus.Cancelled : UploadStatus.Failed,
            message: isCancelled ? '' : t('common.uploader.error.upload-failed'),
          })
        },
      })
      return uploader
    },
    [updateUploadList, t]
  )

  const processUploadQueue = useCallback(async () => {
    if (isUploading || uploadList.length === 0) return

    const currentItem = uploadList.find((item) => item.status === UploadStatus.Uploading && item.progress === 0)

    if (!currentItem) return

    setIsUploading(true)

    await currentItem.uploader?.upload()

    setIsUploading(false)
  }, [isUploading, uploadList])

  const addUploadList = useCallback(
    (items: UploadItem[], storageType = StorageType.Aws, configs = { defaultOpen: true }) => {
      setUploadList((prevUploadList) => {
        const updatedItems = items.map((item) => ({
          ...item,
          uploader: createUploader(item, storageType),
          status: UploadStatus.Uploading,
        }))

        return [...prevUploadList, ...updatedItems]
      })

      if (configs?.defaultOpen) {
        onOpen()
      }
    },
    [createUploader, onOpen]
  )

  useEffect(() => {
    if (!isUploading && uploadList.some((item) => item.status === UploadStatus.Uploading && item.progress === 0)) {
      processUploadQueue()
    }
  }, [uploadList, isUploading, processUploadQueue])

  const clearUploadList = useCallback(() => {
    setUploadList([])
  }, [])

  const cancelUploadList = useCallback(() => {
    readyOrUploadingList.forEach((item) => item.uploader?.abort())
  }, [readyOrUploadingList])

  const closeUploader = () => {
    const isReadyOrUploading = (item: UploadItem) => has([UploadStatus.Ready, UploadStatus.Uploading], item.status)
    if (uploadList.some(isReadyOrUploading)) {
      showModal({
        title: t('common.uploader.cancel-dialog.title'),
        children: <Typography variant='body2'>{t('common.uploader.cancel-dialog.description')}</Typography>,
        actions: [
          {
            label: t('common.btn.yes'),
            variant: 'outlined',
            onClick: () => {
              hideModal()
              cancelUploadList()
              clearUploadList()
            },
          },
          {
            label: t('common.btn.no'),
            variant: 'contained',
            onClick: hideModal,
          },
        ],
      })

      return
    }

    clearUploadList()
  }

  const popupTerminationDialog = useCallback(
    ({ onConfirm }: TerminationDialogProps) => {
      showModal({
        title: t('common.uploader.termination-dialog.title'),
        children: t('common.uploader.termination-dialog.description'),
        actions: [
          {
            label: t('common.btn.leave'),
            variant: 'outlined',
            onClick: () => {
              hideModal()
              cancelUploadList()
              clearUploadList()
              onConfirm()
            },
          },
          {
            label: t('common.btn.stay'),
            variant: 'contained',
            onClick: () => {
              hideModal()
            },
          },
        ],
      })
    },
    [cancelUploadList, clearUploadList, hideModal, showModal, t]
  )

  useEffect(() => {
    if (uploadList.length) {
      document.body.style.overflow = 'hidden auto'
    }

    return () => {
      document.body.style.overflow = 'initial'
    }
  }, [onOpen, uploadList])

  const value: ContextProps = useMemo(
    () => ({
      addUploadList,
      hasUploadingFiles: !!readyOrUploadingList.length,
      popupTerminationDialog,
      updateUploadList,
    }),
    [addUploadList, popupTerminationDialog, readyOrUploadingList.length, updateUploadList]
  )

  useEffect(() => {
    if (!isAuthenticated) {
      clearUploadList()
    }
  }, [isAuthenticated])

  return (
    <UploadContext.Provider value={value}>
      {!!uploadList.length && (
        <>
          <Dialog
            open={isOpen}
            scroll='paper'
            hideBackdrop
            disableEscapeKeyDown
            disableScrollLock
            disableEnforceFocus
            sx={{
              top: 'unset',
              left: 'unset',
              bottom: 0,
              [`.${dialogClasses.paper}`]: {
                width: 480,
                mr: 1,
                mb: 1,
                boxShadow: (theme) => theme.customShadows.card,
                [`&.${paperClasses.rounded}`]: {
                  borderRadius: (theme) => theme.spacing(0, 0, 1, 1),
                },
              },
            }}
            onClose={(e: MouseEvent, reason: string) => {
              if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                e.preventDefault()
              } else {
                clearUploadList()
              }
            }}
          >
            <DialogContent sx={{ p: 0, minHeight: 'unset' }}>
              <List sx={{ p: 0, maxHeight: 405, overflow: 'auto' }}>
                {[...uploadList].reverse().map((item, index) => (
                  <ListItem key={index} sx={{ pl: 2, pr: 1, py: 1.5 }} divider>
                    <Box
                      display='grid'
                      gridTemplateColumns='1fr 40px'
                      alignItems='center'
                      gap={1}
                      sx={{ width: '100%' }}
                    >
                      <Stack direction='column' spacing={0.8} sx={{ overflow: 'hidden' }}>
                        <Typography variant='subtitle2' sx={getTextEllipsis()}>
                          {item.file.name}
                        </Typography>
                        <Box
                          sx={{ width: '100%', ...(item.status === UploadStatus.Cancelled && { color: 'grey.500' }) }}
                        >
                          <LinearProgress
                            sx={{
                              borderRadius: '50px',
                            }}
                            variant='determinate'
                            value={item.progress}
                            color={genStatusColor(item.status)}
                          />
                        </Box>

                        {item.status === UploadStatus.Failed || item.status === UploadStatus.Cancelled ? (
                          <Typography variant='caption' color={genTextColor(item.status)}>
                            {item?.message || t(`common.uploader.status.${item.status}`)}
                          </Typography>
                        ) : (
                          <Typography variant='caption' color='grey.600'>
                            {fileSizeToString(item.file.size * (item.progress / 100))}/
                            {fileSizeToString(item.file.size)} {t(`common.uploader.status.${item.status}`)}
                          </Typography>
                        )}
                      </Stack>

                      <ProgressStatus
                        id={item.file.id}
                        status={item.status}
                        progress={item.progress}
                        uploader={item.uploader}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>

              <Stack sx={{ ml: 'auto' }}>
                <Stack direction='row' alignItems='center' sx={{ backgroundColor: 'grey.800', py: 1, px: 3, pr: 1 }}>
                  <Typography variant='subtitle1' flex={1} color='white'>
                    {t('common.uploader.title')}
                  </Typography>
                  <IconButton
                    aria-label='collapse'
                    onClick={onToggle}
                    sx={{
                      color: (theme: Theme) => theme.palette.grey[500],
                    }}
                  >
                    <SvgIcon component={OutlineChevronDown} inheritViewBox sx={isOpen ? {} : { rotate: '180deg' }} />
                  </IconButton>
                  <Tooltip title={t('common.uploader.tooltip.close')} placement='bottom' arrow>
                    <IconButton
                      aria-label='close'
                      onClick={closeUploader}
                      sx={{
                        color: (theme: Theme) => theme.palette.grey[500],
                      }}
                    >
                      <SvgIcon component={OutlineClose} inheritViewBox />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </DialogContent>
          </Dialog>

          {!isOpen && (
            <MuiIconButton
              onClick={onToggle}
              sx={{
                height: 64,
                width: 64,
                position: 'fixed',
                right: 8,
                bottom: 8,
                backgroundColor: 'grey.800',
                color: 'white',
                zIndex: 1301, // Dialog zIndex(1300) + 1

                '&:hover': {
                  backgroundColor: 'grey.900',
                },
              }}
            >
              <SvgIcon component={FillCloudUpload} inheritViewBox sx={{ fontSize: 40 }} />
            </MuiIconButton>
          )}
        </>
      )}

      {children}
    </UploadContext.Provider>
  )
}

export { UploadProvider, useUpload }

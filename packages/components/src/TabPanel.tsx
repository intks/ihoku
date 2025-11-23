import type { ReactNode } from 'react'

import { Box } from '@mui/material'
import type { Theme, SxProps } from '@mui/material/styles'

import { useTabsContext } from './Tabs'

interface TabPanelProps {
  children?: ReactNode
  value: string
  sx?: SxProps<Theme>
}

function TabPanel(props: TabPanelProps) {
  const { children, value, sx, ...other } = props

  const { currentTab } = useTabsContext()

  return (
    <Box
      role='tabpanel'
      hidden={currentTab !== value}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      sx={sx}
      {...other}
    >
      {children}
    </Box>
  )
}

export default TabPanel

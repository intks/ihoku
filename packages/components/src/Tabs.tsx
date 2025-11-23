import type { ReactElement, ReactNode, SyntheticEvent } from 'react'
import { createContext, forwardRef, useContext, useEffect, useState } from 'react'

import type { TabsProps as MuiTabsProps, TabProps as MuiTabProps, SxProps, Theme } from '@mui/material'
import { Tabs as MuiTabs, Tab, Stack } from '@mui/material'

interface ContextProps {
  currentTab: string
  handleChange: (event: SyntheticEvent, tab: string) => void
}

const TabsContext = createContext<ContextProps>({} as ContextProps)

export const useTabsContext = () => useContext(TabsContext)

export type TabOption = {
  value: string
  label?: string
} & MuiTabProps

type TabsProps = {
  children: ReactNode
  name: string
  options: TabOption[]
  defaultTab?: string
  /**
   * The value of the selected tab (in controlled mode)
   */
  tabValue?: string
  onChange?: (event: SyntheticEvent, tab: string) => boolean | Promise<boolean> | void
  tabsContainerSx?: SxProps<Theme>
  sx?: SxProps<Theme>
  tabSx?: SxProps<Theme>
  startAction?: ReactElement
  endAction?: ReactElement
} & MuiTabsProps

const getA11yProps = (value: string) => {
  return {
    id: `tab-${value}`,
    'aria-controls': `tab-${value}`,
  }
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      name,
      defaultTab,
      onChange,
      options,
      tabsContainerSx = {},
      sx = {},
      tabSx = {},
      startAction,
      endAction,
      tabValue,
      ...rest
    }: TabsProps,
    ref
  ) => {
    const [currentTab, setCurrentTab] = useState<string>(() => {
      return defaultTab ?? options[0]?.value ?? ''
    })

    const handleChange = async (event: SyntheticEvent, tab: string) => {
      const result = await onChange?.(event, tab)
      ;(result || result === undefined) && setCurrentTab(tab)
    }

    useEffect(() => {
      if (!tabValue) return
      setCurrentTab(tabValue)
    }, [tabValue])

    const context = {
      currentTab,
      handleChange,
    }

    return (
      <TabsContext.Provider value={context}>
        <Stack direction='row' alignItems='center' sx={tabsContainerSx}>
          {startAction}
          <MuiTabs
            ref={ref}
            value={currentTab}
            onChange={handleChange}
            aria-label={name}
            sx={{
              flex: 1,
              ...sx,
            }}
            {...rest}
          >
            {options.map(({ label, value, icon, ...rest }) => (
              <Tab key={value} value={value} label={label} icon={icon} {...getA11yProps(value)} sx={tabSx} {...rest} />
            ))}
          </MuiTabs>
          {endAction}
        </Stack>

        {children}
      </TabsContext.Provider>
    )
  }
)

export default Tabs

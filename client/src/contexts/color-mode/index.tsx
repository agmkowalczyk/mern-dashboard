import { ThemeProvider } from '@mui/material/styles'
import React, { createContext, useEffect, useState, ReactNode } from 'react'
import {
  DarkThemeWithResponsiveFontSizes as DarkTheme,
  LightThemeWithResponsiveFontSizes as LightTheme,
} from '../../theme'

type ColorModeContextType = {
  mode: string
  setMode: () => void
}
type PropsWithChildren<P = unknown> = P & { children?: ReactNode }

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
)

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem('colorMode')
  const isSystemPreferenceDark = window?.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const systemPreference = isSystemPreferenceDark ? 'dark' : 'light'
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference
  )

  useEffect(() => {
    window.localStorage.setItem('colorMode', mode)
  }, [mode])

  const setColorMode = () => {
    if (mode === 'light') {
      setMode('dark')
    } else {
      setMode('light')
    }
  }

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ThemeProvider theme={mode === 'light' ? LightTheme : DarkTheme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

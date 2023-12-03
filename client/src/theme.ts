import {
  DarkTheme as DefaultDarkTheme,
  LightTheme as DefaultLightTheme,
} from '@refinedev/mui'

import { createTheme, responsiveFontSizes } from '@mui/material/styles'

const LightTheme = createTheme({
  ...DefaultLightTheme,
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#11142d',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fcfcfc',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#fcfcfc',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          input: {
            border: '1px solid rgba(0,0,0,0.23)',
            borderRadius: 6,
          },
          '& .MuiSelect-select': {
            border: '1px solid rgba(0,0,0,0.23)',
            borderRadius: 6,
          },
          '& .MuiSelect-icon': {
            color: 'rgba(0, 0, 0, 0.54)',
          },
        },
      },
    },
  },
})

const DarkTheme = createTheme({
  ...DefaultDarkTheme,
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(0,0,0,0.23)',
          borderRadius: 6,
          color: '#111111',

          '&:hover': {
            border: '1px solid rgba(0,0,0,0.43)',
          },
          '& .MuiSelect-select': {
            border: '1px solid rgba(0,0,0,0.23)',
            borderRadius: 6,
          },
          '& .MuiSelect-icon': {
            color: 'rgba(0, 0, 0, 0.54)',
          },
        },
      },
    },
  },
})

const DarkThemeWithResponsiveFontSizes = responsiveFontSizes(DarkTheme)
const LightThemeWithResponsiveFontSizes = responsiveFontSizes(LightTheme)

export { LightThemeWithResponsiveFontSizes, DarkThemeWithResponsiveFontSizes }

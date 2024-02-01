import './App.css'

import { CssBaseline } from '@mui/material'
import React from 'react'
import { useRoutes } from 'react-router-dom'

import MatxTheme from './app/base/components/Template/MatxTheme/MatxTheme'
import { AuthProvider } from './app/base/contexts/JWTAuthContext'
import { SettingsProvider } from './app/base/contexts/SettingsContext'
import { appRoutes } from './app/routes/routes'

// import { store } from './app/store/store'

function App() {
  const content = useRoutes(appRoutes)
  return (
    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>
          <CssBaseline />
          {content}
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
  )
}

export default App

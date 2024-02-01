import { AppBar, ThemeProvider, Toolbar } from '@mui/material'
import { Box, styled, useTheme } from '@mui/system'
import React, { FC } from 'react'

import { topBarHeight } from '../../../../utils/constant'
import useSettings from '../../../hooks/useSettings'
import { Paragraph, Span } from '../Typography'

const AppFooter = styled(Toolbar)(() => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: topBarHeight,
  '@media (max-width: 499px)': {
    display: 'table',
    width: '100%',
    minHeight: 'auto',
    padding: '1rem 0',
    '& .container': {
      flexDirection: 'column !important',
      '& a': {
        margin: '0 0 16px !important',
      },
    },
  },
}))

const FooterContent = styled('div')(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  padding: '0px 1rem',
  maxWidth: '1170px',
  margin: '0 auto',
}))

const Footer: FC<any> = () => {
  const theme = useTheme()
  const { settings } = useSettings()

  const footerTheme = settings.themes[settings.footer.theme] || theme

  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar color="primary" position="static" sx={{ zIndex: 96 }}>
        <AppFooter>
          <FooterContent>
            <Span sx={{ m: 'auto' }}></Span>
            <Paragraph sx={{ m: 0 }}>
              ISI.INVOICE es un producto de &nbsp;
              <a href="https://integrate.com.bo" target="_blank" rel="noreferrer">
                INTEGRATE Soluciones Informáticas
              </a>{' '}
              <br />
              Plantilla{' '}
              <a target="_blank" href="https://matx-react.ui-lib.com/" rel="noreferrer">
                MatX
              </a>
            </Paragraph>
          </FooterContent>
        </AppFooter>
      </AppBar>
    </ThemeProvider>
  )
}

export default Footer
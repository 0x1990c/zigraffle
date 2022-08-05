import React from 'react';
import Routes from './Routes';
import theme from './theme';
import { dark, ThemeProvider } from 'zignaly-ui';
import { ThemeProvider as ThemeProviderMui } from '@mui/material';
import ModalProvider from 'mui-modal-provider';
import { BrowserRouter } from 'react-router-dom';

const augmentedTheme = { ...dark, ...theme };

function EntryPoint() {
  return (
    <ThemeProvider theme={dark}>
      <ThemeProviderMui theme={augmentedTheme}>
        <BrowserRouter>
          <ModalProvider>
            <Routes />
          </ModalProvider>
        </BrowserRouter>
      </ThemeProviderMui>
    </ThemeProvider>
  );
}

export default EntryPoint;

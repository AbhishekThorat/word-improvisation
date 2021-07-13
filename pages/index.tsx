
import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import IconButton from '@material-ui/core/IconButton';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import NoSsr from '@material-ui/core/NoSsr';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Typography from '@material-ui/core/Typography';
import Dashboard from './Dashboard';

const App = () => {
  const [prefersDarkMode, setPrefersDarkMode] = useState(true);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
        overrides: {
          MuiCssBaseline: {
            '@global': {
              html: {
                height: "100%",
                width: "100%",
              },
              body: {
                height: "100%",
                width: "100%",
              },
              [`#__next`]: {
                height: "100%",
                width: "100%",
              }
            },
          },
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NoSsr defer>
        <Box display="flex" width="100%" height="100%" flexDirection="column">
          <Box position="sticky" top="0" zIndex={2} width="100%" borderBottom="1px solid lightgray" paddingY="16px" bgcolor={theme.palette.background.default}>
            <Box display="flex">
              <IconButton
                aria-label="Toggle light/dark theme"
                onClick={() => setPrefersDarkMode((prev) => !prev)}
              >
                {
                  prefersDarkMode ? <Brightness4Icon /> : <Brightness7Icon />
                }
              </IconButton>
              <Typography align="center" variant="h3" component="h1" style={{ flexGrow: 1 }}>
                RANDOM WORD GAME
              </Typography>
            </Box>
          </Box>
          <Dashboard />
        </Box>
      </NoSsr>
    </ThemeProvider>
  )
};

export default App;
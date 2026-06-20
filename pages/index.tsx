import { useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import Typography from '@mui/material/Typography';
import Dashboard from '../components/Dashboard';
import { getTheme } from '../lib/theme';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 1.5 },
            px: { xs: 1.5, md: 3 },
            py: { xs: 1, sm: 1.5 },
            borderBottom: '1px solid',
            borderColor: 'divider',
            backdropFilter: 'blur(14px)',
            bgcolor: 'background.paper',
          }}
        >
          {/* Logo mark: the unknown word */}
          <Box
            aria-hidden
            sx={{
              width: { xs: 34, sm: 40 },
              height: { xs: 34, sm: 40 },
              flexShrink: 0,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: { xs: 19, sm: 22 },
              background: 'linear-gradient(135deg, #FF4D9D, #7C5CFF)',
              boxShadow: '0 8px 22px rgba(124,92,255,0.45)',
            }}
          >
            ?
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h5"
              component="h1"
              noWrap
              sx={{
                lineHeight: 1.1,
                fontSize: { xs: '1.15rem', sm: '1.5rem' },
                background: 'linear-gradient(135deg, #FF4D9D, #29E7FF)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Improvised word game
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
            >
              Guess the mind. Justify the chaos.
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            component="a"
            href="https://www.youtube.com/watch?v=j4VqaFwW1XI&t=23s"
            target="_blank"
            rel="noopener"
            startIcon={<HelpOutlineIcon />}
            sx={{
              color: 'text.primary',
              border: '1px solid',
              borderColor: 'divider',
              '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } },
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
              How to play
            </Box>
          </Button>
          <Tooltip title={darkMode ? 'Switch to light' : 'Switch to dark'}>
            <IconButton
              aria-label="Toggle light/dark theme"
              onClick={() => setDarkMode((prev) => !prev)}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        </Box>

        <Dashboard />
      </Box>
    </ThemeProvider>
  );
};

export default App;

import { createTheme, type Theme } from '@mui/material/styles';

export type Mode = 'light' | 'dark';

// Curated, high-energy palette. Each player is assigned one of these and keeps
// it everywhere (avatar ring + graph node) so they have a visual identity.
export const PLAYER_COLORS = [
  '#FF4D9D', // pink
  '#29E7FF', // cyan
  '#7C5CFF', // violet
  '#4DFFB0', // mint
  '#FF7A45', // coral
  '#FF5DEB', // magenta
  '#5DA8FF', // azure
  '#FFD23F', // sun
];

// The central "thinker" node always reads as the warm focal point.
export const ROOT_COLOR = '#FFC44D';

export const playerColor = (id: number): string =>
  PLAYER_COLORS[((id - 1) % PLAYER_COLORS.length + PLAYER_COLORS.length) % PLAYER_COLORS.length];

const FONT_BODY = 'var(--font-body), system-ui, -apple-system, sans-serif';
const FONT_DISPLAY = 'var(--font-display), system-ui, sans-serif';

const ambientDark =
  'radial-gradient(900px circle at 12% 8%, rgba(124,92,255,0.28), transparent 45%),' +
  'radial-gradient(800px circle at 88% 14%, rgba(255,77,157,0.22), transparent 45%),' +
  'radial-gradient(900px circle at 70% 92%, rgba(41,231,255,0.16), transparent 45%),' +
  '#0A0418';

const ambientLight =
  'radial-gradient(900px circle at 12% 8%, rgba(124,92,255,0.18), transparent 45%),' +
  'radial-gradient(800px circle at 88% 14%, rgba(255,77,157,0.14), transparent 45%),' +
  'radial-gradient(900px circle at 70% 92%, rgba(41,231,255,0.12), transparent 45%),' +
  '#F3F0FF';

export function getTheme(mode: Mode): Theme {
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: '#FF4D9D' },
      secondary: { main: '#29E7FF' },
      background: {
        default: dark ? '#0A0418' : '#F3F0FF',
        paper: dark ? 'rgba(24,13,54,0.72)' : 'rgba(255,255,255,0.82)',
      },
      text: {
        primary: dark ? '#F1ECFF' : '#1B1340',
        secondary: dark ? '#A99FD0' : '#6B5FA0',
      },
      divider: dark ? 'rgba(168,150,255,0.16)' : 'rgba(80,60,160,0.16)',
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: FONT_BODY,
      h1: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.02em' },
      h3: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.01em' },
      h5: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
      h6: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 700 },
      overline: { fontWeight: 700, letterSpacing: '0.18em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          'html, body, #__next': { height: '100%' },
          body: {
            margin: 0,
            minHeight: '100dvh',
            background: dark ? ambientDark : ambientLight,
            backgroundAttachment: 'fixed',
          },
          '*::-webkit-scrollbar': { width: 10, height: 10 },
          '*::-webkit-scrollbar-thumb': {
            background: dark ? 'rgba(168,150,255,0.25)' : 'rgba(80,60,160,0.25)',
            borderRadius: 999,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(14px)',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 14, paddingInline: 18 },
        },
        variants: [
          {
            props: { variant: 'contained', color: 'primary' },
            style: {
              background: 'linear-gradient(135deg, #FF4D9D 0%, #7C5CFF 100%)',
              boxShadow: '0 10px 28px rgba(255,77,157,0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #FF5DA6 0%, #8A6CFF 100%)',
                boxShadow: '0 14px 34px rgba(255,77,157,0.45)',
              },
              '&.Mui-disabled': {
                background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(20,10,50,0.06)',
                color: dark ? 'rgba(255,255,255,0.32)' : 'rgba(20,10,50,0.32)',
                boxShadow: 'none',
              },
            },
          },
        ],
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(20,10,50,0.03)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: dark ? 'rgba(168,150,255,0.2)' : 'rgba(80,60,160,0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: dark ? 'rgba(168,150,255,0.4)' : 'rgba(80,60,160,0.4)',
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': { color: '#fff' },
            '&.Mui-checked + .MuiSwitch-track': {
              background: 'linear-gradient(135deg, #FF4D9D, #7C5CFF)',
              opacity: 1,
            },
          },
          track: { borderRadius: 999 },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { fontFamily: FONT_BODY, fontSize: 12, borderRadius: 8 },
        },
      },
    },
  });
}

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import CasinoIcon from '@mui/icons-material/Casino';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import availableWords from '../availableWords';
import type { IPlayer } from './types';
import { playerColor } from '../lib/theme';

// react-force-graph touches the DOM/canvas, so it must only run on the client.
const Graph = dynamic(() => import('./Graph'), { ssr: false });

const ROOT_PLAYER: IPlayer = {
  active: true,
  name: 'ROOT',
  id: 0,
  prediction: '',
  isRoot: true,
};

const Dashboard = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const stageRef = useRef<HTMLDivElement>(null);
  const [players, setPlayers] = useState<IPlayer[]>([ROOT_PLAYER]);
  const [openAddPlayerModal, setOpenAddPlayerModal] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [graphSize, setGraphSize] = useState<{ width?: number; height?: number }>({});

  const guessers = players.filter((p) => !p.isRoot);
  const activePredictorsPending = players.some(
    (p) => p.active && !p.prediction && !p.isRoot,
  );
  const hasPlayers = guessers.length > 0;
  const canGenerateWord = hasPlayers && !activePredictorsPending;
  const secretWord = players.find((p) => p.isRoot)?.prediction ?? '';

  // Clear the input whenever the modal opens/closes.
  useEffect(() => {
    setPlayerName('');
  }, [openAddPlayerModal]);

  // Keep the graph sized to its stage as the window/layout changes.
  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setGraphSize({ width: rect.width, height: rect.height });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const generateRandomWord = () => {
    if (!availableWords.length) return;
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    setPlayers((prev) =>
      prev.map((p) => (p.isRoot ? { ...p, prediction: word } : p)),
    );
  };

  const handleAddPlayer = () => {
    const name = playerName.trim();
    if (!name) return;
    setPlayers((prev) => [
      ...prev,
      { name, active: true, id: prev.length, prediction: '' },
    ]);
    setOpenAddPlayerModal(false);
  };

  const handleToggle = (id: number) => () => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
    );
  };

  const handlePlayerPrediction = (prediction: string, id: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, prediction } : p)),
    );
  };

  // Game status shown as a HUD chip over the stage.
  const status = !hasPlayers
    ? { label: 'Add your crew to begin', color: 'default' as const }
    : activePredictorsPending
      ? { label: 'Waiting for everyone to guess', color: 'default' as const }
      : secretWord
        ? { label: `Revealed · ${secretWord}`, color: 'secondary' as const }
        : { label: 'Ready — reveal the word', color: 'primary' as const };

  return (
    <>
      <Head>
        <title>Improvised word game</title>
      </Head>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: 0,
          }}
        >
          {/* ---------- Players panel ---------- */}
          <Box
            sx={{
              width: { xs: '100%', md: 360 },
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              borderRight: { md: '1px solid' },
              borderBottom: { xs: '1px solid', md: 'none' },
              borderColor: { xs: 'divider', md: 'divider' },
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2.5,
                py: 2,
              }}
            >
              <Typography variant="h5" component="h2">
                Players
              </Typography>
              {hasPlayers && (
                <Chip
                  size="small"
                  label={guessers.length}
                  sx={{ fontWeight: 700, bgcolor: 'action.selected' }}
                />
              )}
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                aria-label="Add player"
                onClick={() => setOpenAddPlayerModal(true)}
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <AddIcon />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', px: 2, minHeight: 0 }}>
              {!hasPlayers ? (
                <Box sx={{ textAlign: 'center', px: 3, py: 6, color: 'text.secondary' }}>
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                    No players yet
                  </Typography>
                  <Typography variant="body2">
                    Add your crew, jot down what each person thinks the word is, then
                    reveal it and improvise.
                  </Typography>
                </Box>
              ) : (
                guessers.map((player) => {
                  const color = playerColor(player.id);
                  const initial = player.name.trim().charAt(0).toUpperCase() || '?';
                  return (
                    <Box
                      key={player.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        opacity: player.active ? 1 : 0.5,
                        transition: 'transform .15s ease, border-color .15s ease',
                        '&:hover': { transform: 'translateY(-2px)', borderColor: color },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          flexShrink: 0,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          border: `2px solid ${color}`,
                          color,
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          boxShadow: `0 0 14px ${color}55`,
                        }}
                      >
                        {initial}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          noWrap
                          sx={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}
                        >
                          {player.name}
                        </Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={player.prediction}
                          onChange={(e) => handlePlayerPrediction(e.target.value, player.id)}
                          placeholder="Their guess…"
                          disabled={!player.active}
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                      <Switch
                        edge="end"
                        onChange={handleToggle(player.id)}
                        checked={player.active}
                        slotProps={{ input: { 'aria-label': `Toggle ${player.name}` } }}
                      />
                    </Box>
                  );
                })
              )}

              <Button
                fullWidth
                onClick={() => setOpenAddPlayerModal(true)}
                startIcon={<PersonAddAlt1Icon />}
                sx={{
                  mt: hasPlayers ? 0 : 2,
                  py: 1.25,
                  color: 'text.secondary',
                  border: '1px dashed',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main', color: 'text.primary' },
                }}
              >
                Add player
              </Button>
            </Box>

            <Box sx={{ p: 2 }}>
              {hasPlayers && !canGenerateWord && (
                <Typography
                  variant="caption"
                  component="p"
                  align="center"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Everyone needs a guess before the reveal.
                </Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<CasinoIcon />}
                sx={{ py: 1.5, fontSize: 16 }}
                onClick={generateRandomWord}
                disabled={!canGenerateWord}
              >
                {secretWord ? 'Reveal another word' : 'Reveal the word'}
              </Button>
            </Box>
          </Box>

          {/* ---------- Constellation stage ---------- */}
          <Box
            ref={stageRef}
            sx={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              minHeight: { xs: 380, md: 0 },
            }}
          >
            <Chip
              label={status.label}
              color={status.color}
              variant={status.color === 'default' ? 'outlined' : 'filled'}
              sx={{
                position: 'absolute',
                top: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                maxWidth: '90%',
              }}
            />
            <Graph
              players={players}
              graphSectionWidth={graphSize.width}
              graphSectionHeight={graphSize.height}
              mode={mode}
            />
          </Box>
        </Box>

        <Box
          component="footer"
          sx={{
            textAlign: 'center',
            py: 1.5,
            color: 'text.secondary',
            fontSize: 13,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          Handcrafted with <span style={{ color: '#FF4D9D' }}>&#9829;</span> in India ·{' '}
          <Link
            color="secondary"
            href="https://github.com/AbhishekThorat/word-improvisation"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </Link>
        </Box>
      </Box>

      <Modal
        open={openAddPlayerModal}
        onClose={() => setOpenAddPlayerModal(false)}
        aria-labelledby="add-player-title"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 380,
            maxWidth: '90vw',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography id="add-player-title" variant="h6" sx={{ mb: 2 }}>
            Add a player
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              autoFocus
              fullWidth
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPlayer();
              }}
              placeholder="Player name"
            />
            <IconButton
              aria-label="Confirm add player"
              onClick={handleAddPlayer}
              sx={{
                color: '#fff',
                background: 'linear-gradient(135deg, #FF4D9D, #7C5CFF)',
                '&:hover': { background: 'linear-gradient(135deg, #FF5DA6, #8A6CFF)' },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Dashboard;

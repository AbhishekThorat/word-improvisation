import React, { useEffect, useState } from 'react';
import Head from "next/head";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  footer: {
    textAlign: "center",
    marginTop: "auto",
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
  playerSection: {
    maxWidth: "25%",
    height: "100%",
    flexGrow: 1,
  },
  graphSection: {
    flexGrow: 1
  },
  centerAligned: {
    textAlign: "center",
  },
  addPlayerModal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex"
  }
}));

interface IPlayer {
  name: string;
  id: string;
  active: boolean
  prediction?: string;
}

export default function CustomizedTimeline() {
  const classes = useStyles();
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [openAddPlayerModal, setOpenAddPlayerModal] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");

  useEffect(() => {
    setPlayerName("");
  }, [openAddPlayerModal]);

  const handleAddPlayer = () => {
    setPlayers((prevState) => [
      ...prevState,
      {
        name: playerName,
        active: true,
        id: `${playerName}_${Date.now}`,
      }
    ]);
    setOpenAddPlayerModal(false);
  }

  const handleToggle = (player: IPlayer, playerIndex: number) => () => {
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex].active = !player.active;
    setPlayers(updatedPlayers);
  };

  const renderAddPlayerModal = (
    <div className={classes.addPlayerModal}>
      <TextField
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        label="Player Name"
        fullWidth
      />
      <IconButton
        aria-label="Toggle light/dark theme"
        onClick={() => handleAddPlayer()}
      >
        <SendIcon />
      </IconButton>

    </div>
  );

  return (
    <React.Fragment>
      <Head>
        <title>Random word game - Improv Comedy</title>
      </Head>

      <div className={classes.container}>
        <Box className={classes.playerSection} borderRight="1px solid lightgray" borderBottom="1px solid lightgray">
          <Box display="flex" position="sticky" top="0" zIndex={2} width="100%" borderBottom="1px solid lightgray" paddingY="16px">
            <Typography align="center" variant="h3" component="h1" style={{ flexGrow: 1 }}>
              Players
            </Typography>

            <IconButton
              aria-label="Toggle light/dark theme"
              onClick={() => setOpenAddPlayerModal(true)}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <List dense>
            {players.map((player, playerIndex) => {
              return (
                <ListItem key={player.id} button>
                  <ListItemAvatar>
                    <AccountCircle />
                  </ListItemAvatar>
                  <ListItemText primary={player.name} />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      onChange={handleToggle(player, playerIndex)}
                      checked={player.active}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Box>
        <div className={classes.graphSection}>

        </div>
      </div>
      <footer className={classes.footer}>
        <Box className={classes.centerAligned}>
          Handcrafted with <span style={{ color: "#ea4e4e" }}>&#9829;</span> in India
        </Box>
        <Box className={classes.centerAligned}>
          For contribution/issues/suggestions, please visit
          <Link color="secondary" href="https://github.com/AbhishekThorat/game-improv-word">
            {" "}
            this github repo
          </Link>
        </Box>
      </footer>

      <Modal
        open={openAddPlayerModal}
        onClose={() => setOpenAddPlayerModal(false)}
        aria-labelledby="Add Player"
        aria-describedby="Add Player to the word game :D"
      >
        {renderAddPlayerModal}
      </Modal>
    </React.Fragment>
  );
}
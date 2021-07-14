import React, { useEffect, useState, useRef } from 'react';
import Head from "next/head";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
import NoSsr from '@material-ui/core/NoSsr';
import { Button } from '@material-ui/core';
import availableWords from "../availableWords";
import { Graph } from "../components";

const useStyles = makeStyles((theme) => ({
  footer: {
    textAlign: "center",
    marginTop: "auto",
  },
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    position: "relative",
  },
  playerSection: {
    maxWidth: "25%",
    height: "100%",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  },
  graphSection: {
    flexGrow: 1,
    position: "absolute",
    width: "75%",
    right: 0,
    overflow: "hidden",
    height: "100%",
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

export interface IPlayer {
  name: string;
  id: number;
  active: boolean
  prediction: string;
  isRoot?: boolean;
}

const Dashboard = () => {
  const classes = useStyles();
  const containerRef = useRef(null);
  const [players, setPlayers] = useState<IPlayer[]>([{ active: true, name: "ROOT", id: 0, prediction: "", isRoot: true }]);
  const [openAddPlayerModal, setOpenAddPlayerModal] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [graphSectionWidth, setGraphSectionWidth] = useState<number>();
  const [graphSectionHeight, setGraphSectionHeight] = useState<number>();
  const [enableGenerateWordButton, setEnableGenerateWordButton] = useState<boolean>(false);

  const generateRandomWord = () => {
    if (!availableWords.length) return
    const randomizedIndex = Math.floor(Math.random() * availableWords.length)
    const updatedPlayers = [...players];
    updatedPlayers[0].prediction = availableWords[randomizedIndex];
    setPlayers(updatedPlayers);
  }

  useEffect(() => {
    setPlayerName("");
  }, [openAddPlayerModal]);

  useEffect(() => {
    const unPredictedValues = players.filter((player) => player.active && !player.prediction && !player.isRoot);
    setEnableGenerateWordButton(unPredictedValues.length === 0);
  }, [players]);

  useEffect(() => {
    if (containerRef.current) {
      const clientRect = containerRef.current.getBoundingClientRect();
      setGraphSectionWidth(clientRect?.width * 0.75);
      setGraphSectionHeight(clientRect?.height);
    }
  }, [containerRef?.current]);

  const handleAddPlayer = () => {
    setPlayers((prevState) => [
      ...prevState,
      {
        name: playerName,
        active: true,
        id: prevState.length + 1,
        prediction: ""
      }
    ]);
    setOpenAddPlayerModal(false);
  }

  const handleToggle = (player: IPlayer, playerIndex: number) => () => {
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex].active = !player.active;
    setPlayers(updatedPlayers);
  };

  const handlePlayerPrediction = (prediction: string, playerIndex: number) => {
    const updatedPlayers = [...players];
    updatedPlayers[playerIndex].prediction = prediction;
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
      <NoSsr defer>
        <Head>
          <title>Improvised word game</title>
        </Head>

        <div className={classes.container} ref={containerRef}>
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

            {
              players.length === 1 && (
                <React.Fragment>
                  <Typography align="center" variant="h6" style={{ flexGrow: 1 }}>
                    Please add players to play!!
                  </Typography>
                  <Typography align="center" variant="h6" style={{ flexGrow: 1 }}>
                    And be ready for improvisation :D
                  </Typography>
                </React.Fragment>
              ) || (
                <React.Fragment>
                  <List dense style={{ flexGrow: 1 }}>
                    {players.map((player, playerIndex) => {
                      return player.isRoot ? null : (
                        <ListItem key={player.id}>
                          <ListItemAvatar>
                            <AccountCircle />
                          </ListItemAvatar>

                          <ListItemText
                            primary={player.name}
                            secondary={
                              <Box display="flex">
                                <TextField
                                  value={player.prediction}
                                  onChange={(event) => handlePlayerPrediction(event.target.value, playerIndex)}
                                  label="Prediction"
                                  disabled={!player.active}
                                  style={{ flexGrow: 1 }}
                                />
                                <Switch
                                  edge="end"
                                  onChange={handleToggle(player, playerIndex)}
                                  checked={player.active}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                  <Box>
                    {
                      !enableGenerateWordButton && (
                        <Typography align="center" variant="h6" component="h6" style={{ flexGrow: 1 }}>
                          Please predict words for all active players.
                        </Typography>
                      )
                    }
                    <Button variant="contained" color="primary" style={{ padding: 24, width: "100%" }} onClick={generateRandomWord} disabled={!enableGenerateWordButton} >
                      Generate Word
                    </Button>
                  </Box>
                </React.Fragment>
              )
            }
          </Box>
          <div className={classes.graphSection}>
            <Graph
              players={players}
              graphSectionWidth={graphSectionWidth}
              graphSectionHeight={graphSectionHeight}
            />
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
      </NoSsr>
    </React.Fragment>
  );
}

export default Dashboard;

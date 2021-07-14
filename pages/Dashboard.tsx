import React, { useEffect, useState, useRef } from 'react';
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
import { ForceGraph2D } from 'react-force-graph';
import NoSsr from '@material-ui/core/NoSsr';
import { Button } from '@material-ui/core';

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
    background: "lightgrey",
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

interface IPlayer {
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

  useEffect(() => {
    setPlayerName("");
  }, [openAddPlayerModal]);


  useEffect(() => {
    if (containerRef.current) {
      setGraphSectionWidth(containerRef.current.getBoundingClientRect()?.width * 0.75);
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

  function getTree() {
    const tempPlayers = players.filter(player => player.active)
    return {
      nodes: tempPlayers.map(player => ({ id: player.id, name: player.name, prediction: player.prediction, isRoot: player.isRoot })),
      links: tempPlayers
        .filter(id => id)
        .map(player => ({
          "source": 0,
          "target": player.id,
        }))
    };
  }

  function nodePaint(data, color, ctx) {
    const { id, x, y } = data;
    ctx.fillStyle = color;
    [
      () => {
        ctx.font = '20px Sans-Serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (data.prediction) {
          ctx.fillText(data.prediction, x, y);
        } else {
          ctx.fillText("?", x, y);
        }
      },
    ][id % 1]();
  }

  // gen a number persistent color from around the palette
  const getColor = n => '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');


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
          <title>Random word game - Improv Comedy</title>
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
            <Button variant="contained" >
              Generate Word
            </Button>
          </Box>
          <div className={classes.graphSection}>
            <ForceGraph2D
              graphData={getTree()}
              nodeLabel="id"
              nodeCanvasObject={(node: any, ctx) => nodePaint(node, getColor(node.id), ctx)}
              nodePointerAreaPaint={nodePaint}
              minZoom={2}
              linkWidth={2}
              width={graphSectionWidth}
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

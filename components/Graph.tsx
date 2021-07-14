import React from 'react';
import { ForceGraph2D } from 'react-force-graph';
// @TODO - Need to move this to utils.
import { IPlayer } from "../pages/Dashboard";

interface IProps {
  players: IPlayer[];
  graphSectionWidth: number;
  graphSectionHeight: number;
}

const Graph = ({ players, graphSectionWidth, graphSectionHeight }: IProps) => {
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

  return (
    <ForceGraph2D
      graphData={getTree()}
      nodeLabel="id"
      nodeCanvasObject={(node: any, ctx) => nodePaint(node, getColor(node.id), ctx)}
      nodePointerAreaPaint={nodePaint}
      minZoom={2}
      linkWidth={2}
      width={graphSectionWidth}
      height={graphSectionHeight}
    />
  );
}

export default Graph;

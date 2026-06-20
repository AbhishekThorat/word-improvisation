import { useCallback, useEffect, useRef } from 'react';
import ForceGraph2D, { type ForceGraphMethods } from 'react-force-graph-2d';
import type { IPlayer } from './types';
import { display } from '../lib/fonts';
import { playerColor, ROOT_COLOR, type Mode } from '../lib/theme';

interface IProps {
  players: IPlayer[];
  graphSectionWidth?: number;
  graphSectionHeight?: number;
  mode: Mode;
}

interface GraphNode {
  id: number;
  name: string;
  prediction: string;
  isRoot?: boolean;
  color: string;
  x?: number;
  y?: number;
  // cached pill geometry for pointer hit-testing
  __w?: number;
  __h?: number;
  __r?: number;
}

const fontFamily = display.style.fontFamily;

const Graph = ({ players, graphSectionWidth, graphSectionHeight, mode }: IProps) => {
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const dark = mode === 'dark';

  const activePlayers = players.filter((player) => player.active);

  const graphData = {
    nodes: activePlayers.map<GraphNode>((player) => ({
      id: player.id,
      name: player.name,
      prediction: player.prediction,
      isRoot: player.isRoot,
      color: player.isRoot ? ROOT_COLOR : playerColor(player.id),
    })),
    links: activePlayers
      .filter((player) => player.id !== 0)
      .map((player) => ({ source: 0, target: player.id })),
  };

  // Spread the constellation out a little and reframe once it settles.
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    fg.d3Force('charge')?.strength(-320);
    fg.d3Force('link')?.distance(120);
  }, []);

  const drawPill = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D, scale: number) => {
      const { x = 0, y = 0, isRoot, color } = node;
      const label = (isRoot ? node.prediction || '?' : node.prediction || node.name) || '?';

      const fontPx = (isRoot ? 17 : 13) / scale;
      ctx.font = `${isRoot ? 700 : 600} ${fontPx}px ${fontFamily}`;
      const padX = 11 / scale;
      const padY = 7 / scale;
      const textWidth = ctx.measureText(label).width;
      const w = textWidth + padX * 2;
      const h = fontPx + padY * 2;
      const r = h / 2;

      node.__w = w;
      node.__h = h;
      node.__r = r;

      // Soft glow + fill
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
      ctx.shadowColor = color;
      ctx.shadowBlur = (isRoot ? 22 : 14) / scale;
      ctx.fillStyle = dark
        ? isRoot
          ? 'rgba(28,18,8,0.9)'
          : 'rgba(14,7,34,0.85)'
        : color; // light mode: solid colour chip
      ctx.fill();
      ctx.restore();

      // Border
      ctx.lineWidth = (isRoot ? 2 : 1.5) / scale;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
      ctx.stroke();

      // Label
      ctx.fillStyle = dark ? color : '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
    },
    [dark],
  );

  const paintPointerArea = useCallback(
    (node: GraphNode, color: string, ctx: CanvasRenderingContext2D) => {
      const { x = 0, y = 0, __w = 12, __h = 12, __r = 6 } = node;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x - __w / 2, y - __h / 2, __w, __h, __r);
      ctx.fill();
    },
    [],
  );

  return (
    <ForceGraph2D
      ref={fgRef}
      graphData={graphData}
      width={graphSectionWidth}
      height={graphSectionHeight}
      backgroundColor="rgba(0,0,0,0)"
      nodeCanvasObject={(node, ctx, scale) => drawPill(node as GraphNode, ctx, scale)}
      nodePointerAreaPaint={(node, color, ctx) =>
        paintPointerArea(node as GraphNode, color, ctx)
      }
      linkColor={() => (dark ? 'rgba(168,150,255,0.18)' : 'rgba(80,60,160,0.22)')}
      linkWidth={1.4}
      linkDirectionalParticles={2}
      linkDirectionalParticleSpeed={0.006}
      linkDirectionalParticleWidth={2}
      linkDirectionalParticleColor={() => '#29E7FF'}
      cooldownTicks={120}
      onEngineStop={() => fgRef.current?.zoomToFit(500, 70)}
    />
  );
};

export default Graph;

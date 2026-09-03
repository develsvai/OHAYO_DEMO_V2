import type { ProductTask } from './scenario';

export const taskNodeWidth = 190;
export const taskNodeHeight = 104;
export const graphHeight = 590;
const groupWidth = 490;
export function createTaskGraph(tasks: ProductTask[]) {
  const graphGroups = [...new Set(tasks.map((task) => task.group))];
  const graphWidth = 260 + graphGroups.length * groupWidth;

  const graphLayout = [
    { id: 0, x: 28, y: 250 },
    ...tasks.map((task, index) => ({
      id: task.id,
      x: 260 + Math.floor(index / 4) * groupWidth + Math.floor(index % 4 / 2) * 230,
      y: index % 2 === 0 ? 130 : 370,
    })),
  ];

  const graphEdges = tasks.flatMap((task) => task.dependsOn.map((source) => [source, task.id] as const));

  function groupPosition(index: number) {
    return 240 + index * groupWidth;
  }

  function edgePath(sourceId: number, targetId: number) {
    const source = graphLayout[sourceId];
    const target = graphLayout[targetId];
    if (source.x === target.x) {
      const x = source.x + taskNodeWidth / 2;
      const start = source.y + taskNodeHeight;
      const end = target.y;
      return `M ${x} ${start} L ${x} ${end}`;
    }
    const startX = source.x + taskNodeWidth;
    const startY = source.y + taskNodeHeight / 2;
    const endX = target.x;
    const endY = target.y + taskNodeHeight / 2;
    const middleX = (startX + endX) / 2;
    return `M ${startX} ${startY} C ${middleX} ${startY}, ${middleX} ${endY}, ${endX} ${endY}`;
  }

  return { graphGroups, graphWidth, graphLayout, graphEdges, groupPosition, edgePath };
}

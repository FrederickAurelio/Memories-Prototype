import { Rect } from "react-konva";

function Clipper({ options, width = 20, height = 40, color = "gray" }) {
  const { x, y, ropeId, attached, id } = options;
  return (
    <Rect
      clipperId={id}
      attached={attached}
      rotation={180}
      ropeId={ropeId}
      x={x}
      y={y + height / 2}
      width={width}
      height={height}
      fill={color}
    />
  );
}

export default Clipper;

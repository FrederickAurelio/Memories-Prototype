import { memo } from "react";
import { Shape } from "react-konva";

const Rope = memo(function Rope({ rope, addClipper }) {
  function handleClick(e) {
    if (!rope.created) return;
    const { clientX, clientY } = e.evt;
    const selectedRopeId = e.target.attrs.ropeId;
    addClipper(clientX, clientY, selectedRopeId);
  }
  return (
    <>
      <Shape
        ropeId={rope.id}
        onClick={handleClick}
        width={rope.width}
        height={rope.height}
        sceneFunc={function (context, shape) {
          context.beginPath();

          // Mid-point for the curve
          const midX = (rope.startX + rope.endX) / 2;

          // Control point for the curve
          const controlPointX = midX;
          const controlPointY =
            (rope.endY >= rope.startY ? rope.endY : rope.startY) + 30;

          // Draw only the curve (no straight line)
          context.moveTo(rope.startX, rope.startY); // Start of the curve
          context.quadraticCurveTo(
            controlPointX,
            controlPointY, // Control point
            rope.endX,
            rope.endY, // End of the curve
          );

          // Stroke the curve with black color
          context.strokeStyle = "black";
          context.lineWidth = 4;
          context.stroke(); // Draw the curve

          // No need to close the path since we're only drawing a curve
          context.fillStrokeShape(shape);
        }}
        stroke="black"
        strokeWidth={4}
      />
    </>
  );
});

export default Rope;

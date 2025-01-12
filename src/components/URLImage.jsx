import { useLocalStorage } from "@uidotdev/usehooks";
import { memo, useEffect, useRef } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import useImage from "use-image";
import {
  distance,
  getClosestPointOnLine,
  getConstrained,
  imageMargin,
  imageMarginBot,
  proximityThreshold,
} from "../helpers";

const URLImage = memo(function URLImage({
  id,
  src,
  x,
  y,
  setIsSelected,
  isSelected,
  moveToTop,
  setClipperAsAttached,
}) {
  const [imageDOM] = useImage(src);
  const [image, setImage] = useLocalStorage(id, {
    x,
    y,
    src,
    rotation: 0,
    width: 0,
    height: 0,
  });
  const groupRef = useRef();
  const transformerRef = useRef();

  // function handleDrag(e) {
  //   const { x, y, rotation, scaleX, scaleY } = e.target.attrs;
  //   console.log(e.target.getAllIntersections({ x, y }));
  // }

  function handleClick() {
    setIsSelected(id);
    moveToTop(id);
  }

  function handleTransformEnd(e) {
    const { x, y, rotation, scaleX, scaleY } = e.target.attrs;
    const { width: stageWidth, height: stageHeight } =
      e.target.parent.parent.attrs;
    const { constrainedX, constrainedY } = getConstrained(
      x,
      y,
      rotation,
      image.width,
      image.height,
      stageWidth,
      stageHeight,
    );

    setImage((img) => ({
      ...img,
      x: constrainedX,
      y: constrainedY,
      rotation,
      width: Math.max(5, img.width * scaleX),
      height: Math.max(img.height * scaleY),
    }));

    groupRef.current.position({ x: constrainedX, y: constrainedY });
    groupRef.current.scaleX(1);
    groupRef.current.scaleY(1);
  }

  const handleDragMove = (e) => {
    const { x: startX, y: startY, rotation, width, height } = e.target.attrs;
    const imageWidth = width + imageMargin * 2;
    const imageHeight = height + imageMarginBot;
    let endX;
    let endY;

    if (rotation >= 0 && rotation < 90) {
      endX = startX + Math.cos((rotation * Math.PI) / 180) * imageWidth;
      endY = startY + Math.sin((rotation * Math.PI) / 180) * imageHeight;
    } else if (rotation >= -90 && rotation < 0) {
      endX =
        startX + Math.cos((Math.abs(rotation) * Math.PI) / 180) * imageWidth;
      endY =
        startY - Math.sin((Math.abs(rotation) * Math.PI) / 180) * imageHeight;
    } else return;

    const clippers = e.target
      .getLayer()
      .children.filter((shape) => shape.attrs.attached === false);


    if (clippers.length === 0) return;

    for (const clipper of clippers) {
      const clipperId = clipper.attrs.clipperId;
      const x = clipper.attrs.x - 10;
      const y = clipper.attrs.y;
      const closestPoint = getClosestPointOnLine(
        x,
        y,
        startX,
        startY,
        endX,
        endY,
      );

      if (
        distance(x, y, closestPoint.x, closestPoint.y) <= proximityThreshold
      ) {
        // Snap image to the rope
        setImage((img) => ({
          ...img,
          x: x - (closestPoint.x - startX),
          y: y - (closestPoint.y - startY) - 8,
        }));
        // setClipperAsAttached(clipperId);
        break;
      }
    }
  };

  useEffect(() => {
    if (image.width === 0 || image.height === 0)
      setImage((img) => ({
        ...img,
        width: img.width || imageDOM?.width || 0,
        height: img.height || imageDOM?.height || 0,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDOM]);

  useEffect(() => {
    if (isSelected) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer().batchDraw();
    } else {
      transformerRef.current.nodes([]); // Clear transformer nodes when deselected
    }
  }, [isSelected]);

  return (
    <>
      <Group
        onDragMove={handleDragMove}
        width={image ? image.width + imageMargin * 2 : 0}
        height={image ? image.height + imageMarginBot : 0} // Larger bottom border
        x={image.x}
        y={image.y}
        rotation={image.rotation}
        onClick={handleClick}
        onTap={handleClick}
        onDragStart={handleClick}
        ref={groupRef}
        draggable
        onDragEnd={handleTransformEnd}
        onTransformEnd={handleTransformEnd}
        // onDragMove={handleDrag}
      >
        {/* Polaroid-style border */}
        <Rect
          width={image ? image.width + imageMargin * 2 : 0}
          height={image ? image.height + imageMarginBot : 0} // Larger bottom border
          fill="white"
          shadowBlur={10}
          shadowColor="rgba(0, 0, 0, 0.3)"
          shadowOffsetX={7}
          shadowOffsetY={7}
        />
        {/* Image positioned within the border */}
        <Image
          x={imageMargin} // Centered horizontally within the border
          y={imageMargin} // Spaced from top of border
          width={image.width}
          height={image.height}
          image={imageDOM}
        />
      </Group>
      <Transformer
        ref={transformerRef}
        flipEnabled={false}
        boundBoxFunc={(oldBox, newBox) => {
          // limit resize
          if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    </>
  );
});

export default URLImage;

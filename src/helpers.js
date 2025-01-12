export const imageMargin = 10;
export const imageMarginBot = 15 + imageMargin;
export const proximityThreshold = 10; // Set proximity threshold for snapping

export function getConstrained(x, y, degree, width, height, stageWidth, stageHeight) {
  let maxWidth;
  let maxHeight;
  let minWidth;
  let minHeight;

  const imageWidth = width + imageMargin * 2;
  const imageHeight = height + imageMarginBot

  if (degree >= 0 && degree < 90) {
    minWidth = 3 + Math.sin((degree * Math.PI) / 180) * imageHeight;
    maxWidth =
      stageWidth - Math.cos((degree * Math.PI) / 180) * imageWidth - 3;
    minHeight = 3;
    maxHeight =
      stageHeight -
      (Math.cos((degree * Math.PI) / 180) * imageHeight +
        Math.sin((degree * Math.PI) / 180) * imageWidth);
  }

  else if (degree >= 90 && degree <= 180) {
    minWidth =
      3 +
      Math.cos(((degree - 90) * Math.PI) / 180) * imageHeight +
      Math.sin(((degree - 90) * Math.PI) / 180) * imageWidth;
    maxWidth = stageWidth - 3;
    minHeight = 3 + Math.sin(((degree - 90) * Math.PI) / 180) * imageHeight;
    maxHeight =
      stageHeight -
      Math.cos(((degree - 90) * Math.PI) / 180) * imageWidth -
      3;
  }

  else if (degree >= -180 && degree < -90) {
    minWidth = 3 + Math.cos(((degree + 180) * Math.PI) / 180) * imageWidth;
    maxWidth =
      stageWidth -
      3 -
      Math.sin(((degree + 180) * Math.PI) / 180) * imageHeight;
    minHeight =
      3 +
      Math.cos(((degree + 180) * Math.PI) / 180) * imageHeight +
      Math.sin(((degree + 180) * Math.PI) / 180) * imageWidth;
    maxHeight = stageHeight - 3;
  }

  else if (degree > -90 && degree <= 0) {
    minWidth = 3;
    maxWidth =
      stageWidth -
      Math.cos(((degree + 90) * Math.PI) / 180) * imageHeight -
      Math.sin(((degree + 90) * Math.PI) / 180) * imageWidth -
      3;
    minHeight = 3 + Math.cos(((degree + 90) * Math.PI) / 180) * imageWidth;
    maxHeight =
      stageHeight -
      Math.sin(((degree + 90) * Math.PI) / 180) * imageHeight -
      3;
  }

  const constrainedX = x < minWidth ? minWidth : x > maxWidth ? maxWidth : x;
  const constrainedY =
    y < minHeight ? minHeight : y > maxHeight ? maxHeight : y;

  return { constrainedX, constrainedY };
}

// Calculate the distance between two points
export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Get the closest point on a line segment (rope)
export function getClosestPointOnLine(x, y, x1, y1, x2, y2) {
  const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (lineLengthSquared === 0) return { x: x1, y: y1 }; // Line is a point

  let t = ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / lineLengthSquared;
  t = Math.max(0, Math.min(1, t)); // Clamp t to [0, 1]

  const closestX = x1 + t * (x2 - x1);
  const closestY = y1 + t * (y2 - y1);

  return { x: closestX, y: closestY };
}

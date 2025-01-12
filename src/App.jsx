import { useState, useEffect, useRef } from "react";
import { Layer, Stage } from "react-konva";
import URLImage from "./components/URLImage";
import Rope from "./components/Rope";
import { useLocalStorage } from "@uidotdev/usehooks";
import Clipper from "./components/Clipper";

const initialStateRope = {
  isCreatingRope: false,
  width: 1400,
  height: 680,
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
};

const initialStatePhoto = [
  {
    src: "https://konvajs.org/assets/yoda.jpg",
    x: 150,
    y: 50,
    id: "stars",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR34YMBfx94RgRaNN48fbxxD61t_QZBLew0PQ&s",
    x: 300,
    y: 50,
    id: "cam",
  },
  {
    src: "https://static.vecteezy.com/system/resources/thumbnails/022/385/025/small_2x/a-cute-surprised-black-haired-anime-girl-under-the-blooming-sakura-ai-generated-photo.jpg",
    x: 200,
    y: 300,
    id: "anime",
  },
];

const App = () => {
  const [clippers, setClippers] = useLocalStorage("clip", []);
  const [createdRopes, setCreatedRopes] = useLocalStorage("rope", []);
  const [photos, setPhotos] = useState(initialStatePhoto);
  const [rope, setRope] = useState(initialStateRope);
  const [isSelected, setIsSelected] = useState(null);
  const [offsets, setOffsets] = useState({ left: 0, top: 0 });
  const stageRef = useRef(null);

  // Calculate offsets dynamically based on window resizing
  useEffect(() => {
    const calculateOffsets = () => {
      if (stageRef.current) {
        const container = stageRef.current.container();
        const rect = container.getBoundingClientRect();
        setOffsets({ left: rect.left, top: rect.top });
      }
    };

    calculateOffsets();
    window.addEventListener("resize", calculateOffsets);

    return () => {
      window.removeEventListener("resize", calculateOffsets);
    };
  }, []);

  function moveToTop(id) {
    const curPhoto = photos.find((photo) => photo.id === id);
    const newPhotos = photos.filter((photo) => photo.id !== id);
    setPhotos([...newPhotos, curPhoto]);
  }

  function addClipper(x, y, ropeId) {
    setClippers((clippers) => [
      ...clippers,
      {
        id: new Date().getTime(),
        x: x - offsets.left + 10,
        y: y - offsets.top,
        ropeId,
        attached: false,
      },
    ]);
  }

  function setClipperAsAttached(id) {
    const clippersCopy = clippers.map((clipper) =>
      clipper.id === id ? { ...clipper, attached: true } : clipper,
    );
    setClippers(clippersCopy);
  }

  // Helper function to handle border click logic
  const handleBorderClick = (x, y) => {
    const margin = 12;
    const rightBorder = rope.width - margin;
    if (x <= margin) {
      return { startX: -1, endX: -1, startY: y, endY: y };
    } else if (y <= margin) {
      return { startX: x, endX: x, startY: -1, endY: -1 };
    } else if (x >= rightBorder) {
      return {
        startX: rope.width - 3,
        endX: rope.width - 3,
        startY: y,
        endY: y,
      };
    }
    return null;
  };

  const handleMouseMove = (e) => {
    if (rope.isCreatingRope) {
      setRope((prevRope) => ({
        ...prevRope,
        endX: e.evt.clientX - offsets.left,
        endY: e.evt.clientY - offsets.top,
      }));
    }
  };

  const handleClickStage = (e) => {
    const x = e.evt.clientX - offsets.left;
    const y = e.evt.clientY - offsets.top;
    const borderCoordinates = handleBorderClick(x, y);

    if (!rope.isCreatingRope && borderCoordinates) {
      setRope({
        ...rope,
        isCreatingRope: true,
        ...borderCoordinates,
      });
    } else if (rope.isCreatingRope && borderCoordinates) {
      if (rope.startX !== borderCoordinates.endX)
        setCreatedRopes((prevRopes) => [
          ...prevRopes,
          {
            id: new Date().getTime(),
            startX: rope.startX,
            startY: rope.startY,
            endX: borderCoordinates.endX,
            endY: borderCoordinates.endY,
          },
        ]);
      setRope(initialStateRope);
    } else {
      // Deselect when clicking an empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) setIsSelected(null);
    }
  };

  return (
    <div className="my-5 flex justify-center">
      <Stage
        ref={stageRef}
        className="w-[1400px] border-2 border-stone-700"
        onMouseDown={handleClickStage}
        onTouchStart={handleClickStage}
        onMouseMove={handleMouseMove}
        width={1400}
        height={680}
      >
        <Layer>
          {createdRopes.length > 0 &&
            createdRopes.map((rope, i) => (
              <Rope
                key={i}
                addClipper={addClipper}
                rope={{ ...rope, created: true }}
              />
            ))}

          {photos.map((photo) => (
            <URLImage
              key={photo.id}
              id={photo.id}
              isSelected={isSelected === photo.id}
              setIsSelected={setIsSelected}
              src={photo.src}
              x={photo.x}
              y={photo.y}
              moveToTop={moveToTop}
              setClipperAsAttached={setClipperAsAttached}
            />
          ))}
          {rope.isCreatingRope && <Rope addClipper={addClipper} rope={rope} />}
          {clippers.map((clipper, i) => (
            <Clipper key={i} options={clipper} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;

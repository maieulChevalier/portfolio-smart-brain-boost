import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="center">
      <div className="absolute pa2">
        <img
          id="inputimage"
          alt=""
          src={imageUrl}
          className="w-100 h-auto br1"
          style={{ maxWidth: "500px" }}
        />
        {boxes.map((box) => (
          <div
            key={`box${box.topRow}${box.rightCol}`}
            className="bounding-box"
            style={{
              top: box.topRow,
              right: box.rightCol,
              bottom: box.bottomRow,
              left: box.leftCol,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FaceRecognition;

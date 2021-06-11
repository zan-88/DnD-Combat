import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { storage, db } from "../firebase";

export default function ToolBar({
  tokenPosition,
  toolPosition,
  setActiveToken,
  editState,
  setEditState,
}) {
  const [prevEvent, setPrevEvent] = useState(null);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  function importAll(r) {
    return r.keys().map(r);
  }

  const images = importAll(
    require.context("../../public/tokens", false, /\.(png|jpe?g|svg)$/)
  );

  function handleActiveToken(event) {
    setActiveToken(event.target.src);
    setEditState(0);
    event.target.style.opacity = "0.5";
    if (prevEvent !== null) prevEvent.target.style.opacity = "1";
    setPrevEvent(event);
  }

  function handleEditStateMove(event) {
    setEditState(1);
    setActiveToken("");
    event.target.style.opacity = "0.5";
    if (prevEvent !== null) prevEvent.target.style.opacity = "1";
    setPrevEvent(event);
  }

  function handleEditStateDel(event) {
    setEditState(2);
    setActiveToken("");
    event.target.style.opacity = "0.5";
    if (prevEvent !== null) prevEvent.target.style.opacity = "1";
    setPrevEvent(event);
  }

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`map/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("map")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
            db.collection("map")
              .doc("link")
              .set({
                map: url,
              })
              .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
              })
              .catch((error) => {
                console.error("Error adding document: ", error);
              });
          });
      }
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          left: tokenPosition.x,
          top: tokenPosition.y,
          overflow: "hidden",
          position: "absolute",
          border: "1px solid black",
          backgroundColor: "white",
          width: "30%",
          height: "100px",
          zIndex: "1000",
        }}
      >
        <img
          id="tokenHandle"
          src="/comTokens/drag-handle.png"
          alt="handle"
          style={{ width: "40px", height: "40px" }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            overflowY: "hidden",
            overflowX: "scroll",
            minHeight: "min-content",
            flexGrow: "3",
          }}
        >
          {images.map((image) => (
            <Token>
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  margin: "10px",
                }}
                onClick={handleActiveToken.bind(this)}
                src={image.default}
                alt="test"
              />
            </Token>
          ))}
        </div>
        {/*<div
          style={{
            display: "flex",
            flexGrow: "1",
            flexDirection: "column",
            width: "40%",
          }}
        >
          <input type="file" name="input" id="input" onChange={handleChange} />
          <button onClick={handleUpload}>Upload</button>
        </div> */}
        <img
          id="exitToken"
          src="/comTokens/exit.png"
          alt="x"
          style={{ width: "40px", height: "40px" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          left: toolPosition.x,
          top: toolPosition.y,
          overflow: "hidden",
          position: "absolute",
          border: "1px solid black",
          backgroundColor: "white",
          width: "300px",
          height: "100px",
          zIndex: "1000",
        }}
      >
        <img
          id="toolHandle"
          src="/comTokens/toolImg.png"
          alt="handle"
          style={{ width: "40px", height: "40px" }}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            position: "relative",
            overflowX: "scroll",
            minHeight: "min-content",
          }}
        >
          <Token
            onClick={handleEditStateMove.bind(this)}
            style={{
              marginTop: "15px",
              marginLeft: "15px",
              background: `url(/comTokens/navToken.png) no-repeat`,
              backgroundRepeat: "no-repeat",
              boxSizing: "border-box",
              backgroundSize: "cover",
              width: "50px",
              height: "50px",
            }}
          />
          <Token
            onClick={handleEditStateDel.bind(this)}
            style={{
              marginTop: "15px",
              marginLeft: "15px",
              background: `url(/comTokens/delToken.png) no-repeat`,
              backgroundRepeat: "no-repeat",
              boxSizing: "border-box",
              backgroundSize: "cover",
              width: "50px",
              height: "50px",
            }}
          />
        </div>
        <img
          id="exitTool"
          src="/comTokens/exit.png"
          alt="x"
          style={{ width: "40px", height: "40px" }}
        />
      </div>
    </>
  );
}

const Token = styled.div`
  &:hover {
    opacity: 0.5;
  }
`;

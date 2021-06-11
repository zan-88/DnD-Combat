import React, { useState, useEffect } from "react";
import "./App.css";
import Map from "./components/Map";
import ToolBar from "./components/ToolBar";
import useDraggable from "./hooks/use-draggable";
import { storage, db } from "./firebase";

export default function App() {
  const [activeToken, setActiveToken] = useState("");
  const [editState, setEditState] = useState(0);

  const { position: tokenPosition } = useDraggable("tokenHandle", "exitToken");
  const { position: toolPosition } = useDraggable("toolHandle", "exitTool");
  document.body.style.overflow = "hidden";

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const img = new Image();

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
            img.src = url;
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

  useEffect(() => {
    db.collection("map")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //setUrl(doc.data());
        });
      });
  }, []);

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: "56.25%",
        height: "0",
        backgroundColor: "grey",
        overflow: "hidden",
        border: "1px solid black",
        zIndex: "100",
        overflowY: "hidden",
      }}
    >
      <ToolBar
        tokenPosition={tokenPosition}
        toolPosition={toolPosition}
        editState={editState}
        setActiveToken={setActiveToken}
        setEditState={setEditState}
      />
      {url !== "" ? (
        <Map
          activeToken={activeToken}
          setActiveToken={setActiveToken}
          editState={editState}
          setEditState={setEditState}
          url={url}
          img={img}
        />
      ) : (
        <>
          <input type="file" name="input" id="input" onChange={handleChange} />
          <button onClick={handleUpload}>Upload</button>
        </>
      )}
    </div>
  );
}

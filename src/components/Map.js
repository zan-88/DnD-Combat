import React, { Component, useEffect, useState } from "react";

export default function Map({
  activeToken,
  setActiveToken,
  editState,
  setEditState,
  url,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  let tileDim = 32;
  const winWidth = window.outerWidth;
  const winHeight = window.innerHeight;
  const [tiles, setTiles] = useState([]);
  const [prevEvent, setPrevEvent] = useState(null);
  let img = new Image();
  img.onload = function () {
    setIsLoaded(true);
  };
  img.src = url;
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (winWidth - width < winHeight - height) {
    width = winWidth;
    height = (width * height) / img.naturalWidth;
  } else {
    height = winHeight;
    width = (height * width) / img.naturalHeight;
  }
  const loc = {
    x: winWidth / 2 - width / 2,
    y: winHeight / 2 - height / 2,
  };

  tileDim = (width * tileDim) / img.naturalWidth;
  useEffect(() => {
    const _tiles = [];
    let id = 0;

    for (let x = loc.x; x < Math.floor(loc.x + width); x += tileDim) {
      const row = [];
      for (let y = loc.y; y < Math.floor(loc.y + height); y += tileDim) {
        row.push({
          x: x,
          y: y,
          id: id++,
        });
      }
      _tiles.push(row);
    }
    setTiles(_tiles);
  }, [isLoaded]);

  function handleHover(event) {
    event.target.style.backgroundColor = "rgba(255,255,255,0.5)";
  }

  function handleLeave(event) {
    event.target.style.backgroundColor = "rgba(255,255,255,0)";
  }

  function handleTokenEvent(event) {
    if (editState === 0) {
      event.target.style.background = `url(${activeToken}) no-repeat`;
      event.target.style.backgroundSize = "cover";
      event.target.style.backgroundRepeat = "no-repeat";
    } else if (editState === 1 && event.target.style.backgroundImage !== "") {
      setPrevEvent(event);
      setActiveToken(event.target.style.backgroundImage);
      console.log(activeToken);
      setEditState(3);
    } else if (editState === 2) {
      event.target.style.background = "";
    } else {
      if (activeToken !== "") {
        let temp = activeToken.split("/");
        temp = temp[temp.length - 1].split(".");
        let tempStr = temp[0] + ".";
        tempStr = tempStr.concat("png");
        console.log(tempStr);
        event.target.style.background = `url(/tokens/${tempStr}) no-repeat`;
        event.target.style.backgroundSize = "cover";
        event.target.style.backgroundRepeat = "no-repeat";
        prevEvent.target.style.background = "";
        setActiveToken("");
        setEditState(1);
      }
    }
  }

  return (
    <div
      id="map"
      style={{
        position: "absolute",
        backgroundRepeat: "no-repeat",
        boxSizing: "border-box",
        background: `url(${img.src}) no-repeat center fixed`,
        backgroundSize: "contain",
        width: "100%",
        height: "100%",
      }}
    >
      {tiles.map((row) => (
        <div
          key={row[0].id}
          style={{
            display: "flex",
          }}
        >
          {row.map((tile) => (
            <div>
              <div
                key={tile.id}
                onClick={handleTokenEvent.bind(this)}
                style={{
                  position: "fixed",

                  zIndex: "1",
                  top: tile.y,
                  left: `${tile.x}px`,
                  borderLeft: "1px solid rgba(0,0,0,0.2)",
                  borderBottom: "1px solid rgba(0,0,0,0.2)",
                  width: `${tileDim}px`,
                  height: `${tileDim}px`,
                }}
              >
                <div
                  onMouseOver={handleHover.bind(this)}
                  onMouseLeave={handleLeave.bind(this)}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255,255,255,0)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

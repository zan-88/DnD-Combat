import React, { Component, useEffect, useState } from "react";
import Token from "./Token";

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
  const [prevEvent, setPrevEvent] = useState(0);
  const [prevTile, setPrevTile] = useState(null);
  const [tokens, setTokens] = useState([]);
  let img = new Image();
  img.onload = function () {
    setIsLoaded(true);
  };
  img.src = url;
  let width = img.naturalWidth;
  let height = img.naturalHeight;
  const rowCount = height / tileDim;
  const colCount = width / tileDim;

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

    for (let x = 0; x < colCount; x += 1) {
      const row = [];
      for (let y = 0; y < rowCount; y += 1) {
        row.push({
          x: loc.x + tileDim * x,
          y: loc.y + tileDim * y,
          id: id++,
          isActive: false,
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

  function handleTokenEvent(tile, event) {
    let index = tokens.findIndex((ind) => ind.id === tile.id);
    let array = tokens;
    //Place new Token
    if (editState === 0 && !tile.isActive && activeToken !== "") {
      let sizeMod = document.getElementById("tokenSize").value;
      sizeMod = sizeMod === "" ? 1 : parseInt(sizeMod);
      console.log(tile.id);
      setTokens([
        ...tokens,
        {
          img: activeToken,
          x: tile.x,
          y: tile.y,
          dim: tileDim * sizeMod,
          id: tile.id,
          size: sizeMod,
        },
      ]);
      tile.isActive = true;
    } //Pick up Token
    else if (editState === 1 && tile.isActive) {
      setPrevEvent(index);
      console.log(tokens[index]);
      console.log(tile);
      setPrevTile(tile);
      setActiveToken(tokens[index].img);
      setEditState(3);
    } //Delete Token
    else if (editState === 2 && tile.isActive) {
      console.log(index + "ind");
      array.splice(index, 1);
      setTokens([...array]);
      tile.isActive = false;
    } //Place Token
    else if (editState === 3 && !tile.isActive) {
      if (activeToken !== "") {
        let size = tokens[prevEvent].size;
        let token = tokens[prevEvent];
        array.splice(prevEvent, 1);
        setTokens(array);
        let tokId = token.id;
        console.log(tokId);
        let row = Math.floor(tokId / rowCount);
        let col = tokId - row * rowCount;
        console.log("id" + tokId);
        console.log("row:" + row + "col: " + col);
        tiles[row][col].isActive = false;
        setTokens([
          ...tokens,
          {
            img: activeToken,
            x: tile.x,
            y: tile.y,
            dim: tileDim * size,
            id: tile.id,
            size: size,
          },
        ]);
        tile.isActive = true;
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
                onClick={handleTokenEvent.bind(this, tile)}
                style={{
                  position: "fixed",

                  zIndex: "100",
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
      {tokens.map((token) => (
        <Token key={token.id} token={token} />
      ))}
    </div>
  );
}

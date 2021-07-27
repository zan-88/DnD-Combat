import React from "react";

export default function Token({ token }) {
  return (
    <div
      style={{
        position: "absolute",
        background: `url(${token.img})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: "10",
        top: `${token.y}px`,
        left: `${token.x}px`,
        width: `${token.dim}px`,
        height: `${token.dim}px`,
      }}
    />
  );
}
